// Constellation API - Generates connected star networks

function generateStars(count, width, height, clearRadius = 180) {
  const stars = []
  const centerX = width / 2
  const centerY = height / 2

  for (let i = 0; i < count; i++) {
    let x, y, dist
    let attempts = 0

    do {
      x = 50 + Math.random() * (width - 100)
      y = 50 + Math.random() * (height - 100)
      dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
      attempts++
    } while (dist < clearRadius && attempts < 100)

    stars.push({
      id: i,
      x,
      y,
      size: 4 + Math.random() * 4,
      brightness: 0.4 + Math.random() * 0.6,
      pulsePhase: Math.random() * Math.PI * 2,
    })
  }

  return stars
}

function findConnections(stars, maxDistance) {
  const connections = []

  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dist = Math.sqrt((stars[i].x - stars[j].x) ** 2 + (stars[i].y - stars[j].y) ** 2)

      if (dist < maxDistance) {
        connections.push({
          from: stars[i].id,
          to: stars[j].id,
          distance: dist,
          opacity: 1 - dist / maxDistance,
        })
      }
    }
  }

  return connections
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const {
    width = 1920,
    height = 1080,
    count = 8,
    maxDistance = 250,
    clearRadius = 180,
    format = 'json',
  } = req.query

  const parsedWidth = parseInt(width, 10)
  const parsedHeight = parseInt(height, 10)
  const parsedCount = parseInt(count, 10)
  const parsedMaxDistance = parseInt(maxDistance, 10)
  const parsedClearRadius = parseInt(clearRadius, 10)

  const stars = generateStars(parsedCount, parsedWidth, parsedHeight, parsedClearRadius)
  const connections = findConnections(stars, parsedMaxDistance)

  if (format === 'svg') {
    // Generate SVG
    const lines = connections
      .map((c) => {
        const from = stars.find((s) => s.id === c.from)
        const to = stars.find((s) => s.id === c.to)
        return `  <line x1="${from.x.toFixed(1)}" y1="${from.y.toFixed(1)}" x2="${to.x.toFixed(
          1
        )}" y2="${to.y.toFixed(1)}" stroke="#e6c89a" stroke-width="1" opacity="${(
          c.opacity * 0.3
        ).toFixed(2)}" />`
      })
      .join('\n')

    const circles = stars
      .map(
        (s) =>
          `  <circle cx="${s.x.toFixed(1)}" cy="${s.y.toFixed(1)}" r="${s.size.toFixed(
            1
          )}" fill="#e6c89a" opacity="${s.brightness.toFixed(2)}" />`
      )
      .join('\n')

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${parsedWidth}" height="${parsedHeight}" viewBox="0 0 ${parsedWidth} ${parsedHeight}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0a0a0a"/>
${lines}
${circles}
</svg>`

    res.setHeader('Content-Type', 'image/svg+xml')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    res.status(200).send(svg)
    return
  }

  res.status(200).json({
    config: {
      width: parsedWidth,
      height: parsedHeight,
      count: parsedCount,
      maxDistance: parsedMaxDistance,
      clearRadius: parsedClearRadius,
    },
    stars,
    connections,
    stats: {
      starCount: stars.length,
      connectionCount: connections.length,
      avgConnections: connections.length / stars.length,
    },
  })
}
