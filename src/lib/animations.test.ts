import { describe, it, expect } from 'vitest'
import { animations, transitions, hovers, effects, keyframes } from '@/lib/animations'

describe('Animation Utilities', () => {
  describe('animations object', () => {
    it('should contain all animation classes', () => {
      expect(animations.fadeIn).toBe('animate-in fade-in duration-300')
      expect(animations.fadeOut).toBe('animate-out fade-out duration-200')
      expect(animations.scaleIn).toBe('animate-in zoom-in-95 duration-200')
      expect(animations.slideInLeft).toBe('animate-in slide-in-from-left duration-300')
      expect(animations.spin).toBe('animate-spin')
      expect(animations.pulse).toBe('animate-pulse')
      expect(animations.bounce).toBe('animate-bounce')
    })
  })

  describe('transitions object', () => {
    it('should contain transition classes', () => {
      expect(transitions.default).toBe('transition-all duration-200 ease-in-out')
      expect(transitions.fast).toBe('transition-all duration-150 ease-in-out')
      expect(transitions.slow).toBe('transition-all duration-300 ease-in-out')
    })

    it('should contain specific transition properties', () => {
      expect(transitions.colors).toBe('transition-colors duration-200 ease-in-out')
      expect(transitions.transform).toBe('transition-transform duration-200 ease-in-out')
      expect(transitions.opacity).toBe('transition-opacity duration-200 ease-in-out')
      expect(transitions.shadow).toBe('transition-shadow duration-200 ease-in-out')
    })
  })

  describe('hovers object', () => {
    it('should contain hover effect classes', () => {
      expect(hovers.scaleUp).toBe('hover:scale-105 active:scale-95')
      expect(hovers.shadowMd).toBe('hover:shadow-md')
      expect(hovers.brighten).toBe('hover:brightness-110')
      expect(hovers.opacityHigh).toBe('hover:opacity-100')
    })
  })

  describe('effects object', () => {
    it('should contain glass effect', () => {
      expect(effects.glass).toContain('backdrop-blur-md')
      expect(effects.glass).toContain('bg-white/80')
    })

    it('should contain card effects', () => {
      expect(effects.cardFlat).toContain('bg-white')
      expect(effects.cardFlat).toContain('dark:bg-gray-800')
      expect(effects.cardFlat).toContain('border')
      expect(effects.cardElevated).toContain('shadow-sm')
      expect(effects.cardElevated).toContain('hover:shadow-md')
    })

    it('should contain focus ring', () => {
      expect(effects.focusRing).toContain('focus-visible:ring-2')
      expect(effects.focusRing).toContain('focus-visible:ring-blue-500')
    })
  })
})

describe('Animation Keyframes', () => {
  it('should export keyframe objects with correct properties', () => {
    expect(keyframes.shake).toHaveProperty('0%, 100%')
    expect(keyframes.slideUp).toHaveProperty('0%')
    expect(keyframes.slideUp).toHaveProperty('100%')
    expect(keyframes.scaleUp).toHaveProperty('0%')
    expect(keyframes.checkmark).toHaveProperty('0%')
    expect(keyframes.ripple).toHaveProperty('0%')
  })

  it('should have correct keyframe values', () => {
    expect(keyframes.shake['0%, 100%']).toEqual({ transform: 'translateX(0)' })
    expect(keyframes.slideUp['100%']).toEqual({ transform: 'translateY(0)', opacity: '1' })
    expect(keyframes.scaleUp['100%']).toEqual({ transform: 'scale(1)', opacity: '1' })
  })
})
