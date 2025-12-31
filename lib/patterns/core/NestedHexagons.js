// ============================================================================
// PATTERN: NESTED HEXAGONS
// Geometric hexagons nesting inward with breathing motion
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
  key: 'hexagon',
  name: 'Nested Hexagons',
  cycleMs: 8000,
  clearRadius: 0.22,
}

export class NestedHexagons {
  constructor(width, height, clearRadius, options = {}) {
    this.width = width
    this.height = height
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
    this.config = { ...config, ...options }
    this.hexagons = []
    this.build()
  }

  build() {
    const cx = this.centerX
    const cy = this.centerY
    const hexCount = 8
    const minRadius = this.clearRadius * 1.15
    const maxRadius = Math.min(cx, cy) - 25

    for (let h = 0; h < hexCount; h++) {
      const hexT = h / (hexCount - 1)
      const baseRadius = minRadius + (maxRadius - minRadius) * hexT

      const vertices = []
      const vertexCount = 6

      for (let v = 0; v < vertexCount; v++) {
        const angle = (v / vertexCount) * Math.PI * 2 + Math.PI / 6
        vertices.push({
          baseAngle: angle,
          radius: baseRadius,
          hexT,
          vertexIndex: v,
        })
      }

      this.hexagons.push({
        hexIndex: h,
        hexT,
        baseRadius,
        vertices,
        phase: h * 0.12,
      })
    }
  }

  render(ctx, t) {
    const progress = triangle(t)
    const alpha = envelope(t)

    ctx.save()
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const slowWave = t * Math.PI * 2 * 0.4
    const slowRotation = t * Math.PI * 2 * 0.08

    this.hexagons.forEach((hex) => {
      const hexT = hex.hexT
      const hexProgress = clamp((progress - hexT * 0.35) * 1.6, 0, 1)
      if (hexProgress < 0.01) return

      const breathe = envelope((t + hexT * 0.15) % 1)
      const breathing = 1 + breathe * 0.08
      const currentRadius = hex.baseRadius * breathing

      const rotation = slowRotation + hexT * Math.PI * 0.25
      const pulse = envelope((t + hexT * 0.2) % 1)

      const vertices = hex.vertices
      const vertexCount = vertices.length

      if (vertexCount < 3) return

      for (let i = 0; i < vertexCount; i++) {
        const v1 = vertices[i]
        const v2 = vertices[(i + 1) % vertexCount]

        const v1Angle = v1.baseAngle + rotation
        const v2Angle = v2.baseAngle + rotation

        const x1 = this.centerX + Math.cos(v1Angle) * currentRadius
        const y1 = this.centerY + Math.sin(v1Angle) * currentRadius
        const x2 = this.centerX + Math.cos(v2Angle) * currentRadius
        const y2 = this.centerY + Math.sin(v2Angle) * currentRadius

        const edgeT = i / vertexCount
        const edgeReveal = clamp((hexProgress - edgeT * 0.12) * 1.3, 0, 1)
        if (edgeReveal < 0.01) continue

        const waveVal = envelope((t * 0.5 + v1.baseAngle * 0.3 + hexT * 0.5) % 1)
        const intensity = waveVal * pulse

        ctx.globalAlpha = alpha * 0.12 * intensity * edgeReveal
        ctx.strokeStyle = palette.glow
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()

        ctx.globalAlpha = alpha * (0.3 + intensity * 0.25) * edgeReveal
        ctx.strokeStyle = palette.ink
        ctx.lineWidth = 0.6
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()

        if (intensity > 0.6) {
          ctx.globalAlpha = ((alpha * 0.35 * (intensity - 0.6)) / 0.4) * edgeReveal
          ctx.strokeStyle = palette.highlight
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
      }

      const vertexSize = 1.5 + pulse * 2

      vertices.forEach((v, vi) => {
        const vAngle = v.baseAngle + rotation
        const vReveal = clamp((hexProgress - (vi / vertexCount) * 0.1) * 1.4, 0, 1)
        if (vReveal < 0.01) return

        const x = this.centerX + Math.cos(vAngle) * currentRadius
        const y = this.centerY + Math.sin(vAngle) * currentRadius

        const vPulse = envelope((t * 0.6 + vi * 0.15 + hexT * 0.3) % 1)
        const vIntensity = pulse * vPulse
        const vSize = vertexSize + vIntensity * 1.5

        ctx.globalAlpha = alpha * 0.15 * vIntensity * vReveal
        ctx.fillStyle = palette.glow
        ctx.beginPath()
        ctx.arc(x, y, vSize + 1.5, 0, Math.PI * 2)
        ctx.fill()

        ctx.globalAlpha = alpha * (0.45 + vIntensity * 0.3) * vReveal
        ctx.fillStyle = palette.ink
        ctx.beginPath()
        ctx.arc(x, y, vSize, 0, Math.PI * 2)
        ctx.fill()

        if (vIntensity > 0.65) {
          ctx.globalAlpha = ((alpha * 0.45 * (vIntensity - 0.65)) / 0.35) * vReveal
          ctx.fillStyle = palette.highlightBright
          ctx.beginPath()
          ctx.arc(x - vSize * 0.2, y - vSize * 0.2, vSize * 0.3, 0, Math.PI * 2)
          ctx.fill()
        }
      })
    })

    ctx.restore()
  }
}

export default NestedHexagons
