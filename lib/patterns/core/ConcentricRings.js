// ============================================================================
// PATTERN: TRIANGULATED TIME MACHINE (Concentric Rings)
// Sacred geometry rings with wave pulses, energy flows, and depth
// ============================================================================

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
const envelope = (t) => Math.sin(t * Math.PI)
const triangle = (t) => 1 - Math.abs(2 * t - 1)

const palette = {
  base: 'hsl(30, 5%, 10.5%)',
  ink: 'hsla(40, 20%, 92%, 0.75)',
  inkBright: 'hsla(40, 25%, 95%, 0.9)',
  glow: 'hsla(40, 25%, 88%, 0.35)',
  warmPulse: 'hsla(35, 40%, 75%, 0.6)',
  highlight: 'hsla(45, 35%, 85%, 0.5)',
  highlightBright: 'hsla(45, 40%, 92%, 0.7)',
  highlightSubtle: 'hsla(40, 25%, 75%, 0.25)',
}

export const config = {
  key: 'tri',
  name: 'Triangulated Time Machine',
  cycleMs: 6500,
  flipWaves: 4,
  swirl: 0.75,
  clearRadius: 0.23,
}

export class TriangulatedRings {
  constructor(width, height, clearRadius, options = {}) {
    this.width = width
    this.height = height
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
    this.config = { ...config, ...options }
    this.rings = []
    this.radialLines = []
    this.connections = []
    this.build()
  }

  build() {
    const { swirl } = this.config
    const cx = this.centerX
    const cy = this.centerY
    const maxRadius = Math.min(cx, cy) - 25
    const ringCount = 10
    const minRadius = this.clearRadius * 1.05

    // Create concentric rings with varying density
    for (let r = 0; r < ringCount; r++) {
      const ringT = r / (ringCount - 1)
      const ringRadius = minRadius + (maxRadius - minRadius) * ringT

      // More points in outer rings, fewer in inner
      const pointsInRing = Math.floor(8 + r * 5)
      const ring = []

      // Alternate ring rotation for visual interest
      const ringRotation = (r % 2) * (Math.PI / pointsInRing) * 0.5

      for (let p = 0; p < pointsInRing; p++) {
        const baseAngle = (p / pointsInRing) * Math.PI * 2 + ringRotation

        // Organic wobble that varies by ring
        const wobble = Math.sin(baseAngle * 3 + r * 1.2) * swirl * 8
        const angle = baseAngle + Math.sin(ringRadius * 0.015 + r) * swirl * 0.2

        const x = cx + Math.cos(angle) * (ringRadius + wobble)
        const y = cy + Math.sin(angle) * (ringRadius + wobble)

        ring.push({
          x,
          y,
          ringIdx: r,
          pointIdx: p,
          angle,
          radius: ringRadius,
          baseAngle,
        })
      }

      this.rings.push(ring)
    }

    // Create radial connections (spokes)
    for (let r = 0; r < ringCount - 1; r++) {
      const innerRing = this.rings[r]
      const outerRing = this.rings[r + 1]

      innerRing.forEach((innerPt) => {
        // Find 1-2 nearest points in outer ring
        const distances = outerRing.map((pt, j) => ({
          pt,
          idx: j,
          dist: Math.sqrt((pt.x - innerPt.x) ** 2 + (pt.y - innerPt.y) ** 2),
        }))
        distances.sort((a, b) => a.dist - b.dist)

        // Connect to nearest
        this.radialLines.push({
          from: innerPt,
          to: distances[0].pt,
          ringIdx: r,
          isRadial: true,
        })

        // Sometimes connect to second nearest for triangulation
        if (distances[1] && distances[1].dist < distances[0].dist * 1.8) {
          this.radialLines.push({
            from: innerPt,
            to: distances[1].pt,
            ringIdx: r,
            isRadial: true,
          })
        }
      })
    }

    // Ring connections (arcs)
    this.rings.forEach((ring, r) => {
      ring.forEach((pt, i) => {
        const next = ring[(i + 1) % ring.length]
        this.connections.push({
          from: pt,
          to: next,
          ringIdx: r,
          isArc: true,
        })
      })
    })
  }

  render(ctx, t) {
    const { flipWaves } = this.config
    const ringCount = this.rings.length

    const progress = triangle(t)
    const alpha = envelope(t)

    // Multiple wave frequencies for complex interference
    const wave1 = t * Math.PI * 2 * flipWaves
    const wave2 = t * Math.PI * 2 * (flipWaves * 1.5)
    const wave3 = t * Math.PI * 2 * 0.7 // Slow rotation

    ctx.save()
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // Layer 1: Subtle background glow for depth
    this.rings.forEach((ring, r) => {
      const ringT = r / ringCount
      if (progress < ringT * 0.7) return

      const glowIntensity = Math.sin(wave1 - r * 0.6) * 0.3 + 0.4
      ctx.globalAlpha = alpha * 0.06 * glowIntensity

      ctx.strokeStyle = palette.highlightSubtle
      ctx.lineWidth = 12
      ctx.beginPath()
      ring.forEach((pt, i) => {
        i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)
      })
      ctx.closePath()
      ctx.stroke()
    })

