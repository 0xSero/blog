const animations = [
  {
    id: 'concentric-rings',
    name: 'Concentric Rings',
    description: 'Deep concentric rings with orbiting particles',
    type: 'svg',
    duration: 10000,
  },
  {
    id: 'tessellation',
    name: 'Tessellation Field',
    description: 'Expanding tessellation grid pattern',
    type: 'css',
    duration: 10000,
  },
  {
    id: 'game-of-life',
    name: 'Game of Life',
    description: "Conway's Game of Life cellular automaton",
    type: 'canvas',
    duration: 10000,
  },
  {
    id: 'hexagon',
    name: 'Hexagon Honeycomb',
    description: 'Hexagonal honeycomb pattern',
    type: 'svg',
    duration: 10000,
  },
  {
    id: 'morphing-shape',
    name: 'Morphing Liquid',
    description: 'Morphing liquid shape with border radius animation',
    type: 'css',
    duration: 10000,
  },
  {
    id: 'penrose-triangle',
    name: 'Penrose Triangle',
    description: 'Impossible geometry with glowing nodes',
    type: 'svg',
    duration: 10000,
  },
  {
    id: 'orbital-system',
    name: 'Orbital System',
    description: 'Planetary orbital system with particles',
    type: 'css',
    duration: 10000,
  },
  {
    id: 'wave-grid',
    name: 'Wave Grid',
    description: 'Animated wave grid with depth',
    type: 'css',
    duration: 10000,
  },
  {
    id: 'golden-spiral',
    name: 'Golden Spiral',
    description: 'Phyllotaxis golden spiral pattern',
    type: 'css',
    duration: 10000,
  },
  {
    id: 'constellation',
    name: 'Constellation Network',
    description: 'Connected star constellation',
    type: 'svg',
    duration: 10000,
  },
]

export function GET() {
  return Response.json({
    animations,
    total: animations.length,
    meta: {
      version: '1.0.0',
      defaultDuration: 10000,
      transitionDuration: 600,
    },
  })
}
