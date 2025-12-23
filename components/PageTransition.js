import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'

const PageTransition = ({ children }) => {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)
  const canvasRef = useRef(null)

  useEffect(() => {
    const handleStart = (url) => {
      if (url !== router.asPath) {
        setIsTransitioning(true)
      }
    }

    const handleComplete = () => {
      // Keep transition visible for full 2s
      setTimeout(() => {
        setIsTransitioning(false)
      }, 2000)
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  // Update children after transition starts
  useEffect(() => {
    if (!isTransitioning) {
      setDisplayChildren(children)
    }
  }, [children, isTransitioning])

  // Canvas animation - inverted colors splash
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !isTransitioning) return

    const ctx = canvas.getContext('2d')
    const width = window.innerWidth
    const height = window.innerHeight

    canvas.width = width * 2
    canvas.height = height * 2
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(2, 2)

    // Inverted colors (light on dark -> dark on light)
    const bgColor = '#E8E4E0' // Light cream (inverted from dark)
    const fgColor = '#141312' // Dark (inverted from light text)

    let animationId
    let progress = 0
    const duration = 2000
    const startTime = Date.now()

    // Particles for the transition
    const particles = []
    const particleCount = 150

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 8,
        speedY: (Math.random() - 0.5) * 8,
        life: Math.random(),
      })
    }

    const animate = () => {
      const elapsed = Date.now() - startTime
      progress = Math.min(elapsed / duration, 1)

      // Clear with inverted background
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, width, height)

      // Expanding circle from center
      const maxRadius = Math.sqrt(width * width + height * height)
      const circleProgress = easeInOutCubic(Math.min(progress * 2, 1))
      const shrinkProgress = progress > 0.5 ? easeInOutCubic((progress - 0.5) * 2) : 0

      // Draw main circle
      ctx.beginPath()
      ctx.arc(
        width / 2,
        height / 2,
        maxRadius * circleProgress * (1 - shrinkProgress * 0.3),
        0,
        Math.PI * 2
      )
      ctx.fillStyle = fgColor
      ctx.globalAlpha = 0.1 + 0.2 * Math.sin(progress * Math.PI)
      ctx.fill()
      ctx.globalAlpha = 1

      // Draw particles
      particles.forEach((p, i) => {
        p.x += p.speedX * (1 - progress)
        p.y += p.speedY * (1 - progress)
        p.life -= 0.005

        if (p.life > 0) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
          ctx.fillStyle = fgColor
          ctx.globalAlpha = p.life * 0.6
          ctx.fill()
          ctx.globalAlpha = 1
        }
      })

      // Scan lines effect
      ctx.fillStyle = fgColor
      for (let y = 0; y < height; y += 4) {
        ctx.globalAlpha = 0.03
        ctx.fillRect(0, y, width, 1)
      }
      ctx.globalAlpha = 1

      // Center text
      const textProgress = progress > 0.2 && progress < 0.8 ? 1 : 0
      if (textProgress) {
        ctx.font = '600 14px system-ui, -apple-system, sans-serif'
        ctx.fillStyle = fgColor
        ctx.textAlign = 'center'
        ctx.globalAlpha = Math.sin(((progress - 0.2) * Math.PI) / 0.6) * 0.8
        ctx.fillText('LOADING', width / 2, height / 2)

        // Blinking cursor
        if (Math.floor(elapsed / 300) % 2 === 0) {
          const textWidth = ctx.measureText('LOADING').width
          ctx.fillRect(width / 2 + textWidth / 2 + 4, height / 2 - 8, 2, 16)
        }
        ctx.globalAlpha = 1
      }

      // Glitch bars
      if (Math.random() > 0.95) {
        const barY = Math.random() * height
        const barHeight = Math.random() * 20 + 5
        ctx.fillStyle = fgColor
        ctx.globalAlpha = 0.3
        ctx.fillRect(0, barY, width, barHeight)
        ctx.globalAlpha = 1
      }

      if (progress < 1) {
        animationId = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [isTransitioning])

  return (
    <>
      {displayChildren}
      {isTransitioning && (
        <div className="pointer-events-none fixed inset-0 z-[100]">
          <canvas
            ref={canvasRef}
            className="absolute inset-0"
            style={{ backgroundColor: '#E8E4E0' }}
          />
        </div>
      )}
    </>
  )
}

// Easing function
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export default PageTransition
