import { motion } from 'framer-motion'

/**
 * SharedElement - Enables morphing transitions between pages
 *
 * Usage:
 *   <SharedElement id="hero-title">
 *     <h1>Title</h1>
 *   </SharedElement>
 *
 * When navigating between pages, elements with matching `id` props
 * will smoothly morph from one position/size to another.
 *
 * @param {string} id - Unique identifier for the shared element (layoutId)
 * @param {React.ReactNode} children - Content to render
 * @param {string} className - Optional className
 * @param {object} transition - Animation transition config
 */
export function SharedElement({
  id,
  children,
  className = '',
  transition = { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
}) {
  return (
    <motion.div layoutId={id} transition={transition} className={className}>
      {children}
    </motion.div>
  )
}

/**
 * SharedImage - Shared element optimized for images
 *
 * @param {string} id - Unique identifier
 * @param {string} src - Image source
 * @param {string} alt - Alt text
 * @param {string} className - Optional className
 */
export function SharedImage({ id, src, alt, className = '', ...props }) {
  return (
    <motion.div layoutId={id} transition={{ duration: 0.5 }}>
      <motion.img
        src={src}
        alt={alt}
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        {...props}
      />
    </motion.div>
  )
}

/**
 * SharedCard - Shared element for card-like content
 *
 * @param {string} id - Unique identifier
 * @param {React.ReactNode} children - Card content
 * @param {string} className - Optional className
 * @param {function} onClick - Click handler
 */
export function SharedCard({ id, children, className = '', onClick, ...props }) {
  return (
    <motion.div
      layoutId={id}
      onClick={onClick}
      className={className}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default SharedElement
