import { describe, it, expect } from 'vitest'

describe('Collision Detection', () => {
  describe('Point-Rectangle Collision', () => {
    it('should detect point inside rectangle', () => {
      const pointInRect = (px, py, rx, ry, rw, rh) => {
        return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh
      }

      expect(pointInRect(50, 50, 25, 25, 50, 50)).toBe(true)
      expect(pointInRect(10, 10, 25, 25, 50, 50)).toBe(false)
      expect(pointInRect(100, 100, 25, 25, 50, 50)).toBe(false)
    })

    it('should handle edge cases', () => {
      const pointInRect = (px, py, rx, ry, rw, rh) => {
        return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh
      }

      // Test boundaries
      expect(pointInRect(25, 25, 25, 25, 50, 50)).toBe(true) // Top-left corner
      expect(pointInRect(75, 75, 25, 25, 50, 50)).toBe(true) // Bottom-right corner
      expect(pointInRect(24, 25, 25, 25, 50, 50)).toBe(false) // Just outside left
      expect(pointInRect(76, 75, 25, 25, 50, 50)).toBe(false) // Just outside right
    })
  })

  describe('Rectangle-Rectangle Collision', () => {
    it('should detect overlapping rectangles', () => {
      const rectOverlap = (r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) => {
        return r1x < r2x + r2w &&
               r1x + r1w > r2x &&
               r1y < r2y + r2h &&
               r1y + r1h > r2y
      }

      expect(rectOverlap(10, 10, 20, 20, 15, 15, 20, 20)).toBe(true)
      expect(rectOverlap(0, 0, 10, 10, 20, 20, 10, 10)).toBe(false)
    })

    it('should handle touching rectangles', () => {
      const rectOverlap = (r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) => {
        return r1x < r2x + r2w &&
               r1x + r1w > r2x &&
               r1y < r2y + r2h &&
               r1y + r1h > r2y
      }

      // Rectangles touching at edges should not overlap
      expect(rectOverlap(0, 0, 10, 10, 10, 0, 10, 10)).toBe(false)
      expect(rectOverlap(0, 0, 10, 10, 0, 10, 10, 10)).toBe(false)
    })
  })

  describe('Touch/Click Input Handling', () => {
    it('should convert touch coordinates to canvas coordinates', () => {
      const convertCoordinates = (clientX, clientY, canvas) => {
        const rect = canvas.getBoundingClientRect()
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height
        
        return {
          x: (clientX - rect.left) * scaleX,
          y: (clientY - rect.top) * scaleY
        }
      }

      const mockCanvas = {
        width: 800,
        height: 600,
        getBoundingClientRect: () => ({
          left: 100,
          top: 50,
          width: 400,
          height: 300
        })
      }

      const coords = convertCoordinates(300, 200, mockCanvas)
      
      expect(coords.x).toBe(400) // (300 - 100) * (800 / 400)
      expect(coords.y).toBe(300) // (200 - 50) * (600 / 300)
    })
  })

  describe('Game Object Collision', () => {
    class MockGameObject {
      constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
      }

      contains(x, y) {
        return x >= this.x && x <= this.x + this.width &&
               y >= this.y && y <= this.y + this.height
      }

      intersects(other) {
        return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y
      }
    }

    it('should detect point collision with game object', () => {
      const obj = new MockGameObject(100, 100, 50, 50)
      
      expect(obj.contains(125, 125)).toBe(true)
      expect(obj.contains(75, 75)).toBe(false)
    })

    it('should detect collision between game objects', () => {
      const obj1 = new MockGameObject(100, 100, 50, 50)
      const obj2 = new MockGameObject(125, 125, 50, 50)
      const obj3 = new MockGameObject(200, 200, 50, 50)
      
      expect(obj1.intersects(obj2)).toBe(true)
      expect(obj1.intersects(obj3)).toBe(false)
    })
  })

  describe('Multiple Object Collision Checking', () => {
    it('should find all colliding objects', () => {
      const objects = [
        { x: 10, y: 10, width: 20, height: 20 },
        { x: 15, y: 15, width: 20, height: 20 },
        { x: 50, y: 50, width: 20, height: 20 }
      ]

      const findCollidingObjects = (x, y) => {
        return objects.filter(obj => 
          x >= obj.x && x <= obj.x + obj.width &&
          y >= obj.y && y <= obj.y + obj.height
        )
      }

      const collisions = findCollidingObjects(20, 20)
      expect(collisions).toHaveLength(2)
      
      const noCollisions = findCollidingObjects(5, 5)
      expect(noCollisions).toHaveLength(0)
    })
  })
})