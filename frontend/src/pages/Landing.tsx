import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import { staggerContainer, fadeInUp } from '@/animations/variants'

const STEPS = [
  { icon: '📝', title: 'Đăng ký', desc: 'Tạo hồ sơ với thông tin ngành học và mục tiêu của bạn' },
  { icon: '🔍', title: 'Khám phá', desc: 'AI phân tích để tìm bạn học phù hợp nhất với bạn' },
  { icon: '🤝', title: 'Kết nối', desc: 'Gửi lời mời và bắt đầu hành trình học tập cùng nhau' },
  { icon: '🏆', title: 'Tiến bộ', desc: 'Học nhóm hiệu quả và đạt kết quả tốt hơn mỗi ngày' },
]
const STATS = [
  { num: '12,400+', label: 'Sinh viên đang học' },
  { num: '98%', label: 'Kết nối thành công' },
  { num: '340+', label: 'Nhóm học hoạt động' },
  { num: '4.9★', label: 'Đánh giá trung bình' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-app-bg">
      <Navbar />
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-green-pale text-green-dark px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
            🎓 Nền tảng học tập thông minh
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-5xl font-extrabold leading-tight text-green-dark mb-4">
            Học cùng nhau,<br /><span className="text-green-accent">tiến xa hơn</span><br />mỗi ngày
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-lg text-text-secondary leading-relaxed mb-8">
            Kết nối với bạn học phù hợp bằng AI, cùng nhau học tập và phát triển mỗi ngày.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex gap-3 flex-wrap">
            <Link to="/register" className="px-8 py-3.5 bg-green-dark text-white font-semibold rounded-full hover:bg-green-mid transition-all hover:shadow-card-hover">🚀 Bắt đầu ngay</Link>
            <Link to="/login" className="px-8 py-3.5 border-2 border-green-dark text-green-dark font-semibold rounded-full hover:bg-green-pale transition-colors">Đăng nhập</Link>
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="bg-app-surface border border-app-border rounded-card p-5 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-dark flex items-center justify-center text-xl">🐸</div>
            <div><p className="font-bold text-sm">Khám phá bạn học</p><p className="text-xs text-text-muted">AI đang phân tích...</p></div>
          </div>
          {[{name:'Minh Anh',major:'Kinh tế đối ngoại',score:96,tags:['Marketing','Excel']},{name:'Hải Nam',major:'CNTT',score:92,tags:['Python','AI']},{name:'Phương Linh',major:'Thiết kế đồ hoạ',score:89,tags:['UI/UX','Design']}].map(u => (
            <div key={u.name} className="flex items-center gap-3 p-3 border border-app-border rounded-input mb-2 hover:bg-green-pale transition-colors">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">{u.name.split(' ').map(w=>w[0]).join('')}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{u.name}</p><p className="text-xs text-text-muted">{u.major}</p>
                <div className="flex gap-1 mt-1">{u.tags.map(t=><span key={t} className="text-[10px] px-2 py-0.5 bg-green-pale text-green-dark rounded-full">{t}</span>)}</div>
              </div>
              <span className="text-base font-extrabold text-green-dark">{u.score}%</span>
            </div>
          ))}
        </motion.div>
      </section>
      <section className="bg-app-surface border-y border-app-border py-8">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(s => <div key={s.label}><p className="text-3xl font-extrabold text-green-dark">{s.num}</p><p className="text-sm text-text-secondary mt-1">{s.label}</p></div>)}
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-green-dark mb-2">Cách hoạt động</h2>
        <p className="text-text-secondary mb-10">Chỉ 4 bước để tìm được bạn học phù hợp nhất</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          {STEPS.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i*0.1 }} viewport={{ once: true }}
              className="bg-app-surface border border-app-border rounded-card p-6 text-center hover:shadow-card transition-shadow">
              <div className="w-13 h-13 bg-green-dark rounded-[14px] flex items-center justify-center text-2xl mx-auto mb-4">{s.icon}</div>
              <h3 className="font-bold text-green-dark mb-2">{s.title}</h3><p className="text-sm text-text-secondary">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="bg-green-dark py-16 text-center text-white">
        <h2 className="text-3xl font-extrabold mb-4">Sẵn sàng học cùng nhau?</h2>
        <p className="text-white/80 mb-8">Tham gia cùng 12,400+ sinh viên đang học thông minh hơn mỗi ngày</p>
        <Link to="/register" className="inline-block px-10 py-4 bg-white text-green-dark font-bold rounded-full hover:bg-green-pale transition-colors text-lg">Bắt đầu miễn phí →</Link>
      </section>
    </div>
  )
}
