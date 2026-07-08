from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.auth.dependencies import get_current_user, CurrentUser
from app.models.architecture import Architecture
from app.schemas.architecture import ArchitectureResponse
from typing import List
from uuid import UUID

router = APIRouter(prefix="/architectures", tags=["Architectures"])


@router.get("/project/{project_id}", response_model=List[ArchitectureResponse])
async def get_project_architectures(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    result = await db.execute(
        select(Architecture)
        .where(
            Architecture.project_id == project_id,
            Architecture.owner_id == current_user.sub,
        )
        .order_by(Architecture.tier)
    )
    architectures = result.scalars().all()
    if not architectures:
        raise HTTPException(
            status_code=404, detail="No architectures found for this project"
        )
    return architectures
