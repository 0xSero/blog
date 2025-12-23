// ============================================================================
// PATTERN: WATCHING EYES (Dark Forest)
// Symmetric rings of eyes watching the portal - covering entire screen
// ============================================================================

const TAU = Math.PI * 2
const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
const envelope = (t) => Math.sin(t * Math.PI)
const triangle = (t) => 1 - Math.abs(2 * t - 1)
const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

const palette = {
  base: 'hsl(30, 5%, 10.5%)',
  baseDeep: 'hsl(30, 5%, 6%)',
  ink: 'hsla(40, 20%, 92%, 0.75)',
  inkBright: 'hsla(40, 25%, 95%, 0.9)',
  inkSoft: 'hsla(35, 18%, 70%, 0.45)',
  glow: 'hsla(40, 25%, 88%, 0.25)',
  highlight: 'hsla(45, 35%, 85%, 0.5)',
  highlightBright: 'hsla(45, 40%, 92%, 0.7)',
  highlightSubtle: 'hsla(40, 25%, 75%, 0.2)',
}

export const config = {
  key: 'metamorph',
  name: 'Watching Eyes',
  cycleMs: 6000,
  clearRadius: 0.24,
}

export class WatchingEyes {
  constructor(width, height, clearRadius, options = {}) {
    this.width = width
    this.height = height
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
    this.config = { ...config, ...options }
    this.eyes = []
    this.rings = []
    this.build()
  }

  build() {
    const cx = this.centerX
    const cy = this.centerY

    // Use diagonal to cover corners
    const maxRadius = Math.sqrt(cx * cx + cy * cy) * 1.1
    const minRadius = this.clearRadius * 1.2

    // More rings, better spacing
    const ringCount = 12

    this.rings = []
    this.eyes = []

    for (let r = 0; r < ringCount; r++) {
      const ringT = r / (ringCount - 1)
      const ringRadius = minRadius + (maxRadius - minRadius) * ringT

      // Spacing: fewer eyes in inner rings, more in outer
      const circumference = TAU * ringRadius
      const eyeSpacing = 65 // pixels between eyes
      const eyeCount = Math.max(6, Math.floor(circumference / eyeSpacing))

      // Size: smaller near center, larger at edges
      const baseSize = 16 + ringT * 12

      const ring = {
        radius: ringRadius,
        eyeCount,
        baseSize,
        ringIndex: r,
        eyes: [],
      }

      // Offset alternate rings for more organic feel
      const ringOffset = (r % 2) * (Math.PI / eyeCount)

      for (let e = 0; e < eyeCount; e++) {
        const angle = (e / eyeCount) * TAU + ringOffset
        const x = cx + Math.cos(angle) * ringRadius
        const y = cy + Math.sin(angle) * ringRadius

        // Unique phase for each eye - creates wave patterns
        const phase = (r * 0.13 + e * 0.07) % 1

        const eye = {
          x,
          y,
          baseAngle: angle,
          size: baseSize * (0.9 + Math.random() * 0.2),
          ringIndex: r,
          eyeIndex: e,
          phase,
          ringT,
          // Individual blink timing - staggered across the pattern
          blinkPhase: (r * 0.17 + e * 0.11 + Math.random() * 0.1) % 1,
          blinkSpeed: 0.8 + Math.random() * 0.6,
        }

        ring.eyes.push(eye)
        this.eyes.push(eye)
      }

      this.rings.push(ring)
    }
  }

  drawEyeShape(ctx, width, height) {
    ctx.beginPath()
    ctx.moveTo(-width, 0)
    ctx.bezierCurveTo(-width * 0.5, -height, width * 0.5, -height, width, 0)
    ctx.bezierCurveTo(width * 0.5, height, -width * 0.5, height, -width, 0)
    ctx.closePath()
  }

