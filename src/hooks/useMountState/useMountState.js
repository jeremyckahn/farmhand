import { useCallback, useEffect, useRef } from 'react'

export const useMountState = () => {
  const isMountedRef = useRef(false)

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
    }
  }, [isMountedRef])

  const isMounted = useCallback(() => isMountedRef.current, [isMountedRef])

  return { isMounted }
}
