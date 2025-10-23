import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProgressiveImageProps {
  /**
   * Image source URL
   */
  src: string
  /**
   * Alt text for image
   */
  alt: string
  /**
   * Image width
   */
  width?: number
  /**
   * Image height
   */
  height?: number
  /**
   * CSS classes
   */
  className?: string
  /**
   * Fill container
   */
  fill?: boolean
  /**
   * Object fit
   */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  /**
   * Priority loading
   */
  priority?: boolean
  /**
   * Low quality placeholder
   */
  placeholder?: 'blur' | 'empty'
  /**
   * Blur data URL
   */
  blurDataURL?: string
}

/**
 * ProgressiveImage - Image component with loading skeleton
 *
 * @example
 * <ProgressiveImage
 *   src="/images/product.jpg"
 *   alt="Product"
 *   width={300}
 *   height={300}
 * />
 */
export function ProgressiveImage({
  src,
  alt,
  width,
  height,
  className,
  fill,
  objectFit = 'cover',
  priority = false,
  placeholder,
  blurDataURL,
}: ProgressiveImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Use setTimeout to defer setState to next tick
    const timer = setTimeout(() => {
      setIsLoading(true)
      setHasError(false)
    }, 0)
    return () => clearTimeout(timer)
  }, [src])

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-neutral-200">
          <div className="flex h-full items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-500" />
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-2 text-sm text-neutral-500">Failed to load image</p>
          </div>
        </div>
      )}

      {/* Actual image */}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          hasError && 'hidden'
        )}
        style={{ objectFit }}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
      />
    </div>
  )
}

/**
 * ImageSkeleton - Simple skeleton for image placeholders
 */
export function ImageSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse bg-neutral-200', className)}>
      <div className="flex h-full items-center justify-center">
        <svg
          className="h-12 w-12 text-neutral-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    </div>
  )
}
