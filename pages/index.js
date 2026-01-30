import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { patternConfigs, createPattern, resolvePatternFromParam } from '@/lib/patterns'

// ============================================================================
// SPLASH SCREEN - 10 Animated Patterns
// ============================================================================

// Palette (dark paper + light ink aesthetic)
const palette = {
  base: 'hsl(30, 5%, 10.5%)',
  center: 'hsl(40, 30%, 96%)',
  inkFaint: 'hsla(35, 12%, 55%, 0.2)',
}

// Fiber background texture
const buildFibers = (width, height) => {
  const fibers = []
  const count = Math.round(Math.min(width, height) / 60)
  for (let i = 0; i < count; i++) {
    fibers.push({
      x: Math.random() * width,
      y: Math.random() * height,
      length: 0.08 * width + Math.random() * 0.16 * width,
      angle: -0.35 + Math.random() * 0.7,
      alpha: 0.02 + Math.random() * 0.04,
    })
  }
  return fibers
}

const drawPaper = (ctx, width, height, fibers) => {
  ctx.fillStyle = palette.base
  ctx.fillRect(0, 0, width, height)

  ctx.save()
  ctx.strokeStyle = palette.inkFaint
  fibers.forEach((fiber) => {
    ctx.globalAlpha = fiber.alpha
    ctx.lineWidth = 0.6
    ctx.beginPath()
    ctx.moveTo(fiber.x, fiber.y)
    ctx.lineTo(
      fiber.x + Math.cos(fiber.angle) * fiber.length,
      fiber.y + Math.sin(fiber.angle) * fiber.length
    )
    ctx.stroke()
  })
  ctx.restore()
}

