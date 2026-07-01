import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'
import ChatList from '@/components/chat/ChatList'
import ChatWindow from '@/components/chat/ChatWindow'
import { Spinner } from '@/components/ui'
import { messagesService } from '@/services/messages.service'
import type { IConversation } from '@/types'

export default function Messages() {
  const { conversationId } = useParams<{ conversationId?: string }>()
  const navigate = useNavigate()
  const [active, setActive] = useState<IConversation|null>(null)
  const { data: conversations=[], isLoading } = useQuery({ queryKey: ['conversations'], queryFn: () => messagesService.getConversations(), refetchInterval: 15000 })

  useEffect(() => {
    if (!conversations.length || active) return
    const found = conversationId ? conversations.find(c=>c.id===conversationId) : conversations[0]
    if (found) setActive(found)
  }, [conversations, conversationId])

  const handleSelect = (conv: IConversation) => { setActive(conv); navigate(`/messages/${conv.id}`, { replace: true }) }

  return (
    <div className="min-h-screen bg-app-bg flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
          <div className={`w-full md:w-72 border-r border-app-border flex-shrink-0 flex flex-col ${active?'hidden md:flex':'flex'}`}>
            <div className="px-4 py-3 border-b border-app-border"><h2 className="font-bold text-base">Tin nhắn 💬</h2></div>
            {isLoading ? <div className="flex justify-center py-12"><Spinner /></div> : <ChatList conversations={conversations} activeId={active?.id} onSelect={handleSelect} />}
          </div>
          <div className={`flex-1 flex flex-col ${!active?'hidden md:flex':'flex'}`}>
            {active ? (
              <>
                <div className="md:hidden px-4 py-2 border-b border-app-border">
                  <button onClick={()=>{setActive(null);navigate('/messages')}} className="text-sm text-text-secondary hover:text-green-dark">← Quay lại</button>
                </div>
                <div className="flex-1 overflow-hidden"><ChatWindow conversation={active} /></div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-text-muted gap-3">
                <span className="text-5xl">💬</span><p className="font-medium">Chọn một cuộc trò chuyện</p><p className="text-sm">hoặc kết nối với bạn học mới từ trang Khám phá</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  )
}
