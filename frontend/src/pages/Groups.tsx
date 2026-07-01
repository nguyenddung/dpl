import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'
import GroupCard from '@/components/groups/GroupCard'
import { Spinner, Button, Input } from '@/components/ui'
import { groupsService } from '@/services/groups.service'

export default function Groups() {
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const { data: groups, isLoading, refetch } = useQuery({ queryKey: ['groups', search], queryFn: () => groupsService.list(search||undefined) })
  const handleCreate = async () => {
    if (!newName.trim()) return
    await groupsService.create({ name: newName, description: newDesc, icon: '📚' })
    setShowCreate(false); setNewName(''); setNewDesc(''); refetch()
  }
  return (
    <div className="min-h-screen bg-app-bg">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 pb-20 md:pb-6">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-bold">Nhóm học 👥</h1>
            <Button size="sm" onClick={()=>setShowCreate(v=>!v)}>+ Tạo nhóm mới</Button>
          </div>
          <p className="text-text-secondary text-sm mb-5">Tham gia hoặc tạo nhóm học tập cùng nhau</p>
          {showCreate && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-app-surface border border-app-border rounded-card p-5 mb-5 space-y-3">
              <h3 className="font-bold">Tạo nhóm mới</h3>
              <Input placeholder="Tên nhóm" value={newName} onChange={e=>setNewName(e.target.value)} />
              <Input placeholder="Mô tả (tuỳ chọn)" value={newDesc} onChange={e=>setNewDesc(e.target.value)} />
              <div className="flex gap-2"><Button size="sm" onClick={handleCreate}>Tạo nhóm</Button><Button size="sm" variant="ghost" onClick={()=>setShowCreate(false)}>Huỷ</Button></div>
            </motion.div>
          )}
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Tìm nhóm..."
            className="w-full max-w-sm px-4 py-2.5 border-[1.5px] border-app-border rounded-input text-sm bg-app-surface focus:border-green-dark outline-none mb-5 transition-colors" />
          {isLoading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div>
            : !groups?.length ? <div className="text-center py-16 text-text-muted"><p className="text-4xl mb-3">👥</p><p>Chưa có nhóm nào. Hãy tạo nhóm đầu tiên!</p></div>
            : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{groups.map((g,i)=><GroupCard key={g.id} group={g} index={i} />)}</div>}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
