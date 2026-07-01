import { motion, AnimatePresence } from 'framer-motion'
import type { ReactNode } from 'react'
export default function WizardStep({ step, title, subtitle, children }: { step: number; title: string; subtitle: string; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.28 }}>
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🐸</div>
          <h2 className="text-2xl font-extrabold text-green-dark">{title}</h2>
          <p className="text-text-secondary mt-2">{subtitle}</p>
        </div>
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
