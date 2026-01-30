// ============================================================================
// PATTERN: MANDALA BLOOM
// Radial symmetric patterns that bloom outward from the center with
// intricate petal and geometric formations, inspired by traditional mandalas.
// ============================================================================

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
const envelope = (t) => Math.sin(t * Math.PI)
const triangle = (t) => 1 - Math.abs(2 * t - 1)
const lerp = (a, b, t) => a + (b - a) * t

const palette = {
  base: 'hsl(30, 5%, 10.5%)',
  ink: 'hsla(40, 20%, 92%, 0.75)',
  inkSoft: 'hsla(35, 18%, 70%, 0.45)',
  inkFaint: 'hsla(35, 12%, 55%, 0.2)',
  glow: 'hsla(40, 25%, 88%, 0.35)',
  highlight: 'hsla(45, 35%, 85%, 0.8)',
  petalCore: 'hsla(40, 30%, 95%, 0.9)',
  petalEdge: 'hsla(35, 25%, 75%, 0.5)',
}

export const config = {
  key: 'mandala',
  name: 'Mandala Bloom',
  cycleMs: 8500,
  clearRadius: 0.24,
  layers: 6,
  petalsPerLayer: 12,
}

export class MandalaBloom {
  constructor(width, height, clearRadius, options = {}) {
    this.width = width
    this.height = height
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
    this.config = { ...config, ...options }
    this.layers = []
    this.build()
  }

  build() {
    const { layers, petalsPerLayer } = this.config
    const maxRadius = Math.min(this.centerX, this.centerY) - 20

    // Create concentric mandala layers
    for (let l = 0; l < layers; l++) {
      const layerT = (l + 1) / (layers + 1)
      const layerRadius = this.clearRadius * 1.2 + (maxRadius - this.clearRadius) * layerT * 0.9

      const petals = []
      const petalCount = petalsPerLayer + l * 4 // More petals in outer layers

      for (let p = 0; p < petalCount; p++) {
        const angle = (p / petalCount) * Math.PI * 2
        const petal = {
          angle,
          radius: layerRadius,
          size: 15 + layerT * 25,
          length: 25 + layerT * 35,
          width: 8 + layerT * 12,
          phase: p * 0.3 + l * 0.5,
          layer: l,
          index: p,
        }
        petals.push(petal)
      }

      this.layers.push({
        index: l,
        radius: layerRadius,
        petals,
        rotationSpeed: 0.0002 * (l % 2 === 0 ? 1 : -1) * (1 + l * 0.3),
        baseRotation: l * 0.2,
      })
    }

    // Create geometric overlay elements
    this.geometricElements = []
    const geoCount = 8
    for (let g = 0; g < geoCount; g++) {
      const angle = (g / geoCount) * Math.PI * 2
      this.geometricElements.push({
        angle,
        innerRadius: this.clearRadius * 1.3,
        outerRadius: this.clearRadius * 1.3 + (maxRadius - this.clearRadius) * 0.6,
        type: g % 2 === 0 ? 'diamond' : 'triangle',
        phase: g * 0.4,
      })
    }
  }

  drawPetal(ctx, petal, reveal, t) {
    if (reveal <= 0.01) return

    const { angle, radius, size, length, width, phase, layer } = petal

    // Bloom animation - petals grow outward
    const bloomProgress = Math.min(1, reveal * 1.5)
    const currentRadius = radius * bloomProgress
    const currentSize = size * (0.5 + bloomProgress * 0.5)
    const currentLength = length * bloomProgress

    // Calculate position
    const x = this.centerX + Math.cos(angle) * currentRadius
    const y = this.centerY + Math.sin(angle) * currentRadius

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle + Math.PI / 2)

    // Pulsing glow
    const pulse = 1 + Math.sin(t * Math.PI * 3 + phase) * 0.15

    // Outer glow
    ctx.globalAlpha = reveal * 0.25 * pulse
    ctx.fillStyle = palette.glow
    ctx.beginPath()
    ctx.ellipse(
      0,
      -currentLength / 2,
      currentSize * 1.5 * pulse,
      currentLength * 0.6,
      0,
      0,
      Math.PI * 2
    )
    ctx.fill()

    // Petal shape (teardrop)
    ctx.globalAlpha = reveal * (0.6 - layer * 0.05)
    ctx.fillStyle = palette.inkSoft
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(-currentSize / 2, -currentLength / 2, 0, -currentLength)
    ctx.quadraticCurveTo(currentSize / 2, -currentLength / 2, 0, 0)
    ctx.fill()

    // Petal highlight
    ctx.globalAlpha = reveal * 0.5
    ctx.fillStyle = palette.petalEdge
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(-currentSize / 4, -currentLength / 3, 0, -currentLength * 0.8)
    ctx.quadraticCurveTo(currentSize / 4, -currentLength / 3, 0, 0)
    ctx.fill()

    // Center dot
    ctx.globalAlpha = reveal * 0.9
    ctx.fillStyle = palette.petalCore
    ctx.beginPath()
    ctx.arc(0, 0, 2, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }

