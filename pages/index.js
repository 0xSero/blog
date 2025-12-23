import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import { patternConfigs, createPattern, resolvePatternFromParam } from '@/lib/patterns'

// ============================================================================
// UNIFIED ESCHER ANIMATION SYSTEM
// One connected structure grown from border, BFS reveal, loopable cycle
// ============================================================================

// Utility functions
const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
const lerp = (a, b, t) => a + (b - a) * t
const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}
// Symmetric envelope: 0→1→0 over t∈[0,1] for perfect loop
const envelope = (t) => Math.sin(t * Math.PI)
// Triangle wave for symmetric grow/shrink
const triangle = (t) => 1 - Math.abs(2 * t - 1)
const hash = (n) => {
  let h = n * 374761393
  h = ((h >> 16) ^ h) * 2246822507
  h = ((h >> 16) ^ h) * 3266489909
  return (h >> 16) ^ h
}

// Palette (dark paper + light ink + paper highlight aesthetic)
const palette = {
  base: 'hsl(30, 5%, 10.5%)',
  baseDeep: 'hsl(30, 5%, 8%)',
  baseLift: 'hsl(30, 5%, 14%)',
  center: 'hsl(40, 30%, 96%)',
  centerSoft: 'hsla(40, 25%, 92%, 0.9)',
  ink: 'hsla(40, 20%, 92%, 0.75)',
  inkBright: 'hsla(40, 25%, 95%, 0.9)',
  inkSoft: 'hsla(35, 18%, 70%, 0.45)',
  inkFaint: 'hsla(35, 12%, 55%, 0.2)',
  glow: 'hsla(40, 25%, 88%, 0.35)',
  warmPulse: 'hsla(35, 40%, 75%, 0.6)',
  // Paper highlights - warm cream tones for tasteful accents
  highlight: 'hsla(45, 35%, 85%, 0.5)',
  highlightBright: 'hsla(45, 40%, 92%, 0.7)',
  highlightSubtle: 'hsla(40, 25%, 75%, 0.25)',
}

// Pattern configurations are now imported from @/lib/patterns

