from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, WebSocket, WebSocketDisconnect
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.core.dependencies import get_current_user, get_db
from app.core.security import decode_token
from app.database.session import AsyncSessionLocal
from app.models.message import Conversation, Message
from app.models.user import User
from app.schemas.message import ConversationResponse, MessageCreateRequest, MessageResponse

router = APIRouter(prefix="/messages", tags=["messages"])

class ConnectionManager:
    def __init__(self):
        self._connections: dict[UUID, list[WebSocket]] = {}
    async def connect(self, conv_id: UUID, ws: WebSocket):
        await ws.accept()
        self._connections.setdefault(conv_id, []).append(ws)
    def disconnect(self, conv_id: UUID, ws: WebSocket):
        conns = self._connections.get(conv_id, [])
        if ws in conns: conns.remove(ws)
    async def broadcast(self, conv_id: UUID, payload: dict):
        for ws in list(self._connections.get(conv_id, [])):
            try: await ws.send_json(payload)
            except: pass

manager = ConnectionManager()

@router.get("/conversations", response_model=list[ConversationResponse])
async def list_conversations(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Conversation).where(
        or_(Conversation.user_id_a == current_user.id, Conversation.user_id_b == current_user.id)
    ).order_by(Conversation.updated_at.desc()))
    convs = result.scalars().all()
    responses = []
    for conv in convs:
        other_id = conv.user_id_b if conv.user_id_a == current_user.id else conv.user_id_a
        other = (await db.execute(select(User).options(selectinload(User.profile)).where(User.id == other_id))).scalar_one_or_none()
        last_msg = (await db.execute(select(Message).where(Message.conversation_id == conv.id).order_by(Message.created_at.desc()).limit(1))).scalar_one_or_none()
        unread = (await db.execute(select(Message).where(Message.conversation_id == conv.id,
            Message.sender_id != current_user.id, Message.is_read == False))).scalars().all()
        responses.append(ConversationResponse(id=conv.id, other_user_id=other_id,
            other_user_name=other.full_name if other else "Unknown",
            other_user_avatar=other.profile.avatar_url if other and other.profile else None,
            last_message=last_msg.content if last_msg else None,
            unread_count=len(unread), updated_at=conv.updated_at))
    return responses

@router.get("/conversations/{conversation_id}", response_model=list[MessageResponse])
async def get_messages(conversation_id: UUID, limit: int = Query(50, le=100),
                       db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    conv = (await db.execute(select(Conversation).where(Conversation.id == conversation_id,
        or_(Conversation.user_id_a == current_user.id, Conversation.user_id_b == current_user.id)))).scalar_one_or_none()
    if not conv:
        raise HTTPException(status_code=403, detail={"code": "FORBIDDEN"})
    result = await db.execute(select(Message).where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc()).limit(limit))
    return result.scalars().all()

@router.post("/conversations/{conversation_id}", response_model=MessageResponse, status_code=201)
async def send_message(conversation_id: UUID, req: MessageCreateRequest,
                       db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    conv = (await db.execute(select(Conversation).where(Conversation.id == conversation_id,
        or_(Conversation.user_id_a == current_user.id, Conversation.user_id_b == current_user.id)))).scalar_one_or_none()
    if not conv:
        raise HTTPException(status_code=403, detail={"code": "FORBIDDEN"})
    msg = Message(conversation_id=conversation_id, sender_id=current_user.id,
                  content=req.content, message_type=req.message_type)
    db.add(msg)
    await db.flush()
    await manager.broadcast(conversation_id, {"id": str(msg.id), "sender_id": str(msg.sender_id),
        "content": msg.content, "message_type": msg.message_type, "created_at": msg.created_at.isoformat()})
    return msg

@router.websocket("/ws/{conversation_id}")
async def websocket_chat(conversation_id: UUID, ws: WebSocket, token: str = Query(...)):
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        await ws.close(code=4001); return
    user_id = UUID(payload["sub"])
    async with AsyncSessionLocal() as db:
        conv = (await db.execute(select(Conversation).where(Conversation.id == conversation_id,
            or_(Conversation.user_id_a == user_id, Conversation.user_id_b == user_id)))).scalar_one_or_none()
        if not conv:
            await ws.close(code=4003); return
        await manager.connect(conversation_id, ws)
        try:
            while True:
                data = await ws.receive_json()
                content = data.get("content", "").strip()
                if not content: continue
                msg = Message(conversation_id=conversation_id, sender_id=user_id,
                              content=content, message_type=data.get("message_type","text"))
                db.add(msg)
                await db.commit()
                await db.refresh(msg)
                await manager.broadcast(conversation_id, {"id": str(msg.id),
                    "conversation_id": str(msg.conversation_id), "sender_id": str(msg.sender_id),
                    "content": msg.content, "message_type": msg.message_type,
                    "is_read": msg.is_read, "created_at": msg.created_at.isoformat()})
        except WebSocketDisconnect:
            manager.disconnect(conversation_id, ws)
