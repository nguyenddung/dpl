import type { Variants } from 'framer-motion'
export const fadeIn: Variants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }
export const fadeInUp: Variants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }
export const staggerContainer: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }
export const slideInLeft: Variants = { hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0, transition: { duration: 0.3 } } }
export const wizardStep: Variants = { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.28 } }, exit: { opacity: 0, x: -30 } }
export const scoreBar = (pct: number): Variants => ({ hidden: { width: 0 }, visible: { width: `${pct}%`, transition: { duration: 0.9, ease: 'easeOut', delay: 0.2 } } })
