// ============================================================================
// SPLASH PATTERNS - Ported from app/src/sections/SplashAnimations.tsx
// 10 unique patterns with canvas-based rendering
// ============================================================================

// Utility functions
const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
const lerp = (a, b, t) => a + (b - a) * t
const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}
const envelope = (t) => Math.sin(t * Math.PI)
const triangle = (t) => 1 - Math.abs(2 * t - 1)

// Palette
const palette = {
  base: 'hsl(30, 5%, 10.5%)',
  ink: 'hsla(40, 20%, 92%, 0.75)',
  inkBright: 'hsla(40, 25%, 95%, 0.9)',
  inkSoft: 'hsla(35, 18%, 70%, 0.45)',
  inkFaint: 'hsla(35, 12%, 55%, 0.2)',
  glow: 'hsla(40, 25%, 88%, 0.35)',
  gold: '#e6c89a',
  highlight: 'hsla(45, 35%, 85%, 0.5)',
}

// Pattern configurations
export const patternConfigs = [
  { key: 'rings', name: 'Concentric Rings', cycleMs: 20000 },
  { key: 'tessellation', name: 'Tessellation', cycleMs: 15000 },
  { key: 'life', name: 'Game of Life', cycleMs: 25000, golGridSize: 12 },
  { key: 'hexagon', name: 'Hexagon', cycleMs: 18000 },
  { key: 'morph', name: 'Morphing Shape', cycleMs: 16000 },
  { key: 'triangle', name: 'Penrose Triangle', cycleMs: 20000 },
  { key: 'orbital', name: 'Orbital System', cycleMs: 25000 },
  { key: 'wave', name: 'Wave Grid', cycleMs: 15000 },
  { key: 'spiral', name: 'Golden Spiral', cycleMs: 30000 },
  { key: 'constellation', name: 'Constellation', cycleMs: 20000 },
]

// ============================================================================
// PATTERN 1: CONCENTRIC RINGS
// ============================================================================
class ConcentricRingsPattern {
  constructor(width, height, config, clearRadius) {
    this.width = width
    this.height = height
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
    this.rings = []
    this.particles = []
    this.build()
  }

  build() {
    // Create rings
    for (let i = 0; i < 12; i++) {
      const radius = this.clearRadius + 80 + i * 60
      this.rings.push({ radius, rotationOffset: i * 0.1 })
    }
    // Create orbiting particles
    for (let i = 0; i < 8; i++) {
      const orbitRadius = this.clearRadius + 120 + i * 80
      this.particles.push({
        orbitRadius,
        angle: (i / 8) * Math.PI * 2,
        speed: 0.3 + i * 0.05,
        size: 3 + Math.random() * 2,
      })
    }
  }

