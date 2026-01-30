// ============================================================================
// PATTERN: CONSTELLATION GRID
// Droid UI aesthetic - star points connected by geometric lines, with orbital
// rings and celestial mechanics. Technical line art meets astronomical precision.
// ============================================================================

const clamp = (v, min, max) => Math.min(Math.max(v, min, max))
const envelope = (t) => Math.sin(t * Math.PI)
const triangle = (t) => 1 - Math.abs(2 * t - 1)

const palette = {
  base: 'hsl(30, 5%, 10.5%)',
  ink: 'hsla(40, 20%, 92%, 0.75)',
  inkSoft: 'hsla(35, 18%, 70%, 0.45)',
  inkFaint: 'hsla(35, 12%, 55%, 0.2)',
  glow: 'hsla(40, 25%, 88%, 0.3)',
  highlight: 'hsla(45, 35%, 85%, 0.7)',
  highlightBright: 'hsla(45, 40%, 92%, 0.9)',
  starCore: 'hsla(40, 30%, 95%, 0.95)',
  orbital: 'hsla(35, 25%, 70%, 0.35)',
  gridLine: 'hsla(35, 15%, 50%, 0.15)',
}

export const config = {
  key: 'constellation',
  name: 'Constellation Grid',
  cycleMs: 8000,
  clearRadius: 0.24,
  starCount: 56,
  orbitalRings: 5,
}

export class ConstellationGrid {
  constructor(width, height, clearRadius, options = {}) {
    this.width = width
    this.height = height
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
    this.config = { ...config, ...options }
    this.stars = []
    this.constellationLines = []
    this.orbitalRings = []
    this.gridIntersections = []
    this.build()
  }

  build() {
    const cx = this.centerX
    const cy = this.centerY
    const { starCount, orbitalRings } = this.config
    const maxRadius = Math.min(cx, cy) - 25

    // Create orbital rings
    for (let o = 0; o < orbitalRings; o++) {
      const ringT = (o + 1) / (orbitalRings + 1)
      const radius = this.clearRadius * 1.2 + (maxRadius - this.clearRadius) * ringT * 0.9

      this.orbitalRings.push({
        radius,
        rotationSpeed: 0.05 * (o % 2 === 0 ? 1 : -1) * (1 + o * 0.2),
        phase: o * Math.PI * 0.4,
        lineWidth: 0.5 + o * 0.15,
        opacity: 0.15 + o * 0.08,
      })
    }

    // Create stars in constellation patterns
    const constellationCount = 4
    const starsPerConstellation = Math.floor(starCount / constellationCount)

    for (let c = 0; c < constellationCount; c++) {
      const constellationAngle = (c / constellationCount) * Math.PI * 2
      const constellationDist = this.clearRadius * 1.4 + (maxRadius - this.clearRadius) * 0.5
      const cxCenter = cx + Math.cos(constellationAngle) * constellationDist * 0.5
      const cyCenter = cy + Math.sin(constellationAngle) * constellationDist * 0.5

      const constellationStars = []

      for (let s = 0; s < starsPerConstellation; s++) {
        // Cluster stars near constellation center
        const angle = (s / starsPerConstellation) * Math.PI * 2 + constellationAngle
        const distVar = Math.random() * (maxRadius - this.clearRadius) * 0.25
        const starDist = constellationDist * 0.3 + distVar

        const x = cxCenter + Math.cos(angle) * starDist
        const y = cyCenter + Math.sin(angle) * starDist

        const distFromCenter = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
        if (distFromCenter < this.clearRadius * 1.1) continue

        const star = {
          id: this.stars.length,
          x,
          y,
          distFromCenter,
          size: 1.5 + Math.random() * 2.5,
          magnitude: Math.random(), // brightness variation
          twinklePhase: Math.random() * Math.PI * 2,
          constellation: c,
          hasSatellite: Math.random() < 0.15,
          satelliteOrbit: 8 + Math.random() * 6,
          satelliteSpeed: 0.5 + Math.random() * 0.5,
          satellitePhase: Math.random() * Math.PI * 2,
        }

        this.stars.push(star)
        constellationStars.push(star)
      }

      // Create constellation lines between nearby stars
      constellationStars.forEach((starA, i) => {
        constellationStars.slice(i + 1).forEach((starB) => {
          const dist = Math.sqrt((starA.x - starB.x) ** 2 + (starA.y - starB.y) ** 2)
          const maxConnectionDist = (maxRadius - this.clearRadius) * 0.25

          if (dist < maxConnectionDist && Math.random() < 0.4) {
            this.constellationLines.push({
              from: starA,
              to: starB,
              length: dist,
              constellation: c,
            })
          }
        })
      })
    }

    // Create geometric grid lines (horizontal and vertical)
    const gridSpacing = Math.min(cx, cy) * 0.15
    const gridLinesH = []
    const gridLinesV = []

    for (let i = -3; i <= 3; i++) {
      const y = cy + i * gridSpacing
      if (Math.abs(y - cy) < this.clearRadius * 1.2) continue

      gridLinesH.push({
        y,
        x1: cx - Math.sqrt(maxRadius ** 2 - (y - cy) ** 2) * 0.8,
        x2: cx + Math.sqrt(maxRadius ** 2 - (y - cy) ** 2) * 0.8,
      })
    }

    for (let i = -3; i <= 3; i++) {
      const x = cx + i * gridSpacing
      if (Math.abs(x - cx) < this.clearRadius * 1.2) continue

      gridLinesV.push({
        x,
        y1: cy - Math.sqrt(maxRadius ** 2 - (x - cx) ** 2) * 0.8,
        y2: cy + Math.sqrt(maxRadius ** 2 - (x - cx) ** 2) * 0.8,
      })
    }

    this.gridLines = { h: gridLinesH, v: gridLinesV }

    // Sort stars by distance for reveal order
    this.stars.sort((a, b) => a.distFromCenter - b.distFromCenter)
  }

