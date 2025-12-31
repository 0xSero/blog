// ============================================================================
// PATTERN: CELLULAR NETWORK
// Organic cell-like structures connected by thin membranes
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
  key: 'cellular',
  name: 'Cellular Network',
  cycleMs: 7500,
  clearRadius: 0.22,
}

export class CellularNetwork {
  constructor(width, height, clearRadius, options = {}) {
    this.width = width
    this.height = height
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
    this.config = { ...config, ...options }
    this.cells = []
    this.connections = []
    this.build()
  }

  build() {
    const cx = this.centerX
    const cy = this.centerY
    const cellCount = 24
    const minRadius = this.clearRadius * 1.3
    const maxRadius = Math.min(cx, cy) - 20

    const usedPositions = []

    for (let i = 0; i < cellCount; i++) {
      let attempts = 0
      let x, y, radius

      while (attempts < 50) {
        const angle = Math.random() * Math.PI * 2
        const dist = minRadius + Math.random() * (maxRadius - minRadius)
        x = cx + Math.cos(angle) * dist
        y = cy + Math.sin(angle) * dist

        const distFromCenter = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
        if (distFromCenter < this.clearRadius * 0.85) {
          attempts++
          continue
        }

        let tooClose = false
        for (const pos of usedPositions) {
          const d = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2)
          if (d < 45) {
            tooClose = true
            break
          }
        }

        if (!tooClose) break
        attempts++
      }

      radius = 8 + Math.random() * 12
      usedPositions.push({ x, y })

      this.cells.push({
        x,
        y,
        baseRadius: radius,
        radius,
        phase: Math.random() * 0.3,
        pulsePhase: Math.random(),
        cellIndex: i,
      })
    }

    for (let i = 0; i < this.cells.length; i++) {
      const cellA = this.cells[i]
      const distances = this.cells
        .map((cellB, j) => {
          if (i === j) return { idx: j, dist: Infinity }
          const d = Math.sqrt((cellA.x - cellB.x) ** 2 + (cellA.y - cellB.y) ** 2)
          return { idx: j, dist: d }
        })
        .filter((d) => d.dist < 80)
        .sort((a, b) => a.dist - b.dist)

      for (let j = 0; j < Math.min(distances.length, 4); j++) {
        const targetIdx = distances[j].idx
        if (targetIdx > i) {
          this.connections.push({
            from: cellA,
            to: this.cells[targetIdx],
            connectionIndex: this.connections.length,
          })
        }
      }
    }
  }

  render(ctx, t) {
    const progress = triangle(t)
    const alpha = envelope(t)

    ctx.save()
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const wavePhase = t * Math.PI * 2 * 0.4

    this.connections.forEach((conn) => {
      const connProgress = clamp((progress - conn.connectionIndex * 0.01) * 1.2, 0, 1)
      if (connProgress < 0.01) return

      const midX = (conn.from.x + conn.to.x) / 2
      const midY = (conn.from.y + conn.to.y) / 2
      const midDist = Math.sqrt((midX - this.centerX) ** 2 + (midY - this.centerY) ** 2)

      if (midDist < this.clearRadius * 0.85) return

      const wave1 = envelope((wavePhase + conn.connectionIndex * 0.1) % 1)
      const wave2 = envelope((wavePhase * 0.6 + midDist * 0.01) % 1)

      const dist = Math.sqrt((conn.from.x - conn.to.x) ** 2 + (conn.from.y - conn.to.y) ** 2)
      const segments = Math.max(2, Math.floor(dist / 20))

      ctx.beginPath()
      ctx.moveTo(conn.from.x, conn.from.y)

      for (let i = 1; i < segments; i++) {
        const segT = i / segments
        const x = conn.from.x + (conn.to.x - conn.from.x) * segT
        const y = conn.from.y + (conn.to.y - conn.from.y) * segT

        const perpX = -(conn.to.y - conn.from.y) / dist
        const perpY = (conn.to.x - conn.from.x) / dist

        const waveOffset = Math.sin(segT * Math.PI * 2 + wavePhase) * 6 * (0.5 + wave1 * 0.5)
        const drawX = x + perpX * waveOffset
        const drawY = y + perpY * waveOffset

        ctx.lineTo(drawX, drawY)
      }

      ctx.lineTo(conn.to.x, conn.to.y)

      ctx.globalAlpha = alpha * 0.1 * connProgress
      ctx.strokeStyle = palette.glow
      ctx.lineWidth = 4
      ctx.stroke()

      ctx.globalAlpha = alpha * (0.2 + wave2 * 0.15) * connProgress
      ctx.strokeStyle = palette.inkSoft
      ctx.lineWidth = 0.5
      ctx.stroke()
    })

    this.cells.forEach((cell) => {
      const cellProgress = clamp((progress - cell.cellIndex * 0.03) * 1.3, 0, 1)
      if (cellProgress < 0.01) return

      const distFromCenter = Math.sqrt((cell.x - this.centerX) ** 2 + (cell.y - this.centerY) ** 2)
      if (distFromCenter < this.clearRadius * 0.85) return

      const pulse = envelope((t + cell.pulsePhase) % 1)
      const breathe = envelope((t * 0.5 + cell.phase) % 1)
      const currentRadius = cell.baseRadius * (1 + breathe * 0.2)

      const size = currentRadius + pulse * 3
      const intensity = pulse * (0.5 + breathe * 0.5)

      ctx.globalAlpha = alpha * 0.12 * intensity * cellProgress
      ctx.fillStyle = palette.glow
      ctx.beginPath()
      ctx.arc(cell.x, cell.y, size + 3, 0, Math.PI * 2)
      ctx.fill()

      ctx.globalAlpha = alpha * (0.45 + intensity * 0.3) * cellProgress
      ctx.fillStyle = palette.ink
      ctx.beginPath()
      ctx.arc(cell.x, cell.y, size, 0, Math.PI * 2)
      ctx.fill()

      if (intensity > 0.65) {
        ctx.globalAlpha = ((alpha * 0.4 * (intensity - 0.65)) / 0.35) * cellProgress
        ctx.fillStyle = palette.highlightBright
        ctx.beginPath()
        ctx.arc(cell.x - size * 0.25, cell.y - size * 0.25, size * 0.35, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    ctx.restore()
  }
}

export default CellularNetwork
