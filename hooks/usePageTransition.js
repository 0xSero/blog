import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

/**
 * usePageTransition - Custom hook for tracking page transition state
 *
 * Returns:
 * - isTransitioning: boolean - true during route changes
 * - progress: number - 0-1 progress of transition (estimated)
 *
 * Usage:
 *   const { isTransitioning } = usePageTransition()
 *   // Show loading indicator when isTransitioning is true
 */
export function usePageTransition() {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let progressInterval

    const handleStart = () => {
      setIsTransitioning(true)
      setProgress(0)

      // Simulate progress (since we can't know actual loading progress)
      let currentProgress = 0
      progressInterval = setInterval(() => {
        currentProgress += 0.1
        if (currentProgress < 0.9) {
          setProgress(currentProgress)
        }
      }, 50)
    }

    const handleComplete = () => {
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      setProgress(1)
      setTimeout(() => {
        setIsTransitioning(false)
        setProgress(0)
      }, 200)
    }

    const handleError = (err) => {
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      console.error('Route change error:', err)
      setIsTransitioning(false)
      setProgress(0)
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleError)

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleError)
    }
  }, [router])

  return { isTransitioning, progress }
}

export default usePageTransition