  render(ctx, t) {
    const progress = triangle(t)
    const alpha = envelope(t)
    const wavePhase = t * Math.PI * 2
    const slowRotation = t * Math.PI * 2 * 0.03

    ctx.save()
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // Layer 1: Geometric grid lines (background)
    this.gridLines.h.forEach((line, idx) => {
      const lineProgress = clamp((progress * 1.2 - idx * 0.05) * 1.1, 0, 1)
      if (lineProgress < 0.01) return

      const wave = Math.sin(wavePhase + idx * 0.5) * 0.5 + 0.5

      ctx.globalAlpha = alpha * 0.1 * lineProgress
      ctx.strokeStyle = palette.gridLine
      ctx.lineWidth = 0.6
      ctx.beginPath()
      ctx.moveTo(line.x1, line.y)
      ctx.lineTo(line.x2, line.y)
      ctx.stroke()

      // Wave highlight
      if (wave > 0.7) {
        ctx.globalAlpha = ((alpha * 0.15 * (wave - 0.7)) / 0.3) * lineProgress
        ctx.strokeStyle = palette.orbital
        ctx.stroke()
      }
    })

    this.gridLines.v.forEach((line, idx) => {
      const lineProgress = clamp((progress * 1.2 - idx * 0.05) * 1.1, 0, 1)
      if (lineProgress < 0.01) return

      const wave = Math.sin(wavePhase + idx * 0.5 + 1) * 0.5 + 0.5

      ctx.globalAlpha = alpha * 0.1 * lineProgress
      ctx.strokeStyle = palette.gridLine
      ctx.lineWidth = 0.6
      ctx.beginPath()
      ctx.moveTo(line.x, line.y1)
      ctx.lineTo(line.x, line.y2)
      ctx.stroke()

      if (wave > 0.7) {
        ctx.globalAlpha = ((alpha * 0.15 * (wave - 0.7)) / 0.3) * lineProgress
        ctx.strokeStyle = palette.orbital
        ctx.stroke()
      }
    })

    // Layer 2: Orbital rings
    this.orbitalRings.forEach((ring, idx) => {
      const ringProgress = clamp((progress - idx * 0.08) * 1.3, 0, 1)
      if (ringProgress < 0.01) return

      const rotation = slowRotation * ring.rotationSpeed + ring.phase
      const pulse = envelope((t + idx * 0.2) % 1)

      ctx.globalAlpha = alpha * ring.opacity * ringProgress
      ctx.strokeStyle = palette.orbital
      ctx.lineWidth = ring.lineWidth

      ctx.beginPath()
      // Draw arc segments for dashed ring effect
      const segments = 24
      for (let s = 0; s < segments; s++) {
        const startAngle = rotation + (s / segments) * Math.PI * 2
        const endAngle = rotation + ((s + 0.6) / segments) * Math.PI * 2

        ctx.arc(this.centerX, this.centerY, ring.radius, startAngle, endAngle)
      }
      ctx.stroke()

      // Bright pulse on ring
      if (pulse > 0.6) {
        ctx.globalAlpha = ((alpha * 0.4 * (pulse - 0.6)) / 0.4) * ringProgress
        ctx.strokeStyle = palette.highlight
        ctx.lineWidth = ring.lineWidth * 1.5

        ctx.beginPath()
        const pulseAngle = rotation + pulse * Math.PI * 2
        ctx.arc(this.centerX, this.centerY, ring.radius, pulseAngle - 0.3, pulseAngle + 0.3)
        ctx.stroke()
      }
    })

    // Layer 3: Constellation connection lines
    this.constellationLines.forEach((line, idx) => {
      const midDist = (line.from.distFromCenter + line.to.distFromCenter) / 2
      const maxDist = Math.sqrt(this.centerX ** 2 + this.centerY ** 2)
      const normalizedDist = midDist / maxDist

      const lineProgress = clamp((progress * 1.4 - (1 - normalizedDist) * 0.5) * 1.2, 0, 1)
      if (lineProgress < 0.01) return

      const waveIntensity = Math.sin(wavePhase + idx * 0.3) * 0.5 + 0.5

      // Line glow
      ctx.globalAlpha = alpha * 0.1 * lineProgress
      ctx.strokeStyle = palette.glow
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(line.from.x, line.from.y)
      ctx.lineTo(line.to.x, line.to.y)
      ctx.stroke()

      // Main constellation line
      ctx.globalAlpha = alpha * 0.25 * lineProgress
      ctx.strokeStyle = palette.inkSoft
      ctx.lineWidth = 0.8
      ctx.beginPath()
      ctx.moveTo(line.from.x, line.from.y)
      ctx.lineTo(line.to.x, line.to.y)
      ctx.stroke()

      // Active pulse traveling along line
      if (waveIntensity > 0.7) {
        const pulseT = (waveIntensity - 0.7) / 0.3
        const px = line.from.x + (line.to.x - line.from.x) * pulseT
        const py = line.from.y + (line.to.y - line.from.y) * pulseT

        ctx.globalAlpha = alpha * 0.6 * lineProgress
        ctx.fillStyle = palette.highlight
        ctx.beginPath()
        ctx.arc(px, py, 2.5, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    // Layer 4: Stars
    this.stars.forEach((star) => {
      const maxDist = Math.sqrt(this.centerX ** 2 + this.centerY ** 2)
      const normalizedDist = star.distFromCenter / maxDist

      const starProgress = clamp((progress * 1.5 - (1 - normalizedDist) * 0.4) * 1.2, 0, 1)
      if (starProgress < 0.01) return

      // Twinkle effect
      const twinkle = Math.sin(wavePhase * 2 + star.twinklePhase) * 0.5 + 0.5
      const starSize = star.size * (0.7 + twinkle * 0.3 + star.magnitude * 0.3)

      // Star glow (diffuse)
      ctx.globalAlpha = alpha * 0.15 * starProgress
      ctx.fillStyle = palette.glow
      ctx.beginPath()
      ctx.arc(star.x, star.y, starSize * 4, 0, Math.PI * 2)
      ctx.fill()

      // Star glow (tighter)
      ctx.globalAlpha = alpha * 0.25 * starProgress
      ctx.fillStyle = palette.orbital
      ctx.beginPath()
      ctx.arc(star.x, star.y, starSize * 2, 0, Math.PI * 2)
      ctx.fill()

      // Star core
      ctx.globalAlpha = alpha * (0.5 + twinkle * 0.3) * starProgress
      ctx.fillStyle = palette.ink
      ctx.beginPath()
      ctx.arc(star.x, star.y, starSize, 0, Math.PI * 2)
      ctx.fill()

      // Bright center
      ctx.globalAlpha = alpha * (0.7 + twinkle * 0.3) * starProgress
      ctx.fillStyle = palette.starCore
      ctx.beginPath()
      ctx.arc(star.x, star.y, starSize * 0.5, 0, Math.PI * 2)
      ctx.fill()

      // Specular highlight
      if (twinkle > 0.6) {
        ctx.globalAlpha = alpha * twinkle * starProgress
        ctx.fillStyle = palette.highlightBright
        ctx.beginPath()
        ctx.arc(star.x - starSize * 0.2, star.y - starSize * 0.2, starSize * 0.25, 0, Math.PI * 2)
        ctx.fill()
      }

      // Satellite orbiting star
      if (star.hasSatellite) {
        const satAngle = wavePhase * star.satelliteSpeed + star.satellitePhase
        const sx = star.x + Math.cos(satAngle) * star.satelliteOrbit
        const sy = star.y + Math.sin(satAngle) * star.satelliteOrbit

        ctx.globalAlpha = alpha * 0.4 * starProgress
        ctx.fillStyle = palette.inkSoft
        ctx.beginPath()
        ctx.arc(sx, sy, 1.5, 0, Math.PI * 2)
        ctx.fill()

        // Satellite trail
        ctx.globalAlpha = alpha * 0.15 * starProgress
        ctx.strokeStyle = palette.orbital
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.satelliteOrbit, satAngle - 0.5, satAngle)
        ctx.stroke()
      }
    })

    // Layer 5: Radial measurement lines (technical aesthetic)
    const radialCount = 8
    for (let r = 0; r < radialCount; r++) {
      const angle = (r / radialCount) * Math.PI * 2 + slowRotation * 0.5
      const innerR = this.clearRadius * 1.05
      const outerR = Math.min(this.centerX, this.centerY) * 0.92

      const radialProgress = clamp((progress - r * 0.03) * 1.2, 0, 1)
      if (radialProgress < 0.01) continue

      const x1 = this.centerX + Math.cos(angle) * innerR
      const y1 = this.centerY + Math.sin(angle) * innerR
      const x2 = this.centerX + Math.cos(angle) * outerR
      const y2 = this.centerY + Math.sin(angle) * outerR

      ctx.globalAlpha = alpha * 0.12 * radialProgress
      ctx.strokeStyle = palette.gridLine
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()

      // Tick marks along radial
      const tickCount = 4
      for (let t = 1; t <= tickCount; t++) {
        const tickT = t / (tickCount + 1)
        const tx = x1 + (x2 - x1) * tickT
        const ty = y1 + (y2 - y1) * tickT
        const perpAngle = angle + Math.PI / 2
        const tickLen = 3 + t

        ctx.globalAlpha = alpha * 0.15 * radialProgress
        ctx.beginPath()
        ctx.moveTo(tx - Math.cos(perpAngle) * tickLen, ty - Math.sin(perpAngle) * tickLen)
        ctx.lineTo(tx + Math.cos(perpAngle) * tickLen, ty + Math.sin(perpAngle) * tickLen)
        ctx.stroke()
      }
    }

    ctx.restore()
  }
}

export default ConstellationGrid
