"""initial tables

Revision ID: 001_initial
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '001_initial'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── projects table ─────────────────────────────────────────────────────────
    op.create_table(
        'projects',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, default=sa.text('gen_random_uuid()')),
        sa.Column('owner_id', sa.String(255), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('expected_users', sa.String(100), nullable=True),
        sa.Column('budget', sa.String(100), nullable=True),
        sa.Column('region', sa.String(100), nullable=True),
        sa.Column('availability_requirement', sa.String(100), nullable=True),
        sa.Column('database_needs', sa.String(255), nullable=True),
        sa.Column('storage_needs', sa.String(255), nullable=True),
        sa.Column('auth_method', sa.String(100), nullable=True),
        sa.Column('status', sa.String(50), nullable=True, default='draft'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_projects_owner_id', 'projects', ['owner_id'])

    # ── architectures table ────────────────────────────────────────────────────
    op.create_table(
        'architectures',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False, default=sa.text('gen_random_uuid()')),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('owner_id', sa.String(255), nullable=False),
        sa.Column('tier', sa.String(50), nullable=False),
        sa.Column('services', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('total_monthly_cost_usd', sa.Float(), nullable=False),
        sa.Column('security_recommendations', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('deployment_steps', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('diagram_nodes', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('diagram_edges', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_architectures_owner_id', 'architectures', ['owner_id'])
    op.create_index('ix_architectures_project_id', 'architectures', ['project_id'])


def downgrade() -> None:
    op.drop_index('ix_architectures_project_id', table_name='architectures')
    op.drop_index('ix_architectures_owner_id', table_name='architectures')
    op.drop_table('architectures')
    op.drop_index('ix_projects_owner_id', table_name='projects')
    op.drop_table('projects')
