const SUBJECTS = ['Toán cao cấp','Vật lý đại cương','Lập trình Python','AI / Machine Learning','Data Science','Mạng máy tính','Marketing số','Kinh tế vi mô','Tài chính doanh nghiệp','Kế toán tài chính','Tiếng Anh học thuật','Tiếng Nhật N3','Thiết kế đồ hoạ','UI / UX Design','Luật dân sự','Y học cơ sở']
export default function SubjectPicker({ selected, onChange }: { selected: string[]; onChange: (s: string[]) => void }) {
  const toggle = (s: string) => onChange(selected.includes(s) ? selected.filter(x=>x!==s) : [...selected, s])
  return (
    <div className="flex flex-wrap gap-2">
      {SUBJECTS.map(s => (
        <button key={s} onClick={() => toggle(s)}
          className={`px-4 py-2 rounded-full text-sm font-medium border-[1.5px] transition-all ${selected.includes(s) ? 'bg-green-pale border-green-dark text-green-dark' : 'bg-app-surface border-app-border text-text-secondary hover:border-green-mid'}`}>
          {s}
        </button>
      ))}
    </div>
  )
}