const drawCenterDisc = (ctx, centerX, centerY, radius, transitionProgress) => {
  ctx.save()
  ctx.globalAlpha = 0.98
  ctx.fillStyle = palette.center
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  if (transitionProgress > 0) {
    ctx.fillStyle = `hsla(40, 30%, 96%, ${transitionProgress})`
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function Index() {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentPatternKey, setCurrentPatternKey] = useState(null)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const transitionRef = useRef(false)
  const transitionProgressRef = useRef(0)
  const contentWrapperRef = useRef(null)
  const activeConfigRef = useRef(null)
  const patternRef = useRef(null)

  const handleEnter = () => {
    setIsTransitioning(true)
    transitionRef.current = true
    sessionStorage.setItem('sybil_visited', 'true')
    setTimeout(() => {
      router.push('/home')
    }, 1200)
  }

  const handlePatternChange = (key) => {
    if (key === currentPatternKey) return
    setCurrentPatternKey(key)

    // Update URL without page reload
    const url = new URL(window.location.href)
    url.searchParams.set('pattern', key)
    window.history.replaceState({}, '', url)
  }

  useEffect(() => {
    // Reset all state on mount (important for back navigation)
    transitionRef.current = false
    transitionProgressRef.current = 0
    setIsTransitioning(false)
    setIsLoaded(false)

    const params = new URLSearchParams(window.location.search)

    const timer = setTimeout(() => setIsLoaded(true), 100)

    const canvas = canvasRef.current
    if (!canvas) {
      return () => clearTimeout(timer)
    }

    const ctx = canvas.getContext('2d')
    let canvasScale = 1
    let fibers = []
    let startTime = performance.now()
    let contentBounds = { width: 0, height: 0 }

    // Resolve pattern from URL or pick random
    const patternParam = params.get('pattern')
    const initialConfig = resolvePatternFromParam(patternParam)
    activeConfigRef.current = initialConfig
    setCurrentPatternKey(initialConfig.key)

    const getPatternConfig = (width, config) => {
      const isMobile = width < 640
      return {
        ...config,
        golGridSize: isMobile ? 8 : 12,
      }
    }

    const getClearRadius = (width, height) => {
      const minDim = Math.min(width, height)
      const isMobile = width < 640
      const contentDiameter = Math.max(contentBounds.width, contentBounds.height)
      const contentRadius = contentDiameter * 0.5
      const padding = contentRadius * (isMobile ? 0.2 : 0.1)
      const targetRadius = contentRadius + padding
      const maxRadius = minDim * 0.48

      return Math.min(targetRadius, maxRadius)
    }

    const createPatternInstance = (width, height) => {
      const config = activeConfigRef.current
      const patternConfig = getPatternConfig(width, config)
      const clearRadius = getClearRadius(width, height)
      return createPattern(config.key, width, height, patternConfig, clearRadius)
    }

    const resize = () => {
      canvasScale = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * canvasScale
      canvas.height = window.innerHeight * canvasScale
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(canvasScale, 0, 0, canvasScale, 0, 0)

      const width = window.innerWidth
      const height = window.innerHeight
      fibers = buildFibers(width, height)
      patternRef.current = createPatternInstance(width, height)

      if (contentWrapperRef.current) {
        const rect = contentWrapperRef.current.getBoundingClientRect()
        contentBounds = {
          width: rect.width,
          height: rect.height,
        }
        patternRef.current = createPatternInstance(width, height)
      }
    }

    resize()
    window.addEventListener('resize', resize)

    const animate = (currentTime) => {
      const width = canvas.width / canvasScale
      const height = canvas.height / canvasScale
      const centerX = width / 2
      const centerY = height / 2
      const config = activeConfigRef.current
      const clearRadius = getClearRadius(width, height)

      // Calculate cycle time (t in 0..1) - loops continuously
      const elapsed = currentTime - startTime
      const cycleT = (elapsed % config.cycleMs) / config.cycleMs

      // Draw paper background
      drawPaper(ctx, width, height, fibers)

      // Render active pattern
      if (patternRef.current) {
        patternRef.current.render(ctx, cycleT)
      }

      // Draw center disc
      if (transitionRef.current) {
        transitionProgressRef.current = Math.min(transitionProgressRef.current + 0.015, 1)
      }
      drawCenterDisc(ctx, centerX, centerY, clearRadius, transitionProgressRef.current)

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [router])

  // Handle pattern changes
  useEffect(() => {
    if (!currentPatternKey || !activeConfigRef.current) return

    if (currentPatternKey !== activeConfigRef.current.key) {
      const newConfig = patternConfigs.find((p) => p.key === currentPatternKey)
      if (newConfig) {
        activeConfigRef.current = newConfig
        const width = window.innerWidth
        const height = window.innerHeight

        const contentDiameter = contentWrapperRef.current
          ? Math.max(
              contentWrapperRef.current.getBoundingClientRect().width,
              contentWrapperRef.current.getBoundingClientRect().height
            )
          : Math.min(width, height) * 0.4
        const contentRadius = contentDiameter * 0.5
        const padding = contentRadius * (width < 640 ? 0.2 : 0.1)
        const clearRadius = Math.min(contentRadius + padding, Math.min(width, height) * 0.48)

        patternRef.current = createPattern(currentPatternKey, width, height, newConfig, clearRadius)
      }
    }
  }, [currentPatternKey])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleEnter()
    }
  }

  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />

      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0"
        style={{ backgroundColor: 'hsl(30, 5%, 10.5%)' }}
      />

      {/* Content overlay */}
      <div
        className={`fixed inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Content wrapper for measurement */}
        <div ref={contentWrapperRef} className="flex flex-col items-center">
          {/* Title */}
          <h1
            className={`relative z-10 mb-2 text-xl font-bold tracking-tight transition-all duration-1000 sm:mb-4 sm:text-3xl md:text-6xl ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{
              color: '#3D2B1F',
              fontFamily: 'Georgia, serif',
            }}
          >
            Sybil Solutions
          </h1>

          {/* Enter button */}
          <button
            onClick={handleEnter}
            onKeyPress={handleKeyPress}
            className={`group relative z-10 mt-4 overflow-hidden border-2 px-4 py-2 text-sm font-medium transition-all duration-1000 sm:mt-8 sm:px-8 sm:py-3 sm:text-lg ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{
              borderColor: '#8B5A2B',
              color: '#8B5A2B',
              backgroundColor: 'rgba(245, 240, 232, 0.8)',
              transitionDelay: '200ms',
            }}
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
              Enter
            </span>
            <div
              className="absolute inset-0 -translate-y-full transition-transform duration-300 group-hover:translate-y-0"
              style={{ backgroundColor: '#8B5A2B' }}
            />
          </button>

          {/* Tagline */}
          <p
            className={`relative z-10 mt-3 text-[10px] tracking-widest transition-all duration-1000 sm:mt-6 sm:text-sm ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{
              color: 'rgba(139, 90, 43, 0.7)',
              transitionDelay: '400ms',
            }}
          >
            SOFTWARE &bull; AI &bull; AUTOMATION
          </p>
        </div>
      </div>

      {/* Pattern Tab Switcher */}
      <div
        className={`fixed bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#8B5A2B]/30 bg-[#F5F0E8]/90 px-3 py-2 shadow-lg backdrop-blur-sm transition-all duration-1000 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
        style={{ transitionDelay: '600ms' }}
      >
        {patternConfigs.map((pattern) => (
          <button
            key={pattern.key}
            onClick={() => handlePatternChange(pattern.key)}
            className={`group relative flex h-2.5 w-2.5 items-center justify-center rounded-full transition-all duration-300 sm:h-3 sm:w-3 ${
              currentPatternKey === pattern.key ? 'scale-125' : 'hover:scale-110'
            }`}
            title={pattern.name}
            aria-label={`Switch to ${pattern.name} animation`}
          >
            <span
              className={`h-full w-full rounded-full transition-all duration-300 ${
                currentPatternKey === pattern.key
                  ? 'bg-[#8B5A2B]'
                  : 'bg-[#8B5A2B]/30 group-hover:bg-[#8B5A2B]/50'
              }`}
            />
            {/* Tooltip */}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#3D2B1F] px-2 py-1 text-[10px] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {pattern.name}
            </span>
          </button>
        ))}
      </div>
    </>
  )
}

// No layout wrapper for portal page
Index.getLayout = function getLayout(page) {
  return page
}