// ============================================================================
// PATTERN 1: GAME OF LIFE
// Conway's Game of Life - starts sparse, grows dense, then fades back
// ============================================================================
class GameOfLifePattern {
  constructor(width, height, config, clearRadius) {
    this.width = width
    this.height = height
    this.config = config
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
    this.cellSize = config.golGridSize || 14
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
        // At progress=0, nothing visible
        // At progress=0.5, everything visible
        // At progress=1, fading back out
        const maxDist = Math.sqrt(this.centerX ** 2 + this.centerY ** 2)
        const normalizedDist = distFromCenter / maxDist // 0=center, 1=edge

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

// ============================================================================
// PATTERN 5B: BOND OF UNION (Escher's Intertwined Faces)
// Two ribbon-constructed profiles sharing a continuous band
// ============================================================================
const bondPalette = {
  base: 'hsl(35, 25%, 88%)',
  ink: 'hsl(25, 30%, 25%)',
  inkSoft: 'hsl(30, 20%, 45%)',
  highlight: 'hsla(45, 35%, 85%, 0.85)',
  glow: 'hsla(35, 30%, 70%, 0.3)',
}

class BondOfUnionPattern {
  constructor(width, height, config, clearRadius) {
    this.width = width
    this.height = height
    this.config = config
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
    const minDim = Math.min(width, height)
    this.headRadius = minDim * 0.18
    this.bandCount = 18
    this.ribbonBands = []
    this.spheres = []
    this.build()
  }

  profileRadiusAt(yNorm) {
    const base = 0.6 + 0.35 * Math.cos(yNorm * Math.PI)
    const gauss = (x, mu, sigma) => {
      const d = x - mu
      return Math.exp(-(d * d) / (2 * sigma * sigma))
    }
    const nose = gauss(yNorm, -0.1, 0.18) * 0.55
    const lips = gauss(yNorm, 0.05, 0.07) * 0.2
    const chin = gauss(yNorm, 0.35, 0.16) * 0.25
    const forehead = gauss(yNorm, -0.6, 0.22) * 0.18
    const neck = -gauss(yNorm, 0.95, 0.18) * 0.4
    return Math.max(0.45, base + nose + lips + chin + forehead + neck)
  }

  buildFace(centerX, centerY, facing, phaseOffset) {
    const radius = this.headRadius
    const sign = facing === 'right' ? 1 : -1
    const bands = []

    for (let i = 0; i < this.bandCount; i++) {
      const t = this.bandCount === 1 ? 0.5 : i / (this.bandCount - 1)
      const yNorm = lerp(-0.95, 0.95, t)
      const y = centerY + yNorm * radius

      const distToCenter = Math.hypot(centerX - this.centerX, y - this.centerY)
      if (distToCenter < this.clearRadius * 0.9) continue

      const profileR = this.profileRadiusAt(yNorm) * radius
      const thicknessPx = clamp(radius * 0.045 + (1 - Math.abs(yNorm)) * radius * 0.03, 8, 14)
      const lengthFactor = 0.7 + (1 - Math.abs(yNorm)) * 0.55
      const halfLen = profileR * lengthFactor

      const xFront = centerX + sign * profileR
      const center = sign > 0 ? xFront - halfLen : xFront + halfLen

      const depthPhase = (t + phaseOffset) * Math.PI * 2
      const depth = Math.sin(depthPhase)

      bands.push({
        face: facing,
        index: i,
        centerX: center,
        y,
        length: halfLen * 2,
        thickness: thicknessPx,
        yNorm,
        profileR,
        depth,
        distToCenter,
        wrapPhase: (t + phaseOffset) % 1,
      })
    }

    return bands
  }

  buildConnectors(leftBands, rightBands) {
    const connectors = []
    const count = Math.min(leftBands.length, rightBands.length)
    for (let i = 0; i < count; i++) {
      const left = leftBands[i]
      const right = rightBands[i]
      if (!left || !right) continue
      const midY = (left.y + right.y) / 2
      const midX = (left.centerX + right.centerX) / 2
      const length = Math.abs(right.centerX - left.centerX) - this.headRadius * 0.4
      if (length <= 0) continue

      const distToCenter = Math.hypot(midX - this.centerX, midY - this.centerY)
      if (distToCenter < this.clearRadius * 0.8) continue

      const t = this.bandCount === 1 ? 0.5 : i / (this.bandCount - 1)
      const yNorm = (midY - this.centerY) / this.headRadius
      const baseThickness = this.headRadius * 0.035 + (1 - Math.abs(yNorm)) * this.headRadius * 0.02
      const thickness = clamp(baseThickness, 7, 12)
      const depth = Math.sin((t + 0.18) * Math.PI * 2)

      connectors.push({
        face: 'connector',
        index: i,
        centerX: midX,
        y: midY,
        length,
        thickness,
        yNorm,
        profileR: 0,
        depth,
        distToCenter,
        wrapPhase: (t + 0.18) % 1,
      })
    }
    return connectors
  }

  buildSpheres() {
    const spheres = []
    const count = 12
    const minDim = Math.min(this.width, this.height)
    const maxRadius = Math.max(6, minDim * 0.018)
    const minRadius = Math.max(4, maxRadius * 0.6)

    let attempts = 0
    while (spheres.length < count && attempts < count * 8) {
      attempts += 1
      const angle = (attempts / count) * Math.PI * 2 + Math.random() * 0.6
      const band = this.headRadius * (0.7 + Math.random() * 0.9)
      const baseDist = this.clearRadius * 1.15 + band
      const x = this.centerX + Math.cos(angle) * baseDist * 0.75
      const y = this.centerY + Math.sin(angle) * baseDist * 0.9
      const distToCenter = Math.hypot(x - this.centerX, y - this.centerY)
      if (distToCenter < this.clearRadius * 0.95) continue
      const radius = minRadius + Math.random() * (maxRadius - minRadius)
      spheres.push({
        x,
        y,
        radius,
        phase: Math.random(),
        bobAmplitude: radius * (0.7 + Math.random() * 0.8),
      })
    }

    return spheres
  }

  build() {
    const cx = this.centerX
    const cy = this.centerY
    const spacing = this.headRadius * 2.6
    const leftCx = cx - spacing / 2
    const rightCx = cx + spacing / 2

    const leftBands = this.buildFace(leftCx, cy, 'right', 0)
    const rightBands = this.buildFace(rightCx, cy, 'left', 0.35)
    const connectors = this.buildConnectors(leftBands, rightBands)

    this.ribbonBands = [...leftBands, ...rightBands, ...connectors].sort((a, b) => {
      if (a.depth === b.depth) return a.y - b.y
      return a.depth - b.depth
    })

    this.spheres = this.buildSpheres()
  }

  drawRoundedRibbon(ctx, x, y, w, h, r) {
    const radius = Math.min(r, h / 2, w / 2)
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + w - radius, y)
    ctx.arcTo(x + w, y, x + w, y + radius, radius)
    ctx.lineTo(x + w, y + h - radius)
    ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius)
    ctx.lineTo(x + radius, y + h)
    ctx.arcTo(x, y + h, x, y + h - radius, radius)
    ctx.lineTo(x, y + radius)
    ctx.arcTo(x, y, x + radius, y, radius)
    ctx.closePath()
  }

