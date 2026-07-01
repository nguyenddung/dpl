from uuid import UUID
from pydantic import BaseModel
class FactorBreakdown(BaseModel):
    subject_score: float
    schedule_score: float
    style_score: float
    goal_score: float
    gpa_score: float
class MatchResult(BaseModel):
    user_id: UUID
    full_name: str
    university: str | None
    major: str | None
    gpa: float | None
    avatar_url: str | None
    tags: list[str]
    score: float
    factors: FactorBreakdown
    status: str
class RecommendationsResponse(BaseModel):
    total: int
    results: list[MatchResult]
class MatchStatusResponse(BaseModel):
    match_id: UUID
    status: str
