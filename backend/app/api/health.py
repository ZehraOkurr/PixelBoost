from datetime import datetime
from fastapi import APIRouter
from app.core.config import settings
from app.models.schemas import HealthResponse
from app.services.ai_engine import ai_engine_service

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse)
def get_health():
    ai_status = ai_engine_service.check_health()
    
    # Check GPU info via PyTorch / DX / OS if possible, or report configured GPU
    gpu_desc = f"Configured GPU Device: {settings.AI_GPU_ID} (NVIDIA GeForce RTX 4050 / Vulkan)"
    
    return HealthResponse(
        status="healthy",
        engine_available=ai_status["engine_available"],
        engine_path=ai_status["engine_path"],
        models_available=ai_status["models_available"],
        gpu_info=gpu_desc,
        vulkan_supported=True,
        system_time=datetime.utcnow().isoformat()
    )
