import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import PerformanceMonitor from '../src/game/utils/PerformanceMonitor.js'

describe('PerformanceMonitor', () => {
  let monitor
  let mockPerformanceNow
  
  beforeEach(() => {
    // Mock performance.now()
    mockPerformanceNow = vi.fn()
    mockPerformanceNow.mockReturnValue(1000)
    global.performance = { now: mockPerformanceNow }
    
    monitor = new PerformanceMonitor({
      sampleSize: 10,
      lowFPSThreshold: 45,
      criticalFPSThreshold: 30
    })
  })
  
  afterEach(() => {
    vi.clearAllMocks()
  })
  
  describe('Initialization', () => {
    it('should initialize with default options', () => {
      const defaultMonitor = new PerformanceMonitor()
      expect(defaultMonitor.sampleSize).toBe(60)
      expect(defaultMonitor.targetFPS).toBe(60)
      expect(defaultMonitor.lowFPSThreshold).toBe(45)
      expect(defaultMonitor.criticalFPSThreshold).toBe(30)
    })
    
    it('should initialize with custom options', () => {
      expect(monitor.sampleSize).toBe(10)
      expect(monitor.lowFPSThreshold).toBe(45) 
      expect(monitor.criticalFPSThreshold).toBe(30)
    })
    
    it('should initialize performance tracking arrays', () => {
      expect(monitor.frameTimes).toEqual([])
      expect(monitor.frameCount).toBe(0)
      expect(monitor.lastFrameTime).toBe(0)
    })
    
    it('should set initial performance stats', () => {
      expect(monitor.stats.performanceLevel).toBe('high')
      expect(monitor.stats.currentFPS).toBe(60)
      expect(monitor.stats.averageFPS).toBe(60)
      expect(monitor.qualitySettings.high).toBeDefined()
      expect(monitor.qualitySettings.high.maxParticles).toBe(200)
    })
  })
  
  describe('Frame Time Tracking', () => {
    it('should update frame times', () => {
      // First update to initialize lastFrameTime
      monitor.update(1000)
      expect(monitor.frameTimes.length).toBe(0) // No frame time on first update
      
      // Second update with ~60 FPS frame time
      monitor.update(1016.67)
      
      expect(monitor.frameTimes.length).toBe(1)
      expect(monitor.frameTimes[0]).toBeCloseTo(16.67, 1)
    })
    
    it('should calculate rolling average', () => {
      // Initialize
      monitor.update(1000)
      
      // Simulate 10 frames at 60 FPS
      for (let i = 1; i <= 10; i++) {
        monitor.update(1000 + i * 16.67)
      }
      
      expect(monitor.frameTimes.length).toBe(10)
      expect(monitor.stats.averageFPS).toBeCloseTo(60, 0)
    })
    
    it('should limit sample size', () => {
      // Add more than sampleSize frames
      for (let i = 1; i <= 15; i++) {
        monitor.update(1000 + i * 16.67)
      }
      
      expect(monitor.frameTimes.length).toBe(10)
    })
    
    it('should track min/max FPS', () => {
      // First frame to initialize
      monitor.update(1000)
      
      // 60 FPS frame
      monitor.update(1016.67)
      
      // 30 FPS frame
      monitor.update(1050)
      
      // 120 FPS frame
      monitor.update(1058.33)
      
      const stats = monitor.getStats()
      expect(stats.minFPS).toBeLessThanOrEqual(60)
      expect(stats.maxFPS).toBe(60) // Capped at target FPS
    })
  })
  
  describe('Performance Level Detection', () => {
    it('should maintain high performance level', () => {
      // Initialize
      monitor.update(1000)
      
      // Simulate consistent 60 FPS for enough frames
      for (let i = 1; i <= monitor.levelChangeDelay + 10; i++) {
        monitor.update(1000 + i * 16.67)
      }
      
      expect(monitor.stats.performanceLevel).toBe('high')
    })
    
    it('should detect medium performance level', () => {
      // Initialize
      monitor.update(1000)
      
      // Simulate 45 FPS for enough frames
      for (let i = 1; i <= monitor.levelChangeDelay + 10; i++) {
        monitor.update(1000 + i * 22.22)
      }
      
      expect(monitor.stats.performanceLevel).toBe('medium')
    })
    
    it('should detect low performance level', () => {
      // Initialize
      monitor.update(1000)
      
      // Simulate 25 FPS for enough frames  
      for (let i = 1; i <= monitor.levelChangeDelay + 10; i++) {
        monitor.update(1000 + i * 40)
      }
      
      // 25 FPS is below critical threshold (30), so it should be critical, not low
      expect(['low', 'critical']).toContain(monitor.stats.performanceLevel)
    })
    
    it('should emit performance change events', () => {
      const listener = vi.fn()
      monitor.on('performanceLevelChanged', listener)
      
      // Initialize
      monitor.update(1000)
      
      // Drop to low performance for enough frames
      for (let i = 1; i <= monitor.levelChangeDelay + 10; i++) {
        monitor.update(1000 + i * 40)
      }
      
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({
        oldLevel: 'high',
        newLevel: expect.stringMatching(/medium|low|critical/),
        settings: expect.any(Object)
      }))
    })
  })
  
  describe('Quality Settings', () => {
    it('should provide quality settings for each level', () => {
      expect(monitor.qualitySettings.high).toBeDefined()
      expect(monitor.qualitySettings.medium).toBeDefined()
      expect(monitor.qualitySettings.low).toBeDefined()
      expect(monitor.qualitySettings.critical).toBeDefined()
    })
    
    it('should adjust settings for different performance levels', () => {
      const highSettings = monitor.qualitySettings.high
      const lowSettings = monitor.qualitySettings.low
      
      expect(highSettings.maxParticles).toBeGreaterThan(lowSettings.maxParticles)
      expect(highSettings.enableEffects).toBe(true)
      expect(lowSettings.enableEffects).toBe(true) // Low still has effects, critical doesn't
    })
    
    it('should get current quality settings', () => {
      const settings = monitor.getQualitySettings()
      expect(settings).toEqual(monitor.qualitySettings[monitor.stats.performanceLevel])
    })
  })
  
  describe('Statistics and Reporting', () => {
    it('should get current stats', () => {
      // Add some frame data
      for (let i = 1; i <= 5; i++) {
        monitor.update(1000 + i * 16.67)
      }
      
      const stats = monitor.getStats()
      
      expect(stats).toHaveProperty('currentFPS')
      expect(stats).toHaveProperty('averageFPS')
      expect(stats).toHaveProperty('minFPS')
      expect(stats).toHaveProperty('maxFPS')
      expect(stats).toHaveProperty('performanceLevel')
      expect(stats).toHaveProperty('frameTimeMS')
      expect(stats).toHaveProperty('droppedFrames')
    })
    
    it('should generate performance report', () => {
      // Simulate various performance
      for (let i = 1; i <= 20; i++) {
        const frameTime = i < 10 ? 16.67 : 33.33
        monitor.update(1000 + i * frameTime)
      }
      
      const report = monitor.getReport()
      
      expect(report).toHaveProperty('enabled')
      expect(report).toHaveProperty('frameCount')
      expect(report).toHaveProperty('stats')
      expect(report).toHaveProperty('qualitySettings')
      expect(report).toHaveProperty('isHealthy')
      expect(report).toHaveProperty('isCritical')
      expect(report).toHaveProperty('sampleSize')
      expect(report).toHaveProperty('targetFPS')
    })
  })
  
  describe('Performance Helpers', () => {
    it('should check if performance is good', () => {
      // Set high FPS
      for (let i = 1; i <= 5; i++) {
        monitor.update(1000 + i * 16.67)
      }
      
      expect(monitor.isPerformanceGood()).toBe(true)
      
      // Drop FPS
      for (let i = 6; i <= 15; i++) {
        monitor.update(1000 + i * 33.33)
      }
      
      expect(monitor.isPerformanceGood()).toBe(false)
    })
    
    it('should check if performance is critical', () => {
      expect(monitor.isPerformanceCritical()).toBe(false)
      
      // Force critical level
      monitor.setPerformanceLevel('critical')
      
      expect(monitor.isPerformanceCritical()).toBe(true)
    })
  })
  
  describe('Event System', () => {
    it('should register event listeners', () => {
      const listener = vi.fn()
      monitor.on('statsUpdated', listener)
      
      // Initialize first
      monitor.update(1000)
      // Then update with frame time
      monitor.update(1016.67)
      
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({
        currentFPS: expect.any(Number),
        averageFPS: expect.any(Number)
      }))
    })
    
    it('should remove event listeners', () => {
      const listener = vi.fn()
      monitor.on('statsUpdated', listener)
      monitor.off('statsUpdated', listener)
      
      monitor.update(1016.67)
      
      expect(listener).not.toHaveBeenCalled()
    })
    
    it('should handle multiple listeners', () => {
      const listener1 = vi.fn()
      const listener2 = vi.fn()
      
      monitor.on('statsUpdated', listener1)
      monitor.on('statsUpdated', listener2)
      
      // Initialize first
      monitor.update(1000)
      // Then update with frame time
      monitor.update(1016.67)
      
      expect(listener1).toHaveBeenCalled()
      expect(listener2).toHaveBeenCalled()
    })
    
    it('should emit frame drop events', () => {
      const listener = vi.fn()
      monitor.on('frameDropDetected', listener)
      
      // Simulate a dropped frame (>33ms for 60fps target)
      monitor.update(1000)
      monitor.update(1050) // 50ms frame time
      
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({
        frameTime: expect.any(Number),
        targetTime: expect.any(Number)
      }))
    })
  })
  
  describe('Control Methods', () => {
    it('should reset statistics', () => {
      // Add some data
      for (let i = 1; i <= 5; i++) {
        monitor.update(1000 + i * 16.67)
      }
      
      monitor.reset()
      
      expect(monitor.frameTimes).toEqual([])
      expect(monitor.frameCount).toBe(0)
      expect(monitor.lastFrameTime).toBe(0)
      expect(monitor.stats.currentFPS).toBe(60)
      expect(monitor.stats.performanceLevel).toBe('high')
    })
    
    it('should enable/disable monitoring', () => {
      monitor.setEnabled(false)
      expect(monitor.enabled).toBe(false)
      
      // Should not update when disabled
      const initialFrameCount = monitor.frameCount
      monitor.update(1016.67)
      
      expect(monitor.frameCount).toBe(initialFrameCount)
      
      // Re-enable
      monitor.setEnabled(true)
      // Initialize first
      monitor.update(1000)
      // Then update
      monitor.update(1033.33)
      
      expect(monitor.frameCount).toBeGreaterThan(initialFrameCount)
    })
    
    it('should toggle debug mode', () => {
      expect(monitor.debugMode).toBe(false)
      
      monitor.setDebugMode(true)
      expect(monitor.debugMode).toBe(true)
    })
    
    it('should force performance level', () => {
      const listener = vi.fn()
      monitor.on('performanceLevelChanged', listener)
      
      monitor.setPerformanceLevel('low')
      
      expect(monitor.stats.performanceLevel).toBe('low')
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({
        oldLevel: 'high',
        newLevel: 'low',
        forced: true
      }))
    })
  })
  
  describe('Edge Cases', () => {
    it('should handle very low frame rates', () => {
      monitor.update(1000)
      monitor.update(1200) // 5 FPS
      
      const stats = monitor.getStats()
      expect(stats.currentFPS).toBeLessThanOrEqual(10)
    })
    
    it('should handle very high frame rates', () => {
      monitor.update(1000)
      monitor.update(1004.17) // 240 FPS attempt
      
      const stats = monitor.getStats()
      expect(stats.currentFPS).toBe(60) // Capped at target
    })
    
    it('should handle irregular frame times', () => {
      // Alternating frame times
      const times = [1000, 1016.67, 1066.67, 1083.34, 1183.34]
      
      times.forEach(time => monitor.update(time))
      
      const stats = monitor.getStats()
      expect(stats.averageFPS).toBeGreaterThan(0)
      expect(stats.averageFPS).toBeLessThan(60)
    })
    
    it('should handle first frame initialization', () => {
      expect(monitor.lastFrameTime).toBe(0)
      
      monitor.update(1000)
      
      expect(monitor.lastFrameTime).toBe(1000)
      expect(monitor.frameTimes.length).toBe(0) // No frame time on first update
    })
  })
  
  describe('Error Handling', () => {
    it('should handle errors in event callbacks', () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const errorListener = vi.fn(() => {
        throw new Error('Test error')
      })
      
      monitor.on('statsUpdated', errorListener)
      // Initialize first
      monitor.update(1000)
      // Then update
      monitor.update(1016.67)
      
      expect(errorSpy).toHaveBeenCalled()
      errorSpy.mockRestore()
    })
    
    it('should handle invalid performance levels', () => {
      const initialLevel = monitor.stats.performanceLevel
      
      monitor.setPerformanceLevel('invalid')
      
      expect(monitor.stats.performanceLevel).toBe(initialLevel)
    })
  })
})