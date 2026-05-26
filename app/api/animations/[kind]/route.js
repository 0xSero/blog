const GRID_SIZE = 12

const numberParam = (searchParams, key, fallback) => {
  const value = searchParams.get(key)
  return value === null ? fallback : Number(value)
}

function json(data) {
  return Response.json(data)
}

function svg(data) {
  return new Response(data, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'Content-Type': 'image/svg+xml',
    },
  })
}

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

function constellation(searchParams) {
  const width = numberParam(searchParams, 'width', 1920)
  const height = numberParam(searchParams, 'height', 1080)
  const count = numberParam(searchParams, 'count', 8)
  const maxDistance = numberParam(searchParams, 'maxDistance', 250)
  const clearRadius = numberParam(searchParams, 'clearRadius', 180)
  const stars = generateStars(count, width, height, clearRadius)
  const connections = findConnections(stars, maxDistance)

  if (searchParams.get('format') === 'svg') {
    const lines = connections
      .map((connection) => {
        const from = stars.find((star) => star.id === connection.from)
        const to = stars.find((star) => star.id === connection.to)
        return `  <line x1="${from.x.toFixed(1)}" y1="${from.y.toFixed(1)}" x2="${to.x.toFixed(
          1
        )}" y2="${to.y.toFixed(1)}" stroke="#e6c89a" stroke-width="1" opacity="${(
          connection.opacity * 0.3
        ).toFixed(2)}" />`
      })
      .join('\n')
    const circles = stars
      .map(
        (star) =>
          `  <circle cx="${star.x.toFixed(1)}" cy="${star.y.toFixed(1)}" r="${star.size.toFixed(
            1
          )}" fill="#e6c89a" opacity="${star.brightness.toFixed(2)}" />`
      )
      .join('\n')

    return svg(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0a0a0a"/>
${lines}
${circles}
</svg>`)
  }

  return json({
    config: { width, height, count, maxDistance, clearRadius },
    stars,
    connections,
    stats: {
      starCount: stars.length,
      connectionCount: connections.length,
      avgConnections: connections.length / stars.length,
    },
  })
}

function generateHexagonGrid(width, height, hexWidth, hexHeight) {
  const cols = Math.ceil(width / (hexWidth * 0.75)) + 1
  const rows = Math.ceil(height / hexHeight) + 1
  const centerX = width / 2
  const centerY = height / 2
  const clearRadius = 180
  const hexagons = []

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * (hexWidth * 0.75) + hexWidth / 2
      const y = row * hexHeight + (col % 2) * (hexHeight / 2) + hexHeight / 2
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
      if (distance < clearRadius) continue
      hexagons.push({ id: `${row}-${col}`, x, y, row, col, distance })
    }
  }

  return hexagons
}

function getHexagonPoints(centerX, centerY, width, height) {
  const w = width / 2
  const h = height / 2
  return [
    { x: centerX, y: centerY - h },
    { x: centerX + w * 0.866, y: centerY - h * 0.5 },
    { x: centerX + w * 0.866, y: centerY + h * 0.5 },
    { x: centerX, y: centerY + h },
    { x: centerX - w * 0.866, y: centerY + h * 0.5 },
    { x: centerX - w * 0.866, y: centerY - h * 0.5 },
  ]
}

function hexagon(searchParams) {
  const width = numberParam(searchParams, 'width', 1920)
  const height = numberParam(searchParams, 'height', 1080)
  const hexWidth = numberParam(searchParams, 'hexWidth', 60)
  const hexHeight = numberParam(searchParams, 'hexHeight', 52)
  const hexagons = generateHexagonGrid(width, height, hexWidth, hexHeight)

  if (searchParams.get('format') === 'svg') {
    const svgHexagons = hexagons
      .map((hex) => {
        const points = getHexagonPoints(hex.x, hex.y, hexWidth, hexHeight)
          .map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`)
          .join(' ')
        return `  <polygon points="${points}" fill="none" stroke="#e6c89a" stroke-width="1" opacity="0.4" />`
      })
      .join('\n')

    return svg(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0a0a0a"/>
${svgHexagons}
</svg>`)
  }

  return json({
    config: { width, height, hexWidth, hexHeight, gap: 0, clearRadius: 180 },
    hexagons: hexagons.map((hex) => ({
      id: hex.id,
      x: hex.x,
      y: hex.y,
      row: hex.row,
      col: hex.col,
      points: getHexagonPoints(hex.x, hex.y, hexWidth, hexHeight),
    })),
    stats: {
      total: hexagons.length,
      cols: Math.ceil(width / (hexWidth * 0.75)) + 1,
      rows: Math.ceil(height / hexHeight) + 1,
    },
  })
}

function generateParticles(count, width, height, clearRadius = 180) {
  const particles = []
  const centerX = width / 2
  const centerY = height / 2

  for (let i = 0; i < count; i++) {
    let x, y, dist
    let attempts = 0

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

function particles(searchParams) {
  const width = numberParam(searchParams, 'width', 1920)
  const height = numberParam(searchParams, 'height', 1080)
  const count = numberParam(searchParams, 'count', 100)
  const clearRadius = numberParam(searchParams, 'clearRadius', 180)
  const frames = numberParam(searchParams, 'frames', 30)
  const isAnimated = searchParams.get('animated') === 'true'

  if (!isAnimated) {
    return json({
      config: { width, height, count, clearRadius },
      particles: generateParticles(count, width, height, clearRadius),
    })
  }

  const baseParticles = generateParticles(count, width, height, clearRadius)
  const animationFrames = Array.from({ length: frames }, (_, frame) => {
    const frameTime = frame / frames
    return {
      frame,
      particles: baseParticles.map((particle) => {
        const angle = particle.angle + frameTime * particle.orbitSpeed * Math.PI * 2
        return {
          ...particle,
          x: width / 2 + Math.cos(angle) * particle.orbitRadius,
          y: height / 2 + Math.sin(angle) * particle.orbitRadius * 0.8,
        }
      }),
    }
  })

  return json({ config: { width, height, count, clearRadius, frames }, animationFrames })
}

function withSeed(seed, callback) {
  if (!seed) return callback()
  let seedNum = Number(seed) || 12345
  const random = () => {
    seedNum = (seedNum * 9301 + 49297) % 233280
    return seedNum / 233280
  }
  return callback(random)
}

function generateInitialGrid(width, height, density = 0.15, random = Math.random) {
  const cols = Math.ceil(width / GRID_SIZE)
  const rows = Math.ceil(height / GRID_SIZE)
  const centerX = cols / 2
  const centerY = rows / 2
  const clearRadius = 15

  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => {
      const distFromCenter = Math.sqrt((col - centerX) ** 2 + (row - centerY) ** 2)
      return distFromCenter >= clearRadius && random() < density
    })
  )
}

function countNeighbors(grid, row, col) {
  let count = 0
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue
      const newRow = (row + i + grid.length) % grid.length
      const newCol = (col + j + grid[0].length) % grid[0].length
      if (grid[newRow][newCol]) count++
    }
  }
  return count
}

function stepGrid(grid) {
  return grid.map((row, rowIndex) =>
    row.map((alive, colIndex) => {
      const neighbors = countNeighbors(grid, rowIndex, colIndex)
      return alive ? neighbors === 2 || neighbors === 3 : neighbors === 3
    })
  )
}

function getLiveCells(grid) {
  const cells = []
  grid.forEach((row, rowIndex) => {
    row.forEach((alive, colIndex) => {
      if (alive) cells.push({ row: rowIndex, col: colIndex })
    })
  })
  return cells
}

function gameOfLife(searchParams) {
  const width = numberParam(searchParams, 'width', 1920)
  const height = numberParam(searchParams, 'height', 1080)
  const steps = numberParam(searchParams, 'steps', 1)
  const density = numberParam(searchParams, 'density', 0.15)

  return withSeed(searchParams.get('seed'), (random) => {
    let grid = generateInitialGrid(width, height, density, random)
    const frames = [{ step: 0, liveCells: getLiveCells(grid), count: getLiveCells(grid).length }]

    for (let i = 0; i < steps; i++) {
      grid = stepGrid(grid)
      frames.push({ step: i + 1, liveCells: getLiveCells(grid), count: getLiveCells(grid).length })
    }

    return json({
      config: {
        gridSize: GRID_SIZE,
        width,
        height,
        cols: Math.ceil(width / GRID_SIZE),
        rows: Math.ceil(height / GRID_SIZE),
        density,
      },
      frames,
      stats: {
        initialPopulation: frames[0].count,
        finalPopulation: frames[frames.length - 1].count,
        totalSteps: steps,
      },
    })
  })
}

function stream(searchParams) {
  const type = searchParams.get('type') || 'particles'
  const duration = numberParam(searchParams, 'duration', 30000)
  const encoder = new TextEncoder()
  let frameCount = 0
  const startTime = Date.now()
  let interval

  const readable = new ReadableStream({
    start(controller) {
      const send = (data) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      send({ type: 'config', animationType: type, duration, fps: 30 })

      interval = setInterval(() => {
        const elapsed = Date.now() - startTime
        if (elapsed > duration) {
          send({ type: 'complete', totalFrames: frameCount, elapsed })
          clearInterval(interval)
          controller.close()
          return
        }

        frameCount++
        const t = (elapsed % 10000) / 10000
        send({
          type: 'frame',
          frame: frameCount,
          timestamp: Date.now(),
          particles: generateParticles(20, 1920, 1080).map((particle, index) => ({
            ...particle,
            x: 960 + Math.cos((index / 20) * Math.PI * 2 + t * Math.PI * 2) * (200 + index * 30),
            y:
              540 +
              Math.sin((index / 20) * Math.PI * 2 + t * Math.PI * 2) * (200 + index * 30) * 0.6,
          })),
        })
      }, 1000 / 30)
    },
    cancel() {
      clearInterval(interval)
    },
  })

  return new Response(readable, {
    headers: {
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
    },
  })
}

export async function GET(request, { params }) {
  const { kind } = await params
  const { searchParams } = new URL(request.url)

  switch (kind) {
    case 'constellation':
      return constellation(searchParams)
    case 'game-of-life':
      return gameOfLife(searchParams)
    case 'hexagon':
      return hexagon(searchParams)
    case 'particles':
      return particles(searchParams)
    case 'stream':
      return stream(searchParams)
    default:
      return Response.json({ error: 'Animation not found' }, { status: 404 })
  }
}
