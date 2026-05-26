import { useEffect, useRef } from 'react'
import {
  getAnimationQuality,
  getCanvasPowerPreference,
  resizeCanvas,
  resolveCanvasSize,
} from './quality'

function useLatest(value) {
  const ref = useRef(value)
  ref.current = value
  return ref
}

export function useCanvasAnimation({
  canvasRef,
  containerRef,
  enabled = true,
  fullscreen = true,
  getSize,
  onResize,
  pauseWhenHidden = true,
  pauseWhenOffscreen = false,
  render,
}) {
  const callbacksRef = useLatest({ getSize, onResize, render })

  useEffect(() => {
    if (!enabled) return undefined

    const canvas = canvasRef.current
    const container = containerRef?.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true })
    if (!ctx) return undefined

    let animationId = null
    let resizeFrame = null
    let lastFrameTime = 0
    let lastRenderTime = 0
    let performanceSampleStart = 0
    let performanceSampleFrames = 0
    let performanceScale = 1
    let lowFrameSamples = 0
    let highFrameSamples = 0
    let elapsed = 0
    let running = false
    let visible = !pauseWhenHidden || document.visibilityState === 'visible'
    let inViewport = true
    let powerPreference = getCanvasPowerPreference()

    const state = {
      canvas,
      ctx,
      dpr: 1,
      elapsed: 0,
      height: 1,
      quality: getAnimationQuality(1, 1, { fullscreen, lowPower: powerPreference.lowPower }),
      width: 1,
    }

    const shouldRun = () => enabled && visible && inViewport

    const stop = () => {
      running = false
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
        animationId = null
      }
      lastFrameTime = 0
      lastRenderTime = 0
      performanceSampleStart = 0
      performanceSampleFrames = 0
    }

    const tick = (time) => {
      if (!running) return

      if (!lastFrameTime) {
        lastFrameTime = time
        lastRenderTime = time
        performanceSampleStart = time
      }

      const delta = Math.min(time - lastFrameTime, 64)
      lastFrameTime = time
      performanceSampleFrames += 1

      const frameInterval = state.quality.targetFps ? 1000 / state.quality.targetFps : 0
      if (!frameInterval || time - lastRenderTime >= frameInterval - 1) {
        elapsed += delta
        state.elapsed = elapsed
        callbacksRef.current.render?.({
          ...state,
          delta,
          time,
        })
        lastRenderTime = time
      }

      const sampleDuration = time - performanceSampleStart
      if (sampleDuration >= 1000) {
        const fps = (performanceSampleFrames * 1000) / sampleDuration
        const canAdapt = !state.quality.lowPower

        state.quality.fps = fps

        if (canAdapt && fps < 55 && performanceScale > 0.7) {
          lowFrameSamples += 1
          highFrameSamples = 0
          if (lowFrameSamples >= 2) {
            performanceScale = Math.max(0.7, performanceScale - 0.12)
            lowFrameSamples = 0
            scheduleResize()
          }
        } else if (canAdapt && fps > 95 && performanceScale < 1) {
          highFrameSamples += 1
          lowFrameSamples = 0
          if (highFrameSamples >= 4) {
            performanceScale = Math.min(1, performanceScale + 0.08)
            highFrameSamples = 0
            scheduleResize()
          }
        } else {
          lowFrameSamples = 0
          highFrameSamples = 0
        }

        performanceSampleStart = time
        performanceSampleFrames = 0
      }

      animationId = requestAnimationFrame(tick)
    }

    const start = () => {
      if (running || !shouldRun()) return
      running = true
      animationId = requestAnimationFrame(tick)
    }

    const applyResize = () => {
      resizeFrame = null
      const size = resolveCanvasSize(canvas, container, callbacksRef.current.getSize)
      const width = Math.max(Math.round(size.width), 1)
      const height = Math.max(Math.round(size.height), 1)
      const quality = getAnimationQuality(width, height, {
        fullscreen,
        lowPower: powerPreference.lowPower,
        performanceScale,
      })
      const dpr = resizeCanvas(canvas, ctx, width, height, quality.maxDpr)

      state.width = width
      state.height = height
      state.dpr = dpr
      state.quality = quality

      callbacksRef.current.onResize?.({ ...state })
    }

    const scheduleResize = () => {
      if (resizeFrame !== null) return
      resizeFrame = requestAnimationFrame(applyResize)
    }

    const handleVisibilityChange = () => {
      visible = !pauseWhenHidden || document.visibilityState === 'visible'
      if (shouldRun()) start()
      else stop()
    }

    const handlePageShow = () => {
      visible = !pauseWhenHidden || document.visibilityState === 'visible'
      scheduleResize()
      if (shouldRun()) start()
    }

    const handlePageHide = () => {
      stop()
    }

    const handlePowerPreferenceChange = () => {
      powerPreference = getCanvasPowerPreference()
      performanceScale = 1
      scheduleResize()
    }

    let resizeObserver = null
    if (container && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(scheduleResize)
      resizeObserver.observe(container)
    } else {
      window.addEventListener('resize', scheduleResize)
    }

    let intersectionObserver = null
    if (pauseWhenOffscreen && container && 'IntersectionObserver' in window) {
      inViewport = false
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          inViewport = entry.isIntersecting
          if (shouldRun()) start()
          else stop()
        },
        { rootMargin: '160px' }
      )
      intersectionObserver.observe(container)
    }

    if (pauseWhenHidden) {
      document.addEventListener('visibilitychange', handleVisibilityChange)
      window.addEventListener('pagehide', handlePageHide)
      window.addEventListener('pageshow', handlePageShow)
    }

    if (powerPreference.mediaQuery?.addEventListener) {
      powerPreference.mediaQuery.addEventListener('change', handlePowerPreferenceChange)
    } else if (powerPreference.mediaQuery?.addListener) {
      powerPreference.mediaQuery.addListener(handlePowerPreferenceChange)
    }

    applyResize()
    start()

    return () => {
      stop()
      if (resizeFrame !== null) cancelAnimationFrame(resizeFrame)
      resizeObserver?.disconnect()
      intersectionObserver?.disconnect()
      window.removeEventListener('resize', scheduleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('pagehide', handlePageHide)
      window.removeEventListener('pageshow', handlePageShow)
      if (powerPreference.mediaQuery?.removeEventListener) {
        powerPreference.mediaQuery.removeEventListener('change', handlePowerPreferenceChange)
      } else if (powerPreference.mediaQuery?.removeListener) {
        powerPreference.mediaQuery.removeListener(handlePowerPreferenceChange)
      }
    }
  }, [
    canvasRef,
    containerRef,
    enabled,
    fullscreen,
    pauseWhenHidden,
    pauseWhenOffscreen,
    callbacksRef,
  ])
}
