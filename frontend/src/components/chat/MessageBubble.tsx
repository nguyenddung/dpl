import { motion } from 'framer-motion'
import type { IMessage } from '@/types'
function formatTime(iso: string) { return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) }
export default function MessageBubble({ message, isMe }: { message: IMessage; isMe: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isMe?'justify-end':'justify-start'}`}>
      <div className="max-w-[70%]">
        <div className={`px-4 py-2.5 text-sm leading-relaxed rounded-2xl ${isMe ? 'bg-green-dark text-white rounded-br-sm' : 'bg-app-surface border border-app-border text-text-primary rounded-bl-sm'}`}>
          {message.content}
        </div>
        <p className={`text-[11px] text-text-muted mt-1 ${isMe?'text-right':'text-left'}`}>
          {formatTime(message.created_at)}{isMe && <span className="ml-1">{message.is_read?'✓✓':'✓'}</span>}
        </p>
      </div>
    </motion.div>
  )
}
