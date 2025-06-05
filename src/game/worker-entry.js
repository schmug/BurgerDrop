// Cloudflare Worker entry point for BurgerDrop Game
import Game from './Game.js';
import { getGameHTML } from './templates/Template.js';

// Export the game class for use in the HTML
export { Game };

// Cloudflare Worker event listener
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Serve the game HTML file for all requests
  if (url.pathname === '/' || url.pathname === '/index.html') {
    const html = getGameHTML();

    return new Response(html, {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  }

  // Return 404 for other paths
  return new Response('Not Found', { status: 404 })
}