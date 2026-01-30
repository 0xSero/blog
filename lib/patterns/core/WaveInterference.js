// ============================================================================
// PATTERN: WAVE INTERFERENCE
// Multiple wave sources creating interference patterns with concentric
// ripples that construct and destruct in mesmerizing mathematical beauty.
// ============================================================================

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
const envelope = (t) => Math.sin(t * Math.PI)
const triangle = (t) => 1 - Math.abs(2 * t - 1)

const palette = {
  base: 'hsl(30, 5%, 10.5%)',
  ink: 'hsla(40, 20%, 92%, 0.75)',
  inkSoft: 'hsla(35, 18%, 70%, 0.45)',
  inkFaint: 'hsla(35, 12%, 55%, 0.2)',
  glow: 'hsla(40, 25%, 88%, 0.3)',
  highlight: 'hsla(45, 35%, 85%, 0.7)',
  wavePeak: 'hsla(40, 30%, 95%, 0.9)',
  waveTrough: 'hsla(35, 20%, 60%, 0.3)',
}

export const config = {
  key: 'waves',
  name: 'Wave Interference',
  cycleMs: 8000,
  clearRadius: 0.24,
  waveSources: 5,
  ringsPerSource: 8,
}

export class WaveInterference {
  constructor(width, height, clearRadius, options = {}) {
    this.width = width
    this.height = height
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
    this.config = { ...config, ...options }
    this.waveSources = []
    this.ripples = []
    this.build()
  }

  build() {
    const { waveSources, ringsPerSource } = this.config
    const maxRadius = Math.min(this.centerX, this.centerY) - 15

    // Create wave sources positioned around the center
    for (let s = 0; s < waveSources; s++) {
      const angle = (s / waveSources) * Math.PI * 2 + Math.PI / waveSources
      const sourceDist = this.clearRadius * 0.8
      const sx = this.centerX + Math.cos(angle) * sourceDist
      const sy = this.centerY + Math.sin(angle) * sourceDist

      const ripples = []
      for (let r = 0; r < ringsPerSource; r++) {
        const ringT = (r + 1) / ringsPerSource
        ripples.push({
          baseRadius: 20 + ringT * (maxRadius - this.clearRadius) * 0.9,
          phase: r * 0.7 + s * 0.3,
          amplitude: 1 - ringT * 0.3,
          lineWidth: 1 + (1 - ringT) * 1.5,
        })
      }

      this.waveSources.push({
        x: sx,
        y: sy,
        angle,
        ripples,
      })
    }

    // Create interference grid points
    this.interferencePoints = []
    const gridRes = 40
    for (let i = 0; i < gridRes; i++) {
      for (let j = 0; j < gridRes; j++) {
        const x = (i / (gridRes - 1)) * this.width
        const y = (j / (gridRes - 1)) * this.height
        const distFromCenter = Math.sqrt((x - this.centerX) ** 2 + (y - this.centerY) ** 2)

        if (distFromCenter < this.clearRadius * 1.1) continue
        if (distFromCenter > maxRadius * 0.95) continue

        this.interferencePoints.push({
          x,
          y,
          distFromCenter,
          basePhase: Math.random() * Math.PI * 2,
        })
      }
    }
  }

  calculateWaveHeight(x, y, t) {
    let totalHeight = 0

    this.waveSources.forEach((source) => {
      const dx = x - source.x
      const dy = y - source.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      // Wave propagation
      const wavelength = 60
      const frequency = 0.001
      const phase = dist / wavelength - t * Math.PI * 4
      const amplitude = Math.exp(-dist / 200) * 0.8

      totalHeight += Math.sin(phase) * amplitude
    })

    return totalHeight
  }

  drawWaveRings(ctx, source, reveal, t) {
    if (reveal <= 0.01) return

    source.ripples.forEach((ripple, i) => {
      // Animate ring expansion
      const expansion = 1 + Math.sin(t * Math.PI * 2 + ripple.phase) * 0.08
      const radius = ripple.baseRadius * expansion

      // Calculate interference at this ring
      const interference = this.calculateWaveHeight(
        source.x + Math.cos(source.angle) * radius,
        source.y + Math.sin(source.angle) * radius,
        t
      )

      const alphaMod = 0.5 + interference * 0.4

      ctx.globalAlpha = reveal * alphaMod * ripple.amplitude * 0.6
      ctx.strokeStyle = palette.inkSoft
      ctx.lineWidth = ripple.lineWidth

      // Draw ring segment (partial to avoid center)
      ctx.beginPath()
      const startAngle = source.angle - Math.PI * 0.4
      const endAngle = source.angle + Math.PI * 0.4
      ctx.arc(source.x, source.y, radius, startAngle, endAngle)
      ctx.stroke()

      // Highlight peaks
      if (interference > 0.3) {
        ctx.globalAlpha = reveal * (interference - 0.3) * 1.5
        ctx.strokeStyle = palette.wavePeak
        ctx.lineWidth = ripple.lineWidth * 1.2
        ctx.stroke()
      }
    })
  }

  drawInterferenceField(ctx, reveal, t) {
    if (reveal <= 0.1) return

    const pointReveal = reveal * clamp((t % 1) * 2 - 0.3, 0, 1)

    this.interferencePoints.forEach((point) => {
      const height = this.calculateWaveHeight(point.x, point.y, t)
      const normalizedHeight = (height + 2) / 4 // Normalize to 0-1

      // Only draw significant interference points
      if (Math.abs(height) < 0.3) return

      const size = 1 + Math.abs(height) * 2
      const alpha = pointReveal * Math.abs(height) * 0.5

      ctx.globalAlpha = alpha
      ctx.fillStyle = height > 0 ? palette.wavePeak : palette.waveTrough
      ctx.beginPath()
      ctx.arc(point.x, point.y, size, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  drawWaveNodes(ctx, reveal, t) {
    if (reveal <= 0.2) return

    // Draw connecting lines between wave peaks
    ctx.globalAlpha = reveal * 0.15
    ctx.strokeStyle = palette.connection || palette.inkFaint
    ctx.lineWidth = 0.5

    const nodes = []
    const nodeCount = 12

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2 + t * 0.5
      const radius = this.clearRadius * 1.5 + Math.sin(t * Math.PI * 3 + i) * 20
      nodes.push({
        x: this.centerX + Math.cos(angle) * radius,
        y: this.centerY + Math.sin(angle) * radius,
      })
    }

    ctx.beginPath()
    for (let i = 0; i < nodes.length; i++) {
      const n1 = nodes[i]
      const n2 = nodes[(i + 1) % nodes.length]
      ctx.moveTo(n1.x, n1.y)
      ctx.lineTo(n2.x, n2.y)
    }
    ctx.stroke()
  }

  render(ctx, t) {
    const progress = triangle(t)
    const alpha = envelope(t)

    const waveReveal = alpha * smoothstep(0.05, 0.6, progress)
    const fieldReveal = alpha * smoothstep(0.2, 0.8, progress)
    const nodesReveal = alpha * smoothstep(0.3, 0.9, progress)

    ctx.save()

    // Draw wave rings from each source
    this.waveSources.forEach((source, i) => {
      const sourceReveal = waveReveal * clamp(progress * 1.5 - i * 0.1, 0, 1)
      this.drawWaveRings(ctx, source, sourceReveal, t)
    })

    // Draw interference field
    this.drawInterferenceField(ctx, fieldReveal, t)

    // Draw connecting wave nodes
    this.drawWaveNodes(ctx, nodesReveal, t)

    ctx.restore()
  }
}

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}
