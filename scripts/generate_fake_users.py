#!/usr/bin/env python3
import asyncio, argparse, random, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))
from faker import Faker
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from app.core.config import settings
from app.core.security import hash_password
from app.database.base import Base
from app.models.profile import Profile
from app.models.schedule import Schedule
from app.models.subject import Subject, UserSubject
from app.models.user import User

fake = Faker("vi_VN")
UNIS = ["ĐH Bách Khoa HN","ĐH Kinh tế QD","ĐH Ngoại thương","ĐH KHXH & NV","FPT University","RMIT Vietnam"]
MAJORS = ["Công nghệ thông tin","Kinh tế đối ngoại","Tài chính - Ngân hàng","Thiết kế đồ hoạ","Ngôn ngữ Anh"]
STYLES = ["visual","auditory","reading","kinesthetic","social","solitary"]
GOALS = ["exam_prep","certification","job_prep","research","study_abroad","startup"]
SLOTS = ["7-9h","9-11h","13-15h","15-17h","19-21h","21-23h"]

async def generate(session: AsyncSession, count: int, dry_run: bool):
    from sqlalchemy import select
    res = await session.execute(select(Subject))
    subjects = res.scalars().all()
    if not subjects:
        print("No subjects found. Run seed_db.py first."); return
    created = 0
    for _ in range(count):
        import uuid
        email = f"fake_{uuid.uuid4().hex[:8]}@cocstudy.vn"
        user = User(email=email, password_hash=hash_password("fake_password"),
                    full_name=fake.name(), university=random.choice(UNIS),
                    major=random.choice(MAJORS), year_of_study=random.randint(1,5),
                    gpa=round(random.uniform(2.0,4.0),2), is_verified=True)
        if not dry_run:
            session.add(user)
            await session.flush()
            session.add(Profile(user_id=user.id, learning_style=random.choice(STYLES),
                                academic_goal=random.choice(GOALS)))
            chosen = random.sample(subjects, k=min(random.randint(2,4), len(subjects)))
            for s in chosen:
                session.add(UserSubject(user_id=user.id, subject_id=s.id))
            slots = set()
            for _ in range(random.randint(3,6)):
                slots.add((random.randint(0,6), random.choice(SLOTS)))
            for day, slot in slots:
                session.add(Schedule(user_id=user.id, day_of_week=day, time_slot=slot))
        created += 1
        if created % 50 == 0:
            print(f"  {created}/{count}...")
            if not dry_run: await session.flush()
    if not dry_run: await session.commit()
    print(f"✅ {'Would create' if dry_run else 'Created'} {created} fake users")

async def main(count, dry_run):
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    SL = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
    async with SL() as session:
        await generate(session, count, dry_run)
    await engine.dispose()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--count", type=int, default=100)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    asyncio.run(main(args.count, args.dry_run))