  render(ctx, t) {
    const alpha = envelope(t)
    const progress = triangle(t)

    ctx.save()

    // Draw rings
    this.rings.forEach((ring, i) => {
      const reveal = clamp((progress * 2 - i * 0.05) * 2, 0, 1)
      if (reveal <= 0) return

      ctx.globalAlpha = alpha * 0.15 * reveal
      ctx.strokeStyle = palette.gold
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(this.centerX, this.centerY, ring.radius, 0, Math.PI * 2)
      ctx.stroke()
    })

    // Draw particles
    this.particles.forEach((p, i) => {
      const reveal = clamp((progress * 2 - 0.3) * 2, 0, 1)
      if (reveal <= 0) return

      const angle = p.angle + t * p.speed * Math.PI * 2
      const x = this.centerX + Math.cos(angle) * p.orbitRadius
      const y = this.centerY + Math.sin(angle) * p.orbitRadius

      // Glow
      ctx.globalAlpha = alpha * 0.3 * reveal
      ctx.fillStyle = palette.glow
      ctx.beginPath()
      ctx.arc(x, y, p.size * 3, 0, Math.PI * 2)
      ctx.fill()

      // Core
      ctx.globalAlpha = alpha * 0.8 * reveal
      ctx.fillStyle = palette.gold
      ctx.beginPath()
      ctx.arc(x, y, p.size, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.restore()
  }
}

// ============================================================================
// PATTERN 2: TESSELLATION
// ============================================================================
class TessellationPattern {
  constructor(width, height, config, clearRadius) {
    this.width = width
    this.height = height
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
    this.cells = []
    this.build()
  }

  build() {
    const cellSize = 40
    const cols = Math.ceil(this.width / cellSize) + 2
    const rows = Math.ceil(this.height / cellSize) + 2

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * cellSize - cellSize
        const y = row * cellSize - cellSize
        const cx = x + cellSize / 2
        const cy = y + cellSize / 2
        const dist = Math.sqrt((cx - this.centerX) ** 2 + (cy - this.centerY) ** 2)

        if (dist < this.clearRadius * 1.2) continue

        this.cells.push({
          x,
          y,
          size: cellSize,
          dist,
          phase: Math.random(),
        })
      }
    }
  }

  render(ctx, t) {
    const alpha = envelope(t)
    const progress = triangle(t)

    ctx.save()

    this.cells.forEach((cell) => {
      const maxDist = Math.sqrt(this.centerX ** 2 + this.centerY ** 2)
      const normDist = cell.dist / maxDist
      const reveal = clamp((progress * 2 - (1 - normDist)) * 2, 0, 1)

      if (reveal <= 0) return

      const pulse = 0.5 + 0.5 * Math.sin(t * Math.PI * 4 + cell.phase * Math.PI * 2)

      ctx.globalAlpha = alpha * (0.1 + pulse * 0.2) * reveal
      ctx.strokeStyle = palette.gold
      ctx.lineWidth = 1

      ctx.save()
      ctx.translate(cell.x + cell.size / 2, cell.y + cell.size / 2)
      ctx.rotate(Math.PI / 4)
      ctx.strokeRect(-cell.size / 2 + 2, -cell.size / 2 + 2, cell.size - 4, cell.size - 4)
      ctx.restore()
    })

    ctx.restore()
  }
}

// ============================================================================
// PATTERN 3: GAME OF LIFE
// ============================================================================
class GameOfLifePattern {
  constructor(width, height, config, clearRadius) {
    this.width = width
    this.height = height
    this.config = config
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
    this.cellSize = config.golGridSize || 12
    this.cols = Math.ceil(this.width / this.cellSize)
    this.rows = Math.ceil(this.height / this.cellSize)
    this.grid = []
    this.nextGrid = []
    this.lastT = -1
    this.build()
  }

  build() {
    for (let y = 0; y < this.rows; y++) {
      this.grid[y] = new Array(this.cols).fill(0)
      this.nextGrid[y] = new Array(this.cols).fill(0)
    }

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const cellCx = (x + 0.5) * this.cellSize
        const cellCy = (y + 0.5) * this.cellSize
        const distFromCenter = Math.sqrt(
          (cellCx - this.centerX) ** 2 + (cellCy - this.centerY) ** 2
        )

        if (distFromCenter < this.clearRadius * 1.4) continue
        this.grid[y][x] = Math.random() < 0.12 ? 1 : 0
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

  render(ctx, t) {
    const progress = triangle(t)
    const alpha = envelope(t)

    const stepsPerCycle = 25
    const currentStep = Math.floor(t * stepsPerCycle)
    const lastStep = Math.floor(this.lastT * stepsPerCycle)

    if (this.lastT < 0 || currentStep !== lastStep || (t < this.lastT && this.lastT > 0.9)) {
      this.step()
    }
    this.lastT = t

    ctx.save()

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

        const maxDist = Math.sqrt(this.centerX ** 2 + this.centerY ** 2)
        const normalizedDist = distFromCenter / maxDist
        const cellReveal = clamp((progress * 2 - (1 - normalizedDist)) * 2, 0, 1)

        if (cellReveal < 0.05) continue

        // Glow
        ctx.globalAlpha = alpha * 0.2 * cellReveal
        ctx.fillStyle = palette.glow
        ctx.beginPath()
        ctx.arc(cellCx, cellCy, this.cellSize * 0.6, 0, Math.PI * 2)
        ctx.fill()

        // Cell
        ctx.globalAlpha = alpha * 0.7 * cellReveal
        ctx.fillStyle = palette.gold
        ctx.beginPath()
        ctx.roundRect(cellX + 1, cellY + 1, this.cellSize - 2, this.cellSize - 2, 2)
        ctx.fill()
      }
    }

