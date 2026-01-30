// Animation Stream API - Server-Sent Events for real-time animation data

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { type = 'particles', duration = 30000 } = req.query

  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const startTime = Date.now()
  const durationMs = parseInt(duration, 10)
  let frameCount = 0

  // Send initial config
  res.write(
    `data: ${JSON.stringify({
      type: 'config',
      animationType: type,
      duration: durationMs,
      fps: 30,
    })}\n\n`
  )

  // Animation loop
  const interval = setInterval(() => {
    const elapsed = Date.now() - startTime

    if (elapsed > durationMs) {
      res.write(
        `data: ${JSON.stringify({
          type: 'complete',
          totalFrames: frameCount,
          elapsed,
        })}\n\n`
      )
      clearInterval(interval)
      res.end()
      return
    }

    frameCount++
    const t = (elapsed % 10000) / 10000 // Cycle every 10 seconds

    let data

    switch (type) {
      case 'particles':
        data = generateParticleFrame(t, frameCount)
        break
      case 'orbitals':
        data = generateOrbitalFrame(t, frameCount)
        break
      case 'wave':
        data = generateWaveFrame(t, frameCount)
        break
      default:
        data = generateParticleFrame(t, frameCount)
    }

    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }, 1000 / 30) // 30 FPS

  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(interval)
    res.end()
  })
}

function generateParticleFrame(t, frameNumber) {
  const particles = []
  const count = 20

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + t * Math.PI * 2
    const radius = 200 + i * 30
    particles.push({
      id: i,
      x: 960 + Math.cos(angle) * radius,
      y: 540 + Math.sin(angle) * radius * 0.6,
      size: 3 + Math.sin(t * Math.PI * 2 + i) * 1,
      opacity: 0.4 + Math.sin(t * Math.PI * 4 + i * 0.5) * 0.3,
    })
  }

  return {
    type: 'frame',
    frame: frameNumber,
    timestamp: Date.now(),
    particles,
  }
}

function generateOrbitalFrame(t, frameNumber) {
  const orbits = []
  const count = 5

  for (let i = 0; i < count; i++) {
    const angle = t * Math.PI * 2 * (1 + i * 0.2)
    const radius = 250 + i * 70
    orbits.push({
      id: i,
      radius,
      particleAngle: angle,
      particleX: 960 + Math.cos(angle) * radius,
      particleY: 540 + Math.sin(angle) * radius,
    })
  }

  return {
    type: 'frame',
    frame: frameNumber,
    timestamp: Date.now(),
    orbits,
  }
}

function generateWaveFrame(t, frameNumber) {
  const dots = []
  const gridSize = 10

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const x = 460 + i * 100
      const baseY = 140 + j * 80
      const waveOffset = Math.sin(t * Math.PI * 2 + i * 0.5 + j * 0.3) * 20

      dots.push({
        id: `${i}-${j}`,
        x,
        y: baseY + waveOffset,
        scale: 1 + Math.sin(t * Math.PI * 4 + i * 0.5) * 0.3,
        opacity: 0.3 + Math.sin(t * Math.PI * 2 + j * 0.5) * 0.2,
      })
    }
  }

  return {
    type: 'frame',
    frame: frameNumber,
    timestamp: Date.now(),
    dots,
  }
}
