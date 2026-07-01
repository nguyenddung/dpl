import api from './api'
import type { IConversation, IMessage } from '@/types'
export const messagesService = {
  async getConversations(): Promise<IConversation[]> { return (await api.get('/messages/conversations')).data },
  async getMessages(id: string, limit=50): Promise<IMessage[]> { return (await api.get(`/messages/conversations/${id}`, { params: { limit } })).data },
  async sendMessage(id: string, content: string, messageType='text'): Promise<IMessage> { return (await api.post(`/messages/conversations/${id}`, { content, message_type: messageType })).data },
  getWsUrl(id: string): string {
    const base = import.meta.env.VITE_WS_BASE_URL ?? 'ws://localhost:8000/api/v1'
    return `${base}/messages/ws/${id}?token=${localStorage.getItem('access_token') ?? ''}`
  },
}
