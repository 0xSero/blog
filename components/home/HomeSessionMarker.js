'use client'

import { useEffect } from 'react'

export default function HomeSessionMarker() {
  useEffect(() => {
    sessionStorage.setItem('sybil_visited', 'true')
  }, [])

  return null
}
