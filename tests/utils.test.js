import { describe, it, expect } from 'vitest'
import { easing } from '../src/game/utils/Easing.js'
import { colorTheme, updateColorTheme } from '../src/game/utils/Colors.js'
import { clamp, lerp, random, collision } from '../src/game/utils/Math.js'

describe('Utility Modules', () => {
  describe('Easing Functions', () => {
    it('should have all easing functions', () => {
      expect(typeof easing.linear).toBe('function')
      expect(typeof easing.easeInQuad).toBe('function')
      expect(typeof easing.easeOutQuad).toBe('function')
      expect(typeof easing.easeInCubic).toBe('function')
      expect(typeof easing.easeOutCubic).toBe('function')
      expect(typeof easing.easeInElastic).toBe('function')
      expect(typeof easing.easeOutElastic).toBe('function')
      expect(typeof easing.easeInBounce).toBe('function')
      expect(typeof easing.easeOutBounce).toBe('function')
    })

    it('should return correct values for linear easing', () => {
      expect(easing.linear(0)).toBe(0)
      expect(easing.linear(0.5)).toBe(0.5)
      expect(easing.linear(1)).toBe(1)
    })

    it('should handle edge cases for elastic functions', () => {
      expect(easing.easeInElastic(0)).toBe(0)
      expect(easing.easeInElastic(1)).toBe(1)
      expect(easing.easeOutElastic(0)).toBe(0)
      expect(easing.easeOutElastic(1)).toBe(1)
    })
  })

  describe('Color System', () => {
    it('should have initial color theme', () => {
      expect(colorTheme.primary).toBe('#FFD700')
      expect(colorTheme.secondary).toBe('#FF6347')
      expect(colorTheme.accent).toBe('#00FF88')
      expect(colorTheme.warning).toBe('#FF4444')
    })

    it('should update color theme based on game state', () => {
      const initialHue = colorTheme.hue
      updateColorTheme(5, 500, 100) // combo: 5, score: 500, frameCount: 100
      
      // Hue should change based on combo
      expect(colorTheme.hue).not.toBe(initialHue)
      
      // Colors should be HSL strings
      expect(colorTheme.primary).toMatch(/^hsl\(/)
      expect(colorTheme.secondary).toMatch(/^hsl\(/)
      expect(colorTheme.accent).toMatch(/^hsl\(/)
      expect(colorTheme.warning).toMatch(/^hsl\(/)
    })
  })

  describe('Math Utilities', () => {
    it('should clamp values correctly', () => {
      expect(clamp(5, 0, 10)).toBe(5)
      expect(clamp(-5, 0, 10)).toBe(0)
      expect(clamp(15, 0, 10)).toBe(10)
    })

    it('should interpolate linearly', () => {
      expect(lerp(0, 10, 0)).toBe(0)
      expect(lerp(0, 10, 0.5)).toBe(5)
      expect(lerp(0, 10, 1)).toBe(10)
    })

    it('should generate random numbers in range', () => {
      for (let i = 0; i < 10; i++) {
        const val = random.between(5, 15)
        expect(val).toBeGreaterThanOrEqual(5)
        expect(val).toBeLessThanOrEqual(15)
      }
    })

    it('should detect point-rectangle collision', () => {
      expect(collision.pointRect(5, 5, 0, 0, 10, 10)).toBe(true)
      expect(collision.pointRect(15, 15, 0, 0, 10, 10)).toBe(false)
    })

    it('should detect point-circle collision', () => {
      expect(collision.pointCircle(5, 5, 0, 0, 10)).toBe(true)
      expect(collision.pointCircle(15, 15, 0, 0, 10)).toBe(false)
    })
  })
})