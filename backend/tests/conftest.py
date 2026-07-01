import asyncio
import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from app.core.dependencies import get_db
from app.core.security import create_access_token, hash_password
from app.database.base import Base
from app.main import app
from app.models.user import User

TEST_DB_URL = "sqlite+aiosqlite:///:memory:"
test_engine = create_async_engine(TEST_DB_URL, connect_args={"check_same_thread": False}, echo=False)
TestSessionLocal = async_sessionmaker(bind=test_engine, class_=AsyncSession, expire_on_commit=False, autoflush=False)

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

async def override_get_db():
    async with TestSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise

app.dependency_overrides[get_db] = override_get_db

@pytest_asyncio.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac

@pytest_asyncio.fixture
async def db():
    async with TestSessionLocal() as session:
        yield session

@pytest_asyncio.fixture
async def test_user(db: AsyncSession) -> User:
    user = User(email="test@cocstudy.vn", password_hash=hash_password("password123"),
                full_name="Test User", university="ĐH Bách Khoa", major="CNTT", gpa=3.5)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@pytest_asyncio.fixture
async def auth_headers(test_user: User) -> dict:
    return {"Authorization": f"Bearer {create_access_token(test_user.id)}"}

@pytest_asyncio.fixture
async def second_user(db: AsyncSession) -> User:
    user = User(email="second@cocstudy.vn", password_hash=hash_password("password123"),
                full_name="Second User", university="ĐH Kinh tế", major="Tài chính", gpa=3.2)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