  drawEye(ctx, eye, t, globalAlpha) {
    const { x, y, size, baseAngle, phase, blinkPhase, blinkSpeed } = eye

    // Independent blink per eye - quick close, slow open
    const blinkT = (t * blinkSpeed + blinkPhase) % 1
    let openness
    if (blinkT < 0.05) {
      // Closing
      openness = 1 - blinkT / 0.05
    } else if (blinkT < 0.15) {
      // Opening
      openness = (blinkT - 0.05) / 0.1
    } else {
      // Open
      openness = 1
    }

    // Skip nearly closed eyes
    if (openness < 0.08 || globalAlpha < 0.01) return

    // All eyes watch the center
    const watchAngle = baseAngle + Math.PI

    // Subtle iris drift
    const irisWander = Math.sin(t * TAU * 0.5 + phase * TAU) * 0.12

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(watchAngle)

    const eyeWidth = size * 1.1
    const eyeHeight = size * 0.5 * openness
    const strokeW = 0.6 + size * 0.018

    // Outer glow
    ctx.globalAlpha = globalAlpha * 0.06
    ctx.fillStyle = palette.glow
    this.drawEyeShape(ctx, eyeWidth * 1.2, eyeHeight * 1.3)
    ctx.fill()

    // Sclera
    ctx.globalAlpha = globalAlpha * 0.12 * openness
    ctx.fillStyle = palette.highlight
    this.drawEyeShape(ctx, eyeWidth, eyeHeight)
    ctx.fill()

    // Eye outline
    ctx.globalAlpha = globalAlpha * 0.5
    ctx.strokeStyle = palette.ink
    ctx.lineWidth = strokeW
    this.drawEyeShape(ctx, eyeWidth, eyeHeight)
    ctx.stroke()

    // Upper lid crease
    ctx.globalAlpha = globalAlpha * 0.18
    ctx.strokeStyle = palette.inkSoft
    ctx.lineWidth = strokeW * 0.5
    ctx.beginPath()
    ctx.moveTo(-eyeWidth * 0.7, -eyeHeight * 0.25)
    ctx.bezierCurveTo(
      -eyeWidth * 0.2,
      -eyeHeight * 1.15,
      eyeWidth * 0.2,
      -eyeHeight * 1.15,
      eyeWidth * 0.7,
      -eyeHeight * 0.25
    )
    ctx.stroke()

    // Iris position
    const irisX = irisWander * size * 0.15
    const irisY = 0
    const irisRadius = size * 0.26 * openness

    // Iris
    ctx.globalAlpha = globalAlpha * 0.5
    ctx.fillStyle = palette.ink
    ctx.beginPath()
    ctx.arc(irisX, irisY, irisRadius, 0, TAU)
    ctx.fill()

    // Iris ring detail
    if (irisRadius > 3.5) {
      ctx.globalAlpha = globalAlpha * 0.12
      ctx.strokeStyle = palette.highlightSubtle
      ctx.lineWidth = irisRadius * 0.08
      ctx.beginPath()
      ctx.arc(irisX, irisY, irisRadius * 0.72, 0, TAU)
      ctx.stroke()
    }

    // Pupil
    const pupilRadius = irisRadius * 0.42
    ctx.globalAlpha = globalAlpha * 0.85
    ctx.fillStyle = palette.baseDeep
    ctx.beginPath()
    ctx.arc(irisX, irisY, pupilRadius, 0, TAU)
    ctx.fill()

    // Primary reflection
    ctx.globalAlpha = globalAlpha * 0.6
    ctx.fillStyle = palette.highlightBright
    ctx.beginPath()
    ctx.arc(irisX - irisRadius * 0.28, irisY - irisRadius * 0.32, pupilRadius * 0.32, 0, TAU)
    ctx.fill()

    // Secondary reflection
    ctx.globalAlpha = globalAlpha * 0.3
    ctx.beginPath()
    ctx.arc(irisX + irisRadius * 0.22, irisY + irisRadius * 0.18, pupilRadius * 0.12, 0, TAU)
    ctx.fill()

    ctx.restore()
  }

  render(ctx, t) {
    const progress = triangle(t)
    const alpha = envelope(t)
    const intensity = smoothstep(0, 1, progress)

    ctx.save()
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const ringCount = this.rings.length

    // Layer 1: Subtle web threads between rings
    for (let r = 0; r < ringCount - 1; r++) {
      const innerRing = this.rings[r]
      const outerRing = this.rings[r + 1]
      const revealT = clamp((progress - (r / ringCount) * 0.4) * 2, 0, 1)

      if (revealT < 0.01) continue

      innerRing.eyes.forEach((innerEye, i) => {
        const outerIdx =
          Math.round((i / innerRing.eyeCount) * outerRing.eyeCount) % outerRing.eyeCount
        const outerEye = outerRing.eyes[outerIdx]
        if (!outerEye) return

        const pulse = Math.sin(t * TAU * 1.5 + innerEye.phase * TAU) * 0.35 + 0.5

        ctx.globalAlpha = alpha * 0.025 * revealT * pulse * intensity
        ctx.strokeStyle = palette.glow
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(innerEye.x, innerEye.y)
        ctx.lineTo(outerEye.x, outerEye.y)
        ctx.stroke()
      })
    }

    // Layer 2: Ring arcs
    this.rings.forEach((ring, r) => {
      const revealT = clamp((progress - (r / ringCount) * 0.35) * 2, 0, 1)
      if (revealT < 0.01) return

      const pulse = Math.sin(t * TAU * 1.2 - r * 0.4) * 0.35 + 0.55

      ctx.globalAlpha = alpha * 0.02 * revealT * pulse * intensity
      ctx.strokeStyle = palette.glow
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(this.centerX, this.centerY, ring.radius, 0, TAU)
      ctx.stroke()
    })

    // Layer 3: Eyes - reveal from center outward
    this.rings.forEach((ring, r) => {
      const ringT = r / ringCount
      const revealT = clamp((progress - ringT * 0.4) * 2.2, 0, 1)

      if (revealT < 0.01) return

      ring.eyes.forEach((eye) => {
        this.drawEye(ctx, eye, t, alpha * revealT)
      })
    })

    ctx.restore()
  }
}

export default WatchingEyes
