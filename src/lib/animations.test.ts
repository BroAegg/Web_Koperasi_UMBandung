import { describe, it, expect } from 'vitest'
import { animations, transitions, hovers, effects, keyframes } from '@/lib/animations'

describe('Animation Utilities', () => {
  describe('animations object', () => {
    it('should contain all animation classes', () => {
      expect(animations.fadeIn).toBe('animate-fade-in')
      expect(animations.fadeOut).toBe('animate-fade-out')
      expect(animations.scaleIn).toBe('animate-scale-up')
      expect(animations.slideInLeft).toBe('animate-slide-left')
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
      expect(hovers.scaleUp).toBe('hover:scale-105')
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
      expect(effects.cardFlat).toContain('bg-card')
      expect(effects.cardFlat).toContain('border')
      expect(effects.cardElevated).toContain('shadow-lg')
    })

    it('should contain focus ring', () => {
      expect(effects.focusRing).toContain('focus:ring-2')
      expect(effects.focusRing).toContain('focus:ring-primary')
    })
  })
})

describe('Animation Keyframes', () => {
  it('should export keyframe animation names', () => {
    expect(keyframes.shake).toBe('shake')
    expect(keyframes.slideUp).toBe('slide-up')
    expect(keyframes.slideDown).toBe('slide-down')
    expect(keyframes.scaleUp).toBe('scale-up')
    expect(keyframes.checkmark).toBe('checkmark')
    expect(keyframes.ripple).toBe('ripple')
  })
})
