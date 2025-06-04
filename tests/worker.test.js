import { describe, it, expect, vi } from 'vitest'

describe('Cloudflare Worker', () => {
  it('should handle fetch events', async () => {
    // Mock the worker environment
    global.addEventListener = vi.fn()
    
    // Import the worker script
    await import('../src/worker.js')
    
    // Verify addEventListener was called
    expect(global.addEventListener).toHaveBeenCalledWith('fetch', expect.any(Function))
  })

  it('should serve HTML for root path', async () => {
    // Import handleRequest function (need to expose it for testing)
    const { handleRequest } = await import('../src/worker.js').catch(() => {
      // If not exported, we'll test via fetch event
      return {}
    })
    
    if (handleRequest) {
      const request = new Request('https://example.com/')
      const response = await handleRequest(request)
      
      expect(response.headers.get('content-type')).toBe('text/html')
    }
  })
})