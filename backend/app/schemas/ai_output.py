from pydantic import BaseModel, Field, field_validator
from typing import List


class AIServiceItem(BaseModel):
    name: str = Field(..., description="Human-readable service name")
    aws_service: str = Field(
        ..., description="AWS service identifier, e.g. 'Amazon EC2'"
    )
    tier: str = Field(..., description="startup | production | enterprise")
    rationale: str = Field(..., description="Why this service was chosen")
    monthly_cost_usd: float = Field(..., ge=0)
    icon: str = Field(..., description="Icon key, e.g. 'ec2', 'rds', 's3'")


class AIArchitectureTier(BaseModel):
    services: List[AIServiceItem]
    total_monthly_cost_usd: float = Field(..., ge=0)
    security_recommendations: List[str] = Field(..., min_length=1)
    deployment_steps: List[str] = Field(..., min_length=1)

    @field_validator("total_monthly_cost_usd", mode="before")
    @classmethod
    def compute_total(cls, v, info):
        return v


class AIOutputSchema(BaseModel):
    startup: AIArchitectureTier
    production: AIArchitectureTier
    enterprise: AIArchitectureTier
