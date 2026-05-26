'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    const html = document.documentElement
    const previousScrollBehavior = html.style.scrollBehavior

    html.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)

    requestAnimationFrame(() => {
      html.style.scrollBehavior = previousScrollBehavior
    })
  }, [pathname])

  return null
}
