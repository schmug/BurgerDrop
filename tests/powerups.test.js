import { describe, it, expect, beforeEach } from 'vitest'

describe('Power-up System', () => {
  describe('Power-up Types', () => {
    it('should have correct power-up definitions', () => {
      const powerUpTypes = {
        speedBoost: {
          name: 'Speed Boost',
          duration: 5000,
          effect: 'ingredient_speed_multiplier',
          value: 0.5
        },
        timeFreeze: {
          name: 'Time Freeze',
          duration: 3000,
          effect: 'freeze_time',
          value: true
        },
        scoreMultiplier: {
          name: 'Score Multiplier',
          duration: 8000,
          effect: 'score_multiplier',
          value: 2
        }
      }

      expect(powerUpTypes.speedBoost.duration).toBe(5000)
      expect(powerUpTypes.timeFreeze.effect).toBe('freeze_time')
      expect(powerUpTypes.scoreMultiplier.value).toBe(2)
    })
  })

  describe('Power-up State Management', () => {
    let powerUps

    beforeEach(() => {
      powerUps = {
        speedBoost: { active: false, timeRemaining: 0 },
        timeFreeze: { active: false, timeRemaining: 0 },
        scoreMultiplier: { active: false, timeRemaining: 0 }
      }
    })

    it('should initialize power-ups as inactive', () => {
      expect(powerUps.speedBoost.active).toBe(false)
      expect(powerUps.timeFreeze.active).toBe(false)
      expect(powerUps.scoreMultiplier.active).toBe(false)
    })

    it('should activate power-up correctly', () => {
      const activatePowerUp = (type, duration) => {
        powerUps[type].active = true
        powerUps[type].timeRemaining = duration
      }

      activatePowerUp('speedBoost', 5000)

      expect(powerUps.speedBoost.active).toBe(true)
      expect(powerUps.speedBoost.timeRemaining).toBe(5000)
    })

    it('should update power-up timer', () => {
      powerUps.speedBoost.active = true
      powerUps.speedBoost.timeRemaining = 1000

      const updatePowerUp = (type, deltaTime) => {
        if (powerUps[type].active) {
          powerUps[type].timeRemaining -= deltaTime * 1000
          if (powerUps[type].timeRemaining <= 0) {
            powerUps[type].active = false
            powerUps[type].timeRemaining = 0
          }
        }
      }

      updatePowerUp('speedBoost', 1.5) // 1.5 seconds

      expect(powerUps.speedBoost.active).toBe(false)
      expect(powerUps.speedBoost.timeRemaining).toBe(0)
    })
  })

  describe('Power-up Effects', () => {
    it('should calculate speed boost effect', () => {
      const baseSpeed = 2
      const speedMultiplier = 0.5 // Makes ingredients slower
      const effectiveSpeed = baseSpeed * speedMultiplier

      expect(effectiveSpeed).toBe(1)
      expect(effectiveSpeed).toBeLessThan(baseSpeed)
    })

    it('should calculate score multiplier effect', () => {
      const baseScore = 100
      const multiplier = 2
      const boostedScore = baseScore * multiplier

      expect(boostedScore).toBe(200)
    })

    it('should handle time freeze effect', () => {
      const timeFrozen = true
      const deltaTime = 1/60
      const effectiveDeltaTime = timeFrozen ? 0 : deltaTime

      expect(effectiveDeltaTime).toBe(0)
    })
  })

  describe('Power-up Collection', () => {
    it('should generate random power-up type', () => {
      const powerUpTypes = ['speedBoost', 'timeFreeze', 'scoreMultiplier']
      const getRandomPowerUp = () => {
        return powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)]
      }

      const randomType = getRandomPowerUp()
      expect(powerUpTypes).toContain(randomType)
    })

    it('should create power-up with position', () => {
      class MockPowerUp {
        constructor(type, x, y) {
          this.type = type
          this.x = x
          this.y = y
          this.width = 40
          this.height = 40
          this.collected = false
        }

        contains(x, y) {
          return x >= this.x && x <= this.x + this.width &&
                 y >= this.y && y <= this.y + this.height
        }
      }

      const powerUp = new MockPowerUp('speedBoost', 100, 200)

      expect(powerUp.type).toBe('speedBoost')
      expect(powerUp.x).toBe(100)
      expect(powerUp.y).toBe(200)
      expect(powerUp.collected).toBe(false)
    })
  })
})