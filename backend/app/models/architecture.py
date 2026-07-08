from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.database import Base
from datetime import datetime
import uuid


class Architecture(Base):
    __tablename__ = "architectures"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(
        UUID(as_uuid=True),
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
    )
    owner_id = Column(
        String(255), nullable=False, index=True
    )  # Cognito sub (denormalized for fast queries)
    tier = Column(String(50), nullable=False)  # startup, production, enterprise
    services = Column(JSONB, nullable=False, default=list)  # List of service objects
    total_monthly_cost_usd = Column(Float, nullable=False, default=0.0)
    security_recommendations = Column(JSONB, nullable=False, default=list)
    deployment_steps = Column(JSONB, nullable=False, default=list)
    diagram_nodes = Column(JSONB, nullable=True)  # React Flow nodes
    diagram_edges = Column(JSONB, nullable=True)  # React Flow edges
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="architectures")
