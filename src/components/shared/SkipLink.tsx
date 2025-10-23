import { useSkipLink } from '@/hooks/useAccessibility'

/**
 * SkipLink - Allow keyboard users to skip navigation
 * Hidden until focused, appears at top of page on Tab
 */
export function SkipLink() {
  const skipToMain = useSkipLink('main-content')

  return (
    <a
      href="#main-content"
      onClick={(e) => {
        e.preventDefault()
        skipToMain()
      }}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none"
    >
      Skip to main content
    </a>
  )
}