  drawRibbonBand(ctx, band, reveal) {
    if (reveal <= 0) return

    const { centerX, y, length, thickness, wrapPhase } = band
    const width = length
    const height = thickness
    const twist = Math.sin(wrapPhase * Math.PI * 2)
    const shadeFactor = 0.5 + 0.5 * twist

    ctx.save()
    ctx.translate(centerX, y)

    ctx.globalAlpha = reveal * 0.18
    ctx.fillStyle = bondPalette.glow
    this.drawRoundedRibbon(ctx, -width / 2, -height / 2, width, height, height / 2)
    ctx.fill()

    const grad = ctx.createLinearGradient(0, -height / 2, 0, height / 2)
    grad.addColorStop(0, bondPalette.highlight)
    grad.addColorStop(0.45, bondPalette.base)
    grad.addColorStop(0.55, bondPalette.base)
    grad.addColorStop(1, bondPalette.inkSoft)

    ctx.globalAlpha = reveal * (0.75 + shadeFactor * 0.2)
    ctx.fillStyle = grad
    this.drawRoundedRibbon(ctx, -width / 2, -height / 2, width, height, height / 2)
    ctx.fill()

    ctx.globalAlpha = reveal * 0.7
    ctx.strokeStyle = bondPalette.ink
    ctx.lineWidth = 0.9
    this.drawRoundedRibbon(ctx, -width / 2, -height / 2, width, height, height / 2)
    ctx.stroke()

    ctx.globalAlpha = reveal * 0.45
    ctx.strokeStyle = bondPalette.highlight
    ctx.lineWidth = 0.7
    ctx.beginPath()
    ctx.moveTo(-width / 2 + 1.5, -height / 2 + 1)
    ctx.lineTo(width / 2 - 1.5, -height / 2 + 1)
    ctx.stroke()

    ctx.globalAlpha = reveal * 0.4
    ctx.strokeStyle = bondPalette.inkSoft
    ctx.beginPath()
    ctx.moveTo(-width / 2 + 1.5, height / 2 - 1)
    ctx.lineTo(width / 2 - 1.5, height / 2 - 1)
    ctx.stroke()

    const hatchSpacing = Math.max(4, height * 0.9)
    ctx.globalAlpha = reveal * 0.22
    ctx.strokeStyle = bondPalette.inkSoft
    ctx.lineWidth = 0.6
    for (let x = -width / 2 + 3; x < width / 2 - 2; x += hatchSpacing) {
      ctx.beginPath()
      ctx.moveTo(x, -height / 2 + 1)
      ctx.lineTo(x + height * 0.6, height / 2 - 1)
      ctx.stroke()
    }

    ctx.restore()
  }

