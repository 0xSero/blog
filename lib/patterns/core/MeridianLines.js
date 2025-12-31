// ============================================================================
// PATTERN: FLOWING MERIDIANS
// Organic flowing lines like acupuncture meridians across the screen
// ============================================================================

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
const envelope = (t) => Math.sin(t * Math.PI)
const triangle = (t) => 1 - Math.abs(2 * t - 1)

const palette = {
  base: 'hsl(30, 5%, 10.5%)',
  ink: 'hsla(40, 20%, 92%, 0.75)',
  inkSoft: 'hsla(35, 18%, 70%, 0.45)',
  glow: 'hsla(40, 25%, 88%, 0.25)',
  highlight: 'hsla(45, 35%, 85%, 0.5)',
  highlightBright: 'hsla(45, 40%, 92%, 0.7)',
  warmPulse: 'hsla(35, 40%, 75%, 0.6)',
}

export const config = {
  key: 'meridian',
  name: 'Flowing Meridians',
  cycleMs: 7000,
  clearRadius: 0.22,
}

export class MeridianPattern {
  constructor(width, height, clearRadius, options = {}) {
    this.width = width
    this.height = height
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
    this.config = { ...config, ...options }
    this.meridians = []
    this.build()
  }

  build() {
    const cx = this.centerX
    const cy = this.centerY
    const meridianCount = 6

    for (let m = 0; m < meridianCount; m++) {
      const baseAngle = (m / meridianCount) * Math.PI * 2
      const perpAngle = baseAngle + Math.PI / 2
      const points = []
      const pointCount = 12

      for (let p = 0; p < pointCount; p++) {
        const t = p / (pointCount - 1)
        const alongLine = t * 2 - 1

        const baseDist =
          this.clearRadius * 1.3 + Math.abs(alongLine) * Math.min(this.width, this.height) * 0.45
        const x = cx + Math.cos(baseAngle) * baseDist
        const y = cy + Math.sin(baseAngle) * baseDist

        const waveOffset = Math.sin(alongLine * Math.PI * 0.5 + m * 0.8) * 15
        const wx = x + Math.cos(perpAngle) * waveOffset
        const wy = y + Math.sin(perpAngle) * waveOffset

        const distFromCenter = Math.sqrt((wx - cx) ** 2 + (wy - cy) ** 2)
        if (distFromCenter < this.clearRadius * 0.9) continue

        points.push({
          x: wx,
          y: wy,
          baseAngle,
          alongLine,
          distFromCenter,
          phase: (m * 0.15 + p * 0.08) % 1,
          nodePhase: (m * 0.2 + p * 0.1) % 1,
        })
      }

      this.meridians.push({
        baseAngle,
        points,
        phase: m * 0.12,
      })
    }
  }

  render(ctx, t) {
    const progress = triangle(t)
    const alpha = envelope(t)

    ctx.save()
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    this.meridians.forEach((meridian, mi) => {
      const meridianProgress = clamp((progress - meridian.phase * 0.3) * 1.4, 0, 1)
      if (meridianProgress < 0.01) return

      const points = meridian.points
      const pointCount = points.length

      if (pointCount < 2) return

      const wavePhase = t * Math.PI * 2 * 0.8 + mi * 0.5

      for (let i = 0; i < pointCount - 1; i++) {
        const p1 = points[i]
        const p2 = points[i + 1]

        const segmentProgress = i / (pointCount - 1)
        const segmentReveal = clamp((meridianProgress - segmentProgress * 0.3) * 1.5, 0, 1)
        if (segmentReveal < 0.01) continue

        const wave1 = Math.sin(wavePhase - i * 0.4) * 0.5 + 0.5
        const wave2 = Math.sin(wavePhase * 1.3 + i * 0.3) * 0.5 + 0.5

        ctx.globalAlpha = alpha * 0.12 * segmentReveal
        ctx.strokeStyle = palette.glow
        ctx.lineWidth = 6
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.stroke()

        ctx.globalAlpha = alpha * (0.35 + wave1 * 0.2) * segmentReveal
        ctx.strokeStyle = palette.ink
        ctx.lineWidth = 0.8
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.stroke()
      }

      points.forEach((point, pi) => {
        const pointT = pi / (pointCount - 1)
        const pointReveal = clamp((meridianProgress - pointT * 0.25) * 1.5, 0, 1)
        if (pointReveal < 0.01) return

        const nodePulse1 = Math.sin(t * Math.PI * 2 - point.nodePhase * Math.PI * 2) * 0.5 + 0.5
        const nodePulse2 = Math.sin(t * Math.PI * 2 * 1.4 + point.phase * Math.PI * 2) * 0.5 + 0.5
        const nodeSize = 2 + nodePulse1 * 2 + nodePulse2 * 1.5
        const nodeIntensity = nodePulse1 * nodePulse2

        ctx.globalAlpha = alpha * 0.2 * nodeIntensity * pointReveal
        ctx.fillStyle = palette.glow
        ctx.beginPath()
        ctx.arc(point.x, point.y, nodeSize + 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.globalAlpha = alpha * (0.5 + nodeIntensity * 0.35) * pointReveal
        ctx.fillStyle = palette.ink
        ctx.beginPath()
        ctx.arc(point.x, point.y, nodeSize, 0, Math.PI * 2)
        ctx.fill()

        if (nodeIntensity > 0.7) {
          ctx.globalAlpha = ((alpha * 0.5 * (nodeIntensity - 0.7)) / 0.3) * pointReveal
          ctx.fillStyle = palette.highlightBright
          ctx.beginPath()
          ctx.arc(
            point.x - nodeSize * 0.25,
            point.y - nodeSize * 0.25,
            nodeSize * 0.4,
            0,
            Math.PI * 2
          )
          ctx.fill()
        }
      })
    })

    ctx.restore()
  }
}

export default MeridianPattern
