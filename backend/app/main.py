import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import health, upload, enhance, download
from app.services.ai_engine import ai_engine_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("PixelBoost")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup check
    logger.info("Initializing PixelBoost AI Backend...")
    health_info = ai_engine_service.check_health()
    if health_info["engine_available"]:
        logger.info(f"AI Engine detected at: {health_info['engine_path']}")
        logger.info(f"Detected models: {', '.join(health_info['models_available'])}")
    else:
        logger.warning(f"AI Engine not detected at: {health_info['engine_path']}")
    yield
    logger.info("PixelBoost AI Backend shutting down.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Locally runnable real AI image upscaling application using Real-ESRGAN Vulkan.",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local development with Vite
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(health.router, prefix=settings.API_V1_STR)
app.include_router(upload.router, prefix=settings.API_V1_STR)
app.include_router(enhance.router, prefix=settings.API_V1_STR)
app.include_router(download.router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {
        "app": "PixelBoost AI",
        "version": "1.0.0",
        "status": "online",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
