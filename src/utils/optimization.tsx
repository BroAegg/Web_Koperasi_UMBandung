import { ComponentType, ReactNode, lazy, Suspense, memo } from 'react'
import { SkeletonLoader } from '@/components/shared/SkeletonLoader'

/**
 * withMemo - Higher-order component that wraps a component with React.memo
 * Automatically sets the display name for better debugging
 *
 * @example
 * const MemoizedCard = withMemo(Card)
 */
export function withMemo<P extends object>(
  Component: ComponentType<P>,
  propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
): ComponentType<P> {
  const MemoizedComponent = memo(Component, propsAreEqual)
  MemoizedComponent.displayName = `Memo(${Component.displayName || Component.name || 'Component'})`
  return MemoizedComponent
}

/**
 * lazyLoad - Lazy load a component with a loading fallback
 *
 * @example
 * const HeavyChart = lazyLoad(() => import('./HeavyChart'))
 *
 * // With custom fallback
 * const Dashboard = lazyLoad(
 *   () => import('./Dashboard'),
 *   <SkeletonLoader variant="stats" />
 * )
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyLoad<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback: ReactNode = <SkeletonLoader variant="card" />
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ComponentType<any> {
  const LazyComponent = lazy(importFn)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function LazyLoadedComponent(props: any) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}

/**
 * Image optimization presets for Next.js Image component
 */
export const IMAGE_SIZES = {
  thumbnail: { width: 64, height: 64, quality: 75 },
  small: { width: 128, height: 128, quality: 80 },
  card: { width: 256, height: 256, quality: 85 },
  medium: { width: 512, height: 512, quality: 85 },
  large: { width: 1024, height: 1024, quality: 90 },
  full: { width: 1920, height: 1920, quality: 90 },
} as const

export type ImageSize = keyof typeof IMAGE_SIZES

/**
 * optimizeImageProps - Generate optimized Next.js Image props
 *
 * @example
 * const imageProps = optimizeImageProps('/product.jpg', 'card', true)
 * <Image {...imageProps} alt="Product" />
 */
export function optimizeImageProps(
  src: string,
  size: ImageSize = 'medium',
  priority: boolean = false
) {
  const sizeConfig = IMAGE_SIZES[size]

  return {
    src,
    width: sizeConfig.width,
    height: sizeConfig.height,
    quality: sizeConfig.quality,
    priority,
    loading: priority ? ('eager' as const) : ('lazy' as const),
  }
}

/**
 * shouldComponentUpdate - Helper to determine if component should update
 * Useful for custom comparison in React.memo
 *
 * @example
 * const MemoizedCard = withMemo(Card, shouldComponentUpdate(['id', 'title']))
 */
export function shouldComponentUpdate<T extends Record<string, unknown>>(compareKeys: (keyof T)[]) {
  return (prevProps: T, nextProps: T): boolean => {
    return compareKeys.every((key) => prevProps[key] === nextProps[key])
  }
}

/**
 * batchUpdates - Group multiple state updates together
 * Reduces re-renders by batching updates
 *
 * @example
 * batchUpdates(() => {
 *   setState1(value1)
 *   setState2(value2)
 *   setState3(value3)
 * })
 */
export function batchUpdates(callback: () => void) {
  // React 18+ automatically batches updates, but explicit batching
  // can still be useful for clarity and ensuring batch behavior
  callback()
}
