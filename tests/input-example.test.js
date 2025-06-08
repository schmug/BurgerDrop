import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setupGameInput } from '../src/game/systems/InputExample.js'
import { InputSystem } from '../src/game/systems/Input.js'

// Mock InputSystem
vi.mock('../src/game/systems/Input.js', () => {
  const mockInputSystemInstance = {
    onClick: vi.fn((handler) => {
      mockInputSystemInstance._clickHandler = handler
      return vi.fn()
    }),
    onMove: vi.fn((handler) => vi.fn()),
    onResize: vi.fn((handler) => vi.fn()),
    destroy: vi.fn()
  }
  
  return {
    InputSystem: vi.fn(() => mockInputSystemInstance)
  }
})

describe('InputExample - setupGameInput', () => {
  let canvas, gameState
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Create mock canvas
    canvas = {
      width: 800,
      height: 600,
      getBoundingClientRect: vi.fn(() => ({
        left: 100,
        top: 50,
        width: 800,
        height: 600
      }))
    }
    
    // Create mock game state
    gameState = {
      gameRunning: true,
      powerUps: [],
      ingredients: [],
      orders: [],
      playPowerUpCollect: vi.fn(),
      playSound: vi.fn(),
      playOrderComplete: vi.fn(),
      activatePowerUp: vi.fn(),
      createFloatingText: vi.fn(),
      createParticles: vi.fn(),
      incrementCombo: vi.fn(),
      resetCombo: vi.fn(),
      addScore: vi.fn()
    }

    // Attach canvas to game state for helper functions
    gameState.canvas = canvas
  })
  
  describe('Setup', () => {
    it('should create InputSystem with correct options', () => {
      setupGameInput(canvas, gameState)
      
      expect(InputSystem).toHaveBeenCalledWith(canvas, {
        preventScroll: true,
        debug: false
      })
    })
    
    it('should register click handler', () => {
      const result = setupGameInput(canvas, gameState)
      
      expect(result.onClick).toHaveBeenCalled()
    })
  })
  
  describe('Power-up Collection', () => {
    it('should handle power-up clicks', () => {
      const result = setupGameInput(canvas, gameState)
      
      // Get the click handler
      const clickHandler = result._clickHandler
      
      // Add a mock power-up
      const powerUp = {
        x: 200,
        y: 200,
        type: 'speedBoost',
        collected: false,
        data: {
          name: 'Speed Boost',
          color: '#FFD700'
        },
        isClicked: vi.fn(() => true)
      }
      gameState.powerUps = [powerUp]
      
      // Simulate click
      const clickResult = clickHandler(200, 200, 'mouse')
      
      expect(powerUp.isClicked).toHaveBeenCalledWith(200, 200)
      expect(gameState.playPowerUpCollect).toHaveBeenCalled()
      expect(gameState.activatePowerUp).toHaveBeenCalledWith('speedBoost')
      expect(gameState.createFloatingText).toHaveBeenCalledWith(
        300, // x + rect.left
        250, // y + rect.top
        'Speed Boost!',
        '#FFD700'
      )
      expect(clickResult).toBe(true) // Should stop propagation
      expect(gameState.powerUps.length).toBe(0) // Power-up removed
    })
    
    it('should skip collected power-ups', () => {
      const result = setupGameInput(canvas, gameState)
      const clickHandler = result._clickHandler
      
      const powerUp = {
        collected: true,
        isClicked: vi.fn(() => true)
      }
      gameState.powerUps = [powerUp]
      
      clickHandler(200, 200, 'mouse')
      
      expect(gameState.playPowerUpCollect).not.toHaveBeenCalled()
    })
  })
  
  describe('Ingredient Collection', () => {
    it('should handle correct ingredient clicks', () => {
      const result = setupGameInput(canvas, gameState)
      const clickHandler = result._clickHandler
      
      // Add mock order and ingredient
      const order = {
        checkIngredient: vi.fn(() => 'correct'),
        currentIndex: 0
      }
      gameState.orders = [order]
      
      const ingredient = {
        x: 300,
        y: 300,
        type: 'patty',
        collected: false,
        data: { size: 40 },
        isClicked: vi.fn(() => true)
      }
      gameState.ingredients = [ingredient]
      
      // Simulate click
      const clickResult = clickHandler(300, 300, 'mouse')
      
      expect(ingredient.isClicked).toHaveBeenCalledWith(300, 300)
      expect(order.checkIngredient).toHaveBeenCalledWith('patty')
      expect(gameState.playSound).toHaveBeenCalledWith('collect')
      expect(gameState.incrementCombo).toHaveBeenCalled()
      expect(gameState.addScore).toHaveBeenCalled()
      expect(clickResult).toBe(true)
      expect(gameState.ingredients.length).toBe(0)
    })
    
    it('should handle wrong ingredient clicks', () => {
      const result = setupGameInput(canvas, gameState)
      const clickHandler = result._clickHandler
      
      const order = {
        checkIngredient: vi.fn(() => 'wrong')
      }
      gameState.orders = [order]
      
      const ingredient = {
        type: 'cheese',
        collected: false,
        isClicked: vi.fn(() => true)
      }
      gameState.ingredients = [ingredient]
      
      clickHandler(300, 300, 'mouse')
      
      expect(gameState.playSound).toHaveBeenCalledWith('wrong')
      expect(gameState.resetCombo).toHaveBeenCalled()
      expect(gameState.ingredients.length).toBe(0)
    })
    
    it('should handle order completion', () => {
      const result = setupGameInput(canvas, gameState)
      const clickHandler = result._clickHandler
      
      const order = {
        checkIngredient: vi.fn(() => 'completed'),
        template: { name: 'Test Burger' }
      }
      gameState.orders = [order]
      
      const ingredient = {
        type: 'bun_top',
        collected: false,
        isClicked: vi.fn(() => true)
      }
      gameState.ingredients = [ingredient]
      
      clickHandler(300, 300, 'mouse')
      
      expect(gameState.playOrderComplete).toHaveBeenCalled()
      expect(gameState.createFloatingText).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        'Test Burger Complete!',
        '#4ECDC4'
      )
    })
  })
  
  describe('Game State Handling', () => {
    it('should ignore clicks when game not running', () => {
      gameState.gameRunning = false
      const result = setupGameInput(canvas, gameState)
      const clickHandler = result._clickHandler
      
      const powerUp = {
        isClicked: vi.fn(() => true)
      }
      gameState.powerUps = [powerUp]
      
      const clickResult = clickHandler(200, 200, 'mouse')
      
      expect(clickResult).toBe(false)
      expect(powerUp.isClicked).not.toHaveBeenCalled()
    })
  })
  
  describe('Click Priority', () => {
    it('should prioritize power-ups over ingredients', () => {
      const result = setupGameInput(canvas, gameState)
      const clickHandler = result._clickHandler
      
      // Add overlapping power-up and ingredient
      const powerUp = {
        type: 'speedBoost',
        collected: false,
        data: { name: 'Speed', color: '#FFD700' },
        isClicked: vi.fn(() => true)
      }
      const ingredient = {
        type: 'patty',
        collected: false,
        isClicked: vi.fn(() => true)
      }
      
      gameState.powerUps = [powerUp]
      gameState.ingredients = [ingredient]
      
      clickHandler(200, 200, 'mouse')
      
      // Power-up should be collected
      expect(gameState.playPowerUpCollect).toHaveBeenCalled()
      expect(powerUp.isClicked).toHaveBeenCalled()
      
      // Ingredient should not be checked
      expect(ingredient.isClicked).not.toHaveBeenCalled()
    })
    
    it('should check items in reverse order (top to bottom)', () => {
      const result = setupGameInput(canvas, gameState)
      const clickHandler = result._clickHandler
      
      const powerUp1 = {
        type: 'speedBoost',
        collected: false,
        data: { name: 'Speed1', color: '#FFD700' },
        isClicked: vi.fn(() => false)
      }
      const powerUp2 = {
        type: 'timeFreeze',
        collected: false,
        data: { name: 'Speed2', color: '#00FFFF' },
        isClicked: vi.fn(() => true)
      }
      
      gameState.powerUps = [powerUp1, powerUp2]
      
      clickHandler(200, 200, 'mouse')
      
      // Should check powerUp2 first (reverse order)
      expect(powerUp2.isClicked).toHaveBeenCalled()
      expect(powerUp1.isClicked).not.toHaveBeenCalled()
    })
  })
  
  describe('Return Value', () => {
    it('should return input system instance', () => {
      const result = setupGameInput(canvas, gameState)
      
      expect(result).toBeDefined()
      expect(result.onClick).toBeDefined()
      expect(result.destroy).toBeDefined()
    })
  })
})