# 🐸 CócStudy — AI Study Partner Matching Platform

## Quick Start (Docker)
```bash
cp .env.example .env
docker compose up -d --build
docker compose exec backend alembic upgrade head
docker compose exec backend python ../scripts/seed_db.py
```
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs
- Demo: demo@cocstudy.vn / demo1234

## Manual Setup

### Backend
```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example ../.env
# Edit DATABASE_URL to point to your local PostgreSQL
alembic upgrade head
python ../scripts/seed_db.py
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
echo "VITE_API_BASE_URL=http://localhost:8000/api/v1" > .env.local
echo "VITE_WS_BASE_URL=ws://localhost:8000/api/v1" >> .env.local
npm run dev
```

## Tests
```bash
cd backend
pytest tests/ -v
```

## Tech Stack
FastAPI · React 18 + TypeScript · PostgreSQL 15 · scikit-learn KNN · Redis · Docker

## Project Structure
```
cocstudy/
├── backend/    FastAPI + AI Engine
├── frontend/   React 18 SPA
├── database/   Schema + seed data
├── scripts/    Seeder utilities
└── docs/       API/AI/Architecture docs
```
