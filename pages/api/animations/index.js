// Animation API - Returns available animation configurations
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const animations = [
    {
      id: 'concentric-rings',
      name: 'Concentric Rings',
      description: 'Deep concentric rings with orbiting particles',
      type: 'svg',
      duration: 10000,
      config: {
        ringCount: 12,
        particleOrbits: 6,
        colors: {
          primary: '#e6c89a',
          secondary: '#050505',
        },
      },
    },
    {
      id: 'tessellation',
      name: 'Tessellation Field',
      description: 'Expanding tessellation grid pattern',
      type: 'css',
      duration: 10000,
      config: {
        gridSize: 12,
        cellSize: 40,
        rotation: 45,
      },
    },
    {
      id: 'game-of-life',
      name: 'Game of Life',
      description: "Conway's Game of Life cellular automaton",
      type: 'canvas',
      duration: 10000,
      config: {
        gridSize: 12,
        cellSize: 12,
        initialDensity: 0.15,
        colors: {
          alive: '#e6c89a',
          dead: '#0a0a0a',
        },
      },
    },
    {
      id: 'hexagon',
      name: 'Hexagon Honeycomb',
      description: 'Hexagonal honeycomb pattern',
      type: 'svg',
      duration: 10000,
      config: {
        hexWidth: 60,
        hexHeight: 52,
        gap: 0,
        colors: {
          stroke: '#e6c89a',
          fill: 'transparent',
        },
      },
    },
    {
      id: 'morphing-shape',
      name: 'Morphing Liquid',
      description: 'Morphing liquid shape with border radius animation',
      type: 'css',
      duration: 10000,
      config: {
        baseSize: 320,
        morphDuration: 4,
      },
    },
    {
      id: 'penrose-triangle',
      name: 'Penrose Triangle',
      description: 'Impossible geometry with glowing nodes',
      type: 'svg',
      duration: 10000,
      config: {
        size: 500,
        strokeWidth: 2,
        glowIntensity: 3,
      },
    },
    {
      id: 'orbital-system',
      name: 'Orbital System',
      description: 'Planetary orbital system with particles',
      type: 'css',
      duration: 10000,
      config: {
        orbitCount: 6,
        baseRadius: 250,
        radiusStep: 80,
      },
    },
    {
      id: 'wave-grid',
      name: 'Wave Grid',
      description: 'Animated wave grid with depth',
      type: 'css',
      duration: 10000,
      config: {
        gridSize: 16,
        dotSize: 12,
        waveAmplitude: 15,
      },
    },
    {
      id: 'golden-spiral',
      name: 'Golden Spiral',
      description: 'Phyllotaxis golden spiral pattern',
      type: 'css',
      duration: 10000,
      config: {
        goldenAngle: 137.5,
        segmentCount: 40,
        baseRadius: 50,
        radiusStep: 12,
      },
    },
    {
      id: 'constellation',
      name: 'Constellation Network',
      description: 'Connected star constellation',
      type: 'svg',
      duration: 10000,
      config: {
        starCount: 8,
        connectionDistance: 250,
        glowIntensity: 2,
      },
    },
  ]

  res.status(200).json({
    animations,
    total: animations.length,
    meta: {
      version: '1.0.0',
      defaultDuration: 10000,
      transitionDuration: 600,
    },
  })
}
