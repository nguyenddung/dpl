# CócStudy Architecture

```
React SPA (Vite) ←→ FastAPI (Uvicorn) ←→ PostgreSQL 15
                         ↕
                    Redis (planned)
```

Backend: FastAPI + SQLAlchemy 2 async + JWT + KNN AI engine
Frontend: React 18 + TypeScript + Redux Toolkit + React Query + TailwindCSS
Realtime: Native FastAPI WebSocket
Deployment: Docker Compose (postgres, redis, backend, frontend)
