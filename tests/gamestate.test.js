import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GameState } from '../src/game/State.js'

describe('GameState', () => {
  let gameState

  beforeEach(() => {
    gameState = new GameState()
    // Clear localStorage mock
    global.localStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    }
  })

  describe('Initialization', () => {
    it('should initialize with correct default values', () => {
      expect(gameState.core.running).toBe(false)
      expect(gameState.core.score).toBe(0)
      expect(gameState.core.lives).toBe(3)
      expect(gameState.core.combo).toBe(1)
      expect(gameState.core.level).toBe(1)
      expect(gameState.core.frameCount).toBe(0)
    })

    it('should initialize empty entity collections', () => {
      expect(gameState.entities.ingredients).toEqual([])
      expect(gameState.entities.orders).toEqual([])
      expect(gameState.entities.powerUps).toEqual([])
      expect(gameState.entities.particles).toEqual([])
    })

    it('should initialize inactive power-ups', () => {
      expect(gameState.powerUps.speedBoost.active).toBe(false)
      expect(gameState.powerUps.timeFreeze.active).toBe(false)
      expect(gameState.powerUps.scoreMultiplier.active).toBe(false)
    })
  })

  describe('Score Management', () => {
    it('should update score correctly', () => {
      const listener = vi.fn()
      gameState.on('scoreChanged', listener)
      
      gameState.updateScore(100)
      
      expect(gameState.core.score).toBe(100)
      expect(listener).toHaveBeenCalledWith({ old: 0, new: 100 })
    })

    it('should handle fractional scores by flooring', () => {
      gameState.updateScore(123.7)
      expect(gameState.core.score).toBe(123)
    })

    it('should trigger new high score event', () => {
      const listener = vi.fn()
      gameState.on('newHighScore', listener)
      
      gameState.updateScore(1000)
      
      expect(gameState.core.highScore).toBe(1000)
      expect(listener).toHaveBeenCalledWith(1000)
    })
  })

  describe('Combo System', () => {
    it('should update combo within valid range', () => {
      gameState.updateCombo(5)
      expect(gameState.core.combo).toBe(5)
    })

    it('should cap combo at maximum of 10', () => {
      gameState.updateCombo(15)
      expect(gameState.core.combo).toBe(10)
    })

    it('should enforce minimum combo of 1', () => {
      gameState.updateCombo(-5)
      expect(gameState.core.combo).toBe(1)
    })

    it('should increment combo correctly', () => {
      gameState.incrementCombo()
      gameState.incrementCombo()
      expect(gameState.core.combo).toBe(3)
    })

    it('should reset combo to 1', () => {
      gameState.updateCombo(5)
      gameState.resetCombo()
      expect(gameState.core.combo).toBe(1)
    })
  })

  describe('Lives System', () => {
    it('should lose life correctly', () => {
      const listener = vi.fn()
      gameState.on('livesChanged', listener)
      
      gameState.loseLife()
      
      expect(gameState.core.lives).toBe(2)
      expect(listener).toHaveBeenCalledWith({ old: 3, new: 2 })
    })

    it('should trigger game over when lives reach 0', () => {
      const gameOverListener = vi.fn()
      gameState.on('gameOver', gameOverListener)
      
      // Lose all lives
      gameState.loseLife()
      gameState.loseLife()
      gameState.loseLife()
      
      expect(gameState.core.lives).toBe(0)
      expect(gameOverListener).toHaveBeenCalled()
    })

    it('should not go below 0 lives', () => {
      gameState.core.lives = 1
      gameState.loseLife()
      gameState.loseLife() // Try to go negative
      
      expect(gameState.core.lives).toBe(0)
    })
  })

  describe('Entity Management', () => {
    it('should add entities correctly', () => {
      const mockIngredient = { type: 'patty', x: 100, y: 50 }
      const listener = vi.fn()
      gameState.on('entityAdded', listener)
      
      gameState.addEntity('ingredients', mockIngredient)
      
      expect(gameState.entities.ingredients).toHaveLength(1)
      expect(gameState.entities.ingredients[0]).toBe(mockIngredient)
      expect(listener).toHaveBeenCalledWith({ type: 'ingredients', entity: mockIngredient })
    })

    it('should throw error for unknown entity type', () => {
      expect(() => {
        gameState.addEntity('unknown', {})
      }).toThrow('Unknown entity type: unknown')
    })

    it('should enforce entity limits', () => {
      // Add more than the limit (25 for ingredients)
      for (let i = 0; i < 30; i++) {
        gameState.addEntity('ingredients', { id: i })
      }
      
      expect(gameState.entities.ingredients).toHaveLength(25)
    })

    it('should remove entities with predicate', () => {
      gameState.addEntity('ingredients', { id: 1, active: true })
      gameState.addEntity('ingredients', { id: 2, active: false })
      gameState.addEntity('ingredients', { id: 3, active: true })
      
      const removed = gameState.removeEntity('ingredients', entity => !entity.active)
      
      expect(removed).toBe(2) // Removed 2 active entities (filter keeps inactive, so 2 were removed)
      expect(gameState.entities.ingredients).toHaveLength(1)
      expect(gameState.entities.ingredients[0].active).toBe(false)
    })

    it('should clear all entities of a type', () => {
      gameState.addEntity('particles', { id: 1 })
      gameState.addEntity('particles', { id: 2 })
      
      const cleared = gameState.clearEntities('particles')
      
      expect(cleared).toBe(2)
      expect(gameState.entities.particles).toHaveLength(0)
    })

    it('should get entity count', () => {
      gameState.addEntity('orders', { id: 1 })
      gameState.addEntity('orders', { id: 2 })
      
      expect(gameState.getEntityCount('orders')).toBe(2)
      expect(gameState.getEntityCount('ingredients')).toBe(0)
    })
  })

  describe('Power-up Management', () => {
    it('should activate power-up correctly', () => {
      const listener = vi.fn()
      gameState.on('powerUpActivated', listener)
      
      gameState.activatePowerUp('speedBoost', 5000)
      
      expect(gameState.powerUps.speedBoost.active).toBe(true)
      expect(gameState.powerUps.speedBoost.timeLeft).toBe(5000)
      expect(listener).toHaveBeenCalledWith({ type: 'speedBoost', duration: 5000 })
    })

    it('should throw error for unknown power-up type', () => {
      expect(() => {
        gameState.activatePowerUp('unknown', 1000)
      }).toThrow('Unknown power-up type: unknown')
    })

    it('should update power-up timers', () => {
      gameState.activatePowerUp('timeFreeze', 1000)
      
      gameState.updatePowerUps(0.5) // 0.5 seconds
      
      expect(gameState.powerUps.timeFreeze.timeLeft).toBe(500)
      expect(gameState.powerUps.timeFreeze.active).toBe(true)
    })

    it('should deactivate power-up when time expires', () => {
      const listener = vi.fn()
      gameState.on('powerUpDeactivated', listener)
      
      gameState.activatePowerUp('scoreMultiplier', 500)
      gameState.updatePowerUps(1) // 1 second (1000ms > 500ms)
      
      expect(gameState.powerUps.scoreMultiplier.active).toBe(false)
      expect(gameState.powerUps.scoreMultiplier.timeLeft).toBe(0)
      expect(listener).toHaveBeenCalledWith({ type: 'scoreMultiplier' })
    })

    it('should check power-up active status', () => {
      expect(gameState.isPowerUpActive('speedBoost')).toBe(false)
      
      gameState.activatePowerUp('speedBoost', 1000)
      expect(gameState.isPowerUpActive('speedBoost')).toBe(true)
    })

    it('should get power-up time left', () => {
      expect(gameState.getPowerUpTimeLeft('timeFreeze')).toBe(0)
      
      gameState.activatePowerUp('timeFreeze', 3000)
      expect(gameState.getPowerUpTimeLeft('timeFreeze')).toBe(3000)
    })
  })

  describe('Game State Control', () => {
    it('should start game correctly', () => {
      const listener = vi.fn()
      gameState.on('gameStarted', listener)
      
      // Set some non-default values first
      gameState.core.score = 500
      gameState.core.lives = 1
      gameState.addEntity('ingredients', { id: 1 })
      
      gameState.startGame()
      
      expect(gameState.core.running).toBe(true)
      expect(gameState.core.score).toBe(0)
      expect(gameState.core.lives).toBe(3)
      expect(gameState.core.combo).toBe(1)
      expect(gameState.entities.ingredients).toHaveLength(0)
      expect(listener).toHaveBeenCalled()
    })

    it('should end game correctly', () => {
      const listener = vi.fn()
      gameState.on('gameEnded', listener)
      
      gameState.core.score = 1000
      gameState.endGame()
      
      expect(gameState.core.running).toBe(false)
      expect(listener).toHaveBeenCalledWith({ score: 1000, highScore: 1000 })
    })

    it('should pause and resume game', () => {
      const pauseListener = vi.fn()
      const resumeListener = vi.fn()
      gameState.on('gamePaused', pauseListener)
      gameState.on('gameResumed', resumeListener)
      
      gameState.startGame()
      expect(gameState.isRunning()).toBe(true)
      
      gameState.pauseGame()
      expect(gameState.isRunning()).toBe(false)
      expect(pauseListener).toHaveBeenCalled()
      
      gameState.resumeGame()
      expect(gameState.isRunning()).toBe(true)
      expect(resumeListener).toHaveBeenCalled()
    })
  })

  describe('Event System', () => {
    it('should register and trigger event listeners', () => {
      const listener1 = vi.fn()
      const listener2 = vi.fn()
      
      gameState.on('testEvent', listener1)
      gameState.on('testEvent', listener2)
      
      gameState.emit('testEvent', { data: 'test' })
      
      expect(listener1).toHaveBeenCalledWith({ data: 'test' })
      expect(listener2).toHaveBeenCalledWith({ data: 'test' })
    })

    it('should remove event listeners', () => {
      const listener = vi.fn()
      
      gameState.on('testEvent', listener)
      gameState.off('testEvent', listener)
      
      gameState.emit('testEvent', 'test')
      
      expect(listener).not.toHaveBeenCalled()
    })

    it('should handle errors in event listeners gracefully', () => {
      const errorListener = vi.fn(() => { throw new Error('Test error') })
      const normalListener = vi.fn()
      
      gameState.on('testEvent', errorListener)
      gameState.on('testEvent', normalListener)
      
      // Should not throw
      expect(() => {
        gameState.emit('testEvent', 'test')
      }).not.toThrow()
      
      expect(normalListener).toHaveBeenCalled()
    })
  })

  describe('State Validation', () => {
    it('should validate correct state', () => {
      const errors = gameState.validate()
      expect(errors).toEqual([])
    })

    it('should detect invalid state', () => {
      gameState.core.score = -100
      gameState.core.lives = -1
      gameState.core.combo = 15
      
      const errors = gameState.validate()
      
      expect(errors).toContain('Score cannot be negative')
      expect(errors).toContain('Lives cannot be negative')
      expect(errors).toContain('Combo must be between 1-10')
    })

    it('should provide debug information', () => {
      gameState.addEntity('ingredients', { id: 1 })
      gameState.activatePowerUp('speedBoost', 1000)
      
      const debugInfo = gameState.getDebugInfo()
      
      expect(debugInfo.core.score).toBe(0)
      expect(debugInfo.entityCounts.ingredients).toBe(1)
      expect(debugInfo.activePowerUps.speedBoost).toBe(1000)
      expect(Array.isArray(debugInfo.errors)).toBe(true)
    })
  })

  describe('Debug Mode', () => {
    it('should enable and disable debug mode', () => {
      expect(gameState.debug.enabled).toBe(false)
      
      gameState.enableDebug()
      expect(gameState.debug.enabled).toBe(true)
      
      gameState.disableDebug()
      expect(gameState.debug.enabled).toBe(false)
    })

    it('should track event history in debug mode', () => {
      gameState.enableDebug()
      
      gameState.emit('testEvent1', 'data1')
      gameState.emit('testEvent2', 'data2')
      
      const history = gameState.getDebugHistory()
      expect(history).toHaveLength(2)
      expect(history[0].event).toBe('testEvent1')
      expect(history[1].event).toBe('testEvent2')
    })

    it('should limit debug history to 100 events', () => {
      gameState.enableDebug()
      
      // Add 150 events
      for (let i = 0; i < 150; i++) {
        gameState.emit('testEvent', i)
      }
      
      const history = gameState.getDebugHistory()
      expect(history).toHaveLength(100)
      expect(history[0].data).toBe(50) // Should have removed first 50
    })
  })
})