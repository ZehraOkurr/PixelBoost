import os
import re
from pathlib import Path
from typing import Tuple
from PIL import Image
from fastapi import HTTPException, status
from app.core.config import settings

def sanitize_filename(filename: str) -> str:
    """Strip dangerous characters and directory traversals."""
    name = os.path.basename(filename)
    # Remove any non-alphanumeric chars except dots, dashes, underscores
    clean = re.sub(r'[^a-zA-Z0-9_.-]', '_', name)
    return clean or "uploaded_image"

def validate_image_file(file_path: Path, max_size_bytes: int) -> Tuple[str, int, int, int]:
    """
    Validates actual image content using Pillow, verifies headers and integrity.
    Returns: (format, width, height, file_size)
    Raises: HTTPException if invalid
    """
    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File does not exist."
        )

    file_size = file_path.stat().st_size
    if file_size > max_size_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of {max_size_bytes // (1024*1024)}MB."
        )

    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )

    try:
        with Image.open(file_path) as img:
            img.verify()  # Verifies image header & integrity
            image_format = (img.format or "").upper()
            width, height = img.size

        # Verify extension vs detected format
        valid_formats = {"JPEG", "PNG", "WEBP"}
        if image_format not in valid_formats:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail=f"Unsupported image format: {image_format}. Only JPG, PNG, and WEBP are permitted."
            )

        return image_format, width, height, file_size
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Corrupt or invalid image file: {str(e)}"
        )

def safe_path(base_dir: Path, target_filename: str) -> Path:
    """Ensures that the resolved target path is strictly within the allowed base directory."""
    resolved_base = base_dir.resolve()
    resolved_target = (base_dir / target_filename).resolve()
    if not str(resolved_target).startswith(str(resolved_base)):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Path traversal attempt detected."
        )
    return resolved_target
