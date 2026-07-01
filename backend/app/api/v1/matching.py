from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_current_user, get_db
from app.models.match import Match
from app.models.user import User
from app.schemas.matching import MatchResult, MatchStatusResponse, RecommendationsResponse
from app.services.matching_service import get_compatibility_score, get_recommendations, send_connect_request

router = APIRouter(prefix="/matching", tags=["matching"])

@router.get("/recommendations", response_model=RecommendationsResponse)
async def recommendations(limit: int = Query(20, le=50), offset: int = Query(0, ge=0),
                          db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    results = await get_recommendations(current_user, db, limit=limit, offset=offset)
    return RecommendationsResponse(total=len(results), results=results)

@router.get("/score/{target_user_id}", response_model=MatchResult)
async def compatibility_score(target_user_id: UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await get_compatibility_score(current_user, target_user_id, db)
    if not result:
        raise HTTPException(status_code=404, detail={"code": "USER_NOT_FOUND", "message": "Target user not found"})
    return result

@router.post("/connect/{target_user_id}", response_model=MatchStatusResponse)
async def connect(target_user_id: UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if target_user_id == current_user.id:
        raise HTTPException(status_code=400, detail={"code": "SELF_CONNECT", "message": "Cannot connect with yourself"})
    match = await send_connect_request(current_user, target_user_id, db)
    return MatchStatusResponse(match_id=match.id, status=match.status)

@router.get("/connections", response_model=list[MatchStatusResponse])
async def get_connections(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Match).where((Match.user_id_a == current_user.id) | (Match.user_id_b == current_user.id)))
    return [MatchStatusResponse(match_id=m.id, status=m.status) for m in result.scalars().all()]
