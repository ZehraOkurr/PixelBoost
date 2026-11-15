import asyncio
import uuid
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional
from app.core.config import settings
from app.models.schemas import (
    UploadedImageInfo,
    EnhanceRequest,
    JobResponse,
    ImageResult,
    JobStatusEnum,
    ImageStatusEnum,
)
from app.services.ai_engine import ai_engine_service
from app.services.file_service import file_service

class JobManager:
    def __init__(self):
        # In-memory storage for images and jobs
        self.uploaded_images: Dict[str, UploadedImageInfo] = {}
        self.image_paths: Dict[str, Path] = {}
        self.jobs: Dict[str, JobResponse] = {}
        self.job_output_paths: Dict[str, Dict[str, Path]] = {}  # job_id -> {image_id: enhanced_path}
        self.queue_lock = asyncio.Lock()

    def register_uploaded_image(
        self,
        image_id: str,
        filename: str,
        original_name: str,
        file_path: Path,
        file_size: int,
        width: int,
        height: int,
        format_name: str
    ) -> UploadedImageInfo:
        preview_url = f"/api/preview/{image_id}"
        info = UploadedImageInfo(
            id=image_id,
            filename=filename,
            original_name=original_name,
            file_size=file_size,
            width=width,
            height=height,
            format=format_name,
            preview_url=preview_url,
            created_at=datetime.utcnow()
        )
        self.uploaded_images[image_id] = info
        self.image_paths[image_id] = file_path
        return info

    def get_uploaded_image(self, image_id: str) -> Optional[UploadedImageInfo]:
        return self.uploaded_images.get(image_id)

    def get_image_path(self, image_id: str) -> Optional[Path]:
        return self.image_paths.get(image_id)

    def get_job(self, job_id: str) -> Optional[JobResponse]:
        return self.jobs.get(job_id)

    def create_job(self, request: EnhanceRequest) -> JobResponse:
        job_id = str(uuid.uuid4())
        image_results: List[ImageResult] = []

        for img_id in request.image_ids:
            img_info = self.uploaded_images.get(img_id)
            if img_info:
                result = ImageResult(
                    id=str(uuid.uuid4()),
                    original_image_id=img_id,
                    original_name=img_info.original_name,
                    original_width=img_info.width,
                    original_height=img_info.height,
                    original_size=img_info.file_size,
                    original_url=img_info.preview_url,
                    scale=request.scale,
                    model_name=request.model_name,
                    status=ImageStatusEnum.QUEUED
                )
                image_results.append(result)

        job = JobResponse(
            job_id=job_id,
            status=JobStatusEnum.QUEUED,
            total_images=len(image_results),
            completed_images=0,
            failed_images=0,
            progress_percent=0,
            created_at=datetime.utcnow(),
            images=image_results
        )

        self.jobs[job_id] = job
        self.job_output_paths[job_id] = {}
        return job

    async def run_job_processing(self, job_id: str, request: EnhanceRequest):
        """Processes images in a job sequentially in a background worker."""
        job = self.jobs.get(job_id)
        if not job:
            return

        job.status = JobStatusEnum.PROCESSING
        temp_dir = file_service.get_job_temp_dir(job_id)

        for idx, img_task in enumerate(job.images):
            img_task.status = ImageStatusEnum.PROCESSING
            input_path = self.image_paths.get(img_task.original_image_id)
            
            if not input_path or not input_path.exists():
                img_task.status = ImageStatusEnum.FAILED
                img_task.error = "Original image not found on disk."
                job.failed_images += 1
                job.progress_percent = int(((idx + 1) / job.total_images) * 100)
                continue

            # Determine output file path
            ext = request.output_format.lower()
            if ext not in ["png", "jpg"]:
                ext = "png"
            
            output_filename = f"{img_task.id}_enhanced.{ext}"
            output_path = temp_dir / output_filename

            # Run Real-ESRGAN in a separate thread to avoid blocking asyncio event loop
            success, err_msg, duration_ms = await asyncio.to_thread(
                ai_engine_service.enhance_image,
                input_path=input_path,
                output_path=output_path,
                scale=request.scale,
                model_name=request.model_name,
                output_format=ext,
                timeout_seconds=settings.JOB_TIMEOUT_SECONDS
            )

            img_task.processing_time_ms = duration_ms

            if success and output_path.exists():
                # Inspect enhanced dimensions and file size
                info = file_service.get_image_info(output_path)
                img_task.status = ImageStatusEnum.COMPLETED
                img_task.enhanced_width = info.get("width")
                img_task.enhanced_height = info.get("height")
                img_task.enhanced_size = info.get("size")
                img_task.enhanced_url = f"/api/download/{img_task.id}"
                
                # Register output path
                self.job_output_paths[job_id][img_task.id] = output_path
                job.completed_images += 1
            else:
                img_task.status = ImageStatusEnum.FAILED
                img_task.error = err_msg or "AI processing failed."
                job.failed_images += 1

            # Update progress percent
            job.progress_percent = int(((idx + 1) / job.total_images) * 100)

        # Mark job overall status
        job.finished_at = datetime.utcnow()
        if job.completed_images == job.total_images:
            job.status = JobStatusEnum.COMPLETED
        elif job.completed_images > 0:
            job.status = JobStatusEnum.COMPLETED  # Partial success
        else:
            job.status = JobStatusEnum.FAILED
            job.error = "All images failed to upscale."

    def get_enhanced_image_path(self, image_result_id: str) -> Optional[Path]:
        """Finds enhanced image path by its image task id across jobs."""
        for job_id, outputs in self.job_output_paths.items():
            if image_result_id in outputs:
                return outputs[image_result_id]
        return None

    def get_job_for_image_result(self, image_result_id: str) -> Optional[ImageResult]:
        for job in self.jobs.values():
            for img in job.images:
                if img.id == image_result_id:
                    return img
        return None

    def delete_job(self, job_id: str) -> bool:
        if job_id in self.jobs:
            del self.jobs[job_id]
        if job_id in self.job_output_paths:
            del self.job_output_paths[job_id]
        file_service.delete_job_files(job_id)
        return True

job_manager = JobManager()
