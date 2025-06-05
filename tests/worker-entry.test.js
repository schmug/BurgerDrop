import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock the Template module
vi.mock('../src/game/templates/Template.js', () => ({
  getGameHTML: vi.fn(() => '<html><body>Game HTML</body></html>')
}))

// Mock the Game module
vi.mock('../src/game/Game.js', () => ({
  default: class MockGame {
    constructor() {
      this.initialized = true
    }
  }
}))

describe('Worker Entry', () => {
  let mockFetchEvent
  let fetchHandler
  
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks()
    
    // Reset modules to ensure fresh imports
    vi.resetModules()
    
    // Mock the global addEventListener
    global.addEventListener = vi.fn((event, handler) => {
      if (event === 'fetch') {
        fetchHandler = handler
      }
    })
  })
  
  describe('Fetch Event Handler', () => {
    it('should register fetch event listener', async () => {
      // Import the worker entry to register the event listener
      await import('../src/game/worker-entry.js')
      
      expect(global.addEventListener).toHaveBeenCalledWith('fetch', expect.any(Function))
    })
    
    it('should serve game HTML for root path', async () => {
      // Import modules
      await import('../src/game/worker-entry.js')
      const { getGameHTML } = await import('../src/game/templates/Template.js')
      
      // Create mock event
      const mockRequest = new Request('https://example.com/')
      let responsePromise
      mockFetchEvent = {
        request: mockRequest,
        respondWith: vi.fn((promise) => {
          responsePromise = promise
        })
      }
      
      // Call the fetch handler
      fetchHandler(mockFetchEvent)
      
      // Wait for response
      const response = await responsePromise
      
      expect(getGameHTML).toHaveBeenCalled()
      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toBe('text/html;charset=UTF-8')
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600')
      
      const body = await response.text()
      expect(body).toBe('<html><body>Game HTML</body></html>')
    })
    
    it('should serve game HTML for index.html', async () => {
      await import('../src/game/worker-entry.js')
      const { getGameHTML } = await import('../src/game/templates/Template.js')
      
      const mockRequest = new Request('https://example.com/index.html')
      let responsePromise
      mockFetchEvent = {
        request: mockRequest,
        respondWith: vi.fn((promise) => {
          responsePromise = promise
        })
      }
      
      fetchHandler(mockFetchEvent)
      const response = await responsePromise
      
      expect(getGameHTML).toHaveBeenCalled()
      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toBe('text/html;charset=UTF-8')
    })
    
    it('should return 404 for other paths', async () => {
      await import('../src/game/worker-entry.js')
      
      const mockRequest = new Request('https://example.com/other-path')
      let responsePromise
      mockFetchEvent = {
        request: mockRequest,
        respondWith: vi.fn((promise) => {
          responsePromise = promise
        })
      }
      
      fetchHandler(mockFetchEvent)
      const response = await responsePromise
      
      expect(response.status).toBe(404)
      const body = await response.text()
      expect(body).toBe('Not Found')
    })
    
    it('should handle trailing slash on root', async () => {
      await import('../src/game/worker-entry.js')
      
      const mockRequest = new Request('https://example.com/')
      let responsePromise
      mockFetchEvent = {
        request: mockRequest,
        respondWith: vi.fn((promise) => {
          responsePromise = promise
        })
      }
      
      fetchHandler(mockFetchEvent)
      const response = await responsePromise
      
      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toBe('text/html;charset=UTF-8')
    })
    
    it('should handle query parameters', async () => {
      await import('../src/game/worker-entry.js')
      
      const mockRequest = new Request('https://example.com/?debug=true')
      let responsePromise
      mockFetchEvent = {
        request: mockRequest,
        respondWith: vi.fn((promise) => {
          responsePromise = promise
        })
      }
      
      fetchHandler(mockFetchEvent)
      const response = await responsePromise
      
      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toBe('text/html;charset=UTF-8')
    })
  })
  
  describe('Response Headers', () => {
    beforeEach(async () => {
      await import('../src/game/worker-entry.js')
    })
    
    it('should set proper cache headers', async () => {
      const mockRequest = new Request('https://example.com/')
      let responsePromise
      mockFetchEvent = {
        request: mockRequest,
        respondWith: vi.fn((promise) => {
          responsePromise = promise
        })
      }
      
      fetchHandler(mockFetchEvent)
      const response = await responsePromise
      
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600')
    })
    
    it('should set proper content type', async () => {
      const mockRequest = new Request('https://example.com/')
      let responsePromise
      mockFetchEvent = {
        request: mockRequest,
        respondWith: vi.fn((promise) => {
          responsePromise = promise
        })
      }
      
      fetchHandler(mockFetchEvent)
      const response = await responsePromise
      
      expect(response.headers.get('content-type')).toBe('text/html;charset=UTF-8')
    })
  })
  
  describe('Error Handling', () => {
    it('should handle errors in getGameHTML gracefully', async () => {
      await import('../src/game/worker-entry.js')
      const { getGameHTML } = await import('../src/game/templates/Template.js')
      
      // Make getGameHTML throw an error
      getGameHTML.mockImplementation(() => {
        throw new Error('Template error')
      })
      
      const mockRequest = new Request('https://example.com/')
      let responsePromise
      let errorThrown = false
      
      mockFetchEvent = {
        request: mockRequest,
        respondWith: vi.fn((promise) => {
          responsePromise = promise
          // Catch any errors from the promise
          promise.catch(() => {
            errorThrown = true
          })
        })
      }
      
      // Call handler and expect it to throw
      fetchHandler(mockFetchEvent)
      
      // The respondWith should be called with a promise that rejects
      await expect(responsePromise).rejects.toThrow('Template error')
    })
  })
})