  drawGeometricElement(ctx, element, reveal, t) {
    if (reveal <= 0.2) return

    const { angle, innerRadius, outerRadius, type, phase } = element

    // Breathing animation
    const breath = 1 + Math.sin(t * Math.PI * 2 + phase) * 0.1
    const currentInnerRadius = innerRadius * breath
    const currentOuterRadius = outerRadius * breath

    const x1 = this.centerX + Math.cos(angle) * currentInnerRadius
    const y1 = this.centerY + Math.sin(angle) * currentInnerRadius
    const x2 = this.centerX + Math.cos(angle) * currentOuterRadius
    const y2 = this.centerY + Math.sin(angle) * currentOuterRadius

    ctx.globalAlpha = (reveal - 0.2) * 0.6
    ctx.strokeStyle = palette.inkSoft
    ctx.lineWidth = 0.8

    if (type === 'diamond') {
      // Diamond shape
      const perpAngle = angle + Math.PI / 2
      const midX = (x1 + x2) / 2
      const midY = (y1 + y2) / 2
      const size = (currentOuterRadius - currentInnerRadius) * 0.3

      const dx = Math.cos(perpAngle) * size
      const dy = Math.sin(perpAngle) * size

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(midX + dx, midY)
      ctx.lineTo(x2, y2)
      ctx.lineTo(midX - dx, midY)
      ctx.closePath()
      ctx.stroke()

      // Fill with subtle gradient
      ctx.globalAlpha = (reveal - 0.2) * 0.15
      ctx.fillStyle = palette.highlight
      ctx.fill()
    } else {
      // Triangle pointing inward
      const perpAngle = angle + Math.PI / 2
      const size = (currentOuterRadius - currentInnerRadius) * 0.25

      const midX = (x1 + x2) / 2
      const midY = (y1 + y2) / 2
      const tipX = this.centerX + Math.cos(angle + Math.PI) * currentInnerRadius * 0.8
      const tipY = this.centerY + Math.sin(angle + Math.PI) * currentInnerRadius * 0.8

      const dx = Math.cos(perpAngle) * size
      const dy = Math.sin(perpAngle) * size

      ctx.beginPath()
      ctx.moveTo(midX + dx, midY + dy)
      ctx.lineTo(tipX, tipY)
      ctx.lineTo(midX - dx, midY - dy)
      ctx.closePath()
      ctx.stroke()
    }
  }

  drawCenterPattern(ctx, reveal, t) {
    if (reveal <= 0.1) return

    const centerReveal = reveal * clamp((t % 1) * 2, 0, 1)

    // Central star pattern
    const points = 8
    const innerR = this.clearRadius * 0.6
    const outerR = this.clearRadius * 0.95

    ctx.save()
    ctx.translate(this.centerX, this.centerY)
    ctx.rotate(t * 0.2)

    ctx.globalAlpha = centerReveal * 0.3
    ctx.strokeStyle = palette.inkSoft
    ctx.lineWidth = 1

    // Draw star
    ctx.beginPath()
    for (let i = 0; i < points * 2; i++) {
      const angle = (i / (points * 2)) * Math.PI * 2
      const r = i % 2 === 0 ? outerR : innerR
      const x = Math.cos(angle) * r
      const y = Math.sin(angle) * r
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.stroke()

    // Inner circles
    for (let c = 1; c <= 3; c++) {
      ctx.globalAlpha = centerReveal * (0.4 - c * 0.1)
      ctx.beginPath()
      ctx.arc(0, 0, innerR * (c / 3), 0, Math.PI * 2)
      ctx.stroke()
    }

    ctx.restore()
  }

  render(ctx, t) {
    const progress = triangle(t)
    const alpha = envelope(t)

    ctx.save()

    // Draw center pattern first (behind layers)
    const centerReveal = alpha * smoothstep(0, 0.4, progress)
    this.drawCenterPattern(ctx, centerReveal, t)

    // Draw layers from outside in for proper overlap
    for (let l = this.layers.length - 1; l >= 0; l--) {
      const layer = this.layers[l]

      // Stagger layer reveal
      const layerProgress = clamp((progress - l * 0.08) * 1.5, 0, 1)
      const layerReveal = alpha * smoothstep(0.1, 0.8, layerProgress)

      // Update rotation
      layer.baseRotation += layer.rotationSpeed

      // Draw all petals in this layer
      layer.petals.forEach((petal) => {
        const petalWithRotation = {
          ...petal,
          angle: petal.angle + layer.baseRotation,
        }
        this.drawPetal(ctx, petalWithRotation, layerReveal, t)
      })
    }

    // Draw geometric overlay elements
    const geoReveal = alpha * smoothstep(0.3, 0.9, progress)
    this.geometricElements.forEach((element) => {
      this.drawGeometricElement(ctx, element, geoReveal, t)
    })

    ctx.restore()
  }
}

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}
