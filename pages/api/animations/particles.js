// Particles API - Generates particle system data

function generateParticles(count, width, height, clearRadius = 180) {
  const particles = []
  const centerX = width / 2
  const centerY = height / 2

  for (let i = 0; i < count; i++) {
    let x, y, dist
    let attempts = 0

    // Keep particles outside center ring
    do {
      x = Math.random() * width
      y = Math.random() * height
      dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
      attempts++
    } while (dist < clearRadius && attempts < 100)

    particles.push({
      id: i,
      x,
      y,
      size: 2 + Math.random() * 3,
      speed: 0.5 + Math.random() * 1.5,
      angle: Math.random() * Math.PI * 2,
      orbitRadius: dist,
      orbitSpeed: (0.2 + Math.random() * 0.3) * (Math.random() > 0.5 ? 1 : -1),
      opacity: 0.3 + Math.random() * 0.5,
    })
  }

  return particles
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const {
    width = 1920,
    height = 1080,
    count = 100,
    clearRadius = 180,
    animated = 'false',
    frames = 30,
  } = req.query

  const parsedWidth = parseInt(width, 10)
  const parsedHeight = parseInt(height, 10)
  const parsedCount = parseInt(count, 10)
  const parsedClearRadius = parseInt(clearRadius, 10)
  const parsedFrames = parseInt(frames, 10)
  const isAnimated = animated === 'true'

  if (isAnimated) {
    // Generate animation frames
    const baseParticles = generateParticles(
      parsedCount,
      parsedWidth,
      parsedHeight,
      parsedClearRadius
    )

    const animationFrames = []

    for (let f = 0; f < parsedFrames; f++) {
      const frameTime = f / parsedFrames

      const frameParticles = baseParticles.map((p) => {
        const angle = p.angle + frameTime * p.orbitSpeed * Math.PI * 2
        return {
          ...p,
          x: parsedWidth / 2 + Math.cos(angle) * p.orbitRadius,
          y: parsedHeight / 2 + Math.sin(angle) * p.orbitRadius * 0.8,
        }
      })

      animationFrames.push({
        frame: f,
        particles: frameParticles,
      })
    }

    res.status(200).json({
      config: {
        width: parsedWidth,
        height: parsedHeight,
        count: parsedCount,
        clearRadius: parsedClearRadius,
        frames: parsedFrames,
      },
      animationFrames,
    })
  } else {
    // Static particles
    const particles = generateParticles(parsedCount, parsedWidth, parsedHeight, parsedClearRadius)

    res.status(200).json({
      config: {
        width: parsedWidth,
        height: parsedHeight,
        count: parsedCount,
        clearRadius: parsedClearRadius,
      },
      particles,
    })
  }
}
