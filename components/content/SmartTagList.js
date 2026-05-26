'use client'

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Link from '@/components/Link'
import kebabCase from '@/lib/utils/kebabCase'

const TAG_GAP = 8
const CHIP_SIZES = {
  compact: {
    fontSize: 11,
    minWidth: 30,
    xPadding: 20,
  },
  default: {
    fontSize: 12,
    minWidth: 44,
    xPadding: 26,
  },
}
let measureContext = null

function tagClassName(size, hidden = false) {
  const sizeClassName =
    size === 'compact'
      ? 'min-h-7 min-w-7 rounded-md bg-surface-inset px-2.5 text-[11px] hover:bg-surface-elevated'
      : 'min-h-11 min-w-11 rounded-full border border-border-subtle bg-surface-inset/70 px-3 text-xs hover:border-border-default'

  return `inline-flex shrink-0 items-center justify-center font-medium text-accent-subtle transition-colors hover:text-text-primary ${sizeClassName} ${
    hidden ? 'pointer-events-none' : ''
  }`
}

export default function SmartTagList({
  size = 'default',
  tags = [],
  getHref = (tag) => `/tags/${kebabCase(tag)}`,
}) {
  const cleanTags = useMemo(() => tags.filter(Boolean), [tags])
  const containerRef = useRef(null)
  const [visibleCount, setVisibleCount] = useState(cleanTags.length)

  const measure = useCallback(() => {
    const container = containerRef.current
    if (!container || cleanTags.length === 0) return

    if (!measureContext) {
      measureContext = document.createElement('canvas').getContext('2d')
    }

    if (!measureContext) return

    const fontFamily = getComputedStyle(container).fontFamily
    const chipSize = CHIP_SIZES[size] || CHIP_SIZES.default
    measureContext.font = `500 ${chipSize.fontSize}px ${fontFamily}`

    const availableWidth = container.clientWidth
    const getChipWidth = (text) =>
      Math.max(
        chipSize.minWidth,
        Math.ceil(measureContext.measureText(text).width) + chipSize.xPadding
      )

    const tagWidths = cleanTags.map(getChipWidth)
    const totalTagsWidth =
      tagWidths.reduce((sum, width) => sum + width, 0) + TAG_GAP * Math.max(cleanTags.length - 1, 0)

    if (totalTagsWidth <= availableWidth) {
      setVisibleCount(cleanTags.length)
      return
    }

    let nextVisibleCount = 1

    for (let count = cleanTags.length - 1; count >= 1; count--) {
      const remaining = cleanTags.length - count
      if (remaining <= 0) continue

      const tagsWidth =
        tagWidths.slice(0, count).reduce((sum, width) => sum + width, 0) +
        TAG_GAP * Math.max(count - 1, 0)
      const moreWidth = getChipWidth(`+${remaining}`)
      const totalWidth = tagsWidth + TAG_GAP + moreWidth

      if (totalWidth <= availableWidth) {
        nextVisibleCount = count
        break
      }
    }

    setVisibleCount(nextVisibleCount)
  }, [cleanTags, size])

  useLayoutEffect(() => {
    measure()

    const container = containerRef.current
    if (!container || !('ResizeObserver' in window)) return undefined

    const observer = new ResizeObserver(measure)
    observer.observe(container)

    return () => observer.disconnect()
  }, [measure])

  if (cleanTags.length === 0) return null

  const visibleTags = cleanTags.slice(0, visibleCount)
  const remainingCount = cleanTags.length - visibleCount

  return (
    <div ref={containerRef} className="relative min-w-0 overflow-hidden">
      <div className="flex min-w-0 items-center gap-2 overflow-hidden">
        {visibleTags.map((tag) => (
          <Link key={tag} href={getHref(tag)} className={tagClassName(size)}>
            {tag}
          </Link>
        ))}
        {remainingCount > 0 && (
          <span
            className={`inline-flex shrink-0 items-center border border-border-subtle font-mono text-text-muted ${
              size === 'compact'
                ? 'min-h-7 rounded-md border-transparent bg-surface-inset px-2.5 text-[11px]'
                : 'min-h-11 rounded-full px-3 text-xs'
            }`}
          >
            +{remainingCount}
          </span>
        )}
      </div>
    </div>
  )
}
