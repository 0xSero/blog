// ============================================================================
// PATTERN: WATCHING EYES (Metamorph Circuit)
// Organic eyes with proper anatomy - lids, iris detail, reflections
// ============================================================================

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
const envelope = (t) => Math.sin(t * Math.PI)
const triangle = (t) => 1 - Math.abs(2 * t - 1)

const palette = {
  base: 'hsl(30, 5%, 10.5%)',
  baseDeep: 'hsl(30, 5%, 8%)',
  ink: 'hsla(40, 20%, 92%, 0.75)',
  inkBright: 'hsla(40, 25%, 95%, 0.9)',
  inkSoft: 'hsla(35, 18%, 70%, 0.45)',
  glow: 'hsla(40, 25%, 88%, 0.35)',
  highlight: 'hsla(45, 35%, 85%, 0.5)',
  highlightBright: 'hsla(45, 40%, 92%, 0.7)',
  highlightSubtle: 'hsla(40, 25%, 75%, 0.25)',
}

export const config = {
  key: 'metamorph',
  name: 'Watching Eyes',
  cycleMs: 6000,
  gridX: 24,
  gridY: 14,
  warpSwirl: 0.85,
  clearRadius: 0.24,
}

export class WatchingEyes {
  constructor(width, height, clearRadius, options = {}) {
    this.width = width
    this.height = height
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
    this.config = { ...config, ...options }
    this.eyes = []
    this.build()
  }

  build() {
    const { gridX, gridY, warpSwirl } = this.config
    const tileW = this.width / gridX
    const tileH = this.height / gridY
    const cx = this.centerX
    const cy = this.centerY

    for (let gy = 0; gy < gridY; gy++) {
      for (let gx = 0; gx < gridX; gx++) {
        const px = (gx + 0.5) * tileW
        const py = (gy + 0.5) * tileH

        // Organic warp - eyes cluster and flow
        const warpX = Math.sin(px * 0.012 + gy * 0.4) * warpSwirl * 18
        const warpY = Math.cos(py * 0.015 + gx * 0.3) * warpSwirl * 14
        const wpx = px + warpX
        const wpy = py + warpY

        const dist = Math.sqrt((wpx - cx) ** 2 + (wpy - cy) ** 2)
        const maxDist = Math.sqrt(cx ** 2 + cy ** 2)

        if (dist < this.clearRadius * 1.4) continue

        // Size varies - larger toward edges
        const sizeMultiplier = 0.6 + (dist / maxDist) * 0.5
        const size = tileW * 0.4 * sizeMultiplier

        // Eyes look toward center but with variation
        const towardCenter = Math.atan2(cy - wpy, cx - wpx)
        const baseAngle = towardCenter + (Math.random() - 0.5) * 0.6

        // Unique timing for each eye
        const blinkSpeed = 0.8 + Math.random() * 0.4
        const blinkOffset = (gx * 0.13 + gy * 0.17) % 1
        const lookSpeed = 1.5 + Math.random() * 1.0
        const lookOffset = (gx * 0.11 + gy * 0.19) % 1

        this.eyes.push({
          x: wpx,
          y: wpy,
          size,
          baseAngle,
          blinkSpeed,
          blinkOffset,
          lookSpeed,
          lookOffset,
          activation: 1 - dist / maxDist,
          distFromCenter: dist,
        })
      }
    }

    // Sort for reveal order
    this.eyes.sort((a, b) => a.activation - b.activation)
    this.eyes.forEach((e, i) => {
      e.activation = i / this.eyes.length
    })
  }

  drawAlmondShape(ctx, width, height) {
    // More anatomically correct almond/eye shape
    ctx.beginPath()
    ctx.moveTo(-width, 0)
    ctx.bezierCurveTo(-width * 0.5, -height, width * 0.5, -height, width, 0)
    ctx.bezierCurveTo(width * 0.5, height, -width * 0.5, height, -width, 0)
    ctx.closePath()
  }

