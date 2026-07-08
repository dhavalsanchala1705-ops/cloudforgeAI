from pydantic import BaseModel
from typing import Optional, List, Any
from uuid import UUID
from datetime import datetime


class ServiceItem(BaseModel):
    name: str
    aws_service: str
    tier: str
    rationale: str
    monthly_cost_usd: float
    icon: str


class ArchitectureResponse(BaseModel):
    id: UUID
    project_id: UUID
    tier: str
    services: List[ServiceItem]
    total_monthly_cost_usd: float
    security_recommendations: List[str]
    deployment_steps: List[str]
    diagram_nodes: Optional[List[Any]]
    diagram_edges: Optional[List[Any]]
    created_at: datetime

    class Config:
        from_attributes = True
