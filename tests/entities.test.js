import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Particle } from '../src/game/entities/Particle.js'
import { PowerUp, powerUpTypes } from '../src/game/entities/PowerUp.js'
import { Ingredient, ingredientTypes } from '../src/game/entities/Ingredient.js'
import { Order, orderTemplates } from '../src/game/entities/Order.js'

// Mock canvas context
const mockCtx = {
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  scale: vi.fn(),
  fillRect: vi.fn(),
  strokeRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  fillText: vi.fn(),
  strokeText: vi.fn(),
  createLinearGradient: vi.fn(() => ({
    addColorStop: vi.fn()
  })),
  createRadialGradient: vi.fn(() => ({
    addColorStop: vi.fn()
  }))
}

describe('Entity Classes', () => {
  describe('Particle', () => {
    it('should create particle with correct properties', () => {
      const particle = new Particle(100, 50, '#FF0000', '✨', 'celebration')
      
      expect(particle.x).toBe(100)
      expect(particle.y).toBe(50)
      expect(particle.color).toBe('#FF0000')
      expect(particle.text).toBe('✨')
      expect(particle.type).toBe('celebration')
      expect(particle.life).toBe(1)
    })

    it('should update position and physics', () => {
      const particle = new Particle(100, 50, '#FF0000')
      const initialX = particle.x
      const initialY = particle.y
      
      particle.update(60) // Frame 60
      
      expect(particle.x).not.toBe(initialX)
      expect(particle.y).not.toBe(initialY)
      // Particle life decreases based on duration, need multiple updates to see change
      particle.update(120)
      expect(particle.life).toBeLessThan(1)
    })

    it('should check if particle is alive', () => {
      const particle = new Particle(100, 50, '#FF0000')
      
      expect(particle.isAlive()).toBe(true)
      
      particle.life = 0.005
      expect(particle.isAlive()).toBe(false)
    })

    it('should create celebration particles with correct settings', () => {
      const particle = Particle.createCelebration(100, 50, '#FFD700', '🎉')
      
      expect(particle.type).toBe('celebration')
      expect(particle.text).toBe('🎉')
      expect(particle.color).toBe('#FFD700')
    })

    it('should create explosion particles', () => {
      const particles = Particle.createExplosion(100, 50, '#FF0000', 5, 'star')
      
      expect(particles).toHaveLength(5)
      particles.forEach(particle => {
        expect(particle.type).toBe('star')
        expect(particle.color).toBe('#FF0000')
      })
    })

    it('should create floating text particles', () => {
      const particle = Particle.createFloatingText(100, 50, '+100', '#FFD700')
      
      expect(particle.text).toBe('+100')
      expect(particle.color).toBe('#FFD700')
    })

    it('should draw without errors', () => {
      const particle = new Particle(100, 50, '#FF0000', '✨')
      
      expect(() => {
        particle.draw(mockCtx)
      }).not.toThrow()
      
      expect(mockCtx.save).toHaveBeenCalled()
      expect(mockCtx.restore).toHaveBeenCalled()
    })
  })

  describe('PowerUp', () => {
    it('should create power-up with valid type', () => {
      const powerUp = new PowerUp('speedBoost')
      
      expect(powerUp.type).toBe('speedBoost')
      expect(powerUp.data).toBe(powerUpTypes.speedBoost)
      expect(powerUp.size).toBe(40)
      expect(powerUp.collected).toBe(false)
    })

    it('should throw error for invalid type', () => {
      expect(() => {
        new PowerUp('invalidType')
      }).toThrow('Unknown power-up type: invalidType')
    })

    it('should update position', () => {
      const powerUp = new PowerUp('timeFreeze', { y: 100 })
      const initialY = powerUp.y
      
      powerUp.update(1/60) // One frame
      
      expect(powerUp.y).toBeGreaterThan(initialY)
    })

    it('should detect clicks correctly', () => {
      const powerUp = new PowerUp('scoreMultiplier', { x: 100, y: 100 })
      const center = powerUp.getCenter()
      
      expect(powerUp.isClicked(center.x, center.y)).toBe(true)
      expect(powerUp.isClicked(center.x + 50, center.y + 50)).toBe(false)
    })

    it('should check if off screen', () => {
      const powerUp = new PowerUp('speedBoost', { 
        y: 700, 
        canvasHeight: 600 
      })
      
      expect(powerUp.isOffScreen()).toBe(true)
    })

    it('should handle collection state', () => {
      const powerUp = new PowerUp('timeFreeze')
      
      expect(powerUp.isCollected()).toBe(false)
      
      powerUp.collect()
      expect(powerUp.isCollected()).toBe(true)
    })

    it('should create random power-ups', () => {
      const powerUp = PowerUp.createRandom()
      
      expect(PowerUp.isValidType(powerUp.type)).toBe(true)
    })

    it('should validate types correctly', () => {
      expect(PowerUp.isValidType('speedBoost')).toBe(true)
      expect(PowerUp.isValidType('timeFreeze')).toBe(true)
      expect(PowerUp.isValidType('scoreMultiplier')).toBe(true)
      expect(PowerUp.isValidType('invalidType')).toBe(false)
    })

    it('should draw without errors', () => {
      const powerUp = new PowerUp('speedBoost')
      
      expect(() => {
        powerUp.draw(mockCtx)
      }).not.toThrow()
      
      expect(mockCtx.save).toHaveBeenCalled()
      expect(mockCtx.restore).toHaveBeenCalled()
    })
  })

  describe('Ingredient', () => {
    it('should create ingredient with valid type', () => {
      const ingredient = new Ingredient('patty')
      
      expect(ingredient.type).toBe('patty')
      expect(ingredient.data).toBe(ingredientTypes.patty)
      expect(ingredient.collected).toBe(false)
      expect(ingredient.trail).toEqual([])
    })

    it('should throw error for invalid type', () => {
      expect(() => {
        new Ingredient('invalidType')
      }).toThrow('Unknown ingredient type: invalidType')
    })

    it('should update position and trail', () => {
      const ingredient = new Ingredient('cheese', { y: 100 })
      const initialY = ingredient.y
      
      ingredient.update(60, null) // Frame 60, no game state
      
      expect(ingredient.y).toBeGreaterThan(initialY)
    })

    it('should detect clicks correctly', () => {
      const ingredient = new Ingredient('lettuce', { x: 100, y: 100 })
      
      expect(ingredient.isClicked(110, 110)).toBe(true)
      expect(ingredient.isClicked(200, 200)).toBe(false)
    })

    it('should check if off screen', () => {
      const ingredient = new Ingredient('tomato', { 
        y: 700, 
        canvasHeight: 600 
      })
      
      expect(ingredient.isOffScreen()).toBe(true)
    })

    it('should handle collection state', () => {
      const ingredient = new Ingredient('onion')
      
      expect(ingredient.isCollected()).toBe(false)
      
      ingredient.collect()
      expect(ingredient.isCollected()).toBe(true)
    })

    it('should create random ingredients', () => {
      const ingredient = Ingredient.createRandom()
      
      expect(Ingredient.isValidType(ingredient.type)).toBe(true)
    })

    it('should validate types correctly', () => {
      expect(Ingredient.isValidType('patty')).toBe(true)
      expect(Ingredient.isValidType('cheese')).toBe(true)
      expect(Ingredient.isValidType('invalidType')).toBe(false)
    })

    it('should draw without errors', () => {
      const ingredient = new Ingredient('bacon')
      
      expect(() => {
        ingredient.draw(mockCtx, 60, { accent: '#00FF88' })
      }).not.toThrow()
      
      expect(mockCtx.save).toHaveBeenCalled()
      expect(mockCtx.restore).toHaveBeenCalled()
    })

    it('should update trail correctly', () => {
      const ingredient = new Ingredient('egg', { trailUpdateInterval: 1 })
      
      // Update several times to build trail
      for (let i = 0; i < 5; i++) {
        ingredient.update(i)
      }
      
      expect(ingredient.trail.length).toBeGreaterThan(0)
    })
  })

  describe('Order', () => {
    const mockTemplate = {
      name: 'Test Burger',
      ingredients: ['bun_bottom', 'patty', 'cheese', 'bun_top'],
      time: 30
    }

    it('should create order with valid template', () => {
      const order = new Order(mockTemplate)
      
      expect(order.template).toBe(mockTemplate)
      expect(order.ingredients).toEqual(mockTemplate.ingredients)
      expect(order.currentIndex).toBe(0)
      expect(order.completed).toBe(false)
      expect(order.expired).toBe(false)
    })

    it('should throw error for missing template', () => {
      expect(() => {
        new Order(null)
      }).toThrow('Order template is required')
    })

    it('should update timer correctly', () => {
      const order = new Order(mockTemplate)
      const initialTime = order.timeLeft
      
      order.update(1) // 1 second
      
      expect(order.timeLeft).toBeLessThan(initialTime)
    })

    it('should respect time freeze power-up', () => {
      const order = new Order(mockTemplate)
      const initialTime = order.timeLeft
      
      const mockGameState = {
        isPowerUpActive: vi.fn(() => true)
      }
      
      order.update(1, mockGameState) // 1 second with time freeze
      
      expect(order.timeLeft).toBe(initialTime)
      expect(mockGameState.isPowerUpActive).toHaveBeenCalledWith('timeFreeze')
    })

    it('should expire when time runs out', () => {
      const order = new Order(mockTemplate)
      order.timeLeft = 500 // 0.5 seconds
      
      const result = order.update(1) // 1 second
      
      expect(result).toBe(false)
      expect(order.isExpired()).toBe(true)
    })

    it('should check ingredients correctly', () => {
      const order = new Order(mockTemplate)
      
      expect(order.checkIngredient('bun_bottom')).toBe('correct')
      expect(order.getCurrentIngredient()).toBe('patty')
      
      expect(order.checkIngredient('cheese')).toBe('wrong') // Wrong order
      expect(order.checkIngredient('patty')).toBe('correct')
      expect(order.checkIngredient('cheese')).toBe('correct')
      expect(order.checkIngredient('bun_top')).toBe('completed')
      
      expect(order.isCompleted()).toBe(true)
    })

    it('should track progress correctly', () => {
      const order = new Order(mockTemplate)
      
      expect(order.getProgress()).toBe(0)
      
      order.checkIngredient('bun_bottom')
      expect(order.getProgress()).toBe(0.25)
      
      order.checkIngredient('patty')
      expect(order.getProgress()).toBe(0.5)
    })

    it('should detect expiring soon', () => {
      const order = new Order(mockTemplate)
      
      expect(order.isExpiringSoon()).toBe(false)
      
      order.timeLeft = 5000 // 5 seconds
      expect(order.isExpiringSoon()).toBe(true)
    })

    it('should reset correctly', () => {
      const order = new Order(mockTemplate)
      order.checkIngredient('bun_bottom')
      order.timeLeft = 10000
      
      order.reset()
      
      expect(order.currentIndex).toBe(0)
      expect(order.timeLeft).toBe(mockTemplate.time * 1000)
      expect(order.completed).toBe(false)
      expect(order.expired).toBe(false)
    })

    it('should create random orders', () => {
      const order = Order.createRandom()
      
      expect(orderTemplates).toContainEqual(order.template)
    })

    it('should validate templates correctly', () => {
      expect(Order.isValidTemplate(mockTemplate)).toBe(true)
      expect(Order.isValidTemplate(null)).toBe(false)
      expect(Order.isValidTemplate(undefined)).toBe(false)
      expect(Order.isValidTemplate({})).toBe(false)
      expect(Order.isValidTemplate({ 
        name: 'Test', 
        ingredients: [], 
        time: 30 
      })).toBe(false) // Empty ingredients
    })

    it('should get template by name', () => {
      const template = Order.getTemplateByName('Classic Burger')
      
      expect(template).toBeTruthy()
      expect(template.name).toBe('Classic Burger')
      
      expect(Order.getTemplateByName('Non-existent')).toBeNull()
    })

    it('should draw without errors', () => {
      const order = new Order(mockTemplate)
      
      expect(() => {
        order.draw(mockCtx, 0, 60)
      }).not.toThrow()
      
      expect(mockCtx.save).toHaveBeenCalled()
      expect(mockCtx.restore).toHaveBeenCalled()
    })
  })

  describe('Entity Type Configurations', () => {
    it('should have valid power-up types', () => {
      expect(powerUpTypes.speedBoost).toBeDefined()
      expect(powerUpTypes.timeFreeze).toBeDefined()
      expect(powerUpTypes.scoreMultiplier).toBeDefined()
      
      Object.values(powerUpTypes).forEach(type => {
        expect(type.emoji).toBeDefined()
        expect(type.name).toBeDefined()
        expect(type.color).toBeDefined()
        expect(type.duration).toBeGreaterThan(0)
        expect(type.description).toBeDefined()
      })
    })

    it('should have valid ingredient types', () => {
      expect(Object.keys(ingredientTypes).length).toBeGreaterThan(0)
      
      Object.values(ingredientTypes).forEach(type => {
        expect(type.emoji).toBeDefined()
        expect(type.name).toBeDefined()
        expect(type.size).toBeGreaterThan(0)
        expect(type.color).toBeDefined()
      })
    })

    it('should have valid order templates', () => {
      expect(orderTemplates.length).toBeGreaterThan(0)
      
      orderTemplates.forEach(template => {
        expect(Order.isValidTemplate(template)).toBe(true)
      })
    })
  })
})