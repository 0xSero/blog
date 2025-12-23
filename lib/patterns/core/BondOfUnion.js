// ============================================================================
// PATTERN: BOND OF UNION (Escher's Intertwined Faces)
// Two ribbon-constructed profiles sharing a continuous band
// ============================================================================

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
const lerp = (a, b, t) => a + (b - a) * t
const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}
const envelope = (t) => Math.sin(t * Math.PI)
const triangle = (t) => 1 - Math.abs(2 * t - 1)

const bondPalette = {
  base: 'hsl(35, 25%, 88%)',
  ink: 'hsl(25, 30%, 25%)',
  inkSoft: 'hsl(30, 20%, 45%)',
  highlight: 'hsla(45, 35%, 85%, 0.85)',
  glow: 'hsla(35, 30%, 70%, 0.3)',
}

export const config = {
  key: 'union',
  name: 'Bond of Union',
  cycleMs: 7000,
  clearRadius: 0.22,
}

export class BondOfUnionPattern {
  constructor(width, height, configOverrides, clearRadius) {
    this.width = width
    this.height = height
    this.config = { ...config, ...configOverrides }
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

export default BondOfUnionPattern
