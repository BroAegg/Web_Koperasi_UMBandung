import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    const result = cn('text-red-500', 'bg-blue-500')
    expect(result).toBe('text-red-500 bg-blue-500')
  })

  it('should handle conditional classes', () => {
    const result = cn('base-class', true && 'conditional-class', false && 'hidden-class')
    expect(result).toBe('base-class conditional-class')
  })

  it('should merge conflicting Tailwind classes correctly', () => {
    const result = cn('p-4 p-2') // p-2 should override p-4
    expect(result).toBe('p-2')
  })

  it('should handle undefined and null values', () => {
    const result = cn('class1', undefined, 'class2', null, 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('should handle empty strings', () => {
    const result = cn('class1', '', 'class2')
    expect(result).toBe('class1 class2')
  })

  it('should handle arrays of classes', () => {
    const result = cn(['class1', 'class2'], 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('should handle objects with boolean values', () => {
    const result = cn({
      class1: true,
      class2: false,
      class3: true,
    })
    expect(result).toBe('class1 class3')
  })

  it('should deduplicate identical classes', () => {
    const result = cn('text-red-500', 'bg-blue-500', 'text-red-500')
    expect(result).not.toContain('text-red-500 text-red-500')
  })
})

describe('cn edge cases', () => {
  it('should handle empty input', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('should handle only false conditions', () => {
    const result = cn(false && 'class1', false && 'class2')
    expect(result).toBe('')
  })

  it('should handle mix of valid and invalid inputs', () => {
    const result = cn('valid', null, undefined, false, '', 'another-valid')
    expect(result).toBe('valid another-valid')
  })
})
