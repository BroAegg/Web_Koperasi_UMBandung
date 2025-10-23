import { useEffect, useRef, DependencyList, useState } from 'react'

/**
 * useIntersectionObserver - Detect when an element enters viewport
 * Useful for lazy loading and infinite scroll
 *
 * @example
 * const ref = useIntersectionObserver<HTMLDivElement>((entry) => {
 *   if (entry.isIntersecting) {
 *     loadMoreData()
 *   }
 * })
 *
 * return <div ref={ref}>Load more trigger</div>
 */
export function useIntersectionObserver<T extends HTMLElement>(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          callback(entry)
        })
      },
      {
        threshold: 0.1,
        ...options,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [callback, options])

  return ref
}

/**
 * useUpdateEffect - Like useEffect but skips the first render
 * Useful when you only want to run effects on updates, not on mount
 *
 * @example
 * useUpdateEffect(() => {
 *   console.log('Component updated, but not on mount')
 * }, [dependency])
 */
export function useUpdateEffect(effect: () => void | (() => void), deps: DependencyList) {
  const isMounted = useRef(false)

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }

    return effect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/**
 * usePrevious - Get the previous value of a prop or state
 *
 * @example
 * const prevCount = usePrevious(count)
 * console.log(`Current: ${count}, Previous: ${prevCount}`)
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)
  const [previous, setPrevious] = useState<T | undefined>(undefined)

  useEffect(() => {
    const timer = setTimeout(() => {
      setPrevious(ref.current)
      ref.current = value
    }, 0)
    return () => clearTimeout(timer)
  }, [value])

  return previous
}

/**
 * useIsFirstRender - Check if it's the first render
 *
 * @example
 * const isFirstRender = useIsFirstRender()
 * if (isFirstRender) {
 *   console.log('First render')
 * }
 */
export function useIsFirstRender(): boolean {
  const [isFirst, setIsFirst] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFirst(false)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  return isFirst
}
