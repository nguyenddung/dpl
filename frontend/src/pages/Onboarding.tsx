import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import WizardStep from '@/components/onboarding/WizardStep'
import SubjectPicker from '@/components/onboarding/SubjectPicker'
import ScheduleGrid from '@/components/onboarding/ScheduleGrid'
import { Button } from '@/components/ui'
import { useUpdateProfile } from '@/hooks/useProfile'
import type { LearningStyle, AcademicGoal } from '@/types'

const STEPS = [
  { title: 'Bạn học môn gì?', subtitle: 'Chọn các môn học bạn đang theo' },
  { title: 'Phong cách học?', subtitle: 'Bạn học tốt nhất theo cách nào?' },
  { title: 'Mục tiêu học tập?', subtitle: 'Bạn muốn đạt được gì?' },
  { title: 'Lịch rảnh của bạn?', subtitle: 'Chọn các khung giờ bạn có thể học nhóm' },
]
const STYLES: { value: LearningStyle; label: string }[] = [
  { value:'visual', label:'📖 Đọc và ghi chép' }, { value:'kinesthetic', label:'🎯 Thực hành bài tập' },
  { value:'auditory', label:'🎥 Nghe và xem video' }, { value:'social', label:'👥 Học nhóm thảo luận' },
  { value:'reading', label:'💡 Tự nghiên cứu tài liệu' }, { value:'solitary', label:'🗂️ Sơ đồ tư duy' },
]
const GOALS: { value: AcademicGoal; label: string }[] = [
  { value:'exam_prep', label:'📝 Chuẩn bị thi cuối kỳ' }, { value:'certification', label:'🏆 Thi chứng chỉ quốc tế' },
  { value:'job_prep', label:'💼 Chuẩn bị xin việc' }, { value:'research', label:'🔬 Nghiên cứu khoa học' },
  { value:'study_abroad', label:'🌏 Du học' }, { value:'startup', label:'🚀 Khởi nghiệp' },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const { mutate: updateProfile, isPending } = useUpdateProfile()
  const [step, setStep] = useState(0)
  const [subjects, setSubjects] = useState<string[]>([])
  const [style, setStyle] = useState<LearningStyle|''>('')
  const [goal, setGoal] = useState<AcademicGoal|''>('')
  const [schedule, setSchedule] = useState<string[]>([])

  const finish = () => {
    updateProfile({ learning_style: style||undefined, academic_goal: goal||undefined,
      schedule: schedule.map(k => { const [d,slot] = k.split(':'); return { day_of_week: parseInt(d), time_slot: slot as any } }) },
      { onSettled: () => navigate('/discover') })
  }

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((_, i) => <div key={i} className={`h-2 rounded-full bg-green-dark transition-all ${i===step?'w-6':'w-2 opacity-30'}`} />)}
        </div>
        <WizardStep step={step} title={STEPS[step].title} subtitle={STEPS[step].subtitle}>
          {step===0 && <SubjectPicker selected={subjects} onChange={setSubjects} />}
          {step===1 && <div className="grid grid-cols-2 gap-3">{STYLES.map(s => (
            <button key={s.value} onClick={()=>setStyle(s.value)} className={`p-4 rounded-input text-sm font-medium border-[1.5px] text-left transition-all ${style===s.value?'bg-green-pale border-green-dark text-green-dark':'border-app-border hover:border-green-mid'}`}>{s.label}</button>
          ))}</div>}
          {step===2 && <div className="grid grid-cols-2 gap-3">{GOALS.map(g => (
            <button key={g.value} onClick={()=>setGoal(g.value)} className={`p-4 rounded-input text-sm font-medium border-[1.5px] text-left transition-all ${goal===g.value?'bg-green-pale border-green-dark text-green-dark':'border-app-border hover:border-green-mid'}`}>{g.label}</button>
          ))}</div>}
          {step===3 && <ScheduleGrid selected={schedule} onChange={setSchedule} />}
        </WizardStep>
        <div className="flex justify-between items-center mt-8">
          {step>0 ? <button onClick={()=>setStep(s=>s-1)} className="text-sm text-text-secondary hover:text-green-dark">← Quay lại</button> : <div />}
          {step<STEPS.length-1 ? <Button onClick={()=>setStep(s=>s+1)}>Tiếp theo →</Button> : <Button onClick={finish} loading={isPending}>Hoàn thành 🎉</Button>}
        </div>
        <div className="text-center mt-4"><button onClick={()=>navigate('/discover')} className="text-xs text-text-muted hover:text-green-dark underline">Bỏ qua bước này</button></div>
      </div>
    </div>
  )
}
