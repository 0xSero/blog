'use client'

import { useRef } from 'react'
import { createPattern, getPatternConfig, patternConfigs } from '@/lib/patterns'
import { useCanvasAnimation } from '@/lib/animations/useCanvasAnimation'

export default function PortalSeparator({ patternKey = 'rings' }) {
  const canvasRef = useRef(null)
  const wrapperRef = useRef(null)
  const patternRef = useRef(null)

  const activeConfig = getPatternConfig(patternKey) || patternConfigs[0]

  useCanvasAnimation({
    canvasRef,
    containerRef: wrapperRef,
    fullscreen: false,
    getSize: ({ container }) => ({
      width: Math.max(container?.clientWidth || 1, 1),
      height: Math.max(container?.clientHeight || 180, 180),
    }),
    onResize: ({ width, height, quality }) => {
      const clearRadius = Math.min(width, height) * activeConfig.clearRadius
      patternRef.current = createPattern(
        activeConfig.key,
        width,
        height,
        activeConfig,
        clearRadius,
        quality
      )
    },
    pauseWhenOffscreen: true,
    render: ({ ctx, elapsed, width, height }) => {
      const cycleT = (elapsed % activeConfig.cycleMs) / activeConfig.cycleMs
      ctx.clearRect(0, 0, width, height)
      patternRef.current?.render(ctx, cycleT)
    },
  })

  return (
    <div ref={wrapperRef} className="relative h-40 overflow-hidden rounded-lg sm:h-[180px]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
