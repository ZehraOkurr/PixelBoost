import os
import shutil
import zipfile
from pathlib import Path
from typing import List, Optional
from PIL import Image
from app.core.config import settings

class FileService:
    def __init__(self):
        self.upload_dir = settings.UPLOAD_DIR
        self.output_dir = settings.OUTPUT_DIR
        self.temp_dir = settings.TEMP_DIR

    def get_job_temp_dir(self, job_id: str) -> Path:
        job_dir = self.temp_dir / job_id
        job_dir.mkdir(parents=True, exist_ok=True)
        return job_dir

    def get_image_info(self, image_path: Path) -> dict:
        """Returns width, height, format, and file size for an image."""
        if not image_path.exists():
            return {}
        size = image_path.stat().st_size
        with Image.open(image_path) as img:
            width, height = img.size
            img_format = img.format or "PNG"
        return {
            "width": width,
            "height": height,
            "format": img_format.lower(),
            "size": size
        }

    def create_batch_zip(self, job_id: str, image_files: List[dict]) -> Optional[Path]:
        """
        Creates a ZIP archive containing all successfully processed images for a job.
        image_files: List of dicts with keys: 'path' (Path), 'filename' (str)
        """
        if not image_files:
            return None

        zip_path = self.output_dir / f"pixelboost_batch_{job_id[:8]}.zip"
        
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zip_f:
            for item in image_files:
                file_path = item["path"]
                arcname = item.get("filename") or file_path.name
                if file_path.exists():
                    zip_f.write(file_path, arcname=arcname)

        return zip_path

    def delete_job_files(self, job_id: str):
        """Removes temporary job directory and associated batch zip."""
        job_dir = self.temp_dir / job_id
        if job_dir.exists():
            shutil.rmtree(job_dir, ignore_errors=True)

        zip_path = self.output_dir / f"pixelboost_batch_{job_id[:8]}.zip"
        if zip_path.exists():
            try:
                zip_path.unlink()
            except OSError:
                pass

file_service = FileService()
