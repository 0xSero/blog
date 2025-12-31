// ============================================================================
// PATTERN: ORBITING PARTICLES
// Multiple orbital rings systems with smooth particle motion
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
  key: 'particle',
  name: 'Orbiting Particles',
  cycleMs: 7500,
  clearRadius: 0.22,
}

export class OrbitingParticles {
  constructor(width, height, clearRadius, options = {}) {
    this.width = width
    this.height = height
    this.clearRadius = clearRadius
    this.centerX = width / 2
    this.centerY = height / 2
    this.config = { ...config, ...options }
    this.rings = []
    this.build()
  }

  build() {
    const cx = this.centerX
    const cy = this.centerY
    const ringCount = 5
    const minRadius = this.clearRadius * 1.1
    const maxRadius = Math.min(cx, cy) - 30

    for (let r = 0; r < ringCount; r++) {
      const ringT = r / (ringCount - 1)
      const baseRadius = minRadius + (maxRadius - minRadius) * ringT
      const particleCount = Math.floor(8 + r * 6)

      const particles = []
      for (let p = 0; p < particleCount; p++) {
        const phase = p / particleCount
        particles.push({
          phase,
          basePhase: phase,
          radius: baseRadius,
          ringT,
          ringIndex: r,
          particleIndex: p,
        })
      }

      this.rings.push({
        ringIndex: r,
        ringT,
        baseRadius,
        particleCount,
        particles,
        orbitSpeed: 0.3 + r * 0.08,
        phaseOffset: r * 0.2,
      })
    }
  }

  render(ctx, t) {
    const progress = triangle(t)
    const alpha = envelope(t)

    ctx.save()
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    this.rings.forEach((ring) => {
      const ringT = ring.ringT
      const ringProgress = clamp((progress - ringT * 0.3) * 1.5, 0, 1)
      if (ringProgress < 0.01) return

      const orbitAngle = t * Math.PI * 2 * ring.orbitSpeed + ring.phaseOffset
      const pulse = envelope((t + ringT * 0.25) % 1)

      ring.particles.forEach((particle) => {
        const particleProgress = clamp((ringProgress - particle.basePhase * 0.15) * 1.3, 0, 1)
        if (particleProgress < 0.01) return

        const angle = orbitAngle + particle.basePhase * Math.PI * 2
        const breathe = envelope((t * 0.5 + particle.ringT * 0.3 + particle.basePhase * 0.2) % 1)
        const currentRadius = particle.radius * (1 + breathe * 0.06)

        const x = this.centerX + Math.cos(angle) * currentRadius
        const y = this.centerY + Math.sin(angle) * currentRadius

        const distFromCenter = Math.sqrt((x - this.centerX) ** 2 + (y - this.centerY) ** 2)
        if (distFromCenter < this.clearRadius * 0.85) return

        const size = 2 + pulse * 1.5 + breathe * 1
        const intensity = pulse * (0.5 + breathe * 0.5)

        ctx.globalAlpha = alpha * 0.12 * intensity * particleProgress
        ctx.fillStyle = palette.glow
        ctx.beginPath()
        ctx.arc(x, y, size + 2, 0, Math.PI * 2)
        ctx.fill()

        ctx.globalAlpha = alpha * (0.4 + intensity * 0.3) * particleProgress
        ctx.fillStyle = palette.ink
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()

        if (intensity > 0.6) {
          ctx.globalAlpha = ((alpha * 0.45 * (intensity - 0.6)) / 0.4) * particleProgress
          ctx.fillStyle = palette.highlightBright
          ctx.beginPath()
          ctx.arc(x - size * 0.25, y - size * 0.25, size * 0.4, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      const trailLength = Math.floor(ring.particleCount * 0.4)
      const trailParticles = ring.particles.slice(0, trailLength)

      if (trailParticles.length > 1) {
        for (let i = 0; i < trailParticles.length - 1; i++) {
          const tp1 = trailParticles[i]
          const tp2 = trailParticles[i + 1]

          const t1Progress = clamp((ringProgress - tp1.basePhase * 0.12) * 1.3, 0, 1)
          if (t1Progress < 0.01) continue

          const t1Angle = orbitAngle + tp1.basePhase * Math.PI * 2
          const t2Angle = orbitAngle + tp2.basePhase * Math.PI * 2
          const t1Breathe = envelope((t * 0.5 + tp1.ringT * 0.3 + tp1.basePhase * 0.2) % 1)
          const t1Radius = tp1.radius * (1 + t1Breathe * 0.06)

          const x1 = this.centerX + Math.cos(t1Angle) * t1Radius
          const y1 = this.centerY + Math.sin(t1Angle) * t1Radius
          const x2 = this.centerX + Math.cos(t2Angle) * t1Radius
          const y2 = this.centerY + Math.sin(t2Angle) * t1Radius

          const trailAlpha = (1 - i / trailLength) * 0.3

          ctx.globalAlpha = alpha * trailAlpha * t1Progress * 0.15
          ctx.strokeStyle = palette.inkSoft
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
      }
    })

    ctx.restore()
  }
}

export default OrbitingParticles
