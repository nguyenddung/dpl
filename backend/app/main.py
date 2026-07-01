from contextlib import asynccontextmanager
from pathlib import Path
import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.v1 import auth, groups, matching, messages, notifications, profiles, uploads, users
from app.core.config import settings
from app.database.session import engine
from app.database.base import Base
from app.middleware.rate_limiter import RateLimitMiddleware
from app.middleware.logger import RequestLoggerMiddleware

logger = structlog.get_logger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("CócStudy API starting", env=settings.APP_ENV)
    Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
    Path(settings.UPLOAD_DIR + "/avatars").mkdir(exist_ok=True)
    Path(settings.UPLOAD_DIR + "/documents").mkdir(exist_ok=True)
    if settings.APP_ENV == "development":
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()

app = FastAPI(title="CócStudy API", description="AI-powered study partner matching",
              version="1.0.0", docs_url="/docs", redoc_url="/redoc", lifespan=lifespan)

app.add_middleware(CORSMiddleware, allow_origins=settings.allowed_origins_list,
                  allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.add_middleware(RateLimitMiddleware, requests_per_minute=settings.RATE_LIMIT_PER_MINUTE)
app.add_middleware(RequestLoggerMiddleware)

upload_path = Path(settings.UPLOAD_DIR)
upload_path.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=str(upload_path)), name="static")

prefix = "/api/v1"
app.include_router(auth.router, prefix=prefix)
app.include_router(users.router, prefix=prefix)
app.include_router(profiles.router, prefix=prefix)
app.include_router(matching.router, prefix=prefix)
app.include_router(groups.router, prefix=prefix)
app.include_router(messages.router, prefix=prefix)
app.include_router(notifications.router, prefix=prefix)
app.include_router(uploads.router, prefix=prefix)

@app.get("/health", tags=["system"])
async def health():
    return {"status": "ok", "app": settings.APP_NAME, "env": settings.APP_ENV}
