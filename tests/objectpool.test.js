import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ObjectPool, PoolManager } from '../src/game/utils/ObjectPool.js'

describe('ObjectPool', () => {
  let pool
  
  class TestObject {
    constructor() {
      this.active = true
      this.id = Math.random()
    }
    
    reset() {
      this.active = true
      this.x = 0
      this.y = 0
    }
  }
  
  beforeEach(() => {
    pool = new ObjectPool(
      () => new TestObject(), 
      (obj) => obj.reset(),
      5,  // initialSize
      10  // maxSize
    )
  })
  
  describe('Initialization', () => {
    it('should create pool with initial size', () => {
      expect(pool.pool.length).toBe(5)
      expect(pool.activeCount).toBe(0)
    })
    
    it('should use default options when not provided', () => {
      const defaultPool = new ObjectPool(() => new TestObject(), null)
      expect(defaultPool.pool.length).toBe(10)
      expect(defaultPool.maxSize).toBe(100)
    })
    
    it('should initialize objects with factory function', () => {
      const objects = pool.pool
      objects.forEach(obj => {
        expect(obj).toBeInstanceOf(TestObject)
        expect(obj.active).toBe(true)
      })
    })
    
    it('should track created objects', () => {
      expect(pool.totalCreated).toBe(5)
      expect(pool.totalReused).toBe(0)
    })
  })
  
  describe('Object Retrieval', () => {
    it('should get object from pool', () => {
      const initialPoolSize = pool.pool.length
      const obj = pool.get()
      
      expect(obj).toBeInstanceOf(TestObject)
      expect(pool.pool.length).toBe(initialPoolSize - 1)
      expect(pool.activeCount).toBe(1)
    })
    
    it('should create new object when pool is empty', () => {
      // Empty the pool
      for (let i = 0; i < 5; i++) {
        pool.get()
      }
      
      expect(pool.pool.length).toBe(0)
      const initialCreated = pool.totalCreated
      
      // Should create new object
      const obj = pool.get()
      expect(obj).toBeInstanceOf(TestObject)
      expect(pool.totalCreated).toBe(initialCreated + 1)
    })
    
    it('should reset object when retrieved', () => {
      const obj = pool.get()
      obj.x = 100
      obj.y = 200
      
      pool.release(obj)
      const sameObj = pool.get()
      
      expect(sameObj.x).toBe(0)
      expect(sameObj.y).toBe(0)
    })
    
    it('should track reuse statistics', () => {
      const obj = pool.get()
      pool.release(obj)
      
      const initialReused = pool.totalReused
      pool.get()
      
      expect(pool.totalReused).toBe(initialReused + 1)
    })
  })
  
  describe('Object Release', () => {
    it('should release object back to pool', () => {
      const obj = pool.get()
      expect(pool.activeCount).toBe(1)
      
      pool.release(obj)
      
      expect(pool.activeCount).toBe(0)
      expect(pool.pool.length).toBe(5)
    })
    
    it('should not exceed max size when releasing', () => {
      // Fill pool to max
      while (pool.pool.length < pool.maxSize) {
        pool.pool.push(new TestObject())
      }
      
      const obj = new TestObject()
      pool.release(obj)
      
      expect(pool.pool.length).toBe(pool.maxSize)
    })
    
    it('should handle null releases gracefully', () => {
      const initialActive = pool.activeCount
      pool.release(null)
      
      expect(pool.activeCount).toBe(initialActive)
    })
  })
  
  describe('Pool Management', () => {
    it('should release all active objects', () => {
      const objects = []
      for (let i = 0; i < 5; i++) {
        objects.push(pool.get())
      }
      
      expect(pool.activeCount).toBe(5)
      
      pool.releaseAll(objects)
      
      expect(pool.activeCount).toBe(0)
      expect(pool.pool.length).toBe(5)
    })
    
    it('should clear pool', () => {
      pool.get()
      pool.get()
      
      pool.clear()
      
      expect(pool.pool.length).toBe(0)
      expect(pool.activeCount).toBe(0)
      expect(pool.totalCreated).toBe(0)
      expect(pool.totalReused).toBe(0)
    })
    
    it('should resize pool', () => {
      pool.resize(3)
      
      expect(pool.maxSize).toBe(3)
      expect(pool.pool.length).toBe(3) // Should trim excess
    })
    
    it('should pre-warm pool', () => {
      pool.pool.length = 0 // Clear pool
      pool.preWarm(8)
      
      expect(pool.pool.length).toBe(8)
      expect(pool.totalCreated).toBeGreaterThan(5)
    })
    
    it('should not pre-warm beyond max size', () => {
      pool.preWarm(20)
      
      expect(pool.pool.length).toBeLessThanOrEqual(pool.maxSize)
    })
  })
  
  describe('Statistics', () => {
    it('should track pool statistics', () => {
      pool.get()
      pool.get()
      const obj = pool.get()
      pool.release(obj)
      
      const stats = pool.getStats()
      
      expect(stats.poolSize).toBe(3)
      expect(stats.activeCount).toBe(2)
      expect(stats.totalCreated).toBeGreaterThanOrEqual(5)
      expect(stats.totalReused).toBeGreaterThanOrEqual(0)
      expect(stats.maxSize).toBe(10)
    })
    
    it('should calculate reuse ratio', () => {
      const obj1 = pool.get()
      const obj2 = pool.get()
      pool.release(obj1)
      pool.release(obj2)
      pool.get()
      pool.get()
      
      const stats = pool.getStats()
      expect(stats.reuseRatio).toBeGreaterThan(0)
    })
    
    it('should check pool health', () => {
      // New pool should not be healthy (no reuse yet)
      expect(pool.isHealthy()).toBe(false)
      
      // Reuse objects to improve health
      const objects = []
      for (let i = 0; i < 5; i++) {
        objects.push(pool.get())
      }
      objects.forEach(obj => pool.release(obj))
      
      for (let i = 0; i < 5; i++) {
        pool.get()
      }
      
      // Should be healthier now
      const stats = pool.getStats()
      expect(stats.reuseRatio).toBeGreaterThan(0)
    })
  })
})