    // Layer 2: Radial lines (spokes) with energy pulse
    this.radialLines.forEach((line) => {
      const ringT = line.ringIdx / ringCount
      if (progress < ringT * 0.75) return

      // Energy travels along radial lines
      const pulsePos = (wave1 / (Math.PI * 2) + line.from.baseAngle / (Math.PI * 2)) % 1
      const pulseIntensity = Math.sin(pulsePos * Math.PI * 2) * 0.5 + 0.5

      // Outer glow
      ctx.globalAlpha = alpha * 0.15 * pulseIntensity
      ctx.strokeStyle = palette.glow
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(line.from.x, line.from.y)
      ctx.lineTo(line.to.x, line.to.y)
      ctx.stroke()

      // Main line
      ctx.globalAlpha = alpha * (0.25 + pulseIntensity * 0.35)
      ctx.strokeStyle = palette.ink
      ctx.lineWidth = 0.8 + pulseIntensity * 0.5
      ctx.beginPath()
      ctx.moveTo(line.from.x, line.from.y)
      ctx.lineTo(line.to.x, line.to.y)
      ctx.stroke()

      // Highlight on bright pulses
      if (pulseIntensity > 0.7) {
        ctx.globalAlpha = (alpha * 0.3 * (pulseIntensity - 0.7)) / 0.3
        ctx.strokeStyle = palette.highlight
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(line.from.x, line.from.y)
        ctx.lineTo(line.to.x, line.to.y)
        ctx.stroke()
      }
    })

    // Layer 3: Ring arcs with wave distortion
    this.connections.forEach((conn) => {
      const ringT = conn.ringIdx / ringCount
      if (progress < ringT * 0.7) return

      // Complex wave pattern
      const waveVal =
        Math.sin(wave1 - conn.ringIdx * 0.7) * 0.5 +
        Math.sin(wave2 - conn.ringIdx * 1.1 + conn.from.pointIdx * 0.4) * 0.3

      const intensity = (waveVal + 0.8) / 1.6

      // Glow
      ctx.globalAlpha = alpha * 0.2 * intensity
      ctx.strokeStyle = palette.glow
      ctx.lineWidth = 2 + intensity * 1.5
      ctx.beginPath()
      ctx.moveTo(conn.from.x, conn.from.y)
      ctx.lineTo(conn.to.x, conn.to.y)
      ctx.stroke()

      // Ink
      ctx.globalAlpha = alpha * (0.35 + intensity * 0.4)
      ctx.strokeStyle = palette.ink
      ctx.lineWidth = 0.6 + intensity * 0.7
      ctx.beginPath()
      ctx.moveTo(conn.from.x, conn.from.y)
      ctx.lineTo(conn.to.x, conn.to.y)
      ctx.stroke()
    })

    // Layer 4: Nodes with pulsing highlights
    this.rings.forEach((ring, r) => {
      const ringT = r / ringCount
      if (progress < ringT * 0.7) return

      ring.forEach((pt, p) => {
        // Individual node pulse
        const nodePulse =
          Math.sin(wave1 - r * 0.5 + p * 0.4) * 0.5 + Math.sin(wave2 - r * 0.8 + p * 0.6) * 0.3

        const intensity = (nodePulse + 0.8) / 1.6
        const nodeSize = 1.5 + intensity * 2.5

        // Node glow
        ctx.globalAlpha = alpha * 0.2 * intensity
        ctx.fillStyle = palette.glow
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, nodeSize + 2, 0, Math.PI * 2)
        ctx.fill()

        // Node core
        ctx.globalAlpha = alpha * (0.5 + intensity * 0.4)
        ctx.fillStyle = palette.ink
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, nodeSize, 0, Math.PI * 2)
        ctx.fill()

        // Bright highlight on peaks
        if (intensity > 0.75) {
          ctx.globalAlpha = alpha * 0.6 * ((intensity - 0.75) / 0.25)
          ctx.fillStyle = palette.highlightBright
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, nodeSize * 0.5, 0, Math.PI * 2)
          ctx.fill()
        }
      })
    })

    // Layer 5: Traveling energy particles (subtle)
    const particleCount = 8
    for (let i = 0; i < particleCount; i++) {
      const particleT = (t * 0.8 + i / particleCount) % 1
      const particleRing = Math.floor(particleT * ringCount * 0.9)

      // Defensive guards: ensure ring index and data exist
      if (particleRing < 0 || particleRing >= ringCount) continue

      const ring = this.rings[particleRing]
      if (!ring || ring.length === 0) continue
      if (progress <= (particleRing / ringCount) * 0.7) continue

      const particleAngle = (wave3 + (i * Math.PI * 2) / particleCount) % (Math.PI * 2)
      const nearestPt = ring.reduce(
        (best, pt) => {
          const diff = Math.abs(pt.angle - particleAngle)
          return diff < best.diff ? { pt, diff } : best
        },
        { diff: Infinity }
      )

      if (nearestPt.pt) {
        ctx.globalAlpha = alpha * 0.5 * envelope(particleT)
        ctx.fillStyle = palette.warmPulse
        ctx.beginPath()
        ctx.arc(nearestPt.pt.x, nearestPt.pt.y, 3, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    ctx.restore()
  }
}

export default TriangulatedRings
