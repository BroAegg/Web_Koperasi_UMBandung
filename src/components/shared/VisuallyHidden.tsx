import { ReactNode } from 'react'

/**
 * VisuallyHidden - Hide content visually but keep it accessible to screen readers
 * Uses .sr-only Tailwind class
 *
 * @example
 * <VisuallyHidden>
 *   Current page: Dashboard
 * </VisuallyHidden>
 */
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>
}