  drawSphere(ctx, sphere, reveal, t, layer) {
    if (reveal <= 0) return

    const { x, y, radius, phase, bobAmplitude } = sphere
    const bobT = (t + phase) % 1
    const bob = Math.sin(bobT * Math.PI * 2) * bobAmplitude

    ctx.save()
    ctx.translate(x, y + bob)

    if (layer === 'back' || layer === 'full') {
      ctx.globalAlpha = reveal * 0.22
      ctx.fillStyle = bondPalette.glow
      ctx.beginPath()
      ctx.ellipse(0, radius * 0.6, radius * 1.25, radius * 0.75, 0, 0, Math.PI * 2)
      ctx.fill()
    }

    if (layer !== 'back') {
      ctx.globalAlpha = reveal * 0.9
      const grad = ctx.createRadialGradient(
        -radius * 0.35,
        -radius * 0.35,
        radius * 0.2,
        0,
        0,
        radius
      )
      grad.addColorStop(0, bondPalette.highlight)
      grad.addColorStop(0.5, bondPalette.base)
      grad.addColorStop(1, bondPalette.inkSoft)
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(0, 0, radius, 0, Math.PI * 2)
      ctx.fill()

      ctx.globalAlpha = reveal * 0.7
      ctx.strokeStyle = bondPalette.ink
      ctx.lineWidth = 0.9
      ctx.beginPath()
      ctx.arc(0, 0, radius, 0, Math.PI * 2)
      ctx.stroke()

      ctx.globalAlpha = reveal * 0.85
      ctx.fillStyle = bondPalette.highlight
      ctx.beginPath()
      ctx.arc(-radius * 0.35, -radius * 0.4, radius * 0.32, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }

  render(ctx, t) {
    const progress = triangle(t)
    const alpha = envelope(t)

    const ribbonRevealBase = alpha * smoothstep(0.05, 0.7, progress)
    const spheresBackReveal = alpha * smoothstep(0.15, 0.8, progress)
    const spheresFrontReveal = alpha * smoothstep(0.25, 0.95, progress)

    ctx.save()

    this.spheres.forEach((sphere) => {
      this.drawSphere(ctx, sphere, spheresBackReveal, t, 'back')
    })

    this.ribbonBands.forEach((band) => {
      const bandBase = this.bandCount === 1 ? 0.5 : band.index / (this.bandCount - 1)
      const local = clamp((ribbonRevealBase - bandBase * 0.55) * 2.0, 0, 1)
      if (local <= 0.01) return
      this.drawRibbonBand(ctx, band, local)
    })

    this.spheres.forEach((sphere) => {
      this.drawSphere(ctx, sphere, spheresFrontReveal, t, 'front')
    })

    ctx.restore()
  }
}

// =========================================================================
// FIBER BACKGROUND (shared across all patterns)
// ============================================================================
const buildFibers = (width, height) => {
  const fibers = []
  const count = Math.round(Math.min(width, height) / 60)
  for (let i = 0; i < count; i++) {
    fibers.push({
      x: Math.random() * width,
      y: Math.random() * height,
      length: 0.08 * width + Math.random() * 0.16 * width,
      angle: -0.35 + Math.random() * 0.7,
      alpha: 0.02 + Math.random() * 0.04,
    })
  }
  return fibers
}

const drawPaper = (ctx, width, height, fibers) => {
  ctx.fillStyle = palette.base
  ctx.fillRect(0, 0, width, height)

  ctx.save()
  ctx.strokeStyle = palette.inkFaint
  fibers.forEach((fiber) => {
    ctx.globalAlpha = fiber.alpha
    ctx.lineWidth = 0.6
    ctx.beginPath()
    ctx.moveTo(fiber.x, fiber.y)
    ctx.lineTo(
      fiber.x + Math.cos(fiber.angle) * fiber.length,
      fiber.y + Math.sin(fiber.angle) * fiber.length
    )
    ctx.stroke()
  })
  ctx.restore()
}

const drawCenterDisc = (ctx, centerX, centerY, radius, transitionProgress) => {
  ctx.save()
  ctx.globalAlpha = 0.98
  ctx.fillStyle = palette.center
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  if (transitionProgress > 0) {
    ctx.fillStyle = `hsla(40, 30%, 96%, ${transitionProgress})`
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function Index() {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  const handleEnter = () => {
    setIsTransitioning(true)
    sessionStorage.setItem('sybil_visited', 'true')
    setTimeout(() => {
      router.push('/home')
    }, 1200)
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    const timer = setTimeout(() => setIsLoaded(true), 100)

    const canvas = canvasRef.current
    if (!canvas) {
      return () => clearTimeout(timer)
    }

    const ctx = canvas.getContext('2d')
    let transitionProgress = 0
    let canvasScale = 1
    let fibers = []
    let pattern = null
    let startTime = performance.now()

    // Resolve pattern from URL or pick random
    const patternParam = params.get('pattern')
    const activeConfig = resolvePatternFromParam(patternParam)

    const createPatternInstance = (width, height) => {
      const minDim = Math.min(width, height)
      const isMobile = width < 640

      // Mobile: use width-based layout since screen is tall and narrow
      // Desktop: use minDim-based layout for balanced appearance
      const mobileOverrides = {
        metamorph: isMobile
          ? {
              // For mobile: larger center circle, eyes fill remaining space
              eyeSpacing: 40,
              ringSpacing: 28,
              ringCount: 20,
              edgePadding: 4,
              eyeScale: 0.5,
              clearRadius: 0.95, // Almost full screen width
            }
          : {
              // Desktop: original balanced look
              eyeSpacing: 50,
              ringSpacing: 42,
              ringCount: 12,
              edgePadding: 14,
              eyeScale: 0.9,
            },
        life: {
          golGridSize: isMobile ? 8 : 12,
        },
        tri: {},
      }

      const patternConfig = {
        ...activeConfig,
        ...(mobileOverrides[activeConfig.key] || {}),
      }

      // For mobile: 45% of width as radius = 90% of screen width as diameter
      // For desktop: use minDim-based calculation
      const clearRadius = isMobile
        ? width * 0.45
        : minDim * (patternConfig.clearRadius || activeConfig.clearRadius)
      return createPattern(activeConfig.key, width, height, patternConfig, clearRadius)
    }

    const resize = () => {
      canvasScale = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * canvasScale
      canvas.height = window.innerHeight * canvasScale
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(canvasScale, 0, 0, canvasScale, 0, 0)

      const width = window.innerWidth
      const height = window.innerHeight
      fibers = buildFibers(width, height)
      pattern = createPatternInstance(width, height)
    }

    resize()
    window.addEventListener('resize', resize)

    // Store clearRadius from pattern creation for use in animate
    let storedClearRadius = 0

    const animate = (currentTime) => {
      const width = canvas.width / canvasScale
      const height = canvas.height / canvasScale
      const centerX = width / 2
      const centerY = height / 2
      const isMobile = width < 640
      // Use mobile-specific clearRadius calculation
      const clearRadius = isMobile
        ? width * 0.45
        : Math.min(width, height) * activeConfig.clearRadius

      // Calculate cycle time (t in 0..1) - loops continuously
      const elapsed = currentTime - startTime
      const cycleT = (elapsed % activeConfig.cycleMs) / activeConfig.cycleMs

      // Draw paper background
      drawPaper(ctx, width, height, fibers)

      // Render active pattern
      if (pattern) {
        pattern.render(ctx, cycleT)
      }

      // Draw center disc
      if (isTransitioning) {
        transitionProgress = Math.min(transitionProgress + 0.015, 1)
      }
      drawCenterDisc(ctx, centerX, centerY, clearRadius, transitionProgress)

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [router, isTransitioning])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleEnter()
    }
  }

  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />

      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0"
        style={{ backgroundColor: 'hsl(30, 5%, 10.5%)' }}
      />

      {/* Content overlay */}
      <div
        className={`fixed inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Title */}
        <h1
          className={`relative z-10 mb-2 text-3xl font-bold tracking-tight transition-all duration-1000 sm:mb-4 sm:text-4xl md:text-6xl ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{
            color: '#3D2B1F',
            fontFamily: 'Georgia, serif',
          }}
        >
          Sybil Solutions
        </h1>

        {/* Enter button */}
        <button
          onClick={handleEnter}
          onKeyPress={handleKeyPress}
          className={`group relative z-10 mt-6 overflow-hidden border-2 px-6 py-2.5 text-base font-medium transition-all duration-1000 sm:mt-8 sm:px-8 sm:py-3 sm:text-lg ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{
            borderColor: '#8B5A2B',
            color: '#8B5A2B',
            backgroundColor: 'rgba(245, 240, 232, 0.8)',
            transitionDelay: '200ms',
          }}
        >
          <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
            Enter
          </span>
          <div
            className="absolute inset-0 -translate-y-full transition-transform duration-300 group-hover:translate-y-0"
            style={{ backgroundColor: '#8B5A2B' }}
          />
        </button>

        {/* Tagline */}
        <p
          className={`relative z-10 mt-4 text-xs tracking-widest transition-all duration-1000 sm:mt-6 sm:text-sm ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{
            color: 'rgba(139, 90, 43, 0.7)',
            transitionDelay: '400ms',
          }}
        >
          SOFTWARE &bull; AI &bull; AUTOMATION
        </p>
      </div>
    </>
  )
}

// No layout wrapper for portal page
Index.getLayout = function getLayout(page) {
  return page
}
