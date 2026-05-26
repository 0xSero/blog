const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export function getAnimationQuality(width, height, options = {}) {
  const area = width * height
  const isMobile = width < 640
  const isTablet = width >= 640 && width < 1024
  const fullscreen = options.fullscreen !== false
  const lowPower = Boolean(options.lowPower)
  const performanceScale = clamp(options.performanceScale ?? 1, 0.55, 1)

  const densityBase = isMobile ? 0.92 : isTablet ? 0.96 : 1
  const dprBase = isMobile ? 2 : isTablet ? 2 : fullscreen ? 2 : 1.75
  const motionBase = 1

  const density = lowPower ? densityBase * 0.58 : densityBase * performanceScale
  const maxDpr = lowPower ? Math.min(dprBase, 1.15) : Math.max(1, dprBase * performanceScale)
  const targetFps = lowPower ? 30 : null
  const motionScale = lowPower ? motionBase * 0.55 : motionBase

  return {
    area,
    density,
    isMobile,
    isTablet,
    lowPower,
    maxDpr,
    motionScale,
    performanceScale,
    targetFps,
  }
}

export function getCanvasPowerPreference() {
  if (typeof window === 'undefined') return { lowPower: false, mediaQuery: null }

  const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)') || null
  const saveData = Boolean(navigator.connection?.saveData)
  const lowMemory = navigator.deviceMemory !== undefined && navigator.deviceMemory <= 2
  return {
    lowPower: Boolean(mediaQuery?.matches || saveData || lowMemory),
    mediaQuery,
  }
}

export function scaleByQuality(value, quality, options = {}) {
  const min = options.min ?? 1
  const max = options.max ?? Infinity
  const factor = options.factor ?? 'density'
  const scaled = Math.round(value * (quality?.[factor] ?? 1))
  return clamp(scaled, min, max)
}

export function resolveCanvasSize(canvas, container, getSize) {
  if (getSize) return getSize({ canvas, container })

  const width = container?.clientWidth || window.innerWidth
  const height = container?.clientHeight || window.innerHeight
  return { width: Math.max(width, 1), height: Math.max(height, 1) }
}

export function resizeCanvas(canvas, ctx, width, height, maxDpr) {
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
  const pixelWidth = Math.max(Math.round(width * dpr), 1)
  const pixelHeight = Math.max(Math.round(height * dpr), 1)

  if (canvas.width !== pixelWidth) canvas.width = pixelWidth
  if (canvas.height !== pixelHeight) canvas.height = pixelHeight

  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  return dpr
}
