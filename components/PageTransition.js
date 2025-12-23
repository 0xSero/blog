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

  useEffect(() => {
    if (!isTransitioning) {
      setDisplayChildren(children)
    }
  }, [children, isTransitioning])

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !isTransitioning) return

    const ctx = canvas.getContext('2d')
    const width = window.innerWidth
    const height = window.innerHeight
    const centerX = width / 2
    const centerY = height / 2

    canvas.width = width * 2
    canvas.height = height * 2
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(2, 2)

    // Colors - inverted (white bg, dark elements)
    const bgColor = '#E8E4E0'
    const darkColor = '#141312'
    const accentColor = '#8B7355'

    let animationId
    const startTime = Date.now()
    const duration = 2000

    // Orbiting particles around center
    const orbitParticles = []
    for (let i = 0; i < 60; i++) {
      orbitParticles.push({
        angle: (Math.PI * 2 * i) / 60,
        radius: 80 + Math.random() * 100,
        speed: 0.02 + Math.random() * 0.03,
        size: 1 + Math.random() * 3,
        offset: Math.random() * Math.PI * 2,
      })
    }

    // Ripple rings
    const ripples = []
    for (let i = 0; i < 5; i++) {
      ripples.push({
        radius: 0,
        maxRadius: 300 + i * 80,
        delay: i * 150,
        width: 2 + i * 0.5,
      })
    }

    // Flying particles from edges
    const flyingParticles = []
    for (let i = 0; i < 40; i++) {
      const edge = Math.floor(Math.random() * 4)
      let x, y, vx, vy
      switch (edge) {
        case 0:
          x = Math.random() * width
          y = 0
          vx = (centerX - x) * 0.01
          vy = 3
          break
        case 1:
          x = width
          y = Math.random() * height
          vx = -3
          vy = (centerY - y) * 0.01
          break
        case 2:
          x = Math.random() * width
          y = height
          vx = (centerX - x) * 0.01
          vy = -3
          break
        case 3:
          x = 0
          y = Math.random() * height
          vx = 3
          vy = (centerY - y) * 0.01
          break
      }
      flyingParticles.push({ x, y, vx, vy, size: 1 + Math.random() * 2, life: 1 })
    }

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Clear with white/cream background
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, width, height)

      // Draw ripple rings expanding from center
      ripples.forEach((ripple) => {
        const rippleElapsed = elapsed - ripple.delay
        if (rippleElapsed > 0) {
          const rippleProgress = Math.min(rippleElapsed / 1000, 1)
          const currentRadius = ripple.maxRadius * easeOutCubic(rippleProgress)
          const alpha = 1 - rippleProgress

          ctx.beginPath()
          ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2)
          ctx.strokeStyle = darkColor
          ctx.globalAlpha = alpha * 0.3
          ctx.lineWidth = ripple.width
          ctx.stroke()
          ctx.globalAlpha = 1
        }
      })

      // Draw orbiting particles
      orbitParticles.forEach((p) => {
        p.angle += p.speed
        const wobble = Math.sin(elapsed * 0.003 + p.offset) * 20
        const x = centerX + Math.cos(p.angle) * (p.radius + wobble)
        const y = centerY + Math.sin(p.angle) * (p.radius + wobble)

        ctx.beginPath()
        ctx.arc(x, y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = darkColor
        ctx.globalAlpha = 0.6
        ctx.fill()
        ctx.globalAlpha = 1

        // Trail
        for (let t = 1; t <= 3; t++) {
          const trailAngle = p.angle - p.speed * t * 3
          const tx = centerX + Math.cos(trailAngle) * (p.radius + wobble)
          const ty = centerY + Math.sin(trailAngle) * (p.radius + wobble)
          ctx.beginPath()
          ctx.arc(tx, ty, p.size * (1 - t * 0.25), 0, Math.PI * 2)
          ctx.fillStyle = darkColor
          ctx.globalAlpha = 0.2 - t * 0.05
          ctx.fill()
        }
        ctx.globalAlpha = 1
      })

      // Draw flying particles toward center
      flyingParticles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        // Accelerate toward center
        const dx = centerX - p.x
        const dy = centerY - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist > 50) {
          p.vx += dx * 0.0005
          p.vy += dy * 0.0005
        }

        if (dist < 100) {
          p.life -= 0.02
        }

        if (p.life > 0) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
          ctx.fillStyle = accentColor
          ctx.globalAlpha = p.life * 0.8
          ctx.fill()
          ctx.globalAlpha = 1
        }
      })

      // Center dark circle - always present
      const pulseScale = 1 + Math.sin(elapsed * 0.008) * 0.1
      const circleRadius = 40 * pulseScale

      // Outer glow
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        circleRadius * 0.5,
        centerX,
        centerY,
        circleRadius * 2
      )
      gradient.addColorStop(0, 'rgba(20, 19, 18, 0.3)')
      gradient.addColorStop(1, 'rgba(20, 19, 18, 0)')
      ctx.beginPath()
      ctx.arc(centerX, centerY, circleRadius * 2, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // Main dark circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2)
      ctx.fillStyle = darkColor
      ctx.fill()

      // Inner highlight
      ctx.beginPath()
      ctx.arc(
        centerX - circleRadius * 0.2,
        centerY - circleRadius * 0.2,
        circleRadius * 0.3,
        0,
        Math.PI * 2
      )
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.fill()

      // Rotating arcs around center circle
      const arcCount = 3
      for (let i = 0; i < arcCount; i++) {
        const arcAngle = elapsed * 0.002 + (Math.PI * 2 * i) / arcCount
        const arcRadius = circleRadius + 15 + i * 10

        ctx.beginPath()
        ctx.arc(centerX, centerY, arcRadius, arcAngle, arcAngle + Math.PI * 0.5)
        ctx.strokeStyle = darkColor
        ctx.globalAlpha = 0.4 - i * 0.1
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      // Subtle scan line effect
      ctx.fillStyle = darkColor
      for (let y = 0; y < height; y += 3) {
        ctx.globalAlpha = 0.015
        ctx.fillRect(0, y, width, 1)
      }
      ctx.globalAlpha = 1

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

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

export default PageTransition
