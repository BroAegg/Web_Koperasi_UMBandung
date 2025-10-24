/**
 * Animation Utilities
 * Reusable animation configurations and helpers
 */

export const animations = {
  // Fade animations
  fadeIn: 'animate-in fade-in duration-300',
  fadeOut: 'animate-out fade-out duration-200',
  fadeInUp: 'animate-in fade-in slide-in-from-bottom-4 duration-400',
  fadeInDown: 'animate-in fade-in slide-in-from-top-4 duration-400',

  // Scale animations
  scaleIn: 'animate-in zoom-in-95 duration-200',
  scaleOut: 'animate-out zoom-out-95 duration-150',

  // Slide animations
  slideInLeft: 'animate-in slide-in-from-left duration-300',
  slideInRight: 'animate-in slide-in-from-right duration-300',
  slideInBottom: 'animate-in slide-in-from-bottom duration-300',

  // Spin
  spin: 'animate-spin',

  // Pulse
  pulse: 'animate-pulse',

  // Bounce
  bounce: 'animate-bounce',
}

export const transitions = {
  // Standard transitions
  default: 'transition-all duration-200 ease-in-out',
  fast: 'transition-all duration-150 ease-in-out',
  slow: 'transition-all duration-300 ease-in-out',
  slower: 'transition-all duration-500 ease-in-out',

  // Specific property transitions
  colors: 'transition-colors duration-200 ease-in-out',
  transform: 'transition-transform duration-200 ease-in-out',
  opacity: 'transition-opacity duration-200 ease-in-out',
  shadow: 'transition-shadow duration-200 ease-in-out',
}

export const hovers = {
  // Scale hovers
  scaleUp: 'hover:scale-105 active:scale-95',
  scaleUpSm: 'hover:scale-102 active:scale-98',
  scaleDown: 'hover:scale-95',

  // Shadow hovers
  shadowMd: 'hover:shadow-md',
  shadowLg: 'hover:shadow-lg',
  shadowXl: 'hover:shadow-xl',

  // Brightness
  brighten: 'hover:brightness-110',
  darken: 'hover:brightness-90',

  // Opacity
  opacityHigh: 'hover:opacity-100',
  opacityMed: 'hover:opacity-80',
  opacityLow: 'hover:opacity-60',
}

export const effects = {
  // Glass morphism
  glass:
    'backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border border-gray-200/50 dark:border-gray-700/50',

  // Card elevations
  cardFlat: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
  cardElevated:
    'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow',
  cardFloating:
    'bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300',

  // Focus rings
  focusRing: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
  focusRingOffset:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
}

// Animation keyframes for custom animations
export const keyframes = {
  shake: {
    '0%, 100%': { transform: 'translateX(0)' },
    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
    '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
  },
  slideUp: {
    '0%': { transform: 'translateY(10px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  slideDown: {
    '0%': { transform: 'translateY(-10px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  scaleUp: {
    '0%': { transform: 'scale(0.95)', opacity: '0' },
    '100%': { transform: 'scale(1)', opacity: '1' },
  },
  checkmark: {
    '0%': { strokeDashoffset: '100' },
    '100%': { strokeDashoffset: '0' },
  },
  ripple: {
    '0%': { transform: 'scale(0)', opacity: '0.6' },
    '100%': { transform: 'scale(4)', opacity: '0' },
  },
}

// Helper function to combine classes
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
