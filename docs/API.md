# CócStudy API Reference
Base URL: `http://localhost:8000/api/v1`
Auth header: `Authorization: Bearer <access_token>`

## Auth
- POST /auth/register {email,password,full_name,university?,major?} → tokens
- POST /auth/login {email,password} → tokens
- POST /auth/refresh {refresh_token} → access_token
- GET /auth/me → UserResponse

## Matching (AI)
- GET /matching/recommendations?limit=20&offset=0 → ranked matches
- GET /matching/score/{user_id} → detailed compatibility
- POST /matching/connect/{user_id} → match status

## Groups
- GET/POST /groups · POST /groups/{id}/join · DELETE /groups/{id}/leave

## Messages
- GET /messages/conversations · GET/POST /messages/conversations/{id}
- WS /messages/ws/{id}?token=<access_token>

## Notifications
- GET /notifications · PATCH /notifications/read-all

## Uploads
- POST /uploads/avatar (multipart, max 5MB, jpeg/png/webp)

Errors: { "detail": { "code": "SCREAMING_SNAKE", "message": "..." } }
