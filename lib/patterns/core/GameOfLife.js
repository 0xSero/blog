// ============================================================================
// PATTERN: GAME OF LIFE
// Conway's Game of Life - starts sparse, grows dense, then fades back
// ============================================================================

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
const envelope = (t) => Math.sin(t * Math.PI)
const triangle = (t) => 1 - Math.abs(2 * t - 1)

const palette = {
  base: 'hsl(30, 5%, 10.5%)',
  ink: 'hsla(40, 20%, 92%, 0.75)',
  glow: 'hsla(40, 25%, 88%, 0.35)',
  highlight: 'hsla(45, 35%, 85%, 0.5)',
}

export const config = {
  key: 'life',
  name: 'Game of Life',
  cycleMs: 8000,
  golGridSize: 12,
  clearRadius: 0.24,
}

export class GameOfLifePattern {
  constructor(width, height, configOverrides, clearRadius) {
    this.width = width
    this.height = height
    this.config = { ...config, ...configOverrides }
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
    this.cellSize = this.config.golGridSize || 14
    this.cols = Math.ceil(this.width / this.cellSize)
    this.rows = Math.ceil(this.height / this.cellSize)
    this.grid = []
    this.nextGrid = []
    this.lastT = -1
    this.build()
  }

  build() {
    const cx = this.centerX
    const cy = this.centerY

    // Initialize grids
    for (let y = 0; y < this.rows; y++) {
      this.grid[y] = new Array(this.cols).fill(0)
      this.nextGrid[y] = new Array(this.cols).fill(0)
    }

    // Seed with SPARSE random cells - only ~8% density for minimal start
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const cellCx = (x + 0.5) * this.cellSize
        const cellCy = (y + 0.5) * this.cellSize
        const distFromCenter = Math.sqrt((cellCx - cx) ** 2 + (cellCy - cy) ** 2)

        // Don't spawn cells too close to center
        if (distFromCenter < this.clearRadius * 1.4) {
          continue
        }

        // Very sparse - about 8%
        this.grid[y][x] = Math.random() < 0.08 ? 1 : 0
      }
    }
  }

  countNeighbors(x, y) {
    let count = 0
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue
        // Wrap around edges (toroidal)
        const ny = (y + dy + this.rows) % this.rows
        const nx = (x + dx + this.cols) % this.cols
        count += this.grid[ny][nx]
      }
    }
    return count
  }

  step() {
    const cx = this.centerX
    const cy = this.centerY

    // Apply Conway's rules to compute next state
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const cellCx = (x + 0.5) * this.cellSize
        const cellCy = (y + 0.5) * this.cellSize
        const distFromCenter = Math.sqrt((cellCx - cx) ** 2 + (cellCy - cy) ** 2)

        // Keep center clear
        if (distFromCenter < this.clearRadius * 1.4) {
          this.nextGrid[y][x] = 0
          continue
        }

        const neighbors = this.countNeighbors(x, y)
        const alive = this.grid[y][x] === 1

        // Conway's Game of Life rules:
        // 1. Any live cell with 2 or 3 neighbors survives
        // 2. Any dead cell with exactly 3 neighbors becomes alive
        // 3. All other cells die or stay dead
        if (alive) {
          this.nextGrid[y][x] = neighbors === 2 || neighbors === 3 ? 1 : 0
        } else {
          this.nextGrid[y][x] = neighbors === 3 ? 1 : 0
        }
      }
    }

    // Swap grids
    const temp = this.grid
    this.grid = this.nextGrid
    this.nextGrid = temp
  }

  render(ctx, t) {
    // Use progress for reveal: 0->1->0 over the cycle
    // Cells appear based on distance from edge, then fade back
    const progress = triangle(t)
    const alpha = envelope(t)

    // Step simulation
    const stepsPerCycle = 20
    const currentStep = Math.floor(t * stepsPerCycle)
    const lastStep = Math.floor(this.lastT * stepsPerCycle)

    // Step if we've moved to a new step slot, or if t wrapped around
    if (this.lastT < 0 || currentStep !== lastStep || (t < this.lastT && this.lastT > 0.9)) {
      this.step()
    }
    this.lastT = t

    ctx.save()

    // Render Game of Life cells
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (this.grid[y][x] !== 1) continue

        const cellX = x * this.cellSize
        const cellY = y * this.cellSize
        const cellCx = cellX + this.cellSize / 2
        const cellCy = cellY + this.cellSize / 2

        const distFromCenter = Math.sqrt(
          (cellCx - this.centerX) ** 2 + (cellCy - this.centerY) ** 2
        )

        if (distFromCenter < this.clearRadius * 1.4) continue

        // Cells reveal from edges inward based on progress
        const maxDist = Math.sqrt(this.centerX ** 2 + this.centerY ** 2)
        const normalizedDist = distFromCenter / maxDist

        // Edge cells appear first (high normalizedDist), center cells last
        const cellReveal = clamp((progress * 2 - (1 - normalizedDist)) * 2, 0, 1)

        if (cellReveal < 0.05) continue

        // Cell glow
        ctx.globalAlpha = alpha * 0.2 * cellReveal
        ctx.fillStyle = palette.glow
        ctx.beginPath()
        ctx.arc(cellCx, cellCy, this.cellSize * 0.55, 0, Math.PI * 2)
        ctx.fill()

        // Cell core - rounded squares
        ctx.globalAlpha = alpha * 0.65 * cellReveal
        ctx.fillStyle = palette.ink
        const inset = 1
        const radius = 2
        ctx.beginPath()
        ctx.roundRect(
          cellX + inset,
          cellY + inset,
          this.cellSize - inset * 2,
          this.cellSize - inset * 2,
          radius
        )
        ctx.fill()

        // Bright center for alive cells
        ctx.globalAlpha = alpha * 0.4 * cellReveal
        ctx.fillStyle = palette.highlight
        ctx.beginPath()
        ctx.arc(cellCx, cellCy, this.cellSize * 0.15, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    ctx.restore()
  }
}

export default GameOfLifePattern
