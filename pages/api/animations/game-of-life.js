// Game of Life API - Generates cellular automaton frames

const GRID_SIZE = 12

// Count neighbors for a cell
function countNeighbors(grid, row, col) {
  const rows = grid.length
  const cols = grid[0].length
  let count = 0

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue
      const newRow = (row + i + rows) % rows
      const newCol = (col + j + cols) % cols
      if (grid[newRow][newCol]) count++
    }
  }
  return count
}

// Step the simulation forward
function stepGrid(grid) {
  const rows = grid.length
  const cols = grid[0].length
  const nextGrid = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(false))

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const neighbors = countNeighbors(grid, i, j)
      const alive = grid[i][j]

      if (alive && (neighbors === 2 || neighbors === 3)) {
        nextGrid[i][j] = true
      } else if (!alive && neighbors === 3) {
        nextGrid[i][j] = true
      }
    }
  }

  return nextGrid
}

// Generate initial grid with sparse density
function generateInitialGrid(width, height, density = 0.15) {
  const cols = Math.ceil(width / GRID_SIZE)
  const rows = Math.ceil(height / GRID_SIZE)
  const centerX = cols / 2
  const centerY = rows / 2
  const clearRadius = 15 // Keep center clear

  return Array(rows)
    .fill(null)
    .map((_, row) =>
      Array(cols)
        .fill(null)
        .map((_, col) => {
          const distFromCenter = Math.sqrt((col - centerX) ** 2 + (row - centerY) ** 2)
          if (distFromCenter < clearRadius) return false
          return Math.random() < density
        })
    )
}

// Get live cells as coordinates
function getLiveCells(grid) {
  const cells = []
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j]) {
        cells.push({ row: i, col: j })
      }
    }
  }
  return cells
}

export default function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const {
    width = 1920,
    height = 1080,
    steps = 1,
    density = 0.15,
    seed,
  } = req.method === 'GET' ? req.query : req.body

  // Use seed for reproducible results if provided
  if (seed) {
    // Simple seeded random
    let seedNum = parseInt(seed, 10) || 12345
    const originalRandom = Math.random
    Math.random = () => {
      seedNum = (seedNum * 9301 + 49297) % 233280
      return seedNum / 233280
    }
  }

  const parsedWidth = parseInt(width, 10)
  const parsedHeight = parseInt(height, 10)
  const parsedSteps = parseInt(steps, 10)
  const parsedDensity = parseFloat(density)

  // Generate initial state
  let grid = generateInitialGrid(parsedWidth, parsedHeight, parsedDensity)

  // Step through simulation
  const frames = []
  frames.push({
    step: 0,
    liveCells: getLiveCells(grid),
    count: getLiveCells(grid).length,
  })

  for (let i = 0; i < parsedSteps; i++) {
    grid = stepGrid(grid)
    frames.push({
      step: i + 1,
      liveCells: getLiveCells(grid),
      count: getLiveCells(grid).length,
    })
  }

  // Restore Math.random if we seeded it
  if (seed) {
    Math.random = originalRandom
  }

  res.status(200).json({
    config: {
      gridSize: GRID_SIZE,
      width: parsedWidth,
      height: parsedHeight,
      cols: Math.ceil(parsedWidth / GRID_SIZE),
      rows: Math.ceil(parsedHeight / GRID_SIZE),
      density: parsedDensity,
    },
    frames,
    stats: {
      initialPopulation: frames[0].count,
      finalPopulation: frames[frames.length - 1].count,
      totalSteps: parsedSteps,
    },
  })
}

let originalRandom
