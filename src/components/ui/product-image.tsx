import * as React from 'react'
import { Package } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null
  alt: string
  fallback?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = {
  sm: 'h-12 w-12',
  md: 'h-20 w-20',
  lg: 'h-32 w-32',
  xl: 'h-48 w-48',
}

export function ProductImage({
  src,
  alt,
  fallback,
  size = 'md',
  className,
  ...props
}: ProductImageProps) {
  const [error, setError] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  const showFallback = !src || error

  return (
    <div
      className={cn(
        'bg-muted relative flex items-center justify-center overflow-hidden rounded-lg',
        sizeClasses[size],
        className
      )}
    >
      {showFallback ? (
        fallback || (
          <div className="flex flex-col items-center justify-center p-2 text-center">
            <Package className="text-muted-foreground h-8 w-8" />
            <span className="text-muted-foreground mt-1 text-xs">No Image</span>
          </div>
        )
      ) : (
        <>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-muted/50 h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          )}
          <img
            src={src}
            alt={alt}
            className={cn('h-full w-full object-cover transition-opacity', loading && 'opacity-0')}
            onLoad={() => setLoading(false)}
            onError={() => {
              setError(true)
              setLoading(false)
            }}
            {...props}
          />
        </>
      )}
    </div>
  )
}
