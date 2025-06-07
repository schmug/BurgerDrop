// Cloudflare Worker entry point
// This file serves the game HTML with embedded JavaScript

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Serve the game HTML file for all requests
  if (url.pathname === '/' || url.pathname === '/index.html') {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Burger Drop! - Restaurant Game</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍔</text></svg>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka+One:wght@400&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
/* INJECT_CSS_HERE */
    </style>
</head>
<body>
    <div class="top-bar">
        <div class="logo">
            <span style="font-size: 36px;">🍔</span>
            <span>Burger Drop!</span>
        </div>
        <div class="score-display" id="scoreDisplay">Score: 0</div>
        <button class="audio-toggle" id="audioToggle" aria-label="Toggle Audio">🔊</button>
    </div>

    <div class="performance-overlay" id="performanceOverlay"></div>

    <div class="game-container">
        <canvas id="gameCanvas"></canvas>
    </div>

    <div class="game-over-overlay" id="gameOverOverlay">
        <div class="game-over-content">
            <h1 class="game-over-title">Game Over! 🍔</h1>
            <div class="final-score">Final Score: <span id="finalScore">0</span></div>
            <div class="high-score">High Score: <span id="highScore">0</span></div>
            <button class="play-again-btn" id="playAgainBtn">Play Again!</button>
        </div>
    </div>

    <script>
/* INJECT_GAME_HERE */

        // Wait for DOM to be ready before initializing the game
        function initGame() {
            const canvas = document.getElementById('gameCanvas');
            if (canvas && typeof Game !== 'undefined') {
                const game = new Game(canvas, {
                    enablePerformanceMonitoring: false,
                    showPerformanceUI: false
                });
                game.start();
                
                // Setup UI event handlers
                const audioToggle = document.getElementById('audioToggle');
                const playAgainBtn = document.getElementById('playAgainBtn');
                
                if (audioToggle) {
                    audioToggle.addEventListener('click', () => {
                        game.audioSystem.setEnabled(!game.audioSystem.isEnabled());
                        audioToggle.textContent = game.audioSystem.isEnabled() ? '🔊' : '🔇';
                    });
                }
                
                if (playAgainBtn) {
                    playAgainBtn.addEventListener('click', () => {
                        document.getElementById('gameOverOverlay').style.display = 'none';
                        game.start();
                    });
                }
                
                // Make game available globally for debugging
                window.game = game;
            }
        }
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initGame);
        } else {
            initGame();
        }
    </script>
</body>
</html>`;

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