    ctx.restore()
  }
}

// ============================================================================
// PATTERN 4: HEXAGON HONEYCOMB
// ============================================================================
class HexagonPattern {
  constructor(width, height, config, clearRadius) {
    this.width = width
    this.height = height
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
    this.hexagons = []
    this.build()
  }

  build() {
    const hexWidth = 50
    const hexHeight = 43
    const cols = Math.ceil(this.width / (hexWidth * 0.75)) + 2
    const rows = Math.ceil(this.height / hexHeight) + 2

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * hexWidth * 0.75
        const y = row * hexHeight + (col % 2) * (hexHeight / 2)
        const dist = Math.sqrt((x - this.centerX) ** 2 + (y - this.centerY) ** 2)

        if (dist < this.clearRadius * 1.2) continue

        this.hexagons.push({
          x,
          y,
          dist,
          phase: Math.random(),
        })
      }
    }
  }

  drawHexagon(ctx, x, y, size) {
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6
      const hx = x + size * Math.cos(angle)
      const hy = y + size * Math.sin(angle)
      if (i === 0) ctx.moveTo(hx, hy)
      else ctx.lineTo(hx, hy)
    }
    ctx.closePath()
  }

  render(ctx, t) {
    const alpha = envelope(t)
    const progress = triangle(t)

    ctx.save()

    this.hexagons.forEach((hex) => {
      const maxDist = Math.sqrt(this.centerX ** 2 + this.centerY ** 2)
      const normDist = hex.dist / maxDist
      const reveal = clamp((progress * 2 - (1 - normDist)) * 2, 0, 1)

      if (reveal <= 0) return

      const pulse = 0.5 + 0.5 * Math.sin(t * Math.PI * 4 + hex.phase * Math.PI * 2)

      ctx.globalAlpha = alpha * (0.15 + pulse * 0.25) * reveal
      ctx.strokeStyle = palette.gold
      ctx.lineWidth = 1

      this.drawHexagon(ctx, hex.x, hex.y, 22)
      ctx.stroke()
    })

    ctx.restore()
  }
}

// ============================================================================
// PATTERN 5: MORPHING SHAPE
// ============================================================================
class MorphingShapePattern {
  constructor(width, height, config, clearRadius) {
    this.width = width
    this.height = height
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
  }

  render(ctx, t) {
    const alpha = envelope(t)
    const progress = triangle(t)

    ctx.save()
    ctx.translate(this.centerX, this.centerY)

    // Background rings
    for (let i = 0; i < 5; i++) {
      const radius = this.clearRadius + 60 + i * 70
      const reveal = clamp((progress * 2 - i * 0.1) * 2, 0, 1)

      ctx.globalAlpha = alpha * 0.1 * reveal
      ctx.strokeStyle = palette.gold
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(0, 0, radius, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Morphing shape
    const size = this.clearRadius + 80
    const morphT = (t * 4) % 1
    const points = 64

    ctx.globalAlpha = alpha * 0.4 * progress
    ctx.strokeStyle = palette.gold
    ctx.lineWidth = 2
    ctx.beginPath()

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2
      const morph1 = Math.sin(angle * 3 + t * Math.PI * 2) * 0.2
      const morph2 = Math.cos(angle * 5 - t * Math.PI * 3) * 0.15
      const r = size * (1 + morph1 + morph2)

      const x = Math.cos(angle) * r
      const y = Math.sin(angle) * r

      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }

    ctx.stroke()

    // Inner rotating square
    ctx.globalAlpha = alpha * 0.2 * progress
    ctx.save()
    ctx.rotate(t * Math.PI * 2)
    ctx.strokeRect(-size * 0.5, -size * 0.5, size, size)
    ctx.restore()

    ctx.restore()
  }
}

// ============================================================================
// PATTERN 6: PENROSE TRIANGLE
// ============================================================================
class PenroseTrianglePattern {
  constructor(width, height, config, clearRadius) {
    this.width = width
    this.height = height
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
  }

