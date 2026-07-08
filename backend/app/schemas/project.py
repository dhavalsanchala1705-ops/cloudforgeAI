from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime


class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=10, max_length=5000)


class ProjectQuestionsUpdate(BaseModel):
    expected_users: str = Field(
        ..., description="e.g. '<1000', '1000-10000', '>100000'"
    )
    budget: str = Field(
        ...,
        description="e.g. 'minimal (<$100/mo)', 'moderate ($100-1000/mo)', 'large (>$1000/mo)'",
    )
    region: str = Field(..., description="e.g. 'us-east-1', 'eu-west-1'")
    availability_requirement: str = Field(
        ..., description="e.g. '99.9%', '99.99%', 'best-effort'"
    )
    database_needs: str = Field(
        ..., description="e.g. 'relational', 'nosql', 'both', 'none'"
    )
    storage_needs: str = Field(
        ..., description="e.g. 'none', 'small (<10GB)', 'large (>1TB)'"
    )
    auth_method: str = Field(
        ..., description="e.g. 'email/password', 'social OAuth', 'enterprise SSO'"
    )


class ProjectResponse(BaseModel):
    id: UUID
    name: str
    description: str
    expected_users: Optional[str]
    budget: Optional[str]
    region: Optional[str]
    availability_requirement: Optional[str]
    database_needs: Optional[str]
    storage_needs: Optional[str]
    auth_method: Optional[str]
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
