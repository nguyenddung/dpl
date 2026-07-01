import { useNavigate } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'
import ProfileHero from '@/components/profile/ProfileHero'
import StatsGrid from '@/components/profile/StatsGrid'
import SkillGrid from '@/components/profile/SkillGrid'
import { Spinner, Button, Tag } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { useMyProfile } from '@/hooks/useProfile'
import { useQuery } from '@tanstack/react-query'
import { groupsService } from '@/services/groups.service'

export default function Profile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: profile, isLoading } = useMyProfile()
  const { data: groups } = useQuery({ queryKey: ['groups'], queryFn: () => groupsService.list() })
  if (!user) return null
  const stats = [{ value: 47, label: 'Kết nối' }, { value: groups?.length??0, label: 'Nhóm học' }, { value: 156, label: 'Giờ học' }, { value: `${profile?.xp_points??0} XP`, label: 'Điểm thưởng' }]
  const skills = [{ name:'Python', level:'advanced' },{ name:'React', level:'intermediate' },{ name:'SQL', level:'intermediate' },{ name:'Machine Learning', level:'beginner' },{ name:'Docker', level:'beginner' },{ name:'Git', level:'advanced' }]
  return (
    <div className="min-h-screen bg-app-bg">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 pb-20 md:pb-6 max-w-2xl">
          {isLoading ? <div className="flex justify-center py-20"><Spinner size="lg" /></div> : (
            <div className="space-y-5">
              <ProfileHero user={user} xp={profile?.xp_points} streak={profile?.streak_days} tags={['🎯 Lập trình','🤖 AI/ML','📊 Data Science']} />
              <div className="flex justify-end"><Button size="sm" variant="secondary" onClick={()=>navigate('/settings')}>✏️ Chỉnh sửa hồ sơ</Button></div>
              <StatsGrid stats={stats} />
              {profile?.bio && <div className="bg-app-surface border border-app-border rounded-card p-5"><h3 className="font-bold mb-3">Giới thiệu</h3><p className="text-sm text-text-secondary leading-relaxed">{profile.bio}</p></div>}
              {(profile?.learning_style || profile?.academic_goal) && (
                <div className="bg-app-surface border border-app-border rounded-card p-5">
                  <h3 className="font-bold mb-3">Phong cách học tập</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.learning_style && <Tag label={`🎯 ${profile.learning_style}`} />}
                    {profile.academic_goal && <Tag label={`🏆 ${profile.academic_goal}`} />}
                  </div>
                </div>
              )}
              <div className="bg-app-surface border border-app-border rounded-card p-5"><h3 className="font-bold mb-3">Kỹ năng</h3><SkillGrid skills={skills} /></div>
              <div className="bg-app-surface border border-app-border rounded-card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🐸</span>
                  <div><p className="font-semibold text-sm">Thành tích</p><p className="text-xs text-text-muted">Học {profile?.streak_days??0} ngày liên tiếp!</p></div>
                  <span className="ml-auto text-green-dark font-bold">+20 XP</span>
                </div>
                <div className="w-full h-2 bg-app-border rounded-full overflow-hidden">
                  <div className="h-full bg-green-dark rounded-full transition-all" style={{ width: `${Math.min(((profile?.xp_points??0)%500)/500*100, 100)}%` }} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
