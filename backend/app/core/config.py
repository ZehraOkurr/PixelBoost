import os
from pathlib import Path
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "PixelBoost AI"
    API_V1_STR: str = "/api"
    DEBUG: bool = True
    
    # Base paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    PROJECT_ROOT: Path = BASE_DIR.parent
    
    # Storage directories
    UPLOAD_DIR: Path = BASE_DIR / "uploads"
    OUTPUT_DIR: Path = BASE_DIR / "outputs"
    TEMP_DIR: Path = BASE_DIR / "temp"
    
    # AI Engine configuration
    AI_ENGINE_PATH: str = str(PROJECT_ROOT / "ai-engine" / "realesrgan-ncnn-vulkan.exe")
    AI_MODELS_PATH: str = str(PROJECT_ROOT / "ai-engine" / "models")
    AI_GPU_ID: int = 1  # 1: NVIDIA GeForce RTX 4050, 0: Intel UHD, -1: CPU
    
    # Upload limits
    UPLOAD_MAX_SIZE_MB: int = 50
    MAX_BATCH_SIZE: int = 20
    JOB_TIMEOUT_SECONDS: int = 600
    AUTO_CLEANUP_HOURS: int = 24
    
    # Allowed formats
    ALLOWED_EXTENSIONS: set = {".jpg", ".jpeg", ".png", ".webp"}
    ALLOWED_MIME_TYPES: set = {"image/jpeg", "image/png", "image/webp"}

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

# Ensure directories exist
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
settings.OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
settings.TEMP_DIR.mkdir(parents=True, exist_ok=True)