  render(ctx, t) {
    const alpha = envelope(t)
    const progress = triangle(t)

    ctx.save()
    ctx.translate(this.centerX, this.centerY)
    ctx.rotate(t * Math.PI * 0.1)

    const size = this.clearRadius + 100
    const points = [
      { x: 0, y: -size },
      { x: size * 0.866, y: size * 0.5 },
      { x: -size * 0.866, y: size * 0.5 },
    ]

    // Draw lines with draw-on effect
    const lineProgress = clamp(progress * 3, 0, 1)

    ctx.strokeStyle = palette.gold
    ctx.lineWidth = 2
    ctx.lineCap = 'round'

    // Glow layer
    ctx.globalAlpha = alpha * 0.3 * lineProgress
    ctx.shadowColor = palette.gold
    ctx.shadowBlur = 10

    for (let i = 0; i < 3; i++) {
      const start = points[i]
      const end = points[(i + 1) % 3]
      const segmentProgress = clamp((lineProgress - i * 0.3) * 3, 0, 1)

      if (segmentProgress <= 0) continue

      ctx.beginPath()
      ctx.moveTo(start.x, start.y)
      ctx.lineTo(
        start.x + (end.x - start.x) * segmentProgress,
        start.y + (end.y - start.y) * segmentProgress
      )
      ctx.stroke()
    }

    // Inner lines
    ctx.shadowBlur = 0
    ctx.globalAlpha = alpha * 0.15 * progress
    ctx.lineWidth = 1

    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    ctx.lineTo(0, size * 0.5)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(0, size * 0.5)
    ctx.lineTo(points[1].x * 0.5, 0)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(0, size * 0.5)
    ctx.lineTo(points[2].x * 0.5, 0)
    ctx.stroke()

    // Nodes
    const nodeReveal = clamp((progress - 0.5) * 2, 0, 1)
    ctx.globalAlpha = alpha * 0.9 * nodeReveal
    ctx.fillStyle = palette.gold

    points.forEach((p) => {
      ctx.beginPath()
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.beginPath()
    ctx.arc(0, size * 0.5, 4, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }
}

// ============================================================================
// PATTERN 7: ORBITAL SYSTEM
// ============================================================================
class OrbitalSystemPattern {
  constructor(width, height, config, clearRadius) {
    this.width = width
    this.height = height
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
    this.orbits = []
    this.build()
  }

  build() {
    for (let i = 0; i < 6; i++) {
      this.orbits.push({
        radius: this.clearRadius + 80 + i * 70,
        speed: 0.2 + i * 0.08,
        particleAngle: Math.random() * Math.PI * 2,
        particleSize: 4 + Math.random() * 3,
      })
    }
  }

  render(ctx, t) {
    const alpha = envelope(t)
    const progress = triangle(t)

    ctx.save()

    // Draw orbits and particles
    this.orbits.forEach((orbit, i) => {
      const reveal = clamp((progress * 2 - i * 0.1) * 2, 0, 1)
      if (reveal <= 0) return

      // Orbit ring
      ctx.globalAlpha = alpha * 0.12 * reveal
      ctx.strokeStyle = palette.gold
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(this.centerX, this.centerY, orbit.radius, 0, Math.PI * 2)
      ctx.stroke()

      // Orbiting particle
      const angle = orbit.particleAngle + t * orbit.speed * Math.PI * 2
      const x = this.centerX + Math.cos(angle) * orbit.radius
      const y = this.centerY + Math.sin(angle) * orbit.radius

      // Particle glow
      ctx.globalAlpha = alpha * 0.4 * reveal
      ctx.fillStyle = palette.glow
      ctx.beginPath()
      ctx.arc(x, y, orbit.particleSize * 3, 0, Math.PI * 2)
      ctx.fill()

      // Particle core
      ctx.globalAlpha = alpha * 0.9 * reveal
      ctx.fillStyle = palette.gold
      ctx.beginPath()
      ctx.arc(x, y, orbit.particleSize, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.restore()
  }
}

// ============================================================================
// PATTERN 8: WAVE GRID
// ============================================================================
class WaveGridPattern {
  constructor(width, height, config, clearRadius) {
    this.width = width
    this.height = height
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
    this.dots = []
    this.build()
  }

  build() {
    const spacing = 30
    const cols = Math.ceil(this.width / spacing)
    const rows = Math.ceil(this.height / spacing)

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * spacing + spacing / 2
        const y = row * spacing + spacing / 2
        const dist = Math.sqrt((x - this.centerX) ** 2 + (y - this.centerY) ** 2)

        if (dist < this.clearRadius * 1.3) continue

        this.dots.push({
          x,
          y,
          baseY: y,
          dist,
          phase: (col + row) * 0.2,
        })
      }
    }
  }

  render(ctx, t) {
    const alpha = envelope(t)
    const progress = triangle(t)

    ctx.save()

    this.dots.forEach((dot) => {
      const maxDist = Math.sqrt(this.centerX ** 2 + this.centerY ** 2)
      const normDist = dot.dist / maxDist
      const reveal = clamp((progress * 2 - (1 - normDist)) * 2, 0, 1)

      if (reveal <= 0) return

      const wave = Math.sin(t * Math.PI * 4 + dot.phase) * 10
      const y = dot.baseY + wave
      const scale = 1 + Math.sin(t * Math.PI * 2 + dot.phase) * 0.3

      ctx.globalAlpha = alpha * 0.5 * reveal
      ctx.fillStyle = palette.gold
      ctx.beginPath()
      ctx.arc(dot.x, y, 4 * scale, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.restore()
  }
}

// ============================================================================
// PATTERN 9: GOLDEN SPIRAL
// ============================================================================
class GoldenSpiralPattern {
  constructor(width, height, config, clearRadius) {
    this.width = width
    this.height = height
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
    this.segments = []
    this.build()
  }

  build() {
    const goldenAngle = 137.5 * (Math.PI / 180)

    for (let i = 0; i < 50; i++) {
      const angle = i * goldenAngle
      const radius = this.clearRadius + 30 + i * 10
      const x = this.centerX + Math.cos(angle) * radius
      const y = this.centerY + Math.sin(angle) * radius

      this.segments.push({
        x,
        y,
        radius,
        angle,
        index: i,
      })
    }
  }

  render(ctx, t) {
    const alpha = envelope(t)
    const progress = triangle(t)

    ctx.save()
    ctx.translate(this.centerX, this.centerY)
    ctx.rotate(t * Math.PI * 0.5)
    ctx.translate(-this.centerX, -this.centerY)

    this.segments.forEach((seg, i) => {
      const reveal = clamp((progress * 2 - i * 0.02) * 2, 0, 1)
      if (reveal <= 0) return

      // Glow
      ctx.globalAlpha = alpha * 0.3 * reveal
      ctx.fillStyle = palette.glow
      ctx.beginPath()
      ctx.arc(seg.x, seg.y, 8, 0, Math.PI * 2)
      ctx.fill()

      // Dot
      ctx.globalAlpha = alpha * 0.8 * reveal
      ctx.fillStyle = palette.gold
      ctx.beginPath()
      ctx.arc(seg.x, seg.y, 3, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.restore()
  }
}

// ============================================================================
// PATTERN 10: CONSTELLATION
// ============================================================================
class ConstellationPattern {
  constructor(width, height, config, clearRadius) {
    this.width = width
    this.height = height
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
    this.stars = []
    this.connections = []
    this.build()
  }

  build() {
    // Generate stars
    const starCount = 12
    for (let i = 0; i < starCount; i++) {
      let x, y, dist
      let attempts = 0
      do {
        x = 100 + Math.random() * (this.width - 200)
        y = 100 + Math.random() * (this.height - 200)
        dist = Math.sqrt((x - this.centerX) ** 2 + (y - this.centerY) ** 2)
        attempts++
      } while (dist < this.clearRadius * 1.3 && attempts < 50)

      this.stars.push({
        x,
        y,
        size: 4 + Math.random() * 4,
        phase: Math.random(),
      })
    }

    // Generate connections
    const maxDist = 200
    for (let i = 0; i < this.stars.length; i++) {
      for (let j = i + 1; j < this.stars.length; j++) {
        const dist = Math.sqrt(
          (this.stars[i].x - this.stars[j].x) ** 2 + (this.stars[i].y - this.stars[j].y) ** 2
        )
        if (dist < maxDist) {
          this.connections.push({
            from: i,
            to: j,
            dist,
          })
        }
      }
    }
  }

  render(ctx, t) {
    const alpha = envelope(t)
    const progress = triangle(t)

    ctx.save()

    // Draw connections
    const lineReveal = clamp(progress * 1.5, 0, 1)
    ctx.strokeStyle = palette.gold
    ctx.lineWidth = 1

    this.connections.forEach((conn, i) => {
      const connReveal = clamp((lineReveal - i * 0.05) * 2, 0, 1)
      if (connReveal <= 0) return

      const from = this.stars[conn.from]
      const to = this.stars[conn.to]

      ctx.globalAlpha = alpha * 0.2 * connReveal
      ctx.beginPath()
      ctx.moveTo(from.x, from.y)
      ctx.lineTo(from.x + (to.x - from.x) * connReveal, from.y + (to.y - from.y) * connReveal)
      ctx.stroke()
    })

    // Draw stars
    this.stars.forEach((star, i) => {
      const starReveal = clamp((progress * 2 - i * 0.05) * 2, 0, 1)
      if (starReveal <= 0) return

      const pulse = 0.7 + 0.3 * Math.sin(t * Math.PI * 4 + star.phase * Math.PI * 2)

      // Glow
      ctx.globalAlpha = alpha * 0.4 * starReveal * pulse
      ctx.fillStyle = palette.glow
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
      ctx.fill()

      // Star
      ctx.globalAlpha = alpha * 0.9 * starReveal
      ctx.fillStyle = palette.gold
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.restore()
  }
}

// ============================================================================
// FACTORY FUNCTION
// ============================================================================
export function createPattern(key, width, height, config, clearRadius) {
  switch (key) {
    case 'rings':
      return new ConcentricRingsPattern(width, height, config, clearRadius)
    case 'tessellation':
      return new TessellationPattern(width, height, config, clearRadius)
    case 'life':
      return new GameOfLifePattern(width, height, config, clearRadius)
    case 'hexagon':
      return new HexagonPattern(width, height, config, clearRadius)
    case 'morph':
      return new MorphingShapePattern(width, height, config, clearRadius)
    case 'triangle':
      return new PenroseTrianglePattern(width, height, config, clearRadius)
    case 'orbital':
      return new OrbitalSystemPattern(width, height, config, clearRadius)
    case 'wave':
      return new WaveGridPattern(width, height, config, clearRadius)
    case 'spiral':
      return new GoldenSpiralPattern(width, height, config, clearRadius)
    case 'constellation':
      return new ConstellationPattern(width, height, config, clearRadius)
    default:
      return new ConcentricRingsPattern(width, height, config, clearRadius)
  }
}

// ============================================================================
// RESOLVER FUNCTION
// ============================================================================
export function resolvePatternFromParam(param) {
  if (param) {
    const found = patternConfigs.find((p) => p.key === param)
    if (found) return found
  }
  // Return random pattern
  return patternConfigs[Math.floor(Math.random() * patternConfigs.length)]
}
