import { Avatar } from '@/components/ui'
import type { IConversation } from '@/types'
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff/60000)
  if (m < 1) return 'vừa xong'
  if (m < 60) return `${m}p`
  const h = Math.floor(m/60)
  if (h < 24) return `${h}g`
  return `${Math.floor(h/24)}n`
}
export default function ChatList({ conversations, activeId, onSelect }: { conversations: IConversation[]; activeId?: string; onSelect: (c: IConversation) => void }) {
  if (!conversations.length) return <div className="flex flex-col items-center justify-center h-40 text-text-muted text-sm gap-2"><span className="text-3xl">💬</span><span>Chưa có tin nhắn nào</span></div>
  return (
    <div className="overflow-y-auto">
      {conversations.map((conv, i) => (
        <button key={conv.id} onClick={() => onSelect(conv)}
          className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-app-border hover:bg-green-pale transition-colors text-left ${activeId===conv.id?'bg-green-pale border-l-2 border-l-green-dark':''}`}>
          <Avatar name={conv.other_user_name} src={conv.other_user_avatar} index={i} />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline">
              <span className={`text-sm truncate ${conv.unread_count>0?'font-bold':'font-medium'}`}>{conv.other_user_name}</span>
              <span className="text-[11px] text-text-muted flex-shrink-0 ml-2">{timeAgo(conv.updated_at)}</span>
            </div>
            <p className="text-xs text-text-muted truncate">{conv.last_message ?? '...'}</p>
          </div>
          {conv.unread_count > 0 && <span className="flex-shrink-0 bg-green-dark text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{conv.unread_count}</span>}
        </button>
      ))}
    </div>
  )
}
