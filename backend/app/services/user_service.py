from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.schemas.user import UserUpdateRequest

async def get_user_by_id(user_id: UUID, db: AsyncSession) -> User:
    result = await db.execute(select(User).where(User.id == user_id, User.is_active == True))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail={"code": "USER_NOT_FOUND", "message": f"User {user_id} not found"})
    return user

async def search_users(db: AsyncSession, q=None, major=None, university=None, limit=20, exclude_id=None) -> list[User]:
    stmt = select(User).where(User.is_active == True)
    if exclude_id: stmt = stmt.where(User.id != exclude_id)
    if q: stmt = stmt.where(User.full_name.ilike(f"%{q}%"))
    if major: stmt = stmt.where(User.major.ilike(f"%{major}%"))
    if university: stmt = stmt.where(User.university.ilike(f"%{university}%"))
    result = await db.execute(stmt.limit(limit))
    return list(result.scalars().all())

async def update_user(user: User, data: UserUpdateRequest, db: AsyncSession) -> User:
    if data.gpa is not None and not (0.0 <= data.gpa <= 4.0):
        raise HTTPException(status_code=422, detail={"code": "INVALID_GPA", "message": "GPA must be 0.0–4.0"})
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(user, field, value)
    return user
