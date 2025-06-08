// Cloudflare Worker - Final bundled version
import htmlTemplate from './templates/index.html';
import cssContent from './templates/styles.css';
import gameBundle from '../build/game.iife.js';

// Cloudflare Worker event listener
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Serve the game HTML file for all requests
  if (url.pathname === '/' || url.pathname === '/index.html') {
    // Build the HTML with CSS injected
    let html = htmlTemplate.replace('{{CSS_CONTENT}}', cssContent);
    
    // Inject the game bundle
    const gameScript = `<script>${gameBundle}</script>`;
    
    // Replace the script section in the HTML
    html = html.replace(/<script>[\s\S]*?<\/script>/, gameScript);

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