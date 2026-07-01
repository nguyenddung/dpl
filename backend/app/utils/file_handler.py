import re, uuid
from pathlib import Path
from fastapi import HTTPException, UploadFile, status
from app.core.config import settings

_MIME_TO_EXT = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp"}

def validate_image(file: UploadFile) -> None:
    if file.content_type not in settings.allowed_image_types_list:
        raise HTTPException(status_code=400, detail={"code": "INVALID_FILE_TYPE", "message": f"Allowed: {settings.ALLOWED_IMAGE_TYPES}"})

def validate_image_size(content: bytes) -> None:
    if len(content) > settings.max_avatar_size_bytes:
        raise HTTPException(status_code=413, detail={"code": "FILE_TOO_LARGE", "message": f"Max {settings.MAX_AVATAR_SIZE_MB}MB"})

def get_safe_filename(prefix: str, content_type: str) -> str:
    clean = re.sub(r"[^a-zA-Z0-9_-]", "", str(prefix))
    ext = _MIME_TO_EXT.get(content_type, "jpg")
    return f"{clean}_{uuid.uuid4().hex[:8]}.{ext}"

def ensure_upload_dir(subdir: str = "avatars") -> Path:
    path = Path(settings.UPLOAD_DIR) / subdir
    path.mkdir(parents=True, exist_ok=True)
    return path

def build_static_url(subdir: str, filename: str) -> str:
    return f"/static/{subdir}/{filename}"
