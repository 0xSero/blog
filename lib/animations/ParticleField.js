import { scaleByQuality } from './quality'

const TAU = Math.PI * 2

export class ParticleField {
  constructor(options = {}) {
    this.options = {
      background: 'hsl(30, 5%, 10.5%)',
      connectionAlpha: 0.12,
      connectionColor: '40, 15%, 70%',
      maxDistance: 120,
      maxParticles: 70,
      particleAlphaMax: 0.3,
      particleAlphaMin: 0.08,
      particleColor: '40, 20%, 80%',
      particleDivisor: 17000,
      radiusMax: 1.5,
      radiusMin: 0.4,
      speed: 0.3,
      ...options,
    }
    this.particles = []
  }

  resize(width, height, quality) {
    this.width = width
    this.height = height
    const targetCount = scaleByQuality(
      Math.floor((width * height) / this.options.particleDivisor),
      quality,
      { max: this.options.maxParticles, min: 12 }
    )

    while (this.particles.length < targetCount) {
      this.particles.push(this.createParticle(width, height))
    }
    this.particles.length = targetCount
  }

  createParticle(width, height) {
    const speed = this.options.speed
    return {
      alpha:
        Math.random() * (this.options.particleAlphaMax - this.options.particleAlphaMin) +
        this.options.particleAlphaMin,
      radius:
        Math.random() * (this.options.radiusMax - this.options.radiusMin) + this.options.radiusMin,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      x: Math.random() * width,
      y: Math.random() * height,
    }
  }

  render(ctx, width, height, quality) {
    const motionScale = quality?.motionScale ?? 1
    const maxDistance = this.options.maxDistance
    const maxDistanceSq = maxDistance * maxDistance
    const particles = this.particles

    ctx.fillStyle = this.options.background
    ctx.fillRect(0, 0, width, height)

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i]
      particle.x += particle.vx * motionScale
      particle.y += particle.vy * motionScale

      if (particle.x < 0 || particle.x > width) particle.vx *= -1
      if (particle.y < 0 || particle.y > height) particle.vy *= -1

      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.radius, 0, TAU)
      ctx.fillStyle = `hsla(${this.options.particleColor}, ${particle.alpha})`
      ctx.fill()
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const distanceSq = dx * dx + dy * dy

        if (distanceSq >= maxDistanceSq) continue

        const distance = Math.sqrt(distanceSq)
        const alpha = (1 - distance / maxDistance) * this.options.connectionAlpha
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.strokeStyle = `hsla(${this.options.connectionColor}, ${alpha})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }
  }
}
