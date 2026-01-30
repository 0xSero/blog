// Hexagon API - Generates hexagonal grid patterns

function generateHexagonGrid(width, height, hexWidth, hexHeight, gap = 0) {
  const cols = Math.ceil(width / (hexWidth * 0.75)) + 1
  const rows = Math.ceil(height / hexHeight) + 1
  const centerX = width / 2
  const centerY = height / 2
  const clearRadius = 180 // Keep center clear for ring

  const hexagons = []

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * (hexWidth * 0.75) + hexWidth / 2
      const y = row * hexHeight + (col % 2) * (hexHeight / 2) + hexHeight / 2

      const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)

      if (distFromCenter < clearRadius) continue

      hexagons.push({
        id: `${row}-${col}`,
        x,
        y,
        row,
        col,
        distance: distFromCenter,
      })
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

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const {
    width = 1920,
    height = 1080,
    hexWidth = 60,
    hexHeight = 52,
    gap = 0,
    format = 'json',
  } = req.query

  const parsedWidth = parseInt(width, 10)
  const parsedHeight = parseInt(height, 10)
  const parsedHexWidth = parseInt(hexWidth, 10)
  const parsedHexHeight = parseInt(hexHeight, 10)
  const parsedGap = parseInt(gap, 10)

  const hexagons = generateHexagonGrid(
    parsedWidth,
    parsedHeight,
    parsedHexWidth,
    parsedHexHeight,
    parsedGap
  )

  if (format === 'svg') {
    // Generate SVG
    const svgHexagons = hexagons
      .map((h) => {
        const points = getHexagonPoints(h.x, h.y, parsedHexWidth, parsedHexHeight)
          .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
          .join(' ')
        return `  <polygon points="${points}" fill="none" stroke="#e6c89a" stroke-width="1" opacity="0.4" />`
      })
      .join('\n')

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${parsedWidth}" height="${parsedHeight}" viewBox="0 0 ${parsedWidth} ${parsedHeight}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0a0a0a"/>
${svgHexagons}
</svg>`

    res.setHeader('Content-Type', 'image/svg+xml')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    res.status(200).send(svg)
    return
  }

  // Return JSON data
  res.status(200).json({
    config: {
      width: parsedWidth,
      height: parsedHeight,
      hexWidth: parsedHexWidth,
      hexHeight: parsedHexHeight,
      gap: parsedGap,
      clearRadius: 180,
    },
    hexagons: hexagons.map((h) => ({
      id: h.id,
      x: h.x,
      y: h.y,
      row: h.row,
      col: h.col,
      points: getHexagonPoints(h.x, h.y, parsedHexWidth, parsedHexHeight),
    })),
    stats: {
      total: hexagons.length,
      cols: Math.ceil(parsedWidth / (parsedHexWidth * 0.75)) + 1,
      rows: Math.ceil(parsedHeight / parsedHexHeight) + 1,
    },
  })
}
