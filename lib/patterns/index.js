// ============================================================================
// PATTERN REGISTRY
// Central registry for all portal animation patterns
// ============================================================================

import { GameOfLifePattern, config as lifeConfig } from './core/GameOfLife'
import { WatchingEyes, config as eyesConfig } from './core/WatchingEyes'
import { TriangulatedRings, config as ringsConfig } from './core/ConcentricRings'

/**
 * All available pattern configurations
 */
export const patternConfigs = [
  {
    ...lifeConfig,
    key: 'life',
    name: 'Game of Life',
    cycleMs: 8000,
    golGridSize: 12,
    clearRadius: 0.24,
  },
  {
    ...eyesConfig,
    key: 'metamorph',
    name: 'Watching Eyes',
    cycleMs: 6000,
    gridX: 24,
    gridY: 14,
    warpSwirl: 0.85,
    clearRadius: 0.24,
  },
  {
    ...ringsConfig,
    key: 'tri',
    name: 'Concentric Rings',
    cycleMs: 6500,
    flipWaves: 4,
    swirl: 0.75,
    clearRadius: 0.23,
  },
]

/**
 * Create a pattern instance from a config key
 *
 * @param {string} key - Pattern key (life, metamorph, tri, union)
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {object} config - Pattern configuration overrides
 * @param {number} clearRadius - Clear radius for center area
 * @returns {object} Pattern instance
 */
export function createPattern(key, width, height, config, clearRadius) {
  switch (key) {
    case 'life':
      return new GameOfLifePattern(width, height, config, clearRadius)
    case 'metamorph':
      return new WatchingEyes(width, height, clearRadius, config)
    case 'tri':
      return new TriangulatedRings(width, height, clearRadius, config)
    default:
      // Fallback to Game of Life
      console.warn(`Unknown pattern key: ${key}, falling back to Game of Life`)
      return new GameOfLifePattern(width, height, config, clearRadius)
  }
}

/**
 * Get a pattern config by key
 *
 * @param {string} key - Pattern key
 * @returns {object|undefined} Pattern config
 */
export function getPatternConfig(key) {
  return patternConfigs.find((p) => p.key === key)
}

/**
 * Get a random pattern config
 *
 * @returns {object} Random pattern config
 */
export function getRandomPatternConfig() {
  return patternConfigs[Math.floor(Math.random() * patternConfigs.length)]
}

/**
 * Resolve pattern from URL parameter
 *
 * @param {string|null} patternParam - URL pattern parameter
 * @returns {object} Pattern config
 */
export function resolvePatternFromParam(patternParam) {
  if (!patternParam) return getRandomPatternConfig()

  const normalized = patternParam.trim().toLowerCase()

  // Try to find by key
  const byKey = getPatternConfig(normalized)
  if (byKey) return byKey

  // Try numeric index
  const numeric = Number(normalized)
  if (!Number.isNaN(numeric)) {
    const index = numeric > 0 ? numeric - 1 : numeric
    const clampedIndex = Math.max(0, Math.min(index, patternConfigs.length - 1))
    return patternConfigs[clampedIndex]
  }

  // Fallback to random
  return getRandomPatternConfig()
}

// Export all pattern classes
export { GameOfLifePattern } from './core/GameOfLife'
export { WatchingEyes } from './core/WatchingEyes'
export { TriangulatedRings } from './core/ConcentricRings'
