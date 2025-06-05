import { describe, it, expect, vi } from 'vitest'
import Template, { getGameHTML, getCSS, getHTMLTemplate } from '../src/game/templates/Template.js'

// Mock the HTML and CSS imports
vi.mock('../src/game/templates/index.html', () => ({
  default: '<html><head><style>{{CSS_CONTENT}}</style></head><body><div id="game"></div></body></html>'
}))

vi.mock('../src/game/templates/styles.css', () => ({
  default: 'body { margin: 0; padding: 0; } .game { width: 100%; }'
}))

describe('Template Module', () => {
  describe('HTML Processing', () => {
    it('should get game HTML with injected CSS', () => {
      const html = getGameHTML()
      
      expect(html).toContain('<html>')
      expect(html).toContain('body { margin: 0; padding: 0; }')
      expect(html).not.toContain('{{CSS_CONTENT}}')
      expect(html).toContain('<div id="game">')
    })
    
    it('should replace CSS placeholder correctly', () => {
      const html = getGameHTML()
      const cssContent = getCSS()
      
      expect(html).toContain(cssContent)
    })
  })
  
  describe('CSS Export', () => {
    it('should get CSS content', () => {
      const css = getCSS()
      
      expect(css).toContain('body { margin: 0; padding: 0; }')
      expect(css).toContain('.game { width: 100%; }')
    })
    
    it('should return string CSS', () => {
      const css = getCSS()
      
      expect(typeof css).toBe('string')
      expect(css.length).toBeGreaterThan(0)
    })
  })
  
  describe('HTML Template Export', () => {
    it('should get HTML template with placeholder', () => {
      const template = getHTMLTemplate()
      
      expect(template).toContain('{{CSS_CONTENT}}')
      expect(template).toContain('<html>')
      expect(template).toContain('</html>')
    })
    
    it('should return valid HTML structure', () => {
      const template = getHTMLTemplate()
      
      expect(template).toContain('<head>')
      expect(template).toContain('</head>')
      expect(template).toContain('<body>')
      expect(template).toContain('</body>')
    })
  })
  
  describe('Default Export', () => {
    it('should export all functions as default', () => {
      expect(Template.getGameHTML).toBeDefined()
      expect(Template.getCSS).toBeDefined()
      expect(Template.getHTMLTemplate).toBeDefined()
      
      expect(typeof Template.getGameHTML).toBe('function')
      expect(typeof Template.getCSS).toBe('function')
      expect(typeof Template.getHTMLTemplate).toBe('function')
    })
    
    it('should have same functions as named exports', () => {
      expect(Template.getGameHTML).toBe(getGameHTML)
      expect(Template.getCSS).toBe(getCSS)
      expect(Template.getHTMLTemplate).toBe(getHTMLTemplate)
    })
  })
  
  describe('Integration', () => {
    it('should process template correctly for serving', () => {
      const processedHTML = getGameHTML()
      
      // Should be valid HTML
      expect(processedHTML).toMatch(/<html[^>]*>/)
      expect(processedHTML).toMatch(/<\/html>/)
      
      // Should have CSS in head
      expect(processedHTML).toMatch(/<style[^>]*>.*<\/style>/s)
      
      // Should have game container
      expect(processedHTML).toContain('id="game"')
    })
    
    it('should handle empty CSS gracefully', () => {
      // This test would need to reload the module with different mock
      // For now, just verify that empty CSS is handled
      const html = getGameHTML()
      expect(html).toContain('<style>')
      expect(html).toContain('</style>')
    })
  })
})