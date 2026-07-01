import { useEffect, useRef, useCallback, useState } from 'react'
import { messagesService } from '@/services/messages.service'
import type { IMessage } from '@/types'
export function useWebSocket(conversationId: string|null) {
  const wsRef = useRef<WebSocket|null>(null)
  const [messages, setMessages] = useState<IMessage[]>([])
  const [connected, setConnected] = useState(false)
  useEffect(() => {
    if (!conversationId) return
    const ws = new WebSocket(messagesService.getWsUrl(conversationId))
    wsRef.current = ws
    ws.onopen = () => setConnected(true)
    ws.onclose = () => setConnected(false)
    ws.onmessage = e => { try { setMessages(prev => [...prev, JSON.parse(e.data)]) } catch {} }
    return () => { ws.close(); wsRef.current = null; setConnected(false) }
  }, [conversationId])
  const send = useCallback((content: string, type='text') => {
    if (wsRef.current?.readyState === WebSocket.OPEN)
      wsRef.current.send(JSON.stringify({ content, message_type: type }))
  }, [])
  return { messages, connected, send, clearMessages: () => setMessages([]) }
}
