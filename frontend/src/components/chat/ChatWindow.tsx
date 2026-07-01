import { useEffect, useRef, useState } from 'react'
import { useWebSocket } from '@/hooks/useWebSocket'
import { messagesService } from '@/services/messages.service'
import MessageBubble from './MessageBubble'
import { Spinner, Avatar, OnlineDot } from '@/components/ui'
import type { IConversation, IMessage } from '@/types'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

export default function ChatWindow({ conversation }: { conversation: IConversation }) {
  const currentUserId = useSelector((s: RootState) => s.auth.user?.id ?? '')
  const [history, setHistory] = useState<IMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const { messages: wsMessages, connected, send } = useWebSocket(conversation.id)

  useEffect(() => {
    setLoading(true)
    messagesService.getMessages(conversation.id).then(msgs => { setHistory(msgs); setLoading(false) })
  }, [conversation.id])

  const allMessages = [...history, ...wsMessages]
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [allMessages.length])

  const handleSend = () => { const text = input.trim(); if (!text) return; send(text); setInput('') }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-app-border bg-app-surface flex-shrink-0">
        <Avatar name={conversation.other_user_name} src={conversation.other_user_avatar} />
        <div>
          <p className="font-semibold text-sm">{conversation.other_user_name}</p>
          <div className="flex items-center gap-1">
            {connected ? <OnlineDot /> : <div className="w-2 h-2 rounded-full bg-text-muted" />}
            <span className="text-xs text-text-muted">{connected ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-app-bg">
        {loading ? <div className="flex justify-center pt-10"><Spinner /></div>
          : allMessages.length === 0 ? <p className="text-center text-text-muted text-sm pt-10">Hãy bắt đầu cuộc trò chuyện! 👋</p>
          : allMessages.map(m => <MessageBubble key={m.id} message={m} isMe={m.sender_id===currentUserId} />)}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-3 items-center px-5 py-4 border-t border-app-border bg-app-surface flex-shrink-0">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && !e.shiftKey && handleSend()}
          placeholder="Nhập tin nhắn..." className="flex-1 px-4 py-2.5 text-sm border-[1.5px] border-app-border rounded-full bg-app-bg focus:border-green-dark outline-none transition-colors font-sans" />
        <button onClick={handleSend} className="w-10 h-10 bg-green-dark text-white rounded-full flex items-center justify-center hover:bg-green-mid transition-colors flex-shrink-0">➤</button>
      </div>
    </div>
  )
}