  drawEye(ctx, eye, t, alpha) {
    const { x, y, size, baseAngle, blinkSpeed, blinkOffset, lookSpeed, lookOffset } = eye

    // Blink: quick close, slow open (more natural)
    const blinkCycle = (t * blinkSpeed + blinkOffset) % 1
    let openness
    if (blinkCycle < 0.1) {
      openness = 1 - blinkCycle / 0.1 // Quick close
    } else if (blinkCycle < 0.2) {
      openness = (blinkCycle - 0.1) / 0.1 // Quick open
    } else {
      openness = 1 // Mostly open
    }
    openness *= envelope(t) // Also ties to main loop

    if (openness < 0.08) return

    // Look direction - smooth wandering
    const lookT = t * lookSpeed + lookOffset
    const lookAngle =
      baseAngle + Math.sin(lookT * Math.PI * 2) * 0.4 + Math.cos(lookT * Math.PI * 1.3) * 0.2
    const lookDistance = size * 0.18 * (0.5 + Math.sin(lookT * Math.PI * 2.7) * 0.5)

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(baseAngle * 0.2)

    const eyeWidth = size * 1.1
    const eyeHeight = size * 0.55 * openness

    // Outer glow / shadow
    ctx.globalAlpha = alpha * 0.15
    ctx.fillStyle = palette.glow
    this.drawAlmondShape(ctx, eyeWidth * 1.15, eyeHeight * 1.3)
    ctx.fill()

    // Sclera (white of eye) - subtle cream highlight
    ctx.globalAlpha = alpha * 0.12 * openness
    ctx.fillStyle = palette.highlight
    this.drawAlmondShape(ctx, eyeWidth, eyeHeight)
    ctx.fill()

    // Eye outline
    ctx.globalAlpha = alpha * 0.6
    ctx.strokeStyle = palette.ink
    ctx.lineWidth = 1.0
    this.drawAlmondShape(ctx, eyeWidth, eyeHeight)
    ctx.stroke()

    // Upper lid crease (adds depth)
    ctx.globalAlpha = alpha * 0.25
    ctx.strokeStyle = palette.inkSoft
    ctx.lineWidth = 0.6
    ctx.beginPath()
    ctx.moveTo(-eyeWidth * 0.8, -eyeHeight * 0.3)
    ctx.bezierCurveTo(
      -eyeWidth * 0.3,
      -eyeHeight * 1.2,
      eyeWidth * 0.3,
      -eyeHeight * 1.2,
      eyeWidth * 0.8,
      -eyeHeight * 0.3
    )
    ctx.stroke()

    // Iris position
    const irisX = Math.cos(lookAngle - baseAngle * 0.2) * lookDistance
    const irisY = Math.sin(lookAngle - baseAngle * 0.2) * lookDistance * 0.6

    // Iris - larger, with subtle gradient effect
    const irisRadius = size * 0.32 * openness

    // Iris outer ring
    ctx.globalAlpha = alpha * 0.5
    ctx.fillStyle = palette.ink
    ctx.beginPath()
    ctx.arc(irisX, irisY, irisRadius, 0, Math.PI * 2)
    ctx.fill()

    // Iris inner detail - subtle ring
    ctx.globalAlpha = alpha * 0.2
    ctx.strokeStyle = palette.highlightSubtle
    ctx.lineWidth = irisRadius * 0.15
    ctx.beginPath()
    ctx.arc(irisX, irisY, irisRadius * 0.7, 0, Math.PI * 2)
    ctx.stroke()

    // Pupil - deep black
    const pupilRadius = irisRadius * 0.45
    ctx.globalAlpha = alpha * 0.85
    ctx.fillStyle = palette.baseDeep
    ctx.beginPath()
    ctx.arc(irisX, irisY, pupilRadius, 0, Math.PI * 2)
    ctx.fill()

    // Primary reflection - bright highlight on upper left
    ctx.globalAlpha = alpha * 0.7
    ctx.fillStyle = palette.highlightBright
    ctx.beginPath()
    ctx.arc(
      irisX - irisRadius * 0.35,
      irisY - irisRadius * 0.35,
      pupilRadius * 0.35,
      0,
      Math.PI * 2
    )
    ctx.fill()

    // Secondary smaller reflection
    ctx.globalAlpha = alpha * 0.4
    ctx.beginPath()
    ctx.arc(
      irisX + irisRadius * 0.25,
      irisY + irisRadius * 0.15,
      pupilRadius * 0.15,
      0,
      Math.PI * 2
    )
    ctx.fill()

    ctx.restore()
  }

  render(ctx, t) {
    const progress = triangle(t)
    const alpha = envelope(t)

    ctx.save()

    // Subtle ambient glow behind eye clusters
    this.eyes.forEach((eye) => {
      const eyeProgress = clamp((progress - eye.activation * 0.4) / 0.6, 0, 1)
      if (eyeProgress < 0.01) return

      ctx.globalAlpha = 0.08 * alpha * eyeProgress
      ctx.fillStyle = palette.highlightSubtle
      ctx.beginPath()
      ctx.arc(eye.x, eye.y, eye.size * 1.8, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw eyes
    this.eyes.forEach((eye) => {
      const eyeProgress = clamp((progress - eye.activation * 0.4) / 0.6, 0, 1)
      if (eyeProgress < 0.01) return

      this.drawEye(ctx, eye, t, alpha * eyeProgress)
    })

    ctx.restore()
  }
}

export default WatchingEyes
