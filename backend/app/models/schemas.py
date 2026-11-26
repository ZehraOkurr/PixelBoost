from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum
from datetime import datetime

class JobStatusEnum(str, Enum):
    QUEUED = "queued"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class ImageStatusEnum(str, Enum):
    QUEUED = "queued"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class UploadedImageInfo(BaseModel):
    id: str
    filename: str
    original_name: str
    file_size: int
    width: int
    height: int
    format: str
    preview_url: str
    created_at: datetime

class EnhanceRequest(BaseModel):
    image_ids: List[str] = Field(..., min_items=1, description="List of uploaded image IDs to upscale")
    scale: int = Field(4, description="Upscale multiplier: 2 or 4")
    model_name: str = Field("realesrgan-x4plus", description="Model: 'realesrgan-x4plus' or 'realesrgan-x4plus-anime'")
    output_format: str = Field("png", description="Output format: 'png' or 'jpg'")
    min_height: Optional[int] = Field(None, ge=1, le=8192, description="Minimum output height in pixels (aspect ratio is preserved)")

class ImageResult(BaseModel):
    id: str
    original_image_id: str
    original_name: str
    original_width: int
    original_height: int
    original_size: int
    enhanced_width: Optional[int] = None
    enhanced_height: Optional[int] = None
    enhanced_size: Optional[int] = None
    original_url: str
    enhanced_url: Optional[str] = None
    scale: int
    model_name: str
    status: ImageStatusEnum
    error: Optional[str] = None
    processing_time_ms: Optional[int] = None

class JobResponse(BaseModel):
    job_id: str
    status: JobStatusEnum
    total_images: int
    completed_images: int
    failed_images: int
    progress_percent: int
    created_at: datetime
    finished_at: Optional[datetime] = None
    images: List[ImageResult]
    error: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    engine_available: bool
    engine_path: str
    models_available: List[str]
    gpu_info: str
    vulkan_supported: bool
    system_time: str
