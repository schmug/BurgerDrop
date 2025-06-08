// Cloudflare Worker template
// This file will be processed by build-worker.js to inject CSS and game bundle

export default {
  async fetch(request, env, ctx) {
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
{{CSS_CONTENT}}
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
{{GAME_BUNDLE}}

        // Wait for DOM to be ready before initializing the game
        function initGame() {
            const canvas = document.getElementById('gameCanvas');
            if (canvas && typeof Game !== 'undefined') {
                const game = new Game(canvas, {
                    enablePerformanceMonitoring: false,
                    showPerformanceUI: false
                });
                
                // Start the game immediately
                game.start();
                
                // Setup UI event handlers
                const audioToggle = document.getElementById('audioToggle');
                const playAgainBtn = document.getElementById('playAgainBtn');
                const startButton = document.getElementById('startButton');
                const resumeButton = document.getElementById('resumeButton');
                const restartButton = document.getElementById('restartButton');
                const quitButton = document.getElementById('quitButton');
                const menuButton = document.getElementById('menuButton');
                
                // Start button handler
                if (startButton) {
                    startButton.addEventListener('click', () => {
                        const startScreen = document.getElementById('startScreen');
                        if (startScreen) {
                            startScreen.style.display = 'none';
                        }
                        game.start();
                    });
                }
                
                // Resume button handler
                if (resumeButton) {
                    resumeButton.addEventListener('click', () => {
                        const pauseScreen = document.getElementById('pauseScreen');
                        if (pauseScreen) {
                            pauseScreen.style.display = 'none';
                        }
                        game.resume();
                    });
                }
                
                // Restart button handler  
                if (restartButton) {
                    restartButton.addEventListener('click', () => {
                        const gameOverScreen = document.getElementById('gameOverScreen');
                        if (gameOverScreen) {
                            gameOverScreen.style.display = 'none';
                        }
                        game.start();
                    });
                }
                
                // Quit button handler
                if (quitButton) {
                    quitButton.addEventListener('click', () => {
                        const pauseScreen = document.getElementById('pauseScreen');
                        if (pauseScreen) {
                            pauseScreen.style.display = 'none';
                        }
                        const startScreen = document.getElementById('startScreen');
                        if (startScreen) {
                            startScreen.style.display = '';
                        }
                        game.stop();
                    });
                }
                
                // Menu button handler
                if (menuButton) {
                    menuButton.addEventListener('click', () => {
                        const gameOverScreen = document.getElementById('gameOverScreen');
                        if (gameOverScreen) {
                            gameOverScreen.style.display = 'none';
                        }
                        const startScreen = document.getElementById('startScreen');
                        if (startScreen) {
                            startScreen.style.display = '';
                        }
                    });
                }
                
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
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  },
};