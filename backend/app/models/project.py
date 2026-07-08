from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
from datetime import datetime
import uuid


class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(String(255), nullable=False, index=True)  # Cognito sub
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    # Clarifying question answers stored as JSON text
    expected_users = Column(String(100), nullable=True)
    budget = Column(String(100), nullable=True)
    region = Column(String(100), nullable=True)
    availability_requirement = Column(String(100), nullable=True)
    database_needs = Column(String(255), nullable=True)
    storage_needs = Column(String(255), nullable=True)
    auth_method = Column(String(100), nullable=True)
    status = Column(String(50), default="draft")  # draft, generating, ready, error
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    architectures = relationship(
        "Architecture", back_populates="project", cascade="all, delete-orphan"
    )
