// Lazy Loading Utilities
// Helper functions for code splitting with error handling

import { lazy, ComponentType, LazyExoticComponent } from 'react'

/**
 * Enhanced lazy loading with retry logic
 * Automatically retries failed chunk loads up to 3 times
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  maxRetries = 3
): LazyExoticComponent<T> {
  return lazy(() => {
    return new Promise<{ default: T }>((resolve, reject) => {
      const attemptImport = (retriesLeft: number) => {
        componentImport()
          .then(resolve)
          .catch((error) => {
            if (retriesLeft === 0) {
              reject(error)
              return
            }

            // Wait before retrying (exponential backoff)
            const delay = Math.pow(2, maxRetries - retriesLeft) * 1000
            setTimeout(() => {
              console.log(`Retrying import... (${maxRetries - retriesLeft + 1}/${maxRetries})`)
              attemptImport(retriesLeft - 1)
            }, delay)
          })
      }

      attemptImport(maxRetries)
    })
  })
}

/**
 * Preload a lazy component before it's needed
 * Useful for prefetching on hover or route prefetching
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function preloadComponent<T extends ComponentType<any>>(
  lazyComponent: LazyExoticComponent<T>
) {
  // @ts-expect-error - _payload is internal but works for prefetching
  const Component = lazyComponent._payload
  if (Component && typeof Component._result !== 'undefined') {
    return Promise.resolve()
  }
  // @ts-expect-error - _init is internal
  return lazyComponent._init(lazyComponent._payload)
}

/**
 * Create a lazy component with automatic prefetching
 * Returns both the lazy component and a prefetch function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createLazyComponent<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
) {
  const LazyComponent = lazyWithRetry(componentImport)

  const prefetch = () => {
    componentImport().catch((error) => {
      console.error('Prefetch failed:', error)
    })
  }

  return {
    Component: LazyComponent,
    prefetch,
  }
}

/**
 * Batch preload multiple components
 * Useful for preloading critical routes on idle
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function preloadComponents(components: Array<LazyExoticComponent<any>>): Promise<void[]> {
  return Promise.all(components.map((component) => preloadComponent(component)))
}

/**
 * Preload on route hover (for navigation links)
 * Use with onMouseEnter on navigation items
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createRoutePreloader(componentImport: () => Promise<any>) {
  let preloaded = false

  return () => {
    if (!preloaded) {
      preloaded = true
      componentImport().catch((error) => {
        console.error('Route preload failed:', error)
        preloaded = false // Allow retry on next hover
      })
    }
  }
}
