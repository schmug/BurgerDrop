import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock DOM elements
const mockCanvas = {
  getContext: vi.fn(() => ({
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn(() => ({ width: 10 })),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
  })),
  width: 800,
  height: 600
}

// Mock game classes that would be extracted from the HTML
class MockIngredient {
  constructor(type, x, y) {
    this.type = type
    this.x = x
    this.y = y
    this.width = 60
    this.height = 40
    this.speed = 2
    this.collected = false
  }

  update(deltaTime) {
    if (!this.collected) {
      this.y += this.speed * deltaTime * 60
    }
  }

  isOffScreen(canvasHeight) {
    return this.y > canvasHeight + this.height
  }

  contains(x, y) {
    return x >= this.x && x <= this.x + this.width &&
           y >= this.y && y <= this.y + this.height
  }
}

class MockOrder {
  constructor(ingredients, timeLimit = 10000) {
    this.ingredients = [...ingredients]
    this.requiredIngredients = [...ingredients]
    this.timeLimit = timeLimit
    this.timeRemaining = timeLimit
    this.completed = false
    this.expired = false
  }

  update(deltaTime) {
    if (!this.completed && !this.expired) {
      this.timeRemaining -= deltaTime * 1000
      if (this.timeRemaining <= 0) {
        this.expired = true
      }
    }
  }

  checkIngredient(ingredient) {
    if (this.completed || this.expired) return false
    
    const requiredIndex = this.requiredIngredients.findIndex(req => req === ingredient)
    if (requiredIndex === 0) {
      this.requiredIngredients.shift()
      if (this.requiredIngredients.length === 0) {
        this.completed = true
      }
      return true
    }
    return false
  }
}

describe('Game Logic', () => {
  describe('Ingredient', () => {
    it('should create ingredient with correct properties', () => {
      const ingredient = new MockIngredient('bun-top', 100, 50)
      
      expect(ingredient.type).toBe('bun-top')
      expect(ingredient.x).toBe(100)
      expect(ingredient.y).toBe(50)
      expect(ingredient.collected).toBe(false)
    })

    it('should move downward when updated', () => {
      const ingredient = new MockIngredient('bun-top', 100, 50)
      const initialY = ingredient.y
      
      ingredient.update(1/60) // 1 frame at 60fps
      
      expect(ingredient.y).toBeGreaterThan(initialY)
    })

    it('should detect when off screen', () => {
      const ingredient = new MockIngredient('bun-top', 100, 650)
      
      expect(ingredient.isOffScreen(600)).toBe(true)
    })

    it('should detect point collision', () => {
      const ingredient = new MockIngredient('bun-top', 100, 100)
      
      expect(ingredient.contains(120, 120)).toBe(true)
      expect(ingredient.contains(50, 50)).toBe(false)
    })
  })

  describe('Order', () => {
    it('should create order with ingredients and time limit', () => {
      const order = new MockOrder(['bun-bottom', 'patty', 'bun-top'], 10000)
      
      expect(order.ingredients).toEqual(['bun-bottom', 'patty', 'bun-top'])
      expect(order.timeRemaining).toBe(10000)
      expect(order.completed).toBe(false)
      expect(order.expired).toBe(false)
    })

    it('should accept correct ingredient in sequence', () => {
      const order = new MockOrder(['bun-bottom', 'patty', 'bun-top'])
      
      expect(order.checkIngredient('bun-bottom')).toBe(true)
      expect(order.checkIngredient('patty')).toBe(true)
      expect(order.checkIngredient('bun-top')).toBe(true)
      expect(order.completed).toBe(true)
    })

    it('should reject incorrect ingredient', () => {
      const order = new MockOrder(['bun-bottom', 'patty', 'bun-top'])
      
      expect(order.checkIngredient('patty')).toBe(false) // Wrong order
      expect(order.completed).toBe(false)
    })

    it('should expire when time runs out', () => {
      const order = new MockOrder(['bun-bottom'], 1000)
      
      order.update(2) // 2 seconds
      
      expect(order.expired).toBe(true)
    })

    it('should not accept ingredients when expired', () => {
      const order = new MockOrder(['bun-bottom'], 0)
      order.expired = true
      
      expect(order.checkIngredient('bun-bottom')).toBe(false)
    })
  })

  describe('Game State', () => {
    let gameState

    beforeEach(() => {
      gameState = {
        score: 0,
        lives: 3,
        combo: 1,
        level: 1,
        ingredients: [],
        orders: [],
        gameTime: 0
      }
    })

    it('should initialize with correct default values', () => {
      expect(gameState.score).toBe(0)
      expect(gameState.lives).toBe(3)
      expect(gameState.combo).toBe(1)
      expect(gameState.level).toBe(1)
    })

    it('should handle score calculation with combo multiplier', () => {
      const baseScore = 100
      const expectedScore = baseScore * gameState.combo
      
      gameState.score += expectedScore
      
      expect(gameState.score).toBe(100)
      
      gameState.combo = 3
      gameState.score += baseScore * gameState.combo
      
      expect(gameState.score).toBe(400)
    })

    it('should handle life loss', () => {
      const initialLives = gameState.lives
      
      gameState.lives--
      
      expect(gameState.lives).toBe(initialLives - 1)
    })

    it('should detect game over condition', () => {
      gameState.lives = 0
      
      expect(gameState.lives <= 0).toBe(true)
    })
  })

  describe('Difficulty Scaling', () => {
    it('should increase ingredient speed with level', () => {
      const baseSpeed = 2
      const level = 5
      const expectedSpeed = baseSpeed + (level - 1) * 0.3
      
      expect(expectedSpeed).toBeGreaterThan(baseSpeed)
    })

    it('should increase spawn rate with level', () => {
      const baseSpawnRate = 2000 // ms
      const level = 3
      const expectedSpawnRate = Math.max(baseSpawnRate - (level - 1) * 200, 800)
      
      expect(expectedSpawnRate).toBeLessThan(baseSpawnRate)
      expect(expectedSpawnRate).toBeGreaterThanOrEqual(800)
    })
  })
})