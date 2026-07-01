import { motion } from 'framer-motion'
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

export function Button({ variant='primary', size='md', loading, children, className='', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary'|'secondary'|'ghost'|'danger'; size?: 'sm'|'md'|'lg'; loading?: boolean }) {
  const v = { primary:'bg-green-dark text-white hover:bg-green-mid', secondary:'bg-transparent border-2 border-green-dark text-green-dark hover:bg-green-pale', ghost:'bg-transparent text-text-secondary hover:bg-green-pale hover:text-green-dark', danger:'bg-red-500 text-white hover:bg-red-600' }
  const s = { sm:'text-sm px-4 py-2', md:'text-base px-6 py-3', lg:'text-lg px-8 py-3.5' }
  return <button className={`inline-flex items-center justify-center font-semibold rounded-full transition-all font-sans ${v[variant]} ${s[size]} ${className}`} disabled={loading||props.disabled} {...props}>{loading && <Spinner size="sm" className="mr-2" />}{children}</button>
}

export function Card({ children, className='', hover=false }: { children: ReactNode; className?: string; hover?: boolean }) {
  return <motion.div className={`bg-app-surface border border-app-border rounded-card p-5 ${hover?'cursor-pointer':''} ${className}`} whileHover={hover?{y:-2,boxShadow:'0 6px 28px rgba(30,90,68,0.14)'}:undefined} transition={{duration:0.2}}>{children}</motion.div>
}

export function Tag({ label }: { label: string }) {
  return <span className="text-xs px-2.5 py-0.5 rounded-full bg-green-pale text-green-dark font-medium">{label}</span>
}

const AVATAR_COLORS = ['bg-emerald-100 text-emerald-800','bg-blue-100 text-blue-800','bg-pink-100 text-pink-800','bg-orange-100 text-orange-800','bg-purple-100 text-purple-800','bg-teal-100 text-teal-800']
export function Avatar({ name, src, size='md', index=0 }: { name: string; src?: string|null; size?: 'sm'|'md'|'lg'|'xl'; index?: number }) {
  const sizes = { sm:'w-8 h-8 text-xs', md:'w-10 h-10 text-sm', lg:'w-14 h-14 text-xl', xl:'w-20 h-20 text-3xl' }
  const initials = name.split(' ').slice(-2).map(w=>w[0]).join('').toUpperCase()
  if (src) return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover`} />
  return <div className={`${sizes[size]} ${AVATAR_COLORS[index%AVATAR_COLORS.length]} rounded-full flex items-center justify-center font-bold flex-shrink-0`}>{initials}</div>
}

export function Input({ label, error, className='', ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  return <div className="w-full">{label&&<label className="block text-sm font-semibold text-text-primary mb-1.5">{label}</label>}<input className={`w-full px-3.5 py-2.5 border-[1.5px] rounded-input text-sm font-sans bg-app-bg text-text-primary border-app-border focus:border-green-dark focus:bg-white outline-none transition-colors ${error?'border-red-400':''} ${className}`} {...props} />{error&&<p className="mt-1 text-xs text-red-500">{error}</p>}</div>
}

export function Spinner({ size='md', className='' }: { size?: 'sm'|'md'|'lg'; className?: string }) {
  const s = { sm:'w-4 h-4 border-2', md:'w-8 h-8 border-[3px]', lg:'w-12 h-12 border-4' }
  return <div className={`${s[size]} border-app-border border-t-green-dark rounded-full animate-spin ${className}`} />
}

export function OnlineDot() { return <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" /> }
