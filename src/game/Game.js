/**
 * BurgerDrop Game - Cloudflare Worker Entry Point
 * 
 * This file serves as the main entry point for the Rollup build.
 * For now, it simply re-exports the existing worker functionality
 * while we transition to the modular architecture.
 */

// Import the existing worker content as a string
// For now, we'll just create the worker functionality directly here

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // For now, we'll import the original worker content
  // This is a temporary solution while we complete the modularization
  const { default: originalWorker } = await import('../worker.js.backup')
  
  // Serve the game HTML file for all requests
  if (url.pathname === '/' || url.pathname === '/index.html') {
    return new Response(await getGameHTML(), {
      headers: {
        'content-type': 'text/html',
        'cache-control': 'max-age=86400'
      }
    })
  }
  
  return new Response('Not found', { status: 404 })
}

// For now, let's create a simple HTML response that loads our current game
async function getGameHTML() {
  // This is temporary - we'll replace this with the modular version
  const fs = await import('fs')
  const path = await import('path')
  
  try {
    // Read the original worker file and extract the HTML
    const workerContent = fs.readFileSync(new URL('../worker.js.backup', import.meta.url), 'utf8')
    const htmlMatch = workerContent.match(/const html = `([\s\S]*?)`;?\s*return new Response/)
    
    if (htmlMatch) {
      return htmlMatch[1]
    }
  } catch (error) {
    console.warn('Could not extract HTML from original worker:', error)
  }
  
  // Fallback HTML
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Burger Drop! - Restaurant Game</title>
</head>
<body>
    <h1>Burger Drop - Modularization In Progress</h1>
    <p>The game is being refactored to a modular architecture. Please check back soon!</p>
</body>
</html>`
}