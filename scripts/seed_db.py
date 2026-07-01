#!/usr/bin/env python3
import asyncio, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from app.core.config import settings
from app.core.security import hash_password
from app.database.base import Base
from app.models.group import GroupMember, StudyGroup
from app.models.notification import Notification
from app.models.profile import Profile
from app.models.schedule import Schedule
from app.models.subject import Subject, UserSubject
from app.models.user import User

SUBJECTS = [("Toán cao cấp","STEM"),("Lập trình Python","STEM"),("AI / Machine Learning","STEM"),
            ("Data Science","STEM"),("Marketing số","Business"),("Tài chính doanh nghiệp","Business"),
            ("Tiếng Anh học thuật","Language"),("Thiết kế đồ hoạ","Design"),("UI / UX Design","Design"),
            ("Mạng máy tính","STEM"),("Kinh tế vi mô","Business"),("Kế toán tài chính","Business"),
            ("Tiếng Nhật N3","Language"),("Luật dân sự","Law"),("Y học cơ sở","Health"),("Vật lý đại cương","STEM")]

DEMO_USERS = [
    {"email":"demo@cocstudy.vn","full_name":"Demo User","university":"ĐH Bách Khoa HN","major":"CNTT","gpa":3.7,
     "profile":{"bio":"Sinh viên CNTT năm 3","learning_style":"visual","academic_goal":"job_prep"},
     "subjects":["Lập trình Python","AI / Machine Learning","Data Science"],
     "schedule":[(0,"19-21h"),(1,"19-21h"),(2,"19-21h"),(3,"19-21h")]},
    {"email":"minhanh@ntu.edu.vn","full_name":"Trần Minh Anh","university":"ĐH Ngoại thương","major":"Kinh tế đối ngoại","gpa":3.8,
     "profile":{"bio":"Chuẩn bị thi ACCA","learning_style":"social","academic_goal":"certification"},
     "subjects":["Tài chính doanh nghiệp","Kế toán tài chính","Marketing số"],
     "schedule":[(1,"19-21h"),(3,"19-21h"),(5,"15-17h")]},
    {"email":"hainam@hust.edu.vn","full_name":"Nguyễn Hải Nam","university":"ĐH Bách Khoa HN","major":"CNTT","gpa":3.6,
     "profile":{"bio":"Backend dev","learning_style":"kinesthetic","academic_goal":"job_prep"},
     "subjects":["Lập trình Python","Mạng máy tính","AI / Machine Learning"],
     "schedule":[(0,"19-21h"),(2,"19-21h"),(4,"19-21h")]},
]

async def seed(session: AsyncSession):
    print("🌱 Seeding subjects...")
    subject_map = {}
    for name, cat in SUBJECTS:
        s = Subject(name=name, category=cat)
        session.add(s)
        subject_map[name] = s
    await session.flush()

    print("👤 Seeding users...")
    user_objects = []
    for u in DEMO_USERS:
        user = User(email=u["email"], password_hash=hash_password("demo1234"),
                    full_name=u["full_name"], university=u["university"], major=u["major"],
                    gpa=u["gpa"], is_verified=True)
        session.add(user)
        await session.flush()
        session.add(Profile(user_id=user.id, **u["profile"]))
        for sn in u["subjects"]:
            if sn in subject_map:
                session.add(UserSubject(user_id=user.id, subject_id=subject_map[sn].id))
        for day, slot in u["schedule"]:
            session.add(Schedule(user_id=user.id, day_of_week=day, time_slot=slot))
        user_objects.append(user)
    await session.flush()

    print("👥 Seeding groups...")
    if len(user_objects) >= 1:
        g = StudyGroup(name="AI & Machine Learning", description="Học Deep Learning cùng nhau",
                       icon="🤖", owner_id=user_objects[0].id, max_members=6)
        session.add(g)
        await session.flush()
        session.add(GroupMember(group_id=g.id, user_id=user_objects[0].id, role="owner"))
        if len(user_objects) > 2:
            session.add(GroupMember(group_id=g.id, user_id=user_objects[2].id, role="member"))

    session.add(Notification(user_id=user_objects[0].id, type="achievement",
                             title="Chào mừng đến với CócStudy! 🐸", is_read=False))
    await session.commit()
    print(f"✅ Seeded {len(SUBJECTS)} subjects, {len(DEMO_USERS)} users, 1 group")

async def main():
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    SL = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
    async with SL() as session:
        await seed(session)
    await engine.dispose()
    print("🐸 Done!")

if __name__ == "__main__":
    asyncio.run(main())
