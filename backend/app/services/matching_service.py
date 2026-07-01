from __future__ import annotations
import logging
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.ai.feature_builder import UserFeatureInput
from app.ai.recommender import MatchScore, recommender
from app.models.match import Match
from app.models.profile import Profile
from app.models.schedule import Schedule
from app.models.subject import UserSubject
from app.models.user import User
from app.schemas.matching import FactorBreakdown, MatchResult

logger = logging.getLogger(__name__)

async def _load_input(user_id: UUID, db: AsyncSession) -> UserFeatureInput | None:
    result = await db.execute(
        select(User).options(selectinload(User.profile),
            selectinload(User.user_subjects).selectinload(UserSubject.subject),
            selectinload(User.schedules))
        .where(User.id == user_id, User.is_active == True))
    user: User | None = result.scalar_one_or_none()
    if not user: return None
    subjects = [us.subject.name for us in user.user_subjects if us.subject]
    schedule = [(s.day_of_week, s.time_slot) for s in user.schedules]
    p: Profile | None = user.profile
    return UserFeatureInput(user_id=user.id, subjects=subjects, schedule=schedule,
        learning_style=p.learning_style if p else None, academic_goal=p.academic_goal if p else None,
        gpa=float(user.gpa) if user.gpa else None)

async def rebuild_index(db: AsyncSession) -> int:
    result = await db.execute(
        select(User).options(selectinload(User.profile),
            selectinload(User.user_subjects).selectinload(UserSubject.subject),
            selectinload(User.schedules))
        .where(User.is_active == True))
    users = result.scalars().all()
    inputs = []
    for user in users:
        subjects = [us.subject.name for us in user.user_subjects if us.subject]
        schedule = [(s.day_of_week, s.time_slot) for s in user.schedules]
        p: Profile | None = user.profile
        inputs.append(UserFeatureInput(user_id=user.id, subjects=subjects, schedule=schedule,
            learning_style=p.learning_style if p else None, academic_goal=p.academic_goal if p else None,
            gpa=float(user.gpa) if user.gpa else None))
    recommender.fit(inputs)
    return len(inputs)

async def get_recommendations(current_user: User, db: AsyncSession, limit=20, offset=0) -> list[MatchResult]:
    query_input = await _load_input(current_user.id, db)
    if not query_input: return []
    if recommender._knn is None:
        await rebuild_index(db)
    raw: list[MatchScore] = recommender.recommend(query_input, top_k=limit+offset)
    raw = raw[offset:]
    if not raw: return []
    candidate_ids = [s.candidate_id for s in raw]
    ures = await db.execute(select(User).options(selectinload(User.profile),
        selectinload(User.user_subjects).selectinload(UserSubject.subject)).where(User.id.in_(candidate_ids)))
    users_map: dict[UUID, User] = {u.id: u for u in ures.scalars().all()}
    mres = await db.execute(select(Match).where((Match.user_id_a == current_user.id) | (Match.user_id_b == current_user.id)))
    existing: dict[UUID, str] = {}
    for m in mres.scalars().all():
        other = m.user_id_b if m.user_id_a == current_user.id else m.user_id_a
        existing[other] = m.status
    results = []
    for score in raw:
        user = users_map.get(score.candidate_id)
        if not user: continue
        tags = [us.subject.name for us in user.user_subjects if us.subject]
        results.append(MatchResult(user_id=user.id, full_name=user.full_name, university=user.university,
            major=user.major, gpa=float(user.gpa) if user.gpa else None,
            avatar_url=user.profile.avatar_url if user.profile else None,
            tags=tags[:5], score=score.total_score,
            factors=FactorBreakdown(subject_score=score.subject_score, schedule_score=score.schedule_score,
                style_score=score.style_score, goal_score=score.goal_score, gpa_score=score.gpa_score),
            status=existing.get(user.id, "suggested")))
    return results

async def get_compatibility_score(current_user: User, target_id: UUID, db: AsyncSession) -> MatchResult | None:
    a = await _load_input(current_user.id, db)
    b = await _load_input(target_id, db)
    if not a or not b: return None
    score = recommender.score_pair(a, b)
    tres = await db.execute(select(User).options(selectinload(User.profile),
        selectinload(User.user_subjects).selectinload(UserSubject.subject)).where(User.id == target_id))
    target: User | None = tres.scalar_one_or_none()
    if not target: return None
    tags = [us.subject.name for us in target.user_subjects if us.subject]
    return MatchResult(user_id=target.id, full_name=target.full_name, university=target.university,
        major=target.major, gpa=float(target.gpa) if target.gpa else None,
        avatar_url=target.profile.avatar_url if target.profile else None,
        tags=tags[:5], score=score.total_score,
        factors=FactorBreakdown(subject_score=score.subject_score, schedule_score=score.schedule_score,
            style_score=score.style_score, goal_score=score.goal_score, gpa_score=score.gpa_score),
        status="suggested")

async def send_connect_request(current_user: User, target_id: UUID, db: AsyncSession) -> Match:
    uid_a = min(current_user.id, target_id)
    uid_b = max(current_user.id, target_id)
    result = await db.execute(select(Match).where(Match.user_id_a == uid_a, Match.user_id_b == uid_b))
    match: Match | None = result.scalar_one_or_none()
    if match is None:
        a = await _load_input(current_user.id, db)
        b = await _load_input(target_id, db)
        s = recommender.score_pair(a, b) if a and b else None
        match = Match(user_id_a=uid_a, user_id_b=uid_b,
            score=s.total_score if s else 0.0,
            subject_score=s.subject_score if s else None, schedule_score=s.schedule_score if s else None,
            style_score=s.style_score if s else None, goal_score=s.goal_score if s else None,
            gpa_score=s.gpa_score if s else None, status="pending", initiated_by=current_user.id)
        db.add(match)
    else:
        if match.status == "pending" and match.initiated_by != current_user.id:
            match.status = "connected"
        elif match.status == "suggested":
            match.status = "pending"; match.initiated_by = current_user.id
    return match
