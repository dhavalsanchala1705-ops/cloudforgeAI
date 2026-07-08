from fastapi import APIRouter
from app.config import get_settings

router = APIRouter(tags=["Health"])
settings = get_settings()


@router.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "AI Cloud Architecture Generator",
        "version": "1.0.0",
        "environment": settings.environment,
    }
