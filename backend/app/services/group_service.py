from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.group import GroupMember, StudyGroup
from app.models.notification import Notification
from app.models.user import User

async def get_member_count(group_id: UUID, db: AsyncSession) -> int:
    result = await db.execute(select(func.count()).select_from(GroupMember).where(GroupMember.group_id == group_id))
    return result.scalar_one()

async def get_group_or_404(group_id: UUID, db: AsyncSession) -> StudyGroup:
    result = await db.execute(select(StudyGroup).where(StudyGroup.id == group_id))
    group = result.scalar_one_or_none()
    if not group:
        raise HTTPException(status_code=404, detail={"code": "GROUP_NOT_FOUND", "message": f"Group {group_id} not found"})
    return group

async def user_is_member(group_id: UUID, user_id: UUID, db: AsyncSession) -> bool:
    result = await db.execute(select(GroupMember).where(GroupMember.group_id == group_id, GroupMember.user_id == user_id))
    return result.scalar_one_or_none() is not None

async def get_group_with_count(group_id: UUID, db: AsyncSession) -> tuple[StudyGroup, int]:
    group = await get_group_or_404(group_id, db)
    return group, await get_member_count(group_id, db)

async def add_member(group: StudyGroup, user: User, db: AsyncSession, role: str = "member") -> GroupMember:
    if await user_is_member(group.id, user.id, db):
        raise HTTPException(status_code=409, detail={"code": "ALREADY_MEMBER", "message": "Already in this group"})
    count = await get_member_count(group.id, db)
    if count >= group.max_members:
        raise HTTPException(status_code=400, detail={"code": "GROUP_FULL", "message": "Group is full"})
    member = GroupMember(group_id=group.id, user_id=user.id, role=role)
    db.add(member)
    if group.owner_id != user.id:
        db.add(Notification(user_id=group.owner_id, type="group_join",
                            title=f"{user.full_name} đã tham gia nhóm {group.name}",
                            data={"group_id": str(group.id), "user_id": str(user.id)}))
    await db.flush()
    return member

async def remove_member(group: StudyGroup, user: User, db: AsyncSession) -> None:
    result = await db.execute(select(GroupMember).where(GroupMember.group_id == group.id, GroupMember.user_id == user.id))
    member = result.scalar_one_or_none()
    if not member:
        raise HTTPException(status_code=404, detail={"code": "NOT_A_MEMBER", "message": "Not a member"})
    if member.role == "owner":
        raise HTTPException(status_code=400, detail={"code": "OWNER_CANNOT_LEAVE", "message": "Transfer ownership first"})
    await db.delete(member)
