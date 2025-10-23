import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * useDebounce - Debounce a value
 *
 * @example
 * const debouncedSearch = useDebounce(searchTerm, 500)
 *
 * useEffect(() => {
 *   if (debouncedSearch) {
 *     fetchResults(debouncedSearch)
 *   }
 * }, [debouncedSearch])
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * useDebouncedCallback - Debounce a callback function
 *
 * @example
 * const debouncedSearch = useDebouncedCallback((query: string) => {
 *   fetchResults(query)
 * }, 500)
 */
export function useDebouncedCallback<T extends (...args: never[]) => void>(
  callback: T,
  delay: number = 500
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay]
  )
}

/**
 * useThrottle - Throttle a value
 *
 * @example
 * const throttledScroll = useThrottle(scrollPosition, 100)
 */
export function useThrottle<T>(value: T, interval: number = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastUpdated = useRef<number>(0)

  useEffect(() => {
    const now = Date.now()

    if (now >= lastUpdated.current + interval) {
      lastUpdated.current = now
      const timer = setTimeout(() => {
        setThrottledValue(value)
      }, 0)
      return () => {
        clearTimeout(timer)
      }
    } else {
      const timer = setTimeout(() => {
        lastUpdated.current = Date.now()
        setThrottledValue(value)
      }, interval)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [value, interval])

  return throttledValue
}

/**
 * useThrottledCallback - Throttle a callback function
 *
 * @example
 * const throttledScroll = useThrottledCallback(() => {
 *   console.log('Scrolling...')
 * }, 100)
 */
export function useThrottledCallback<T extends (...args: never[]) => void>(
  callback: T,
  delay: number = 500
): (...args: Parameters<T>) => void {
  const lastRan = useRef<number>(0)

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()

      if (now - lastRan.current >= delay) {
        callback(...args)
        lastRan.current = now
      }
    },
    [callback, delay]
  )
}
