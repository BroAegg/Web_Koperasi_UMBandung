import { useEffect, useRef, RefObject } from 'react'

/**
 * useFocusTrap - Trap focus within a modal or dialog
 * Ensures keyboard navigation stays within the component
 *
 * @example
 * const ref = useFocusTrap<HTMLDivElement>(isOpen)
 * return <div ref={ref}>Modal content</div>
 */
export function useFocusTrap<T extends HTMLElement>(isActive: boolean = true): RefObject<T | null> {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    if (!isActive || !ref.current) return

    const element = ref.current
    const focusableElements = element.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Focus first element on mount
    const timer = setTimeout(() => {
      firstElement?.focus()
    }, 0)

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    element.addEventListener('keydown', handleTabKey)

    return () => {
      clearTimeout(timer)
      element.removeEventListener('keydown', handleTabKey)
    }
  }, [isActive])

  return ref
}

/**
 * useKeyboardShortcut - Register keyboard shortcuts
 *
 * @example
 * useKeyboardShortcut('Escape', handleClose)
 * useKeyboardShortcut('ctrl+s', handleSave)
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  deps: React.DependencyList = []
) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const isCtrl = key.toLowerCase().includes('ctrl+')
      const isShift = key.toLowerCase().includes('shift+')
      const isAlt = key.toLowerCase().includes('alt+')

      const actualKey = key
        .toLowerCase()
        .replace('ctrl+', '')
        .replace('shift+', '')
        .replace('alt+', '')

      const keyMatch = e.key.toLowerCase() === actualKey.toLowerCase()

      const modifiersMatch =
        (!isCtrl || e.ctrlKey || e.metaKey) && (!isShift || e.shiftKey) && (!isAlt || e.altKey)

      if (keyMatch && modifiersMatch) {
        e.preventDefault()
        callback()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, ...deps])
}

/**
 * useAnnounce - Announce messages to screen readers
 * Uses aria-live regions for dynamic content updates
 *
 * @example
 * const announce = useAnnounce()
 *
 * const handleSave = () => {
 *   saveToDB()
 *   announce('Data saved successfully', 'polite')
 * }
 */
export function useAnnounce() {
  const announceRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Create aria-live region if it doesn't exist
    if (!document.getElementById('aria-live-announcer')) {
      const announcer = document.createElement('div')
      announcer.id = 'aria-live-announcer'
      announcer.setAttribute('aria-live', 'polite')
      announcer.setAttribute('aria-atomic', 'true')
      announcer.className = 'sr-only'
      document.body.appendChild(announcer)
      announceRef.current = announcer
    } else {
      announceRef.current = document.getElementById('aria-live-announcer') as HTMLDivElement
    }
  }, [])

  return (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announceRef.current) {
      announceRef.current.setAttribute('aria-live', priority)
      announceRef.current.textContent = message

      // Clear after announcement
      const timer = setTimeout(() => {
        if (announceRef.current) {
          announceRef.current.textContent = ''
        }
      }, 1000)

      return () => clearTimeout(timer)
    }
  }
}

/**
 * useAriaHidden - Hide content from screen readers when inactive
 *
 * @example
 * useAriaHidden(modalRef, isOpen)
 */
export function useAriaHidden<T extends HTMLElement>(ref: RefObject<T>, isHidden: boolean) {
  useEffect(() => {
    if (!ref.current) return

    if (isHidden) {
      ref.current.setAttribute('aria-hidden', 'true')
    } else {
      ref.current.removeAttribute('aria-hidden')
    }
  }, [ref, isHidden])
}

/**
 * useSkipLink - Focus management for skip links
 *
 * @example
 * const skipToMain = useSkipLink('main-content')
 */
export function useSkipLink(targetId: string) {
  return () => {
    const target = document.getElementById(targetId)
    if (target) {
      target.focus()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}
