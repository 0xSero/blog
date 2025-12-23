import { useState, useEffect, useRef, useCallback } from 'react'
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'

// Pixel-by-pixel render effect for text
const PixelText = ({ text, isVisible, delay = 0 }) => {
  const canvasRef = useRef(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (!isVisible) {
      setRevealed(false)
      return
    }

    const timer = setTimeout(() => setRevealed(true), delay)
    return () => clearTimeout(timer)
  }, [isVisible, delay])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !revealed) return

    const ctx = canvas.getContext('2d')
    const fontSize = 32
    const font = `600 ${fontSize}px system-ui, -apple-system, sans-serif`

    // Measure text
    ctx.font = font
    const metrics = ctx.measureText(text)
    const width = Math.ceil(metrics.width) + 20
    const height = fontSize + 20

    // Set canvas size
    canvas.width = width * 2
    canvas.height = height * 2
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(2, 2)

    // Draw text to get pixel data
    ctx.font = font
    ctx.fillStyle = '#E8E4E0'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 10, height / 2)

    // Get pixel data
    const imageData = ctx.getImageData(0, 0, width * 2, height * 2)
    const pixels = []

    // Sample pixels (every 2px for performance)
    for (let y = 0; y < height * 2; y += 2) {
      for (let x = 0; x < width * 2; x += 2) {
        const i = (y * width * 2 + x) * 4
        if (imageData.data[i + 3] > 128) {
          pixels.push({ x: x / 2, y: y / 2, alpha: 0 })
        }
      }
    }

    // Shuffle pixels for random reveal
    for (let i = pixels.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pixels[i], pixels[j]] = [pixels[j], pixels[i]]
    }

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Animate pixels appearing
    let frame = 0
    const pixelsPerFrame = Math.ceil(pixels.length / 20)

    const animate = () => {
      const start = frame * pixelsPerFrame
      const end = Math.min(start + pixelsPerFrame, pixels.length)

      for (let i = start; i < end; i++) {
        const p = pixels[i]
        ctx.fillStyle = '#E8E4E0'
        ctx.fillRect(p.x, p.y, 1.5, 1.5)
      }

      frame++
      if (frame * pixelsPerFrame < pixels.length) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }, [text, revealed])

  return (
    <canvas ref={canvasRef} className="pointer-events-none" style={{ opacity: revealed ? 1 : 0 }} />
  )
}

// Matrix rain effect background
const MatrixRain = ({ isVisible }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !isVisible) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const chars =
      '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops = Array(columns).fill(1)

    ctx.fillStyle = 'rgba(20, 19, 18, 1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    let animationId
    let frameCount = 0

    const draw = () => {
      // Fade effect
      ctx.fillStyle = 'rgba(20, 19, 18, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = 'rgba(180, 160, 140, 0.3)'
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      frameCount++
      if (frameCount < 150) {
        animationId = requestAnimationFrame(draw)
      }
    }

    draw()

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [isVisible])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 opacity-40"
      style={{ display: isVisible ? 'block' : 'none' }}
    />
  )
}

// Glitch effect on close button
const GlitchButton = ({ onClick }) => {
  const [glitching, setGlitching] = useState(false)

  const handleClick = () => {
    setGlitching(true)
    setTimeout(() => {
      setGlitching(false)
      onClick()
    }, 200)
  }

  return (
    <button
      type="button"
      className={`rounded-lg p-2 text-text-secondary transition-colors hover:text-text-primary ${
        glitching ? 'animate-glitch' : ''
      }`}
      aria-label="Toggle Menu"
      onClick={handleClick}
      style={{
        filter: glitching ? 'hue-rotate(90deg)' : 'none',
        transform: glitching ? 'translateX(2px)' : 'none',
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-6 w-6"
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  )
}

// Scanline overlay
const Scanlines = () => (
  <div
    className="pointer-events-none absolute inset-0 opacity-[0.03]"
    style={{
      backgroundImage:
        'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.3) 1px, rgba(0,0,0,0.3) 2px)',
      backgroundSize: '100% 2px',
    }}
  />
)

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)
  const [showContent, setShowContent] = useState(false)

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        document.body.style.overflow = 'auto'
        setShowContent(false)
      } else {
        document.body.style.overflow = 'hidden'
        // Delay content reveal for dramatic effect
        setTimeout(() => setShowContent(true), 300)
      }
      return !status
    })
  }

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="ml-2 rounded-lg p-2 text-text-secondary transition-colors hover:text-text-primary"
        aria-label="Toggle Menu"
        onClick={onToggleNav}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        className={`fixed inset-0 z-50 transform bg-surface-base transition-all duration-500 ease-out ${
          navShow ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{
          clipPath: navShow
            ? 'circle(150% at calc(100% - 40px) 40px)'
            : 'circle(0% at calc(100% - 40px) 40px)',
          transition: 'clip-path 0.6s ease-out, opacity 0.3s ease-out',
        }}
      >
        {/* Matrix rain background */}
        <MatrixRain isVisible={navShow} />

        {/* Scanline overlay */}
        <Scanlines />

        <div className="relative flex h-full flex-col">
          <div className="flex justify-end p-6">
            <GlitchButton onClick={onToggleNav} />
          </div>

          <nav className="flex flex-1 flex-col items-center justify-center gap-6">
            {headerNavLinks.map((link, index) => (
              <Link
                key={link.title}
                href={link.href}
                className="relative block"
                onClick={onToggleNav}
              >
                <PixelText text={link.title} isVisible={showContent} delay={index * 150} />
                {/* Fallback/hover text */}
                <span
                  className="absolute inset-0 flex items-center justify-center text-2xl font-semibold text-text-primary opacity-0 transition-opacity hover:opacity-100"
                  style={{ textShadow: '0 0 10px rgba(180, 160, 140, 0.5)' }}
                >
                  {link.title}
                </span>
              </Link>
            ))}
          </nav>

          {/* Bottom decoration */}
          <div className="p-6 text-center">
            <div
              className="font-mono text-xs text-text-muted"
              style={{
                opacity: showContent ? 1 : 0,
                transition: 'opacity 0.5s ease-out 0.8s',
              }}
            >
              {'> system.nav.ready_'}
              <span className="animate-pulse">|</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileNav
