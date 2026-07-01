import uuid
from pathlib import Path
import aiofiles
from fastapi import APIRouter, Depends, File, UploadFile
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.core.dependencies import get_current_user, get_db
from app.models.profile import Profile
from app.models.user import User
from app.utils.file_handler import validate_image, validate_image_size, get_safe_filename, ensure_upload_dir, build_static_url

router = APIRouter(prefix="/uploads", tags=["uploads"])

class AvatarResponse(BaseModel):
    avatar_url: str

@router.post("/avatar", response_model=AvatarResponse)
async def upload_avatar(file: UploadFile = File(...), db: AsyncSession = Depends(get_db),
                        current_user: User = Depends(get_current_user)):
    validate_image(file)
    content = await file.read()
    validate_image_size(content)
    avatar_dir = ensure_upload_dir("avatars")
    filename = get_safe_filename(str(current_user.id), file.content_type)
    async with aiofiles.open(avatar_dir / filename, "wb") as f:
        await f.write(content)
    avatar_url = build_static_url("avatars", filename)
    result = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    if profile:
        profile.avatar_url = avatar_url
    else:
        db.add(Profile(user_id=current_user.id, avatar_url=avatar_url))
    return AvatarResponse(avatar_url=avatar_url)
