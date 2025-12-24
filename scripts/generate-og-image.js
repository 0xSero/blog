/**
 * Generate a static OG image with the Watching Eyes pattern
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
const TAU = Math.PI * 2

// Palette (matching the portal page)
const palette = {
  base: 'hsl(30, 5%, 10.5%)',
  baseDeep: 'hsl(30, 5%, 6%)',
  center: 'hsl(40, 30%, 96%)',
  ink: 'hsla(40, 20%, 92%, 0.75)',
  inkBright: 'hsla(40, 25%, 95%, 0.9)',
  inkSoft: 'hsla(35, 18%, 70%, 0.45)',
  inkFaint: 'hsla(35, 12%, 55%, 0.2)',
  glow: 'hsla(40, 25%, 88%, 0.25)',
  highlight: 'hsla(45, 35%, 85%, 0.5)',
  highlightBright: 'hsla(45, 40%, 92%, 0.7)',
  highlightSubtle: 'hsla(40, 25%, 75%, 0.2)',
}

// Simple seeded random for reproducibility
let seed = 42
function seededRandom() {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff
  return seed / 0x7fffffff
}

// Watching Eyes pattern
class WatchingEyes {
  constructor(width, height, clearRadius) {
    this.width = width
    this.height = height
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
    this.eyes = []
    this.rings = []
    this.build()
  }

  build() {
    const cx = this.centerX
    const cy = this.centerY
    const edgePadding = 14
    const maxDim = Math.min(this.width, this.height)
    const maxRadius = maxDim / 2 - edgePadding
    const minRadius = Math.max(this.clearRadius * 1.2, 30)
    const ringCount = 8
    const eyeScale = 1
    const ringSpacing = 50

    this.rings = []
    this.eyes = []

    for (let r = 0; r < ringCount; r++) {
      const ringRadius = minRadius + r * ringSpacing
      if (ringRadius > maxRadius) continue

      const ringT = r / Math.max(ringCount - 1, 1)
      const eyeSpacing = 70
      const circumference = TAU * ringRadius
      const rawCount = Math.max(4, Math.floor(circumference / eyeSpacing))
      const eyeCount = Math.round(rawCount / 2) * 2
      const baseSize = (14 + ringT * 10) * eyeScale

      const ring = {
        radius: ringRadius,
        eyeCount,
        baseSize,
        ringIndex: r,
        eyes: [],
      }

      const ringOffset = (r % 2) * (Math.PI / eyeCount)

      for (let e = 0; e < eyeCount; e++) {
        const angle = (e / eyeCount) * TAU + ringOffset
        const x = cx + Math.cos(angle) * ringRadius
        const y = cy + Math.sin(angle) * ringRadius
        const phase = (r * 0.13 + e * 0.07) % 1

        const eye = {
          x,
          y,
          baseAngle: angle,
          size: baseSize,
          ringIndex: r,
          eyeIndex: e,
          phase,
          ringT,
          blinkPhase: (r * 0.17 + e * 0.11) % 1,
        }

        ring.eyes.push(eye)
        this.eyes.push(eye)
      }

      this.rings.push(ring)
    }
  }

  drawEyeShape(ctx, width, height) {
    ctx.beginPath()
    ctx.moveTo(-width, 0)
    ctx.bezierCurveTo(-width * 0.5, -height, width * 0.5, -height, width, 0)
    ctx.bezierCurveTo(width * 0.5, height, -width * 0.5, height, -width, 0)
    ctx.closePath()
  }

  drawEye(ctx, eye, globalAlpha) {
    const { x, y, size, baseAngle, phase } = eye
    const openness = 1 // All eyes open for static image
    const watchAngle = baseAngle + Math.PI
    const irisWander = Math.sin(phase * TAU) * 0.12

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(watchAngle)

    const eyeWidth = size * 1.1
    const eyeHeight = size * 0.5 * openness
    const strokeW = 0.6 + size * 0.018

    // Outer glow
    ctx.globalAlpha = globalAlpha * 0.06
    ctx.fillStyle = palette.glow
    this.drawEyeShape(ctx, eyeWidth * 1.2, eyeHeight * 1.3)
    ctx.fill()

    // Sclera
    ctx.globalAlpha = globalAlpha * 0.12 * openness
    ctx.fillStyle = palette.highlight
    this.drawEyeShape(ctx, eyeWidth, eyeHeight)
    ctx.fill()

    // Eye outline
    ctx.globalAlpha = globalAlpha * 0.5
    ctx.strokeStyle = palette.ink
    ctx.lineWidth = strokeW
    this.drawEyeShape(ctx, eyeWidth, eyeHeight)
    ctx.stroke()

    // Upper lid crease
    ctx.globalAlpha = globalAlpha * 0.18
    ctx.strokeStyle = palette.inkSoft
    ctx.lineWidth = strokeW * 0.5
    ctx.beginPath()
    ctx.moveTo(-eyeWidth * 0.7, -eyeHeight * 0.25)
    ctx.bezierCurveTo(
      -eyeWidth * 0.2,
      -eyeHeight * 1.15,
      eyeWidth * 0.2,
      -eyeHeight * 1.15,
      eyeWidth * 0.7,
      -eyeHeight * 0.25
    )
    ctx.stroke()

    // Iris position
    const irisX = irisWander * size * 0.15
    const irisY = 0
    const irisRadius = size * 0.26 * openness

    // Iris
    ctx.globalAlpha = globalAlpha * 0.5
    ctx.fillStyle = palette.ink
    ctx.beginPath()
    ctx.arc(irisX, irisY, irisRadius, 0, TAU)
    ctx.fill()

    // Iris ring detail
    if (irisRadius > 3.5) {
      ctx.globalAlpha = globalAlpha * 0.12
      ctx.strokeStyle = palette.highlightSubtle
      ctx.lineWidth = irisRadius * 0.08
      ctx.beginPath()
      ctx.arc(irisX, irisY, irisRadius * 0.72, 0, TAU)
      ctx.stroke()
    }

    // Pupil
    const pupilRadius = irisRadius * 0.42
    ctx.globalAlpha = globalAlpha * 0.85
    ctx.fillStyle = palette.baseDeep
    ctx.beginPath()
    ctx.arc(irisX, irisY, pupilRadius, 0, TAU)
    ctx.fill()

    // Primary reflection
    ctx.globalAlpha = globalAlpha * 0.6
    ctx.fillStyle = palette.highlightBright
    ctx.beginPath()
    ctx.arc(irisX - irisRadius * 0.28, irisY - irisRadius * 0.32, pupilRadius * 0.32, 0, TAU)
    ctx.fill()

    // Secondary reflection
    ctx.globalAlpha = globalAlpha * 0.3
    ctx.beginPath()
    ctx.arc(irisX + irisRadius * 0.22, irisY + irisRadius * 0.18, pupilRadius * 0.12, 0, TAU)
    ctx.fill()

    ctx.restore()
  }

  render(ctx) {
    ctx.save()
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // Ring arcs (subtle glow)
    this.rings.forEach((ring) => {
      ctx.globalAlpha = 0.03
      ctx.strokeStyle = palette.glow
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(this.centerX, this.centerY, ring.radius, 0, TAU)
      ctx.stroke()
    })

    // Draw eyes
    this.rings.forEach((ring) => {
      ring.eyes.forEach((eye) => {
        this.drawEye(ctx, eye, 0.85)
      })
    })

    ctx.restore()
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

  // Create Watching Eyes pattern
  const clearRadius = Math.min(WIDTH, HEIGHT) * 0.38
  const eyes = new WatchingEyes(WIDTH, HEIGHT, clearRadius)
  eyes.render(ctx)

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
  ctx.fillText('SOFTWARE  \u2022  AI  \u2022  AUTOMATION', WIDTH / 2, HEIGHT / 2 + 35)
  ctx.restore()

  // Save image
  const outputPath = path.join(__dirname, '..', 'public', 'static', 'images', 'og-image.png')
  const buffer = canvas.toBuffer('image/png')
  fs.writeFileSync(outputPath, buffer)
  console.log(`OG image saved to: ${outputPath}`)
}

generateOGImage()
