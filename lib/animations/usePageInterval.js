import { useEffect, useRef } from 'react'

export function usePageInterval(callback, delay, enabled = true) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!enabled || delay == null) return undefined

    let intervalId = null
    let visible = document.visibilityState === 'visible'

    const stop = () => {
      if (intervalId !== null) {
        clearInterval(intervalId)
        intervalId = null
      }
    }

    const start = () => {
      if (!visible || intervalId !== null) return
      intervalId = setInterval(() => callbackRef.current(), delay)
    }

    const handleVisibilityChange = () => {
      visible = document.visibilityState === 'visible'
      if (visible) start()
      else stop()
    }

    const handlePageHide = () => {
      stop()
    }

    const handlePageShow = () => {
      visible = document.visibilityState === 'visible'
      start()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('pagehide', handlePageHide)
    window.addEventListener('pageshow', handlePageShow)
    start()

    return () => {
      stop()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('pagehide', handlePageHide)
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [delay, enabled])
}
