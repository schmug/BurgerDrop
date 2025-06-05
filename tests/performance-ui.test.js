import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import PerformanceUI from '../src/game/utils/PerformanceUI.js'

describe('PerformanceUI', () => {
  let ui
  let mockPerformanceMonitor
  let mockPoolManager
  
  beforeEach(() => {
    // Clear any existing DOM elements
    document.body.innerHTML = ''
    
    // Mock PerformanceMonitor
    mockPerformanceMonitor = {
      getStats: vi.fn(() => ({
        currentFPS: 60,
        averageFPS: 58.5,
        minFPS: 55,
        maxFPS: 60,
        frameTimeMS: 16.67,
        droppedFrames: 2,
        performanceLevel: 'high'
      })),
      getQualitySettings: vi.fn(() => ({
        maxParticles: 200,
        enableShadows: true,
        enableEffects: true
      })),
      isPerformanceGood: vi.fn(() => true)
    }
    
    // Mock PoolManager
    mockPoolManager = {
      getStats: vi.fn(() => ({
        particles: {
          poolSize: 100,
          activeCount: 45,
          reuseRatio: 0.85
        },
        ingredients: {
          poolSize: 50,
          activeCount: 12,
          reuseRatio: 0.92
        }
      }))
    }
    
    ui = new PerformanceUI({
      enabled: false,
      position: 'top-left',
      showFPS: true,
      showPools: true,
      showQuality: true
    })
  })
  
  afterEach(() => {
    if (ui.container) {
      ui.destroy()
    }
  })
  
  describe('Initialization', () => {
    it('should initialize with default options', () => {
      const defaultUI = new PerformanceUI()
      expect(defaultUI.enabled).toBe(false)
      expect(defaultUI.position).toBe('top-left')
      expect(defaultUI.updateInterval).toBe(250)
      expect(defaultUI.showFPS).toBe(true)
    })
    
    it('should initialize with custom options', () => {
      expect(ui.enabled).toBe(false)
      expect(ui.position).toBe('top-left')
      expect(ui.showFPS).toBe(true)
      expect(ui.showPools).toBe(true)
    })
    
    it('should not create UI when disabled', () => {
      expect(ui.container).toBeNull()
      expect(document.getElementById('performance-ui')).toBeNull()
    })
    
    it('should create UI when enabled', () => {
      const enabledUI = new PerformanceUI({ enabled: true })
      expect(enabledUI.container).not.toBeNull()
      expect(document.getElementById('performance-ui')).not.toBeNull()
      enabledUI.destroy()
    })
  })
  
  describe('UI Creation', () => {
    beforeEach(() => {
      ui.createUI()
    })
    
    it('should create container element', () => {
      expect(ui.container).not.toBeNull()
      expect(ui.container.id).toBe('performance-ui')
    })
    
    it('should apply correct positioning styles', () => {
      expect(ui.container.style.position).toBe('fixed')
      expect(ui.container.style.top).toBe('10px')
      expect(ui.container.style.left).toBe('10px')
    })
    
    it('should create FPS section when enabled', () => {
      expect(ui.elements.fps).not.toBeNull()
      expect(ui.elements.avgFps).not.toBeNull()
      expect(ui.elements.minFps).not.toBeNull()
      expect(ui.elements.frameTime).not.toBeNull()
    })
    
    it('should create quality section when enabled', () => {
      expect(ui.elements.qualityLevel).not.toBeNull()
      expect(ui.elements.maxParticles).not.toBeNull()
      expect(ui.elements.shadows).not.toBeNull()
      expect(ui.elements.effects).not.toBeNull()
    })
    
    it('should create pools section when enabled', () => {
      expect(ui.elements.poolsContent).not.toBeNull()
    })
    
    it('should create toggle button', () => {
      const button = ui.container.querySelector('button')
      expect(button).not.toBeNull()
      expect(button.innerHTML).toBe('👁️')
    })
  })
  
  describe('Display Updates', () => {
    beforeEach(() => {
      ui.createUI()
      ui.init(mockPerformanceMonitor, mockPoolManager)
      ui.enabled = true
    })
    
    it('should update FPS display', () => {
      ui.update(1000)
      
      expect(ui.elements.fps.textContent).toBe('60.0')
      expect(ui.elements.avgFps.textContent).toBe('58.5')
      expect(ui.elements.minFps.textContent).toBe('55.0')
      expect(ui.elements.frameTime.textContent).toBe('16.67')
      expect(ui.elements.drops.textContent).toBe('2')
    })
    
    it('should color code FPS based on performance', () => {
      ui.update(1000)
      expect(ui.elements.fps.style.color).toBe('#51cf66') // Green for 60 FPS
      
      mockPerformanceMonitor.getStats.mockReturnValue({
        currentFPS: 30,
        averageFPS: 30,
        minFPS: 25,
        maxFPS: 35,
        frameTimeMS: 33.33,
        droppedFrames: 10,
        performanceLevel: 'low'
      })
      
      ui.update(2000)
      expect(ui.elements.fps.style.color).toBe('#ff8c42') // Orange for 30 FPS
    })
    
    it('should update quality display', () => {
      ui.update(1000)
      
      expect(ui.elements.qualityLevel.textContent).toBe('high')
      expect(ui.elements.maxParticles.textContent).toBe('200')
      expect(ui.elements.shadows.textContent).toBe('✅')
      expect(ui.elements.effects.textContent).toBe('✅')
    })
    
    it('should update pool statistics', () => {
      ui.update(1000)
      
      const poolsHTML = ui.elements.poolsContent.innerHTML
      expect(poolsHTML).toContain('particles')
      expect(poolsHTML).toContain('45/145') // activeCount / (poolSize + activeCount)
      expect(poolsHTML).toContain('Use: 31%')
      expect(poolsHTML).toContain('Reuse: 85%')
    })
    
    it('should throttle updates', () => {
      const statsSpy = vi.spyOn(mockPerformanceMonitor, 'getStats')
      
      ui.update(1000)
      ui.update(1100) // Too soon, should be ignored
      ui.update(1200) // Still too soon
      
      expect(statsSpy).toHaveBeenCalledTimes(1)
      
      ui.update(1300) // 300ms later, should update
      expect(statsSpy).toHaveBeenCalledTimes(2)
    })
  })
  
  describe('Visibility Control', () => {
    beforeEach(() => {
      ui.createUI()
    })
    
    it('should toggle visibility', () => {
      expect(ui.enabled).toBe(false)
      expect(ui.container.style.display).toBe('')
      
      ui.toggle()
      expect(ui.enabled).toBe(true)
      expect(ui.container.style.display).toBe('block')
      
      ui.toggle()
      expect(ui.enabled).toBe(false)
      expect(ui.container.style.display).toBe('none')
    })
    
    it('should show UI', () => {
      ui.show()
      expect(ui.enabled).toBe(true)
      expect(ui.container.style.display).toBe('block')
    })
    
    it('should hide UI', () => {
      ui.show()
      ui.hide()
      expect(ui.enabled).toBe(false)
      expect(ui.container.style.display).toBe('none')
    })
    
    it('should have enabled property reflect visibility', () => {
      expect(ui.enabled).toBe(false)
      
      ui.show()
      expect(ui.enabled).toBe(true)
      
      ui.hide()
      expect(ui.enabled).toBe(false)
    })
  })
  
  describe('Configuration', () => {
    it('should set position', () => {
      ui.createUI()
      ui.setPosition('bottom-right')
      
      expect(ui.position).toBe('bottom-right')
      expect(ui.container.style.bottom).toBe('10px')
      expect(ui.container.style.right).toBe('10px')
    })
    
    it('should configure display options', () => {
      ui.configure({
        showFPS: false,
        showGraph: true,
        showDetails: true
      })
      
      expect(ui.showFPS).toBe(false)
      expect(ui.showGraph).toBe(true)
      expect(ui.showDetails).toBe(true)
    })
    
    it('should recreate UI on configuration change', () => {
      ui.createUI()
      const oldContainer = ui.container
      
      ui.configure({ showGraph: true })
      
      expect(ui.container).not.toBe(oldContainer)
      expect(ui.elements.graph).toBeDefined()
    })
  })
  
  describe('Graph Display', () => {
    beforeEach(() => {
      ui = new PerformanceUI({
        enabled: true,
        showGraph: true
      })
      ui.init(mockPerformanceMonitor, mockPoolManager)
    })
    
    it('should create graph canvas', () => {
      expect(ui.elements.graph).not.toBeNull()
      expect(ui.elements.graph.tagName).toBe('CANVAS')
      expect(ui.graphCtx).not.toBeNull()
    })
    
    it('should update FPS history', () => {
      expect(ui.fpsHistory.length).toBe(0)
      
      ui.update(1000)
      ui.update(1300)
      ui.update(1600)
      
      expect(ui.fpsHistory.length).toBe(3)
      expect(ui.fpsHistory).toContain(60)
    })
    
    it('should limit history size', () => {
      // Fill history beyond max
      for (let i = 0; i < 150; i++) {
        ui.update(i * 300)
      }
      
      expect(ui.fpsHistory.length).toBeLessThanOrEqual(ui.maxHistory)
    })
  })
  
  describe('Detailed Metrics', () => {
    beforeEach(() => {
      ui = new PerformanceUI({
        enabled: true,
        showDetails: true
      })
      ui.init(mockPerformanceMonitor, mockPoolManager)
    })
    
    it('should display memory usage', () => {
      // Mock performance.memory
      global.performance.memory = {
        usedJSHeapSize: 50 * 1024 * 1024 // 50MB
      }
      
      ui.update(1000, {})
      
      expect(ui.elements.memory.textContent).toBe('50.0MB')
    })
    
    it('should display entity count', () => {
      const gameData = {
        particles: new Array(20),
        ingredients: new Array(15),
        powerUps: new Array(3)
      }
      
      ui.update(1000, gameData)
      
      expect(ui.elements.entities.textContent).toBe('38')
    })
    
    it('should display performance health', () => {
      ui.update(1000)
      
      expect(ui.elements.health.textContent).toBe('✅ Good')
      expect(ui.elements.health.style.color).toBe('#51cf66')
      
      mockPerformanceMonitor.isPerformanceGood.mockReturnValue(false)
      ui.update(1300)
      
      expect(ui.elements.health.textContent).toBe('⚠️ Poor')
      expect(ui.elements.health.style.color).toBe('#ff6b6b')
    })
  })
  
  describe('Cleanup', () => {
    it('should destroy UI elements', () => {
      ui.createUI()
      expect(document.getElementById('performance-ui')).not.toBeNull()
      
      ui.destroy()
      
      expect(ui.container).toBeNull()
      expect(ui.elements).toEqual({})
      expect(document.getElementById('performance-ui')).toBeNull()
    })
    
    it('should handle multiple destroy calls', () => {
      ui.createUI()
      
      expect(() => {
        ui.destroy()
        ui.destroy()
      }).not.toThrow()
    })
  })
  
  describe('Edge Cases', () => {
    it('should handle missing performance monitor', () => {
      ui.createUI()
      ui.enabled = true
      
      expect(() => {
        ui.update(1000)
      }).not.toThrow()
    })
    
    it('should handle missing pool manager', () => {
      ui.createUI()
      ui.init(mockPerformanceMonitor, null)
      ui.enabled = true
      
      expect(() => {
        ui.update(1000)
      }).not.toThrow()
    })
    
    it('should handle empty game data', () => {
      ui = new PerformanceUI({
        enabled: true,
        showDetails: true
      })
      ui.init(mockPerformanceMonitor, mockPoolManager)
      
      expect(() => {
        ui.update(1000)
        ui.update(1000, {})
        ui.update(1000, null)
      }).not.toThrow()
    })
  })
})