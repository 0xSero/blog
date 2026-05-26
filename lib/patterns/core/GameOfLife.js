// ============================================================================
// PATTERN: GAME OF LIFE
// Conway's Game of Life on a grid with warm ink tones
// ============================================================================

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
const envelope = (t) => Math.sin(t * Math.PI)
const triangle = (t) => 1 - Math.abs(2 * t - 1)

const palette = {
  cell: 'hsla(40, 20%, 85%, 0.8)',
  cellGlow: 'hsla(40, 25%, 88%, 0.25)',
  highlight: 'hsla(45, 35%, 92%, 0.5)',
}

export const config = { key: 'life', name: 'Game of Life', cycleMs: 9000, clearRadius: 0.24 }

export class GameOfLife {
  constructor(width, height, clearRadius, quality = {}) {
    this.width = width
    this.height = height
    this.clearRadius = clearRadius
    this.quality = quality
    this.cx = width / 2
    this.cy = height / 2
    this.cellSize = quality.isMobile ? 18 : quality.isTablet ? 16 : 14
    this.cols = Math.ceil(this.width / this.cellSize)
    this.rows = Math.ceil(this.height / this.cellSize)
    this.grid = new Uint8Array(this.cols * this.rows)
    this.nextGrid = new Uint8Array(this.cols * this.rows)
    this.lastT = -1
    this.maxDist = Math.hypot(this.cx, this.cy)
    this.clearRadiusSq = (this.clearRadius * 1.4) ** 2
    this.build()
  }

  build() {
    const seedChance = 0.08 * (this.quality.density ?? 1)
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const cellCx = (x + 0.5) * this.cellSize
        const cellCy = (y + 0.5) * this.cellSize
        const dx = cellCx - this.cx
        const dy = cellCy - this.cy
        if (dx * dx + dy * dy < this.clearRadiusSq) continue
        this.grid[y * this.cols + x] = Math.random() < seedChance ? 1 : 0
      }
    }
  }

  countNeighbors(x, y) {
    let count = 0
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue
        const ny = (y + dy + this.rows) % this.rows
        const nx = (x + dx + this.cols) % this.cols
        count += this.grid[ny * this.cols + nx]
      }
    }
    return count
  }

  step() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const cellCx = (x + 0.5) * this.cellSize
        const cellCy = (y + 0.5) * this.cellSize
        const dx = cellCx - this.cx
        const dy = cellCy - this.cy
        const index = y * this.cols + x
        if (dx * dx + dy * dy < this.clearRadiusSq) {
          this.nextGrid[index] = 0
          continue
        }
        const neighbors = this.countNeighbors(x, y)
        const alive = this.grid[index] === 1
        if (alive) {
          this.nextGrid[index] = neighbors === 2 || neighbors === 3 ? 1 : 0
        } else {
          this.nextGrid[index] = neighbors === 3 ? 1 : 0
        }
      }
    }
    const temp = this.grid
    this.grid = this.nextGrid
    this.nextGrid = temp
  }

  render(ctx, t) {
    const progress = triangle(t)
    const alpha = envelope(t)

    const stepsPerCycle = this.quality.isMobile ? 12 : 18
    const currentStep = Math.floor(t * stepsPerCycle)
    const lastStep = Math.floor(this.lastT * stepsPerCycle)
    if (this.lastT < 0 || currentStep !== lastStep || (t < this.lastT && this.lastT > 0.9)) {
      this.step()
    }
    this.lastT = t

    ctx.save()

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (this.grid[y * this.cols + x] !== 1) continue
        const cellX = x * this.cellSize
        const cellY = y * this.cellSize
        const cellCx = cellX + this.cellSize / 2
        const cellCy = cellY + this.cellSize / 2
        const dx = cellCx - this.cx
        const dy = cellCy - this.cy
        const distSq = dx * dx + dy * dy
        if (distSq < this.clearRadiusSq) continue
        const dist = Math.sqrt(distSq)

        const normalizedDist = dist / this.maxDist
        const cellReveal = clamp((progress * 2 - (1 - normalizedDist)) * 2, 0, 1)
        if (cellReveal < 0.05) continue

        ctx.globalAlpha = alpha * 0.25 * cellReveal
        ctx.fillStyle = palette.cellGlow
        ctx.beginPath()
        ctx.arc(cellCx, cellCy, this.cellSize * 0.55, 0, Math.PI * 2)
        ctx.fill()

        ctx.globalAlpha = alpha * 0.75 * cellReveal
        ctx.fillStyle = palette.cell
        const inset = 1
        const r = 2
        ctx.beginPath()
        ctx.roundRect(
          cellX + inset,
          cellY + inset,
          this.cellSize - inset * 2,
          this.cellSize - inset * 2,
          r
        )
        ctx.fill()

        ctx.globalAlpha = alpha * 0.45 * cellReveal
        ctx.fillStyle = palette.highlight
        ctx.beginPath()
        ctx.arc(cellCx, cellCy, this.cellSize * 0.15, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    ctx.restore()
  }
}
