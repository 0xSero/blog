import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'

/**
 * Page transition variants - smooth fade and slide
 */
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1],
    },
  },
}

/**
 * Child element variants for staggered reveal
 */
const childVariants = {
  initial: { opacity: 0, y: 10 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
}

/**
 * PageTransition - Wraps page content with enter/exit animations
 *
 * @param {React.ReactNode} children - Page content
 * @param {string} className - Optional className
 */
export function PageTransition({ children, className = '' }) {
  const router = useRouter()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={router.asPath}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * PageSection - Animated section within a page (staggered reveal)
 *
 * @param {React.ReactNode} children - Section content
 * @param {string} className - Optional className
 * @param {number} delay - Animation delay offset
 */
export function PageSection({ children, className = '', delay = 0 }) {
  return (
    <motion.div variants={childVariants} custom={delay} className={className}>
      {children}
    </motion.div>
  )
}

/**
 * FadeIn - Simple fade in animation
 */
export function FadeIn({ children, className = '', delay = 0, duration = 0.4 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * SlideUp - Slide up and fade in
 */
export function SlideUp({ children, className = '', delay = 0, duration = 0.4 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default PageTransition
