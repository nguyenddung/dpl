from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import create_access_token, create_refresh_token, decode_token, hash_password, verify_password
from app.models.profile import Profile
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse

async def register_user(req: RegisterRequest, db: AsyncSession) -> tuple[User, TokenResponse]:
    existing = await db.execute(select(User).where(User.email == req.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail={"code": "EMAIL_EXISTS", "message": "Email already registered"})
    user = User(email=req.email, password_hash=hash_password(req.password),
                full_name=req.full_name, university=req.university, major=req.major)
    db.add(user)
    await db.flush()
    db.add(Profile(user_id=user.id))
    tokens = TokenResponse(access_token=create_access_token(user.id), refresh_token=create_refresh_token(user.id))
    return user, tokens

async def login_user(req: LoginRequest, db: AsyncSession) -> tuple[User, TokenResponse]:
    result = await db.execute(select(User).where(User.email == req.email))
    user: User | None = result.scalar_one_or_none()
    if user is None or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail={"code": "INVALID_CREDENTIALS", "message": "Invalid email or password"})
    if not user.is_active:
        raise HTTPException(status_code=403, detail={"code": "ACCOUNT_DISABLED", "message": "Account disabled"})
    tokens = TokenResponse(access_token=create_access_token(user.id), refresh_token=create_refresh_token(user.id))
    return user, tokens

async def refresh_access_token(refresh_token: str, db: AsyncSession) -> str:
    payload = decode_token(refresh_token)
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail={"code": "INVALID_REFRESH_TOKEN", "message": "Invalid or expired refresh token"})
    result = await db.execute(select(User).where(User.id == UUID(payload["sub"]), User.is_active == True))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail={"code": "USER_NOT_FOUND", "message": "User not found"})
    return create_access_token(user.id)
