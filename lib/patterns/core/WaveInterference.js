// ============================================================================
// PATTERN: WAVE INTERFERENCE
// Multiple wave sources creating interference patterns with concentric ripples
// ============================================================================

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
const envelope = (t) => Math.sin(t * Math.PI)
const triangle = (t) => 1 - Math.abs(2 * t - 1)

const palette = {
  ripple: 'hsla(40, 20%, 75%, 0.35)',
  rippleBright: 'hsla(40, 30%, 92%, 0.8)',
  glow: 'hsla(40, 25%, 88%, 0.15)',
  peak: 'hsla(40, 30%, 95%, 0.9)',
  trough: 'hsla(35, 20%, 60%, 0.3)',
  grid: 'hsla(35, 15%, 50%, 0.12)',
}

export const config = { key: 'waves', name: 'Wave Interference', cycleMs: 8000, clearRadius: 0.24 }

export class WaveInterference {
  constructor(width, height, clearRadius, quality = {}) {
    this.width = width
    this.height = height
    this.clearRadius = clearRadius
    this.quality = quality
    this.cx = width / 2
    this.cy = height / 2
    this.renderNodes = Array.from({ length: 12 }, () => ({ x: 0, y: 0 }))
    this.sources = []
    this.points = []
    this.build()
  }

  build() {
    const maxR = Math.min(this.cx, this.cy) - 15
    const sourceCount = this.quality.isMobile ? 4 : 5
    const ringsPerSource = this.quality.isMobile ? 6 : 8

    for (let s = 0; s < sourceCount; s++) {
      const angle = (s / sourceCount) * Math.PI * 2 + Math.PI / sourceCount
      const dist = this.clearRadius * 0.8
      const sx = this.cx + Math.cos(angle) * dist
      const sy = this.cy + Math.sin(angle) * dist

      const ripples = []
      for (let r = 0; r < ringsPerSource; r++) {
        const rt = (r + 1) / ringsPerSource
        ripples.push({
          baseRadius: 20 + rt * (maxR - this.clearRadius) * 0.9,
          phase: r * 0.7 + s * 0.3,
          amplitude: 1 - rt * 0.3,
          lineWidth: 1 + (1 - rt) * 1.5,
        })
      }
      this.sources.push({ x: sx, y: sy, angle, ripples })
    }

    const res = this.quality.isMobile ? 26 : this.quality.isTablet ? 32 : 40
    const clearRadiusSq = (this.clearRadius * 1.1) ** 2
    const maxRSq = (maxR * 0.95) ** 2
    for (let i = 0; i < res; i++) {
      for (let j = 0; j < res; j++) {
        const x = (i / (res - 1)) * this.width
        const y = (j / (res - 1)) * this.height
        const dx = x - this.cx
        const dy = y - this.cy
        const distSq = dx * dx + dy * dy
        if (distSq < clearRadiusSq || distSq > maxRSq) continue
        this.points.push({
          x,
          y,
          dist: Math.sqrt(distSq),
          phase: Math.random() * Math.PI * 2,
          sourceDistances: this.sources.map((source) => Math.hypot(x - source.x, y - source.y)),
        })
      }
    }
  }

  waveHeight(x, y, t, cachedDistances = null) {
    let total = 0
    this.sources.forEach((source, index) => {
      const dist = cachedDistances?.[index] ?? Math.hypot(x - source.x, y - source.y)
      const wavelength = 60
      const phase = dist / wavelength - t * Math.PI * 4
      const amp = Math.exp(-dist / 200) * 0.8
      total += Math.sin(phase) * amp
    })
    return total
  }

  render(ctx, t) {
    const progress = triangle(t)
    const alpha = envelope(t)
    const waveReveal = alpha * this.smoothstep(0, 0.15, progress)
    const fieldReveal = alpha * this.smoothstep(0.05, 0.3, progress)

    ctx.save()

    // Wave rings from each source
    this.sources.forEach((source, i) => {
      const sourceReveal = waveReveal * clamp(progress * 1.5 - i * 0.1, 0, 1)
      if (sourceReveal < 0.01) return

      source.ripples.forEach((ripple) => {
        const expansion = 1 + Math.sin(t * Math.PI * 2 + ripple.phase) * 0.08
        const radius = ripple.baseRadius * expansion
        const interference = this.waveHeight(
          source.x + Math.cos(source.angle) * radius,
          source.y + Math.sin(source.angle) * radius,
          t
        )
        const alphaMod = 0.5 + interference * 0.4

        ctx.globalAlpha = sourceReveal * alphaMod * ripple.amplitude * 1.2
        ctx.strokeStyle = palette.ripple
        ctx.lineWidth = ripple.lineWidth * 2
        ctx.beginPath()
        const startAngle = source.angle - Math.PI * 0.4
        const endAngle = source.angle + Math.PI * 0.4
        ctx.arc(source.x, source.y, radius, startAngle, endAngle)
        ctx.stroke()

        if (interference > 0.2) {
          ctx.globalAlpha = sourceReveal * (interference - 0.2) * 2
          ctx.strokeStyle = palette.rippleBright
          ctx.lineWidth = ripple.lineWidth * 1.5
          ctx.stroke()
        }
      })
    })

    // Interference field points
    if (fieldReveal > 0.05) {
      this.points.forEach((point) => {
        const height = this.waveHeight(point.x, point.y, t, point.sourceDistances)
        if (Math.abs(height) < 0.3) return
        const size = 1 + Math.abs(height) * 2
        const a = fieldReveal * Math.abs(height) * 0.5

        ctx.globalAlpha = a
        ctx.fillStyle = height > 0 ? palette.peak : palette.trough
        ctx.beginPath()
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    // Connecting nodes
    ctx.globalAlpha = alpha * this.smoothstep(0.1, 0.5, progress) * 0.25
    ctx.strokeStyle = palette.grid
    ctx.lineWidth = 0.8
    ctx.beginPath()
    let firstNode = null
    let previousNode = null
    for (let i = 0; i < this.renderNodes.length; i++) {
      const angle = (i / this.renderNodes.length) * Math.PI * 2 + t * 0.5
      const radius = this.clearRadius * 1.5 + Math.sin(t * Math.PI * 3 + i) * 20
      const node = this.renderNodes[i]
      node.x = this.cx + Math.cos(angle) * radius
      node.y = this.cy + Math.sin(angle) * radius
      if (!firstNode) firstNode = node
      if (previousNode) {
        ctx.moveTo(previousNode.x, previousNode.y)
        ctx.lineTo(node.x, node.y)
      }
      previousNode = node
    }
    if (firstNode && previousNode) {
      ctx.moveTo(previousNode.x, previousNode.y)
      ctx.lineTo(firstNode.x, firstNode.y)
    }
    ctx.stroke()

    ctx.restore()
  }

  smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
    return t * t * (3 - 2 * t)
  }
}
