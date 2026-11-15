import uuid
import shutil
from pathlib import Path
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from fastapi.responses import FileResponse
from app.core.config import settings
from app.core.security import sanitize_filename, validate_image_file, safe_path
from app.models.schemas import UploadedImageInfo
from app.services.job_manager import job_manager

router = APIRouter(tags=["Upload"])

@router.post("/upload", response_model=List[UploadedImageInfo])
async def upload_images(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No files uploaded."
        )

    if len(files) > settings.MAX_BATCH_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Maximum {settings.MAX_BATCH_SIZE} images can be uploaded in a single batch."
        )

    max_bytes = settings.UPLOAD_MAX_SIZE_MB * 1024 * 1024
    results: List[UploadedImageInfo] = []

    for file in files:
        # Check original extension
        clean_original_name = sanitize_filename(file.filename or "uploaded_image.png")
        ext = Path(clean_original_name).suffix.lower()

        if ext not in settings.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail=f"File '{clean_original_name}' has an unsupported extension ({ext}). Allowed: {', '.join(settings.ALLOWED_EXTENSIONS)}"
            )

        image_id = str(uuid.uuid4())
        safe_saved_filename = f"{image_id}{ext}"
        destination_path = safe_path(settings.UPLOAD_DIR, safe_saved_filename)

        # Write uploaded bytes to disk
        try:
            with open(destination_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save file: {str(e)}"
            )

        # Validate image headers and content
        try:
            detected_format, width, height, file_size = validate_image_file(destination_path, max_bytes)
        except HTTPException as e:
            # Clean up invalid file
            if destination_path.exists():
                destination_path.unlink()
            raise e

        # Register in job manager
        info = job_manager.register_uploaded_image(
            image_id=image_id,
            filename=safe_saved_filename,
            original_name=clean_original_name,
            file_path=destination_path,
            file_size=file_size,
            width=width,
            height=height,
            format_name=detected_format
        )
        results.append(info)

    return results

@router.get("/preview/{image_id}")
async def get_image_preview(image_id: str):
    image_path = job_manager.get_image_path(image_id)
    if not image_path or not image_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found."
        )

    ext = image_path.suffix.lower()
    media_type = "image/png"
    if ext in [".jpg", ".jpeg"]:
        media_type = "image/jpeg"
    elif ext == ".webp":
        media_type = "image/webp"

    return FileResponse(image_path, media_type=media_type)
