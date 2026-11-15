from pathlib import Path
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse
from app.services.job_manager import job_manager
from app.services.file_service import file_service

router = APIRouter(tags=["Download"])

@router.get("/download/{image_id}")
async def download_image(image_id: str):
    image_path = job_manager.get_enhanced_image_path(image_id)
    if not image_path or not image_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enhanced image not found or processing failed."
        )

    task_result = job_manager.get_job_for_image_result(image_id)
    download_filename = image_path.name
    if task_result:
        # e.g. "photo_enhanced_4x.png"
        orig_stem = Path(task_result.original_name).stem
        download_filename = f"{orig_stem}_enhanced_{task_result.scale}x{image_path.suffix}"

    ext = image_path.suffix.lower()
    media_type = "image/png"
    if ext in [".jpg", ".jpeg"]:
        media_type = "image/jpeg"
    elif ext == ".webp":
        media_type = "image/webp"

    return FileResponse(
        image_path,
        media_type=media_type,
        filename=download_filename,
        content_disposition_type="inline"  # Allows preview in browser and download
    )

@router.get("/download-zip/{job_id}")
async def download_job_zip(job_id: str):
    job = job_manager.get_job(job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job with ID '{job_id}' not found."
        )

    successful_images = []
    for img in job.images:
        path = job_manager.get_enhanced_image_path(img.id)
        if path and path.exists():
            orig_stem = Path(img.original_name).stem
            save_name = f"{orig_stem}_enhanced_{img.scale}x{path.suffix}"
            successful_images.append({
                "path": path,
                "filename": save_name
            })

    if not successful_images:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No successfully enhanced images found in this job to package."
        )

    zip_file = file_service.create_batch_zip(job_id, successful_images)
    if not zip_file or not zip_file.exists():
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate ZIP archive."
        )

    return FileResponse(
        zip_file,
        media_type="application/zip",
        filename=f"PixelBoost_Batch_{job_id[:8]}.zip"
    )