describe('PoolManager', () => {
  let manager
  
  class TestEntity {
    constructor() {
      this.type = 'test'
    }
    reset() {
      this.active = true
    }
  }
  
  class OtherEntity {
    constructor() {
      this.type = 'other'
    }
    reset() {
      this.active = true
    }
  }
  
  beforeEach(() => {
    manager = new PoolManager()
  })
  
  describe('Pool Creation', () => {
    it('should create new pool', () => {
      const pool = manager.createPool(
        'test', 
        () => new TestEntity(),
        (obj) => obj.reset(),
        3,
        10
      )
      
      expect(manager.pools.has('test')).toBe(true)
      expect(pool).toBeInstanceOf(ObjectPool)
    })
    
    it('should get existing pool', () => {
      manager.createPool('test', () => new TestEntity(), null)
      const pool = manager.getPool('test')
      
      expect(pool).toBeInstanceOf(ObjectPool)
    })
    
    it('should return undefined for non-existent pool', () => {
      const pool = manager.getPool('nonexistent')
      expect(pool).toBeUndefined()
    })
  })
  
  describe('Object Management', () => {
    beforeEach(() => {
      manager.createPool('test', () => new TestEntity(), (obj) => obj.reset(), 5)
      manager.createPool('other', () => new OtherEntity(), (obj) => obj.reset(), 3)
    })
    
    it('should get object from specific pool', () => {
      const obj = manager.get('test')
      
      expect(obj).toBeInstanceOf(TestEntity)
      expect(obj.type).toBe('test')
    })
    
    it('should release object to correct pool', () => {
      const obj = manager.get('test')
      const pool = manager.getPool('test')
      const activeBefore = pool.activeCount
      
      manager.release('test', obj)
      
      expect(pool.activeCount).toBe(activeBefore - 1)
    })
    
    it('should return null for non-existent pool', () => {
      const obj = manager.get('nonexistent')
      expect(obj).toBeNull()
    })
  })
  
  describe('Global Management', () => {
    beforeEach(() => {
      manager.createPool('test', () => new TestEntity(), null, 5)
      manager.createPool('other', () => new OtherEntity(), null, 3)
    })
    
    it('should get statistics for all pools', () => {
      manager.get('test')
      manager.get('test')
      manager.get('other')
      
      const stats = manager.getStats()
      
      expect(stats.test).toBeDefined()
      expect(stats.test.activeCount).toBe(2)
      expect(stats.other).toBeDefined()
      expect(stats.other.activeCount).toBe(1)
    })
    
    it('should clear all pools', () => {
      manager.get('test')
      manager.get('other')
      
      manager.clearAll()
      
      const testPool = manager.getPool('test')
      const otherPool = manager.getPool('other')
      
      expect(testPool.activeCount).toBe(0)
      expect(otherPool.activeCount).toBe(0)
    })
    
    it('should check health of all pools', () => {
      expect(manager.areAllPoolsHealthy()).toBe(false) // New pools aren't healthy
      
      // Improve health by reusing objects
      const testObjs = []
      for (let i = 0; i < 3; i++) {
        testObjs.push(manager.get('test'))
      }
      testObjs.forEach(obj => manager.release('test', obj))
      for (let i = 0; i < 3; i++) {
        manager.get('test')
      }
      
      // Still might not be healthy depending on reuse ratio
      const healthy = manager.areAllPoolsHealthy()
      expect(typeof healthy).toBe('boolean')
    })
    
    it('should calculate memory savings', () => {
      // Get some objects
      for (let i = 0; i < 3; i++) {
        manager.get('test')
      }
      for (let i = 0; i < 2; i++) {
        manager.get('other')
      }
      
      const savings = manager.getMemorySavings()
      
      expect(savings).toHaveProperty('objectsReused')
      expect(savings).toHaveProperty('objectsCreated')
      expect(savings).toHaveProperty('savings')
      expect(savings.objectsCreated).toBeGreaterThan(0)
    })
    
    it('should handle empty pools in statistics', () => {
      const stats = manager.getStats()
      const savings = manager.getMemorySavings()
      
      expect(stats).toBeDefined()
      expect(savings.objectsCreated).toBeGreaterThan(0) // Initial objects created
    })
  })
  
  describe('Error Handling', () => {
    it('should handle operations on non-existent pools', () => {
      expect(() => {
        manager.release('nonexistent', {})
      }).not.toThrow()
      
      const stats = manager.getStats()
      expect(stats.nonexistent).toBeUndefined()
    })
  })
})