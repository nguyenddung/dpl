from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.core.dependencies import get_current_user, get_db
from app.models.group import GroupMember, StudyGroup
from app.models.user import User
from app.schemas.group import GroupCreateRequest, GroupMemberResponse, GroupResponse

router = APIRouter(prefix="/groups", tags=["groups"])

def _to_response(group: StudyGroup, count: int) -> GroupResponse:
    return GroupResponse(id=group.id, name=group.name, description=group.description, icon=group.icon,
        owner_id=group.owner_id, max_members=group.max_members, next_session=group.next_session,
        is_public=group.is_public, member_count=count, created_at=group.created_at)

@router.get("/", response_model=list[GroupResponse])
async def list_groups(search: str | None = Query(None), limit: int = Query(20, le=50),
                      db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    stmt = select(StudyGroup).where(StudyGroup.is_public == True)
    if search: stmt = stmt.where(StudyGroup.name.ilike(f"%{search}%"))
    result = await db.execute(stmt.limit(limit))
    groups = result.scalars().all()
    responses = []
    for g in groups:
        cnt = (await db.execute(select(func.count()).select_from(GroupMember).where(GroupMember.group_id == g.id))).scalar_one()
        responses.append(_to_response(g, cnt))
    return responses

@router.post("/", response_model=GroupResponse, status_code=201)
async def create_group(req: GroupCreateRequest, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    group = StudyGroup(name=req.name, description=req.description, icon=req.icon,
        subject_id=req.subject_id, owner_id=current_user.id, max_members=req.max_members, is_public=req.is_public)
    db.add(group)
    await db.flush()
    db.add(GroupMember(group_id=group.id, user_id=current_user.id, role="owner"))
    return _to_response(group, 1)

@router.get("/{group_id}", response_model=GroupResponse)
async def get_group(group_id: UUID, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    result = await db.execute(select(StudyGroup).where(StudyGroup.id == group_id))
    group = result.scalar_one_or_none()
    if not group:
        raise HTTPException(status_code=404, detail={"code": "GROUP_NOT_FOUND"})
    cnt = (await db.execute(select(func.count()).select_from(GroupMember).where(GroupMember.group_id == group_id))).scalar_one()
    return _to_response(group, cnt)

@router.post("/{group_id}/join", response_model=GroupMemberResponse, status_code=201)
async def join_group(group_id: UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    from app.services.group_service import add_member, get_group_or_404
    group = await get_group_or_404(group_id, db)
    member = await add_member(group, current_user, db)
    return GroupMemberResponse(user_id=current_user.id, full_name=current_user.full_name, role=member.role, joined_at=member.joined_at)

@router.delete("/{group_id}/leave", status_code=204)
async def leave_group(group_id: UUID, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    from app.services.group_service import get_group_or_404, remove_member
    group = await get_group_or_404(group_id, db)
    await remove_member(group, current_user, db)

@router.get("/{group_id}/members", response_model=list[GroupMemberResponse])
async def list_members(group_id: UUID, db: AsyncSession = Depends(get_db), _: User = Depends(get_current_user)):
    result = await db.execute(select(GroupMember).options(selectinload(GroupMember.user)).where(GroupMember.group_id == group_id))
    return [GroupMemberResponse(user_id=m.user_id, full_name=m.user.full_name, role=m.role, joined_at=m.joined_at)
            for m in result.scalars().all()]
