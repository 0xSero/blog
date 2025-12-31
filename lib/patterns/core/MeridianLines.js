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
    const pointCount = 10

    for (let m = 0; m < meridianCount; m++) {
      const baseAngle = (m / meridianCount) * Math.PI * 2
      const perpAngle = baseAngle + Math.PI / 2
      const points = []
      const maxDist = Math.min(this.width, this.height) * 0.5

      for (let p = 0; p < pointCount; p++) {
        const t = p / (pointCount - 1)
        const alongLine = t * 2 - 1

        const baseDist = this.clearRadius * 1.2 + Math.abs(alongLine) * maxDist
        const x = cx + Math.cos(baseAngle) * baseDist
        const y = cy + Math.sin(baseAngle) * baseDist

        const distFromCenter = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
        if (distFromCenter < this.clearRadius * 0.85) continue

        points.push({
          baseX: x,
          baseY: y,
          x,
          y,
          baseAngle,
          alongLine,
          perpAngle,
          distFromCenter,
          phase: (m * 0.12 + p * 0.06) % 1,
        })
      }

      this.meridians.push({
        baseAngle,
        points,
        phase: m * 0.14,
      })
    }
  }

  render(ctx, t) {
    const progress = triangle(t)
    const alpha = envelope(t)

    ctx.save()
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const wavePhase = t * Math.PI * 2 * 0.5

    this.meridians.forEach((meridian) => {
      const meridianProgress = clamp((progress - meridian.phase * 0.35) * 1.5, 0, 1)
      if (meridianProgress < 0.01) return

      const points = meridian.points
      const pointCount = points.length

      if (pointCount < 2) return

      for (let i = 0; i < pointCount - 1; i++) {
        const p1 = points[i]
        const p2 = points[i + 1]

        const segmentProgress = i / (pointCount - 1)
        const segmentReveal = clamp((meridianProgress - segmentProgress * 0.25) * 1.5, 0, 1)
        if (segmentReveal < 0.01) continue

        const wave1 = envelope((wavePhase - i * 0.12) % 1)
        const wave2 = envelope((wavePhase * 0.7 + p1.alongLine * 0.5) % 1)

        const animatedWave1 =
          Math.sin(p1.alongLine * Math.PI * 2 + wavePhase) * 4 * (0.5 + wave1 * 0.5)
        const animatedWave2 =
          Math.cos(p1.alongLine * Math.PI * 3 + wavePhase * 0.8) * 3 * (0.5 + wave2 * 0.5)

        const x1 = p1.baseX + Math.cos(p1.perpAngle) * animatedWave1
        const y1 = p1.baseY + Math.sin(p1.perpAngle) * animatedWave1
        const x2 = p2.baseX + Math.cos(p2.perpAngle) * animatedWave1
        const y2 = p2.baseY + Math.sin(p2.perpAngle) * animatedWave1

        const midWave = (animatedWave1 + animatedWave2) * 0.5

        ctx.globalAlpha = alpha * 0.1 * segmentReveal
        ctx.strokeStyle = palette.glow
        ctx.lineWidth = 5
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()

        ctx.globalAlpha = alpha * (0.3 + wave1 * 0.15) * segmentReveal
        ctx.strokeStyle = palette.ink
        ctx.lineWidth = 0.7
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }

      points.forEach((point, pi) => {
        const pointT = pi / (pointCount - 1)
        const pointReveal = clamp((meridianProgress - pointT * 0.2) * 1.5, 0, 1)
        if (pointReveal < 0.01) return

        const wave1 = envelope((wavePhase - pi * 0.1) % 1)
        const wave2 = envelope((wavePhase * 0.6 + point.alongLine * 0.3) % 1)

        const animatedWave =
          Math.sin(point.alongLine * Math.PI * 2 + wavePhase) * 5 * (0.5 + wave1 * 0.5)
        const animatedWave2 =
          Math.cos(point.alongLine * Math.PI * 2.5 + wavePhase * 0.7) * 3 * (0.5 + wave2 * 0.5)

        const x = point.baseX + Math.cos(point.perpAngle) * animatedWave
        const y = point.baseY + Math.sin(point.perpAngle) * animatedWave

        const combinedWave = (animatedWave + animatedWave2) * 0.5
        const nodePulse = envelope((t + point.phase) % 1)
        const nodeSize = 1.5 + Math.abs(combinedWave) * 0.15 + nodePulse * 1.5
        const nodeIntensity = nodePulse * (0.5 + wave1 * 0.5)

        ctx.globalAlpha = alpha * 0.15 * nodeIntensity * pointReveal
        ctx.fillStyle = palette.glow
        ctx.beginPath()
        ctx.arc(x, y, nodeSize + 2, 0, Math.PI * 2)
        ctx.fill()

        ctx.globalAlpha = alpha * (0.45 + nodeIntensity * 0.3) * pointReveal
        ctx.fillStyle = palette.ink
        ctx.beginPath()
        ctx.arc(x, y, nodeSize, 0, Math.PI * 2)
        ctx.fill()

        if (nodeIntensity > 0.6) {
          ctx.globalAlpha = ((alpha * 0.4 * (nodeIntensity - 0.6)) / 0.4) * pointReveal
          ctx.fillStyle = palette.highlightBright
          ctx.beginPath()
          ctx.arc(x - nodeSize * 0.2, y - nodeSize * 0.2, nodeSize * 0.35, 0, Math.PI * 2)
          ctx.fill()
        }
      })
    })

    ctx.restore()
  }
}

export default MeridianPattern
