import { describe, it, expect, beforeEach, vi } from 'vitest'

let fetchHandler

// Mock the Template module to avoid HTML import issues
vi.mock('../src/game/templates/Template.js', () => ({
  getGameHTML: vi.fn(() => '<html><body>Game HTML</body></html>')
}))

// Mock the Game module to avoid complex imports
vi.mock('../src/game/Game.js', () => ({
  default: class MockGame {}
}))

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
  global.addEventListener = vi.fn((event, handler) => {
    if (event === 'fetch') {
      fetchHandler = handler
    }
  })
})

describe('Cloudflare Worker', () => {
  it('should handle fetch events', async () => {
    await import('../src/game/worker-entry.js')

    expect(global.addEventListener).toHaveBeenCalledWith('fetch', expect.any(Function))
  })

  it('should serve HTML for root path', async () => {
    await import('../src/game/worker-entry.js')

    const mockEvent = {
      request: new Request('https://example.com/'),
      respondWith: vi.fn()
    }

    let responsePromise
    mockEvent.respondWith.mockImplementation(p => { responsePromise = p })

    fetchHandler(mockEvent)
    const response = await responsePromise

    expect(response.headers.get('content-type')).toBe('text/html;charset=UTF-8')
  })
})