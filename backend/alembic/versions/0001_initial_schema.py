"""Initial schema

Revision ID: 0001
Revises:
Create Date: 2026-01-01
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table("users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(100), nullable=False),
        sa.Column("university", sa.String(150)), sa.Column("major", sa.String(100)),
        sa.Column("year_of_study", sa.SmallInteger()), sa.Column("gpa", sa.Numeric(3,2)),
        sa.Column("role", sa.String(20), server_default="student"),
        sa.Column("is_active", sa.Boolean(), server_default="true"),
        sa.Column("is_verified", sa.Boolean(), server_default="false"),
        sa.Column("last_seen", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("idx_users_email", "users", ["email"])
    op.create_table("profiles",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False),
        sa.Column("avatar_url", sa.String(500)), sa.Column("bio", sa.Text()),
        sa.Column("learning_style", sa.String(30)), sa.Column("academic_goal", sa.String(50)),
        sa.Column("availability", sa.String(20), server_default="flexible"),
        sa.Column("xp_points", sa.Integer(), server_default="0"),
        sa.Column("streak_days", sa.Integer(), server_default="0"),
        sa.Column("is_public", sa.Boolean(), server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_table("subjects",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(100), unique=True, nullable=False),
        sa.Column("category", sa.String(50)), sa.Column("code", sa.String(20), unique=True),
    )
    op.create_table("user_subjects",
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("subject_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("subjects.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("skill_level", sa.String(20), server_default="intermediate"),
        sa.Column("is_seeking", sa.Boolean(), server_default="true"),
    )
    op.create_table("schedules",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("day_of_week", sa.SmallInteger(), nullable=False),
        sa.Column("time_slot", sa.String(10), nullable=False),
        sa.UniqueConstraint("user_id","day_of_week","time_slot"),
    )
    op.create_index("idx_schedules_user","schedules",["user_id"])
    op.create_table("matches",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id_a", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE")),
        sa.Column("user_id_b", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE")),
        sa.Column("score", sa.Numeric(5,2), nullable=False),
        sa.Column("subject_score", sa.Numeric(5,2)), sa.Column("schedule_score", sa.Numeric(5,2)),
        sa.Column("style_score", sa.Numeric(5,2)), sa.Column("goal_score", sa.Numeric(5,2)),
        sa.Column("gpa_score", sa.Numeric(5,2)),
        sa.Column("status", sa.String(20), server_default="suggested"),
        sa.Column("initiated_by", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.CheckConstraint("user_id_a <> user_id_b", name="ck_match_no_self"),
    )
    op.create_index("idx_matches_user_a","matches",["user_id_a"])
    op.create_index("idx_matches_user_b","matches",["user_id_b"])
    op.create_table("study_groups",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(100), nullable=False), sa.Column("description", sa.Text()),
        sa.Column("icon", sa.String(10)),
        sa.Column("subject_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("subjects.id")),
        sa.Column("owner_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("max_members", sa.SmallInteger(), server_default="10"),
        sa.Column("next_session", sa.DateTime(timezone=True)),
        sa.Column("is_public", sa.Boolean(), server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_table("group_members",
        sa.Column("group_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("study_groups.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
        sa.Column("role", sa.String(20), server_default="member"),
        sa.Column("joined_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_table("conversations",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id_a", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id")),
        sa.Column("user_id_b", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.UniqueConstraint("user_id_a","user_id_b"),
    )
    op.create_table("messages",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("conversation_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("sender_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id")),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("message_type", sa.String(20), server_default="text"),
        sa.Column("is_read", sa.Boolean(), server_default="false"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("idx_messages_conv","messages",["conversation_id","created_at"])
    op.create_table("notifications",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("type", sa.String(40), nullable=False),
        sa.Column("title", sa.String(200), nullable=False), sa.Column("body", sa.Text()),
        sa.Column("data", postgresql.JSONB()),
        sa.Column("is_read", sa.Boolean(), server_default="false"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("idx_notifs_user","notifications",["user_id","is_read","created_at"])
    op.create_table("feedback",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("reviewer_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id")),
        sa.Column("reviewee_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id")),
        sa.Column("match_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("matches.id")),
        sa.Column("rating", sa.SmallInteger()), sa.Column("comment", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

def downgrade():
    for t in ["feedback","notifications","messages","conversations","group_members",
              "study_groups","matches","schedules","user_subjects","subjects","profiles","users"]:
        op.drop_table(t)
