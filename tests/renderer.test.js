import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import Renderer from '../src/game/systems/Renderer.js'

describe('Renderer System', () => {
  let canvas, ctx, renderer
  
  beforeEach(() => {
    // Create mock canvas context
    ctx = {
      canvas: { width: 800, height: 600 },
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      globalAlpha: 1,
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      font: '',
      textAlign: '',
      textBaseline: '',
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      strokeRect: vi.fn(),
      fillText: vi.fn(),
      strokeText: vi.fn(),
      measureText: vi.fn(() => ({ width: 100 })),
      beginPath: vi.fn(),
      closePath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      createLinearGradient: vi.fn(() => ({
        addColorStop: vi.fn()
      })),
      createRadialGradient: vi.fn(() => ({
        addColorStop: vi.fn()
      })),
      createPattern: vi.fn(() => ({})),
      getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
      putImageData: vi.fn()
    }
    
    // Create mock canvas
    canvas = {
      width: 800,
      height: 600,
      getContext: vi.fn(() => ctx)
    }
    
    renderer = new Renderer(canvas)
  })
  
  afterEach(() => {
    if (renderer) {
      renderer.destroy()
    }
    vi.clearAllMocks()
  })
  
  describe('Initialization', () => {
    it('should initialize with canvas and context', () => {
      expect(renderer.canvas).toBe(canvas)
      expect(renderer.ctx).toBe(ctx)
      expect(renderer.width).toBe(800)
      expect(renderer.height).toBe(600)
    })
    
    it('should initialize screen effects', () => {
      expect(renderer.screenShake).toEqual({
        intensity: 0,
        duration: 0,
        time: 0
      })
      expect(renderer.screenFlash).toEqual({
        intensity: 0,
        duration: 0,
        time: 0,
        color: '#FFFFFF'
      })
    })
    
    it('should initialize patterns', () => {
      expect(ctx.createPattern).toHaveBeenCalled()
      expect(renderer.patterns).toBeDefined()
    })
  })
  
  describe('Basic Drawing Operations', () => {
    it('should clear the canvas', () => {
      renderer.clear()
      expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 800, 600)
    })
    
    it('should draw gradient background', () => {
      const colors = { primary: '#FF0000', secondary: '#00FF00' }
      renderer.drawGradientBackground(colors)
      
      expect(ctx.createLinearGradient).toHaveBeenCalled()
      expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 800, 600)
    })
    
    it('should draw background pattern', () => {
      renderer.drawBackground()
      
      // Just verify fillRect was called, as background may have multiple layers
      expect(ctx.fillRect).toHaveBeenCalled()
      expect(ctx.fillRect.mock.calls.length).toBeGreaterThan(0)
    })
  })
  
  describe('Entity Drawing', () => {
    it('should draw ingredient', () => {
      const ingredient = {
        x: 100,
        y: 100,
        data: {
          emoji: '🍔',
          size: 40
        },
        rotation: 0,
        scale: 1,
        collected: false
      }
      
      renderer.drawIngredient(ingredient)
      
      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.translate).toHaveBeenCalledWith(100, 100)
      expect(ctx.fillText).toHaveBeenCalledWith('🍔', 0, 0)
      expect(ctx.restore).toHaveBeenCalled()
    })
    
    it('should draw collected ingredient with transparency', () => {
      const ingredient = {
        x: 100,
        y: 100,
        data: {
          emoji: '🍔',
          size: 40
        },
        rotation: 0,
        scale: 1,
        collected: true
      }
      
      renderer.drawIngredient(ingredient)
      
      expect(ctx.globalAlpha).toBeLessThan(1)
    })
    
    it('should draw power-up', () => {
      const powerUp = {
        x: 200,
        y: 200,
        size: 50,
        data: {
          emoji: '⚡',
          color: '#FFD700',
          name: 'Speed Boost'
        },
        pulsePhase: 0
      }
      
      renderer.drawPowerUp(powerUp, 60)
      
      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.translate).toHaveBeenCalledWith(200, 200)
      expect(ctx.arc).toHaveBeenCalled()
      expect(ctx.fillText).toHaveBeenCalledWith('⚡', 0, 0)
      expect(ctx.restore).toHaveBeenCalled()
    })
    
    it('should draw particle', () => {
      const particle = {
        x: 150,
        y: 150,
        color: '#FF0000',
        size: 5,
        text: '✨',
        life: 0.5,
        type: 'celebration'
      }
      
      renderer.drawParticle(particle)
      
      expect(ctx.save).toHaveBeenCalled()
      expect(ctx.globalAlpha).toBe(0.5)
      expect(ctx.fillText).toHaveBeenCalled()
      expect(ctx.restore).toHaveBeenCalled()
    })
    
    it('should draw order', () => {
      const order = {
        x: 50,
        y: 50,
        width: 150,
        height: 200,
        timeLeft: 15000,
        maxTime: 30000,
        template: {
          name: 'Classic Burger'
        },
        ingredients: ['bun', 'patty', 'cheese'],
        currentIndex: 1,
        draw: vi.fn()
      }
      
      renderer.drawOrder(order, 0, 60)
      
      expect(order.draw).toHaveBeenCalledWith(ctx, 0, 60)
    })
  })
  
  describe('Screen Effects', () => {
    it('should apply screen shake', () => {
      renderer.screenShake = {
        intensity: 10,
        duration: 500,
        time: 250
      }
      
      renderer.applyScreenShake(16)
      
      expect(ctx.translate).toHaveBeenCalled()
      expect(renderer.screenShake.time).toBe(266)
    })
    
    it('should stop screen shake when duration expires', () => {
      renderer.screenShake = {
        intensity: 10,
        duration: 500,
        time: 500
      }
      
      renderer.applyScreenShake(16)
      
      expect(renderer.screenShake.intensity).toBe(0)
    })
    
    it('should apply screen flash', () => {
      renderer.screenFlash = {
        intensity: 1,
        duration: 200,
        time: 100,
        color: '#FFFFFF'
      }
      
      renderer.applyScreenFlash(16)
      
      expect(renderer.screenFlash.time).toBe(116)
      expect(renderer.screenFlash.intensity).toBeLessThan(1)
    })
    
    it('should draw screen effects', () => {
      renderer.screenFlash.intensity = 0.5
      renderer.screenFlash.color = '#FF0000'
      
      renderer.drawScreenEffects()
      
      expect(ctx.fillStyle).toBe('#FF0000')
      expect(ctx.globalAlpha).toBe(0.5)
      expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 800, 600)
    })
    
    it('should trigger screen shake', () => {
      renderer.triggerScreenShake(15, 300)
      
      expect(renderer.screenShake.intensity).toBe(15)
      expect(renderer.screenShake.duration).toBe(300)
      expect(renderer.screenShake.time).toBe(0)
    })
    
    it('should trigger screen flash', () => {
      renderer.triggerScreenFlash(0.8, 100, '#00FF00')
      
      expect(renderer.screenFlash.intensity).toBe(0.8)
      expect(renderer.screenFlash.duration).toBe(100)
      expect(renderer.screenFlash.color).toBe('#00FF00')
      expect(renderer.screenFlash.time).toBe(0)
    })
  })
  
  describe('Text Rendering', () => {
    it('should show floating text', () => {
      const mockParticles = []
      renderer.showFloatingText(100, 100, '+100', '#FFD700', mockParticles)
      
      expect(mockParticles).toHaveLength(1)
      expect(mockParticles[0]).toMatchObject({
        x: 100,
        y: 100,
        text: '+100',
        color: '#FFD700'
      })
    })
    
    it('should draw centered text', () => {
      renderer.drawText('Test Text', 400, 300, {
        font: '20px Arial',
        color: '#000000',
        align: 'center',
        baseline: 'middle'
      })
      
      expect(ctx.font).toBe('20px Arial')
      expect(ctx.fillStyle).toBe('#000000')
      expect(ctx.textAlign).toBe('center')
      expect(ctx.textBaseline).toBe('middle')
      expect(ctx.fillText).toHaveBeenCalledWith('Test Text', 400, 300)
    })
    
    it('should draw text with shadow', () => {
      renderer.drawText('Shadow Text', 100, 100, {
        shadow: true,
        shadowColor: '#000000',
        shadowBlur: 5
      })
      
      expect(ctx.shadowColor).toBe('#000000')
      expect(ctx.shadowBlur).toBe(5)
      expect(ctx.fillText).toHaveBeenCalled()
    })
  })
  
  describe('Utility Methods', () => {
    it('should update screen effects', () => {
      renderer.screenShake = { intensity: 10, duration: 500, time: 0 }
      renderer.screenFlash = { intensity: 1, duration: 200, time: 0 }
      
      renderer.updateScreenEffects(16)
      
      expect(renderer.screenShake.time).toBe(16)
      expect(renderer.screenFlash.time).toBe(16)
    })
    
    it('should resize canvas', () => {
      renderer.resize(1024, 768)
      
      expect(renderer.width).toBe(1024)
      expect(renderer.height).toBe(768)
      expect(canvas.width).toBe(1024)
      expect(canvas.height).toBe(768)
    })
    
    it('should update color theme', () => {
      const colors = {
        primary: '#FF0000',
        secondary: '#00FF00',
        accent: '#0000FF'
      }
      
      renderer.updateColorTheme(colors)
      
      expect(renderer.colorTheme).toEqual(colors)
    })
  })
  
  describe('Complex Drawing', () => {
    it('should draw trail effect', () => {
      const trail = [
        { x: 100, y: 100, alpha: 1 },
        { x: 110, y: 110, alpha: 0.8 },
        { x: 120, y: 120, alpha: 0.6 }
      ]
      
      renderer.drawTrail(trail, '#FF0000')
      
      expect(ctx.beginPath).toHaveBeenCalled()
      expect(ctx.moveTo).toHaveBeenCalled()
      expect(ctx.lineTo).toHaveBeenCalledTimes(2)
      expect(ctx.stroke).toHaveBeenCalled()
    })
    
    it('should draw particle explosion', () => {
      const particles = []
      for (let i = 0; i < 10; i++) {
        particles.push({
          x: 200 + Math.random() * 50,
          y: 200 + Math.random() * 50,
          color: '#FF0000',
          size: 3,
          life: Math.random()
        })
      }
      
      particles.forEach(p => renderer.drawParticle(p))
      
      expect(ctx.save).toHaveBeenCalledTimes(10)
      expect(ctx.restore).toHaveBeenCalledTimes(10)
      expect(ctx.arc).toHaveBeenCalledTimes(10)
    })
  })
  
  describe('Error Handling', () => {
    it('should handle missing entity data gracefully', () => {
      const ingredient = {
        x: 100,
        y: 100
        // Missing data property
      }
      
      expect(() => {
        renderer.drawIngredient(ingredient)
      }).not.toThrow()
    })
    
    it('should handle invalid color values', () => {
      expect(() => {
        renderer.drawGradientBackground({
          primary: 'invalid',
          secondary: null
        })
      }).not.toThrow()
    })
  })
  
  describe('Cleanup', () => {
    it('should clean up resources on destroy', () => {
      renderer.patterns = {
        grid: {},
        dots: {}
      }
      
      renderer.destroy()
      
      expect(renderer.patterns).toBeNull()
      expect(renderer.ctx).toBeNull()
      expect(renderer.canvas).toBeNull()
    })
  })
})