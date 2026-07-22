import { useEffect, useState } from 'react'

/**
 * Hook to detect if the user prefers reduced motion, either system-wide
 * or via browser / Chrome DevTools emulation, updating dynamically on change.
 */
export const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return false
    }

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }

    const mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)')
    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', listener)
    } else if ('addListener' in mediaQueryList) {
      // Compatibility for legacy mediaQueryList implementations
      ;((mediaQueryList as unknown) as {
        addListener: (cb: (e: MediaQueryListEvent) => void) => void
      }).addListener(listener)
    }

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', listener)
      } else if ('removeListener' in mediaQueryList) {
        ;((mediaQueryList as unknown) as {
          removeListener: (cb: (e: MediaQueryListEvent) => void) => void
        }).removeListener(listener)
      }
    }
  }, [])

  return prefersReducedMotion
}
