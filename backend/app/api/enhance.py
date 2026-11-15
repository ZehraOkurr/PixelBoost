import asyncio
from typing import List
from fastapi import APIRouter, HTTPException, status, BackgroundTasks
from app.models.schemas import EnhanceRequest, JobResponse, ImageResult
from app.services.job_manager import job_manager

router = APIRouter(tags=["Enhancement"])

@router.post("/enhance", response_model=JobResponse)
async def start_enhancement(request: EnhanceRequest, background_tasks: BackgroundTasks):
    if not request.image_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="image_ids list cannot be empty."
        )

    # Validate scale
    if request.scale not in [2, 4]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Upscaling factor must be either 2 or 4."
        )

    # Check that images exist in repository
    missing_ids = [img_id for img_id in request.image_ids if not job_manager.get_uploaded_image(img_id)]
    if missing_ids:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Images not found for IDs: {', '.join(missing_ids)}"
        )

    # Create job in manager
    job = job_manager.create_job(request)

    # Trigger background task for sequential image processing
    background_tasks.add_task(job_manager.run_job_processing, job.job_id, request)

    return job

@router.get("/jobs/{job_id}", response_model=JobResponse)
async def get_job_status(job_id: str):
    job = job_manager.get_job(job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job with ID '{job_id}' not found."
        )
    return job

@router.get("/jobs/{job_id}/results", response_model=List[ImageResult])
async def get_job_results(job_id: str):
    job = job_manager.get_job(job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job with ID '{job_id}' not found."
        )
    return job.images

@router.delete("/jobs/{job_id}")
async def delete_job(job_id: str):
    job = job_manager.get_job(job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job with ID '{job_id}' not found."
        )
    job_manager.delete_job(job_id)
    return {"message": f"Job '{job_id}' and associated temporary files deleted successfully."}
