/**
 * Generate a static OG image with the portal animation aesthetic
 * Run with: node scripts/generate-og-image.js
 *
 * Requires: npm install canvas
 */

const { createCanvas } = require('canvas')
const fs = require('fs')
const path = require('path')

// OG Image dimensions (Twitter/Facebook recommended)
const WIDTH = 1200
const HEIGHT = 630

// Palette (matching the portal page)
const palette = {
  base: 'hsl(30, 5%, 10.5%)',
  baseDeep: 'hsl(30, 5%, 8%)',
  center: 'hsl(40, 30%, 96%)',
  ink: 'hsla(40, 20%, 92%, 0.75)',
  inkBright: 'hsla(40, 25%, 95%, 0.9)',
  inkSoft: 'hsla(35, 18%, 70%, 0.45)',
  inkFaint: 'hsla(35, 12%, 55%, 0.2)',
  glow: 'hsla(40, 25%, 88%, 0.35)',
  highlight: 'hsla(45, 35%, 85%, 0.5)',
}

// Simple seeded random for reproducibility
let seed = 42
function seededRandom() {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff
  return seed / 0x7fffffff
}

// Game of Life simulation
class GameOfLife {
  constructor(width, height, cellSize, clearRadius) {
    this.width = width
    this.height = height
    this.cellSize = cellSize
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
    this.cols = Math.ceil(width / cellSize)
    this.rows = Math.ceil(height / cellSize)
    this.grid = []
    this.nextGrid = []
    this.initialize()
  }

  initialize() {
    for (let y = 0; y < this.rows; y++) {
      this.grid[y] = new Array(this.cols).fill(0)
      this.nextGrid[y] = new Array(this.cols).fill(0)
    }

    // Seed with sparse random cells
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const cellCx = (x + 0.5) * this.cellSize
        const cellCy = (y + 0.5) * this.cellSize
        const distFromCenter = Math.sqrt(
          (cellCx - this.centerX) ** 2 + (cellCy - this.centerY) ** 2
        )

        if (distFromCenter < this.clearRadius * 1.4) continue
        this.grid[y][x] = seededRandom() < 0.12 ? 1 : 0
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
        count += this.grid[ny][nx]
      }
    }
    return count
  }

  step() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const cellCx = (x + 0.5) * this.cellSize
        const cellCy = (y + 0.5) * this.cellSize
        const distFromCenter = Math.sqrt(
          (cellCx - this.centerX) ** 2 + (cellCy - this.centerY) ** 2
        )

        if (distFromCenter < this.clearRadius * 1.4) {
          this.nextGrid[y][x] = 0
          continue
        }

        const neighbors = this.countNeighbors(x, y)
        const alive = this.grid[y][x] === 1

        if (alive) {
          this.nextGrid[y][x] = neighbors === 2 || neighbors === 3 ? 1 : 0
        } else {
          this.nextGrid[y][x] = neighbors === 3 ? 1 : 0
        }
      }
    }

    const temp = this.grid
    this.grid = this.nextGrid
    this.nextGrid = temp
  }
}

function generateOGImage() {
  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = palette.base
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  // Add subtle paper texture (fibers)
  ctx.save()
  ctx.strokeStyle = palette.inkFaint
  const fiberCount = 30
  for (let i = 0; i < fiberCount; i++) {
    const x = seededRandom() * WIDTH
    const y = seededRandom() * HEIGHT
    const length = 50 + seededRandom() * 150
    const angle = -0.35 + seededRandom() * 0.7
    ctx.globalAlpha = 0.02 + seededRandom() * 0.04
    ctx.lineWidth = 0.6
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
    ctx.stroke()
  }
  ctx.restore()

  // Create Game of Life pattern
  const cellSize = 14
  const clearRadius = Math.min(WIDTH, HEIGHT) * 0.28
  const gol = new GameOfLife(WIDTH, HEIGHT, cellSize, clearRadius)

  // Run a few generations to get interesting patterns
  for (let i = 0; i < 8; i++) {
    gol.step()
  }

  // Render cells
  ctx.save()
  const maxDist = Math.sqrt((WIDTH / 2) ** 2 + (HEIGHT / 2) ** 2)

  for (let y = 0; y < gol.rows; y++) {
    for (let x = 0; x < gol.cols; x++) {
      if (gol.grid[y][x] !== 1) continue

      const cellX = x * cellSize
      const cellY = y * cellSize
      const cellCx = cellX + cellSize / 2
      const cellCy = cellY + cellSize / 2

      const distFromCenter = Math.sqrt((cellCx - WIDTH / 2) ** 2 + (cellCy - HEIGHT / 2) ** 2)

      if (distFromCenter < clearRadius * 1.4) continue

      // Distance-based opacity (edge cells brighter)
      const normalizedDist = distFromCenter / maxDist
      const revealFactor = 0.5 + normalizedDist * 0.5

      // Cell glow
      ctx.globalAlpha = 0.2 * revealFactor
      ctx.fillStyle = palette.glow
      ctx.beginPath()
      ctx.arc(cellCx, cellCy, cellSize * 0.55, 0, Math.PI * 2)
      ctx.fill()

      // Cell core
      ctx.globalAlpha = 0.7 * revealFactor
      ctx.fillStyle = palette.ink
      const inset = 1
      const radius = 2
      ctx.beginPath()
      roundRect(
        ctx,
        cellX + inset,
        cellY + inset,
        cellSize - inset * 2,
        cellSize - inset * 2,
        radius
      )
      ctx.fill()

      // Bright center
      ctx.globalAlpha = 0.4 * revealFactor
      ctx.fillStyle = palette.highlight
      ctx.beginPath()
      ctx.arc(cellCx, cellCy, cellSize * 0.15, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.restore()

  // Center disc
  ctx.save()
  ctx.globalAlpha = 0.98
  ctx.fillStyle = palette.center
  ctx.beginPath()
  ctx.arc(WIDTH / 2, HEIGHT / 2, clearRadius, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  // Title text
  ctx.save()
  ctx.fillStyle = '#3D2B1F'
  ctx.font = 'bold 52px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('Sybil Solutions', WIDTH / 2, HEIGHT / 2 - 20)

  // Tagline
  ctx.font = '18px Georgia, serif'
  ctx.fillStyle = 'rgba(139, 90, 43, 0.8)'
  ctx.letterSpacing = '4px'
  ctx.fillText('SOFTWARE  \u2022  AI  \u2022  AUTOMATION', WIDTH / 2, HEIGHT / 2 + 35)
  ctx.restore()

  // Save image
  const outputPath = path.join(__dirname, '..', 'public', 'static', 'images', 'og-image.png')
  const buffer = canvas.toBuffer('image/png')
  fs.writeFileSync(outputPath, buffer)
  console.log(`OG image saved to: ${outputPath}`)
}

// Helper for rounded rectangles
function roundRect(ctx, x, y, w, h, r) {
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
}

generateOGImage()
