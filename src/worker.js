<<<<<<< HEAD
// BurgerDrop Game - Built from modular source
// Auto-generated - do not edit directly
var htmlTemplate = "<!DOCTYPE html>\r\n<html lang=\"en\">\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\">\r\n    <title>Burger Drop! - Restaurant Game</title>\r\n    <link rel=\"icon\" href=\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍔</text></svg>\">\r\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\r\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\r\n    <link href=\"https://fonts.googleapis.com/css2?family=Fredoka+One:wght@400&family=Nunito:wght@400;600;700;800&display=swap\" rel=\"stylesheet\">\r\n    <style>\r\n        {{CSS_CONTENT}}\r\n    </style>\r\n</head>\r\n<body>\r\n    <div class=\"top-bar\">\r\n        <div class=\"logo\">\r\n            <span style=\"font-size: 36px;\">🍔</span>\r\n            <span>Burger Drop!</span>\r\n        </div>\r\n        <div class=\"score-display\" id=\"scoreDisplay\">Score: 0</div>\r\n        <button class=\"audio-toggle\" id=\"audioToggle\" aria-label=\"Toggle Audio\">🔊</button>\r\n    </div>\r\n\r\n    <div class=\"performance-overlay\" id=\"performanceOverlay\"></div>\r\n\r\n    <div class=\"game-container\">\r\n        <canvas id=\"gameCanvas\"></canvas>\r\n    </div>\r\n\r\n    <div class=\"game-over-overlay\" id=\"gameOverOverlay\">\r\n        <div class=\"game-over-content\">\r\n            <h1 class=\"game-over-title\">Game Over! 🍔</h1>\r\n            <div class=\"final-score\">Final Score: <span id=\"finalScore\">0</span></div>\r\n            <div class=\"high-score\">High Score: <span id=\"highScore\">0</span></div>\r\n            <button class=\"play-again-btn\" id=\"playAgainBtn\">Play Again!</button>\r\n        </div>\r\n    </div>\r\n\r\n    <script>\r\n        // Wait for DOM to be ready before initializing the game\r\n        function initGame() {\r\n            const canvas = document.getElementById('gameCanvas');\r\n            if (canvas && typeof Game !== 'undefined') {\r\n                const game = new Game(canvas, {\r\n                    enablePerformanceMonitoring: false,\r\n                    showPerformanceUI: false\r\n                });\r\n                game.start();\r\n                \r\n                // Setup UI event handlers\r\n                const audioToggle = document.getElementById('audioToggle');\r\n                const playAgainBtn = document.getElementById('playAgainBtn');\r\n                \r\n                if (audioToggle) {\r\n                    audioToggle.addEventListener('click', () => {\r\n                        game.audioSystem.setEnabled(!game.audioSystem.isEnabled());\r\n                        audioToggle.textContent = game.audioSystem.isEnabled() ? '🔊' : '🔇';\r\n                    });\r\n                }\r\n                \r\n                if (playAgainBtn) {\r\n                    playAgainBtn.addEventListener('click', () => {\r\n                        document.getElementById('gameOverOverlay').style.display = 'none';\r\n                        game.start();\r\n                    });\r\n                }\r\n                \r\n                // Make game available globally for debugging\r\n                window.game = game;\r\n            }\r\n        }\r\n        \r\n        if (document.readyState === 'loading') {\r\n            document.addEventListener('DOMContentLoaded', initGame);\r\n        } else {\r\n            initGame();\r\n        }\r\n    </script>\r\n</body>\r\n</html>";

var cssContent = "/* BurgerDrop Game Styles */\r\n\r\n* {\r\n    margin: 0;\r\n    padding: 0;\r\n    box-sizing: border-box;\r\n    user-select: none;\r\n    -webkit-user-select: none;\r\n    -webkit-touch-callout: none;\r\n}\r\n\r\nbody {\r\n    font-family: 'Nunito', 'Arial', sans-serif;\r\n    background: \r\n        radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.3) 0%, transparent 50%),\r\n        radial-gradient(circle at 80% 20%, rgba(255, 165, 0, 0.2) 0%, transparent 50%),\r\n        conic-gradient(from 45deg at 50% 50%, #87CEEB, #98D8C8, #87CEEB, #98D8C8);\r\n    overflow: hidden;\r\n    position: fixed;\r\n    width: 100%;\r\n    height: 100%;\r\n    animation: subtleShift 20s ease-in-out infinite;\r\n}\r\n\r\n#gameCanvas {\r\n    background: \r\n        radial-gradient(ellipse at top, rgba(255, 255, 255, 0.2) 0%, transparent 70%),\r\n        linear-gradient(135deg, #FFE4B5 0%, #FFDEAD 50%, #DEB887 100%);\r\n    display: block;\r\n    margin: 0 auto;\r\n    border: 3px solid #8B4513;\r\n    box-shadow: \r\n        0 0 20px rgba(139, 69, 19, 0.5),\r\n        inset 0 0 20px rgba(255, 255, 255, 0.1);\r\n    border-radius: 20px;\r\n    transition: transform 0.3s ease;\r\n}\r\n\r\n.game-container {\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    min-height: 100vh;\r\n    padding: 20px;\r\n}\r\n\r\n.top-bar {\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    background: rgba(255, 255, 255, 0.95);\r\n    padding: 15px 20px;\r\n    display: flex;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\r\n    z-index: 1000;\r\n    backdrop-filter: blur(10px);\r\n    border-bottom: 3px solid #8B4513;\r\n}\r\n\r\n.logo {\r\n    font-family: 'Fredoka One', cursive;\r\n    font-size: 28px;\r\n    color: #D2691E;\r\n    text-shadow: 2px 2px 4px rgba(139, 69, 19, 0.3);\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 10px;\r\n}\r\n\r\n.score-display {\r\n    font-family: 'Fredoka One', cursive;\r\n    font-size: 24px;\r\n    color: #FF6347;\r\n    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);\r\n}\r\n\r\n.audio-toggle {\r\n    background: #FFD700;\r\n    border: 3px solid #FFA500;\r\n    border-radius: 50%;\r\n    width: 50px;\r\n    height: 50px;\r\n    font-size: 24px;\r\n    cursor: pointer;\r\n    transition: all 0.3s ease;\r\n    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);\r\n}\r\n\r\n.audio-toggle:hover {\r\n    transform: scale(1.1);\r\n    background: #FFA500;\r\n}\r\n\r\n.audio-toggle:active {\r\n    transform: scale(0.95);\r\n}\r\n\r\n.game-over-overlay {\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n    background: rgba(0, 0, 0, 0.85);\r\n    display: none;\r\n    justify-content: center;\r\n    align-items: center;\r\n    z-index: 2000;\r\n    backdrop-filter: blur(5px);\r\n}\r\n\r\n.game-over-content {\r\n    background: linear-gradient(135deg, #FFEAA7 0%, #FEF9E7 100%);\r\n    padding: 40px;\r\n    border-radius: 25px;\r\n    text-align: center;\r\n    box-shadow: \r\n        0 10px 40px rgba(0, 0, 0, 0.3),\r\n        inset 0 0 30px rgba(255, 255, 255, 0.5);\r\n    border: 5px solid #D2691E;\r\n    max-width: 90%;\r\n    animation: popIn 0.5s ease-out;\r\n}\r\n\r\n@keyframes popIn {\r\n    from {\r\n        transform: scale(0.8);\r\n        opacity: 0;\r\n    }\r\n    to {\r\n        transform: scale(1);\r\n        opacity: 1;\r\n    }\r\n}\r\n\r\n.game-over-title {\r\n    font-family: 'Fredoka One', cursive;\r\n    font-size: 48px;\r\n    color: #D2691E;\r\n    margin-bottom: 20px;\r\n    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2);\r\n}\r\n\r\n.final-score {\r\n    font-size: 36px;\r\n    color: #FF6347;\r\n    margin: 20px 0;\r\n    font-weight: 800;\r\n}\r\n\r\n.high-score {\r\n    font-size: 24px;\r\n    color: #FFA500;\r\n    margin: 10px 0;\r\n    font-weight: 700;\r\n}\r\n\r\n.play-again-btn {\r\n    background: linear-gradient(135deg, #FF6347 0%, #FF4500 100%);\r\n    color: white;\r\n    border: none;\r\n    padding: 15px 40px;\r\n    font-size: 24px;\r\n    font-family: 'Fredoka One', cursive;\r\n    border-radius: 50px;\r\n    cursor: pointer;\r\n    margin-top: 20px;\r\n    box-shadow: \r\n        0 4px 15px rgba(255, 99, 71, 0.4),\r\n        inset 0 -3px 0 rgba(139, 0, 0, 0.3);\r\n    transition: all 0.3s ease;\r\n    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);\r\n}\r\n\r\n.play-again-btn:hover {\r\n    transform: translateY(-2px);\r\n    box-shadow: \r\n        0 6px 20px rgba(255, 99, 71, 0.5),\r\n        inset 0 -3px 0 rgba(139, 0, 0, 0.3);\r\n}\r\n\r\n.play-again-btn:active {\r\n    transform: translateY(0);\r\n    box-shadow: \r\n        0 2px 10px rgba(255, 99, 71, 0.4),\r\n        inset 0 -1px 0 rgba(139, 0, 0, 0.3);\r\n}\r\n\r\n@keyframes subtleShift {\r\n    0%, 100% {\r\n        background-position: 0% 50%;\r\n    }\r\n    50% {\r\n        background-position: 100% 50%;\r\n    }\r\n}\r\n\r\n@media (max-width: 768px) {\r\n    .game-container {\r\n        padding: 10px;\r\n        padding-top: 80px;\r\n    }\r\n    \r\n    .logo {\r\n        font-size: 20px;\r\n    }\r\n    \r\n    .score-display {\r\n        font-size: 18px;\r\n    }\r\n    \r\n    .audio-toggle {\r\n        width: 40px;\r\n        height: 40px;\r\n        font-size: 20px;\r\n    }\r\n    \r\n    .game-over-title {\r\n        font-size: 36px;\r\n    }\r\n    \r\n    .final-score {\r\n        font-size: 28px;\r\n    }\r\n    \r\n    .play-again-btn {\r\n        font-size: 20px;\r\n        padding: 12px 30px;\r\n    }\r\n}\r\n\r\n/* Performance overlay styles */\r\n.performance-overlay {\r\n    position: fixed;\r\n    top: 100px;\r\n    right: 20px;\r\n    background: rgba(0, 0, 0, 0.8);\r\n    color: #0f0;\r\n    font-family: monospace;\r\n    font-size: 12px;\r\n    padding: 10px;\r\n    border-radius: 5px;\r\n    display: none;\r\n    z-index: 3000;\r\n    min-width: 200px;\r\n}\r\n\r\n.performance-overlay.visible {\r\n    display: block;\r\n}\r\n\r\n.performance-overlay div {\r\n    margin: 5px 0;\r\n}\r\n\r\n.performance-overlay .label {\r\n    display: inline-block;\r\n    width: 80px;\r\n    color: #888;\r\n}\r\n\r\n.performance-overlay .value {\r\n    color: #0f0;\r\n}\r\n\r\n.performance-overlay .warning {\r\n    color: #ff0;\r\n}\r\n\r\n.performance-overlay .critical {\r\n    color: #f00;\r\n}";

var gameBundle = "var Game = (function () {\n    'use strict';\n\n    /**\r\n     * Game State Management\r\n     * \r\n     * Centralized state management system replacing global variables.\r\n     * Provides event-driven architecture with validation and debugging capabilities.\r\n     */\r\n\r\n    class GameState {\r\n        constructor() {\r\n            // Core game state\r\n            this.core = {\r\n                running: false,\r\n                score: 0,\r\n                lives: 3,\r\n                combo: 1,\r\n                level: 1,\r\n                frameCount: 0,\r\n                lastTime: 0,\r\n                highScore: this.loadHighScore()\r\n            };\r\n\r\n            // Entity collections\r\n            this.entities = {\r\n                ingredients: [],\r\n                orders: [],\r\n                powerUps: [],\r\n                particles: []\r\n            };\r\n\r\n            // Power-up state\r\n            this.powerUps = {\r\n                speedBoost: { active: false, timeLeft: 0, multiplier: 0.5 },\r\n                timeFreeze: { active: false, timeLeft: 0 },\r\n                scoreMultiplier: { active: false, timeLeft: 0, multiplier: 2 }\r\n            };\r\n\r\n            // UI state\r\n            this.ui = {\r\n                colorTheme: { hue: 200, saturation: 50, lightness: 45 },\r\n                screenEffects: {\r\n                    shake: { intensity: 0, duration: 0, x: 0, y: 0 },\r\n                    flash: { intensity: 0, color: '#ffffff' }\r\n                }\r\n            };\r\n\r\n            // Audio state\r\n            this.audio = {\r\n                enabled: true,\r\n                settings: { master: 0.7, effects: 0.8, music: 0.6 }\r\n            };\r\n\r\n            // Game timing\r\n            this.timing = {\r\n                ingredientSpeed: 4,\r\n                spawnRate: 40,\r\n                lastPowerUpSpawn: 0,\r\n                lastOrderSpawn: 0\r\n            };\r\n\r\n            // Event listeners for state changes\r\n            this.listeners = new Map();\r\n\r\n            // Development mode features\r\n            this.debug = {\r\n                enabled: false,\r\n                history: [],\r\n                validation: true\r\n            };\r\n        }\r\n\r\n        /**\r\n         * Core game state mutations\r\n         */\r\n        updateScore(points) {\r\n            const oldScore = this.core.score;\r\n            this.core.score += Math.floor(points);\r\n            \r\n            // Update high score if needed\r\n            if (this.core.score > this.core.highScore) {\r\n                this.core.highScore = this.core.score;\r\n                this.saveHighScore();\r\n                this.emit('newHighScore', this.core.highScore);\r\n            }\r\n            \r\n            this.emit('scoreChanged', { old: oldScore, new: this.core.score });\r\n        }\r\n\r\n        updateCombo(value) {\r\n            const oldCombo = this.core.combo;\r\n            this.core.combo = Math.max(1, Math.min(value, 10)); // Cap at 10\r\n            this.emit('comboChanged', { old: oldCombo, new: this.core.combo });\r\n        }\r\n\r\n        incrementCombo() {\r\n            this.updateCombo(this.core.combo + 1);\r\n        }\r\n\r\n        resetCombo() {\r\n            this.updateCombo(1);\r\n        }\r\n\r\n        loseLife() {\r\n            const oldLives = this.core.lives;\r\n            this.core.lives = Math.max(0, this.core.lives - 1);\r\n            this.emit('livesChanged', { old: oldLives, new: this.core.lives });\r\n            \r\n            if (this.core.lives === 0) {\r\n                this.emit('gameOver');\r\n            }\r\n        }\r\n\r\n        updateLevel() {\r\n            const newLevel = Math.floor(this.core.score / 1000) + 1;\r\n            if (newLevel !== this.core.level) {\r\n                const oldLevel = this.core.level;\r\n                this.core.level = newLevel;\r\n                this.emit('levelChanged', { old: oldLevel, new: this.core.level });\r\n            }\r\n        }\r\n\r\n        updateFrameCount(deltaTime) {\r\n            this.core.frameCount++;\r\n            this.core.lastTime = performance.now();\r\n        }\r\n\r\n        /**\r\n         * Entity management\r\n         */\r\n        addEntity(type, entity) {\r\n            if (!this.entities[type]) {\r\n                throw new Error(`Unknown entity type: ${type}`);\r\n            }\r\n            \r\n            this.entities[type].push(entity);\r\n            this.emit('entityAdded', { type, entity });\r\n            \r\n            // Apply entity limits\r\n            this.enforceEntityLimits(type);\r\n        }\r\n\r\n        removeEntity(type, predicate) {\r\n            const initialLength = this.entities[type].length;\r\n            this.entities[type] = this.entities[type].filter(predicate);\r\n            const removed = initialLength - this.entities[type].length;\r\n            \r\n            if (removed > 0) {\r\n                this.emit('entitiesRemoved', { type, count: removed });\r\n            }\r\n            \r\n            return removed;\r\n        }\r\n\r\n        clearEntities(type) {\r\n            const count = this.entities[type].length;\r\n            this.entities[type] = [];\r\n            \r\n            if (count > 0) {\r\n                this.emit('entitiesCleared', { type, count });\r\n            }\r\n            \r\n            return count;\r\n        }\r\n\r\n        enforceEntityLimits(type) {\r\n            const limits = {\r\n                ingredients: 25,\r\n                particles: 20,\r\n                powerUps: 2,\r\n                orders: 3\r\n            };\r\n\r\n            const limit = limits[type];\r\n            if (limit && this.entities[type].length > limit) {\r\n                const excess = this.entities[type].length - limit;\r\n                this.entities[type].splice(0, excess); // Remove oldest\r\n                this.emit('entityLimitEnforced', { type, removed: excess });\r\n            }\r\n        }\r\n\r\n        getEntityCount(type) {\r\n            return this.entities[type]?.length || 0;\r\n        }\r\n\r\n        /**\r\n         * Power-up state management\r\n         */\r\n        activatePowerUp(type, duration) {\r\n            if (!this.powerUps[type]) {\r\n                throw new Error(`Unknown power-up type: ${type}`);\r\n            }\r\n\r\n            // Deactivate if already active (reset timer)\r\n            if (this.powerUps[type].active) {\r\n                this.deactivatePowerUp(type);\r\n            }\r\n\r\n            this.powerUps[type].active = true;\r\n            this.powerUps[type].timeLeft = duration;\r\n            \r\n            this.emit('powerUpActivated', { type, duration });\r\n        }\r\n\r\n        updatePowerUps(deltaTime) {\r\n            const deltaMs = deltaTime * 1000;\r\n            \r\n            Object.entries(this.powerUps).forEach(([type, powerUp]) => {\r\n                if (powerUp.active) {\r\n                    powerUp.timeLeft -= deltaMs;\r\n                    \r\n                    if (powerUp.timeLeft <= 0) {\r\n                        this.deactivatePowerUp(type);\r\n                    }\r\n                }\r\n            });\r\n        }\r\n\r\n        deactivatePowerUp(type) {\r\n            if (this.powerUps[type].active) {\r\n                this.powerUps[type].active = false;\r\n                this.powerUps[type].timeLeft = 0;\r\n                this.emit('powerUpDeactivated', { type });\r\n            }\r\n        }\r\n\r\n        isPowerUpActive(type) {\r\n            return this.powerUps[type]?.active || false;\r\n        }\r\n\r\n        getPowerUpTimeLeft(type) {\r\n            return this.powerUps[type]?.timeLeft || 0;\r\n        }\r\n\r\n        /**\r\n         * Game state control\r\n         */\r\n        startGame() {\r\n            this.core.running = true;\r\n            this.core.score = 0;\r\n            this.core.lives = 3;\r\n            this.core.combo = 1;\r\n            this.core.level = 1;\r\n            this.core.frameCount = 0;\r\n            \r\n            // Clear all entities\r\n            Object.keys(this.entities).forEach(type => {\r\n                this.clearEntities(type);\r\n            });\r\n            \r\n            // Reset power-ups\r\n            Object.keys(this.powerUps).forEach(type => {\r\n                this.deactivatePowerUp(type);\r\n            });\r\n            \r\n            // Reset timing\r\n            this.timing.lastPowerUpSpawn = 0;\r\n            this.timing.lastOrderSpawn = 0;\r\n            this.timing.ingredientSpeed = 4;\r\n            this.timing.spawnRate = 40;\r\n            \r\n            this.emit('gameStarted');\r\n        }\r\n\r\n        endGame() {\r\n            this.core.running = false;\r\n            \r\n            // Save high score\r\n            if (this.core.score > this.core.highScore) {\r\n                this.core.highScore = this.core.score;\r\n                this.saveHighScore();\r\n            }\r\n            \r\n            this.emit('gameEnded', { \r\n                score: this.core.score, \r\n                highScore: this.core.highScore \r\n            });\r\n        }\r\n\r\n        pauseGame() {\r\n            this.core.running = false;\r\n            this.emit('gamePaused');\r\n        }\r\n\r\n        resumeGame() {\r\n            this.core.running = true;\r\n            this.emit('gameResumed');\r\n        }\r\n\r\n        isRunning() {\r\n            return this.core.running;\r\n        }\r\n\r\n        /**\r\n         * High score persistence\r\n         */\r\n        loadHighScore() {\r\n            try {\r\n                return parseInt(localStorage.getItem('burgerDropHighScore') || '0');\r\n            } catch (e) {\r\n                console.warn('Could not load high score from localStorage');\r\n                return 0;\r\n            }\r\n        }\r\n\r\n        saveHighScore() {\r\n            try {\r\n                localStorage.setItem('burgerDropHighScore', this.core.highScore.toString());\r\n            } catch (e) {\r\n                console.warn('Could not save high score to localStorage');\r\n            }\r\n        }\r\n\r\n        /**\r\n         * Event system\r\n         */\r\n        on(event, callback) {\r\n            if (!this.listeners.has(event)) {\r\n                this.listeners.set(event, []);\r\n            }\r\n            this.listeners.get(event).push(callback);\r\n        }\r\n\r\n        off(event, callback) {\r\n            const callbacks = this.listeners.get(event);\r\n            if (callbacks) {\r\n                const index = callbacks.indexOf(callback);\r\n                if (index > -1) {\r\n                    callbacks.splice(index, 1);\r\n                }\r\n            }\r\n        }\r\n\r\n        emit(event, data) {\r\n            // Add to debug history if enabled\r\n            if (this.debug.enabled) {\r\n                this.debug.history.push({\r\n                    timestamp: Date.now(),\r\n                    event,\r\n                    data,\r\n                    frameCount: this.core.frameCount\r\n                });\r\n                \r\n                // Keep only last 100 events\r\n                if (this.debug.history.length > 100) {\r\n                    this.debug.history.shift();\r\n                }\r\n            }\r\n\r\n            // Emit to listeners\r\n            const callbacks = this.listeners.get(event);\r\n            if (callbacks) {\r\n                callbacks.forEach(callback => {\r\n                    try {\r\n                        callback(data);\r\n                    } catch (error) {\r\n                        console.error(`Error in event listener for ${event}:`, error);\r\n                    }\r\n                });\r\n            }\r\n        }\r\n\r\n        /**\r\n         * State validation and debugging\r\n         */\r\n        validate() {\r\n            if (!this.debug.validation) return [];\r\n            \r\n            const errors = [];\r\n            \r\n            // Core state validation\r\n            if (this.core.score < 0) errors.push('Score cannot be negative');\r\n            if (this.core.lives < 0) errors.push('Lives cannot be negative');\r\n            if (this.core.combo < 1 || this.core.combo > 10) errors.push('Combo must be between 1-10');\r\n            if (this.core.level < 1) errors.push('Level must be positive');\r\n            \r\n            // Entity validation\r\n            Object.entries(this.entities).forEach(([type, entities]) => {\r\n                if (!Array.isArray(entities)) {\r\n                    errors.push(`Entity collection ${type} must be an array`);\r\n                }\r\n            });\r\n            \r\n            // Power-up validation\r\n            Object.entries(this.powerUps).forEach(([type, powerUp]) => {\r\n                if (powerUp.active && powerUp.timeLeft <= 0) {\r\n                    errors.push(`Active power-up ${type} has invalid timeLeft`);\r\n                }\r\n            });\r\n            \r\n            return errors;\r\n        }\r\n\r\n        getDebugInfo() {\r\n            return {\r\n                core: { ...this.core },\r\n                entityCounts: Object.fromEntries(\r\n                    Object.entries(this.entities).map(([type, arr]) => [type, arr.length])\r\n                ),\r\n                activePowerUps: Object.fromEntries(\r\n                    Object.entries(this.powerUps)\r\n                        .filter(([_, powerUp]) => powerUp.active)\r\n                        .map(([type, powerUp]) => [type, powerUp.timeLeft])\r\n                ),\r\n                ui: { ...this.ui },\r\n                timing: { ...this.timing },\r\n                listenerCounts: Object.fromEntries(\r\n                    Array.from(this.listeners.entries())\r\n                        .map(([event, callbacks]) => [event, callbacks.length])\r\n                ),\r\n                errors: this.validate()\r\n            };\r\n        }\r\n\r\n        enableDebug() {\r\n            this.debug.enabled = true;\r\n            this.debug.validation = true;\r\n            console.log('GameState debugging enabled');\r\n        }\r\n\r\n        disableDebug() {\r\n            this.debug.enabled = false;\r\n            this.debug.validation = false;\r\n            this.debug.history = [];\r\n            console.log('GameState debugging disabled');\r\n        }\r\n\r\n        getDebugHistory() {\r\n            return [...this.debug.history];\r\n        }\r\n    }\n\n    /**\n     * Easing Functions Collection\n     * \n     * Mathematical easing functions for smooth animations and transitions.\n     * All functions take a parameter t (0 to 1) and return the eased value.\n     */\n\n    const easing = {\n        /**\n         * Linear interpolation - no easing\n         * @param {number} t - Progress value (0 to 1)\n         * @returns {number} Eased value\n         */\n        linear: t => t,\n\n        /**\n         * Quadratic ease-in - starts slow, accelerates\n         * @param {number} t - Progress value (0 to 1)\n         * @returns {number} Eased value\n         */\n        easeInQuad: t => t * t,\n\n        /**\n         * Quadratic ease-out - starts fast, decelerates\n         * @param {number} t - Progress value (0 to 1)\n         * @returns {number} Eased value\n         */\n        easeOutQuad: t => t * (2 - t),\n\n        /**\n         * Quadratic ease-in-out - slow start and end, fast middle\n         * @param {number} t - Progress value (0 to 1)\n         * @returns {number} Eased value\n         */\n        easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,\n\n        /**\n         * Cubic ease-in - starts very slow, accelerates strongly\n         * @param {number} t - Progress value (0 to 1)\n         * @returns {number} Eased value\n         */\n        easeInCubic: t => t * t * t,\n\n        /**\n         * Cubic ease-out - starts fast, decelerates strongly\n         * @param {number} t - Progress value (0 to 1)\n         * @returns {number} Eased value\n         */\n        easeOutCubic: t => (--t) * t * t + 1,\n\n        /**\n         * Cubic ease-in-out - very slow start and end, very fast middle\n         * @param {number} t - Progress value (0 to 1)\n         * @returns {number} Eased value\n         */\n        easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,\n\n        /**\n         * Elastic ease-in - spring-like effect at the beginning\n         * @param {number} t - Progress value (0 to 1)\n         * @returns {number} Eased value\n         */\n        easeInElastic: t => {\n            if (t === 0 || t === 1) return t;\n            const p = 0.3;\n            const s = p / 4;\n            return -(Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));\n        },\n\n        /**\n         * Elastic ease-out - spring-like effect at the end\n         * @param {number} t - Progress value (0 to 1)\n         * @returns {number} Eased value\n         */\n        easeOutElastic: t => {\n            if (t === 0 || t === 1) return t;\n            const p = 0.3;\n            const s = p / 4;\n            return Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1;\n        },\n\n        /**\n         * Bounce ease-out - bouncing ball effect at the end\n         * @param {number} t - Progress value (0 to 1)\n         * @returns {number} Eased value\n         */\n        easeOutBounce: t => {\n            if (t < 1 / 2.75) {\n                return 7.5625 * t * t;\n            } else if (t < 2 / 2.75) {\n                return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;\n            } else if (t < 2.5 / 2.75) {\n                return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;\n            } else {\n                return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;\n            }\n        }\n    };\n\n    // Define easeInBounce after easeOutBounce is defined\n    easing.easeInBounce = t => 1 - easing.easeOutBounce(1 - t);\n\n    /**\n     * Particle Entity\n     * \n     * Represents visual effect particles with physics simulation.\n     * Supports multiple types: default, celebration, star, circle, triangle.\n     * Includes gravity, bouncing, rotation, and easing animations.\n     */\n\n\n    class Particle {\n        /**\n         * Create a new particle\n         * @param {number} x - Initial x position\n         * @param {number} y - Initial y position\n         * @param {string} color - Particle color\n         * @param {string} text - Optional text/emoji to display\n         * @param {string} type - Particle type ('default', 'celebration', 'star', 'circle', 'triangle')\n         * @param {object} options - Additional options\n         */\n        constructor(x = 0, y = 0, color = '#FFFFFF', text = '', type = 'default', options = {}) {\n            this.init(x, y, color, text, type, options);\n        }\n        \n        /**\n         * Initialize/reset particle properties (used for object pooling)\n         * @param {number} x - Initial x position\n         * @param {number} y - Initial y position\n         * @param {string} color - Particle color\n         * @param {string} text - Optional text/emoji to display\n         * @param {string} type - Particle type\n         * @param {object} options - Additional options\n         */\n        init(x = 0, y = 0, color = '#FFFFFF', text = '', type = 'default', options = {}) {\n            this.x = x;\n            this.y = y;\n            this.vx = options.vx || (Math.random() - 0.5) * 6;\n            this.vy = options.vy || (-Math.random() * 6 - 3);\n            this.color = color;\n            this.text = text;\n            this.life = 1;\n            this.decay = options.decay || 0.015;\n            this.type = type;\n            this.size = options.size || (Math.random() * 3 + 2);\n            this.rotation = Math.random() * Math.PI * 2;\n            this.rotationSpeed = (Math.random() - 0.5) * 0.2;\n            this.gravity = options.gravity || 0.15;\n            this.bounce = options.bounce || 0.7;\n            this.scale = 1;\n            this.startTime = 0; // Will be set when added to game\n            this.duration = options.duration || (60 + Math.random() * 60); // 1-2 seconds at 60fps\n            \n            // Store canvas dimensions for boundary checks\n            this.canvasWidth = options.canvasWidth || 800;\n            this.canvasHeight = options.canvasHeight || 600;\n            \n            // Pool-friendly properties\n            this.pooled = false;\n            \n            return this;\n        }\n\n        /**\n         * Update particle state\n         * @param {number} frameCount - Current frame count for timing\n         * @param {number} deltaTime - Time elapsed since last frame (optional)\n         */\n        update(frameCount, deltaTime = 1/60) {\n            // Set start time on first update\n            if (this.startTime === 0) {\n                this.startTime = frameCount;\n            }\n            \n            const elapsed = frameCount - this.startTime;\n            const progress = Math.min(elapsed / this.duration, 1);\n            \n            // Physics update\n            this.x += this.vx * deltaTime * 60; // Scale by target framerate\n            this.y += this.vy * deltaTime * 60;\n            this.vy += this.gravity;\n            this.rotation += this.rotationSpeed;\n            \n            // Use custom easing for life decay\n            this.life = 1 - easing.easeOutQuad(progress);\n            \n            // Bounce off ground with easing\n            if (this.y > this.canvasHeight - 10 && this.vy > 0) {\n                this.vy *= -this.bounce;\n                this.vx *= 0.8;\n            }\n            \n            // Enhanced scale animation for celebration particles\n            if (this.type === 'celebration') {\n                const pulseProgress = (frameCount * 0.1 + this.x) % (Math.PI * 2);\n                this.scale = 0.7 + easing.easeInOutCubic(Math.sin(pulseProgress) * 0.5 + 0.5) * 0.6;\n            }\n        }\n\n        /**\n         * Render the particle\n         * @param {CanvasRenderingContext2D} ctx - Canvas rendering context\n         */\n        draw(ctx) {\n            ctx.save();\n            ctx.globalAlpha = this.life;\n            ctx.translate(this.x, this.y);\n            ctx.rotate(this.rotation);\n            ctx.scale(this.scale, this.scale);\n            \n            if (this.text) {\n                ctx.font = `bold ${20 + this.size * 2}px Arial`; // Keep Arial for emoji compatibility\n                ctx.fillStyle = this.color;\n                ctx.textAlign = 'center';\n                ctx.textBaseline = 'middle';\n                \n                // Add glow effect for special particles\n                if (this.type === 'celebration') {\n                    ctx.shadowColor = this.color;\n                    ctx.shadowBlur = 10;\n                }\n                \n                ctx.fillText(this.text, 0, 0);\n            } else {\n                // Different shapes based on type\n                ctx.fillStyle = this.color;\n                \n                switch(this.type) {\n                    case 'star':\n                        this.drawStar(ctx);\n                        break;\n                    case 'circle':\n                        ctx.beginPath();\n                        ctx.arc(0, 0, this.size, 0, Math.PI * 2);\n                        ctx.fill();\n                        break;\n                    case 'triangle':\n                        ctx.beginPath();\n                        ctx.moveTo(0, -this.size);\n                        ctx.lineTo(-this.size, this.size);\n                        ctx.lineTo(this.size, this.size);\n                        ctx.closePath();\n                        ctx.fill();\n                        break;\n                    default:\n                        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);\n                }\n            }\n            ctx.restore();\n        }\n        \n        /**\n         * Draw a star shape\n         * @param {CanvasRenderingContext2D} ctx - Canvas rendering context\n         */\n        drawStar(ctx) {\n            const spikes = 5;\n            const outerRadius = this.size;\n            const innerRadius = this.size * 0.4;\n            \n            ctx.beginPath();\n            for (let i = 0; i < spikes; i++) {\n                const angle = (i * Math.PI * 2) / spikes;\n                const x = Math.cos(angle) * outerRadius;\n                const y = Math.sin(angle) * outerRadius;\n                \n                if (i === 0) ctx.moveTo(x, y);\n                else ctx.lineTo(x, y);\n                \n                const innerAngle = angle + Math.PI / spikes;\n                const innerX = Math.cos(innerAngle) * innerRadius;\n                const innerY = Math.sin(innerAngle) * innerRadius;\n                ctx.lineTo(innerX, innerY);\n            }\n            ctx.closePath();\n            ctx.fill();\n        }\n\n        /**\n         * Check if particle is still alive\n         * @returns {boolean} True if particle should continue existing\n         */\n        isAlive() {\n            return this.life > 0.01;\n        }\n        \n        /**\n         * Reset particle for object pooling\n         * @param {number} x - Initial x position\n         * @param {number} y - Initial y position\n         * @param {string} color - Particle color\n         * @param {string} text - Optional text/emoji to display\n         * @param {string} type - Particle type\n         * @param {object} options - Additional options\n         */\n        reset(x, y, color, text = '', type = 'default', options = {}) {\n            this.x = x;\n            this.y = y;\n            this.vx = options.vx || (Math.random() - 0.5) * 6;\n            this.vy = options.vy || (-Math.random() * 6 - 3);\n            this.color = color;\n            this.text = text;\n            this.life = 1;\n            this.decay = options.decay || 0.015;\n            this.type = type;\n            this.size = options.size || (Math.random() * 3 + 2);\n            this.rotation = Math.random() * Math.PI * 2;\n            this.rotationSpeed = (Math.random() - 0.5) * 0.2;\n            this.gravity = options.gravity || 0.15;\n            this.bounce = options.bounce || 0.7;\n            this.scale = 1;\n            this.startTime = 0;\n            this.duration = options.duration || (60 + Math.random() * 60);\n            \n            // Update canvas dimensions if provided\n            if (options.canvasWidth) this.canvasWidth = options.canvasWidth;\n            if (options.canvasHeight) this.canvasHeight = options.canvasHeight;\n        }\n\n        /**\n         * Get particle bounds for collision detection\n         * @returns {object} Bounds object {x, y, width, height}\n         */\n        getBounds() {\n            const radius = this.size * this.scale;\n            return {\n                x: this.x - radius,\n                y: this.y - radius,\n                width: radius * 2,\n                height: radius * 2\n            };\n        }\n\n        /**\n         * Update canvas dimensions for boundary calculations\n         * @param {number} width - Canvas width\n         * @param {number} height - Canvas height\n         */\n        updateCanvasDimensions(width, height) {\n            this.canvasWidth = width;\n            this.canvasHeight = height;\n        }\n\n        /**\n         * Create a celebration particle with predefined settings\n         * @param {number} x - X position\n         * @param {number} y - Y position\n         * @param {string} color - Particle color\n         * @param {string} emoji - Emoji to display\n         * @returns {Particle} New celebration particle\n         */\n        static createCelebration(x, y, color, emoji = '✨') {\n            return new Particle(x, y, color, emoji, 'celebration', {\n                vx: (Math.random() - 0.5) * 8,\n                vy: -Math.random() * 8 - 5,\n                size: Math.random() * 4 + 3,\n                duration: 90 + Math.random() * 60, // Longer duration for celebration\n                gravity: 0.1, // Lighter gravity for floating effect\n                bounce: 0.9\n            });\n        }\n\n        /**\n         * Create an explosion of particles\n         * @param {number} x - Explosion center X\n         * @param {number} y - Explosion center Y\n         * @param {string} color - Particle color\n         * @param {number} count - Number of particles to create\n         * @param {string} type - Particle type\n         * @returns {Array<Particle>} Array of explosion particles\n         */\n        static createExplosion(x, y, color, count = 10, type = 'star') {\n            const particles = [];\n            \n            for (let i = 0; i < count; i++) {\n                const angle = (i / count) * Math.PI * 2;\n                const speed = Math.random() * 6 + 3;\n                const vx = Math.cos(angle) * speed;\n                const vy = Math.sin(angle) * speed - 2; // Slight upward bias\n                \n                particles.push(new Particle(x, y, color, '', type, {\n                    vx,\n                    vy,\n                    size: Math.random() * 3 + 1,\n                    duration: 45 + Math.random() * 30,\n                    gravity: 0.2\n                }));\n            }\n            \n            return particles;\n        }\n\n        /**\n         * Reset function for object pooling\n         * @param {Particle} particle - Particle to reset\n         * @param {number} x - Initial x position\n         * @param {number} y - Initial y position\n         * @param {string} color - Particle color\n         * @param {string} text - Optional text/emoji to display\n         * @param {string} type - Particle type\n         * @param {object} options - Additional options\n         */\n        static resetParticle(particle, x, y, color, text = '', type = 'default', options = {}) {\n            particle.init(x, y, color, text, type, options);\n        }\n        \n        /**\n         * Create particle factory function for object pooling\n         * @returns {Function} Factory function that creates new particles\n         */\n        static createFactory() {\n            return () => new Particle();\n        }\n        \n        /**\n         * Create floating text particle\n         * @param {number} x - X position\n         * @param {number} y - Y position\n         * @param {string} text - Text to display\n         * @param {string} color - Text color\n         * @returns {Particle} New text particle\n         */\n        static createFloatingText(x, y, text, color = '#FFD700') {\n            return new Particle(x, y, color, text, 'text', {\n                vx: (Math.random() - 0.5) * 2,\n                vy: -2 - Math.random() * 2,\n                size: 0, // Size is handled by font size\n                duration: 120, // 2 seconds\n                gravity: 0, // Text floats up\n                bounce: 0\n            });\n        }\n    }\n\n    /**\r\n     * PowerUp Entity\r\n     * \r\n     * Represents collectible power-ups that provide temporary game advantages.\r\n     * Supports multiple types: speedBoost (slow motion), timeFreeze, and scoreMultiplier.\r\n     */\r\n\r\n    /**\r\n     * Power-up type configurations\r\n     */\r\n    const powerUpTypes = {\r\n        speedBoost: {\r\n            emoji: '🐌',\r\n            name: 'Slow Motion',\r\n            color: '#FFD700',\r\n            duration: 8000, // 8 seconds\r\n            description: 'Slows ingredient fall speed'\r\n        },\r\n        timeFreeze: {\r\n            emoji: '❄️',\r\n            name: 'Time Freeze',\r\n            color: '#87CEEB',\r\n            duration: 5000, // 5 seconds\r\n            description: 'Freezes order timers'\r\n        },\r\n        scoreMultiplier: {\r\n            emoji: '💎',\r\n            name: 'Score Boost',\r\n            color: '#FF69B4',\r\n            duration: 10000, // 10 seconds\r\n            description: 'Double score points'\r\n        }\r\n    };\r\n\r\n    class PowerUp {\r\n        /**\r\n         * Create a new power-up\r\n         * @param {string} type - Power-up type ('speedBoost', 'timeFreeze', 'scoreMultiplier')\r\n         * @param {object} options - Additional options\r\n         */\r\n        constructor(type, options = {}) {\r\n            this.type = type;\r\n            this.data = powerUpTypes[type];\r\n            \r\n            if (!this.data) {\r\n                throw new Error(`Unknown power-up type: ${type}`);\r\n            }\r\n            \r\n            this.x = options.x !== undefined ? options.x : Math.random() * (options.canvasWidth || 800 - 50);\r\n            this.y = options.y !== undefined ? options.y : -50;\r\n            this.speed = options.speed || 1.5; // Fixed speed for consistency\r\n            this.collected = false;\r\n            this.size = options.size || 40;\r\n            this.cachedFont = null; // Cache font for performance\r\n            \r\n            // Store canvas dimensions for boundary calculations\r\n            this.canvasWidth = options.canvasWidth || 800;\r\n            this.canvasHeight = options.canvasHeight || 600;\r\n            \r\n            // Animation properties\r\n            this.animationTime = 0;\r\n            this.pulseIntensity = options.pulseIntensity || 0.1;\r\n        }\r\n        \r\n        /**\r\n         * Update power-up state\r\n         * @param {number} deltaTime - Time elapsed since last frame\r\n         */\r\n        update(deltaTime = 1/60) {\r\n            this.y += this.speed * deltaTime * 60; // Scale by target framerate\r\n            this.animationTime += deltaTime;\r\n        }\r\n        \r\n        /**\r\n         * Render the power-up\r\n         * @param {CanvasRenderingContext2D} ctx - Canvas rendering context\r\n         */\r\n        draw(ctx) {\r\n            // Pre-calculate position\r\n            const centerX = this.x + this.size/2;\r\n            const centerY = this.y + this.size/2;\r\n            \r\n            // Add subtle pulsing animation\r\n            const pulse = 1 + Math.sin(this.animationTime * 4) * this.pulseIntensity;\r\n            const currentSize = this.size * pulse;\r\n            \r\n            ctx.save();\r\n            \r\n            // Draw glow effect\r\n            ctx.shadowColor = this.data.color;\r\n            ctx.shadowBlur = 10;\r\n            \r\n            // Main circle\r\n            ctx.fillStyle = this.data.color;\r\n            ctx.beginPath();\r\n            ctx.arc(centerX, centerY, currentSize/2, 0, Math.PI * 2);\r\n            ctx.fill();\r\n            \r\n            // Border\r\n            ctx.shadowBlur = 0;\r\n            ctx.strokeStyle = '#FFFFFF';\r\n            ctx.lineWidth = 2;\r\n            ctx.stroke();\r\n            \r\n            // Emoji (cached font for performance)\r\n            if (!this.cachedFont) {\r\n                this.cachedFont = `${this.size * 0.6}px Arial`;\r\n            }\r\n            ctx.font = this.cachedFont;\r\n            ctx.textAlign = 'center';\r\n            ctx.textBaseline = 'middle';\r\n            ctx.fillStyle = '#FFFFFF';\r\n            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';\r\n            ctx.shadowBlur = 2;\r\n            ctx.shadowOffsetX = 1;\r\n            ctx.shadowOffsetY = 1;\r\n            ctx.fillText(this.data.emoji, centerX, centerY);\r\n            \r\n            ctx.restore();\r\n        }\r\n        \r\n        /**\r\n         * Check if coordinates are within the power-up's clickable area\r\n         * @param {number} x - X coordinate\r\n         * @param {number} y - Y coordinate\r\n         * @returns {boolean} True if clicked\r\n         */\r\n        isClicked(x, y) {\r\n            const centerX = this.x + this.size/2;\r\n            const centerY = this.y + this.size/2;\r\n            const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);\r\n            return distance <= this.size/2;\r\n        }\r\n        \r\n        /**\r\n         * Check if power-up is off screen (should be removed)\r\n         * @returns {boolean} True if off screen\r\n         */\r\n        isOffScreen() {\r\n            return this.y > this.canvasHeight + this.size;\r\n        }\r\n        \r\n        /**\r\n         * Get power-up bounds for collision detection\r\n         * @returns {object} Bounds object {x, y, width, height}\r\n         */\r\n        getBounds() {\r\n            return {\r\n                x: this.x,\r\n                y: this.y,\r\n                width: this.size,\r\n                height: this.size\r\n            };\r\n        }\r\n        \r\n        /**\r\n         * Get the center point of the power-up\r\n         * @returns {object} Center coordinates {x, y}\r\n         */\r\n        getCenter() {\r\n            return {\r\n                x: this.x + this.size/2,\r\n                y: this.y + this.size/2\r\n            };\r\n        }\r\n        \r\n        /**\r\n         * Mark power-up as collected\r\n         */\r\n        collect() {\r\n            this.collected = true;\r\n        }\r\n        \r\n        /**\r\n         * Check if power-up has been collected\r\n         * @returns {boolean} True if collected\r\n         */\r\n        isCollected() {\r\n            return this.collected;\r\n        }\r\n        \r\n        /**\r\n         * Get power-up duration in milliseconds\r\n         * @returns {number} Duration in milliseconds\r\n         */\r\n        getDuration() {\r\n            return this.data.duration;\r\n        }\r\n        \r\n        /**\r\n         * Get power-up description\r\n         * @returns {string} Human-readable description\r\n         */\r\n        getDescription() {\r\n            return this.data.description;\r\n        }\r\n        \r\n        /**\r\n         * Update canvas dimensions for boundary calculations\r\n         * @param {number} width - Canvas width\r\n         * @param {number} height - Canvas height\r\n         */\r\n        updateCanvasDimensions(width, height) {\r\n            this.canvasWidth = width;\r\n            this.canvasHeight = height;\r\n        }\r\n        \r\n        /**\r\n         * Create a random power-up\r\n         * @param {object} options - Options for power-up creation\r\n         * @returns {PowerUp} New random power-up\r\n         */\r\n        static createRandom(options = {}) {\r\n            const types = Object.keys(powerUpTypes);\r\n            const randomType = types[Math.floor(Math.random() * types.length)];\r\n            return new PowerUp(randomType, options);\r\n        }\r\n        \r\n        /**\r\n         * Get all available power-up types\r\n         * @returns {Array<string>} Array of power-up type names\r\n         */\r\n        static getAvailableTypes() {\r\n            return Object.keys(powerUpTypes);\r\n        }\r\n        \r\n        /**\r\n         * Get power-up type configuration\r\n         * @param {string} type - Power-up type\r\n         * @returns {object} Type configuration or null if not found\r\n         */\r\n        static getTypeConfig(type) {\r\n            return powerUpTypes[type] || null;\r\n        }\r\n        \r\n        /**\r\n         * Validate if a type is valid\r\n         * @param {string} type - Power-up type to validate\r\n         * @returns {boolean} True if valid type\r\n         */\r\n        static isValidType(type) {\r\n            return type in powerUpTypes;\r\n        }\r\n    }\n\n    /**\r\n     * Ingredient Entity\r\n     * \r\n     * Represents falling burger ingredients with physics simulation, trail effects,\r\n     * and visual variants. Includes integration with power-up system.\r\n     */\r\n\r\n\r\n    /**\r\n     * Ingredient type configurations\r\n     */\r\n    const ingredientTypes = {\r\n        bun_top: { \r\n            emoji: '🍞', \r\n            variants: ['🍞', '🥖'], \r\n            name: 'Top Bun', \r\n            size: 40,\r\n            color: '#D2B48C'\r\n        },\r\n        bun_bottom: { \r\n            emoji: '🥖', \r\n            variants: ['🥖', '🍞'], \r\n            name: 'Bottom Bun', \r\n            size: 40,\r\n            color: '#DEB887'\r\n        },\r\n        patty: { \r\n            emoji: '🥩', \r\n            variants: ['🥩', '🍖'], \r\n            name: 'Patty', \r\n            size: 45,\r\n            color: '#8B4513'\r\n        },\r\n        cheese: { \r\n            emoji: '🧀', \r\n            variants: ['🧀', '🟨'], \r\n            name: 'Cheese', \r\n            size: 35,\r\n            color: '#FFD700'\r\n        },\r\n        lettuce: { \r\n            emoji: '🥬', \r\n            variants: ['🥬', '🍃'], \r\n            name: 'Lettuce', \r\n            size: 35,\r\n            color: '#90EE90'\r\n        },\r\n        tomato: { \r\n            emoji: '🍅', \r\n            variants: ['🍅', '🔴'], \r\n            name: 'Tomato', \r\n            size: 35,\r\n            color: '#FF6347'\r\n        },\r\n        pickle: { \r\n            emoji: '🥒', \r\n            variants: ['🥒', '🟢'], \r\n            name: 'Pickle', \r\n            size: 30,\r\n            color: '#9ACD32'\r\n        },\r\n        bacon: { \r\n            emoji: '🥓', \r\n            variants: ['🥓', '🔥'], \r\n            name: 'Bacon', \r\n            size: 35,\r\n            color: '#DC143C'\r\n        },\r\n        onion: { \r\n            emoji: '🧅', \r\n            variants: ['🧅', '⚪'], \r\n            name: 'Onion', \r\n            size: 30,\r\n            color: '#F5F5DC'\r\n        },\r\n        egg: { \r\n            emoji: '🍳', \r\n            variants: ['🍳', '🟡'], \r\n            name: 'Egg', \r\n            size: 40,\r\n            color: '#FFFFE0'\r\n        }\r\n    };\r\n\r\n    class Ingredient {\r\n        /**\r\n         * Create a new ingredient\r\n         * @param {string} type - Ingredient type key from ingredientTypes\r\n         * @param {object} options - Additional options\r\n         */\r\n        constructor(type = 'bun_top', options = {}) {\r\n            this.init(type, options);\r\n        }\r\n        \r\n        /**\r\n         * Initialize/reset ingredient properties (used for object pooling)\r\n         * @param {string} type - Ingredient type key from ingredientTypes\r\n         * @param {object} options - Additional options\r\n         */\r\n        init(type, options = {}) {\r\n            this.type = type;\r\n            this.data = ingredientTypes[type];\r\n            \r\n            if (!this.data) {\r\n                throw new Error(`Unknown ingredient type: ${type}`);\r\n            }\r\n            \r\n            // Position and movement\r\n            this.x = options.x !== undefined ? options.x : Math.random() * (options.canvasWidth || 800 - this.data.size);\r\n            this.y = options.y !== undefined ? options.y : -this.data.size;\r\n            \r\n            // Speed calculation with variation\r\n            const baseSpeed = options.baseSpeed || 4;\r\n            const speedVariation = Math.random() * 4 - 2; // ±2 variation\r\n            const speedMultiplier = Math.random() < 0.1 ? (Math.random() < 0.5 ? 0.4 : 2.2) : 1; // 10% chance of very slow/fast\r\n            this.speed = (baseSpeed + speedVariation) * speedMultiplier;\r\n            this.baseSpeed = this.speed;\r\n            \r\n            // Rotation\r\n            this.rotation = Math.random() * Math.PI * 2;\r\n            this.rotationSpeed = (Math.random() - 0.5) * 0.1;\r\n            \r\n            // State\r\n            this.collected = false;\r\n            this.startY = this.y;\r\n            this.fallProgress = 0;\r\n            this.sway = Math.random() * 2 - 1; // -1 to 1 for horizontal sway\r\n            \r\n            // Trail system\r\n            this.trail = [];\r\n            this.maxTrailLength = options.maxTrailLength || 8;\r\n            this.trailUpdateInterval = options.trailUpdateInterval || 3;\r\n            this.trailCounter = 0;\r\n            \r\n            // Animation timing\r\n            this.animationTime = 0;\r\n            \r\n            // Canvas dimensions for boundary checks\r\n            this.canvasWidth = options.canvasWidth || 800;\r\n            this.canvasHeight = options.canvasHeight || 600;\r\n        }\r\n\r\n        /**\r\n         * Update ingredient state\r\n         * @param {number} frameCount - Current frame count for timing\r\n         * @param {object} gameState - Game state for power-up checks\r\n         * @param {number} deltaTime - Time elapsed since last frame\r\n         */\r\n        update(frameCount, gameState, deltaTime = 1/60) {\r\n            this.animationTime += deltaTime;\r\n            \r\n            // Apply speed boost power-up if available\r\n            let speedMultiplier = 1;\r\n            if (gameState && gameState.isPowerUpActive && gameState.isPowerUpActive('speedBoost')) {\r\n                speedMultiplier = gameState.powerUps.speedBoost.multiplier;\r\n            }\r\n            this.speed = this.baseSpeed * speedMultiplier;\r\n            \r\n            // Smooth falling motion with easing\r\n            this.fallProgress += 0.02;\r\n            const fallEase = easing.easeInQuad(Math.min(this.fallProgress, 1));\r\n            this.y += this.speed * (0.5 + fallEase * 0.5) * deltaTime * 60;\r\n            \r\n            // Add subtle horizontal sway\r\n            const swayAmount = Math.sin(frameCount * 0.05 + this.sway * Math.PI) * 0.5;\r\n            this.x += swayAmount * deltaTime * 60;\r\n            \r\n            // Smooth rotation with easing\r\n            this.rotation += this.rotationSpeed * (1 + fallEase * 0.5);\r\n            \r\n            // Update trail\r\n            this.trailCounter++;\r\n            if (this.trailCounter >= this.trailUpdateInterval) {\r\n                this.trail.push({\r\n                    x: this.x + this.data.size / 2,\r\n                    y: this.y + this.data.size / 2,\r\n                    alpha: 1,\r\n                    size: this.data.size * 0.8\r\n                });\r\n                \r\n                if (this.trail.length > this.maxTrailLength) {\r\n                    this.trail.shift();\r\n                }\r\n                \r\n                this.trailCounter = 0;\r\n            }\r\n            \r\n            // Update trail alpha with easing\r\n            this.trail.forEach((point, index) => {\r\n                const trailProgress = (index + 1) / this.trail.length;\r\n                point.alpha = easing.easeOutCubic(trailProgress) * 0.6;\r\n                point.size *= 0.98;\r\n            });\r\n        }\r\n\r\n        /**\r\n         * Render the ingredient\r\n         * @param {CanvasRenderingContext2D} ctx - Canvas rendering context\r\n         * @param {number} frameCount - Current frame count for animations\r\n         * @param {object} colorTheme - Color theme for effects\r\n         */\r\n        draw(ctx, frameCount, colorTheme) {\r\n            // Draw trail first (behind ingredient)\r\n            this.drawTrail(ctx, colorTheme);\r\n            \r\n            ctx.save();\r\n            ctx.translate(this.x + this.data.size / 2, this.y + this.data.size / 2);\r\n            ctx.rotate(this.rotation);\r\n            \r\n            // Add enhanced shadow to ingredients\r\n            ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';\r\n            ctx.shadowBlur = 6;\r\n            ctx.shadowOffsetX = 3;\r\n            ctx.shadowOffsetY = 3;\r\n            \r\n            // Use enhanced emoji with occasional variants\r\n            const useVariant = frameCount % 120 < 10; // Show variant for 10 frames every 2 seconds\r\n            const emojiToUse = useVariant && this.data.variants ? \r\n                this.data.variants[Math.floor(frameCount / 30) % this.data.variants.length] : \r\n                this.data.emoji;\r\n            \r\n            ctx.font = `${this.data.size}px Arial`; // Keep Arial for emoji compatibility\r\n            ctx.textAlign = 'center';\r\n            ctx.textBaseline = 'middle';\r\n            ctx.fillText(emojiToUse, 0, 0);\r\n            ctx.restore();\r\n        }\r\n        \r\n        /**\r\n         * Draw the trail effect behind the ingredient\r\n         * @param {CanvasRenderingContext2D} ctx - Canvas rendering context\r\n         * @param {object} colorTheme - Color theme for trail colors\r\n         */\r\n        drawTrail(ctx, colorTheme) {\r\n            if (this.trail.length < 2) return;\r\n            \r\n            ctx.save();\r\n            \r\n            // Create gradient trail effect\r\n            for (let i = 0; i < this.trail.length - 1; i++) {\r\n                const point = this.trail[i];\r\n                const nextPoint = this.trail[i + 1];\r\n                \r\n                // Draw line segment with gradient\r\n                const gradient = ctx.createLinearGradient(\r\n                    point.x, point.y, nextPoint.x, nextPoint.y\r\n                );\r\n                gradient.addColorStop(0, `rgba(255, 255, 255, ${point.alpha * 0.3})`);\r\n                gradient.addColorStop(1, `rgba(255, 255, 255, ${nextPoint.alpha * 0.3})`);\r\n                \r\n                ctx.strokeStyle = gradient;\r\n                ctx.lineWidth = Math.max(point.size * 0.15, 1);\r\n                ctx.lineCap = 'round';\r\n                \r\n                ctx.beginPath();\r\n                ctx.moveTo(point.x, point.y);\r\n                ctx.lineTo(nextPoint.x, nextPoint.y);\r\n                ctx.stroke();\r\n            }\r\n            \r\n            // Draw trail points\r\n            this.trail.forEach(point => {\r\n                ctx.globalAlpha = point.alpha * 0.4;\r\n                \r\n                // Use accent color from theme or fallback\r\n                const accentColor = colorTheme?.accent || '#00FF88';\r\n                ctx.fillStyle = accentColor + '80'; // Add transparency\r\n                \r\n                ctx.beginPath();\r\n                ctx.arc(point.x, point.y, Math.max(point.size * 0.1, 2), 0, Math.PI * 2);\r\n                ctx.fill();\r\n            });\r\n            \r\n            ctx.restore();\r\n        }\r\n\r\n        /**\r\n         * Check if coordinates are within the ingredient's clickable area\r\n         * @param {number} x - X coordinate\r\n         * @param {number} y - Y coordinate\r\n         * @returns {boolean} True if clicked\r\n         */\r\n        isClicked(x, y) {\r\n            return x >= this.x && x <= this.x + this.data.size &&\r\n                   y >= this.y && y <= this.y + this.data.size;\r\n        }\r\n        \r\n        /**\r\n         * Check if ingredient is off screen (should be removed)\r\n         * @returns {boolean} True if off screen\r\n         */\r\n        isOffScreen() {\r\n            return this.y > this.canvasHeight + this.data.size;\r\n        }\r\n        \r\n        /**\r\n         * Get ingredient bounds for collision detection\r\n         * @returns {object} Bounds object {x, y, width, height}\r\n         */\r\n        getBounds() {\r\n            return {\r\n                x: this.x,\r\n                y: this.y,\r\n                width: this.data.size,\r\n                height: this.data.size\r\n            };\r\n        }\r\n        \r\n        /**\r\n         * Get the center point of the ingredient\r\n         * @returns {object} Center coordinates {x, y}\r\n         */\r\n        getCenter() {\r\n            return {\r\n                x: this.x + this.data.size / 2,\r\n                y: this.y + this.data.size / 2\r\n            };\r\n        }\r\n        \r\n        /**\r\n         * Mark ingredient as collected\r\n         */\r\n        collect() {\r\n            this.collected = true;\r\n        }\r\n        \r\n        /**\r\n         * Check if ingredient has been collected\r\n         * @returns {boolean} True if collected\r\n         */\r\n        isCollected() {\r\n            return this.collected;\r\n        }\r\n        \r\n        /**\r\n         * Get ingredient name\r\n         * @returns {string} Human-readable ingredient name\r\n         */\r\n        getName() {\r\n            return this.data.name;\r\n        }\r\n        \r\n        /**\r\n         * Get ingredient color\r\n         * @returns {string} Ingredient color\r\n         */\r\n        getColor() {\r\n            return this.data.color;\r\n        }\r\n        \r\n        /**\r\n         * Update canvas dimensions for boundary calculations\r\n         * @param {number} width - Canvas width\r\n         * @param {number} height - Canvas height\r\n         */\r\n        updateCanvasDimensions(width, height) {\r\n            this.canvasWidth = width;\r\n            this.canvasHeight = height;\r\n        }\r\n        \r\n        /**\r\n         * Reset ingredient for object pooling\r\n         * @param {string} type - Ingredient type key from ingredientTypes\r\n         * @param {object} options - Additional options\r\n         */\r\n        reset(type, options = {}) {\r\n            this.type = type;\r\n            this.data = ingredientTypes[type];\r\n            \r\n            if (!this.data) {\r\n                throw new Error(`Unknown ingredient type: ${type}`);\r\n            }\r\n            \r\n            // Position and movement\r\n            this.x = options.x !== undefined ? options.x : Math.random() * ((options.canvasWidth || this.canvasWidth || 800) - this.data.size);\r\n            this.y = options.y !== undefined ? options.y : -this.data.size;\r\n            \r\n            // Speed calculation with variation\r\n            const baseSpeed = options.baseSpeed || 4;\r\n            const speedVariation = Math.random() * 4 - 2;\r\n            const speedMultiplier = Math.random() < 0.1 ? (Math.random() < 0.5 ? 0.4 : 2.2) : 1;\r\n            this.speed = (baseSpeed + speedVariation) * speedMultiplier;\r\n            this.baseSpeed = this.speed;\r\n            \r\n            // Rotation\r\n            this.rotation = Math.random() * Math.PI * 2;\r\n            this.rotationSpeed = (Math.random() - 0.5) * 0.1;\r\n            \r\n            // State\r\n            this.collected = false;\r\n            this.startY = this.y;\r\n            this.fallProgress = 0;\r\n            this.sway = Math.random() * 2 - 1;\r\n            \r\n            // Trail system\r\n            this.trail = [];\r\n            this.maxTrailLength = options.maxTrailLength || 8;\r\n            this.trailUpdateInterval = options.trailUpdateInterval || 3;\r\n            this.trailCounter = 0;\r\n            \r\n            // Animation timing\r\n            this.animationTime = 0;\r\n            \r\n            // Update canvas dimensions if provided\r\n            if (options.canvasWidth) this.canvasWidth = options.canvasWidth;\r\n            if (options.canvasHeight) this.canvasHeight = options.canvasHeight;\r\n        }\r\n        \r\n        /**\r\n         * Create a random ingredient\r\n         * @param {object} options - Options for ingredient creation\r\n         * @returns {Ingredient} New random ingredient\r\n         */\r\n        static createRandom(options = {}) {\r\n            const types = Object.keys(ingredientTypes);\r\n            const randomType = types[Math.floor(Math.random() * types.length)];\r\n            return new Ingredient(randomType, options);\r\n        }\r\n        \r\n        /**\r\n         * Get all available ingredient types\r\n         * @returns {Array<string>} Array of ingredient type names\r\n         */\r\n        static getAvailableTypes() {\r\n            return Object.keys(ingredientTypes);\r\n        }\r\n        \r\n        /**\r\n         * Get ingredient type configuration\r\n         * @param {string} type - Ingredient type\r\n         * @returns {object} Type configuration or null if not found\r\n         */\r\n        static getTypeConfig(type) {\r\n            return ingredientTypes[type] || null;\r\n        }\r\n        \r\n        /**\r\n         * Validate if a type is valid\r\n         * @param {string} type - Ingredient type to validate\r\n         * @returns {boolean} True if valid type\r\n         */\r\n        static isValidType(type) {\r\n            return type in ingredientTypes;\r\n        }\r\n    }\n\n    /**\r\n     * Order Entity\r\n     * \r\n     * Represents customer orders with time limits and ingredient tracking.\r\n     * Includes visual rendering with progress indication and timer management.\r\n     */\r\n\r\n\r\n    /**\r\n     * Order template configurations\r\n     */\r\n    const orderTemplates = [\r\n        { name: 'Classic Burger', ingredients: ['bun_bottom', 'patty', 'cheese', 'lettuce', 'tomato', 'bun_top'], time: 30 },\r\n        { name: 'Simple Burger', ingredients: ['bun_bottom', 'patty', 'bun_top'], time: 20 },\r\n        { name: 'Cheese Burger', ingredients: ['bun_bottom', 'patty', 'cheese', 'bun_top'], time: 25 },\r\n        { name: 'Veggie Burger', ingredients: ['bun_bottom', 'lettuce', 'tomato', 'onion', 'pickle', 'bun_top'], time: 30 },\r\n        { name: 'Bacon Burger', ingredients: ['bun_bottom', 'patty', 'bacon', 'cheese', 'bun_top'], time: 35 },\r\n        { name: 'Breakfast Burger', ingredients: ['bun_bottom', 'patty', 'egg', 'bacon', 'cheese', 'bun_top'], time: 40 }\r\n    ];\r\n\r\n    class Order {\r\n        /**\r\n         * Create a new order\r\n         * @param {object} template - Order template with name, ingredients, and time\r\n         * @param {object} options - Additional options\r\n         */\r\n        constructor(template, options = {}) {\r\n            if (!template) {\r\n                throw new Error('Order template is required');\r\n            }\r\n            \r\n            this.template = template;\r\n            this.ingredients = [...template.ingredients];\r\n            this.currentIndex = 0;\r\n            this.timeLeft = template.time * 1000; // Convert to milliseconds\r\n            this.x = 0;\r\n            this.y = 0;\r\n            this.width = options.width || 120;\r\n            this.height = options.height || 180;\r\n            this.completed = false;\r\n            this.expired = false;\r\n            \r\n            // Animation properties\r\n            this.animationTime = 0;\r\n            this.pulsePhase = Math.random() * Math.PI * 2; // Random phase for pulsing\r\n            \r\n            // Rendering options\r\n            this.enableTextures = options.enableTextures !== false;\r\n            this.enableShadows = options.enableShadows !== false;\r\n            this.enablePulse = options.enablePulse !== false;\r\n        }\r\n\r\n        /**\r\n         * Update order state\r\n         * @param {number} deltaTime - Time elapsed since last frame in seconds\r\n         * @param {object} gameState - Game state for power-up checks\r\n         * @returns {boolean} True if order is still valid, false if expired\r\n         */\r\n        update(deltaTime, gameState) {\r\n            this.animationTime += deltaTime;\r\n            \r\n            // Apply time freeze power-up if available\r\n            let shouldDecrementTime = true;\r\n            if (gameState && gameState.isPowerUpActive && gameState.isPowerUpActive('timeFreeze')) {\r\n                shouldDecrementTime = false;\r\n            }\r\n            \r\n            if (shouldDecrementTime && !this.completed) {\r\n                this.timeLeft -= deltaTime * 1000; // Convert to milliseconds\r\n            }\r\n            \r\n            if (this.timeLeft <= 0 && !this.completed) {\r\n                this.expired = true;\r\n                return false; // Order expired\r\n            }\r\n            \r\n            return true;\r\n        }\r\n\r\n        /**\r\n         * Render the order\r\n         * @param {CanvasRenderingContext2D} ctx - Canvas rendering context\r\n         * @param {number} index - Order position index for layout\r\n         * @param {number} frameCount - Current frame count for animations\r\n         * @param {object} options - Additional rendering options\r\n         */\r\n        draw(ctx, index, frameCount, options = {}) {\r\n            const margin = options.margin || 10;\r\n            this.x = margin + index * (this.width + margin);\r\n            this.y = options.startY || 80;\r\n\r\n            const isExpiring = this.timeLeft < 10000; // Less than 10 seconds\r\n            \r\n            ctx.save();\r\n            \r\n            // Background with texture if available\r\n            if (this.enableTextures && options.textures?.paper) {\r\n                ctx.fillStyle = options.textures.paper;\r\n                ctx.fillRect(this.x, this.y, this.width, this.height);\r\n            }\r\n            \r\n            // Add gradient overlay\r\n            const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);\r\n            \r\n            if (isExpiring) {\r\n                gradient.addColorStop(0, 'rgba(255, 120, 120, 0.85)');\r\n                gradient.addColorStop(1, 'rgba(255, 80, 80, 0.8)');\r\n            } else {\r\n                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.85)');\r\n                gradient.addColorStop(1, 'rgba(245, 245, 245, 0.8)');\r\n            }\r\n            \r\n            // Add shadow if enabled\r\n            if (this.enableShadows) {\r\n                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';\r\n                ctx.shadowBlur = 10;\r\n                ctx.shadowOffsetX = 3;\r\n                ctx.shadowOffsetY = 4;\r\n            }\r\n            \r\n            ctx.fillStyle = gradient;\r\n            ctx.fillRect(this.x, this.y, this.width, this.height);\r\n            \r\n            // Reset shadow for border\r\n            if (this.enableShadows) {\r\n                ctx.shadowColor = 'transparent';\r\n            }\r\n            \r\n            // Border\r\n            ctx.strokeStyle = isExpiring ? '#CC3333' : '#333';\r\n            ctx.lineWidth = 2;\r\n            ctx.strokeRect(this.x, this.y, this.width, this.height);\r\n            \r\n            ctx.restore();\r\n\r\n            // Order name with better typography\r\n            ctx.fillStyle = '#333';\r\n            ctx.font = '600 12px Nunito, Arial';\r\n            ctx.textAlign = 'center';\r\n            ctx.fillText(this.template.name, this.x + this.width / 2, this.y + 15);\r\n\r\n            // Timer with enhanced typography\r\n            const timeSeconds = Math.ceil(this.timeLeft / 1000);\r\n            ctx.fillStyle = this.timeLeft < 10000 ? '#FF0000' : '#333';\r\n            ctx.font = '700 14px Nunito, Arial';\r\n            ctx.fillText(`${timeSeconds}s`, this.x + this.width / 2, this.y + 30);\r\n\r\n            // Ingredients (from bottom to top)\r\n            this.drawIngredients(ctx, frameCount);\r\n        }\r\n        \r\n        /**\r\n         * Draw the ingredient list for the order\r\n         * @param {CanvasRenderingContext2D} ctx - Canvas rendering context\r\n         * @param {number} frameCount - Current frame count for animations\r\n         */\r\n        drawIngredients(ctx, frameCount) {\r\n            const startY = this.y + this.height - 25;\r\n            const spacing = 20;\r\n            \r\n            for (let i = 0; i < this.ingredients.length; i++) {\r\n                const ingredient = ingredientTypes[this.ingredients[i]];\r\n                if (!ingredient) continue;\r\n                \r\n                const yPos = startY - (i * spacing);\r\n                \r\n                ctx.save();\r\n                \r\n                if (i < this.currentIndex) {\r\n                    ctx.globalAlpha = 0.3; // Completed ingredients\r\n                } else if (i === this.currentIndex) {\r\n                    // Enhanced highlight for current ingredient\r\n                    this.drawCurrentIngredientHighlight(ctx, yPos, frameCount);\r\n                }\r\n                \r\n                // Draw ingredient emoji\r\n                if (i === this.currentIndex) {\r\n                    this.drawCurrentIngredient(ctx, ingredient, yPos);\r\n                } else {\r\n                    this.drawIngredient(ctx, ingredient, yPos);\r\n                }\r\n                \r\n                ctx.restore();\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Draw highlight for the current ingredient\r\n         * @param {CanvasRenderingContext2D} ctx - Canvas rendering context\r\n         * @param {number} yPos - Y position for the ingredient\r\n         * @param {number} frameCount - Current frame count for animations\r\n         */\r\n        drawCurrentIngredientHighlight(ctx, yPos, frameCount) {\r\n            const highlightGradient = ctx.createLinearGradient(\r\n                this.x + 5, yPos - 15, \r\n                this.x + this.width - 5, yPos + 10\r\n            );\r\n            highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');\r\n            highlightGradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.9)');\r\n            highlightGradient.addColorStop(1, 'rgba(255, 165, 0, 0.7)');\r\n            \r\n            ctx.fillStyle = highlightGradient;\r\n            ctx.fillRect(this.x + 3, yPos - 17, this.width - 6, 29);\r\n            \r\n            // Add border for better visibility\r\n            ctx.strokeStyle = '#FF8C00';\r\n            ctx.lineWidth = 2;\r\n            ctx.strokeRect(this.x + 3, yPos - 17, this.width - 6, 29);\r\n            \r\n            // Add pulsing effect if enabled\r\n            if (this.enablePulse) {\r\n                const pulseAlpha = 0.3 + Math.sin(frameCount * 0.15 + this.pulsePhase) * 0.2;\r\n                ctx.fillStyle = `rgba(255, 215, 0, ${pulseAlpha})`;\r\n                ctx.fillRect(this.x + 1, yPos - 19, this.width - 2, 33);\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Draw the current (highlighted) ingredient\r\n         * @param {CanvasRenderingContext2D} ctx - Canvas rendering context\r\n         * @param {object} ingredient - Ingredient data\r\n         * @param {number} yPos - Y position for the ingredient\r\n         */\r\n        drawCurrentIngredient(ctx, ingredient, yPos) {\r\n            ctx.font = '20px Arial'; // Keep Arial for emoji compatibility\r\n            ctx.textAlign = 'center';\r\n            \r\n            // Enhanced glow and contrast for current ingredient\r\n            ctx.shadowColor = '#FF4500';\r\n            ctx.shadowBlur = 12;\r\n            ctx.shadowOffsetX = 0;\r\n            ctx.shadowOffsetY = 0;\r\n            \r\n            // Add white outline for better contrast\r\n            ctx.strokeStyle = '#FFFFFF';\r\n            ctx.lineWidth = 3;\r\n            ctx.strokeText(ingredient.emoji, this.x + this.width / 2, yPos);\r\n            \r\n            // Scale up the current ingredient slightly\r\n            ctx.save();\r\n            ctx.translate(this.x + this.width / 2, yPos);\r\n            ctx.scale(1.2, 1.2);\r\n            ctx.fillText(ingredient.emoji, 0, 0);\r\n            ctx.restore();\r\n            \r\n            // Reset shadow\r\n            ctx.shadowColor = 'transparent';\r\n            ctx.shadowBlur = 0;\r\n            ctx.shadowOffsetX = 0;\r\n            ctx.shadowOffsetY = 0;\r\n        }\r\n        \r\n        /**\r\n         * Draw a regular ingredient\r\n         * @param {CanvasRenderingContext2D} ctx - Canvas rendering context\r\n         * @param {object} ingredient - Ingredient data\r\n         * @param {number} yPos - Y position for the ingredient\r\n         */\r\n        drawIngredient(ctx, ingredient, yPos) {\r\n            ctx.font = '20px Arial';\r\n            ctx.textAlign = 'center';\r\n            ctx.fillText(ingredient.emoji, this.x + this.width / 2, yPos);\r\n        }\r\n\r\n        /**\r\n         * Check if an ingredient matches the current expected ingredient\r\n         * @param {string} type - Ingredient type to check\r\n         * @returns {string} 'correct', 'completed', or 'wrong'\r\n         */\r\n        checkIngredient(type) {\r\n            if (this.completed || this.expired) {\r\n                return 'wrong';\r\n            }\r\n            \r\n            if (this.currentIndex < this.ingredients.length && \r\n                this.ingredients[this.currentIndex] === type) {\r\n                this.currentIndex++;\r\n                \r\n                if (this.currentIndex >= this.ingredients.length) {\r\n                    this.completed = true;\r\n                    return 'completed';\r\n                }\r\n                \r\n                return 'correct';\r\n            }\r\n            \r\n            return 'wrong';\r\n        }\r\n        \r\n        /**\r\n         * Get the current expected ingredient type\r\n         * @returns {string|null} Current ingredient type or null if order is complete\r\n         */\r\n        getCurrentIngredient() {\r\n            if (this.currentIndex >= this.ingredients.length) {\r\n                return null;\r\n            }\r\n            return this.ingredients[this.currentIndex];\r\n        }\r\n        \r\n        /**\r\n         * Get order completion progress\r\n         * @returns {number} Progress as a value between 0 and 1\r\n         */\r\n        getProgress() {\r\n            return this.currentIndex / this.ingredients.length;\r\n        }\r\n        \r\n        /**\r\n         * Get remaining time in seconds\r\n         * @returns {number} Time remaining in seconds\r\n         */\r\n        getTimeRemaining() {\r\n            return Math.max(0, this.timeLeft / 1000);\r\n        }\r\n        \r\n        /**\r\n         * Check if order is completed\r\n         * @returns {boolean} True if completed\r\n         */\r\n        isCompleted() {\r\n            return this.completed;\r\n        }\r\n        \r\n        /**\r\n         * Check if order has expired\r\n         * @returns {boolean} True if expired\r\n         */\r\n        isExpired() {\r\n            return this.expired;\r\n        }\r\n        \r\n        /**\r\n         * Check if order is expiring soon (less than 10 seconds)\r\n         * @returns {boolean} True if expiring soon\r\n         */\r\n        isExpiringSoon() {\r\n            return this.timeLeft < 10000;\r\n        }\r\n        \r\n        /**\r\n         * Get order bounds for UI layout\r\n         * @returns {object} Bounds object {x, y, width, height}\r\n         */\r\n        getBounds() {\r\n            return {\r\n                x: this.x,\r\n                y: this.y,\r\n                width: this.width,\r\n                height: this.height\r\n            };\r\n        }\r\n        \r\n        /**\r\n         * Reset order to initial state\r\n         */\r\n        reset() {\r\n            this.currentIndex = 0;\r\n            this.timeLeft = this.template.time * 1000;\r\n            this.completed = false;\r\n            this.expired = false;\r\n            this.animationTime = 0;\r\n        }\r\n        \r\n        /**\r\n         * Create a random order from available templates\r\n         * @param {object} options - Options for order creation\r\n         * @returns {Order} New random order\r\n         */\r\n        static createRandom(options = {}) {\r\n            const template = orderTemplates[Math.floor(Math.random() * orderTemplates.length)];\r\n            return new Order(template, options);\r\n        }\r\n        \r\n        /**\r\n         * Get all available order templates\r\n         * @returns {Array<object>} Array of order templates\r\n         */\r\n        static getAvailableTemplates() {\r\n            return [...orderTemplates];\r\n        }\r\n        \r\n        /**\r\n         * Get a specific order template by name\r\n         * @param {string} name - Template name\r\n         * @returns {object|null} Template or null if not found\r\n         */\r\n        static getTemplateByName(name) {\r\n            return orderTemplates.find(template => template.name === name) || null;\r\n        }\r\n        \r\n        /**\r\n         * Validate order template\r\n         * @param {object} template - Template to validate\r\n         * @returns {boolean} True if valid template\r\n         */\r\n        static isValidTemplate(template) {\r\n            return !!(template && \r\n                   typeof template.name === 'string' &&\r\n                   Array.isArray(template.ingredients) &&\r\n                   template.ingredients.length > 0 &&\r\n                   typeof template.time === 'number' &&\r\n                   template.time > 0);\r\n        }\r\n    }\n\n    /**\r\n     * Audio System\r\n     * \r\n     * Complete Web Audio API-based audio system with procedural sound generation,\r\n     * background music, volume controls, and audio ducking.\r\n     */\r\n\r\n    /**\r\n     * Sound effect definitions\r\n     */\r\n    const soundEffects = {\r\n        ingredientCorrect: {\r\n            frequency: 880,\r\n            type: 'sine',\r\n            duration: 0.15,\r\n            volume: 0.6\r\n        },\r\n        ingredientWrong: {\r\n            frequency: 220,\r\n            type: 'sawtooth',\r\n            duration: 0.2,\r\n            volume: 0.5\r\n        },\r\n        orderComplete: {\r\n            frequencies: [523, 659, 784, 1047], // C, E, G, High C\r\n            type: 'sine',\r\n            duration: 0.2,\r\n            volume: 0.8\r\n        },\r\n        orderExpired: {\r\n            frequency: 165,\r\n            type: 'square',\r\n            duration: 0.3,\r\n            volume: 0.7\r\n        },\r\n        powerUpCollect: {\r\n            frequency: 698,\r\n            type: 'triangle',\r\n            duration: 0.25,\r\n            volume: 0.7\r\n        },\r\n        doublePointsActivate: {\r\n            frequency: 1397, // F6\r\n            type: 'sine',\r\n            duration: 0.3,\r\n            volume: 0.8,\r\n            duck: true\r\n        },\r\n        slowTimeActivate: {\r\n            frequency: 440, // A4\r\n            type: 'triangle',\r\n            duration: 0.4,\r\n            volume: 0.8,\r\n            duck: true\r\n        },\r\n        comboMultiplierActivate: {\r\n            frequency: 587, // D5\r\n            type: 'square',\r\n            duration: 0.35,\r\n            volume: 0.7,\r\n            duck: true\r\n        },\r\n        comboIncrease: {\r\n            frequency: 659, // E5\r\n            type: 'sine',\r\n            duration: 0.1,\r\n            volume: 0.5\r\n        },\r\n        buttonClick: {\r\n            frequency: 1000,\r\n            type: 'sine',\r\n            duration: 0.05,\r\n            volume: 0.3\r\n        },\r\n        gameOver: {\r\n            frequencies: [330, 311, 294, 277], // E, Eb, D, Db\r\n            type: 'sawtooth',\r\n            duration: 0.4,\r\n            volume: 0.8\r\n        }\r\n    };\r\n\r\n    /**\r\n     * Music note definitions\r\n     */\r\n    const musicNotes = {\r\n        melody: [523, 587, 659, 784, 880]};\r\n\r\n    class AudioSystem {\r\n        constructor(options = {}) {\r\n            // Audio context and processing chain\r\n            this.audioContext = null;\r\n            this.audioProcessingChain = null;\r\n            this.enabled = true;\r\n            \r\n            // Audio settings\r\n            this.settings = {\r\n                master: options.master || 0.3,\r\n                effects: options.effects || 1.0,\r\n                music: options.music || 0.5,\r\n                preset: options.preset || 'normal'\r\n            };\r\n            \r\n            // Background music state\r\n            this.backgroundMusic = {\r\n                playing: false,\r\n                oscillators: [],\r\n                gainNodes: [],\r\n                melodyInterval: null,\r\n                cleanupInterval: null\r\n            };\r\n            \r\n            // Audio ducking\r\n            this.musicGainNode = null;\r\n            this.isDucking = false;\r\n            \r\n            // Event listeners\r\n            this.eventListeners = new Map();\r\n            \r\n            // Initialize audio system\r\n            this.init();\r\n        }\r\n        \r\n        /**\r\n         * Initialize the audio system\r\n         */\r\n        init() {\r\n            try {\r\n                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();\r\n                this.setupAudioProcessingChain();\r\n                this.setupUserInteractionHandlers();\r\n            } catch (e) {\r\n                console.warn('Web Audio API not supported');\r\n                this.enabled = false;\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Set up audio processing chain with compressor and limiter\r\n         */\r\n        setupAudioProcessingChain() {\r\n            if (!this.audioContext) return;\r\n            \r\n            // Create compressor\r\n            const compressor = this.audioContext.createDynamicsCompressor();\r\n            compressor.threshold.setValueAtTime(-20, this.audioContext.currentTime);\r\n            compressor.knee.setValueAtTime(10, this.audioContext.currentTime);\r\n            compressor.ratio.setValueAtTime(6, this.audioContext.currentTime);\r\n            compressor.attack.setValueAtTime(0.003, this.audioContext.currentTime);\r\n            compressor.release.setValueAtTime(0.1, this.audioContext.currentTime);\r\n            \r\n            // Create limiter\r\n            const limiter = this.audioContext.createDynamicsCompressor();\r\n            limiter.threshold.setValueAtTime(-6, this.audioContext.currentTime);\r\n            limiter.knee.setValueAtTime(0, this.audioContext.currentTime);\r\n            limiter.ratio.setValueAtTime(20, this.audioContext.currentTime);\r\n            limiter.attack.setValueAtTime(0.001, this.audioContext.currentTime);\r\n            limiter.release.setValueAtTime(0.01, this.audioContext.currentTime);\r\n            \r\n            // Chain: compressor -> limiter -> destination\r\n            compressor.connect(limiter);\r\n            limiter.connect(this.audioContext.destination);\r\n            \r\n            this.audioProcessingChain = compressor;\r\n        }\r\n        \r\n        /**\r\n         * Set up user interaction handlers for audio context resume\r\n         */\r\n        setupUserInteractionHandlers() {\r\n            const resumeAudio = () => {\r\n                if (this.audioContext && this.audioContext.state === 'suspended') {\r\n                    this.audioContext.resume();\r\n                }\r\n            };\r\n            \r\n            document.addEventListener('click', resumeAudio, { once: true });\r\n            document.addEventListener('touchstart', resumeAudio, { once: true });\r\n        }\r\n        \r\n        /**\r\n         * Create an oscillator with the audio processing chain\r\n         */\r\n        createOscillator(frequency, type = 'sine', duration = 0.1, volumeMultiplier = 1) {\r\n            if (!this.audioContext || !this.enabled) return null;\r\n            \r\n            const oscillator = this.audioContext.createOscillator();\r\n            const gainNode = this.audioContext.createGain();\r\n            \r\n            // Add low-pass filter to smooth harsh frequencies\r\n            const filter = this.audioContext.createBiquadFilter();\r\n            filter.type = 'lowpass';\r\n            filter.frequency.setValueAtTime(8000, this.audioContext.currentTime);\r\n            filter.Q.setValueAtTime(0.7, this.audioContext.currentTime);\r\n            \r\n            // Connect audio chain\r\n            oscillator.connect(gainNode);\r\n            gainNode.connect(filter);\r\n            \r\n            if (this.audioProcessingChain) {\r\n                filter.connect(this.audioProcessingChain);\r\n            } else {\r\n                filter.connect(this.audioContext.destination);\r\n            }\r\n            \r\n            // Configure oscillator\r\n            oscillator.type = type;\r\n            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);\r\n            \r\n            // Calculate final volume\r\n            const finalVolume = this.settings.master * this.settings.effects * volumeMultiplier;\r\n            \r\n            // Smooth volume envelope\r\n            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);\r\n            gainNode.gain.linearRampToValueAtTime(finalVolume, this.audioContext.currentTime + 0.01);\r\n            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);\r\n            \r\n            return { oscillator, gainNode, filter };\r\n        }\r\n        \r\n        /**\r\n         * Play a sound effect\r\n         */\r\n        playSound(soundConfig) {\r\n            if (!this.audioContext || !this.enabled || this.settings.effects === 0) return;\r\n            \r\n            const { frequency, type = 'sine', duration = 0.1, volume = 1, duck = false } = soundConfig;\r\n            const result = this.createOscillator(frequency, type, duration, volume);\r\n            \r\n            if (result) {\r\n                const { oscillator } = result;\r\n                oscillator.start();\r\n                oscillator.stop(this.audioContext.currentTime + duration);\r\n                \r\n                // Clean up after sound finishes\r\n                oscillator.addEventListener('ended', () => {\r\n                    oscillator.disconnect();\r\n                });\r\n                \r\n                // Handle audio ducking\r\n                if (duck) {\r\n                    this.duckBackgroundMusic();\r\n                    setTimeout(() => this.restoreBackgroundMusic(), duration * 1000);\r\n                }\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Play a sequence of sounds\r\n         */\r\n        playSequence(frequencies, type = 'sine', duration = 0.1, volume = 1) {\r\n            if (!this.audioContext || !this.enabled || this.settings.effects === 0) return;\r\n            \r\n            frequencies.forEach((freq, index) => {\r\n                setTimeout(() => {\r\n                    this.playSound({ frequency: freq, type, duration: duration * 0.8, volume });\r\n                }, index * duration * 1000 * 0.9);\r\n            });\r\n        }\r\n        \r\n        /**\r\n         * Play specific game sound effects\r\n         */\r\n        playIngredientCorrect() {\r\n            this.playSound(soundEffects.ingredientCorrect);\r\n        }\r\n        \r\n        playIngredientWrong() {\r\n            this.playSound(soundEffects.ingredientWrong);\r\n        }\r\n        \r\n        playOrderComplete() {\r\n            this.playSequence(\r\n                soundEffects.orderComplete.frequencies,\r\n                soundEffects.orderComplete.type,\r\n                soundEffects.orderComplete.duration,\r\n                soundEffects.orderComplete.volume\r\n            );\r\n        }\r\n        \r\n        playOrderExpired() {\r\n            this.playSound(soundEffects.orderExpired);\r\n        }\r\n        \r\n        playPowerUpCollect() {\r\n            this.playSound(soundEffects.powerUpCollect);\r\n        }\r\n        \r\n        playPowerUpActivate(type) {\r\n            const soundKey = type + 'Activate';\r\n            const sound = soundEffects[soundKey];\r\n            if (sound) {\r\n                this.duckBackgroundMusic();\r\n                this.playSound(sound);\r\n                setTimeout(() => this.restoreBackgroundMusic(), 300);\r\n            }\r\n        }\r\n        \r\n        playComboIncrease() {\r\n            this.playSound(soundEffects.comboIncrease);\r\n        }\r\n        \r\n        playButtonClick() {\r\n            this.playSound(soundEffects.buttonClick);\r\n        }\r\n        \r\n        playGameOver() {\r\n            if (!this.audioContext || !this.enabled || this.settings.effects === 0) return;\r\n            \r\n            soundEffects.gameOver.frequencies.forEach((freq, index) => {\r\n                setTimeout(() => {\r\n                    this.playSound({\r\n                        frequency: freq,\r\n                        type: soundEffects.gameOver.type,\r\n                        duration: soundEffects.gameOver.duration * 0.7,\r\n                        volume: soundEffects.gameOver.volume\r\n                    });\r\n                }, index * 150);\r\n            });\r\n        }\r\n        \r\n        /**\r\n         * Alias methods for backward compatibility\r\n         */\r\n        playCollect() {\r\n            this.playIngredientCorrect();\r\n        }\r\n        \r\n        playError() {\r\n            this.playIngredientWrong();\r\n        }\r\n        \r\n        playNewOrder() {\r\n            this.playButtonClick();\r\n        }\r\n        \r\n        /**\r\n         * Start background music\r\n         */\r\n        startBackgroundMusic() {\r\n            if (!this.audioContext || !this.enabled || this.backgroundMusic.playing || this.settings.music === 0) {\r\n                return;\r\n            }\r\n            \r\n            // Create master gain node for music\r\n            if (!this.musicGainNode) {\r\n                this.musicGainNode = this.audioContext.createGain();\r\n                \r\n                if (this.audioProcessingChain) {\r\n                    this.musicGainNode.connect(this.audioProcessingChain);\r\n                } else {\r\n                    this.musicGainNode.connect(this.audioContext.destination);\r\n                }\r\n                \r\n                this.musicGainNode.gain.setValueAtTime(\r\n                    this.settings.master * this.settings.music,\r\n                    this.audioContext.currentTime\r\n                );\r\n            }\r\n            \r\n            this.backgroundMusic.playing = true;\r\n            \r\n            // Start melody interval\r\n            this.backgroundMusic.melodyInterval = setInterval(() => {\r\n                if (this.backgroundMusic.playing && this.settings.music > 0) {\r\n                    this.playMelodyNote();\r\n                } else {\r\n                    clearInterval(this.backgroundMusic.melodyInterval);\r\n                }\r\n            }, 3000 + Math.random() * 2000);\r\n            \r\n            // Start cleanup interval\r\n            this.backgroundMusic.cleanupInterval = setInterval(() => {\r\n                this.cleanupOscillators();\r\n            }, 5000);\r\n        }\r\n        \r\n        /**\r\n         * Stop background music\r\n         */\r\n        stopBackgroundMusic() {\r\n            this.backgroundMusic.playing = false;\r\n            \r\n            // Clear intervals\r\n            if (this.backgroundMusic.melodyInterval) {\r\n                clearInterval(this.backgroundMusic.melodyInterval);\r\n                this.backgroundMusic.melodyInterval = null;\r\n            }\r\n            if (this.backgroundMusic.cleanupInterval) {\r\n                clearInterval(this.backgroundMusic.cleanupInterval);\r\n                this.backgroundMusic.cleanupInterval = null;\r\n            }\r\n            \r\n            // Stop all oscillators\r\n            this.backgroundMusic.oscillators.forEach(osc => {\r\n                try {\r\n                    osc.stop();\r\n                    osc.disconnect();\r\n                } catch (e) {\r\n                    // Oscillator might already be stopped\r\n                }\r\n            });\r\n            \r\n            this.backgroundMusic.oscillators = [];\r\n            this.backgroundMusic.gainNodes = [];\r\n        }\r\n        \r\n        /**\r\n         * Play a single melody note\r\n         */\r\n        playMelodyNote() {\r\n            if (!this.backgroundMusic.playing || !this.musicGainNode || this.settings.music === 0) {\r\n                return;\r\n            }\r\n            \r\n            const noteIndex = Math.floor(Math.random() * musicNotes.melody.length);\r\n            const frequency = musicNotes.melody[noteIndex];\r\n            const musicVolume = this.settings.master * this.settings.music * 0.1;\r\n            \r\n            const melodyOsc = this.audioContext.createOscillator();\r\n            const melodyGain = this.audioContext.createGain();\r\n            \r\n            melodyOsc.connect(melodyGain);\r\n            melodyGain.connect(this.musicGainNode);\r\n            \r\n            melodyOsc.type = 'sine';\r\n            melodyOsc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);\r\n            \r\n            melodyGain.gain.setValueAtTime(0, this.audioContext.currentTime);\r\n            melodyGain.gain.linearRampToValueAtTime(musicVolume, this.audioContext.currentTime + 0.1);\r\n            melodyGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1.5);\r\n            \r\n            melodyOsc.start();\r\n            melodyOsc.stop(this.audioContext.currentTime + 2);\r\n            \r\n            // Cleanup after note finishes\r\n            melodyOsc.addEventListener('ended', () => {\r\n                const oscIndex = this.backgroundMusic.oscillators.indexOf(melodyOsc);\r\n                const gainIndex = this.backgroundMusic.gainNodes.indexOf(melodyGain);\r\n                if (oscIndex > -1) this.backgroundMusic.oscillators.splice(oscIndex, 1);\r\n                if (gainIndex > -1) this.backgroundMusic.gainNodes.splice(gainIndex, 1);\r\n            });\r\n            \r\n            this.backgroundMusic.oscillators.push(melodyOsc);\r\n            this.backgroundMusic.gainNodes.push(melodyGain);\r\n        }\r\n        \r\n        /**\r\n         * Clean up ended oscillators\r\n         */\r\n        cleanupOscillators() {\r\n            this.backgroundMusic.oscillators = this.backgroundMusic.oscillators.filter(osc => {\r\n                try {\r\n                    return osc.context.state !== 'closed';\r\n                } catch (e) {\r\n                    return false;\r\n                }\r\n            });\r\n            \r\n            this.backgroundMusic.gainNodes = this.backgroundMusic.gainNodes.filter(gain => {\r\n                try {\r\n                    return gain.context.state !== 'closed';\r\n                } catch (e) {\r\n                    return false;\r\n                }\r\n            });\r\n        }\r\n        \r\n        /**\r\n         * Duck background music volume\r\n         */\r\n        duckBackgroundMusic() {\r\n            if (!this.musicGainNode || this.isDucking) return;\r\n            \r\n            this.isDucking = true;\r\n            const currentVolume = this.settings.master * this.settings.music;\r\n            const duckedVolume = currentVolume * 0.3;\r\n            \r\n            this.musicGainNode.gain.cancelScheduledValues(this.audioContext.currentTime);\r\n            this.musicGainNode.gain.setValueAtTime(currentVolume, this.audioContext.currentTime);\r\n            this.musicGainNode.gain.linearRampToValueAtTime(duckedVolume, this.audioContext.currentTime + 0.1);\r\n        }\r\n        \r\n        /**\r\n         * Restore background music volume\r\n         */\r\n        restoreBackgroundMusic() {\r\n            if (!this.musicGainNode || !this.isDucking) return;\r\n            \r\n            this.isDucking = false;\r\n            const normalVolume = this.settings.master * this.settings.music;\r\n            \r\n            this.musicGainNode.gain.cancelScheduledValues(this.audioContext.currentTime);\r\n            this.musicGainNode.gain.linearRampToValueAtTime(normalVolume, this.audioContext.currentTime + 0.3);\r\n        }\r\n        \r\n        /**\r\n         * Update master volume\r\n         */\r\n        setMasterVolume(value) {\r\n            this.settings.master = Math.max(0, Math.min(1, value));\r\n            \r\n            if (this.musicGainNode && !this.isDucking) {\r\n                const musicVolume = this.settings.master * this.settings.music;\r\n                this.musicGainNode.gain.setValueAtTime(musicVolume, this.audioContext.currentTime);\r\n            }\r\n            \r\n            this.emit('volumeChanged', { type: 'master', value: this.settings.master });\r\n        }\r\n        \r\n        /**\r\n         * Update effects volume\r\n         */\r\n        setEffectsVolume(value) {\r\n            this.settings.effects = Math.max(0, Math.min(1, value));\r\n            this.emit('volumeChanged', { type: 'effects', value: this.settings.effects });\r\n        }\r\n        \r\n        /**\r\n         * Update music volume\r\n         */\r\n        setMusicVolume(value) {\r\n            this.settings.music = Math.max(0, Math.min(1, value));\r\n            \r\n            if (this.musicGainNode && !this.isDucking) {\r\n                const musicVolume = this.settings.master * this.settings.music;\r\n                this.musicGainNode.gain.setValueAtTime(musicVolume, this.audioContext.currentTime);\r\n            }\r\n            \r\n            // Handle music start/stop based on volume\r\n            if (value > 0 && !this.backgroundMusic.playing) {\r\n                this.startBackgroundMusic();\r\n            } else if (value === 0) {\r\n                this.stopBackgroundMusic();\r\n            }\r\n            \r\n            this.emit('volumeChanged', { type: 'music', value: this.settings.music });\r\n        }\r\n        \r\n        /**\r\n         * Set audio preset\r\n         */\r\n        setPreset(preset) {\r\n            const presets = {\r\n                quiet: { master: 0.15, effects: 0.8, music: 0.3 },\r\n                normal: { master: 0.3, effects: 1.0, music: 0.5 },\r\n                energetic: { master: 0.5, effects: 1.0, music: 0.7 }\r\n            };\r\n            \r\n            const config = presets[preset];\r\n            if (config) {\r\n                this.setMasterVolume(config.master);\r\n                this.setEffectsVolume(config.effects);\r\n                this.setMusicVolume(config.music);\r\n                this.settings.preset = preset;\r\n                this.emit('presetChanged', preset);\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Enable/disable audio system\r\n         */\r\n        setEnabled(enabled) {\r\n            this.enabled = enabled;\r\n            \r\n            if (!enabled) {\r\n                this.stopBackgroundMusic();\r\n            }\r\n            \r\n            this.emit('enabledChanged', enabled);\r\n        }\r\n        \r\n        /**\r\n         * Get current audio settings\r\n         */\r\n        getSettings() {\r\n            return { ...this.settings };\r\n        }\r\n        \r\n        /**\r\n         * Check if audio is enabled and supported\r\n         */\r\n        isEnabled() {\r\n            return this.enabled && !!this.audioContext;\r\n        }\r\n        \r\n        /**\r\n         * Cleanup audio system\r\n         */\r\n        destroy() {\r\n            this.stopBackgroundMusic();\r\n            \r\n            if (this.musicGainNode) {\r\n                this.musicGainNode.disconnect();\r\n                this.musicGainNode = null;\r\n            }\r\n            \r\n            if (this.audioContext) {\r\n                this.audioContext.close();\r\n                this.audioContext = null;\r\n            }\r\n            \r\n            this.eventListeners.clear();\r\n        }\r\n        \r\n        /**\r\n         * Event system for audio callbacks\r\n         */\r\n        on(event, callback) {\r\n            if (!this.eventListeners.has(event)) {\r\n                this.eventListeners.set(event, []);\r\n            }\r\n            this.eventListeners.get(event).push(callback);\r\n        }\r\n        \r\n        off(event, callback) {\r\n            const callbacks = this.eventListeners.get(event);\r\n            if (callbacks) {\r\n                const index = callbacks.indexOf(callback);\r\n                if (index > -1) {\r\n                    callbacks.splice(index, 1);\r\n                }\r\n            }\r\n        }\r\n        \r\n        emit(event, data) {\r\n            const callbacks = this.eventListeners.get(event);\r\n            if (callbacks) {\r\n                callbacks.forEach(callback => {\r\n                    try {\r\n                        callback(data);\r\n                    } catch (error) {\r\n                        console.error(`Error in audio event listener for ${event}:`, error);\r\n                    }\r\n                });\r\n            }\r\n        }\r\n    }\n\n    /**\n     * Color Theme System\n     * \n     * Dynamic color management with theme transitions and texture pattern generation.\n     * Colors respond to game state (combo level and score) for enhanced visual feedback.\n     */\n\n\n    /**\n     * Create texture patterns for visual enhancement\n     * @param {CanvasRenderingContext2D} ctx - Canvas context for pattern creation\n     * @param {string} type - Type of texture ('wood', 'marble', 'fabric', 'paper')\n     * @param {number} size - Size of the pattern (default: 50)\n     * @returns {CanvasPattern} Canvas pattern object\n     */\n    function createTexturePattern(ctx, type, size = 50) {\n        const patternCanvas = document.createElement('canvas');\n        patternCanvas.width = size;\n        patternCanvas.height = size;\n        const patternCtx = patternCanvas.getContext('2d');\n        \n        switch(type) {\n            case 'wood':\n                // Wood grain texture\n                const woodGradient = patternCtx.createLinearGradient(0, 0, 0, size);\n                woodGradient.addColorStop(0, '#DEB887');\n                woodGradient.addColorStop(0.3, '#D2B48C');\n                woodGradient.addColorStop(0.7, '#CD853F');\n                woodGradient.addColorStop(1, '#A0522D');\n                patternCtx.fillStyle = woodGradient;\n                patternCtx.fillRect(0, 0, size, size);\n                \n                // Add wood grain lines\n                patternCtx.strokeStyle = 'rgba(139, 69, 19, 0.3)';\n                patternCtx.lineWidth = 1;\n                for(let i = 0; i < 8; i++) {\n                    const y = (i * size / 8) + Math.sin(i) * 3;\n                    patternCtx.beginPath();\n                    patternCtx.moveTo(0, y);\n                    patternCtx.lineTo(size, y + Math.sin(i * 0.5) * 2);\n                    patternCtx.stroke();\n                }\n                break;\n                \n            case 'marble':\n                // Marble texture\n                const marbleGradient = patternCtx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);\n                marbleGradient.addColorStop(0, '#F8F8FF');\n                marbleGradient.addColorStop(0.5, '#E6E6FA');\n                marbleGradient.addColorStop(1, '#D3D3D3');\n                patternCtx.fillStyle = marbleGradient;\n                patternCtx.fillRect(0, 0, size, size);\n                \n                // Add marble veins\n                patternCtx.strokeStyle = 'rgba(169, 169, 169, 0.4)';\n                patternCtx.lineWidth = 2;\n                patternCtx.beginPath();\n                patternCtx.moveTo(0, size * 0.3);\n                patternCtx.quadraticCurveTo(size * 0.7, size * 0.1, size, size * 0.8);\n                patternCtx.stroke();\n                break;\n                \n            case 'fabric':\n                // Fabric weave texture\n                patternCtx.fillStyle = '#F5F5DC';\n                patternCtx.fillRect(0, 0, size, size);\n                \n                patternCtx.fillStyle = 'rgba(210, 180, 140, 0.5)';\n                const gridSize = size / 10;\n                for(let x = 0; x < size; x += gridSize) {\n                    for(let y = 0; y < size; y += gridSize) {\n                        if((Math.floor(x/gridSize) + Math.floor(y/gridSize)) % 2) {\n                            patternCtx.fillRect(x, y, gridSize, gridSize);\n                        }\n                    }\n                }\n                break;\n                \n            case 'paper':\n                // Paper texture\n                patternCtx.fillStyle = '#FFFEF0';\n                patternCtx.fillRect(0, 0, size, size);\n                \n                // Add paper fibers\n                for(let i = 0; i < 20; i++) {\n                    patternCtx.strokeStyle = `rgba(220, 220, 200, ${Math.random() * 0.3})`;\n                    patternCtx.lineWidth = 0.5;\n                    patternCtx.beginPath();\n                    patternCtx.moveTo(Math.random() * size, Math.random() * size);\n                    patternCtx.lineTo(Math.random() * size, Math.random() * size);\n                    patternCtx.stroke();\n                }\n                break;\n                \n            default:\n                // Default solid color\n                patternCtx.fillStyle = '#FFFFFF';\n                patternCtx.fillRect(0, 0, size, size);\n                break;\n        }\n        \n        return ctx.createPattern(patternCanvas, 'repeat');\n    }\n\n    /**\n     * Get a random color from a predefined palette\n     * @returns {string} Hex color string\n     */\n    function getRandomColor() {\n        const colors = [\n            '#FF6B6B', // Red\n            '#4ECDC4', // Teal\n            '#45B7D1', // Blue\n            '#F7DC6F', // Yellow\n            '#BB8FCE', // Purple\n            '#85C872', // Green\n            '#F8B500', // Orange\n            '#FF6F91', // Pink\n            '#6C5CE7', // Violet\n            '#00D2D3'  // Cyan\n        ];\n        return colors[Math.floor(Math.random() * colors.length)];\n    }\n\n    /**\r\n     * Renderer System\r\n     * \r\n     * Comprehensive canvas rendering system with texture patterns, screen effects,\r\n     * custom graphics, and dynamic visual features.\r\n     */\r\n\r\n\r\n    class Renderer {\r\n        constructor(canvas, options = {}) {\r\n            this.canvas = canvas;\r\n            this.ctx = canvas.getContext('2d');\r\n            \r\n            // Rendering options\r\n            this.enableTextures = options.enableTextures !== false;\r\n            this.enableShadows = options.enableShadows !== false;\r\n            this.enableEffects = options.enableEffects !== false;\r\n            \r\n            // Canvas patterns\r\n            this.patterns = {\r\n                wood: null,\r\n                marble: null,\r\n                fabric: null,\r\n                paper: null\r\n            };\r\n            \r\n            // Screen effects\r\n            this.screenEffects = {\r\n                shake: { intensity: 0, duration: 0, x: 0, y: 0 },\r\n                flash: { intensity: 0, color: '#FFFFFF', duration: 0 },\r\n                ripple: { active: false, x: 0, y: 0, radius: 0, maxRadius: 0 },\r\n                glitch: { active: false, intensity: 0, duration: 0 }\r\n            };\r\n            \r\n            // Performance tracking\r\n            this.stats = {\r\n                drawCalls: 0,\r\n                frameTime: 0,\r\n                lastFrameTime: 0\r\n            };\r\n            \r\n            // Initialize\r\n            this.init();\r\n        }\r\n        \r\n        /**\r\n         * Initialize the renderer\r\n         */\r\n        init() {\r\n            this.setupCanvas();\r\n            if (this.enableTextures) {\r\n                this.initializePatterns();\r\n            }\r\n            this.setupEventListeners();\r\n        }\r\n        \r\n        /**\r\n         * Set up canvas properties\r\n         */\r\n        setupCanvas() {\r\n            this.ctx.imageSmoothingEnabled = true;\r\n            this.ctx.imageSmoothingQuality = 'high';\r\n            this.resizeCanvas();\r\n        }\r\n        \r\n        /**\r\n         * Resize canvas to fit window\r\n         */\r\n        resizeCanvas() {\r\n            const oldWidth = this.canvas.width;\r\n            const oldHeight = this.canvas.height;\r\n            \r\n            this.canvas.width = Math.min(window.innerWidth, 480);\r\n            this.canvas.height = window.innerHeight;\r\n            \r\n            // Re-setup context properties after resize\r\n            this.ctx.imageSmoothingEnabled = true;\r\n            this.ctx.imageSmoothingQuality = 'high';\r\n            \r\n            return { \r\n                changed: oldWidth !== this.canvas.width || oldHeight !== this.canvas.height,\r\n                width: this.canvas.width,\r\n                height: this.canvas.height\r\n            };\r\n        }\r\n        \r\n        /**\r\n         * Set up event listeners\r\n         */\r\n        setupEventListeners() {\r\n            window.addEventListener('resize', () => this.resizeCanvas());\r\n        }\r\n        \r\n        /**\r\n         * Initialize texture patterns\r\n         */\r\n        initializePatterns() {\r\n            this.patterns.wood = createTexturePattern(this.ctx, 'wood', 60);\r\n            this.patterns.marble = createTexturePattern(this.ctx, 'marble', 80);\r\n            this.patterns.fabric = createTexturePattern(this.ctx, 'fabric', 40);\r\n            this.patterns.paper = createTexturePattern(this.ctx, 'paper', 100);\r\n        }\r\n        \r\n        /**\r\n         * Clear the canvas\r\n         */\r\n        clear() {\r\n            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);\r\n            this.stats.drawCalls = 0;\r\n        }\r\n        \r\n        /**\r\n         * Begin frame rendering\r\n         */\r\n        beginFrame(currentTime) {\r\n            this.stats.frameTime = currentTime - this.stats.lastFrameTime;\r\n            this.stats.lastFrameTime = currentTime;\r\n            this.clear();\r\n        }\r\n        \r\n        /**\r\n         * End frame rendering\r\n         */\r\n        endFrame() {\r\n            this.drawScreenEffects();\r\n        }\r\n        \r\n        /**\r\n         * Draw enhanced kitchen background\r\n         */\r\n        drawBackground() {\r\n            this.ctx.save();\r\n            \r\n            // Main game area texture\r\n            if (this.enableTextures && this.patterns.fabric) {\r\n                this.ctx.fillStyle = this.patterns.fabric;\r\n                this.ctx.globalAlpha = 0.05;\r\n                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height - 100);\r\n                this.ctx.globalAlpha = 1;\r\n            }\r\n            \r\n            // Kitchen counter with wood texture\r\n            if (this.enableTextures && this.patterns.wood) {\r\n                this.ctx.fillStyle = this.patterns.wood;\r\n                this.ctx.globalAlpha = 0.6;\r\n                this.ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 100);\r\n                this.ctx.globalAlpha = 1;\r\n            }\r\n            \r\n            // Add gradient overlay for depth\r\n            const kitchenGradient = this.ctx.createLinearGradient(\r\n                0, this.canvas.height - 100, \r\n                0, this.canvas.height\r\n            );\r\n            kitchenGradient.addColorStop(0, 'rgba(139, 69, 19, 0.3)');\r\n            kitchenGradient.addColorStop(0.5, 'rgba(101, 67, 33, 0.4)');\r\n            kitchenGradient.addColorStop(1, 'rgba(83, 53, 27, 0.5)');\r\n            this.ctx.fillStyle = kitchenGradient;\r\n            this.ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 100);\r\n            \r\n            this.ctx.restore();\r\n            this.stats.drawCalls++;\r\n        }\r\n        \r\n        /**\r\n         * Draw custom button with 3D effect\r\n         */\r\n        drawButton(x, y, width, height, text, isPressed = false) {\r\n            this.ctx.save();\r\n            \r\n            // Button shadow\r\n            const shadowOffset = isPressed ? 2 : 4;\r\n            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';\r\n            this.ctx.fillRect(x + shadowOffset, y + shadowOffset, width, height);\r\n            \r\n            // Button body with gradient\r\n            const gradient = this.ctx.createLinearGradient(x, y, x, y + height);\r\n            if (isPressed) {\r\n                gradient.addColorStop(0, '#E6B800');\r\n                gradient.addColorStop(1, '#FFD700');\r\n            } else {\r\n                gradient.addColorStop(0, '#FFD700');\r\n                gradient.addColorStop(0.5, '#FFA500');\r\n                gradient.addColorStop(1, '#FF8C00');\r\n            }\r\n            \r\n            this.ctx.fillStyle = gradient;\r\n            this.ctx.fillRect(x, y, width, height);\r\n            \r\n            // Button border\r\n            this.ctx.strokeStyle = '#B8860B';\r\n            this.ctx.lineWidth = 2;\r\n            this.ctx.strokeRect(x, y, width, height);\r\n            \r\n            // Button highlight\r\n            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';\r\n            this.ctx.lineWidth = 1;\r\n            this.ctx.strokeRect(x + 1, y + 1, width - 2, height - 2);\r\n            \r\n            // Button text\r\n            this.ctx.fillStyle = '#333';\r\n            this.ctx.font = 'bold 16px Arial';\r\n            this.ctx.textAlign = 'center';\r\n            this.ctx.textBaseline = 'middle';\r\n            this.ctx.fillText(text, x + width/2, y + height/2 + (isPressed ? 1 : 0));\r\n            \r\n            this.ctx.restore();\r\n            this.stats.drawCalls++;\r\n        }\r\n        \r\n        /**\r\n         * Draw custom heart with optional beating animation\r\n         */\r\n        drawHeart(x, y, size, color = '#FF0000', beat = false, frameCount = 0) {\r\n            this.ctx.save();\r\n            this.ctx.translate(x, y);\r\n            \r\n            if (beat) {\r\n                const scale = 1 + Math.sin(frameCount * 0.3) * 0.1;\r\n                this.ctx.scale(scale, scale);\r\n            }\r\n            \r\n            this.ctx.fillStyle = color;\r\n            this.ctx.beginPath();\r\n            \r\n            // Heart shape using curves\r\n            const heartSize = size * 0.5;\r\n            this.ctx.moveTo(0, heartSize * 0.3);\r\n            this.ctx.bezierCurveTo(-heartSize, -heartSize * 0.3, -heartSize, heartSize * 0.3, 0, heartSize);\r\n            this.ctx.bezierCurveTo(heartSize, heartSize * 0.3, heartSize, -heartSize * 0.3, 0, heartSize * 0.3);\r\n            this.ctx.fill();\r\n            \r\n            // Heart highlight\r\n            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';\r\n            this.ctx.beginPath();\r\n            this.ctx.ellipse(-heartSize * 0.3, -heartSize * 0.1, heartSize * 0.2, heartSize * 0.15, 0, 0, Math.PI * 2);\r\n            this.ctx.fill();\r\n            \r\n            this.ctx.restore();\r\n            this.stats.drawCalls++;\r\n        }\r\n        \r\n        /**\r\n         * Draw custom star with optional twinkling animation\r\n         */\r\n        drawStar(x, y, size, color = '#FFD700', twinkle = false, frameCount = 0) {\r\n            this.ctx.save();\r\n            this.ctx.translate(x, y);\r\n            \r\n            if (twinkle) {\r\n                const rotation = frameCount * 0.05;\r\n                this.ctx.rotate(rotation);\r\n                const scale = 0.8 + Math.sin(frameCount * 0.2) * 0.3;\r\n                this.ctx.scale(scale, scale);\r\n            }\r\n            \r\n            this.ctx.fillStyle = color;\r\n            \r\n            // 5-pointed star\r\n            const spikes = 5;\r\n            const outerRadius = size;\r\n            const innerRadius = size * 0.4;\r\n            \r\n            this.ctx.beginPath();\r\n            for (let i = 0; i < spikes; i++) {\r\n                const angle = (i * Math.PI * 2) / spikes - Math.PI / 2;\r\n                const x1 = Math.cos(angle) * outerRadius;\r\n                const y1 = Math.sin(angle) * outerRadius;\r\n                \r\n                if (i === 0) this.ctx.moveTo(x1, y1);\r\n                else this.ctx.lineTo(x1, y1);\r\n                \r\n                const innerAngle = angle + Math.PI / spikes;\r\n                const x2 = Math.cos(innerAngle) * innerRadius;\r\n                const y2 = Math.sin(innerAngle) * innerRadius;\r\n                this.ctx.lineTo(x2, y2);\r\n            }\r\n            this.ctx.closePath();\r\n            this.ctx.fill();\r\n            \r\n            // Star highlight\r\n            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';\r\n            this.ctx.beginPath();\r\n            this.ctx.arc(0, -size * 0.2, size * 0.15, 0, Math.PI * 2);\r\n            this.ctx.fill();\r\n            \r\n            this.ctx.restore();\r\n            this.stats.drawCalls++;\r\n        }\r\n        \r\n        /**\r\n         * Draw custom burger illustration\r\n         */\r\n        drawBurger(x, y, size) {\r\n            this.ctx.save();\r\n            this.ctx.translate(x, y);\r\n            \r\n            const layers = [\r\n                { color: '#D2B48C', height: size * 0.15, type: 'bun' },\r\n                { color: '#90EE90', height: size * 0.08, type: 'lettuce' },\r\n                { color: '#FF6347', height: size * 0.08, type: 'tomato' },\r\n                { color: '#FFD700', height: size * 0.06, type: 'cheese' },\r\n                { color: '#8B4513', height: size * 0.2, type: 'patty' },\r\n                { color: '#DEB887', height: size * 0.15, type: 'bun' }\r\n            ];\r\n            \r\n            let currentY = size * 0.4;\r\n            \r\n            layers.forEach((layer) => {\r\n                this.ctx.fillStyle = layer.color;\r\n                \r\n                if (layer.type === 'bun') {\r\n                    // Rounded bun\r\n                    this.ctx.beginPath();\r\n                    this.ctx.ellipse(0, currentY, size * 0.4, layer.height, 0, 0, Math.PI * 2);\r\n                    this.ctx.fill();\r\n                    \r\n                    // Bun highlight\r\n                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';\r\n                    this.ctx.beginPath();\r\n                    this.ctx.ellipse(0, currentY - layer.height * 0.3, size * 0.3, layer.height * 0.5, 0, 0, Math.PI * 2);\r\n                    this.ctx.fill();\r\n                } else {\r\n                    // Flat ingredients\r\n                    this.ctx.beginPath();\r\n                    this.ctx.ellipse(0, currentY, size * 0.35, layer.height, 0, 0, Math.PI * 2);\r\n                    this.ctx.fill();\r\n                }\r\n                \r\n                currentY -= layer.height * 1.5;\r\n            });\r\n            \r\n            this.ctx.restore();\r\n            this.stats.drawCalls++;\r\n        }\r\n        \r\n        /**\r\n         * Draw text with enhanced styling\r\n         */\r\n        drawText(text, x, y, options = {}) {\r\n            const {\r\n                font = '16px Arial',\r\n                color = '#000000',\r\n                align = 'left',\r\n                baseline = 'top',\r\n                shadow = false,\r\n                shadowColor = 'rgba(0, 0, 0, 0.5)',\r\n                shadowBlur = 2,\r\n                shadowOffset = { x: 1, y: 1 },\r\n                stroke = false,\r\n                strokeColor = '#FFFFFF',\r\n                strokeWidth = 2\r\n            } = options;\r\n            \r\n            this.ctx.save();\r\n            \r\n            this.ctx.font = font;\r\n            this.ctx.textAlign = align;\r\n            this.ctx.textBaseline = baseline;\r\n            \r\n            if (shadow) {\r\n                this.ctx.shadowColor = shadowColor;\r\n                this.ctx.shadowBlur = shadowBlur;\r\n                this.ctx.shadowOffsetX = shadowOffset.x;\r\n                this.ctx.shadowOffsetY = shadowOffset.y;\r\n            }\r\n            \r\n            if (stroke) {\r\n                this.ctx.strokeStyle = strokeColor;\r\n                this.ctx.lineWidth = strokeWidth;\r\n                this.ctx.strokeText(text, x, y);\r\n            }\r\n            \r\n            this.ctx.fillStyle = color;\r\n            this.ctx.fillText(text, x, y);\r\n            \r\n            this.ctx.restore();\r\n            this.stats.drawCalls++;\r\n        }\r\n        \r\n        /**\r\n         * Screen shake effect\r\n         */\r\n        startScreenShake(intensity, duration) {\r\n            this.screenEffects.shake.intensity = intensity;\r\n            this.screenEffects.shake.duration = duration;\r\n        }\r\n        \r\n        updateScreenShake() {\r\n            const shake = this.screenEffects.shake;\r\n            \r\n            if (shake.duration > 0) {\r\n                shake.duration--;\r\n                shake.x = (Math.random() - 0.5) * shake.intensity;\r\n                shake.y = (Math.random() - 0.5) * shake.intensity;\r\n                \r\n                this.canvas.style.transform = `translate(${shake.x}px, ${shake.y}px)`;\r\n                shake.intensity *= 0.9; // Gradually reduce intensity\r\n            } else {\r\n                shake.intensity = 0;\r\n                shake.x = 0;\r\n                shake.y = 0;\r\n                this.canvas.style.transform = 'translate(0px, 0px)';\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Screen flash effect\r\n         */\r\n        startScreenFlash(color, intensity, duration) {\r\n            this.screenEffects.flash.color = color;\r\n            this.screenEffects.flash.intensity = intensity;\r\n            this.screenEffects.flash.duration = duration;\r\n        }\r\n        \r\n        updateScreenFlash() {\r\n            const flash = this.screenEffects.flash;\r\n            \r\n            if (flash.duration > 0) {\r\n                flash.duration--;\r\n                flash.intensity *= 0.85; // Fade out\r\n            } else {\r\n                flash.intensity = 0;\r\n            }\r\n        }\r\n        \r\n        drawScreenFlash() {\r\n            const flash = this.screenEffects.flash;\r\n            \r\n            if (flash.intensity > 0.01) {\r\n                this.ctx.save();\r\n                this.ctx.globalAlpha = flash.intensity;\r\n                this.ctx.fillStyle = flash.color;\r\n                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);\r\n                this.ctx.restore();\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Ripple effect\r\n         */\r\n        startRippleEffect(x, y, maxRadius = 100) {\r\n            this.screenEffects.ripple.active = true;\r\n            this.screenEffects.ripple.x = x;\r\n            this.screenEffects.ripple.y = y;\r\n            this.screenEffects.ripple.radius = 0;\r\n            this.screenEffects.ripple.maxRadius = maxRadius;\r\n        }\r\n        \r\n        updateRippleEffect() {\r\n            const ripple = this.screenEffects.ripple;\r\n            \r\n            if (ripple.active) {\r\n                ripple.radius += 8;\r\n                if (ripple.radius > ripple.maxRadius) {\r\n                    ripple.active = false;\r\n                }\r\n            }\r\n        }\r\n        \r\n        drawRippleEffect() {\r\n            const ripple = this.screenEffects.ripple;\r\n            \r\n            if (ripple.active) {\r\n                this.ctx.save();\r\n                this.ctx.globalAlpha = 0.3 * (1 - ripple.radius / ripple.maxRadius);\r\n                this.ctx.strokeStyle = '#ffffff';\r\n                this.ctx.lineWidth = 4;\r\n                this.ctx.beginPath();\r\n                this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);\r\n                this.ctx.stroke();\r\n                this.ctx.restore();\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Glitch effect\r\n         */\r\n        startGlitchEffect(intensity = 0.1, duration = 10) {\r\n            this.screenEffects.glitch.active = true;\r\n            this.screenEffects.glitch.intensity = intensity;\r\n            this.screenEffects.glitch.duration = duration;\r\n        }\r\n        \r\n        updateGlitchEffect() {\r\n            const glitch = this.screenEffects.glitch;\r\n            \r\n            if (glitch.active) {\r\n                glitch.duration--;\r\n                if (glitch.duration <= 0) {\r\n                    glitch.active = false;\r\n                }\r\n            }\r\n        }\r\n        \r\n        drawGlitchEffect() {\r\n            const glitch = this.screenEffects.glitch;\r\n            \r\n            if (glitch.active) {\r\n                this.ctx.save();\r\n                this.ctx.globalAlpha = 0.15;\r\n                this.ctx.fillStyle = Math.random() > 0.5 ? '#ff0000' : '#00ff00';\r\n                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);\r\n                this.ctx.restore();\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Update all screen effects\r\n         */\r\n        updateScreenEffects() {\r\n            this.updateScreenShake();\r\n            this.updateScreenFlash();\r\n            this.updateRippleEffect();\r\n            this.updateGlitchEffect();\r\n        }\r\n        \r\n        /**\r\n         * Draw all screen effects\r\n         */\r\n        drawScreenEffects() {\r\n            if (!this.enableEffects) return;\r\n            \r\n            this.drawScreenFlash();\r\n            this.drawRippleEffect();\r\n            this.drawGlitchEffect();\r\n        }\r\n        \r\n        /**\r\n         * Set up shadows for enhanced 3D effect\r\n         */\r\n        setShadow(color = 'rgba(0, 0, 0, 0.1)', blur = 5, offset = { x: 0, y: 2 }) {\r\n            if (!this.enableShadows) return;\r\n            \r\n            this.ctx.shadowColor = color;\r\n            this.ctx.shadowBlur = blur;\r\n            this.ctx.shadowOffsetX = offset.x;\r\n            this.ctx.shadowOffsetY = offset.y;\r\n        }\r\n        \r\n        /**\r\n         * Clear shadows\r\n         */\r\n        clearShadow() {\r\n            this.ctx.shadowColor = 'transparent';\r\n            this.ctx.shadowBlur = 0;\r\n            this.ctx.shadowOffsetX = 0;\r\n            this.ctx.shadowOffsetY = 0;\r\n        }\r\n        \r\n        /**\r\n         * Get canvas dimensions\r\n         */\r\n        getDimensions() {\r\n            return {\r\n                width: this.canvas.width,\r\n                height: this.canvas.height\r\n            };\r\n        }\r\n        \r\n        /**\r\n         * Get rendering statistics\r\n         */\r\n        getStats() {\r\n            return { ...this.stats };\r\n        }\r\n        \r\n        /**\r\n         * Enable/disable features\r\n         */\r\n        setFeature(feature, enabled) {\r\n            switch (feature) {\r\n                case 'textures':\r\n                    this.enableTextures = enabled;\r\n                    break;\r\n                case 'shadows':\r\n                    this.enableShadows = enabled;\r\n                    break;\r\n                case 'effects':\r\n                    this.enableEffects = enabled;\r\n                    break;\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Get canvas context (for direct drawing when needed)\r\n         */\r\n        getContext() {\r\n            return this.ctx;\r\n        }\r\n        \r\n        /**\r\n         * Get texture patterns\r\n         */\r\n        getPatterns() {\r\n            return { ...this.patterns };\r\n        }\r\n        \r\n        /**\r\n         * Create floating text element (DOM-based)\r\n         */\r\n        createFloatingText(x, y, text, color = '#FFD700') {\r\n            const div = document.createElement('div');\r\n            div.className = 'floating-text';\r\n            div.style.cssText = `\r\n            position: absolute;\r\n            left: ${x}px;\r\n            top: ${y}px;\r\n            color: ${color};\r\n            font-size: 24px;\r\n            font-weight: bold;\r\n            pointer-events: none;\r\n            z-index: 1000;\r\n            animation: floatUp 1s ease-out forwards;\r\n        `;\r\n            div.textContent = text;\r\n            document.body.appendChild(div);\r\n            \r\n            setTimeout(() => div.remove(), 1000);\r\n        }\r\n        \r\n        /**\r\n         * Cleanup renderer resources\r\n         */\r\n        destroy() {\r\n            window.removeEventListener('resize', this.resizeCanvas);\r\n            this.patterns = {};\r\n            this.canvas.style.transform = 'translate(0px, 0px)';\r\n        }\r\n    }\n\n    /**\n     * InputSystem - Handles all user input for the game\n     * \n     * Features:\n     * - Unified touch and mouse event handling\n     * - Canvas coordinate transformation\n     * - Mobile-optimized touch handling\n     * - Event delegation for game entities\n     * - Scroll prevention on mobile devices\n     * - Automatic cleanup on destruction\n     */\n    class InputSystem {\n        /**\n         * Creates a new InputSystem instance\n         * @param {HTMLCanvasElement} canvas - The game canvas element\n         * @param {Object} options - Configuration options\n         * @param {boolean} options.preventScroll - Whether to prevent document scrolling on mobile\n         * @param {boolean} options.debug - Enable debug logging\n         */\n        constructor(canvas, options = {}) {\n            this.canvas = canvas;\n            this.options = {\n                preventScroll: true,\n                debug: false,\n                ...options\n            };\n            \n            // Input state\n            this.touches = new Map(); // Track active touches\n            this.mousePosition = { x: 0, y: 0 };\n            this.isMouseDown = false;\n            \n            // Event handlers (bound to preserve context)\n            this.boundHandlers = {\n                handleTouchStart: this.handleTouchStart.bind(this),\n                handleTouchMove: this.handleTouchMove.bind(this),\n                handleTouchEnd: this.handleTouchEnd.bind(this),\n                handleMouseDown: this.handleMouseDown.bind(this),\n                handleMouseMove: this.handleMouseMove.bind(this),\n                handleMouseUp: this.handleMouseUp.bind(this),\n                handleContextMenu: this.handleContextMenu.bind(this),\n                preventScroll: this.preventScroll.bind(this),\n                handleResize: this.handleResize.bind(this)\n            };\n            \n            // Click/tap callbacks\n            this.clickHandlers = [];\n            this.moveHandlers = [];\n            this.resizeHandlers = [];\n            \n            // Canvas bounds cache\n            this.canvasBounds = null;\n            this.updateCanvasBounds();\n            \n            this.setupEventListeners();\n        }\n        \n        /**\n         * Sets up all event listeners\n         * @private\n         */\n        setupEventListeners() {\n            // Touch events\n            this.canvas.addEventListener('touchstart', this.boundHandlers.handleTouchStart, { passive: false });\n            this.canvas.addEventListener('touchmove', this.boundHandlers.handleTouchMove, { passive: false });\n            this.canvas.addEventListener('touchend', this.boundHandlers.handleTouchEnd, { passive: false });\n            this.canvas.addEventListener('touchcancel', this.boundHandlers.handleTouchEnd, { passive: false });\n            \n            // Mouse events\n            this.canvas.addEventListener('mousedown', this.boundHandlers.handleMouseDown);\n            this.canvas.addEventListener('mousemove', this.boundHandlers.handleMouseMove);\n            this.canvas.addEventListener('mouseup', this.boundHandlers.handleMouseUp);\n            this.canvas.addEventListener('mouseleave', this.boundHandlers.handleMouseUp);\n            \n            // Prevent context menu on right-click\n            this.canvas.addEventListener('contextmenu', this.boundHandlers.handleContextMenu);\n            \n            // Prevent scrolling on mobile\n            if (this.options.preventScroll) {\n                document.body.addEventListener('touchmove', this.boundHandlers.preventScroll, { passive: false });\n            }\n            \n            // Window resize\n            window.addEventListener('resize', this.boundHandlers.handleResize);\n            \n            if (this.options.debug) {\n                console.log('InputSystem: Event listeners attached');\n            }\n        }\n        \n        /**\n         * Updates cached canvas bounds\n         * @private\n         */\n        updateCanvasBounds() {\n            this.canvasBounds = this.canvas.getBoundingClientRect();\n        }\n        \n        /**\n         * Converts client coordinates to canvas coordinates\n         * @param {number} clientX - Client X coordinate\n         * @param {number} clientY - Client Y coordinate\n         * @returns {{x: number, y: number}} Canvas coordinates\n         */\n        clientToCanvas(clientX, clientY) {\n            const bounds = this.canvasBounds || this.canvas.getBoundingClientRect();\n            \n            // Account for canvas scaling\n            const scaleX = this.canvas.width / bounds.width;\n            const scaleY = this.canvas.height / bounds.height;\n            \n            return {\n                x: (clientX - bounds.left) * scaleX,\n                y: (clientY - bounds.top) * scaleY\n            };\n        }\n        \n        /**\n         * Handles touch start events\n         * @param {TouchEvent} event - The touch event\n         * @private\n         */\n        handleTouchStart(event) {\n            event.preventDefault();\n            \n            for (const touch of event.changedTouches) {\n                const canvasCoords = this.clientToCanvas(touch.clientX, touch.clientY);\n                \n                this.touches.set(touch.identifier, {\n                    id: touch.identifier,\n                    startX: canvasCoords.x,\n                    startY: canvasCoords.y,\n                    currentX: canvasCoords.x,\n                    currentY: canvasCoords.y,\n                    startTime: Date.now()\n                });\n                \n                // Trigger click handlers for touch start\n                this.triggerClick(canvasCoords.x, canvasCoords.y, 'touch');\n            }\n            \n            if (this.options.debug) {\n                console.log(`InputSystem: ${event.changedTouches.length} touch(es) started`);\n            }\n        }\n        \n        /**\n         * Handles touch move events\n         * @param {TouchEvent} event - The touch event\n         * @private\n         */\n        handleTouchMove(event) {\n            event.preventDefault();\n            \n            for (const touch of event.changedTouches) {\n                const touchData = this.touches.get(touch.identifier);\n                if (touchData) {\n                    const canvasCoords = this.clientToCanvas(touch.clientX, touch.clientY);\n                    touchData.currentX = canvasCoords.x;\n                    touchData.currentY = canvasCoords.y;\n                    \n                    // Trigger move handlers\n                    this.triggerMove(canvasCoords.x, canvasCoords.y, 'touch');\n                }\n            }\n        }\n        \n        /**\n         * Handles touch end events\n         * @param {TouchEvent} event - The touch event\n         * @private\n         */\n        handleTouchEnd(event) {\n            event.preventDefault();\n            \n            for (const touch of event.changedTouches) {\n                this.touches.delete(touch.identifier);\n            }\n            \n            if (this.options.debug) {\n                console.log(`InputSystem: Touch ended, ${this.touches.size} active touches`);\n            }\n        }\n        \n        /**\n         * Handles mouse down events\n         * @param {MouseEvent} event - The mouse event\n         * @private\n         */\n        handleMouseDown(event) {\n            const canvasCoords = this.clientToCanvas(event.clientX, event.clientY);\n            this.isMouseDown = true;\n            this.mousePosition = canvasCoords;\n            \n            // Trigger click handlers for mouse down\n            this.triggerClick(canvasCoords.x, canvasCoords.y, 'mouse');\n            \n            if (this.options.debug) {\n                console.log(`InputSystem: Mouse down at ${canvasCoords.x}, ${canvasCoords.y}`);\n            }\n        }\n        \n        /**\n         * Handles mouse move events\n         * @param {MouseEvent} event - The mouse event\n         * @private\n         */\n        handleMouseMove(event) {\n            const canvasCoords = this.clientToCanvas(event.clientX, event.clientY);\n            this.mousePosition = canvasCoords;\n            \n            if (this.isMouseDown) {\n                this.triggerMove(canvasCoords.x, canvasCoords.y, 'mouse');\n            }\n        }\n        \n        /**\n         * Handles mouse up events\n         * @param {MouseEvent} event - The mouse event\n         * @private\n         */\n        handleMouseUp(event) {\n            this.isMouseDown = false;\n            \n            if (this.options.debug) {\n                console.log('InputSystem: Mouse up');\n            }\n        }\n        \n        /**\n         * Prevents context menu\n         * @param {Event} event - The context menu event\n         * @private\n         */\n        handleContextMenu(event) {\n            event.preventDefault();\n        }\n        \n        /**\n         * Prevents document scrolling\n         * @param {TouchEvent} event - The touch event\n         * @private\n         */\n        preventScroll(event) {\n            if (event.target === this.canvas || this.canvas.contains(event.target)) {\n                event.preventDefault();\n            }\n        }\n        \n        /**\n         * Handles window resize\n         * @param {Event} event - The resize event\n         * @private\n         */\n        handleResize(event) {\n            this.updateCanvasBounds();\n            \n            // Trigger resize handlers\n            for (const handler of this.resizeHandlers) {\n                handler(this.canvas.width, this.canvas.height);\n            }\n            \n            if (this.options.debug) {\n                console.log(`InputSystem: Canvas resized to ${this.canvas.width}x${this.canvas.height}`);\n            }\n        }\n        \n        /**\n         * Triggers click handlers\n         * @param {number} x - Canvas X coordinate\n         * @param {number} y - Canvas Y coordinate\n         * @param {string} type - Input type ('touch' or 'mouse')\n         * @private\n         */\n        triggerClick(x, y, type) {\n            for (const handler of this.clickHandlers) {\n                const handled = handler(x, y, type);\n                if (handled) break; // Stop propagation if handler returns true\n            }\n        }\n        \n        /**\n         * Triggers move handlers\n         * @param {number} x - Canvas X coordinate\n         * @param {number} y - Canvas Y coordinate\n         * @param {string} type - Input type ('touch' or 'mouse')\n         * @private\n         */\n        triggerMove(x, y, type) {\n            for (const handler of this.moveHandlers) {\n                handler(x, y, type);\n            }\n        }\n        \n        /**\n         * Registers a click/tap handler\n         * @param {Function} handler - Handler function (x, y, type) => boolean\n         * @returns {Function} Unregister function\n         */\n        onClick(handler) {\n            this.clickHandlers.push(handler);\n            \n            // Return unregister function\n            return () => {\n                const index = this.clickHandlers.indexOf(handler);\n                if (index !== -1) {\n                    this.clickHandlers.splice(index, 1);\n                }\n            };\n        }\n        \n        /**\n         * Registers a move handler\n         * @param {Function} handler - Handler function (x, y, type) => void\n         * @returns {Function} Unregister function\n         */\n        onMove(handler) {\n            this.moveHandlers.push(handler);\n            \n            // Return unregister function\n            return () => {\n                const index = this.moveHandlers.indexOf(handler);\n                if (index !== -1) {\n                    this.moveHandlers.splice(index, 1);\n                }\n            };\n        }\n        \n        /**\n         * Registers a resize handler\n         * @param {Function} handler - Handler function (width, height) => void\n         * @returns {Function} Unregister function\n         */\n        onResize(handler) {\n            this.resizeHandlers.push(handler);\n            \n            // Return unregister function\n            return () => {\n                const index = this.resizeHandlers.indexOf(handler);\n                if (index !== -1) {\n                    this.resizeHandlers.splice(index, 1);\n                }\n            };\n        }\n        \n        /**\n         * Gets current touch points\n         * @returns {Array} Array of active touch points\n         */\n        getTouches() {\n            return Array.from(this.touches.values());\n        }\n        \n        /**\n         * Gets current mouse position\n         * @returns {{x: number, y: number}} Mouse position in canvas coordinates\n         */\n        getMousePosition() {\n            return { ...this.mousePosition };\n        }\n        \n        /**\n         * Checks if a point is being touched/clicked\n         * @param {number} x - X coordinate to check\n         * @param {number} y - Y coordinate to check\n         * @param {number} radius - Radius around the point to check\n         * @returns {boolean} True if point is being interacted with\n         */\n        isPointActive(x, y, radius = 0) {\n            // Check mouse\n            if (this.isMouseDown) {\n                const dx = this.mousePosition.x - x;\n                const dy = this.mousePosition.y - y;\n                if (Math.sqrt(dx * dx + dy * dy) <= radius) {\n                    return true;\n                }\n            }\n            \n            // Check touches\n            for (const touch of this.touches.values()) {\n                const dx = touch.currentX - x;\n                const dy = touch.currentY - y;\n                if (Math.sqrt(dx * dx + dy * dy) <= radius) {\n                    return true;\n                }\n            }\n            \n            return false;\n        }\n        \n        /**\n         * Removes all event listeners and cleans up\n         */\n        destroy() {\n            // Remove canvas event listeners\n            this.canvas.removeEventListener('touchstart', this.boundHandlers.handleTouchStart);\n            this.canvas.removeEventListener('touchmove', this.boundHandlers.handleTouchMove);\n            this.canvas.removeEventListener('touchend', this.boundHandlers.handleTouchEnd);\n            this.canvas.removeEventListener('touchcancel', this.boundHandlers.handleTouchEnd);\n            this.canvas.removeEventListener('mousedown', this.boundHandlers.handleMouseDown);\n            this.canvas.removeEventListener('mousemove', this.boundHandlers.handleMouseMove);\n            this.canvas.removeEventListener('mouseup', this.boundHandlers.handleMouseUp);\n            this.canvas.removeEventListener('mouseleave', this.boundHandlers.handleMouseUp);\n            this.canvas.removeEventListener('contextmenu', this.boundHandlers.handleContextMenu);\n            \n            // Remove document event listeners\n            if (this.options.preventScroll) {\n                document.body.removeEventListener('touchmove', this.boundHandlers.preventScroll);\n            }\n            \n            // Remove window event listeners\n            window.removeEventListener('resize', this.boundHandlers.handleResize);\n            \n            // Clear handlers\n            this.clickHandlers = [];\n            this.moveHandlers = [];\n            this.resizeHandlers = [];\n            \n            // Clear state\n            this.touches.clear();\n            \n            if (this.options.debug) {\n                console.log('InputSystem: Destroyed and cleaned up');\n            }\n        }\n    }\n\n    /**\n     * Physics System\n     * \n     * Comprehensive physics engine for handling gravity, collision detection,\n     * movement calculations, boundary checking, and hit detection for the game.\n     * All physics calculations are pure functions for optimal performance.\n     * \n     * @module PhysicsSystem\n     */\n\n    /**\n     * Physics constants\n     */\n    const PHYSICS_CONSTANTS = {\n        GRAVITY: 0.15,\n        TERMINAL_VELOCITY: 12,\n        BOUNCE_DAMPING: 0.7,\n        FRICTION: 0.8,\n        MIN_VELOCITY: 0.01,\n        SWAY_AMPLITUDE: 0.5,\n        SWAY_FREQUENCY: 0.05,\n        ROTATION_DAMPING: 0.98\n    };\n\n    /**\n     * PhysicsSystem class\n     * Stateless physics engine providing pure functions for physics calculations\n     */\n    class PhysicsSystem {\n        constructor(options = {}) {\n            // Canvas dimensions for boundary checking\n            this.bounds = {\n                width: options.width || 480,\n                height: options.height || 600\n            };\n            \n            // Physics settings\n            this.gravity = options.gravity || PHYSICS_CONSTANTS.GRAVITY;\n            this.terminalVelocity = options.terminalVelocity || PHYSICS_CONSTANTS.TERMINAL_VELOCITY;\n            this.bounceDamping = options.bounceDamping || PHYSICS_CONSTANTS.BOUNCE_DAMPING;\n            this.friction = options.friction || PHYSICS_CONSTANTS.FRICTION;\n            \n            // Performance optimization flags\n            this.enableRotation = options.enableRotation !== false;\n            this.enableSway = options.enableSway !== false;\n            this.enableBounce = options.enableBounce !== false;\n        }\n        \n        /**\n         * Update canvas bounds\n         * @param {number} width - Canvas width\n         * @param {number} height - Canvas height\n         */\n        updateBounds(width, height) {\n            this.bounds.width = width;\n            this.bounds.height = height;\n        }\n        \n        /**\n         * Apply gravity to a velocity\n         * @param {number} velocityY - Current Y velocity\n         * @param {number} [gravityMultiplier=1] - Gravity multiplier\n         * @returns {number} Updated Y velocity\n         */\n        applyGravity(velocityY, gravityMultiplier = 1) {\n            const newVelocity = velocityY + (this.gravity * gravityMultiplier);\n            return Math.min(newVelocity, this.terminalVelocity);\n        }\n        \n        /**\n         * Calculate position update with velocity\n         * @param {Object} position - Current position {x, y}\n         * @param {Object} velocity - Current velocity {x, y}\n         * @param {number} [deltaTime=1] - Time delta\n         * @returns {Object} New position {x, y}\n         */\n        updatePosition(position, velocity, deltaTime = 1) {\n            return {\n                x: position.x + (velocity.x * deltaTime),\n                y: position.y + (velocity.y * deltaTime)\n            };\n        }\n        \n        /**\n         * Apply horizontal sway motion\n         * @param {number} baseX - Base X position\n         * @param {number} time - Current time/frame\n         * @param {number} swayFactor - Sway intensity factor\n         * @returns {number} X position with sway applied\n         */\n        applySway(baseX, time, swayFactor = 1) {\n            if (!this.enableSway) return baseX;\n            \n            const swayAmount = Math.sin(time * PHYSICS_CONSTANTS.SWAY_FREQUENCY + swayFactor * Math.PI) \n                              * PHYSICS_CONSTANTS.SWAY_AMPLITUDE;\n            return baseX + swayAmount;\n        }\n        \n        /**\n         * Update rotation with angular velocity\n         * @param {number} rotation - Current rotation in radians\n         * @param {number} rotationSpeed - Angular velocity\n         * @param {boolean} [applyDamping=false] - Apply rotation damping\n         * @returns {Object} Updated rotation and speed\n         */\n        updateRotation(rotation, rotationSpeed, applyDamping = false) {\n            if (!this.enableRotation) return { rotation: 0, rotationSpeed: 0 };\n            \n            const newRotation = rotation + rotationSpeed;\n            const newSpeed = applyDamping \n                ? rotationSpeed * PHYSICS_CONSTANTS.ROTATION_DAMPING \n                : rotationSpeed;\n            \n            return {\n                rotation: newRotation % (Math.PI * 2),\n                rotationSpeed: Math.abs(newSpeed) < PHYSICS_CONSTANTS.MIN_VELOCITY ? 0 : newSpeed\n            };\n        }\n        \n        /**\n         * Check if entity is within canvas bounds\n         * @param {Object} entity - Entity with x, y, width, height properties\n         * @param {Object} [customBounds] - Optional custom bounds\n         * @returns {Object} Boundary check results\n         */\n        checkBounds(entity, customBounds) {\n            const bounds = customBounds || this.bounds;\n            const width = entity.width || entity.size || 0;\n            const height = entity.height || entity.size || 0;\n            \n            const left = entity.x < 0;\n            const right = entity.x + width > bounds.width;\n            const top = entity.y < 0;\n            const bottom = entity.y + height > bounds.height;\n            const offScreenBottom = entity.y > bounds.height;\n            const offScreenTop = entity.y + height < 0;\n            \n            return {\n                inBounds: !left && !right && !top && !bottom,\n                left,\n                right,\n                top,\n                bottom,\n                offScreenBottom,\n                offScreenTop\n            };\n        }\n        \n        /**\n         * Apply boundary collision with optional bounce\n         * @param {Object} entity - Entity with position and velocity\n         * @param {Object} boundaryCheck - Result from checkBounds\n         * @returns {Object} Updated position and velocity\n         */\n        applyBoundaryCollision(entity, boundaryCheck) {\n            const result = {\n                x: entity.x,\n                y: entity.y,\n                vx: entity.vx || 0,\n                vy: entity.vy || 0,\n                bounced: false\n            };\n            \n            // Left boundary\n            if (boundaryCheck.left) {\n                result.x = 0;\n                if (this.enableBounce) {\n                    result.vx = Math.abs(result.vx) * this.bounceDamping;\n                    result.bounced = true;\n                } else {\n                    result.vx = 0;\n                }\n            }\n            \n            // Right boundary\n            if (boundaryCheck.right) {\n                result.x = this.bounds.width - entity.width;\n                if (this.enableBounce) {\n                    result.vx = -Math.abs(result.vx) * this.bounceDamping;\n                    result.bounced = true;\n                } else {\n                    result.vx = 0;\n                }\n            }\n            \n            // Bottom boundary (ground)\n            if (boundaryCheck.bottom && entity.vy > 0) {\n                result.y = this.bounds.height - entity.height;\n                if (this.enableBounce) {\n                    result.vy = -Math.abs(result.vy) * this.bounceDamping;\n                    result.vx *= this.friction;\n                    result.bounced = true;\n                    \n                    // Stop tiny bounces\n                    if (Math.abs(result.vy) < PHYSICS_CONSTANTS.MIN_VELOCITY) {\n                        result.vy = 0;\n                    }\n                } else {\n                    result.vy = 0;\n                }\n            }\n            \n            return result;\n        }\n        \n        /**\n         * Circle-circle collision detection\n         * @param {Object} circle1 - First circle {x, y, radius}\n         * @param {Object} circle2 - Second circle {x, y, radius}\n         * @returns {boolean} True if circles collide\n         */\n        checkCircleCollision(circle1, circle2) {\n            const dx = circle1.x - circle2.x;\n            const dy = circle1.y - circle2.y;\n            const distance = Math.sqrt(dx * dx + dy * dy);\n            return distance < circle1.radius + circle2.radius;\n        }\n        \n        /**\n         * Point-circle collision detection\n         * @param {number} pointX - Point X coordinate\n         * @param {number} pointY - Point Y coordinate\n         * @param {Object} circle - Circle {x, y, radius}\n         * @returns {boolean} True if point is inside circle\n         */\n        checkPointCircleCollision(pointX, pointY, circle) {\n            const dx = pointX - circle.x;\n            const dy = pointY - circle.y;\n            const distance = Math.sqrt(dx * dx + dy * dy);\n            return distance <= circle.radius;\n        }\n        \n        /**\n         * Rectangle-rectangle collision detection\n         * @param {Object} rect1 - First rectangle {x, y, width, height}\n         * @param {Object} rect2 - Second rectangle {x, y, width, height}\n         * @returns {boolean} True if rectangles collide\n         */\n        checkRectCollision(rect1, rect2) {\n            return rect1.x < rect2.x + rect2.width &&\n                   rect1.x + rect1.width > rect2.x &&\n                   rect1.y < rect2.y + rect2.height &&\n                   rect1.y + rect1.height > rect2.y;\n        }\n        \n        /**\n         * Point-rectangle collision detection\n         * @param {number} pointX - Point X coordinate\n         * @param {number} pointY - Point Y coordinate\n         * @param {Object} rect - Rectangle {x, y, width, height}\n         * @returns {boolean} True if point is inside rectangle\n         */\n        checkPointRectCollision(pointX, pointY, rect) {\n            return pointX >= rect.x && \n                   pointX <= rect.x + rect.width &&\n                   pointY >= rect.y && \n                   pointY <= rect.y + rect.height;\n        }\n        \n        /**\n         * Check if a click/tap hits an entity (with size/radius)\n         * @param {number} clickX - Click X coordinate\n         * @param {number} clickY - Click Y coordinate\n         * @param {Object} entity - Entity to check\n         * @returns {boolean} True if click hits entity\n         */\n        isClicked(clickX, clickY, entity) {\n            // Handle circular entities\n            if (entity.radius !== undefined) {\n                const centerX = entity.x + (entity.size || entity.radius * 2) / 2;\n                const centerY = entity.y + (entity.size || entity.radius * 2) / 2;\n                return this.checkPointCircleCollision(clickX, clickY, {\n                    x: centerX,\n                    y: centerY,\n                    radius: entity.radius\n                });\n            }\n            \n            // Handle rectangular entities\n            if (entity.width !== undefined && entity.height !== undefined) {\n                return this.checkPointRectCollision(clickX, clickY, entity);\n            }\n            \n            // Handle entities with size property (assumed square)\n            if (entity.size !== undefined) {\n                return this.checkPointRectCollision(clickX, clickY, {\n                    x: entity.x,\n                    y: entity.y,\n                    width: entity.size,\n                    height: entity.size\n                });\n            }\n            \n            return false;\n        }\n        \n        /**\n         * Calculate distance between two points\n         * @param {number} x1 - First point X\n         * @param {number} y1 - First point Y\n         * @param {number} x2 - Second point X\n         * @param {number} y2 - Second point Y\n         * @returns {number} Distance between points\n         */\n        distance(x1, y1, x2, y2) {\n            const dx = x2 - x1;\n            const dy = y2 - y1;\n            return Math.sqrt(dx * dx + dy * dy);\n        }\n        \n        /**\n         * Calculate angle between two points\n         * @param {number} x1 - First point X\n         * @param {number} y1 - First point Y\n         * @param {number} x2 - Second point X\n         * @param {number} y2 - Second point Y\n         * @returns {number} Angle in radians\n         */\n        angle(x1, y1, x2, y2) {\n            return Math.atan2(y2 - y1, x2 - x1);\n        }\n        \n        /**\n         * Normalize a vector\n         * @param {number} x - Vector X component\n         * @param {number} y - Vector Y component\n         * @returns {Object} Normalized vector {x, y}\n         */\n        normalize(x, y) {\n            const magnitude = Math.sqrt(x * x + y * y);\n            \n            if (magnitude === 0) {\n                return { x: 0, y: 0 };\n            }\n            \n            return {\n                x: x / magnitude,\n                y: y / magnitude\n            };\n        }\n        \n        /**\n         * Apply physics update to an entity\n         * @param {Object} entity - Entity with physics properties\n         * @param {number} deltaTime - Time delta\n         * @param {Object} [options] - Additional options\n         * @returns {Object} Updated entity physics\n         */\n        updateEntity(entity, deltaTime = 1, options = {}) {\n            const result = {\n                x: entity.x,\n                y: entity.y,\n                vx: entity.vx || 0,\n                vy: entity.vy || 0,\n                rotation: entity.rotation || 0,\n                rotationSpeed: entity.rotationSpeed || 0\n            };\n            \n            // Apply gravity if entity has gravity enabled\n            if (entity.hasGravity !== false && !options.disableGravity) {\n                result.vy = this.applyGravity(\n                    result.vy, \n                    entity.gravityMultiplier || 1\n                );\n            }\n            \n            // Update position\n            const newPosition = this.updatePosition(\n                { x: result.x, y: result.y },\n                { x: result.vx, y: result.vy },\n                deltaTime\n            );\n            result.x = newPosition.x;\n            result.y = newPosition.y;\n            \n            // Apply sway if enabled\n            if (entity.sway !== undefined && this.enableSway) {\n                result.x = this.applySway(result.x, options.time || 0, entity.sway);\n            }\n            \n            // Update rotation\n            if (this.enableRotation) {\n                const rotationUpdate = this.updateRotation(\n                    result.rotation,\n                    result.rotationSpeed,\n                    entity.rotationDamping || false\n                );\n                result.rotation = rotationUpdate.rotation;\n                result.rotationSpeed = rotationUpdate.rotationSpeed;\n            }\n            \n            // Check boundaries\n            const boundaryCheck = this.checkBounds({\n                x: result.x,\n                y: result.y,\n                width: entity.width || entity.size || 0,\n                height: entity.height || entity.size || 0\n            });\n            \n            // Apply boundary collision if needed\n            if (!boundaryCheck.inBounds && entity.bounceOnBounds) {\n                const collision = this.applyBoundaryCollision(\n                    {\n                        x: result.x,\n                        y: result.y,\n                        vx: result.vx,\n                        vy: result.vy,\n                        width: entity.width || entity.size || 0,\n                        height: entity.height || entity.size || 0\n                    },\n                    boundaryCheck\n                );\n                \n                result.x = collision.x;\n                result.y = collision.y;\n                result.vx = collision.vx;\n                result.vy = collision.vy;\n                result.bounced = collision.bounced;\n            }\n            \n            result.offScreen = boundaryCheck.offScreenBottom || boundaryCheck.offScreenTop;\n            result.boundaryCheck = boundaryCheck;\n            \n            return result;\n        }\n        \n        /**\n         * Predict future position of an entity\n         * @param {Object} entity - Entity with physics properties\n         * @param {number} steps - Number of physics steps to predict\n         * @param {number} [deltaTime=1] - Time delta per step\n         * @returns {Object} Predicted position {x, y}\n         */\n        predictPosition(entity, steps, deltaTime = 1) {\n            let x = entity.x;\n            let y = entity.y;\n            let vx = entity.vx || 0;\n            let vy = entity.vy || 0;\n            \n            for (let i = 0; i < steps; i++) {\n                // Apply gravity\n                if (entity.hasGravity !== false) {\n                    vy = this.applyGravity(vy, entity.gravityMultiplier || 1);\n                }\n                \n                // Update position\n                x += vx * deltaTime;\n                y += vy * deltaTime;\n            }\n            \n            return { x, y };\n        }\n        \n        /**\n         * Calculate intercept point for moving targets\n         * @param {Object} shooter - Shooter position {x, y}\n         * @param {Object} target - Target with position and velocity {x, y, vx, vy}\n         * @param {number} projectileSpeed - Speed of projectile\n         * @returns {Object|null} Intercept point {x, y} or null if no intercept\n         */\n        calculateIntercept(shooter, target, projectileSpeed) {\n            const dx = target.x - shooter.x;\n            const dy = target.y - shooter.y;\n            const vx = target.vx || 0;\n            const vy = target.vy || 0;\n            \n            // Quadratic equation coefficients\n            const a = vx * vx + vy * vy - projectileSpeed * projectileSpeed;\n            const b = 2 * (dx * vx + dy * vy);\n            const c = dx * dx + dy * dy;\n            \n            const discriminant = b * b - 4 * a * c;\n            \n            if (discriminant < 0) return null;\n            \n            const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);\n            const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);\n            \n            const t = (t1 > 0 && t2 > 0) ? Math.min(t1, t2) : Math.max(t1, t2);\n            \n            if (t < 0) return null;\n            \n            return {\n                x: target.x + vx * t,\n                y: target.y + vy * t,\n                time: t\n            };\n        }\n    }\n\n    // Export singleton instance for convenience\n    new PhysicsSystem();\n\n    /**\n     * Mathematical Utilities\n     * \n     * Common mathematical functions and utilities used throughout the game.\n     * Includes physics calculations, random number generation, and geometric functions.\n     */\n\n\n    /**\n     * Generate random number between min and max (inclusive)\n     * Alias for random.between for backward compatibility\n     * @param {number} min - Minimum value\n     * @param {number} max - Maximum value\n     * @returns {number} Random number\n     */\n    function randomRange(min, max) {\n        return Math.random() * (max - min) + min;\n    }\n\n    /**\n     * Performance optimization utilities\n     */\n    ({\n        /**\n         * Pre-calculated sine values for performance\n         */\n        sinTable: Array.from({ length: 360 }, (_, i) => Math.sin(i * Math.PI / 180)),\n        \n        /**\n         * Pre-calculated cosine values for performance\n         */\n        cosTable: Array.from({ length: 360 }, (_, i) => Math.cos(i * Math.PI / 180))});\n\n    /**\n     * Object Pool Utility\n     * \n     * Manages pools of reusable objects to reduce garbage collection pressure\n     * and improve performance, especially on mobile devices.\n     */\n\n    class ObjectPool {\n        /**\n         * Create a new object pool\n         * @param {Function} createFn - Function to create new objects\n         * @param {Function} resetFn - Function to reset objects for reuse\n         * @param {number} initialSize - Initial pool size\n         * @param {number} maxSize - Maximum pool size\n         */\n        constructor(createFn, resetFn, initialSize = 10, maxSize = 100) {\n            this.createFn = createFn;\n            this.resetFn = resetFn;\n            this.maxSize = maxSize;\n            this.pool = [];\n            this.activeCount = 0;\n            this.totalCreated = 0;\n            this.totalReused = 0;\n            \n            // Pre-populate pool\n            for (let i = 0; i < initialSize; i++) {\n                this.pool.push(this.createFn());\n                this.totalCreated++;\n            }\n        }\n        \n        /**\n         * Get an object from the pool\n         * @param {...any} args - Arguments to pass to reset function\n         * @returns {any} Pooled object\n         */\n        get(...args) {\n            let obj;\n            \n            if (this.pool.length > 0) {\n                obj = this.pool.pop();\n                this.totalReused++;\n            } else {\n                obj = this.createFn();\n                this.totalCreated++;\n            }\n            \n            // Reset object for reuse\n            if (this.resetFn) {\n                this.resetFn(obj, ...args);\n            }\n            \n            this.activeCount++;\n            return obj;\n        }\n        \n        /**\n         * Release an object back to the pool\n         * @param {any} obj - Object to release\n         */\n        release(obj) {\n            if (!obj) return;\n            \n            // Don't exceed max pool size\n            if (this.pool.length < this.maxSize) {\n                this.pool.push(obj);\n            }\n            \n            this.activeCount = Math.max(0, this.activeCount - 1);\n        }\n        \n        /**\n         * Release multiple objects at once\n         * @param {Array} objects - Array of objects to release\n         */\n        releaseAll(objects) {\n            objects.forEach(obj => this.release(obj));\n        }\n        \n        /**\n         * Clear the pool and reset statistics\n         */\n        clear() {\n            this.pool.length = 0;\n            this.activeCount = 0;\n            this.totalCreated = 0;\n            this.totalReused = 0;\n        }\n        \n        /**\n         * Get pool statistics\n         * @returns {object} Pool statistics\n         */\n        getStats() {\n            return {\n                poolSize: this.pool.length,\n                activeCount: this.activeCount,\n                totalCreated: this.totalCreated,\n                totalReused: this.totalReused,\n                reuseRatio: this.totalCreated > 0 ? (this.totalReused / this.totalCreated) : 0,\n                maxSize: this.maxSize\n            };\n        }\n        \n        /**\n         * Check if pool is healthy (not creating too many new objects)\n         * @returns {boolean} True if pool is performing well\n         */\n        isHealthy() {\n            const stats = this.getStats();\n            return stats.reuseRatio > 0.5; // At least 50% reuse rate\n        }\n        \n        /**\n         * Resize the pool\n         * @param {number} newMaxSize - New maximum size\n         */\n        resize(newMaxSize) {\n            this.maxSize = newMaxSize;\n            \n            // Trim pool if it's now too large\n            while (this.pool.length > this.maxSize) {\n                this.pool.pop();\n            }\n        }\n        \n        /**\n         * Pre-warm the pool with objects\n         * @param {number} count - Number of objects to create\n         */\n        preWarm(count) {\n            for (let i = 0; i < count && this.pool.length < this.maxSize; i++) {\n                this.pool.push(this.createFn());\n                this.totalCreated++;\n            }\n        }\n    }\n\n    /**\n     * Pool Manager for managing multiple object pools\n     */\n    class PoolManager {\n        constructor() {\n            this.pools = new Map();\n        }\n        \n        /**\n         * Create a new pool\n         * @param {string} name - Pool name\n         * @param {Function} createFn - Function to create new objects\n         * @param {Function} resetFn - Function to reset objects\n         * @param {number} initialSize - Initial pool size\n         * @param {number} maxSize - Maximum pool size\n         */\n        createPool(name, createFn, resetFn, initialSize = 10, maxSize = 100) {\n            const pool = new ObjectPool(createFn, resetFn, initialSize, maxSize);\n            this.pools.set(name, pool);\n            return pool;\n        }\n        \n        /**\n         * Get a pool by name\n         * @param {string} name - Pool name\n         * @returns {ObjectPool} The pool\n         */\n        getPool(name) {\n            return this.pools.get(name);\n        }\n        \n        /**\n         * Get an object from a named pool\n         * @param {string} poolName - Pool name\n         * @param {...any} args - Arguments for reset function\n         * @returns {any} Pooled object\n         */\n        get(poolName, ...args) {\n            const pool = this.pools.get(poolName);\n            return pool ? pool.get(...args) : null;\n        }\n        \n        /**\n         * Release an object to a named pool\n         * @param {string} poolName - Pool name\n         * @param {any} obj - Object to release\n         */\n        release(poolName, obj) {\n            const pool = this.pools.get(poolName);\n            if (pool) {\n                pool.release(obj);\n            }\n        }\n        \n        /**\n         * Get statistics for all pools\n         * @returns {object} Statistics for all pools\n         */\n        getStats() {\n            const stats = {};\n            for (const [name, pool] of this.pools) {\n                stats[name] = pool.getStats();\n            }\n            return stats;\n        }\n        \n        /**\n         * Clear all pools\n         */\n        clearAll() {\n            for (const pool of this.pools.values()) {\n                pool.clear();\n            }\n        }\n        \n        /**\n         * Check if all pools are healthy\n         * @returns {boolean} True if all pools are performing well\n         */\n        areAllPoolsHealthy() {\n            for (const pool of this.pools.values()) {\n                if (!pool.isHealthy()) {\n                    return false;\n                }\n            }\n            return true;\n        }\n        \n        /**\n         * Get total memory savings estimate\n         * @returns {object} Memory savings information\n         */\n        getMemorySavings() {\n            let totalReused = 0;\n            let totalCreated = 0;\n            \n            for (const pool of this.pools.values()) {\n                const stats = pool.getStats();\n                totalReused += stats.totalReused;\n                totalCreated += stats.totalCreated;\n            }\n            \n            return {\n                objectsReused: totalReused,\n                objectsCreated: totalCreated,\n                savings: totalCreated > 0 ? (totalReused / totalCreated) : 0\n            };\n        }\n    }\n\n    /**\n     * Performance Monitor\n     * \n     * Monitors frame rate and performance metrics to enable adaptive quality\n     * and provide insights into performance bottlenecks for mobile optimization.\n     */\n\n    class PerformanceMonitor {\n        constructor(options = {}) {\n            this.enabled = options.enabled !== false;\n            this.sampleSize = options.sampleSize || 60; // Track last 60 frames\n            this.targetFPS = options.targetFPS || 60;\n            this.lowFPSThreshold = options.lowFPSThreshold || 45;\n            this.criticalFPSThreshold = options.criticalFPSThreshold || 30;\n            \n            // Frame timing arrays\n            this.frameTimes = [];\n            this.lastFrameTime = 0;\n            this.frameCount = 0;\n            \n            // Performance statistics\n            this.stats = {\n                currentFPS: 60,\n                averageFPS: 60,\n                minFPS: 60,\n                maxFPS: 60,\n                frameTimeMS: 16.67,\n                droppedFrames: 0,\n                performanceLevel: 'high' // high, medium, low, critical\n            };\n            \n            // Performance level history for stability\n            this.performanceLevels = [];\n            this.levelChangeDelay = options.levelChangeDelay || 120; // Frames to wait before changing level\n            \n            // Quality settings per performance level\n            this.qualitySettings = {\n                high: {\n                    maxParticles: 200,\n                    enableShadows: true,\n                    enableTextures: true,\n                    enableEffects: true,\n                    particleDetail: 1.0,\n                    renderScale: 1.0\n                },\n                medium: {\n                    maxParticles: 100,\n                    enableShadows: true,\n                    enableTextures: true,\n                    enableEffects: true,\n                    particleDetail: 0.8,\n                    renderScale: 1.0\n                },\n                low: {\n                    maxParticles: 50,\n                    enableShadows: false,\n                    enableTextures: false,\n                    enableEffects: true,\n                    particleDetail: 0.6,\n                    renderScale: 0.9\n                },\n                critical: {\n                    maxParticles: 25,\n                    enableShadows: false,\n                    enableTextures: false,\n                    enableEffects: false,\n                    particleDetail: 0.4,\n                    renderScale: 0.8\n                }\n            };\n            \n            // Event callbacks\n            this.callbacks = {\n                performanceLevelChanged: [],\n                frameDropDetected: [],\n                statsUpdated: []\n            };\n            \n            // Debug mode\n            this.debugMode = options.debugMode || false;\n        }\n        \n        /**\n         * Start monitoring (call once per frame)\n         * @param {number} currentTime - Current timestamp\n         */\n        update(currentTime) {\n            if (!this.enabled) return;\n            \n            if (this.lastFrameTime === 0) {\n                this.lastFrameTime = currentTime;\n                return;\n            }\n            \n            const frameTime = currentTime - this.lastFrameTime;\n            this.lastFrameTime = currentTime;\n            this.frameCount++;\n            \n            // Add frame time to samples\n            this.frameTimes.push(frameTime);\n            if (this.frameTimes.length > this.sampleSize) {\n                this.frameTimes.shift();\n            }\n            \n            // Update statistics\n            this.updateStats();\n            \n            // Check for performance level changes\n            this.checkPerformanceLevel();\n            \n            // Emit callbacks\n            this.emit('statsUpdated', this.stats);\n        }\n        \n        /**\n         * Update performance statistics\n         */\n        updateStats() {\n            if (this.frameTimes.length === 0) return;\n            \n            const times = this.frameTimes;\n            const frameTimeMS = times[times.length - 1];\n            \n            // Calculate FPS metrics\n            const currentFPS = Math.min(1000 / frameTimeMS, this.targetFPS);\n            const averageFrameTime = times.reduce((sum, time) => sum + time, 0) / times.length;\n            const averageFPS = Math.min(1000 / averageFrameTime, this.targetFPS);\n            const minFPS = Math.min(1000 / Math.max(...times), this.targetFPS);\n            const maxFPS = Math.min(1000 / Math.min(...times), this.targetFPS);\n            \n            // Count dropped frames (frames longer than target)\n            const targetFrameTime = 1000 / this.targetFPS;\n            const droppedFrames = times.filter(time => time > targetFrameTime * 1.5).length;\n            \n            this.stats = {\n                currentFPS: Math.round(currentFPS * 10) / 10,\n                averageFPS: Math.round(averageFPS * 10) / 10,\n                minFPS: Math.round(minFPS * 10) / 10,\n                maxFPS: Math.round(maxFPS * 10) / 10,\n                frameTimeMS: Math.round(frameTimeMS * 100) / 100,\n                droppedFrames,\n                performanceLevel: this.stats.performanceLevel\n            };\n            \n            // Detect frame drops\n            if (frameTimeMS > targetFrameTime * 2) {\n                this.emit('frameDropDetected', { frameTime: frameTimeMS, targetTime: targetFrameTime });\n            }\n        }\n        \n        /**\n         * Check if performance level should change\n         */\n        checkPerformanceLevel() {\n            let newLevel = this.determinePerformanceLevel();\n            \n            // Add to history\n            this.performanceLevels.push(newLevel);\n            if (this.performanceLevels.length > this.levelChangeDelay) {\n                this.performanceLevels.shift();\n            }\n            \n            // Only change level if it's been consistent\n            if (this.performanceLevels.length >= this.levelChangeDelay) {\n                const recentLevels = this.performanceLevels.slice(-30); // Last 30 frames\n                const levelCounts = {};\n                \n                recentLevels.forEach(level => {\n                    levelCounts[level] = (levelCounts[level] || 0) + 1;\n                });\n                \n                // Find most common level\n                const dominantLevel = Object.keys(levelCounts).reduce((a, b) => \n                    levelCounts[a] > levelCounts[b] ? a : b\n                );\n                \n                if (dominantLevel !== this.stats.performanceLevel) {\n                    const oldLevel = this.stats.performanceLevel;\n                    this.stats.performanceLevel = dominantLevel;\n                    \n                    if (this.debugMode) {\n                        console.log(`Performance level changed: ${oldLevel} → ${dominantLevel}`);\n                    }\n                    \n                    this.emit('performanceLevelChanged', {\n                        oldLevel,\n                        newLevel: dominantLevel,\n                        settings: this.getQualitySettings()\n                    });\n                }\n            }\n        }\n        \n        /**\n         * Determine appropriate performance level based on current metrics\n         * @returns {string} Performance level\n         */\n        determinePerformanceLevel() {\n            const { averageFPS, droppedFrames } = this.stats;\n            const dropRate = droppedFrames / this.sampleSize;\n            \n            if (averageFPS >= this.targetFPS * 0.9 && dropRate < 0.1) {\n                return 'high';\n            } else if (averageFPS >= this.lowFPSThreshold && dropRate < 0.2) {\n                return 'medium';\n            } else if (averageFPS >= this.criticalFPSThreshold && dropRate < 0.4) {\n                return 'low';\n            } else {\n                return 'critical';\n            }\n        }\n        \n        /**\n         * Get current quality settings\n         * @returns {object} Quality settings for current performance level\n         */\n        getQualitySettings() {\n            return { ...this.qualitySettings[this.stats.performanceLevel] };\n        }\n        \n        /**\n         * Get performance statistics\n         * @returns {object} Current performance stats\n         */\n        getStats() {\n            return { ...this.stats };\n        }\n        \n        /**\n         * Check if performance is acceptable\n         * @returns {boolean} True if performance is good\n         */\n        isPerformanceGood() {\n            return this.stats.averageFPS >= this.lowFPSThreshold && \n                   this.stats.droppedFrames / this.sampleSize < 0.2;\n        }\n        \n        /**\n         * Check if performance is critical\n         * @returns {boolean} True if performance is critically poor\n         */\n        isPerformanceCritical() {\n            return this.stats.performanceLevel === 'critical';\n        }\n        \n        /**\n         * Force a specific performance level\n         * @param {string} level - Performance level to set\n         */\n        setPerformanceLevel(level) {\n            if (this.qualitySettings[level]) {\n                const oldLevel = this.stats.performanceLevel;\n                this.stats.performanceLevel = level;\n                \n                // Clear history to prevent immediate reversion\n                this.performanceLevels = new Array(this.levelChangeDelay).fill(level);\n                \n                this.emit('performanceLevelChanged', {\n                    oldLevel,\n                    newLevel: level,\n                    settings: this.getQualitySettings(),\n                    forced: true\n                });\n            }\n        }\n        \n        /**\n         * Reset performance monitoring\n         */\n        reset() {\n            this.frameTimes = [];\n            this.lastFrameTime = 0;\n            this.frameCount = 0;\n            this.performanceLevels = [];\n            this.stats = {\n                currentFPS: 60,\n                averageFPS: 60,\n                minFPS: 60,\n                maxFPS: 60,\n                frameTimeMS: 16.67,\n                droppedFrames: 0,\n                performanceLevel: 'high'\n            };\n        }\n        \n        /**\n         * Enable/disable monitoring\n         * @param {boolean} enabled - Whether to enable monitoring\n         */\n        setEnabled(enabled) {\n            this.enabled = enabled;\n            if (!enabled) {\n                this.reset();\n            }\n        }\n        \n        /**\n         * Set debug mode\n         * @param {boolean} debug - Whether to enable debug logging\n         */\n        setDebugMode(debug) {\n            this.debugMode = debug;\n        }\n        \n        /**\n         * Add event listener\n         * @param {string} event - Event name\n         * @param {Function} callback - Callback function\n         */\n        on(event, callback) {\n            if (this.callbacks[event]) {\n                this.callbacks[event].push(callback);\n            }\n        }\n        \n        /**\n         * Remove event listener\n         * @param {string} event - Event name\n         * @param {Function} callback - Callback function to remove\n         */\n        off(event, callback) {\n            if (this.callbacks[event]) {\n                const index = this.callbacks[event].indexOf(callback);\n                if (index > -1) {\n                    this.callbacks[event].splice(index, 1);\n                }\n            }\n        }\n        \n        /**\n         * Emit event to listeners\n         * @param {string} event - Event name\n         * @param {any} data - Event data\n         */\n        emit(event, data) {\n            if (this.callbacks[event]) {\n                this.callbacks[event].forEach(callback => {\n                    try {\n                        callback(data);\n                    } catch (error) {\n                        console.error(`Error in performance monitor ${event} callback:`, error);\n                    }\n                });\n            }\n        }\n        \n        /**\n         * Get performance report\n         * @returns {object} Detailed performance report\n         */\n        getReport() {\n            return {\n                enabled: this.enabled,\n                frameCount: this.frameCount,\n                stats: this.getStats(),\n                qualitySettings: this.getQualitySettings(),\n                isHealthy: this.isPerformanceGood(),\n                isCritical: this.isPerformanceCritical(),\n                sampleSize: this.frameTimes.length,\n                targetFPS: this.targetFPS\n            };\n        }\n    }\n\n    /**\r\n     * Performance UI Display\r\n     * \r\n     * Creates a real-time performance monitoring overlay for debugging and optimization.\r\n     * Shows FPS, object pool stats, quality level, and detailed performance metrics.\r\n     */\r\n\r\n    class PerformanceUI {\r\n        constructor(options = {}) {\r\n            this.enabled = options.enabled || false;\r\n            this.position = options.position || 'top-left'; // top-left, top-right, bottom-left, bottom-right\r\n            this.updateInterval = options.updateInterval || 250; // ms\r\n            this.maxHistory = options.maxHistory || 100;\r\n            \r\n            // UI elements\r\n            this.container = null;\r\n            this.elements = {};\r\n            \r\n            // Performance data\r\n            this.performanceMonitor = null;\r\n            this.poolManager = null;\r\n            this.fpsHistory = [];\r\n            this.lastUpdate = 0;\r\n            \r\n            // Display options\r\n            this.showFPS = options.showFPS !== false;\r\n            this.showPools = options.showPools !== false;\r\n            this.showQuality = options.showQuality !== false;\r\n            this.showDetails = options.showDetails || false;\r\n            this.showGraph = options.showGraph || false;\r\n            \r\n            if (this.enabled) {\r\n                this.createUI();\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Initialize with performance monitor and pool manager\r\n         * @param {PerformanceMonitor} performanceMonitor - Performance monitoring system\r\n         * @param {PoolManager} poolManager - Object pool manager\r\n         */\r\n        init(performanceMonitor, poolManager) {\r\n            this.performanceMonitor = performanceMonitor;\r\n            this.poolManager = poolManager;\r\n        }\r\n        \r\n        /**\r\n         * Create the UI overlay\r\n         */\r\n        createUI() {\r\n            // Create container\r\n            this.container = document.createElement('div');\r\n            this.container.id = 'performance-ui';\r\n            this.container.style.cssText = this.getContainerStyles();\r\n            \r\n            // Create sections\r\n            if (this.showFPS) {\r\n                this.createFPSSection();\r\n            }\r\n            \r\n            if (this.showQuality) {\r\n                this.createQualitySection();\r\n            }\r\n            \r\n            if (this.showPools) {\r\n                this.createPoolsSection();\r\n            }\r\n            \r\n            if (this.showDetails) {\r\n                this.createDetailsSection();\r\n            }\r\n            \r\n            if (this.showGraph) {\r\n                this.createGraphSection();\r\n            }\r\n            \r\n            // Add toggle button\r\n            this.createToggleButton();\r\n            \r\n            document.body.appendChild(this.container);\r\n        }\r\n        \r\n        /**\r\n         * Get container CSS styles based on position\r\n         */\r\n        getContainerStyles() {\r\n            const baseStyles = `\r\n            position: fixed;\r\n            z-index: 10000;\r\n            background: rgba(0, 0, 0, 0.8);\r\n            color: white;\r\n            font-family: 'Courier New', monospace;\r\n            font-size: 12px;\r\n            padding: 10px;\r\n            border-radius: 5px;\r\n            min-width: 200px;\r\n            max-width: 300px;\r\n            backdrop-filter: blur(5px);\r\n        `;\r\n            \r\n            const positions = {\r\n                'top-left': 'top: 10px; left: 10px;',\r\n                'top-right': 'top: 10px; right: 10px;',\r\n                'bottom-left': 'bottom: 10px; left: 10px;',\r\n                'bottom-right': 'bottom: 10px; right: 10px;'\r\n            };\r\n            \r\n            return baseStyles + positions[this.position];\r\n        }\r\n        \r\n        /**\r\n         * Create FPS display section\r\n         */\r\n        createFPSSection() {\r\n            const section = document.createElement('div');\r\n            section.innerHTML = `\r\n            <div style=\"font-weight: bold; margin-bottom: 5px;\">🎯 Performance</div>\r\n            <div>FPS: <span id=\"perf-fps\">--</span></div>\r\n            <div>Avg: <span id=\"perf-avg-fps\">--</span></div>\r\n            <div>Min: <span id=\"perf-min-fps\">--</span></div>\r\n            <div>Frame: <span id=\"perf-frame-time\">--</span>ms</div>\r\n            <div>Drops: <span id=\"perf-drops\">--</span></div>\r\n        `;\r\n            \r\n            this.container.appendChild(section);\r\n            \r\n            // Store element references\r\n            this.elements.fps = document.getElementById('perf-fps');\r\n            this.elements.avgFps = document.getElementById('perf-avg-fps');\r\n            this.elements.minFps = document.getElementById('perf-min-fps');\r\n            this.elements.frameTime = document.getElementById('perf-frame-time');\r\n            this.elements.drops = document.getElementById('perf-drops');\r\n        }\r\n        \r\n        /**\r\n         * Create quality level section\r\n         */\r\n        createQualitySection() {\r\n            const section = document.createElement('div');\r\n            section.style.marginTop = '10px';\r\n            section.innerHTML = `\r\n            <div style=\"font-weight: bold; margin-bottom: 5px;\">⚙️ Quality</div>\r\n            <div>Level: <span id=\"perf-quality-level\">--</span></div>\r\n            <div>Particles: <span id=\"perf-max-particles\">--</span></div>\r\n            <div>Shadows: <span id=\"perf-shadows\">--</span></div>\r\n            <div>Effects: <span id=\"perf-effects\">--</span></div>\r\n        `;\r\n            \r\n            this.container.appendChild(section);\r\n            \r\n            this.elements.qualityLevel = document.getElementById('perf-quality-level');\r\n            this.elements.maxParticles = document.getElementById('perf-max-particles');\r\n            this.elements.shadows = document.getElementById('perf-shadows');\r\n            this.elements.effects = document.getElementById('perf-effects');\r\n        }\r\n        \r\n        /**\r\n         * Create object pools section\r\n         */\r\n        createPoolsSection() {\r\n            const section = document.createElement('div');\r\n            section.style.marginTop = '10px';\r\n            section.innerHTML = `\r\n            <div style=\"font-weight: bold; margin-bottom: 5px;\">🎱 Object Pools</div>\r\n            <div id=\"perf-pools-content\">\r\n                <!-- Pool stats will be inserted here -->\r\n            </div>\r\n        `;\r\n            \r\n            this.container.appendChild(section);\r\n            this.elements.poolsContent = document.getElementById('perf-pools-content');\r\n        }\r\n        \r\n        /**\r\n         * Create detailed metrics section\r\n         */\r\n        createDetailsSection() {\r\n            const section = document.createElement('div');\r\n            section.style.marginTop = '10px';\r\n            section.innerHTML = `\r\n            <div style=\"font-weight: bold; margin-bottom: 5px;\">📊 Details</div>\r\n            <div>Memory: <span id=\"perf-memory\">--</span></div>\r\n            <div>Entities: <span id=\"perf-entities\">--</span></div>\r\n            <div>Draw Calls: <span id=\"perf-draw-calls\">--</span></div>\r\n            <div>Performance: <span id=\"perf-health\">--</span></div>\r\n        `;\r\n            \r\n            this.container.appendChild(section);\r\n            \r\n            this.elements.memory = document.getElementById('perf-memory');\r\n            this.elements.entities = document.getElementById('perf-entities');\r\n            this.elements.drawCalls = document.getElementById('perf-draw-calls');\r\n            this.elements.health = document.getElementById('perf-health');\r\n        }\r\n        \r\n        /**\r\n         * Create FPS graph section\r\n         */\r\n        createGraphSection() {\r\n            const section = document.createElement('div');\r\n            section.style.marginTop = '10px';\r\n            section.innerHTML = `\r\n            <div style=\"font-weight: bold; margin-bottom: 5px;\">📈 FPS Graph</div>\r\n            <canvas id=\"perf-graph\" width=\"180\" height=\"50\" style=\"background: rgba(255,255,255,0.1); border-radius: 3px;\"></canvas>\r\n        `;\r\n            \r\n            this.container.appendChild(section);\r\n            this.elements.graph = document.getElementById('perf-graph');\r\n            this.graphCtx = this.elements.graph.getContext('2d');\r\n        }\r\n        \r\n        /**\r\n         * Create toggle button\r\n         */\r\n        createToggleButton() {\r\n            const button = document.createElement('button');\r\n            button.innerHTML = '👁️';\r\n            button.style.cssText = `\r\n            position: absolute;\r\n            top: -5px;\r\n            right: -5px;\r\n            width: 20px;\r\n            height: 20px;\r\n            border: none;\r\n            border-radius: 50%;\r\n            background: rgba(255, 255, 255, 0.2);\r\n            color: white;\r\n            font-size: 10px;\r\n            cursor: pointer;\r\n            display: flex;\r\n            align-items: center;\r\n            justify-content: center;\r\n        `;\r\n            \r\n            button.onclick = () => this.toggle();\r\n            this.container.appendChild(button);\r\n        }\r\n        \r\n        /**\r\n         * Update performance display\r\n         * @param {number} currentTime - Current timestamp\r\n         * @param {object} gameData - Additional game data (entities, etc.)\r\n         */\r\n        update(currentTime, gameData = {}) {\r\n            if (!this.enabled || !this.container || !this.performanceMonitor) return;\r\n            \r\n            // Throttle updates\r\n            if (currentTime - this.lastUpdate < this.updateInterval) return;\r\n            this.lastUpdate = currentTime;\r\n            \r\n            const stats = this.performanceMonitor.getStats();\r\n            const qualitySettings = this.performanceMonitor.getQualitySettings();\r\n            \r\n            // Update FPS data\r\n            if (this.showFPS) {\r\n                this.updateFPSDisplay(stats);\r\n            }\r\n            \r\n            // Update quality data\r\n            if (this.showQuality) {\r\n                this.updateQualityDisplay(stats, qualitySettings);\r\n            }\r\n            \r\n            // Update pool data\r\n            if (this.showPools && this.poolManager) {\r\n                this.updatePoolsDisplay();\r\n            }\r\n            \r\n            // Update detailed metrics\r\n            if (this.showDetails) {\r\n                this.updateDetailsDisplay(stats, gameData);\r\n            }\r\n            \r\n            // Update graph\r\n            if (this.showGraph) {\r\n                this.updateGraph(stats.currentFPS);\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Update FPS display elements\r\n         */\r\n        updateFPSDisplay(stats) {\r\n            if (this.elements.fps) {\r\n                this.elements.fps.textContent = stats.currentFPS.toFixed(1);\r\n                this.elements.fps.style.color = this.getFPSColor(stats.currentFPS);\r\n            }\r\n            \r\n            if (this.elements.avgFps) {\r\n                this.elements.avgFps.textContent = stats.averageFPS.toFixed(1);\r\n            }\r\n            \r\n            if (this.elements.minFps) {\r\n                this.elements.minFps.textContent = stats.minFPS.toFixed(1);\r\n            }\r\n            \r\n            if (this.elements.frameTime) {\r\n                this.elements.frameTime.textContent = stats.frameTimeMS.toFixed(2);\r\n            }\r\n            \r\n            if (this.elements.drops) {\r\n                this.elements.drops.textContent = stats.droppedFrames;\r\n                this.elements.drops.style.color = stats.droppedFrames > 5 ? '#ff6b6b' : '#51cf66';\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Update quality display elements\r\n         */\r\n        updateQualityDisplay(stats, qualitySettings) {\r\n            if (this.elements.qualityLevel) {\r\n                this.elements.qualityLevel.textContent = stats.performanceLevel;\r\n                this.elements.qualityLevel.style.color = this.getQualityColor(stats.performanceLevel);\r\n            }\r\n            \r\n            if (this.elements.maxParticles) {\r\n                this.elements.maxParticles.textContent = qualitySettings.maxParticles;\r\n            }\r\n            \r\n            if (this.elements.shadows) {\r\n                this.elements.shadows.textContent = qualitySettings.enableShadows ? '✅' : '❌';\r\n            }\r\n            \r\n            if (this.elements.effects) {\r\n                this.elements.effects.textContent = qualitySettings.enableEffects ? '✅' : '❌';\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Update pools display\r\n         */\r\n        updatePoolsDisplay() {\r\n            const poolStats = this.poolManager.getStats();\r\n            let html = '';\r\n            \r\n            for (const [name, stats] of Object.entries(poolStats)) {\r\n                const utilization = ((stats.activeCount / (stats.poolSize + stats.activeCount)) * 100).toFixed(0);\r\n                const efficiency = (stats.reuseRatio * 100).toFixed(0);\r\n                \r\n                html += `\r\n                <div style=\"font-size: 10px; margin: 2px 0;\">\r\n                    <div>${name}: ${stats.activeCount}/${stats.poolSize + stats.activeCount}</div>\r\n                    <div style=\"color: #888;\">Use: ${utilization}% | Reuse: ${efficiency}%</div>\r\n                </div>\r\n            `;\r\n            }\r\n            \r\n            if (this.elements.poolsContent) {\r\n                this.elements.poolsContent.innerHTML = html;\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Update detailed metrics\r\n         */\r\n        updateDetailsDisplay(stats, gameData) {\r\n            if (this.elements.memory && window.performance && window.performance.memory) {\r\n                const mb = (window.performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1);\r\n                this.elements.memory.textContent = `${mb}MB`;\r\n            }\r\n            \r\n            if (this.elements.entities) {\r\n                const entityCount = (gameData.particles || []).length + \r\n                                  (gameData.ingredients || []).length + \r\n                                  (gameData.powerUps || []).length;\r\n                this.elements.entities.textContent = entityCount;\r\n            }\r\n            \r\n            if (this.elements.drawCalls && gameData.renderer) {\r\n                const rendererStats = gameData.renderer.getStats();\r\n                this.elements.drawCalls.textContent = rendererStats.drawCalls || '--';\r\n            }\r\n            \r\n            if (this.elements.health) {\r\n                const isHealthy = this.performanceMonitor.isPerformanceGood();\r\n                this.elements.health.textContent = isHealthy ? '✅ Good' : '⚠️ Poor';\r\n                this.elements.health.style.color = isHealthy ? '#51cf66' : '#ff6b6b';\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Update FPS graph\r\n         */\r\n        updateGraph(currentFPS) {\r\n            if (!this.graphCtx) return;\r\n            \r\n            this.fpsHistory.push(currentFPS);\r\n            if (this.fpsHistory.length > this.maxHistory) {\r\n                this.fpsHistory.shift();\r\n            }\r\n            \r\n            // Clear canvas\r\n            this.graphCtx.clearRect(0, 0, 180, 50);\r\n            \r\n            // Draw grid\r\n            this.graphCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';\r\n            this.graphCtx.lineWidth = 1;\r\n            for (let i = 0; i <= 50; i += 10) {\r\n                this.graphCtx.beginPath();\r\n                this.graphCtx.moveTo(0, i);\r\n                this.graphCtx.lineTo(180, i);\r\n                this.graphCtx.stroke();\r\n            }\r\n            \r\n            // Draw FPS line\r\n            if (this.fpsHistory.length > 1) {\r\n                this.graphCtx.strokeStyle = '#51cf66';\r\n                this.graphCtx.lineWidth = 2;\r\n                this.graphCtx.beginPath();\r\n                \r\n                for (let i = 0; i < this.fpsHistory.length; i++) {\r\n                    const x = (i / this.fpsHistory.length) * 180;\r\n                    const y = 50 - (this.fpsHistory[i] / 60) * 50; // Assume 60 FPS max\r\n                    \r\n                    if (i === 0) {\r\n                        this.graphCtx.moveTo(x, y);\r\n                    } else {\r\n                        this.graphCtx.lineTo(x, y);\r\n                    }\r\n                }\r\n                \r\n                this.graphCtx.stroke();\r\n            }\r\n            \r\n            // Draw 60 FPS reference line\r\n            this.graphCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';\r\n            this.graphCtx.lineWidth = 1;\r\n            this.graphCtx.setLineDash([2, 2]);\r\n            this.graphCtx.beginPath();\r\n            this.graphCtx.moveTo(0, 0);\r\n            this.graphCtx.lineTo(180, 0);\r\n            this.graphCtx.stroke();\r\n            this.graphCtx.setLineDash([]);\r\n        }\r\n        \r\n        /**\r\n         * Get color for FPS display\r\n         */\r\n        getFPSColor(fps) {\r\n            if (fps >= 55) return '#51cf66'; // Green\r\n            if (fps >= 45) return '#ffd43b'; // Yellow\r\n            if (fps >= 30) return '#ff8c42'; // Orange\r\n            return '#ff6b6b'; // Red\r\n        }\r\n        \r\n        /**\r\n         * Get color for quality level display\r\n         */\r\n        getQualityColor(level) {\r\n            const colors = {\r\n                'high': '#51cf66',\r\n                'medium': '#ffd43b',\r\n                'low': '#ff8c42',\r\n                'critical': '#ff6b6b'\r\n            };\r\n            return colors[level] || '#ffffff';\r\n        }\r\n        \r\n        /**\r\n         * Toggle UI visibility\r\n         */\r\n        toggle() {\r\n            if (this.container) {\r\n                this.enabled = !this.enabled;\r\n                this.container.style.display = this.enabled ? 'block' : 'none';\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Show the UI\r\n         */\r\n        show() {\r\n            this.enabled = true;\r\n            if (this.container) {\r\n                this.container.style.display = 'block';\r\n            } else {\r\n                this.createUI();\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Hide the UI\r\n         */\r\n        hide() {\r\n            this.enabled = false;\r\n            if (this.container) {\r\n                this.container.style.display = 'none';\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Destroy the UI\r\n         */\r\n        destroy() {\r\n            if (this.container) {\r\n                this.container.remove();\r\n                this.container = null;\r\n            }\r\n            this.elements = {};\r\n        }\r\n        \r\n        /**\r\n         * Set position of the UI\r\n         * @param {string} position - New position (top-left, top-right, bottom-left, bottom-right)\r\n         */\r\n        setPosition(position) {\r\n            this.position = position;\r\n            if (this.container) {\r\n                const styles = this.getContainerStyles();\r\n                this.container.style.cssText = styles;\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Configure which sections to show\r\n         * @param {object} options - Display options\r\n         */\r\n        configure(options) {\r\n            Object.assign(this, options);\r\n            \r\n            if (this.container) {\r\n                this.container.remove();\r\n                this.createUI();\r\n            }\r\n        }\r\n    }\n\n    /**\r\n     * @fileoverview Main Game class that orchestrates all game systems and entities\r\n     * Integrates all modular components to create the complete Burger Drop game experience\r\n     */\r\n\r\n\r\n    /**\r\n     * Main Game class that manages the game loop and coordinates all systems\r\n     */\r\n    class Game {\r\n        /**\r\n         * Create a new game instance\r\n         * @param {HTMLCanvasElement} canvas - The canvas element to render to\r\n         * @param {Object} options - Game configuration options\r\n         */\r\n        constructor(canvas, options = {}) {\r\n            this.canvas = canvas;\r\n            this.ctx = canvas.getContext('2d');\r\n            \r\n            // Configuration\r\n            this.config = {\r\n                initialLives: 3,\r\n                initialSpeed: 4,\r\n                spawnRate: 40,\r\n                maxOrders: 3,\r\n                powerUpSpawnInterval: 900, // 15 seconds at 60fps\r\n                difficultyIncreaseRate: 0.0001,\r\n                ...options\r\n            };\r\n            \r\n            // Initialize game state\r\n            this.state = new GameState();\r\n            this.state.core.lives = this.config.initialLives;\r\n            \r\n            // Initialize systems\r\n            this.audioSystem = new AudioSystem();\r\n            this.renderer = new Renderer(this.canvas);\r\n            this.inputSystem = new InputSystem(this.canvas);\r\n            this.physicsSystem = new PhysicsSystem();\r\n            this.performanceMonitor = new PerformanceMonitor({\r\n                enabled: options.enablePerformanceMonitoring !== false,\r\n                debugMode: options.debugPerformance || false\r\n            });\r\n            this.performanceUI = new PerformanceUI({\r\n                enabled: options.showPerformanceUI || false,\r\n                position: options.performanceUIPosition || 'top-right',\r\n                showFPS: true,\r\n                showPools: true,\r\n                showQuality: true,\r\n                showDetails: options.debugPerformance || false,\r\n                showGraph: options.debugPerformance || false\r\n            });\r\n            \r\n            // Entity arrays\r\n            this.ingredients = [];\r\n            this.orders = [];\r\n            this.particles = [];\r\n            this.powerUps = [];\r\n            \r\n            // Initialize object pools\r\n            this.poolManager = new PoolManager();\r\n            this.initializeObjectPools();\r\n            \r\n            // Game loop variables\r\n            this.animationId = null;\r\n            this.lastTime = 0;\r\n            this.deltaTime = 0;\r\n            this.frameCount = 0;\r\n            this.isPaused = false;\r\n            \r\n            // Spawn timers\r\n            this.lastSpawn = 0;\r\n            this.lastPowerUpSpawn = 0;\r\n            \r\n            // Order templates\r\n            this.orderTemplates = [\r\n                { name: 'Classic Burger', ingredients: ['bun_bottom', 'patty', 'cheese', 'lettuce', 'tomato', 'bun_top'], time: 30 },\r\n                { name: 'Simple Burger', ingredients: ['bun_bottom', 'patty', 'bun_top'], time: 20 },\r\n                { name: 'Cheese Burger', ingredients: ['bun_bottom', 'patty', 'cheese', 'bun_top'], time: 25 },\r\n                { name: 'Veggie Burger', ingredients: ['bun_bottom', 'lettuce', 'tomato', 'onion', 'pickle', 'bun_top'], time: 30 },\r\n                { name: 'Bacon Burger', ingredients: ['bun_bottom', 'patty', 'bacon', 'cheese', 'bun_top'], time: 35 },\r\n                { name: 'Breakfast Burger', ingredients: ['bun_bottom', 'patty', 'egg', 'bacon', 'cheese', 'bun_top'], time: 40 }\r\n            ];\r\n            \r\n            // Bind methods\r\n            this.update = this.update.bind(this);\r\n            this.render = this.render.bind(this);\r\n            this.gameLoop = this.gameLoop.bind(this);\r\n            this.handleInput = this.handleInput.bind(this);\r\n            \r\n            // Setup input handlers\r\n            this.setupInputHandlers();\r\n            \r\n            // Initialize renderer patterns\r\n            this.renderer.initializePatterns();\r\n            \r\n            // Load high score\r\n            this.loadHighScore();\r\n        }\r\n        \r\n        /**\r\n         * Initialize object pools for frequently created objects\r\n         */\r\n        initializeObjectPools() {\r\n            // Particle pool for general particles\r\n            this.poolManager.createPool('particle',\r\n                Particle.createFactory(),\r\n                Particle.resetParticle,\r\n                50, // initial size\r\n                200 // max size\r\n            );\r\n            \r\n            // Celebration particle pool (for special effects)\r\n            this.poolManager.createPool('celebrationParticle',\r\n                Particle.createFactory(),\r\n                Particle.resetParticle,\r\n                20, // initial size\r\n                100 // max size\r\n            );\r\n            \r\n            // Ingredient pool\r\n            this.poolManager.createPool('ingredient',\r\n                () => new Ingredient('bun_top', { canvasWidth: this.canvas.width, canvasHeight: this.canvas.height }),\r\n                (ingredient, type, options = {}) => {\r\n                    ingredient.init(type, {\r\n                        ...options,\r\n                        canvasWidth: this.canvas.width,\r\n                        canvasHeight: this.canvas.height\r\n                    });\r\n                },\r\n                15, // initial size\r\n                50  // max size\r\n            );\r\n            \r\n            // Setup performance monitoring callbacks\r\n            this.setupPerformanceCallbacks();\r\n            \r\n            // Initialize performance UI\r\n            this.performanceUI.init(this.performanceMonitor, this.poolManager);\r\n        }\r\n        \r\n        /**\r\n         * Setup performance monitoring callbacks\r\n         */\r\n        setupPerformanceCallbacks() {\r\n            // Listen for performance level changes\r\n            this.performanceMonitor.on('performanceLevelChanged', (data) => {\r\n                const { newLevel, settings } = data;\r\n                console.log(`Performance level changed to: ${newLevel}`);\r\n                \r\n                // Apply new quality settings\r\n                this.applyQualitySettings(settings);\r\n            });\r\n            \r\n            // Listen for frame drops\r\n            this.performanceMonitor.on('frameDropDetected', (data) => {\r\n                if (this.config.debugPerformance) {\r\n                    console.warn(`Frame drop detected: ${data.frameTime.toFixed(2)}ms`);\r\n                }\r\n            });\r\n        }\r\n        \r\n        /**\r\n         * Apply quality settings based on performance level\r\n         * @param {Object} settings - Quality settings to apply\r\n         */\r\n        applyQualitySettings(settings) {\r\n            // Update renderer settings\r\n            this.renderer.setFeature('shadows', settings.enableShadows);\r\n            this.renderer.setFeature('textures', settings.enableTextures);\r\n            this.renderer.setFeature('effects', settings.enableEffects);\r\n            \r\n            // Update particle limits\r\n            this.maxParticles = settings.maxParticles;\r\n            \r\n            // Update pool sizes based on performance level\r\n            const particlePool = this.poolManager.getPool('particle');\r\n            const celebrationPool = this.poolManager.getPool('celebrationParticle');\r\n            \r\n            if (particlePool) {\r\n                particlePool.resize(Math.floor(settings.maxParticles * 1.5));\r\n            }\r\n            if (celebrationPool) {\r\n                celebrationPool.resize(Math.floor(settings.maxParticles * 0.5));\r\n            }\r\n            \r\n            // Trim excess particles if we're over the new limit\r\n            if (this.particles.length > settings.maxParticles) {\r\n                const excessParticles = this.particles.splice(settings.maxParticles);\r\n                excessParticles.forEach(particle => {\r\n                    if (particle.type === 'celebration') {\r\n                        this.poolManager.release('celebrationParticle', particle);\r\n                    } else {\r\n                        this.poolManager.release('particle', particle);\r\n                    }\r\n                });\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Setup input event handlers\r\n         */\r\n        setupInputHandlers() {\r\n            this.unregisterClick = this.inputSystem.onClick((event) => this.handleInput(event));\r\n        }\r\n        \r\n        /**\r\n         * Handle input events\r\n         * @param {Object} event - Input event data\r\n         */\r\n        handleInput(event) {\r\n            if (!this.state.core.running || this.isPaused) return;\r\n            \r\n            const { x, y } = event;\r\n            \r\n            // Check power-up collection\r\n            for (let i = this.powerUps.length - 1; i >= 0; i--) {\r\n                const powerUp = this.powerUps[i];\r\n                if (powerUp.isClicked(x, y)) {\r\n                    this.collectPowerUp(powerUp, i);\r\n                    return;\r\n                }\r\n            }\r\n            \r\n            // Check ingredient collection\r\n            for (let i = this.ingredients.length - 1; i >= 0; i--) {\r\n                const ingredient = this.ingredients[i];\r\n                if (ingredient.isClicked(x, y)) {\r\n                    this.collectIngredient(ingredient, i);\r\n                    return;\r\n                }\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Collect a power-up\r\n         * @param {PowerUp} powerUp - The power-up to collect\r\n         * @param {number} index - Index in the power-ups array\r\n         */\r\n        collectPowerUp(powerUp, index) {\r\n            // Activate the power-up\r\n            this.state.activatePowerUp(powerUp.type);\r\n            \r\n            // Play sound\r\n            this.audioSystem.playPowerUpActivate(powerUp.type);\r\n            \r\n            // Visual feedback\r\n            this.renderer.startScreenFlash(powerUp.data.color, 0.2, 8);\r\n            \r\n            // Create celebration particles\r\n            const centerX = powerUp.x + powerUp.size / 2;\r\n            const centerY = powerUp.y + powerUp.size / 2;\r\n            \r\n            for (let i = 0; i < 3; i++) {\r\n                const particle = this.poolManager.get('celebrationParticle',\r\n                    centerX + randomRange(-50, 50),\r\n                    centerY + randomRange(-50, 50),\r\n                    powerUp.data.color,\r\n                    powerUp.data.emoji,\r\n                    {}\r\n                );\r\n                this.particles.push(particle);\r\n            }\r\n            \r\n            // Remove power-up\r\n            this.powerUps.splice(index, 1);\r\n        }\r\n        \r\n        /**\r\n         * Collect an ingredient\r\n         * @param {Ingredient} ingredient - The ingredient to collect\r\n         * @param {number} index - Index in the ingredients array\r\n         */\r\n        collectIngredient(ingredient, index) {\r\n            if (this.config?.debug) {\r\n                console.log('Collecting ingredient:', ingredient.type, 'at index:', index);\r\n            }\r\n            try {\r\n                let correctOrder = null;\r\n                let result = 'wrong';\r\n            \r\n            // Check all orders for matching ingredient\r\n            for (const order of this.orders) {\r\n                result = order.checkIngredient(ingredient.type);\r\n                if (result !== 'wrong') {\r\n                    correctOrder = order;\r\n                    break;\r\n                }\r\n            }\r\n            \r\n            if (result !== 'wrong') {\r\n                // Correct ingredient\r\n                const points = this.calculatePoints(ingredient, correctOrder);\r\n                this.state.updateScore(points);\r\n                \r\n                if (result === 'completed') {\r\n                    // Order completed\r\n                    this.completeOrder(correctOrder);\r\n                } else {\r\n                    // Correct ingredient, order continues\r\n                    this.state.incrementCombo();\r\n                    this.audioSystem.playCollect();\r\n                    \r\n                    // Create success particles\r\n                    for (let i = 0; i < 5; i++) {\r\n                        const particle = this.poolManager.get('particle',\r\n                            ingredient.x + ingredient.data.size / 2,\r\n                            ingredient.y + ingredient.data.size / 2,\r\n                            '#00FF00',\r\n                            '',\r\n                            'star',\r\n                            {}\r\n                        );\r\n                        this.particles.push(particle);\r\n                    }\r\n                }\r\n                \r\n                // Create floating score text\r\n                this.createFloatingText(\r\n                    `+${points}`,\r\n                    ingredient.x + ingredient.data.size / 2,\r\n                    ingredient.y,\r\n                    '#00FF00'\r\n                );\r\n            } else {\r\n                // Wrong ingredient\r\n                this.state.resetCombo();\r\n                this.renderer.startScreenShake(10, 15);\r\n                this.audioSystem.playError();\r\n                \r\n                // Create error particles\r\n                for (let i = 0; i < 3; i++) {\r\n                    const particle = this.poolManager.get('particle',\r\n                        ingredient.x + ingredient.data.size / 2,\r\n                        ingredient.y + ingredient.data.size / 2,\r\n                        '#FF0000',\r\n                        '✗',\r\n                        'default',\r\n                        {}\r\n                    );\r\n                    this.particles.push(particle);\r\n                }\r\n            }\r\n            \r\n            // Remove ingredient\r\n            ingredient.collected = true;\r\n            this.ingredients.splice(index, 1);\r\n            this.poolManager.release('ingredient', ingredient);\r\n            } catch (error) {\r\n                console.error('Error collecting ingredient:', error);\r\n                // Still remove the ingredient even if there was an error\r\n                this.ingredients.splice(index, 1);\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Calculate points for collecting an ingredient\r\n         * @param {Ingredient} ingredient - The collected ingredient\r\n         * @param {Order} order - The order being filled\r\n         * @returns {number} Points earned\r\n         */\r\n        calculatePoints(ingredient, order) {\r\n            let basePoints = 10;\r\n            \r\n            // Time bonus\r\n            const timeBonus = Math.floor(order.timeLeft / 1000);\r\n            \r\n            // Combo multiplier\r\n            const comboMultiplier = this.state.core.combo;\r\n            \r\n            // Power-up multiplier\r\n            const powerUpMultiplier = this.state.powerUps.scoreMultiplier.active ? \r\n                this.state.powerUps.scoreMultiplier.multiplier : 1;\r\n            \r\n            return Math.floor((basePoints + timeBonus) * comboMultiplier * powerUpMultiplier);\r\n        }\r\n        \r\n        /**\r\n         * Complete an order\r\n         * @param {Order} order - The completed order\r\n         */\r\n        completeOrder(order) {\r\n            // Big combo increase\r\n            this.state.incrementCombo(5);\r\n            \r\n            // Bonus points\r\n            const bonusPoints = Math.floor(100 * this.state.core.combo * \r\n                (this.state.powerUps.scoreMultiplier.active ? 2 : 1));\r\n            this.state.updateScore(bonusPoints);\r\n            \r\n            // Play success sound\r\n            this.audioSystem.playOrderComplete();\r\n            \r\n            // Visual celebration\r\n            this.renderer.startScreenFlash('#FFD700', 0.3, 10);\r\n            \r\n            // Create celebration particles\r\n            const orderCenterX = order.x + order.width / 2;\r\n            const orderCenterY = order.y + order.height / 2;\r\n            \r\n            for (let i = 0; i < 10; i++) {\r\n                const angle = (i / 10) * Math.PI * 2;\r\n                const speed = randomRange(3, 6);\r\n                const particle = this.poolManager.get('celebrationParticle',\r\n                    orderCenterX,\r\n                    orderCenterY,\r\n                    getRandomColor(),\r\n                    '⭐',\r\n                    {\r\n                        vx: Math.cos(angle) * speed,\r\n                        vy: Math.sin(angle) * speed\r\n                    }\r\n                );\r\n                this.particles.push(particle);\r\n            }\r\n            \r\n            // Create floating text\r\n            this.createFloatingText(\r\n                `+${bonusPoints}`,\r\n                orderCenterX,\r\n                orderCenterY,\r\n                '#FFD700'\r\n            );\r\n            \r\n            // Remove completed order\r\n            const index = this.orders.indexOf(order);\r\n            if (index > -1) {\r\n                this.orders.splice(index, 1);\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Create floating text effect\r\n         * @param {string} text - Text to display\r\n         * @param {number} x - X position\r\n         * @param {number} y - Y position\r\n         * @param {string} color - Text color\r\n         */\r\n        createFloatingText(text, x, y, color) {\r\n            const floatingText = document.createElement('div');\r\n            floatingText.className = 'floating-text';\r\n            floatingText.textContent = text;\r\n            floatingText.style.left = `${x}px`;\r\n            floatingText.style.top = `${y}px`;\r\n            floatingText.style.color = color;\r\n            floatingText.style.fontSize = '24px';\r\n            \r\n            document.getElementById('ui').appendChild(floatingText);\r\n            \r\n            // Remove after animation\r\n            setTimeout(() => {\r\n                floatingText.remove();\r\n            }, 1000);\r\n        }\r\n        \r\n        /**\r\n         * Spawn a new ingredient\r\n         */\r\n        spawnIngredient() {\r\n            // Get all possible ingredients from current orders\r\n            const possibleTypes = new Set();\r\n            this.orders.forEach(order => {\r\n                if (order.currentIndex < order.ingredients.length) {\r\n                    possibleTypes.add(order.ingredients[order.currentIndex]);\r\n                    // Add some random ingredients for challenge\r\n                    const ingredientTypes = Ingredient.getAvailableTypes();\r\n                    const randomType = ingredientTypes[Math.floor(Math.random() * ingredientTypes.length)];\r\n                    possibleTypes.add(randomType);\r\n                }\r\n            });\r\n            \r\n            if (possibleTypes.size > 0) {\r\n                const typesArray = Array.from(possibleTypes);\r\n                const type = typesArray[Math.floor(Math.random() * typesArray.length)];\r\n                \r\n                // Get ingredient from pool\r\n                const ingredient = this.poolManager.get('ingredient', type, {\r\n                    canvasWidth: this.canvas.width,\r\n                    canvasHeight: this.canvas.height\r\n                });\r\n                \r\n                // Apply current speed with difficulty scaling\r\n                const difficultyMultiplier = 1 + (this.state.core.score * this.config.difficultyIncreaseRate);\r\n                ingredient.speed *= difficultyMultiplier;\r\n                ingredient.baseSpeed *= difficultyMultiplier;\r\n                \r\n                this.ingredients.push(ingredient);\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Spawn a new order\r\n         */\r\n        spawnOrder() {\r\n            if (this.orders.length < this.config.maxOrders) {\r\n                const template = this.orderTemplates[Math.floor(Math.random() * this.orderTemplates.length)];\r\n                this.orders.push(new Order(template));\r\n                this.audioSystem.playNewOrder();\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Spawn a power-up\r\n         */\r\n        spawnPowerUp() {\r\n            if (this.powerUps.length < 1 && this.frameCount - this.lastPowerUpSpawn > this.config.powerUpSpawnInterval) {\r\n                const types = Object.keys(PowerUp.getPowerUpTypes());\r\n                const randomType = types[Math.floor(Math.random() * types.length)];\r\n                this.powerUps.push(new PowerUp(randomType));\r\n                this.lastPowerUpSpawn = this.frameCount;\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Update game state\r\n         * @param {number} deltaTime - Time since last update in milliseconds\r\n         */\r\n        update(deltaTime) {\r\n            if (!this.state.core.running || this.isPaused) return;\r\n            \r\n            this.frameCount++;\r\n            \r\n            // Update game state\r\n            this.state.update(deltaTime);\r\n            \r\n            // Update color theme\r\n            if (this.renderer.updateColorTheme) {\r\n                this.renderer.updateColorTheme(this.state.core.combo, this.state.core.score, this.frameCount);\r\n            }\r\n            \r\n            // Spawn entities\r\n            if (this.frameCount - this.lastSpawn > this.config.spawnRate) {\r\n                this.spawnIngredient();\r\n                this.lastSpawn = this.frameCount;\r\n            }\r\n            \r\n            // Spawn orders\r\n            if (this.orders.length === 0 || (this.orders.length < this.config.maxOrders && Math.random() < 0.01)) {\r\n                this.spawnOrder();\r\n            }\r\n            \r\n            // Spawn power-ups\r\n            this.spawnPowerUp();\r\n            \r\n            // Update ingredients\r\n            for (let i = this.ingredients.length - 1; i >= 0; i--) {\r\n                const ingredient = this.ingredients[i];\r\n                ingredient.update(this.frameCount, this.state.powerUps);\r\n                \r\n                // Remove if off screen\r\n                if (ingredient.y > this.canvas.height + 50) {\r\n                    this.ingredients.splice(i, 1);\r\n                    this.poolManager.release('ingredient', ingredient);\r\n                }\r\n            }\r\n            \r\n            // Update orders\r\n            for (let i = this.orders.length - 1; i >= 0; i--) {\r\n                const order = this.orders[i];\r\n                if (!order.update(deltaTime, this.state.powerUps)) {\r\n                    // Order expired\r\n                    this.orders.splice(i, 1);\r\n                    this.state.loseLife();\r\n                    this.audioSystem.playOrderExpire();\r\n                    this.renderer.startScreenShake(20, 30);\r\n                    \r\n                    // Check game over\r\n                    if (this.state.core.lives <= 0) {\r\n                        this.gameOver();\r\n                    }\r\n                }\r\n            }\r\n            \r\n            // Update particles\r\n            for (let i = this.particles.length - 1; i >= 0; i--) {\r\n                const particle = this.particles[i];\r\n                particle.update(this.frameCount);\r\n                \r\n                if (particle.life <= 0) {\r\n                    this.particles.splice(i, 1);\r\n                    // Release back to appropriate pool\r\n                    if (particle.type === 'celebration') {\r\n                        this.poolManager.release('celebrationParticle', particle);\r\n                    } else {\r\n                        this.poolManager.release('particle', particle);\r\n                    }\r\n                }\r\n            }\r\n            \r\n            // Update power-ups\r\n            for (let i = this.powerUps.length - 1; i >= 0; i--) {\r\n                const powerUp = this.powerUps[i];\r\n                powerUp.update();\r\n                \r\n                // Remove if off screen\r\n                if (powerUp.y > this.canvas.height + 50) {\r\n                    this.powerUps.splice(i, 1);\r\n                }\r\n            }\r\n            \r\n            // Update systems\r\n            this.renderer.updateScreenEffects();\r\n            \r\n            // Update UI\r\n            this.updateUI();\r\n        }\r\n        \r\n        /**\r\n         * Render game state\r\n         */\r\n        render() {\r\n            // Clear canvas\r\n            this.renderer.clear(this.canvas.width, this.canvas.height);\r\n            \r\n            // Apply screen shake\r\n            this.renderer.applyScreenShake();\r\n            \r\n            // Draw background\r\n            this.renderer.drawBackground(this.canvas.width, this.canvas.height);\r\n            \r\n            // Draw orders\r\n            this.orders.forEach((order, index) => {\r\n                order.draw(this.ctx, index, this.frameCount, this.renderer);\r\n            });\r\n            \r\n            // Draw ingredients\r\n            this.ingredients.forEach(ingredient => {\r\n                ingredient.draw(this.ctx, this.frameCount);\r\n            });\r\n            \r\n            // Draw power-ups\r\n            this.powerUps.forEach(powerUp => {\r\n                powerUp.draw(this.ctx, this.frameCount);\r\n            });\r\n            \r\n            // Draw particles\r\n            this.particles.forEach(particle => {\r\n                particle.draw(this.ctx, this.frameCount);\r\n            });\r\n            \r\n            // Apply screen flash\r\n            this.renderer.applyScreenFlash(this.canvas.width, this.canvas.height);\r\n            \r\n            // Reset transform\r\n            this.ctx.setTransform(1, 0, 0, 1, 0, 0);\r\n        }\r\n        \r\n        /**\r\n         * Main game loop\r\n         * @param {number} currentTime - Current timestamp\r\n         */\r\n        gameLoop(currentTime) {\r\n            if (!this.lastTime) {\r\n                this.lastTime = currentTime;\r\n            }\r\n            \r\n            // Update performance monitoring\r\n            this.performanceMonitor.update(currentTime);\r\n            \r\n            this.deltaTime = currentTime - this.lastTime;\r\n            this.lastTime = currentTime;\r\n            this.frameCount++;\r\n            \r\n            this.update(this.deltaTime);\r\n            this.render();\r\n            \r\n            // Update performance UI\r\n            this.performanceUI.update(currentTime, {\r\n                particles: this.particles,\r\n                ingredients: this.ingredients,\r\n                powerUps: this.powerUps,\r\n                renderer: this.renderer\r\n            });\r\n            \r\n            this.animationId = requestAnimationFrame((time) => this.gameLoop(time));\r\n        }\r\n        \r\n        /**\r\n         * Update UI elements\r\n         */\r\n        updateUI() {\r\n            // Update score\r\n            const scoreElement = document.getElementById('score');\r\n            if (scoreElement) {\r\n                scoreElement.textContent = `Score: ${this.state.core.score}`;\r\n                // Score change animation handled by State events\r\n                // Animation could be triggered here if needed\r\n            }\r\n            \r\n            // Update combo\r\n            const comboElement = document.getElementById('combo');\r\n            if (comboElement) {\r\n                comboElement.textContent = `Combo: x${this.state.core.combo}`;\r\n                // Combo change animation handled by State events\r\n                // Animation could be triggered here if needed\r\n            }\r\n            \r\n            // Update lives\r\n            const livesElement = document.getElementById('lives');\r\n            if (livesElement) {\r\n                livesElement.textContent = '❤️'.repeat(this.state.core.lives);\r\n                // Lives change animation handled by State events\r\n                // Animation could be triggered here if needed\r\n            }\r\n            \r\n            // Update power-up status\r\n            const powerUpStatus = document.getElementById('powerUpStatus');\r\n            if (powerUpStatus) {\r\n                powerUpStatus.innerHTML = '';\r\n                \r\n                for (const [type, powerUp] of Object.entries(this.state.powerUps)) {\r\n                    if (powerUp.active) {\r\n                        const indicator = document.createElement('div');\r\n                        indicator.className = `power-up-indicator ${type.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase()}`;\r\n                        \r\n                        const powerUpData = PowerUp.getPowerUpTypes()[type];\r\n                        indicator.innerHTML = `\r\n                        <span>${powerUpData.emoji}</span>\r\n                        <span>${powerUpData.name}</span>\r\n                        <span class=\"power-up-timer\">${Math.ceil(powerUp.timeLeft / 1000)}s</span>\r\n                    `;\r\n                        \r\n                        powerUpStatus.appendChild(indicator);\r\n                    }\r\n                }\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Handle game over\r\n         */\r\n        gameOver() {\r\n            this.state.endGame();\r\n            this.audioSystem.playGameOver();\r\n            \r\n            // Update high score\r\n            if (this.state.core.score > this.state.core.highScore) {\r\n                this.state.core.highScore = this.state.core.score;\r\n                this.saveHighScore();\r\n            }\r\n            \r\n            // Show game over screen\r\n            const gameOverElement = document.getElementById('gameOver');\r\n            if (gameOverElement) {\r\n                gameOverElement.style.display = 'block';\r\n                document.getElementById('finalScore').textContent = `Final Score: ${this.state.core.score}`;\r\n                document.getElementById('highScore').textContent = `High Score: ${this.state.core.highScore}`;\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Load high score from localStorage\r\n         */\r\n        loadHighScore() {\r\n            try {\r\n                const savedScore = localStorage.getItem('burgerDropHighScore');\r\n                if (savedScore) {\r\n                    this.state.core.highScore = parseInt(savedScore) || 0;\r\n                }\r\n            } catch (e) {\r\n                console.warn('Could not load high score:', e);\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Save high score to localStorage\r\n         */\r\n        saveHighScore() {\r\n            try {\r\n                localStorage.setItem('burgerDropHighScore', this.state.core.highScore.toString());\r\n            } catch (e) {\r\n                console.warn('Could not save high score:', e);\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Start the game\r\n         */\r\n        start() {\r\n            // Hide start screen\r\n            const startScreen = document.getElementById('startScreen');\r\n            if (startScreen) {\r\n                startScreen.style.display = 'none';\r\n            }\r\n            \r\n            // Reset game state\r\n            this.state.startGame();\r\n            \r\n            // Release all entities back to pools\r\n            this.particles.forEach(particle => {\r\n                if (particle.type === 'celebration') {\r\n                    this.poolManager.release('celebrationParticle', particle);\r\n                } else {\r\n                    this.poolManager.release('particle', particle);\r\n                }\r\n            });\r\n            this.ingredients.forEach(ingredient => {\r\n                this.poolManager.release('ingredient', ingredient);\r\n            });\r\n            \r\n            // Clear arrays\r\n            this.ingredients = [];\r\n            this.orders = [];\r\n            this.particles = [];\r\n            this.powerUps = [];\r\n            this.frameCount = 0;\r\n            this.lastSpawn = 0;\r\n            this.lastPowerUpSpawn = 0;\r\n            \r\n            // Start background music\r\n            this.audioSystem.startBackgroundMusic();\r\n            \r\n            // Set game state\r\n            // Game state is now managed by state.startGame()\r\n            \r\n            // Start game loop\r\n            this.lastTime = 0;\r\n            this.gameLoop(0);\r\n        }\r\n        \r\n        /**\r\n         * Stop the game\r\n         */\r\n        stop() {\r\n            if (this.animationId) {\r\n                cancelAnimationFrame(this.animationId);\r\n                this.animationId = null;\r\n            }\r\n            \r\n            this.audioSystem.stopBackgroundMusic();\r\n            this.state.endGame();\r\n        }\r\n        \r\n        /**\r\n         * Toggle performance UI display\r\n         */\r\n        togglePerformanceUI() {\r\n            this.performanceUI.toggle();\r\n        }\r\n        \r\n        /**\r\n         * Show performance UI\r\n         */\r\n        showPerformanceUI() {\r\n            this.performanceUI.show();\r\n        }\r\n        \r\n        /**\r\n         * Hide performance UI\r\n         */\r\n        hidePerformanceUI() {\r\n            this.performanceUI.hide();\r\n        }\r\n        \r\n        /**\r\n         * Pause/unpause the game\r\n         */\r\n        pause() {\r\n            this.isPaused = !this.isPaused;\r\n            \r\n            if (this.isPaused) {\r\n                this.audioSystem.pauseBackgroundMusic();\r\n            } else {\r\n                this.audioSystem.resumeBackgroundMusic();\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Handle window resize\r\n         */\r\n        resize() {\r\n            // Canvas will be resized externally\r\n            // Update canvas dimensions in pools\r\n            const ingredientPool = this.poolManager.getPool('ingredient');\r\n            if (ingredientPool) {\r\n                ingredientPool.config.canvasWidth = this.canvas.width;\r\n                ingredientPool.config.canvasHeight = this.canvas.height;\r\n            }\r\n        }\r\n        \r\n        /**\r\n         * Get object pool statistics for debugging\r\n         * @returns {Object} Pool statistics\r\n         */\r\n        getPoolStats() {\r\n            return this.poolManager.getAllStats();\r\n        }\r\n        \r\n        /**\r\n         * Log pool statistics to console\r\n         */\r\n        logPoolStats() {\r\n            const stats = this.getPoolStats();\r\n            console.log('Object Pool Statistics:');\r\n            Object.entries(stats).forEach(([poolName, poolStats]) => {\r\n                console.log(`  ${poolName}:`, poolStats);\r\n            });\r\n        }\r\n        \r\n        /**\r\n         * Clean up resources\r\n         */\r\n        destroy() {\r\n            this.stop();\r\n            this.inputSystem.destroy();\r\n            this.audioSystem.destroy();\r\n            \r\n            // Remove event listeners\r\n            if (this.unregisterClick) {\r\n                this.unregisterClick();\r\n            }\r\n            \r\n            // Release all pooled objects\r\n            this.particles.forEach(particle => {\r\n                if (particle.type === 'celebration') {\r\n                    this.poolManager.release('celebrationParticle', particle);\r\n                } else {\r\n                    this.poolManager.release('particle', particle);\r\n                }\r\n            });\r\n            this.ingredients.forEach(ingredient => {\r\n                this.poolManager.release('ingredient', ingredient);\r\n            });\r\n            \r\n            // Clear references\r\n            this.ingredients = [];\r\n            this.orders = [];\r\n            this.particles = [];\r\n            this.powerUps = [];\r\n            \r\n            // Clear all pools\r\n            this.poolManager.clearAll();\r\n            \r\n            // Cleanup performance UI\r\n            this.performanceUI.destroy();\r\n        }\r\n    }\r\n\r\n    // Export for use in worker.js\r\n    if (typeof module !== 'undefined' && module.exports) {\r\n        module.exports = Game;\r\n    }\n\n    return Game;\n\n})();\n";

// Cloudflare Worker - Final bundled version

// Cloudflare Worker event listener
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
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
//# sourceMappingURL=worker.js.map
=======
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
/* BurgerDrop Game Styles */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
}

body {
    font-family: 'Nunito', 'Arial', sans-serif;
    background: 
        radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 165, 0, 0.2) 0%, transparent 50%),
        conic-gradient(from 45deg at 50% 50%, #87CEEB, #98D8C8, #87CEEB, #98D8C8);
    overflow: hidden;
    position: fixed;
    width: 100%;
    height: 100%;
    animation: subtleShift 20s ease-in-out infinite;
}

#gameCanvas {
    background: 
        radial-gradient(ellipse at top, rgba(255, 255, 255, 0.2) 0%, transparent 70%),
        linear-gradient(135deg, #FFE4B5 0%, #FFDEAD 50%, #DEB887 100%);
    display: block;
    margin: 0 auto;
    border: 3px solid #8B4513;
    box-shadow: 
        0 0 20px rgba(139, 69, 19, 0.5),
        inset 0 0 20px rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    transition: transform 0.3s ease;
}

.game-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
}

.top-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    backdrop-filter: blur(10px);
    border-bottom: 3px solid #8B4513;
}

.logo {
    font-family: 'Fredoka One', cursive;
    font-size: 28px;
    color: #D2691E;
    text-shadow: 2px 2px 4px rgba(139, 69, 19, 0.3);
    display: flex;
    align-items: center;
    gap: 10px;
}

.score-display {
    font-family: 'Fredoka One', cursive;
    font-size: 24px;
    color: #FF6347;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.lives-display {
    font-size: 24px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.audio-toggle {
    background: #FFD700;
    border: 3px solid #FFA500;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 24px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.audio-toggle:hover {
    transform: scale(1.1);
    background: #FFA500;
}

.audio-toggle:active {
    transform: scale(0.95);
}

#startScreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    backdrop-filter: blur(5px);
}

.game-over-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    backdrop-filter: blur(5px);
}

.game-over-content {
    background: linear-gradient(135deg, #FFEAA7 0%, #FEF9E7 100%);
    padding: 40px;
    border-radius: 25px;
    text-align: center;
    box-shadow: 
        0 10px 40px rgba(0, 0, 0, 0.3),
        inset 0 0 30px rgba(255, 255, 255, 0.5);
    border: 5px solid #D2691E;
    max-width: 90%;
    animation: popIn 0.5s ease-out;
}

@keyframes popIn {
    from {
        transform: scale(0.8);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}

.game-over-title {
    font-family: 'Fredoka One', cursive;
    font-size: 48px;
    color: #D2691E;
    margin-bottom: 20px;
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2);
}

.final-score {
    font-size: 36px;
    color: #FF6347;
    margin: 20px 0;
    font-weight: 800;
}

.high-score {
    font-size: 24px;
    color: #FFA500;
    margin: 10px 0;
    font-weight: 700;
}

.play-again-btn {
    background: linear-gradient(135deg, #FF6347 0%, #FF4500 100%);
    color: white;
    border: none;
    padding: 15px 40px;
    font-size: 24px;
    font-family: 'Fredoka One', cursive;
    border-radius: 50px;
    cursor: pointer;
    margin-top: 20px;
    box-shadow: 
        0 4px 15px rgba(255, 99, 71, 0.4),
        inset 0 -3px 0 rgba(139, 0, 0, 0.3);
    transition: all 0.3s ease;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.play-again-btn:hover {
    transform: translateY(-2px);
    box-shadow: 
        0 6px 20px rgba(255, 99, 71, 0.5),
        inset 0 -3px 0 rgba(139, 0, 0, 0.3);
}

.play-again-btn:active {
    transform: translateY(0);
    box-shadow: 
        0 2px 10px rgba(255, 99, 71, 0.4),
        inset 0 -1px 0 rgba(139, 0, 0, 0.3);
}

@keyframes subtleShift {
    0%, 100% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
}

@media (max-width: 768px) {
    .game-container {
        padding: 10px;
        padding-top: 80px;
    }
    
    .logo {
        font-size: 20px;
    }
    
    .score-display {
        font-size: 18px;
    }
    
    .audio-toggle {
        width: 40px;
        height: 40px;
        font-size: 20px;
    }
    
    .game-over-title {
        font-size: 36px;
    }
    
    .final-score {
        font-size: 28px;
    }
    
    .play-again-btn {
        font-size: 20px;
        padding: 12px 30px;
    }
}

/* Performance overlay styles */
.performance-overlay {
    position: fixed;
    top: 100px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: #0f0;
    font-family: monospace;
    font-size: 12px;
    padding: 10px;
    border-radius: 5px;
    display: none;
    z-index: 3000;
    min-width: 200px;
}

.performance-overlay.visible {
    display: block;
}

.performance-overlay div {
    margin: 5px 0;
}

.performance-overlay .label {
    display: inline-block;
    width: 80px;
    color: #888;
}

.performance-overlay .value {
    color: #0f0;
}

.performance-overlay .warning {
    color: #ff0;
}

.performance-overlay .critical {
    color: #f00;
}
    </style>
</head>
<body>
    <div class="top-bar">
        <div class="logo">
            <span style="font-size: 36px;">🍔</span>
            <span>Burger Drop!</span>
        </div>
        <div class="score-display" id="score">Score: 0</div>
        <div class="lives-display" id="lives">❤️❤️❤️</div>
        <button class="audio-toggle" id="audioToggle" aria-label="Toggle Audio">🔊</button>
    </div>

    <div class="performance-overlay" id="performanceOverlay"></div>

    <div class="game-container">
        <canvas id="gameCanvas"></canvas>
    </div>

    <div id="startScreen">
        <button class="play-again-btn" id="startButton">Start Game</button>
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
var Game = (function () {
    'use strict';

    /**
     * Storage utility functions
     * Provides safe access to localStorage in environments
     * where storage access may be restricted.
     */

    function isLocalStorageAvailable() {
        try {
            const key = '__storage_test__';
            window.localStorage.setItem(key, key);
            window.localStorage.removeItem(key);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Game State Management
     * 
     * Centralized state management system replacing global variables.
     * Provides event-driven architecture with validation and debugging capabilities.
    */


    class GameState {
        constructor() {
            // Core game state
            this.core = {
                running: false,
                score: 0,
                lives: 3,
                combo: 1,
                level: 1,
                frameCount: 0,
                lastTime: 0,
                highScore: this.loadHighScore()
            };

            // Entity collections
            this.entities = {
                ingredients: [],
                orders: [],
                powerUps: [],
                particles: []
            };

            // Power-up state
            this.powerUps = {
                speedBoost: { active: false, timeLeft: 0, multiplier: 0.5 },
                timeFreeze: { active: false, timeLeft: 0 },
                scoreMultiplier: { active: false, timeLeft: 0, multiplier: 2 }
            };

            // UI state
            this.ui = {
                colorTheme: { hue: 200, saturation: 50, lightness: 45 },
                screenEffects: {
                    shake: { intensity: 0, duration: 0, x: 0, y: 0 },
                    flash: { intensity: 0, color: '#ffffff' }
                }
            };

            // Audio state
            this.audio = {
                enabled: true,
                settings: { master: 0.7, effects: 0.8, music: 0.6 }
            };

            // Game timing
            this.timing = {
                ingredientSpeed: 4,
                spawnRate: 40,
                lastPowerUpSpawn: 0,
                lastOrderSpawn: 0
            };

            // Event listeners for state changes
            this.listeners = new Map();

            // Development mode features
            this.debug = {
                enabled: false,
                history: [],
                validation: true
            };
        }

        /**
         * Core game state mutations
         */
        updateScore(points) {
            const oldScore = this.core.score;
            this.core.score += Math.floor(points);
            
            // Update high score if needed
            if (this.core.score > this.core.highScore) {
                this.core.highScore = this.core.score;
                this.saveHighScore();
                this.emit('newHighScore', this.core.highScore);
            }
            
            this.emit('scoreChanged', { old: oldScore, new: this.core.score });
        }

        updateCombo(value) {
            const oldCombo = this.core.combo;
            this.core.combo = Math.max(1, Math.min(value, 10)); // Cap at 10
            this.emit('comboChanged', { old: oldCombo, new: this.core.combo });
        }

        incrementCombo() {
            this.updateCombo(this.core.combo + 1);
        }

        resetCombo() {
            this.updateCombo(1);
        }

        loseLife() {
            const oldLives = this.core.lives;
            this.core.lives = Math.max(0, this.core.lives - 1);
            this.emit('livesChanged', { old: oldLives, new: this.core.lives });
            
            if (this.core.lives === 0) {
                this.emit('gameOver');
            }
        }

        updateLevel() {
            const newLevel = Math.floor(this.core.score / 1000) + 1;
            if (newLevel !== this.core.level) {
                const oldLevel = this.core.level;
                this.core.level = newLevel;
                this.emit('levelChanged', { old: oldLevel, new: this.core.level });
            }
        }

        updateFrameCount(deltaTime) {
            this.core.frameCount++;
            this.core.lastTime = performance.now();
        }
        
        /**
         * Main update method - updates all state-related systems
         * @param {number} deltaTime - Time elapsed since last frame
         */
        update(deltaTime) {
            // Update power-ups
            this.updatePowerUps(deltaTime);
            
            // Update frame count
            this.updateFrameCount(deltaTime);
        }

        /**
         * Update overall game state each frame
         * @param {number} deltaTime - Time elapsed since last update in seconds
         */
        update(deltaTime) {
            // Advance frame counter and timestamp
            this.updateFrameCount(deltaTime);

            // Update active power-up timers
            this.updatePowerUps(deltaTime);

            // Recalculate level based on score
            this.updateLevel();
        }

        /**
         * Entity management
         */
        addEntity(type, entity) {
            if (!this.entities[type]) {
                throw new Error(\`Unknown entity type: \${type}\`);
            }
            
            this.entities[type].push(entity);
            this.emit('entityAdded', { type, entity });
            
            // Apply entity limits
            this.enforceEntityLimits(type);
        }

        removeEntity(type, predicate) {
            const initialLength = this.entities[type].length;
            this.entities[type] = this.entities[type].filter(predicate);
            const removed = initialLength - this.entities[type].length;
            
            if (removed > 0) {
                this.emit('entitiesRemoved', { type, count: removed });
            }
            
            return removed;
        }

        clearEntities(type) {
            const count = this.entities[type].length;
            this.entities[type] = [];
            
            if (count > 0) {
                this.emit('entitiesCleared', { type, count });
            }
            
            return count;
        }

        enforceEntityLimits(type) {
            const limits = {
                ingredients: 25,
                particles: 20,
                powerUps: 2,
                orders: 3
            };

            const limit = limits[type];
            if (limit && this.entities[type].length > limit) {
                const excess = this.entities[type].length - limit;
                this.entities[type].splice(0, excess); // Remove oldest
                this.emit('entityLimitEnforced', { type, removed: excess });
            }
        }

        getEntityCount(type) {
            return this.entities[type]?.length || 0;
        }

        /**
         * Power-up state management
         */
        activatePowerUp(type, duration) {
            if (!this.powerUps[type]) {
                throw new Error(\`Unknown power-up type: \${type}\`);
            }

            // Deactivate if already active (reset timer)
            if (this.powerUps[type].active) {
                this.deactivatePowerUp(type);
            }

            this.powerUps[type].active = true;
            this.powerUps[type].timeLeft = duration;
            
            this.emit('powerUpActivated', { type, duration });
        }

        updatePowerUps(deltaTime) {
            const deltaMs = deltaTime * 1000;
            
            Object.entries(this.powerUps).forEach(([type, powerUp]) => {
                if (powerUp.active) {
                    powerUp.timeLeft -= deltaMs;
                    
                    if (powerUp.timeLeft <= 0) {
                        this.deactivatePowerUp(type);
                    }
                }
            });
        }

        deactivatePowerUp(type) {
            if (this.powerUps[type].active) {
                this.powerUps[type].active = false;
                this.powerUps[type].timeLeft = 0;
                this.emit('powerUpDeactivated', { type });
            }
        }

        isPowerUpActive(type) {
            return this.powerUps[type]?.active || false;
        }

        getPowerUpTimeLeft(type) {
            return this.powerUps[type]?.timeLeft || 0;
        }

        /**
         * Game state control
         */
        startGame() {
            this.core.running = true;
            this.core.score = 0;
            this.core.lives = 3;
            this.core.combo = 1;
            this.core.level = 1;
            this.core.frameCount = 0;
            
            // Clear all entities
            Object.keys(this.entities).forEach(type => {
                this.clearEntities(type);
            });
            
            // Reset power-ups
            Object.keys(this.powerUps).forEach(type => {
                this.deactivatePowerUp(type);
            });
            
            // Reset timing
            this.timing.lastPowerUpSpawn = 0;
            this.timing.lastOrderSpawn = 0;
            this.timing.ingredientSpeed = 4;
            this.timing.spawnRate = 40;
            
            this.emit('gameStarted');
        }

        endGame() {
            this.core.running = false;
            
            // Save high score
            if (this.core.score > this.core.highScore) {
                this.core.highScore = this.core.score;
                this.saveHighScore();
            }
            
            this.emit('gameEnded', { 
                score: this.core.score, 
                highScore: this.core.highScore 
            });
        }

        pauseGame() {
            this.core.running = false;
            this.emit('gamePaused');
        }

        resumeGame() {
            this.core.running = true;
            this.emit('gameResumed');
        }

        isRunning() {
            return this.core.running;
        }

        /**
         * High score persistence
         */
        loadHighScore() {
            if (isLocalStorageAvailable()) {
                try {
                    return parseInt(localStorage.getItem('burgerDropHighScore') || '0');
                } catch (e) {
                    console.warn('Could not load high score from localStorage');
                }
            }
            return 0;
        }

        saveHighScore() {
            if (isLocalStorageAvailable()) {
                try {
                    localStorage.setItem('burgerDropHighScore', this.core.highScore.toString());
                } catch (e) {
                    console.warn('Could not save high score to localStorage');
                }
            }
        }

        /**
         * Event system
         */
        on(event, callback) {
            if (!this.listeners.has(event)) {
                this.listeners.set(event, []);
            }
            this.listeners.get(event).push(callback);
        }

        off(event, callback) {
            const callbacks = this.listeners.get(event);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }
            }
        }

        emit(event, data) {
            // Add to debug history if enabled
            if (this.debug.enabled) {
                this.debug.history.push({
                    timestamp: Date.now(),
                    event,
                    data,
                    frameCount: this.core.frameCount
                });
                
                // Keep only last 100 events
                if (this.debug.history.length > 100) {
                    this.debug.history.shift();
                }
            }

            // Emit to listeners
            const callbacks = this.listeners.get(event);
            if (callbacks) {
                callbacks.forEach(callback => {
                    try {
                        callback(data);
                    } catch (error) {
                        console.error(\`Error in event listener for \${event}:\`, error);
                    }
                });
            }
        }

        /**
         * State validation and debugging
         */
        validate() {
            if (!this.debug.validation) return [];
            
            const errors = [];
            
            // Core state validation
            if (this.core.score < 0) errors.push('Score cannot be negative');
            if (this.core.lives < 0) errors.push('Lives cannot be negative');
            if (this.core.combo < 1 || this.core.combo > 10) errors.push('Combo must be between 1-10');
            if (this.core.level < 1) errors.push('Level must be positive');
            
            // Entity validation
            Object.entries(this.entities).forEach(([type, entities]) => {
                if (!Array.isArray(entities)) {
                    errors.push(\`Entity collection \${type} must be an array\`);
                }
            });
            
            // Power-up validation
            Object.entries(this.powerUps).forEach(([type, powerUp]) => {
                if (powerUp.active && powerUp.timeLeft <= 0) {
                    errors.push(\`Active power-up \${type} has invalid timeLeft\`);
                }
            });
            
            return errors;
        }

        getDebugInfo() {
            return {
                core: { ...this.core },
                entityCounts: Object.fromEntries(
                    Object.entries(this.entities).map(([type, arr]) => [type, arr.length])
                ),
                activePowerUps: Object.fromEntries(
                    Object.entries(this.powerUps)
                        .filter(([_, powerUp]) => powerUp.active)
                        .map(([type, powerUp]) => [type, powerUp.timeLeft])
                ),
                ui: { ...this.ui },
                timing: { ...this.timing },
                listenerCounts: Object.fromEntries(
                    Array.from(this.listeners.entries())
                        .map(([event, callbacks]) => [event, callbacks.length])
                ),
                errors: this.validate()
            };
        }

        enableDebug() {
            this.debug.enabled = true;
            this.debug.validation = true;
            console.log('GameState debugging enabled');
        }

        disableDebug() {
            this.debug.enabled = false;
            this.debug.validation = false;
            this.debug.history = [];
            console.log('GameState debugging disabled');
        }

        getDebugHistory() {
            return [...this.debug.history];
        }
    }

    /**
     * Easing Functions Collection
     * 
     * Mathematical easing functions for smooth animations and transitions.
     * All functions take a parameter t (0 to 1) and return the eased value.
     */

    const easing = {
        /**
         * Linear interpolation - no easing
         * @param {number} t - Progress value (0 to 1)
         * @returns {number} Eased value
         */
        linear: t => t,

        /**
         * Quadratic ease-in - starts slow, accelerates
         * @param {number} t - Progress value (0 to 1)
         * @returns {number} Eased value
         */
        easeInQuad: t => t * t,

        /**
         * Quadratic ease-out - starts fast, decelerates
         * @param {number} t - Progress value (0 to 1)
         * @returns {number} Eased value
         */
        easeOutQuad: t => t * (2 - t),

        /**
         * Quadratic ease-in-out - slow start and end, fast middle
         * @param {number} t - Progress value (0 to 1)
         * @returns {number} Eased value
         */
        easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

        /**
         * Cubic ease-in - starts very slow, accelerates strongly
         * @param {number} t - Progress value (0 to 1)
         * @returns {number} Eased value
         */
        easeInCubic: t => t * t * t,

        /**
         * Cubic ease-out - starts fast, decelerates strongly
         * @param {number} t - Progress value (0 to 1)
         * @returns {number} Eased value
         */
        easeOutCubic: t => (--t) * t * t + 1,

        /**
         * Cubic ease-in-out - very slow start and end, very fast middle
         * @param {number} t - Progress value (0 to 1)
         * @returns {number} Eased value
         */
        easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

        /**
         * Elastic ease-in - spring-like effect at the beginning
         * @param {number} t - Progress value (0 to 1)
         * @returns {number} Eased value
         */
        easeInElastic: t => {
            if (t === 0 || t === 1) return t;
            const p = 0.3;
            const s = p / 4;
            return -(Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
        },

        /**
         * Elastic ease-out - spring-like effect at the end
         * @param {number} t - Progress value (0 to 1)
         * @returns {number} Eased value
         */
        easeOutElastic: t => {
            if (t === 0 || t === 1) return t;
            const p = 0.3;
            const s = p / 4;
            return Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1;
        },

        /**
         * Bounce ease-out - bouncing ball effect at the end
         * @param {number} t - Progress value (0 to 1)
         * @returns {number} Eased value
         */
        easeOutBounce: t => {
            if (t < 1 / 2.75) {
                return 7.5625 * t * t;
            } else if (t < 2 / 2.75) {
                return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
            } else if (t < 2.5 / 2.75) {
                return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
            } else {
                return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
            }
        }
    };

    // Define easeInBounce after easeOutBounce is defined
    easing.easeInBounce = t => 1 - easing.easeOutBounce(1 - t);

    /**
     * Particle Entity
     * 
     * Represents visual effect particles with physics simulation.
     * Supports multiple types: default, celebration, star, circle, triangle.
     * Includes gravity, bouncing, rotation, and easing animations.
     */


    class Particle {
        /**
         * Create a new particle
         * @param {number} x - Initial x position
         * @param {number} y - Initial y position
         * @param {string} color - Particle color
         * @param {string} text - Optional text/emoji to display
         * @param {string} type - Particle type ('default', 'celebration', 'star', 'circle', 'triangle')
         * @param {object} options - Additional options
         */
        constructor(x = 0, y = 0, color = '#FFFFFF', text = '', type = 'default', options = {}) {
            this.init(x, y, color, text, type, options);
        }
        
        /**
         * Initialize/reset particle properties (used for object pooling)
         * @param {number} x - Initial x position
         * @param {number} y - Initial y position
         * @param {string} color - Particle color
         * @param {string} text - Optional text/emoji to display
         * @param {string} type - Particle type
         * @param {object} options - Additional options
         */
        init(x = 0, y = 0, color = '#FFFFFF', text = '', type = 'default', options = {}) {
            this.x = x;
            this.y = y;
            this.vx = options.vx || (Math.random() - 0.5) * 6;
            this.vy = options.vy || (-Math.random() * 6 - 3);
            this.color = color;
            this.text = text;
            this.life = 1;
            this.decay = options.decay || 0.015;
            this.type = type;
            this.size = options.size || (Math.random() * 3 + 2);
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.2;
            this.gravity = options.gravity || 0.15;
            this.bounce = options.bounce || 0.7;
            this.scale = 1;
            this.startTime = 0; // Will be set when added to game
            this.duration = options.duration || (60 + Math.random() * 60); // 1-2 seconds at 60fps
            
            // Store canvas dimensions for boundary checks
            this.canvasWidth = options.canvasWidth || 800;
            this.canvasHeight = options.canvasHeight || 600;
            
            // Pool-friendly properties
            this.pooled = false;
            
            return this;
        }

        /**
         * Update particle state
         * @param {number} frameCount - Current frame count for timing
         * @param {number} deltaTime - Time elapsed since last frame (optional)
         */
        update(frameCount, deltaTime = 1/60) {
            // Set start time on first update
            if (this.startTime === 0) {
                this.startTime = frameCount;
            }
            
            const elapsed = frameCount - this.startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            
            // Physics update
            this.x += this.vx * deltaTime * 60; // Scale by target framerate
            this.y += this.vy * deltaTime * 60;
            this.vy += this.gravity;
            this.rotation += this.rotationSpeed;
            
            // Use custom easing for life decay
            this.life = 1 - easing.easeOutQuad(progress);
            
            // Bounce off ground with easing
            if (this.y > this.canvasHeight - 10 && this.vy > 0) {
                this.vy *= -this.bounce;
                this.vx *= 0.8;
            }
            
            // Enhanced scale animation for celebration particles
            if (this.type === 'celebration') {
                const pulseProgress = (frameCount * 0.1 + this.x) % (Math.PI * 2);
                this.scale = 0.7 + easing.easeInOutCubic(Math.sin(pulseProgress) * 0.5 + 0.5) * 0.6;
            }
        }

        /**
         * Render the particle
         * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
         */
        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.scale(this.scale, this.scale);
            
            if (this.text) {
                ctx.font = \`bold \${20 + this.size * 2}px Arial\`; // Keep Arial for emoji compatibility
                ctx.fillStyle = this.color;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Add glow effect for special particles
                if (this.type === 'celebration') {
                    ctx.shadowColor = this.color;
                    ctx.shadowBlur = 10;
                }
                
                ctx.fillText(this.text, 0, 0);
            } else {
                // Different shapes based on type
                ctx.fillStyle = this.color;
                
                switch(this.type) {
                    case 'star':
                        this.drawStar(ctx);
                        break;
                    case 'circle':
                        ctx.beginPath();
                        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                    case 'triangle':
                        ctx.beginPath();
                        ctx.moveTo(0, -this.size);
                        ctx.lineTo(-this.size, this.size);
                        ctx.lineTo(this.size, this.size);
                        ctx.closePath();
                        ctx.fill();
                        break;
                    default:
                        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
                }
            }
            ctx.restore();
        }
        
        /**
         * Draw a star shape
         * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
         */
        drawStar(ctx) {
            const spikes = 5;
            const outerRadius = this.size;
            const innerRadius = this.size * 0.4;
            
            ctx.beginPath();
            for (let i = 0; i < spikes; i++) {
                const angle = (i * Math.PI * 2) / spikes;
                const x = Math.cos(angle) * outerRadius;
                const y = Math.sin(angle) * outerRadius;
                
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
                
                const innerAngle = angle + Math.PI / spikes;
                const innerX = Math.cos(innerAngle) * innerRadius;
                const innerY = Math.sin(innerAngle) * innerRadius;
                ctx.lineTo(innerX, innerY);
            }
            ctx.closePath();
            ctx.fill();
        }

        /**
         * Check if particle is still alive
         * @returns {boolean} True if particle should continue existing
         */
        isAlive() {
            return this.life > 0.01;
        }
        
        /**
         * Reset particle for object pooling
         * @param {number} x - Initial x position
         * @param {number} y - Initial y position
         * @param {string} color - Particle color
         * @param {string} text - Optional text/emoji to display
         * @param {string} type - Particle type
         * @param {object} options - Additional options
         */
        reset(x, y, color, text = '', type = 'default', options = {}) {
            this.x = x;
            this.y = y;
            this.vx = options.vx || (Math.random() - 0.5) * 6;
            this.vy = options.vy || (-Math.random() * 6 - 3);
            this.color = color;
            this.text = text;
            this.life = 1;
            this.decay = options.decay || 0.015;
            this.type = type;
            this.size = options.size || (Math.random() * 3 + 2);
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.2;
            this.gravity = options.gravity || 0.15;
            this.bounce = options.bounce || 0.7;
            this.scale = 1;
            this.startTime = 0;
            this.duration = options.duration || (60 + Math.random() * 60);
            
            // Update canvas dimensions if provided
            if (options.canvasWidth) this.canvasWidth = options.canvasWidth;
            if (options.canvasHeight) this.canvasHeight = options.canvasHeight;
        }

        /**
         * Get particle bounds for collision detection
         * @returns {object} Bounds object {x, y, width, height}
         */
        getBounds() {
            const radius = this.size * this.scale;
            return {
                x: this.x - radius,
                y: this.y - radius,
                width: radius * 2,
                height: radius * 2
            };
        }

        /**
         * Update canvas dimensions for boundary calculations
         * @param {number} width - Canvas width
         * @param {number} height - Canvas height
         */
        updateCanvasDimensions(width, height) {
            this.canvasWidth = width;
            this.canvasHeight = height;
        }

        /**
         * Create a celebration particle with predefined settings
         * @param {number} x - X position
         * @param {number} y - Y position
         * @param {string} color - Particle color
         * @param {string} emoji - Emoji to display
         * @returns {Particle} New celebration particle
         */
        static createCelebration(x, y, color, emoji = '✨') {
            return new Particle(x, y, color, emoji, 'celebration', {
                vx: (Math.random() - 0.5) * 8,
                vy: -Math.random() * 8 - 5,
                size: Math.random() * 4 + 3,
                duration: 90 + Math.random() * 60, // Longer duration for celebration
                gravity: 0.1, // Lighter gravity for floating effect
                bounce: 0.9
            });
        }

        /**
         * Create an explosion of particles
         * @param {number} x - Explosion center X
         * @param {number} y - Explosion center Y
         * @param {string} color - Particle color
         * @param {number} count - Number of particles to create
         * @param {string} type - Particle type
         * @returns {Array<Particle>} Array of explosion particles
         */
        static createExplosion(x, y, color, count = 10, type = 'star') {
            const particles = [];
            
            for (let i = 0; i < count; i++) {
                const angle = (i / count) * Math.PI * 2;
                const speed = Math.random() * 6 + 3;
                const vx = Math.cos(angle) * speed;
                const vy = Math.sin(angle) * speed - 2; // Slight upward bias
                
                particles.push(new Particle(x, y, color, '', type, {
                    vx,
                    vy,
                    size: Math.random() * 3 + 1,
                    duration: 45 + Math.random() * 30,
                    gravity: 0.2
                }));
            }
            
            return particles;
        }

        /**
         * Reset function for object pooling
         * @param {Particle} particle - Particle to reset
         * @param {number} x - Initial x position
         * @param {number} y - Initial y position
         * @param {string} color - Particle color
         * @param {string} text - Optional text/emoji to display
         * @param {string} type - Particle type
         * @param {object} options - Additional options
         */
        static resetParticle(particle, x, y, color, text = '', type = 'default', options = {}) {
            particle.init(x, y, color, text, type, options);
        }
        
        /**
         * Create particle factory function for object pooling
         * @returns {Function} Factory function that creates new particles
         */
        static createFactory() {
            return () => new Particle();
        }
        
        /**
         * Create floating text particle
         * @param {number} x - X position
         * @param {number} y - Y position
         * @param {string} text - Text to display
         * @param {string} color - Text color
         * @returns {Particle} New text particle
         */
        static createFloatingText(x, y, text, color = '#FFD700') {
            return new Particle(x, y, color, text, 'text', {
                vx: (Math.random() - 0.5) * 2,
                vy: -2 - Math.random() * 2,
                size: 0, // Size is handled by font size
                duration: 120, // 2 seconds
                gravity: 0, // Text floats up
                bounce: 0
            });
        }
    }

    /**
     * PowerUp Entity
     * 
     * Represents collectible power-ups that provide temporary game advantages.
     * Supports multiple types: speedBoost (slow motion), timeFreeze, and scoreMultiplier.
     */

    /**
     * Power-up type configurations
     */
    const powerUpTypes = {
        speedBoost: {
            emoji: '🐌',
            name: 'Slow Motion',
            color: '#FFD700',
            duration: 8000, // 8 seconds
            description: 'Slows ingredient fall speed'
        },
        timeFreeze: {
            emoji: '❄️',
            name: 'Time Freeze',
            color: '#87CEEB',
            duration: 5000, // 5 seconds
            description: 'Freezes order timers'
        },
        scoreMultiplier: {
            emoji: '💎',
            name: 'Score Boost',
            color: '#FF69B4',
            duration: 10000, // 10 seconds
            description: 'Double score points'
        }
    };

    class PowerUp {
        /**
         * Get all available power-up types
         * @returns {object} Power-up type configurations
         */
        static getPowerUpTypes() {
            return powerUpTypes;
        }
        
        /**
         * Create a new power-up
         * @param {string} type - Power-up type ('speedBoost', 'timeFreeze', 'scoreMultiplier')
         * @param {object} options - Additional options
         */
        constructor(type, options = {}) {
            this.type = type;
            this.data = powerUpTypes[type];
            
            if (!this.data) {
                throw new Error(\`Unknown power-up type: \${type}\`);
            }
            
            this.x = options.x !== undefined ? options.x : Math.random() * (options.canvasWidth || 800 - 50);
            this.y = options.y !== undefined ? options.y : -50;
            this.speed = options.speed || 1.5; // Fixed speed for consistency
            this.collected = false;
            this.size = options.size || 40;
            this.cachedFont = null; // Cache font for performance
            
            // Store canvas dimensions for boundary calculations
            this.canvasWidth = options.canvasWidth || 800;
            this.canvasHeight = options.canvasHeight || 600;
            
            // Animation properties
            this.animationTime = 0;
            this.pulseIntensity = options.pulseIntensity || 0.1;
        }
        
        /**
         * Update power-up state
         * @param {number} deltaTime - Time elapsed since last frame
         */
        update(deltaTime = 1/60) {
            this.y += this.speed * deltaTime * 60; // Scale by target framerate
            this.animationTime += deltaTime;
        }
        
        /**
         * Render the power-up
         * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
         */
        draw(ctx) {
            // Pre-calculate position
            const centerX = this.x + this.size/2;
            const centerY = this.y + this.size/2;
            
            // Add subtle pulsing animation
            const pulse = 1 + Math.sin(this.animationTime * 4) * this.pulseIntensity;
            const currentSize = this.size * pulse;
            
            ctx.save();
            
            // Draw glow effect
            ctx.shadowColor = this.data.color;
            ctx.shadowBlur = 10;
            
            // Main circle
            ctx.fillStyle = this.data.color;
            ctx.beginPath();
            ctx.arc(centerX, centerY, currentSize/2, 0, Math.PI * 2);
            ctx.fill();
            
            // Border
            ctx.shadowBlur = 0;
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Emoji (cached font for performance)
            if (!this.cachedFont) {
                this.cachedFont = \`\${this.size * 0.6}px Arial\`;
            }
            ctx.font = this.cachedFont;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 2;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.fillText(this.data.emoji, centerX, centerY);
            
            ctx.restore();
        }
        
        /**
         * Check if coordinates are within the power-up's clickable area
         * @param {number} x - X coordinate
         * @param {number} y - Y coordinate
         * @returns {boolean} True if clicked
         */
        isClicked(x, y) {
            const centerX = this.x + this.size/2;
            const centerY = this.y + this.size/2;
            const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
            return distance <= this.size/2;
        }
        
        /**
         * Check if power-up is off screen (should be removed)
         * @returns {boolean} True if off screen
         */
        isOffScreen() {
            return this.y > this.canvasHeight + this.size;
        }
        
        /**
         * Get power-up bounds for collision detection
         * @returns {object} Bounds object {x, y, width, height}
         */
        getBounds() {
            return {
                x: this.x,
                y: this.y,
                width: this.size,
                height: this.size
            };
        }
        
        /**
         * Get the center point of the power-up
         * @returns {object} Center coordinates {x, y}
         */
        getCenter() {
            return {
                x: this.x + this.size/2,
                y: this.y + this.size/2
            };
        }
        
        /**
         * Mark power-up as collected
         */
        collect() {
            this.collected = true;
        }
        
        /**
         * Check if power-up has been collected
         * @returns {boolean} True if collected
         */
        isCollected() {
            return this.collected;
        }
        
        /**
         * Get power-up duration in milliseconds
         * @returns {number} Duration in milliseconds
         */
        getDuration() {
            return this.data.duration;
        }
        
        /**
         * Get power-up description
         * @returns {string} Human-readable description
         */
        getDescription() {
            return this.data.description;
        }
        
        /**
         * Update canvas dimensions for boundary calculations
         * @param {number} width - Canvas width
         * @param {number} height - Canvas height
         */
        updateCanvasDimensions(width, height) {
            this.canvasWidth = width;
            this.canvasHeight = height;
        }
        
        /**
         * Create a random power-up
         * @param {object} options - Options for power-up creation
         * @returns {PowerUp} New random power-up
         */
        static createRandom(options = {}) {
            const types = Object.keys(powerUpTypes);
            const randomType = types[Math.floor(Math.random() * types.length)];
            return new PowerUp(randomType, options);
        }

        /**
         * Get the raw power-up type configuration map
         * @returns {Object} mapping of power-up types to their config
         */
        static getPowerUpTypes() {
            return powerUpTypes;
        }
        
        /**
         * Get all available power-up types
         * @returns {Array<string>} Array of power-up type names
         */
        static getAvailableTypes() {
            return Object.keys(powerUpTypes);
        }
        
        /**
         * Get power-up type configuration
         * @param {string} type - Power-up type
         * @returns {object} Type configuration or null if not found
         */
        static getTypeConfig(type) {
            return powerUpTypes[type] || null;
        }
        
        /**
         * Validate if a type is valid
         * @param {string} type - Power-up type to validate
         * @returns {boolean} True if valid type
         */
        static isValidType(type) {
            return type in powerUpTypes;
        }
    }

    /**
     * Ingredient Entity
     * 
     * Represents falling burger ingredients with physics simulation, trail effects,
     * and visual variants. Includes integration with power-up system.
     */


    /**
     * Ingredient type configurations
     */
    const ingredientTypes = {
        bun_top: { 
            emoji: '🍞', 
            variants: ['🍞', '🥖'], 
            name: 'Top Bun', 
            size: 40,
            color: '#D2B48C'
        },
        bun_bottom: { 
            emoji: '🥖', 
            variants: ['🥖', '🍞'], 
            name: 'Bottom Bun', 
            size: 40,
            color: '#DEB887'
        },
        patty: { 
            emoji: '🥩', 
            variants: ['🥩', '🍖'], 
            name: 'Patty', 
            size: 45,
            color: '#8B4513'
        },
        cheese: { 
            emoji: '🧀', 
            variants: ['🧀', '🟨'], 
            name: 'Cheese', 
            size: 35,
            color: '#FFD700'
        },
        lettuce: { 
            emoji: '🥬', 
            variants: ['🥬', '🍃'], 
            name: 'Lettuce', 
            size: 35,
            color: '#90EE90'
        },
        tomato: { 
            emoji: '🍅', 
            variants: ['🍅', '🔴'], 
            name: 'Tomato', 
            size: 35,
            color: '#FF6347'
        },
        pickle: { 
            emoji: '🥒', 
            variants: ['🥒', '🟢'], 
            name: 'Pickle', 
            size: 30,
            color: '#9ACD32'
        },
        bacon: { 
            emoji: '🥓', 
            variants: ['🥓', '🔥'], 
            name: 'Bacon', 
            size: 35,
            color: '#DC143C'
        },
        onion: { 
            emoji: '🧅', 
            variants: ['🧅', '⚪'], 
            name: 'Onion', 
            size: 30,
            color: '#F5F5DC'
        },
        egg: { 
            emoji: '🍳', 
            variants: ['🍳', '🟡'], 
            name: 'Egg', 
            size: 40,
            color: '#FFFFE0'
        }
    };

    class Ingredient {
        /**
         * Create a new ingredient
         * @param {string} type - Ingredient type key from ingredientTypes
         * @param {object} options - Additional options
         */
        constructor(type = 'bun_top', options = {}) {
            this.init(type, options);
        }
        
        /**
         * Initialize/reset ingredient properties (used for object pooling)
         * @param {string} type - Ingredient type key from ingredientTypes
         * @param {object} options - Additional options
         */
        init(type, options = {}) {
            this.type = type;
            this.data = ingredientTypes[type];
            
            if (!this.data) {
                throw new Error(\`Unknown ingredient type: \${type}\`);
            }
            
            // Position and movement
            this.x = options.x !== undefined ? options.x : Math.random() * (options.canvasWidth || 800 - this.data.size);
            this.y = options.y !== undefined ? options.y : -this.data.size;
            
            // Speed calculation with variation
            const baseSpeed = options.baseSpeed || 4;
            const speedVariation = Math.random() * 4 - 2; // ±2 variation
            const speedMultiplier = Math.random() < 0.1 ? (Math.random() < 0.5 ? 0.4 : 2.2) : 1; // 10% chance of very slow/fast
            this.speed = (baseSpeed + speedVariation) * speedMultiplier;
            this.baseSpeed = this.speed;
            
            // Rotation
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.1;
            
            // State
            this.collected = false;
            this.startY = this.y;
            this.fallProgress = 0;
            this.sway = Math.random() * 2 - 1; // -1 to 1 for horizontal sway
            
            // Trail system
            this.trail = [];
            this.maxTrailLength = options.maxTrailLength || 8;
            this.trailUpdateInterval = options.trailUpdateInterval || 3;
            this.trailCounter = 0;
            
            // Animation timing
            this.animationTime = 0;
            
            // Canvas dimensions for boundary checks
            this.canvasWidth = options.canvasWidth || 800;
            this.canvasHeight = options.canvasHeight || 600;
        }

        /**
         * Update ingredient state
         * @param {number} frameCount - Current frame count for timing
         * @param {object} gameState - Game state for power-up checks
         * @param {number} deltaTime - Time elapsed since last frame
         */
        // deltaTime is expected in milliseconds; default assumes ~60fps
        update(frameCount, gameState, deltaTime = 16.67) {
            this.animationTime += deltaTime;
            
            // Apply speed boost power-up if available
            let speedMultiplier = 1;
            if (gameState && gameState.powerUps && gameState.powerUps.speedBoost && gameState.powerUps.speedBoost.active) {
                speedMultiplier = gameState.powerUps.speedBoost.multiplier;
            }
            this.speed = this.baseSpeed * speedMultiplier;
            
            // Smooth falling motion with easing
            this.fallProgress += 0.02;
            const fallEase = easing.easeInQuad(Math.min(this.fallProgress, 1));
            this.y += this.speed * (0.5 + fallEase * 0.5) * (deltaTime / 16.67); // Normalize to 60fps
            
            // Add subtle horizontal sway
            const swayAmount = Math.sin(frameCount * 0.05 + this.sway * Math.PI) * 0.5;
            this.x += swayAmount * (deltaTime / 16.67); // Normalize to 60fps
            
            // Smooth rotation with easing
            this.rotation += this.rotationSpeed * (1 + fallEase * 0.5);
            
            // Update trail
            this.trailCounter++;
            if (this.trailCounter >= this.trailUpdateInterval) {
                this.trail.push({
                    x: this.x + this.data.size / 2,
                    y: this.y + this.data.size / 2,
                    alpha: 1,
                    size: this.data.size * 0.8
                });
                
                if (this.trail.length > this.maxTrailLength) {
                    this.trail.shift();
                }
                
                this.trailCounter = 0;
            }
            
            // Update trail alpha with easing
            this.trail.forEach((point, index) => {
                const trailProgress = (index + 1) / this.trail.length;
                point.alpha = easing.easeOutCubic(trailProgress) * 0.6;
                point.size *= 0.98;
            });
        }

        /**
         * Render the ingredient
         * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
         * @param {number} frameCount - Current frame count for animations
         * @param {object} colorTheme - Color theme for effects
         */
        draw(ctx, frameCount, colorTheme) {
            // Draw trail first (behind ingredient)
            this.drawTrail(ctx, colorTheme);
            
            ctx.save();
            ctx.translate(this.x + this.data.size / 2, this.y + this.data.size / 2);
            ctx.rotate(this.rotation);
            
            // Add enhanced shadow to ingredients
            ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
            ctx.shadowBlur = 6;
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
            
            // Use enhanced emoji with occasional variants
            const useVariant = frameCount % 120 < 10; // Show variant for 10 frames every 2 seconds
            const emojiToUse = useVariant && this.data.variants ? 
                this.data.variants[Math.floor(frameCount / 30) % this.data.variants.length] : 
                this.data.emoji;
            
            ctx.font = \`\${this.data.size}px Arial\`; // Keep Arial for emoji compatibility
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(emojiToUse, 0, 0);
            ctx.restore();
        }
        
        /**
         * Draw the trail effect behind the ingredient
         * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
         * @param {object} colorTheme - Color theme for trail colors
         */
        drawTrail(ctx, colorTheme) {
            if (this.trail.length < 2) return;
            
            ctx.save();
            
            // Create gradient trail effect
            for (let i = 0; i < this.trail.length - 1; i++) {
                const point = this.trail[i];
                const nextPoint = this.trail[i + 1];

                // Skip if coordinates are not finite to avoid rendering errors
                if (!Number.isFinite(point.x) || !Number.isFinite(point.y) ||
                    !Number.isFinite(nextPoint.x) || !Number.isFinite(nextPoint.y)) {
                    continue;
                }

                // Draw line segment with gradient
                const gradient = ctx.createLinearGradient(
                    point.x, point.y, nextPoint.x, nextPoint.y
                );
                gradient.addColorStop(0, \`rgba(255, 255, 255, \${point.alpha * 0.3})\`);
                gradient.addColorStop(1, \`rgba(255, 255, 255, \${nextPoint.alpha * 0.3})\`);
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = Math.max(point.size * 0.15, 1);
                ctx.lineCap = 'round';
                
                ctx.beginPath();
                ctx.moveTo(point.x, point.y);
                ctx.lineTo(nextPoint.x, nextPoint.y);
                ctx.stroke();
            }
            
            // Draw trail points
            this.trail.forEach(point => {
                ctx.globalAlpha = point.alpha * 0.4;
                
                // Use accent color from theme or fallback
                const accentColor = colorTheme?.accent || '#00FF88';
                ctx.fillStyle = accentColor + '80'; // Add transparency
                
                ctx.beginPath();
                ctx.arc(point.x, point.y, Math.max(point.size * 0.1, 2), 0, Math.PI * 2);
                ctx.fill();
            });
            
            ctx.restore();
        }

        /**
         * Check if coordinates are within the ingredient's clickable area
         * @param {number} x - X coordinate
         * @param {number} y - Y coordinate
         * @returns {boolean} True if clicked
         */
        isClicked(x, y) {
            return x >= this.x && x <= this.x + this.data.size &&
                   y >= this.y && y <= this.y + this.data.size;
        }
        
        /**
         * Check if ingredient is off screen (should be removed)
         * @returns {boolean} True if off screen
         */
        isOffScreen() {
            return this.y > this.canvasHeight + this.data.size;
        }
        
        /**
         * Get ingredient bounds for collision detection
         * @returns {object} Bounds object {x, y, width, height}
         */
        getBounds() {
            return {
                x: this.x,
                y: this.y,
                width: this.data.size,
                height: this.data.size
            };
        }
        
        /**
         * Get the center point of the ingredient
         * @returns {object} Center coordinates {x, y}
         */
        getCenter() {
            return {
                x: this.x + this.data.size / 2,
                y: this.y + this.data.size / 2
            };
        }
        
        /**
         * Mark ingredient as collected
         */
        collect() {
            this.collected = true;
        }
        
        /**
         * Check if ingredient has been collected
         * @returns {boolean} True if collected
         */
        isCollected() {
            return this.collected;
        }
        
        /**
         * Get ingredient name
         * @returns {string} Human-readable ingredient name
         */
        getName() {
            return this.data.name;
        }
        
        /**
         * Get ingredient color
         * @returns {string} Ingredient color
         */
        getColor() {
            return this.data.color;
        }
        
        /**
         * Update canvas dimensions for boundary calculations
         * @param {number} width - Canvas width
         * @param {number} height - Canvas height
         */
        updateCanvasDimensions(width, height) {
            this.canvasWidth = width;
            this.canvasHeight = height;
        }
        
        /**
         * Reset ingredient for object pooling
         * @param {string} type - Ingredient type key from ingredientTypes
         * @param {object} options - Additional options
         */
        reset(type, options = {}) {
            this.type = type;
            this.data = ingredientTypes[type];
            
            if (!this.data) {
                throw new Error(\`Unknown ingredient type: \${type}\`);
            }
            
            // Position and movement
            this.x = options.x !== undefined ? options.x : Math.random() * ((options.canvasWidth || this.canvasWidth || 800) - this.data.size);
            this.y = options.y !== undefined ? options.y : -this.data.size;
            
            // Speed calculation with variation
            const baseSpeed = options.baseSpeed || 4;
            const speedVariation = Math.random() * 4 - 2;
            const speedMultiplier = Math.random() < 0.1 ? (Math.random() < 0.5 ? 0.4 : 2.2) : 1;
            this.speed = (baseSpeed + speedVariation) * speedMultiplier;
            this.baseSpeed = this.speed;
            
            // Rotation
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.1;
            
            // State
            this.collected = false;
            this.startY = this.y;
            this.fallProgress = 0;
            this.sway = Math.random() * 2 - 1;
            
            // Trail system
            this.trail = [];
            this.maxTrailLength = options.maxTrailLength || 8;
            this.trailUpdateInterval = options.trailUpdateInterval || 3;
            this.trailCounter = 0;
            
            // Animation timing
            this.animationTime = 0;
            
            // Update canvas dimensions if provided
            if (options.canvasWidth) this.canvasWidth = options.canvasWidth;
            if (options.canvasHeight) this.canvasHeight = options.canvasHeight;
        }
        
        /**
         * Create a random ingredient
         * @param {object} options - Options for ingredient creation
         * @returns {Ingredient} New random ingredient
         */
        static createRandom(options = {}) {
            const types = Object.keys(ingredientTypes);
            const randomType = types[Math.floor(Math.random() * types.length)];
            return new Ingredient(randomType, options);
        }
        
        /**
         * Get all available ingredient types
         * @returns {Array<string>} Array of ingredient type names
         */
        static getAvailableTypes() {
            return Object.keys(ingredientTypes);
        }
        
        /**
         * Get ingredient type configuration
         * @param {string} type - Ingredient type
         * @returns {object} Type configuration or null if not found
         */
        static getTypeConfig(type) {
            return ingredientTypes[type] || null;
        }
        
        /**
         * Validate if a type is valid
         * @param {string} type - Ingredient type to validate
         * @returns {boolean} True if valid type
         */
        static isValidType(type) {
            return type in ingredientTypes;
        }
    }

    /**
     * Order Entity
     * 
     * Represents customer orders with time limits and ingredient tracking.
     * Includes visual rendering with progress indication and timer management.
     */


    /**
     * Order template configurations
     */
    const orderTemplates = [
        { name: 'Classic Burger', ingredients: ['bun_bottom', 'patty', 'cheese', 'lettuce', 'tomato', 'bun_top'], time: 30 },
        { name: 'Simple Burger', ingredients: ['bun_bottom', 'patty', 'bun_top'], time: 20 },
        { name: 'Cheese Burger', ingredients: ['bun_bottom', 'patty', 'cheese', 'bun_top'], time: 25 },
        { name: 'Veggie Burger', ingredients: ['bun_bottom', 'lettuce', 'tomato', 'onion', 'pickle', 'bun_top'], time: 30 },
        { name: 'Bacon Burger', ingredients: ['bun_bottom', 'patty', 'bacon', 'cheese', 'bun_top'], time: 35 },
        { name: 'Breakfast Burger', ingredients: ['bun_bottom', 'patty', 'egg', 'bacon', 'cheese', 'bun_top'], time: 40 }
    ];

    class Order {
        /**
         * Create a new order
         * @param {object} template - Order template with name, ingredients, and time
         * @param {object} options - Additional options
         */
        constructor(template, options = {}) {
            if (!template) {
                throw new Error('Order template is required');
            }
            
            this.template = template;
            this.ingredients = [...template.ingredients];
            this.currentIndex = 0;
            this.timeLeft = template.time * 1000; // Convert to milliseconds
            this.x = 0;
            this.y = 0;
            this.width = options.width || 120;
            this.height = options.height || 180;
            this.completed = false;
            this.expired = false;
            
            // Animation properties
            this.animationTime = 0;
            this.pulsePhase = Math.random() * Math.PI * 2; // Random phase for pulsing
            
            // Rendering options
            this.enableTextures = options.enableTextures !== false;
            this.enableShadows = options.enableShadows !== false;
            this.enablePulse = options.enablePulse !== false;
        }

        /**
         * Update order state
         * @param {number} deltaTime - Time elapsed since last frame in milliseconds
         * @param {object} gameState - Game state for power-up checks
         * @returns {boolean} True if order is still valid, false if expired
         */
        update(deltaTime, gameState) {
            this.animationTime += deltaTime;
            
            // Apply time freeze power-up if available
            let shouldDecrementTime = true;
            if (gameState && gameState.isPowerUpActive && gameState.isPowerUpActive('timeFreeze')) {
                shouldDecrementTime = false;
            }
            
            if (shouldDecrementTime && !this.completed) {
                this.timeLeft -= deltaTime; // deltaTime is already in milliseconds
            }
            
            if (this.timeLeft <= 0 && !this.completed) {
                this.expired = true;
                return false; // Order expired
            }
            
            return true;
        }

        /**
         * Render the order
         * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
         * @param {number} index - Order position index for layout
         * @param {number} frameCount - Current frame count for animations
         * @param {object} options - Additional rendering options
         */
        draw(ctx, index, frameCount, options = {}) {
            const margin = options.margin || 10;
            this.x = margin + index * (this.width + margin);
            this.y = options.startY || 80;

            const isExpiring = this.timeLeft < 10000; // Less than 10 seconds
            
            ctx.save();
            
            // Background with texture if available
            if (this.enableTextures && options.textures?.paper) {
                ctx.fillStyle = options.textures.paper;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
            
            // Add gradient overlay
            const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
            
            if (isExpiring) {
                gradient.addColorStop(0, 'rgba(255, 120, 120, 0.85)');
                gradient.addColorStop(1, 'rgba(255, 80, 80, 0.8)');
            } else {
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
                gradient.addColorStop(1, 'rgba(245, 245, 245, 0.8)');
            }
            
            // Add shadow if enabled
            if (this.enableShadows) {
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 3;
                ctx.shadowOffsetY = 4;
            }
            
            ctx.fillStyle = gradient;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Reset shadow for border
            if (this.enableShadows) {
                ctx.shadowColor = 'transparent';
            }
            
            // Border
            ctx.strokeStyle = isExpiring ? '#CC3333' : '#333';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            
            ctx.restore();

            // Order name with better typography
            ctx.fillStyle = '#333';
            ctx.font = '600 12px Nunito, Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.template.name, this.x + this.width / 2, this.y + 15);

            // Timer with enhanced typography
            const timeSeconds = Math.ceil(this.timeLeft / 1000);
            ctx.fillStyle = this.timeLeft < 10000 ? '#FF0000' : '#333';
            ctx.font = '700 14px Nunito, Arial';
            ctx.fillText(\`\${timeSeconds}s\`, this.x + this.width / 2, this.y + 30);

            // Ingredients (from bottom to top)
            this.drawIngredients(ctx, frameCount);
        }
        
        /**
         * Draw the ingredient list for the order
         * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
         * @param {number} frameCount - Current frame count for animations
         */
        drawIngredients(ctx, frameCount) {
            const startY = this.y + this.height - 25;
            const spacing = 20;
            
            for (let i = 0; i < this.ingredients.length; i++) {
                const ingredient = ingredientTypes[this.ingredients[i]];
                if (!ingredient) continue;
                
                const yPos = startY - (i * spacing);
                
                ctx.save();
                
                if (i < this.currentIndex) {
                    ctx.globalAlpha = 0.3; // Completed ingredients
                } else if (i === this.currentIndex) {
                    // Enhanced highlight for current ingredient
                    this.drawCurrentIngredientHighlight(ctx, yPos, frameCount);
                }
                
                // Draw ingredient emoji
                if (i === this.currentIndex) {
                    this.drawCurrentIngredient(ctx, ingredient, yPos);
                } else {
                    this.drawIngredient(ctx, ingredient, yPos);
                }
                
                ctx.restore();
            }
        }
        
        /**
         * Draw highlight for the current ingredient
         * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
         * @param {number} yPos - Y position for the ingredient
         * @param {number} frameCount - Current frame count for animations
         */
        drawCurrentIngredientHighlight(ctx, yPos, frameCount) {
            const highlightGradient = ctx.createLinearGradient(
                this.x + 5, yPos - 15, 
                this.x + this.width - 5, yPos + 10
            );
            highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            highlightGradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.9)');
            highlightGradient.addColorStop(1, 'rgba(255, 165, 0, 0.7)');
            
            ctx.fillStyle = highlightGradient;
            ctx.fillRect(this.x + 3, yPos - 17, this.width - 6, 29);
            
            // Add border for better visibility
            ctx.strokeStyle = '#FF8C00';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x + 3, yPos - 17, this.width - 6, 29);
            
            // Add pulsing effect if enabled
            if (this.enablePulse) {
                const pulseAlpha = 0.3 + Math.sin(frameCount * 0.15 + this.pulsePhase) * 0.2;
                ctx.fillStyle = \`rgba(255, 215, 0, \${pulseAlpha})\`;
                ctx.fillRect(this.x + 1, yPos - 19, this.width - 2, 33);
            }
        }
        
        /**
         * Draw the current (highlighted) ingredient
         * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
         * @param {object} ingredient - Ingredient data
         * @param {number} yPos - Y position for the ingredient
         */
        drawCurrentIngredient(ctx, ingredient, yPos) {
            ctx.font = '20px Arial'; // Keep Arial for emoji compatibility
            ctx.textAlign = 'center';
            
            // Enhanced glow and contrast for current ingredient
            ctx.shadowColor = '#FF4500';
            ctx.shadowBlur = 12;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            
            // Add white outline for better contrast
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 3;
            ctx.strokeText(ingredient.emoji, this.x + this.width / 2, yPos);
            
            // Scale up the current ingredient slightly
            ctx.save();
            ctx.translate(this.x + this.width / 2, yPos);
            ctx.scale(1.2, 1.2);
            ctx.fillText(ingredient.emoji, 0, 0);
            ctx.restore();
            
            // Reset shadow
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }
        
        /**
         * Draw a regular ingredient
         * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
         * @param {object} ingredient - Ingredient data
         * @param {number} yPos - Y position for the ingredient
         */
        drawIngredient(ctx, ingredient, yPos) {
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(ingredient.emoji, this.x + this.width / 2, yPos);
        }

        /**
         * Check if an ingredient matches the current expected ingredient
         * @param {string} type - Ingredient type to check
         * @returns {string} 'correct', 'completed', or 'wrong'
         */
        checkIngredient(type) {
            if (this.completed || this.expired) {
                return 'wrong';
            }
            
            if (this.currentIndex < this.ingredients.length && 
                this.ingredients[this.currentIndex] === type) {
                this.currentIndex++;
                
                if (this.currentIndex >= this.ingredients.length) {
                    this.completed = true;
                    return 'completed';
                }
                
                return 'correct';
            }
            
            return 'wrong';
        }
        
        /**
         * Get the current expected ingredient type
         * @returns {string|null} Current ingredient type or null if order is complete
         */
        getCurrentIngredient() {
            if (this.currentIndex >= this.ingredients.length) {
                return null;
            }
            return this.ingredients[this.currentIndex];
        }
        
        /**
         * Get order completion progress
         * @returns {number} Progress as a value between 0 and 1
         */
        getProgress() {
            return this.currentIndex / this.ingredients.length;
        }
        
        /**
         * Get remaining time in seconds
         * @returns {number} Time remaining in seconds
         */
        getTimeRemaining() {
            return Math.max(0, this.timeLeft / 1000);
        }
        
        /**
         * Check if order is completed
         * @returns {boolean} True if completed
         */
        isCompleted() {
            return this.completed;
        }
        
        /**
         * Check if order has expired
         * @returns {boolean} True if expired
         */
        isExpired() {
            return this.expired;
        }
        
        /**
         * Check if order is expiring soon (less than 10 seconds)
         * @returns {boolean} True if expiring soon
         */
        isExpiringSoon() {
            return this.timeLeft < 10000;
        }
        
        /**
         * Get order bounds for UI layout
         * @returns {object} Bounds object {x, y, width, height}
         */
        getBounds() {
            return {
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height
            };
        }
        
        /**
         * Reset order to initial state
         */
        reset() {
            this.currentIndex = 0;
            this.timeLeft = this.template.time * 1000;
            this.completed = false;
            this.expired = false;
            this.animationTime = 0;
        }
        
        /**
         * Create a random order from available templates
         * @param {object} options - Options for order creation
         * @returns {Order} New random order
         */
        static createRandom(options = {}) {
            const template = orderTemplates[Math.floor(Math.random() * orderTemplates.length)];
            return new Order(template, options);
        }
        
        /**
         * Get all available order templates
         * @returns {Array<object>} Array of order templates
         */
        static getAvailableTemplates() {
            return [...orderTemplates];
        }
        
        /**
         * Get a specific order template by name
         * @param {string} name - Template name
         * @returns {object|null} Template or null if not found
         */
        static getTemplateByName(name) {
            return orderTemplates.find(template => template.name === name) || null;
        }
        
        /**
         * Validate order template
         * @param {object} template - Template to validate
         * @returns {boolean} True if valid template
         */
        static isValidTemplate(template) {
            return !!(template && 
                   typeof template.name === 'string' &&
                   Array.isArray(template.ingredients) &&
                   template.ingredients.length > 0 &&
                   typeof template.time === 'number' &&
                   template.time > 0);
        }
    }

    /**
     * Audio System
     * 
     * Complete Web Audio API-based audio system with procedural sound generation,
     * background music, volume controls, and audio ducking.
     */

    /**
     * Sound effect definitions
     */
    const soundEffects = {
        ingredientCorrect: {
            frequency: 880,
            type: 'sine',
            duration: 0.15,
            volume: 0.6
        },
        ingredientWrong: {
            frequency: 220,
            type: 'sawtooth',
            duration: 0.2,
            volume: 0.5
        },
        orderComplete: {
            frequencies: [523, 659, 784, 1047], // C, E, G, High C
            type: 'sine',
            duration: 0.2,
            volume: 0.8
        },
        orderExpired: {
            frequency: 165,
            type: 'square',
            duration: 0.3,
            volume: 0.7
        },
        powerUpCollect: {
            frequency: 698,
            type: 'triangle',
            duration: 0.25,
            volume: 0.7
        },
        doublePointsActivate: {
            frequency: 1397, // F6
            type: 'sine',
            duration: 0.3,
            volume: 0.8,
            duck: true
        },
        slowTimeActivate: {
            frequency: 440, // A4
            type: 'triangle',
            duration: 0.4,
            volume: 0.8,
            duck: true
        },
        comboMultiplierActivate: {
            frequency: 587, // D5
            type: 'square',
            duration: 0.35,
            volume: 0.7,
            duck: true
        },
        comboIncrease: {
            frequency: 659, // E5
            type: 'sine',
            duration: 0.1,
            volume: 0.5
        },
        buttonClick: {
            frequency: 1000,
            type: 'sine',
            duration: 0.05,
            volume: 0.3
        },
        ingredientDestroy: {
            frequency: 150,
            type: 'sawtooth',
            duration: 0.15,
            volume: 0.4,
            sweep: true // Will add frequency sweep for explosion effect
        },
        gameOver: {
            frequencies: [330, 311, 294, 277], // E, Eb, D, Db
            type: 'sawtooth',
            duration: 0.4,
            volume: 0.8
        }
    };

    /**
     * Music note definitions
     */
    const musicNotes = {
        melody: [523, 587, 659, 784, 880], // C5, D5, E5, G5, A5 (pentatonic)
        bass: [131, 147, 165, 196, 220]    // C3, D3, E3, G3, A3
    };

    class AudioSystem {
        constructor(options = {}) {
            // Audio context and processing chain
            this.audioContext = null;
            this.audioProcessingChain = null;
            this.enabled = true;
            
            // Audio settings
            this.settings = {
                master: options.master || 0.3,
                effects: options.effects || 1.0,
                music: options.music || 0.5,
                preset: options.preset || 'normal'
            };
            
            // Background music state
            this.backgroundMusic = {
                playing: false,
                oscillators: [],
                gainNodes: [],
                melodyInterval: null,
                cleanupInterval: null
            };
            
            // Audio ducking
            this.musicGainNode = null;
            this.isDucking = false;
            
            // Event listeners
            this.eventListeners = new Map();
            
            // Initialize audio system
            this.init();
        }
        
        /**
         * Initialize the audio system
         */
        init() {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.setupAudioProcessingChain();
                this.setupUserInteractionHandlers();
            } catch (e) {
                console.warn('Web Audio API not supported');
                this.enabled = false;
            }
        }
        
        /**
         * Set up audio processing chain with compressor and limiter
         */
        setupAudioProcessingChain() {
            if (!this.audioContext) return;
            
            // Create compressor
            const compressor = this.audioContext.createDynamicsCompressor();
            compressor.threshold.setValueAtTime(-20, this.audioContext.currentTime);
            compressor.knee.setValueAtTime(10, this.audioContext.currentTime);
            compressor.ratio.setValueAtTime(6, this.audioContext.currentTime);
            compressor.attack.setValueAtTime(0.003, this.audioContext.currentTime);
            compressor.release.setValueAtTime(0.1, this.audioContext.currentTime);
            
            // Create limiter
            const limiter = this.audioContext.createDynamicsCompressor();
            limiter.threshold.setValueAtTime(-6, this.audioContext.currentTime);
            limiter.knee.setValueAtTime(0, this.audioContext.currentTime);
            limiter.ratio.setValueAtTime(20, this.audioContext.currentTime);
            limiter.attack.setValueAtTime(0.001, this.audioContext.currentTime);
            limiter.release.setValueAtTime(0.01, this.audioContext.currentTime);
            
            // Chain: compressor -> limiter -> destination
            compressor.connect(limiter);
            limiter.connect(this.audioContext.destination);
            
            this.audioProcessingChain = compressor;
        }
        
        /**
         * Set up user interaction handlers for audio context resume
         */
        setupUserInteractionHandlers() {
            const resumeAudio = () => {
                if (!this.audioContext) return;

                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume().then(() => {
                        if (this.settings.music > 0 && !this.backgroundMusic.playing) {
                            this.startBackgroundMusic();
                        }
                    });
                } else if (this.settings.music > 0 && !this.backgroundMusic.playing) {
                    this.startBackgroundMusic();
                }
            };

            document.addEventListener('click', resumeAudio, { once: true });
            document.addEventListener('touchstart', resumeAudio, { once: true });
        }
        
        /**
         * Create an oscillator with the audio processing chain
         */
        createOscillator(frequency, type = 'sine', duration = 0.1, volumeMultiplier = 1) {
            if (!this.audioContext || !this.enabled) return null;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            // Add low-pass filter to smooth harsh frequencies
            const filter = this.audioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(8000, this.audioContext.currentTime);
            filter.Q.setValueAtTime(0.7, this.audioContext.currentTime);
            
            // Connect audio chain
            oscillator.connect(gainNode);
            gainNode.connect(filter);
            
            if (this.audioProcessingChain) {
                filter.connect(this.audioProcessingChain);
            } else {
                filter.connect(this.audioContext.destination);
            }
            
            // Configure oscillator
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            
            // Calculate final volume
            const finalVolume = this.settings.master * this.settings.effects * volumeMultiplier;
            
            // Smooth volume envelope
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(finalVolume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            return { oscillator, gainNode, filter };
        }
        
        /**
         * Play a sound effect
         */
        playSound(soundConfig) {
            if (!this.audioContext || !this.enabled || this.settings.effects === 0) return;
            
            const { frequency, type = 'sine', duration = 0.1, volume = 1, duck = false, sweep = false } = soundConfig;
            const result = this.createOscillator(frequency, type, duration, volume);
            
            if (result) {
                const { oscillator } = result;
                
                // Add frequency sweep for explosion effect
                if (sweep) {
                    oscillator.frequency.setValueAtTime(frequency * 2, this.audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.5, this.audioContext.currentTime + duration);
                }
                
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + duration);
                
                // Clean up after sound finishes
                oscillator.addEventListener('ended', () => {
                    oscillator.disconnect();
                });
                
                // Handle audio ducking
                if (duck) {
                    this.duckBackgroundMusic();
                    setTimeout(() => this.restoreBackgroundMusic(), duration * 1000);
                }
            }
        }
        
        /**
         * Play a sequence of sounds
         */
        playSequence(frequencies, type = 'sine', duration = 0.1, volume = 1) {
            if (!this.audioContext || !this.enabled || this.settings.effects === 0) return;
            
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    this.playSound({ frequency: freq, type, duration: duration * 0.8, volume });
                }, index * duration * 1000 * 0.9);
            });
        }
        
        /**
         * Play specific game sound effects
         */
        playIngredientCorrect() {
            this.playSound(soundEffects.ingredientCorrect);
        }
        
        playIngredientWrong() {
            this.playSound(soundEffects.ingredientWrong);
        }
        
        playOrderComplete() {
            this.playSequence(
                soundEffects.orderComplete.frequencies,
                soundEffects.orderComplete.type,
                soundEffects.orderComplete.duration,
                soundEffects.orderComplete.volume
            );
        }
        
        playOrderExpired() {
            this.playSound(soundEffects.orderExpired);
        }
        
        playPowerUpCollect() {
            this.playSound(soundEffects.powerUpCollect);
        }
        
        playPowerUpActivate(type) {
            const soundKey = type + 'Activate';
            const sound = soundEffects[soundKey];
            if (sound) {
                this.duckBackgroundMusic();
                this.playSound(sound);
                setTimeout(() => this.restoreBackgroundMusic(), 300);
            }
        }
        
        playComboIncrease() {
            this.playSound(soundEffects.comboIncrease);
        }
        
        playButtonClick() {
            this.playSound(soundEffects.buttonClick);
        }
        
        playDestroy() {
            this.playSound(soundEffects.ingredientDestroy);
        }
        
        playGameOver() {
            if (!this.audioContext || !this.enabled || this.settings.effects === 0) return;
            
            soundEffects.gameOver.frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    this.playSound({
                        frequency: freq,
                        type: soundEffects.gameOver.type,
                        duration: soundEffects.gameOver.duration * 0.7,
                        volume: soundEffects.gameOver.volume
                    });
                }, index * 150);
            });
        }
        
        /**
         * Alias methods for backward compatibility
         */
        playCollect() {
            this.playIngredientCorrect();
        }
        
        playError() {
            this.playIngredientWrong();
        }
        
        playNewOrder() {
            this.playButtonClick();
        }
        
        /**
         * Start background music
         */
        startBackgroundMusic() {
            if (
                !this.audioContext ||
                !this.enabled ||
                this.backgroundMusic.playing ||
                this.settings.music === 0 ||
                this.audioContext.state === 'suspended'
            ) {
                return;
            }
            
            // Resume audio context if suspended (handles autoplay restrictions)
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume().then(() => {
                    this._startBackgroundMusicInternal();
                }).catch(err => {
                    console.warn('Failed to resume audio context:', err);
                });
            } else {
                this._startBackgroundMusicInternal();
            }
        }
        
        /**
         * Internal method to actually start background music
         */
        _startBackgroundMusicInternal() {
            // Create master gain node for music
            if (!this.musicGainNode) {
                this.musicGainNode = this.audioContext.createGain();
                
                if (this.audioProcessingChain) {
                    this.musicGainNode.connect(this.audioProcessingChain);
                } else {
                    this.musicGainNode.connect(this.audioContext.destination);
                }
                
                this.musicGainNode.gain.setValueAtTime(
                    this.settings.master * this.settings.music,
                    this.audioContext.currentTime
                );
            }
            
            this.backgroundMusic.playing = true;
            
            // Start melody interval
            this.backgroundMusic.melodyInterval = setInterval(() => {
                if (this.backgroundMusic.playing && this.settings.music > 0) {
                    this.playMelodyNote();
                } else {
                    clearInterval(this.backgroundMusic.melodyInterval);
                }
            }, 3000 + Math.random() * 2000);
            
            // Start cleanup interval
            this.backgroundMusic.cleanupInterval = setInterval(() => {
                this.cleanupOscillators();
            }, 5000);
        }
        
        /**
         * Stop background music
         */
        stopBackgroundMusic() {
            this.backgroundMusic.playing = false;
            
            // Clear intervals
            if (this.backgroundMusic.melodyInterval) {
                clearInterval(this.backgroundMusic.melodyInterval);
                this.backgroundMusic.melodyInterval = null;
            }
            if (this.backgroundMusic.cleanupInterval) {
                clearInterval(this.backgroundMusic.cleanupInterval);
                this.backgroundMusic.cleanupInterval = null;
            }
            
            // Stop all oscillators
            this.backgroundMusic.oscillators.forEach(osc => {
                try {
                    osc.stop();
                    osc.disconnect();
                } catch (e) {
                    // Oscillator might already be stopped
                }
            });
            
            this.backgroundMusic.oscillators = [];
            this.backgroundMusic.gainNodes = [];
        }
        
        /**
         * Play a single melody note
         */
        playMelodyNote() {
            if (!this.backgroundMusic.playing || !this.musicGainNode || this.settings.music === 0) {
                return;
            }
            
            // Check if audio context is suspended
            if (this.audioContext.state === 'suspended') {
                return;
            }
            
            try {
                const noteIndex = Math.floor(Math.random() * musicNotes.melody.length);
                const frequency = musicNotes.melody[noteIndex];
                const musicVolume = this.settings.master * this.settings.music * 0.1;
                
                const melodyOsc = this.audioContext.createOscillator();
                const melodyGain = this.audioContext.createGain();
                
                melodyOsc.connect(melodyGain);
                melodyGain.connect(this.musicGainNode);
                
                melodyOsc.type = 'sine';
                melodyOsc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
                
                melodyGain.gain.setValueAtTime(0, this.audioContext.currentTime);
                melodyGain.gain.linearRampToValueAtTime(musicVolume, this.audioContext.currentTime + 0.1);
                melodyGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1.5);
                
                melodyOsc.start();
                melodyOsc.stop(this.audioContext.currentTime + 2);
                
                // Cleanup after note finishes
                melodyOsc.addEventListener('ended', () => {
                    const oscIndex = this.backgroundMusic.oscillators.indexOf(melodyOsc);
                    const gainIndex = this.backgroundMusic.gainNodes.indexOf(melodyGain);
                    if (oscIndex > -1) this.backgroundMusic.oscillators.splice(oscIndex, 1);
                    if (gainIndex > -1) this.backgroundMusic.gainNodes.splice(gainIndex, 1);
                });
                
                this.backgroundMusic.oscillators.push(melodyOsc);
                this.backgroundMusic.gainNodes.push(melodyGain);
            } catch (err) {
                console.warn('Failed to play melody note:', err);
            }
        }
        
        /**
         * Clean up ended oscillators
         */
        cleanupOscillators() {
            this.backgroundMusic.oscillators = this.backgroundMusic.oscillators.filter(osc => {
                try {
                    return osc.context.state !== 'closed';
                } catch (e) {
                    return false;
                }
            });
            
            this.backgroundMusic.gainNodes = this.backgroundMusic.gainNodes.filter(gain => {
                try {
                    return gain.context.state !== 'closed';
                } catch (e) {
                    return false;
                }
            });
        }
        
        /**
         * Duck background music volume
         */
        duckBackgroundMusic() {
            if (!this.musicGainNode || this.isDucking) return;
            
            this.isDucking = true;
            const currentVolume = this.settings.master * this.settings.music;
            const duckedVolume = currentVolume * 0.3;
            
            this.musicGainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
            this.musicGainNode.gain.setValueAtTime(currentVolume, this.audioContext.currentTime);
            this.musicGainNode.gain.linearRampToValueAtTime(duckedVolume, this.audioContext.currentTime + 0.1);
        }
        
        /**
         * Restore background music volume
         */
        restoreBackgroundMusic() {
            if (!this.musicGainNode || !this.isDucking) return;
            
            this.isDucking = false;
            const normalVolume = this.settings.master * this.settings.music;
            
            this.musicGainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
            this.musicGainNode.gain.linearRampToValueAtTime(normalVolume, this.audioContext.currentTime + 0.3);
        }
        
        /**
         * Update master volume
         */
        setMasterVolume(value) {
            this.settings.master = Math.max(0, Math.min(1, value));
            
            if (this.musicGainNode && !this.isDucking) {
                const musicVolume = this.settings.master * this.settings.music;
                this.musicGainNode.gain.setValueAtTime(musicVolume, this.audioContext.currentTime);
            }
            
            this.emit('volumeChanged', { type: 'master', value: this.settings.master });
        }
        
        /**
         * Update effects volume
         */
        setEffectsVolume(value) {
            this.settings.effects = Math.max(0, Math.min(1, value));
            this.emit('volumeChanged', { type: 'effects', value: this.settings.effects });
        }
        
        /**
         * Update music volume
         */
        setMusicVolume(value) {
            this.settings.music = Math.max(0, Math.min(1, value));
            
            if (this.musicGainNode && !this.isDucking) {
                const musicVolume = this.settings.master * this.settings.music;
                this.musicGainNode.gain.setValueAtTime(musicVolume, this.audioContext.currentTime);
            }
            
            // Handle music start/stop based on volume
            if (value > 0 && !this.backgroundMusic.playing) {
                this.startBackgroundMusic();
            } else if (value === 0) {
                this.stopBackgroundMusic();
            }
            
            this.emit('volumeChanged', { type: 'music', value: this.settings.music });
        }
        
        /**
         * Set audio preset
         */
        setPreset(preset) {
            const presets = {
                quiet: { master: 0.15, effects: 0.8, music: 0.3 },
                normal: { master: 0.3, effects: 1.0, music: 0.5 },
                energetic: { master: 0.5, effects: 1.0, music: 0.7 }
            };
            
            const config = presets[preset];
            if (config) {
                this.setMasterVolume(config.master);
                this.setEffectsVolume(config.effects);
                this.setMusicVolume(config.music);
                this.settings.preset = preset;
                this.emit('presetChanged', preset);
            }
        }
        
        /**
         * Enable/disable audio system
         */
        setEnabled(enabled) {
            this.enabled = enabled;
            
            if (!enabled) {
                this.stopBackgroundMusic();
            }
            
            this.emit('enabledChanged', enabled);
        }
        
        /**
         * Get current audio settings
         */
        getSettings() {
            return { ...this.settings };
        }
        
        /**
         * Check if audio is enabled and supported
         */
        isEnabled() {
            return this.enabled && !!this.audioContext;
        }
        
        /**
         * Cleanup audio system
         */
        destroy() {
            this.stopBackgroundMusic();
            
            if (this.musicGainNode) {
                this.musicGainNode.disconnect();
                this.musicGainNode = null;
            }
            
            if (this.audioContext) {
                this.audioContext.close();
                this.audioContext = null;
            }
            
            this.eventListeners.clear();
        }
        
        /**
         * Event system for audio callbacks
         */
        on(event, callback) {
            if (!this.eventListeners.has(event)) {
                this.eventListeners.set(event, []);
            }
            this.eventListeners.get(event).push(callback);
        }
        
        off(event, callback) {
            const callbacks = this.eventListeners.get(event);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }
            }
        }
        
        emit(event, data) {
            const callbacks = this.eventListeners.get(event);
            if (callbacks) {
                callbacks.forEach(callback => {
                    try {
                        callback(data);
                    } catch (error) {
                        console.error(\`Error in audio event listener for \${event}:\`, error);
                    }
                });
            }
        }
    }

    /**
     * Color Theme System
     * 
     * Dynamic color management with theme transitions and texture pattern generation.
     * Colors respond to game state (combo level and score) for enhanced visual feedback.
     */


    /**
     * Create texture patterns for visual enhancement
     * @param {CanvasRenderingContext2D} ctx - Canvas context for pattern creation
     * @param {string} type - Type of texture ('wood', 'marble', 'fabric', 'paper')
     * @param {number} size - Size of the pattern (default: 50)
     * @returns {CanvasPattern} Canvas pattern object
     */
    function createTexturePattern(ctx, type, size = 50) {
        const patternCanvas = document.createElement('canvas');
        patternCanvas.width = size;
        patternCanvas.height = size;
        const patternCtx = patternCanvas.getContext('2d');
        
        switch(type) {
            case 'wood':
                // Wood grain texture
                const woodGradient = patternCtx.createLinearGradient(0, 0, 0, size);
                woodGradient.addColorStop(0, '#DEB887');
                woodGradient.addColorStop(0.3, '#D2B48C');
                woodGradient.addColorStop(0.7, '#CD853F');
                woodGradient.addColorStop(1, '#A0522D');
                patternCtx.fillStyle = woodGradient;
                patternCtx.fillRect(0, 0, size, size);
                
                // Add wood grain lines
                patternCtx.strokeStyle = 'rgba(139, 69, 19, 0.3)';
                patternCtx.lineWidth = 1;
                for(let i = 0; i < 8; i++) {
                    const y = (i * size / 8) + Math.sin(i) * 3;
                    patternCtx.beginPath();
                    patternCtx.moveTo(0, y);
                    patternCtx.lineTo(size, y + Math.sin(i * 0.5) * 2);
                    patternCtx.stroke();
                }
                break;
                
            case 'marble':
                // Marble texture
                const marbleGradient = patternCtx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
                marbleGradient.addColorStop(0, '#F8F8FF');
                marbleGradient.addColorStop(0.5, '#E6E6FA');
                marbleGradient.addColorStop(1, '#D3D3D3');
                patternCtx.fillStyle = marbleGradient;
                patternCtx.fillRect(0, 0, size, size);
                
                // Add marble veins
                patternCtx.strokeStyle = 'rgba(169, 169, 169, 0.4)';
                patternCtx.lineWidth = 2;
                patternCtx.beginPath();
                patternCtx.moveTo(0, size * 0.3);
                patternCtx.quadraticCurveTo(size * 0.7, size * 0.1, size, size * 0.8);
                patternCtx.stroke();
                break;
                
            case 'fabric':
                // Fabric weave texture
                patternCtx.fillStyle = '#F5F5DC';
                patternCtx.fillRect(0, 0, size, size);
                
                patternCtx.fillStyle = 'rgba(210, 180, 140, 0.5)';
                const gridSize = size / 10;
                for(let x = 0; x < size; x += gridSize) {
                    for(let y = 0; y < size; y += gridSize) {
                        if((Math.floor(x/gridSize) + Math.floor(y/gridSize)) % 2) {
                            patternCtx.fillRect(x, y, gridSize, gridSize);
                        }
                    }
                }
                break;
                
            case 'paper':
                // Paper texture
                patternCtx.fillStyle = '#FFFEF0';
                patternCtx.fillRect(0, 0, size, size);
                
                // Add paper fibers
                for(let i = 0; i < 20; i++) {
                    patternCtx.strokeStyle = \`rgba(220, 220, 200, \${Math.random() * 0.3})\`;
                    patternCtx.lineWidth = 0.5;
                    patternCtx.beginPath();
                    patternCtx.moveTo(Math.random() * size, Math.random() * size);
                    patternCtx.lineTo(Math.random() * size, Math.random() * size);
                    patternCtx.stroke();
                }
                break;
                
            default:
                // Default solid color
                patternCtx.fillStyle = '#FFFFFF';
                patternCtx.fillRect(0, 0, size, size);
                break;
        }
        
        return ctx.createPattern(patternCanvas, 'repeat');
    }

    /**
     * Get a random color from a predefined palette
     * @returns {string} Hex color string
     */
    function getRandomColor() {
        const colors = [
            '#FF6B6B', // Red
            '#4ECDC4', // Teal
            '#45B7D1', // Blue
            '#F7DC6F', // Yellow
            '#BB8FCE', // Purple
            '#85C872', // Green
            '#F8B500', // Orange
            '#FF6F91', // Pink
            '#6C5CE7', // Violet
            '#00D2D3'  // Cyan
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    /**
     * Renderer System
     * 
     * Comprehensive canvas rendering system with texture patterns, screen effects,
     * custom graphics, and dynamic visual features.
     */


    class Renderer {
        constructor(canvas, options = {}) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            
            // Rendering options
            this.enableTextures = options.enableTextures !== false;
            this.enableShadows = options.enableShadows !== false;
            this.enableEffects = options.enableEffects !== false;
            
            // Canvas patterns
            this.patterns = {
                wood: null,
                marble: null,
                fabric: null,
                paper: null
            };
            
            // Screen effects
            this.screenEffects = {
                shake: { intensity: 0, duration: 0, x: 0, y: 0 },
                flash: { intensity: 0, color: '#FFFFFF', duration: 0 },
                ripple: { active: false, x: 0, y: 0, radius: 0, maxRadius: 0 },
                glitch: { active: false, intensity: 0, duration: 0 }
            };
            
            // Performance tracking
            this.stats = {
                drawCalls: 0,
                frameTime: 0,
                lastFrameTime: 0
            };
            
            // Initialize
            this.init();
        }
        
        /**
         * Initialize the renderer
         */
        init() {
            this.setupCanvas();
            if (this.enableTextures) {
                this.initializePatterns();
            }
            this.setupEventListeners();
        }
        
        /**
         * Set up canvas properties
         */
        setupCanvas() {
            this.ctx.imageSmoothingEnabled = true;
            this.ctx.imageSmoothingQuality = 'high';
            this.resizeCanvas();
        }
        
        /**
         * Resize canvas to fit window
         */
        resizeCanvas() {
            const oldWidth = this.canvas.width;
            const oldHeight = this.canvas.height;
            
            this.canvas.width = Math.min(window.innerWidth, 480);
            this.canvas.height = window.innerHeight;
            
            // Re-setup context properties after resize
            this.ctx.imageSmoothingEnabled = true;
            this.ctx.imageSmoothingQuality = 'high';
            
            return { 
                changed: oldWidth !== this.canvas.width || oldHeight !== this.canvas.height,
                width: this.canvas.width,
                height: this.canvas.height
            };
        }
        
        /**
         * Set up event listeners
         */
        setupEventListeners() {
            window.addEventListener('resize', () => this.resizeCanvas());
        }
        
        /**
         * Initialize texture patterns
         */
        initializePatterns() {
            this.patterns.wood = createTexturePattern(this.ctx, 'wood', 60);
            this.patterns.marble = createTexturePattern(this.ctx, 'marble', 80);
            this.patterns.fabric = createTexturePattern(this.ctx, 'fabric', 40);
            this.patterns.paper = createTexturePattern(this.ctx, 'paper', 100);
        }
        
        /**
         * Clear the canvas
         */
        clear() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.stats.drawCalls = 0;
        }
        
        /**
         * Begin frame rendering
         */
        beginFrame(currentTime) {
            this.stats.frameTime = currentTime - this.stats.lastFrameTime;
            this.stats.lastFrameTime = currentTime;
            this.clear();
        }
        
        /**
         * End frame rendering
         */
        endFrame() {
            this.drawScreenEffects();
        }
        
        /**
         * Draw enhanced kitchen background
         */
        drawBackground() {
            this.ctx.save();
            
            // Main game area texture
            if (this.enableTextures && this.patterns.fabric) {
                this.ctx.fillStyle = this.patterns.fabric;
                this.ctx.globalAlpha = 0.05;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height - 100);
                this.ctx.globalAlpha = 1;
            }
            
            // Kitchen counter with wood texture
            if (this.enableTextures && this.patterns.wood) {
                this.ctx.fillStyle = this.patterns.wood;
                this.ctx.globalAlpha = 0.6;
                this.ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 100);
                this.ctx.globalAlpha = 1;
            }
            
            // Add gradient overlay for depth
            const kitchenGradient = this.ctx.createLinearGradient(
                0, this.canvas.height - 100, 
                0, this.canvas.height
            );
            kitchenGradient.addColorStop(0, 'rgba(139, 69, 19, 0.3)');
            kitchenGradient.addColorStop(0.5, 'rgba(101, 67, 33, 0.4)');
            kitchenGradient.addColorStop(1, 'rgba(83, 53, 27, 0.5)');
            this.ctx.fillStyle = kitchenGradient;
            this.ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 100);
            
            this.ctx.restore();
            this.stats.drawCalls++;
        }
        
        /**
         * Draw custom button with 3D effect
         */
        drawButton(x, y, width, height, text, isPressed = false) {
            this.ctx.save();
            
            // Button shadow
            const shadowOffset = isPressed ? 2 : 4;
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this.ctx.fillRect(x + shadowOffset, y + shadowOffset, width, height);
            
            // Button body with gradient
            const gradient = this.ctx.createLinearGradient(x, y, x, y + height);
            if (isPressed) {
                gradient.addColorStop(0, '#E6B800');
                gradient.addColorStop(1, '#FFD700');
            } else {
                gradient.addColorStop(0, '#FFD700');
                gradient.addColorStop(0.5, '#FFA500');
                gradient.addColorStop(1, '#FF8C00');
            }
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x, y, width, height);
            
            // Button border
            this.ctx.strokeStyle = '#B8860B';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, width, height);
            
            // Button highlight
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(x + 1, y + 1, width - 2, height - 2);
            
            // Button text
            this.ctx.fillStyle = '#333';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(text, x + width/2, y + height/2 + (isPressed ? 1 : 0));
            
            this.ctx.restore();
            this.stats.drawCalls++;
        }
        
        /**
         * Draw custom heart with optional beating animation
         */
        drawHeart(x, y, size, color = '#FF0000', beat = false, frameCount = 0) {
            this.ctx.save();
            this.ctx.translate(x, y);
            
            if (beat) {
                const scale = 1 + Math.sin(frameCount * 0.3) * 0.1;
                this.ctx.scale(scale, scale);
            }
            
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            
            // Heart shape using curves
            const heartSize = size * 0.5;
            this.ctx.moveTo(0, heartSize * 0.3);
            this.ctx.bezierCurveTo(-heartSize, -heartSize * 0.3, -heartSize, heartSize * 0.3, 0, heartSize);
            this.ctx.bezierCurveTo(heartSize, heartSize * 0.3, heartSize, -heartSize * 0.3, 0, heartSize * 0.3);
            this.ctx.fill();
            
            // Heart highlight
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.beginPath();
            this.ctx.ellipse(-heartSize * 0.3, -heartSize * 0.1, heartSize * 0.2, heartSize * 0.15, 0, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
            this.stats.drawCalls++;
        }
        
        /**
         * Draw custom star with optional twinkling animation
         */
        drawStar(x, y, size, color = '#FFD700', twinkle = false, frameCount = 0) {
            this.ctx.save();
            this.ctx.translate(x, y);
            
            if (twinkle) {
                const rotation = frameCount * 0.05;
                this.ctx.rotate(rotation);
                const scale = 0.8 + Math.sin(frameCount * 0.2) * 0.3;
                this.ctx.scale(scale, scale);
            }
            
            this.ctx.fillStyle = color;
            
            // 5-pointed star
            const spikes = 5;
            const outerRadius = size;
            const innerRadius = size * 0.4;
            
            this.ctx.beginPath();
            for (let i = 0; i < spikes; i++) {
                const angle = (i * Math.PI * 2) / spikes - Math.PI / 2;
                const x1 = Math.cos(angle) * outerRadius;
                const y1 = Math.sin(angle) * outerRadius;
                
                if (i === 0) this.ctx.moveTo(x1, y1);
                else this.ctx.lineTo(x1, y1);
                
                const innerAngle = angle + Math.PI / spikes;
                const x2 = Math.cos(innerAngle) * innerRadius;
                const y2 = Math.sin(innerAngle) * innerRadius;
                this.ctx.lineTo(x2, y2);
            }
            this.ctx.closePath();
            this.ctx.fill();
            
            // Star highlight
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            this.ctx.beginPath();
            this.ctx.arc(0, -size * 0.2, size * 0.15, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
            this.stats.drawCalls++;
        }
        
        /**
         * Draw custom burger illustration
         */
        drawBurger(x, y, size) {
            this.ctx.save();
            this.ctx.translate(x, y);
            
            const layers = [
                { color: '#D2B48C', height: size * 0.15, type: 'bun' },
                { color: '#90EE90', height: size * 0.08, type: 'lettuce' },
                { color: '#FF6347', height: size * 0.08, type: 'tomato' },
                { color: '#FFD700', height: size * 0.06, type: 'cheese' },
                { color: '#8B4513', height: size * 0.2, type: 'patty' },
                { color: '#DEB887', height: size * 0.15, type: 'bun' }
            ];
            
            let currentY = size * 0.4;
            
            layers.forEach((layer) => {
                this.ctx.fillStyle = layer.color;
                
                if (layer.type === 'bun') {
                    // Rounded bun
                    this.ctx.beginPath();
                    this.ctx.ellipse(0, currentY, size * 0.4, layer.height, 0, 0, Math.PI * 2);
                    this.ctx.fill();
                    
                    // Bun highlight
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                    this.ctx.beginPath();
                    this.ctx.ellipse(0, currentY - layer.height * 0.3, size * 0.3, layer.height * 0.5, 0, 0, Math.PI * 2);
                    this.ctx.fill();
                } else {
                    // Flat ingredients
                    this.ctx.beginPath();
                    this.ctx.ellipse(0, currentY, size * 0.35, layer.height, 0, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                
                currentY -= layer.height * 1.5;
            });
            
            this.ctx.restore();
            this.stats.drawCalls++;
        }
        
        /**
         * Draw text with enhanced styling
         */
        drawText(text, x, y, options = {}) {
            const {
                font = '16px Arial',
                color = '#000000',
                align = 'left',
                baseline = 'top',
                shadow = false,
                shadowColor = 'rgba(0, 0, 0, 0.5)',
                shadowBlur = 2,
                shadowOffset = { x: 1, y: 1 },
                stroke = false,
                strokeColor = '#FFFFFF',
                strokeWidth = 2
            } = options;
            
            this.ctx.save();
            
            this.ctx.font = font;
            this.ctx.textAlign = align;
            this.ctx.textBaseline = baseline;
            
            if (shadow) {
                this.ctx.shadowColor = shadowColor;
                this.ctx.shadowBlur = shadowBlur;
                this.ctx.shadowOffsetX = shadowOffset.x;
                this.ctx.shadowOffsetY = shadowOffset.y;
            }
            
            if (stroke) {
                this.ctx.strokeStyle = strokeColor;
                this.ctx.lineWidth = strokeWidth;
                this.ctx.strokeText(text, x, y);
            }
            
            this.ctx.fillStyle = color;
            this.ctx.fillText(text, x, y);
            
            this.ctx.restore();
            this.stats.drawCalls++;
        }
        
        /**
         * Screen shake effect
         */
        startScreenShake(intensity, duration) {
            this.screenEffects.shake.intensity = intensity;
            this.screenEffects.shake.duration = duration;
        }
        
        updateScreenShake() {
            const shake = this.screenEffects.shake;
            
            if (shake.duration > 0) {
                shake.duration--;
                shake.x = (Math.random() - 0.5) * shake.intensity;
                shake.y = (Math.random() - 0.5) * shake.intensity;
                
                this.canvas.style.transform = \`translate(\${shake.x}px, \${shake.y}px)\`;
                shake.intensity *= 0.9; // Gradually reduce intensity
            } else {
                shake.intensity = 0;
                shake.x = 0;
                shake.y = 0;
                this.canvas.style.transform = 'translate(0px, 0px)';
            }
        }
        
        /**
         * Screen flash effect
         */
        startScreenFlash(color, intensity, duration) {
            this.screenEffects.flash.color = color;
            this.screenEffects.flash.intensity = intensity;
            this.screenEffects.flash.duration = duration;
        }
        
        updateScreenFlash() {
            const flash = this.screenEffects.flash;
            
            if (flash.duration > 0) {
                flash.duration--;
                flash.intensity *= 0.85; // Fade out
            } else {
                flash.intensity = 0;
            }
        }
        
        drawScreenFlash() {
            const flash = this.screenEffects.flash;
            
            if (flash.intensity > 0.01) {
                this.ctx.save();
                this.ctx.globalAlpha = flash.intensity;
                this.ctx.fillStyle = flash.color;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.restore();
            }
        }
        
        /**
         * Ripple effect
         */
        startRippleEffect(x, y, maxRadius = 100) {
            this.screenEffects.ripple.active = true;
            this.screenEffects.ripple.x = x;
            this.screenEffects.ripple.y = y;
            this.screenEffects.ripple.radius = 0;
            this.screenEffects.ripple.maxRadius = maxRadius;
        }
        
        updateRippleEffect() {
            const ripple = this.screenEffects.ripple;
            
            if (ripple.active) {
                ripple.radius += 8;
                if (ripple.radius > ripple.maxRadius) {
                    ripple.active = false;
                }
            }
        }
        
        drawRippleEffect() {
            const ripple = this.screenEffects.ripple;
            
            if (ripple.active) {
                this.ctx.save();
                this.ctx.globalAlpha = 0.3 * (1 - ripple.radius / ripple.maxRadius);
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 4;
                this.ctx.beginPath();
                this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.restore();
            }
        }
        
        /**
         * Glitch effect
         */
        startGlitchEffect(intensity = 0.1, duration = 10) {
            this.screenEffects.glitch.active = true;
            this.screenEffects.glitch.intensity = intensity;
            this.screenEffects.glitch.duration = duration;
        }
        
        updateGlitchEffect() {
            const glitch = this.screenEffects.glitch;
            
            if (glitch.active) {
                glitch.duration--;
                if (glitch.duration <= 0) {
                    glitch.active = false;
                }
            }
        }
        
        drawGlitchEffect() {
            const glitch = this.screenEffects.glitch;
            
            if (glitch.active) {
                this.ctx.save();
                this.ctx.globalAlpha = 0.15;
                this.ctx.fillStyle = Math.random() > 0.5 ? '#ff0000' : '#00ff00';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.restore();
            }
        }
        
        /**
         * Update all screen effects
         */
        updateScreenEffects() {
            this.updateScreenShake();
            this.updateScreenFlash();
            this.updateRippleEffect();
            this.updateGlitchEffect();
        }
        
        /**
         * Draw all screen effects
         */
        drawScreenEffects() {
            if (!this.enableEffects) return;
            
            this.drawScreenFlash();
            this.drawRippleEffect();
            this.drawGlitchEffect();
        }
        
        /**
         * Set up shadows for enhanced 3D effect
         */
        setShadow(color = 'rgba(0, 0, 0, 0.1)', blur = 5, offset = { x: 0, y: 2 }) {
            if (!this.enableShadows) return;
            
            this.ctx.shadowColor = color;
            this.ctx.shadowBlur = blur;
            this.ctx.shadowOffsetX = offset.x;
            this.ctx.shadowOffsetY = offset.y;
        }
        
        /**
         * Clear shadows
         */
        clearShadow() {
            this.ctx.shadowColor = 'transparent';
            this.ctx.shadowBlur = 0;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 0;
        }
        
        /**
         * Get canvas dimensions
         */
        getDimensions() {
            return {
                width: this.canvas.width,
                height: this.canvas.height
            };
        }
        
        /**
         * Get rendering statistics
         */
        getStats() {
            return { ...this.stats };
        }
        
        /**
         * Enable/disable features
         */
        setFeature(feature, enabled) {
            switch (feature) {
                case 'textures':
                    this.enableTextures = enabled;
                    break;
                case 'shadows':
                    this.enableShadows = enabled;
                    break;
                case 'effects':
                    this.enableEffects = enabled;
                    break;
            }
        }
        
        /**
         * Get canvas context (for direct drawing when needed)
         */
        getContext() {
            return this.ctx;
        }
        
        /**
         * Get texture patterns
         */
        getPatterns() {
            return { ...this.patterns };
        }
        
        /**
         * Create floating text element (DOM-based)
         */
        createFloatingText(x, y, text, color = '#FFD700') {
            const div = document.createElement('div');
            div.className = 'floating-text';
            div.style.cssText = \`
            position: absolute;
            left: \${x}px;
            top: \${y}px;
            color: \${color};
            font-size: 24px;
            font-weight: bold;
            pointer-events: none;
            z-index: 1000;
            animation: floatUp 1s ease-out forwards;
        \`;
            div.textContent = text;
            document.body.appendChild(div);
            
            setTimeout(() => div.remove(), 1000);
        }
        
        /**
         * Cleanup renderer resources
         */
        destroy() {
            window.removeEventListener('resize', this.resizeCanvas);
            this.patterns = {};
            this.canvas.style.transform = 'translate(0px, 0px)';
        }
    }

    /**
     * InputSystem - Handles all user input for the game
     * 
     * Features:
     * - Unified touch and mouse event handling
     * - Canvas coordinate transformation
     * - Mobile-optimized touch handling
     * - Event delegation for game entities
     * - Scroll prevention on mobile devices
     * - Automatic cleanup on destruction
     */
    class InputSystem {
        /**
         * Creates a new InputSystem instance
         * @param {HTMLCanvasElement} canvas - The game canvas element
         * @param {Object} options - Configuration options
         * @param {boolean} options.preventScroll - Whether to prevent document scrolling on mobile
         * @param {boolean} options.debug - Enable debug logging
         */
        constructor(canvas, options = {}) {
            this.canvas = canvas;
            this.options = {
                preventScroll: true,
                debug: false,
                ...options
            };
            
            // Input state
            this.touches = new Map(); // Track active touches
            this.mousePosition = { x: 0, y: 0 };
            this.isMouseDown = false;
            
            // Event handlers (bound to preserve context)
            this.boundHandlers = {
                handleTouchStart: this.handleTouchStart.bind(this),
                handleTouchMove: this.handleTouchMove.bind(this),
                handleTouchEnd: this.handleTouchEnd.bind(this),
                handleMouseDown: this.handleMouseDown.bind(this),
                handleMouseMove: this.handleMouseMove.bind(this),
                handleMouseUp: this.handleMouseUp.bind(this),
                handleContextMenu: this.handleContextMenu.bind(this),
                preventScroll: this.preventScroll.bind(this),
                handleResize: this.handleResize.bind(this)
            };
            
            // Click/tap callbacks
            this.clickHandlers = [];
            this.moveHandlers = [];
            this.resizeHandlers = [];
            
            // Canvas bounds cache
            this.canvasBounds = null;
            this.updateCanvasBounds();
            
            this.setupEventListeners();
        }
        
        /**
         * Sets up all event listeners
         * @private
         */
        setupEventListeners() {
            // Touch events
            this.canvas.addEventListener('touchstart', this.boundHandlers.handleTouchStart, { passive: false });
            this.canvas.addEventListener('touchmove', this.boundHandlers.handleTouchMove, { passive: false });
            this.canvas.addEventListener('touchend', this.boundHandlers.handleTouchEnd, { passive: false });
            this.canvas.addEventListener('touchcancel', this.boundHandlers.handleTouchEnd, { passive: false });
            
            // Mouse events
            this.canvas.addEventListener('mousedown', this.boundHandlers.handleMouseDown);
            this.canvas.addEventListener('mousemove', this.boundHandlers.handleMouseMove);
            this.canvas.addEventListener('mouseup', this.boundHandlers.handleMouseUp);
            this.canvas.addEventListener('mouseleave', this.boundHandlers.handleMouseUp);
            
            // Prevent context menu on right-click
            this.canvas.addEventListener('contextmenu', this.boundHandlers.handleContextMenu);
            
            // Prevent scrolling on mobile
            if (this.options.preventScroll) {
                document.body.addEventListener('touchmove', this.boundHandlers.preventScroll, { passive: false });
            }
            
            // Window resize
            window.addEventListener('resize', this.boundHandlers.handleResize);
            
            if (this.options.debug) {
                console.log('InputSystem: Event listeners attached');
            }
        }
        
        /**
         * Updates cached canvas bounds
         * @private
         */
        updateCanvasBounds() {
            this.canvasBounds = this.canvas.getBoundingClientRect();
        }
        
        /**
         * Converts client coordinates to canvas coordinates
         * @param {number} clientX - Client X coordinate
         * @param {number} clientY - Client Y coordinate
         * @returns {{x: number, y: number}} Canvas coordinates
         */
        clientToCanvas(clientX, clientY) {
            const bounds = this.canvasBounds || this.canvas.getBoundingClientRect();
            
            // Account for canvas scaling
            const scaleX = this.canvas.width / bounds.width;
            const scaleY = this.canvas.height / bounds.height;
            
            return {
                x: (clientX - bounds.left) * scaleX,
                y: (clientY - bounds.top) * scaleY
            };
        }
        
        /**
         * Handles touch start events
         * @param {TouchEvent} event - The touch event
         * @private
         */
        handleTouchStart(event) {
            event.preventDefault();
            
            for (const touch of event.changedTouches) {
                const canvasCoords = this.clientToCanvas(touch.clientX, touch.clientY);
                
                this.touches.set(touch.identifier, {
                    id: touch.identifier,
                    startX: canvasCoords.x,
                    startY: canvasCoords.y,
                    currentX: canvasCoords.x,
                    currentY: canvasCoords.y,
                    startTime: Date.now()
                });
                
                // Trigger click handlers for touch start
                this.triggerClick(canvasCoords.x, canvasCoords.y, 'touch');
            }
            
            if (this.options.debug) {
                console.log(\`InputSystem: \${event.changedTouches.length} touch(es) started\`);
            }
        }
        
        /**
         * Handles touch move events
         * @param {TouchEvent} event - The touch event
         * @private
         */
        handleTouchMove(event) {
            event.preventDefault();
            
            for (const touch of event.changedTouches) {
                const touchData = this.touches.get(touch.identifier);
                if (touchData) {
                    const canvasCoords = this.clientToCanvas(touch.clientX, touch.clientY);
                    touchData.currentX = canvasCoords.x;
                    touchData.currentY = canvasCoords.y;
                    
                    // Trigger move handlers
                    this.triggerMove(canvasCoords.x, canvasCoords.y, 'touch');
                }
            }
        }
        
        /**
         * Handles touch end events
         * @param {TouchEvent} event - The touch event
         * @private
         */
        handleTouchEnd(event) {
            event.preventDefault();
            
            for (const touch of event.changedTouches) {
                this.touches.delete(touch.identifier);
            }
            
            if (this.options.debug) {
                console.log(\`InputSystem: Touch ended, \${this.touches.size} active touches\`);
            }
        }
        
        /**
         * Handles mouse down events
         * @param {MouseEvent} event - The mouse event
         * @private
         */
        handleMouseDown(event) {
            const canvasCoords = this.clientToCanvas(event.clientX, event.clientY);
            this.isMouseDown = true;
            this.mousePosition = canvasCoords;
            
            // Trigger click handlers for mouse down
            this.triggerClick(canvasCoords.x, canvasCoords.y, 'mouse');
            
            if (this.options.debug) {
                console.log(\`InputSystem: Mouse down at \${canvasCoords.x}, \${canvasCoords.y}\`);
            }
        }
        
        /**
         * Handles mouse move events
         * @param {MouseEvent} event - The mouse event
         * @private
         */
        handleMouseMove(event) {
            const canvasCoords = this.clientToCanvas(event.clientX, event.clientY);
            this.mousePosition = canvasCoords;
            
            if (this.isMouseDown) {
                this.triggerMove(canvasCoords.x, canvasCoords.y, 'mouse');
            }
        }
        
        /**
         * Handles mouse up events
         * @param {MouseEvent} event - The mouse event
         * @private
         */
        handleMouseUp(event) {
            this.isMouseDown = false;
            
            if (this.options.debug) {
                console.log('InputSystem: Mouse up');
            }
        }
        
        /**
         * Prevents context menu
         * @param {Event} event - The context menu event
         * @private
         */
        handleContextMenu(event) {
            event.preventDefault();
        }
        
        /**
         * Prevents document scrolling
         * @param {TouchEvent} event - The touch event
         * @private
         */
        preventScroll(event) {
            if (event.target === this.canvas || this.canvas.contains(event.target)) {
                event.preventDefault();
            }
        }
        
        /**
         * Handles window resize
         * @param {Event} event - The resize event
         * @private
         */
        handleResize(event) {
            this.updateCanvasBounds();
            
            // Trigger resize handlers
            for (const handler of this.resizeHandlers) {
                handler(this.canvas.width, this.canvas.height);
            }
            
            if (this.options.debug) {
                console.log(\`InputSystem: Canvas resized to \${this.canvas.width}x\${this.canvas.height}\`);
            }
        }
        
        /**
         * Triggers click handlers
         * @param {number} x - Canvas X coordinate
         * @param {number} y - Canvas Y coordinate
         * @param {string} type - Input type ('touch' or 'mouse')
         * @private
         */
        triggerClick(x, y, type) {
            for (const handler of this.clickHandlers) {
                const handled = handler(x, y, type);
                if (handled) break; // Stop propagation if handler returns true
            }
        }
        
        /**
         * Triggers move handlers
         * @param {number} x - Canvas X coordinate
         * @param {number} y - Canvas Y coordinate
         * @param {string} type - Input type ('touch' or 'mouse')
         * @private
         */
        triggerMove(x, y, type) {
            for (const handler of this.moveHandlers) {
                handler(x, y, type);
            }
        }
        
        /**
         * Registers a click/tap handler
         * @param {Function} handler - Handler function (x, y, type) => boolean
         * @returns {Function} Unregister function
         */
        onClick(handler) {
            this.clickHandlers.push(handler);
            
            // Return unregister function
            return () => {
                const index = this.clickHandlers.indexOf(handler);
                if (index !== -1) {
                    this.clickHandlers.splice(index, 1);
                }
            };
        }
        
        /**
         * Registers a move handler
         * @param {Function} handler - Handler function (x, y, type) => void
         * @returns {Function} Unregister function
         */
        onMove(handler) {
            this.moveHandlers.push(handler);
            
            // Return unregister function
            return () => {
                const index = this.moveHandlers.indexOf(handler);
                if (index !== -1) {
                    this.moveHandlers.splice(index, 1);
                }
            };
        }
        
        /**
         * Registers a resize handler
         * @param {Function} handler - Handler function (width, height) => void
         * @returns {Function} Unregister function
         */
        onResize(handler) {
            this.resizeHandlers.push(handler);
            
            // Return unregister function
            return () => {
                const index = this.resizeHandlers.indexOf(handler);
                if (index !== -1) {
                    this.resizeHandlers.splice(index, 1);
                }
            };
        }
        
        /**
         * Gets current touch points
         * @returns {Array} Array of active touch points
         */
        getTouches() {
            return Array.from(this.touches.values());
        }
        
        /**
         * Gets current mouse position
         * @returns {{x: number, y: number}} Mouse position in canvas coordinates
         */
        getMousePosition() {
            return { ...this.mousePosition };
        }
        
        /**
         * Checks if a point is being touched/clicked
         * @param {number} x - X coordinate to check
         * @param {number} y - Y coordinate to check
         * @param {number} radius - Radius around the point to check
         * @returns {boolean} True if point is being interacted with
         */
        isPointActive(x, y, radius = 0) {
            // Check mouse
            if (this.isMouseDown) {
                const dx = this.mousePosition.x - x;
                const dy = this.mousePosition.y - y;
                if (Math.sqrt(dx * dx + dy * dy) <= radius) {
                    return true;
                }
            }
            
            // Check touches
            for (const touch of this.touches.values()) {
                const dx = touch.currentX - x;
                const dy = touch.currentY - y;
                if (Math.sqrt(dx * dx + dy * dy) <= radius) {
                    return true;
                }
            }
            
            return false;
        }
        
        /**
         * Removes all event listeners and cleans up
         */
        destroy() {
            // Remove canvas event listeners
            this.canvas.removeEventListener('touchstart', this.boundHandlers.handleTouchStart);
            this.canvas.removeEventListener('touchmove', this.boundHandlers.handleTouchMove);
            this.canvas.removeEventListener('touchend', this.boundHandlers.handleTouchEnd);
            this.canvas.removeEventListener('touchcancel', this.boundHandlers.handleTouchEnd);
            this.canvas.removeEventListener('mousedown', this.boundHandlers.handleMouseDown);
            this.canvas.removeEventListener('mousemove', this.boundHandlers.handleMouseMove);
            this.canvas.removeEventListener('mouseup', this.boundHandlers.handleMouseUp);
            this.canvas.removeEventListener('mouseleave', this.boundHandlers.handleMouseUp);
            this.canvas.removeEventListener('contextmenu', this.boundHandlers.handleContextMenu);
            
            // Remove document event listeners
            if (this.options.preventScroll) {
                document.body.removeEventListener('touchmove', this.boundHandlers.preventScroll);
            }
            
            // Remove window event listeners
            window.removeEventListener('resize', this.boundHandlers.handleResize);
            
            // Clear handlers
            this.clickHandlers = [];
            this.moveHandlers = [];
            this.resizeHandlers = [];
            
            // Clear state
            this.touches.clear();
            
            if (this.options.debug) {
                console.log('InputSystem: Destroyed and cleaned up');
            }
        }
    }

    /**
     * Physics System
     * 
     * Comprehensive physics engine for handling gravity, collision detection,
     * movement calculations, boundary checking, and hit detection for the game.
     * All physics calculations are pure functions for optimal performance.
     * 
     * @module PhysicsSystem
     */

    /**
     * Physics constants
     */
    const PHYSICS_CONSTANTS = {
        GRAVITY: 0.15,
        TERMINAL_VELOCITY: 12,
        BOUNCE_DAMPING: 0.7,
        FRICTION: 0.8,
        MIN_VELOCITY: 0.01,
        SWAY_AMPLITUDE: 0.5,
        SWAY_FREQUENCY: 0.05,
        ROTATION_DAMPING: 0.98
    };

    /**
     * PhysicsSystem class
     * Stateless physics engine providing pure functions for physics calculations
     */
    class PhysicsSystem {
        constructor(options = {}) {
            // Canvas dimensions for boundary checking
            this.bounds = {
                width: options.width || 480,
                height: options.height || 600
            };
            
            // Physics settings
            this.gravity = options.gravity || PHYSICS_CONSTANTS.GRAVITY;
            this.terminalVelocity = options.terminalVelocity || PHYSICS_CONSTANTS.TERMINAL_VELOCITY;
            this.bounceDamping = options.bounceDamping || PHYSICS_CONSTANTS.BOUNCE_DAMPING;
            this.friction = options.friction || PHYSICS_CONSTANTS.FRICTION;
            
            // Performance optimization flags
            this.enableRotation = options.enableRotation !== false;
            this.enableSway = options.enableSway !== false;
            this.enableBounce = options.enableBounce !== false;
        }
        
        /**
         * Update canvas bounds
         * @param {number} width - Canvas width
         * @param {number} height - Canvas height
         */
        updateBounds(width, height) {
            this.bounds.width = width;
            this.bounds.height = height;
        }
        
        /**
         * Apply gravity to a velocity
         * @param {number} velocityY - Current Y velocity
         * @param {number} [gravityMultiplier=1] - Gravity multiplier
         * @returns {number} Updated Y velocity
         */
        applyGravity(velocityY, gravityMultiplier = 1) {
            const newVelocity = velocityY + (this.gravity * gravityMultiplier);
            return Math.min(newVelocity, this.terminalVelocity);
        }
        
        /**
         * Calculate position update with velocity
         * @param {Object} position - Current position {x, y}
         * @param {Object} velocity - Current velocity {x, y}
         * @param {number} [deltaTime=1] - Time delta
         * @returns {Object} New position {x, y}
         */
        updatePosition(position, velocity, deltaTime = 1) {
            return {
                x: position.x + (velocity.x * deltaTime),
                y: position.y + (velocity.y * deltaTime)
            };
        }
        
        /**
         * Apply horizontal sway motion
         * @param {number} baseX - Base X position
         * @param {number} time - Current time/frame
         * @param {number} swayFactor - Sway intensity factor
         * @returns {number} X position with sway applied
         */
        applySway(baseX, time, swayFactor = 1) {
            if (!this.enableSway) return baseX;
            
            const swayAmount = Math.sin(time * PHYSICS_CONSTANTS.SWAY_FREQUENCY + swayFactor * Math.PI) 
                              * PHYSICS_CONSTANTS.SWAY_AMPLITUDE;
            return baseX + swayAmount;
        }
        
        /**
         * Update rotation with angular velocity
         * @param {number} rotation - Current rotation in radians
         * @param {number} rotationSpeed - Angular velocity
         * @param {boolean} [applyDamping=false] - Apply rotation damping
         * @returns {Object} Updated rotation and speed
         */
        updateRotation(rotation, rotationSpeed, applyDamping = false) {
            if (!this.enableRotation) return { rotation: 0, rotationSpeed: 0 };
            
            const newRotation = rotation + rotationSpeed;
            const newSpeed = applyDamping 
                ? rotationSpeed * PHYSICS_CONSTANTS.ROTATION_DAMPING 
                : rotationSpeed;
            
            return {
                rotation: newRotation % (Math.PI * 2),
                rotationSpeed: Math.abs(newSpeed) < PHYSICS_CONSTANTS.MIN_VELOCITY ? 0 : newSpeed
            };
        }
        
        /**
         * Check if entity is within canvas bounds
         * @param {Object} entity - Entity with x, y, width, height properties
         * @param {Object} [customBounds] - Optional custom bounds
         * @returns {Object} Boundary check results
         */
        checkBounds(entity, customBounds) {
            const bounds = customBounds || this.bounds;
            const width = entity.width || entity.size || 0;
            const height = entity.height || entity.size || 0;
            
            const left = entity.x < 0;
            const right = entity.x + width > bounds.width;
            const top = entity.y < 0;
            const bottom = entity.y + height > bounds.height;
            const offScreenBottom = entity.y > bounds.height;
            const offScreenTop = entity.y + height < 0;
            
            return {
                inBounds: !left && !right && !top && !bottom,
                left,
                right,
                top,
                bottom,
                offScreenBottom,
                offScreenTop
            };
        }
        
        /**
         * Apply boundary collision with optional bounce
         * @param {Object} entity - Entity with position and velocity
         * @param {Object} boundaryCheck - Result from checkBounds
         * @returns {Object} Updated position and velocity
         */
        applyBoundaryCollision(entity, boundaryCheck) {
            const result = {
                x: entity.x,
                y: entity.y,
                vx: entity.vx || 0,
                vy: entity.vy || 0,
                bounced: false
            };
            
            // Left boundary
            if (boundaryCheck.left) {
                result.x = 0;
                if (this.enableBounce) {
                    result.vx = Math.abs(result.vx) * this.bounceDamping;
                    result.bounced = true;
                } else {
                    result.vx = 0;
                }
            }
            
            // Right boundary
            if (boundaryCheck.right) {
                result.x = this.bounds.width - entity.width;
                if (this.enableBounce) {
                    result.vx = -Math.abs(result.vx) * this.bounceDamping;
                    result.bounced = true;
                } else {
                    result.vx = 0;
                }
            }
            
            // Bottom boundary (ground)
            if (boundaryCheck.bottom && entity.vy > 0) {
                result.y = this.bounds.height - entity.height;
                if (this.enableBounce) {
                    result.vy = -Math.abs(result.vy) * this.bounceDamping;
                    result.vx *= this.friction;
                    result.bounced = true;
                    
                    // Stop tiny bounces
                    if (Math.abs(result.vy) < PHYSICS_CONSTANTS.MIN_VELOCITY) {
                        result.vy = 0;
                    }
                } else {
                    result.vy = 0;
                }
            }
            
            return result;
        }
        
        /**
         * Circle-circle collision detection
         * @param {Object} circle1 - First circle {x, y, radius}
         * @param {Object} circle2 - Second circle {x, y, radius}
         * @returns {boolean} True if circles collide
         */
        checkCircleCollision(circle1, circle2) {
            const dx = circle1.x - circle2.x;
            const dy = circle1.y - circle2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < circle1.radius + circle2.radius;
        }
        
        /**
         * Point-circle collision detection
         * @param {number} pointX - Point X coordinate
         * @param {number} pointY - Point Y coordinate
         * @param {Object} circle - Circle {x, y, radius}
         * @returns {boolean} True if point is inside circle
         */
        checkPointCircleCollision(pointX, pointY, circle) {
            const dx = pointX - circle.x;
            const dy = pointY - circle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance <= circle.radius;
        }
        
        /**
         * Rectangle-rectangle collision detection
         * @param {Object} rect1 - First rectangle {x, y, width, height}
         * @param {Object} rect2 - Second rectangle {x, y, width, height}
         * @returns {boolean} True if rectangles collide
         */
        checkRectCollision(rect1, rect2) {
            return rect1.x < rect2.x + rect2.width &&
                   rect1.x + rect1.width > rect2.x &&
                   rect1.y < rect2.y + rect2.height &&
                   rect1.y + rect1.height > rect2.y;
        }
        
        /**
         * Point-rectangle collision detection
         * @param {number} pointX - Point X coordinate
         * @param {number} pointY - Point Y coordinate
         * @param {Object} rect - Rectangle {x, y, width, height}
         * @returns {boolean} True if point is inside rectangle
         */
        checkPointRectCollision(pointX, pointY, rect) {
            return pointX >= rect.x && 
                   pointX <= rect.x + rect.width &&
                   pointY >= rect.y && 
                   pointY <= rect.y + rect.height;
        }
        
        /**
         * Check if a click/tap hits an entity (with size/radius)
         * @param {number} clickX - Click X coordinate
         * @param {number} clickY - Click Y coordinate
         * @param {Object} entity - Entity to check
         * @returns {boolean} True if click hits entity
         */
        isClicked(clickX, clickY, entity) {
            // Handle circular entities
            if (entity.radius !== undefined) {
                const centerX = entity.x + (entity.size || entity.radius * 2) / 2;
                const centerY = entity.y + (entity.size || entity.radius * 2) / 2;
                return this.checkPointCircleCollision(clickX, clickY, {
                    x: centerX,
                    y: centerY,
                    radius: entity.radius
                });
            }
            
            // Handle rectangular entities
            if (entity.width !== undefined && entity.height !== undefined) {
                return this.checkPointRectCollision(clickX, clickY, entity);
            }
            
            // Handle entities with size property (assumed square)
            if (entity.size !== undefined) {
                return this.checkPointRectCollision(clickX, clickY, {
                    x: entity.x,
                    y: entity.y,
                    width: entity.size,
                    height: entity.size
                });
            }
            
            return false;
        }
        
        /**
         * Calculate distance between two points
         * @param {number} x1 - First point X
         * @param {number} y1 - First point Y
         * @param {number} x2 - Second point X
         * @param {number} y2 - Second point Y
         * @returns {number} Distance between points
         */
        distance(x1, y1, x2, y2) {
            const dx = x2 - x1;
            const dy = y2 - y1;
            return Math.sqrt(dx * dx + dy * dy);
        }
        
        /**
         * Calculate angle between two points
         * @param {number} x1 - First point X
         * @param {number} y1 - First point Y
         * @param {number} x2 - Second point X
         * @param {number} y2 - Second point Y
         * @returns {number} Angle in radians
         */
        angle(x1, y1, x2, y2) {
            return Math.atan2(y2 - y1, x2 - x1);
        }
        
        /**
         * Normalize a vector
         * @param {number} x - Vector X component
         * @param {number} y - Vector Y component
         * @returns {Object} Normalized vector {x, y}
         */
        normalize(x, y) {
            const magnitude = Math.sqrt(x * x + y * y);
            
            if (magnitude === 0) {
                return { x: 0, y: 0 };
            }
            
            return {
                x: x / magnitude,
                y: y / magnitude
            };
        }
        
        /**
         * Apply physics update to an entity
         * @param {Object} entity - Entity with physics properties
         * @param {number} deltaTime - Time delta
         * @param {Object} [options] - Additional options
         * @returns {Object} Updated entity physics
         */
        updateEntity(entity, deltaTime = 1, options = {}) {
            const result = {
                x: entity.x,
                y: entity.y,
                vx: entity.vx || 0,
                vy: entity.vy || 0,
                rotation: entity.rotation || 0,
                rotationSpeed: entity.rotationSpeed || 0
            };
            
            // Apply gravity if entity has gravity enabled
            if (entity.hasGravity !== false && !options.disableGravity) {
                result.vy = this.applyGravity(
                    result.vy, 
                    entity.gravityMultiplier || 1
                );
            }
            
            // Update position
            const newPosition = this.updatePosition(
                { x: result.x, y: result.y },
                { x: result.vx, y: result.vy },
                deltaTime
            );
            result.x = newPosition.x;
            result.y = newPosition.y;
            
            // Apply sway if enabled
            if (entity.sway !== undefined && this.enableSway) {
                result.x = this.applySway(result.x, options.time || 0, entity.sway);
            }
            
            // Update rotation
            if (this.enableRotation) {
                const rotationUpdate = this.updateRotation(
                    result.rotation,
                    result.rotationSpeed,
                    entity.rotationDamping || false
                );
                result.rotation = rotationUpdate.rotation;
                result.rotationSpeed = rotationUpdate.rotationSpeed;
            }
            
            // Check boundaries
            const boundaryCheck = this.checkBounds({
                x: result.x,
                y: result.y,
                width: entity.width || entity.size || 0,
                height: entity.height || entity.size || 0
            });
            
            // Apply boundary collision if needed
            if (!boundaryCheck.inBounds && entity.bounceOnBounds) {
                const collision = this.applyBoundaryCollision(
                    {
                        x: result.x,
                        y: result.y,
                        vx: result.vx,
                        vy: result.vy,
                        width: entity.width || entity.size || 0,
                        height: entity.height || entity.size || 0
                    },
                    boundaryCheck
                );
                
                result.x = collision.x;
                result.y = collision.y;
                result.vx = collision.vx;
                result.vy = collision.vy;
                result.bounced = collision.bounced;
            }
            
            result.offScreen = boundaryCheck.offScreenBottom || boundaryCheck.offScreenTop;
            result.boundaryCheck = boundaryCheck;
            
            return result;
        }
        
        /**
         * Predict future position of an entity
         * @param {Object} entity - Entity with physics properties
         * @param {number} steps - Number of physics steps to predict
         * @param {number} [deltaTime=1] - Time delta per step
         * @returns {Object} Predicted position {x, y}
         */
        predictPosition(entity, steps, deltaTime = 1) {
            let x = entity.x;
            let y = entity.y;
            let vx = entity.vx || 0;
            let vy = entity.vy || 0;
            
            for (let i = 0; i < steps; i++) {
                // Apply gravity
                if (entity.hasGravity !== false) {
                    vy = this.applyGravity(vy, entity.gravityMultiplier || 1);
                }
                
                // Update position
                x += vx * deltaTime;
                y += vy * deltaTime;
            }
            
            return { x, y };
        }
        
        /**
         * Calculate intercept point for moving targets
         * @param {Object} shooter - Shooter position {x, y}
         * @param {Object} target - Target with position and velocity {x, y, vx, vy}
         * @param {number} projectileSpeed - Speed of projectile
         * @returns {Object|null} Intercept point {x, y} or null if no intercept
         */
        calculateIntercept(shooter, target, projectileSpeed) {
            const dx = target.x - shooter.x;
            const dy = target.y - shooter.y;
            const vx = target.vx || 0;
            const vy = target.vy || 0;
            
            // Quadratic equation coefficients
            const a = vx * vx + vy * vy - projectileSpeed * projectileSpeed;
            const b = 2 * (dx * vx + dy * vy);
            const c = dx * dx + dy * dy;
            
            const discriminant = b * b - 4 * a * c;
            
            if (discriminant < 0) return null;
            
            const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            
            const t = (t1 > 0 && t2 > 0) ? Math.min(t1, t2) : Math.max(t1, t2);
            
            if (t < 0) return null;
            
            return {
                x: target.x + vx * t,
                y: target.y + vy * t,
                time: t
            };
        }
    }

    // Export singleton instance for convenience
    new PhysicsSystem();

    /**
     * Mathematical Utilities
     * 
     * Common mathematical functions and utilities used throughout the game.
     * Includes physics calculations, random number generation, and geometric functions.
     */


    /**
     * Generate random number between min and max (inclusive)
     * Alias for random.between for backward compatibility
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random number
     */
    function randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Performance optimization utilities
     */
    ({
        /**
         * Pre-calculated sine values for performance
         */
        sinTable: Array.from({ length: 360 }, (_, i) => Math.sin(i * Math.PI / 180)),
        
        /**
         * Pre-calculated cosine values for performance
         */
        cosTable: Array.from({ length: 360 }, (_, i) => Math.cos(i * Math.PI / 180))});

    /**
     * Object Pool Utility
     * 
     * Manages pools of reusable objects to reduce garbage collection pressure
     * and improve performance, especially on mobile devices.
     */

    class ObjectPool {
        /**
         * Create a new object pool
         * @param {Function} createFn - Function to create new objects
         * @param {Function} resetFn - Function to reset objects for reuse
         * @param {number} initialSize - Initial pool size
         * @param {number} maxSize - Maximum pool size
         */
        constructor(createFn, resetFn, initialSize = 10, maxSize = 100) {
            this.createFn = createFn;
            this.resetFn = resetFn;
            this.maxSize = maxSize;
            this.pool = [];
            this.activeCount = 0;
            this.totalCreated = 0;
            this.totalReused = 0;
            
            // Pre-populate pool
            for (let i = 0; i < initialSize; i++) {
                this.pool.push(this.createFn());
                this.totalCreated++;
            }
        }
        
        /**
         * Get an object from the pool
         * @param {...any} args - Arguments to pass to reset function
         * @returns {any} Pooled object
         */
        get(...args) {
            let obj;
            
            if (this.pool.length > 0) {
                obj = this.pool.pop();
                this.totalReused++;
            } else {
                obj = this.createFn();
                this.totalCreated++;
            }
            
            // Reset object for reuse
            if (this.resetFn) {
                this.resetFn(obj, ...args);
            }
            
            this.activeCount++;
            return obj;
        }
        
        /**
         * Release an object back to the pool
         * @param {any} obj - Object to release
         */
        release(obj) {
            if (!obj) return;
            
            // Don't exceed max pool size
            if (this.pool.length < this.maxSize) {
                this.pool.push(obj);
            }
            
            this.activeCount = Math.max(0, this.activeCount - 1);
        }
        
        /**
         * Release multiple objects at once
         * @param {Array} objects - Array of objects to release
         */
        releaseAll(objects) {
            objects.forEach(obj => this.release(obj));
        }
        
        /**
         * Clear the pool and reset statistics
         */
        clear() {
            this.pool.length = 0;
            this.activeCount = 0;
            this.totalCreated = 0;
            this.totalReused = 0;
        }
        
        /**
         * Get pool statistics
         * @returns {object} Pool statistics
         */
        getStats() {
            return {
                poolSize: this.pool.length,
                activeCount: this.activeCount,
                totalCreated: this.totalCreated,
                totalReused: this.totalReused,
                reuseRatio: this.totalCreated > 0 ? (this.totalReused / this.totalCreated) : 0,
                maxSize: this.maxSize
            };
        }
        
        /**
         * Check if pool is healthy (not creating too many new objects)
         * @returns {boolean} True if pool is performing well
         */
        isHealthy() {
            const stats = this.getStats();
            return stats.reuseRatio > 0.5; // At least 50% reuse rate
        }
        
        /**
         * Resize the pool
         * @param {number} newMaxSize - New maximum size
         */
        resize(newMaxSize) {
            this.maxSize = newMaxSize;
            
            // Trim pool if it's now too large
            while (this.pool.length > this.maxSize) {
                this.pool.pop();
            }
        }
        
        /**
         * Pre-warm the pool with objects
         * @param {number} count - Number of objects to create
         */
        preWarm(count) {
            for (let i = 0; i < count && this.pool.length < this.maxSize; i++) {
                this.pool.push(this.createFn());
                this.totalCreated++;
            }
        }
    }

    /**
     * Pool Manager for managing multiple object pools
     */
    class PoolManager {
        constructor() {
            this.pools = new Map();
        }
        
        /**
         * Create a new pool
         * @param {string} name - Pool name
         * @param {Function} createFn - Function to create new objects
         * @param {Function} resetFn - Function to reset objects
         * @param {number} initialSize - Initial pool size
         * @param {number} maxSize - Maximum pool size
         */
        createPool(name, createFn, resetFn, initialSize = 10, maxSize = 100) {
            const pool = new ObjectPool(createFn, resetFn, initialSize, maxSize);
            this.pools.set(name, pool);
            return pool;
        }
        
        /**
         * Get a pool by name
         * @param {string} name - Pool name
         * @returns {ObjectPool} The pool
         */
        getPool(name) {
            return this.pools.get(name);
        }
        
        /**
         * Get an object from a named pool
         * @param {string} poolName - Pool name
         * @param {...any} args - Arguments for reset function
         * @returns {any} Pooled object
         */
        get(poolName, ...args) {
            const pool = this.pools.get(poolName);
            return pool ? pool.get(...args) : null;
        }
        
        /**
         * Release an object to a named pool
         * @param {string} poolName - Pool name
         * @param {any} obj - Object to release
         */
        release(poolName, obj) {
            const pool = this.pools.get(poolName);
            if (pool) {
                pool.release(obj);
            }
        }
        
        /**
         * Get statistics for all pools
         * @returns {object} Statistics for all pools
         */
        getStats() {
            const stats = {};
            for (const [name, pool] of this.pools) {
                stats[name] = pool.getStats();
            }
            return stats;
        }
        
        /**
         * Clear all pools
         */
        clearAll() {
            for (const pool of this.pools.values()) {
                pool.clear();
            }
        }
        
        /**
         * Check if all pools are healthy
         * @returns {boolean} True if all pools are performing well
         */
        areAllPoolsHealthy() {
            for (const pool of this.pools.values()) {
                if (!pool.isHealthy()) {
                    return false;
                }
            }
            return true;
        }
        
        /**
         * Get total memory savings estimate
         * @returns {object} Memory savings information
         */
        getMemorySavings() {
            let totalReused = 0;
            let totalCreated = 0;
            
            for (const pool of this.pools.values()) {
                const stats = pool.getStats();
                totalReused += stats.totalReused;
                totalCreated += stats.totalCreated;
            }
            
            return {
                objectsReused: totalReused,
                objectsCreated: totalCreated,
                savings: totalCreated > 0 ? (totalReused / totalCreated) : 0
            };
        }
    }

    /**
     * Performance Monitor
     * 
     * Monitors frame rate and performance metrics to enable adaptive quality
     * and provide insights into performance bottlenecks for mobile optimization.
     */

    class PerformanceMonitor {
        constructor(options = {}) {
            this.enabled = options.enabled !== false;
            this.sampleSize = options.sampleSize || 60; // Track last 60 frames
            this.targetFPS = options.targetFPS || 60;
            this.lowFPSThreshold = options.lowFPSThreshold || 45;
            this.criticalFPSThreshold = options.criticalFPSThreshold || 30;
            
            // Frame timing arrays
            this.frameTimes = [];
            this.lastFrameTime = 0;
            this.frameCount = 0;
            
            // Performance statistics
            this.stats = {
                currentFPS: 60,
                averageFPS: 60,
                minFPS: 60,
                maxFPS: 60,
                frameTimeMS: 16.67,
                droppedFrames: 0,
                performanceLevel: 'high' // high, medium, low, critical
            };
            
            // Performance level history for stability
            this.performanceLevels = [];
            this.levelChangeDelay = options.levelChangeDelay || 120; // Frames to wait before changing level
            
            // Quality settings per performance level
            this.qualitySettings = {
                high: {
                    maxParticles: 200,
                    enableShadows: true,
                    enableTextures: true,
                    enableEffects: true,
                    particleDetail: 1.0,
                    renderScale: 1.0
                },
                medium: {
                    maxParticles: 100,
                    enableShadows: true,
                    enableTextures: true,
                    enableEffects: true,
                    particleDetail: 0.8,
                    renderScale: 1.0
                },
                low: {
                    maxParticles: 50,
                    enableShadows: false,
                    enableTextures: false,
                    enableEffects: true,
                    particleDetail: 0.6,
                    renderScale: 0.9
                },
                critical: {
                    maxParticles: 25,
                    enableShadows: false,
                    enableTextures: false,
                    enableEffects: false,
                    particleDetail: 0.4,
                    renderScale: 0.8
                }
            };
            
            // Event callbacks
            this.callbacks = {
                performanceLevelChanged: [],
                frameDropDetected: [],
                statsUpdated: []
            };
            
            // Debug mode
            this.debugMode = options.debugMode || false;
        }
        
        /**
         * Start monitoring (call once per frame)
         * @param {number} currentTime - Current timestamp
         */
        update(currentTime) {
            if (!this.enabled) return;
            
            if (this.lastFrameTime === 0) {
                this.lastFrameTime = currentTime;
                return;
            }
            
            const frameTime = currentTime - this.lastFrameTime;
            this.lastFrameTime = currentTime;
            this.frameCount++;
            
            // Add frame time to samples
            this.frameTimes.push(frameTime);
            if (this.frameTimes.length > this.sampleSize) {
                this.frameTimes.shift();
            }
            
            // Update statistics
            this.updateStats();
            
            // Check for performance level changes
            this.checkPerformanceLevel();
            
            // Emit callbacks
            this.emit('statsUpdated', this.stats);
        }
        
        /**
         * Update performance statistics
         */
        updateStats() {
            if (this.frameTimes.length === 0) return;
            
            const times = this.frameTimes;
            const frameTimeMS = times[times.length - 1];
            
            // Calculate FPS metrics
            const currentFPS = Math.min(1000 / frameTimeMS, this.targetFPS);
            const averageFrameTime = times.reduce((sum, time) => sum + time, 0) / times.length;
            const averageFPS = Math.min(1000 / averageFrameTime, this.targetFPS);
            const minFPS = Math.min(1000 / Math.max(...times), this.targetFPS);
            const maxFPS = Math.min(1000 / Math.min(...times), this.targetFPS);
            
            // Count dropped frames (frames longer than target)
            const targetFrameTime = 1000 / this.targetFPS;
            const droppedFrames = times.filter(time => time > targetFrameTime * 1.5).length;
            
            this.stats = {
                currentFPS: Math.round(currentFPS * 10) / 10,
                averageFPS: Math.round(averageFPS * 10) / 10,
                minFPS: Math.round(minFPS * 10) / 10,
                maxFPS: Math.round(maxFPS * 10) / 10,
                frameTimeMS: Math.round(frameTimeMS * 100) / 100,
                droppedFrames,
                performanceLevel: this.stats.performanceLevel
            };
            
            // Detect frame drops
            if (frameTimeMS > targetFrameTime * 2) {
                this.emit('frameDropDetected', { frameTime: frameTimeMS, targetTime: targetFrameTime });
            }
        }
        
        /**
         * Check if performance level should change
         */
        checkPerformanceLevel() {
            let newLevel = this.determinePerformanceLevel();
            
            // Add to history
            this.performanceLevels.push(newLevel);
            if (this.performanceLevels.length > this.levelChangeDelay) {
                this.performanceLevels.shift();
            }
            
            // Only change level if it's been consistent
            if (this.performanceLevels.length >= this.levelChangeDelay) {
                const recentLevels = this.performanceLevels.slice(-30); // Last 30 frames
                const levelCounts = {};
                
                recentLevels.forEach(level => {
                    levelCounts[level] = (levelCounts[level] || 0) + 1;
                });
                
                // Find most common level
                const dominantLevel = Object.keys(levelCounts).reduce((a, b) => 
                    levelCounts[a] > levelCounts[b] ? a : b
                );
                
                if (dominantLevel !== this.stats.performanceLevel) {
                    const oldLevel = this.stats.performanceLevel;
                    this.stats.performanceLevel = dominantLevel;
                    
                    if (this.debugMode) {
                        console.log(\`Performance level changed: \${oldLevel} → \${dominantLevel}\`);
                    }
                    
                    this.emit('performanceLevelChanged', {
                        oldLevel,
                        newLevel: dominantLevel,
                        settings: this.getQualitySettings()
                    });
                }
            }
        }
        
        /**
         * Determine appropriate performance level based on current metrics
         * @returns {string} Performance level
         */
        determinePerformanceLevel() {
            const { averageFPS, droppedFrames } = this.stats;
            const dropRate = droppedFrames / this.sampleSize;
            
            if (averageFPS >= this.targetFPS * 0.9 && dropRate < 0.1) {
                return 'high';
            } else if (averageFPS >= this.lowFPSThreshold && dropRate < 0.2) {
                return 'medium';
            } else if (averageFPS >= this.criticalFPSThreshold && dropRate < 0.4) {
                return 'low';
            } else {
                return 'critical';
            }
        }
        
        /**
         * Get current quality settings
         * @returns {object} Quality settings for current performance level
         */
        getQualitySettings() {
            return { ...this.qualitySettings[this.stats.performanceLevel] };
        }
        
        /**
         * Get performance statistics
         * @returns {object} Current performance stats
         */
        getStats() {
            return { ...this.stats };
        }
        
        /**
         * Check if performance is acceptable
         * @returns {boolean} True if performance is good
         */
        isPerformanceGood() {
            return this.stats.averageFPS >= this.lowFPSThreshold && 
                   this.stats.droppedFrames / this.sampleSize < 0.2;
        }
        
        /**
         * Check if performance is critical
         * @returns {boolean} True if performance is critically poor
         */
        isPerformanceCritical() {
            return this.stats.performanceLevel === 'critical';
        }
        
        /**
         * Force a specific performance level
         * @param {string} level - Performance level to set
         */
        setPerformanceLevel(level) {
            if (this.qualitySettings[level]) {
                const oldLevel = this.stats.performanceLevel;
                this.stats.performanceLevel = level;
                
                // Clear history to prevent immediate reversion
                this.performanceLevels = new Array(this.levelChangeDelay).fill(level);
                
                this.emit('performanceLevelChanged', {
                    oldLevel,
                    newLevel: level,
                    settings: this.getQualitySettings(),
                    forced: true
                });
            }
        }
        
        /**
         * Reset performance monitoring
         */
        reset() {
            this.frameTimes = [];
            this.lastFrameTime = 0;
            this.frameCount = 0;
            this.performanceLevels = [];
            this.stats = {
                currentFPS: 60,
                averageFPS: 60,
                minFPS: 60,
                maxFPS: 60,
                frameTimeMS: 16.67,
                droppedFrames: 0,
                performanceLevel: 'high'
            };
        }
        
        /**
         * Enable/disable monitoring
         * @param {boolean} enabled - Whether to enable monitoring
         */
        setEnabled(enabled) {
            this.enabled = enabled;
            if (!enabled) {
                this.reset();
            }
        }
        
        /**
         * Set debug mode
         * @param {boolean} debug - Whether to enable debug logging
         */
        setDebugMode(debug) {
            this.debugMode = debug;
        }
        
        /**
         * Add event listener
         * @param {string} event - Event name
         * @param {Function} callback - Callback function
         */
        on(event, callback) {
            if (this.callbacks[event]) {
                this.callbacks[event].push(callback);
            }
        }
        
        /**
         * Remove event listener
         * @param {string} event - Event name
         * @param {Function} callback - Callback function to remove
         */
        off(event, callback) {
            if (this.callbacks[event]) {
                const index = this.callbacks[event].indexOf(callback);
                if (index > -1) {
                    this.callbacks[event].splice(index, 1);
                }
            }
        }
        
        /**
         * Emit event to listeners
         * @param {string} event - Event name
         * @param {any} data - Event data
         */
        emit(event, data) {
            if (this.callbacks[event]) {
                this.callbacks[event].forEach(callback => {
                    try {
                        callback(data);
                    } catch (error) {
                        console.error(\`Error in performance monitor \${event} callback:\`, error);
                    }
                });
            }
        }
        
        /**
         * Get performance report
         * @returns {object} Detailed performance report
         */
        getReport() {
            return {
                enabled: this.enabled,
                frameCount: this.frameCount,
                stats: this.getStats(),
                qualitySettings: this.getQualitySettings(),
                isHealthy: this.isPerformanceGood(),
                isCritical: this.isPerformanceCritical(),
                sampleSize: this.frameTimes.length,
                targetFPS: this.targetFPS
            };
        }
    }

    /**
     * Performance UI Display
     * 
     * Creates a real-time performance monitoring overlay for debugging and optimization.
     * Shows FPS, object pool stats, quality level, and detailed performance metrics.
     */

    class PerformanceUI {
        constructor(options = {}) {
            this.enabled = options.enabled || false;
            this.position = options.position || 'top-left'; // top-left, top-right, bottom-left, bottom-right
            this.updateInterval = options.updateInterval || 250; // ms
            this.maxHistory = options.maxHistory || 100;
            
            // UI elements
            this.container = null;
            this.elements = {};
            
            // Performance data
            this.performanceMonitor = null;
            this.poolManager = null;
            this.fpsHistory = [];
            this.lastUpdate = 0;
            
            // Display options
            this.showFPS = options.showFPS !== false;
            this.showPools = options.showPools !== false;
            this.showQuality = options.showQuality !== false;
            this.showDetails = options.showDetails || false;
            this.showGraph = options.showGraph || false;
            
            if (this.enabled) {
                this.createUI();
            }
        }
        
        /**
         * Initialize with performance monitor and pool manager
         * @param {PerformanceMonitor} performanceMonitor - Performance monitoring system
         * @param {PoolManager} poolManager - Object pool manager
         */
        init(performanceMonitor, poolManager) {
            this.performanceMonitor = performanceMonitor;
            this.poolManager = poolManager;
        }
        
        /**
         * Create the UI overlay
         */
        createUI() {
            // Create container
            this.container = document.createElement('div');
            this.container.id = 'performance-ui';
            this.container.style.cssText = this.getContainerStyles();
            
            // Create sections
            if (this.showFPS) {
                this.createFPSSection();
            }
            
            if (this.showQuality) {
                this.createQualitySection();
            }
            
            if (this.showPools) {
                this.createPoolsSection();
            }
            
            if (this.showDetails) {
                this.createDetailsSection();
            }
            
            if (this.showGraph) {
                this.createGraphSection();
            }
            
            // Add toggle button
            this.createToggleButton();
            
            document.body.appendChild(this.container);
        }
        
        /**
         * Helper function to create elements safely
         */
        createElement(tag, className = null, textContent = null) {
            const element = document.createElement(tag);
            if (className) element.className = className;
            if (textContent) element.textContent = textContent;
            return element;
        }
        
        /**
         * Helper function to create labeled value element
         */
        createLabeledValue(label, id) {
            const container = document.createElement('div');
            container.textContent = label + ': ';
            const span = document.createElement('span');
            span.id = id;
            span.textContent = '--';
            container.appendChild(span);
            return container;
        }
        
        /**
         * Get container CSS styles based on position
         */
        getContainerStyles() {
            const baseStyles = \`
            position: fixed;
            z-index: 10000;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            padding: 10px;
            border-radius: 5px;
            min-width: 200px;
            max-width: 300px;
            backdrop-filter: blur(5px);
        \`;
            
            const positions = {
                'top-left': 'top: 10px; left: 10px;',
                'top-right': 'top: 10px; right: 10px;',
                'bottom-left': 'bottom: 10px; left: 10px;',
                'bottom-right': 'bottom: 10px; right: 10px;'
            };
            
            return baseStyles + positions[this.position];
        }
        
        /**
         * Create FPS display section
         */
        createFPSSection() {
            const section = document.createElement('div');
            
            // Create title
            const title = this.createElement('div');
            title.style.fontWeight = 'bold';
            title.style.marginBottom = '5px';
            title.textContent = '🎯 Performance';
            section.appendChild(title);
            
            // Create metric elements
            section.appendChild(this.createLabeledValue('FPS', 'perf-fps'));
            section.appendChild(this.createLabeledValue('Avg', 'perf-avg-fps'));
            section.appendChild(this.createLabeledValue('Min', 'perf-min-fps'));
            
            const frameDiv = this.createLabeledValue('Frame', 'perf-frame-time');
            frameDiv.appendChild(document.createTextNode('ms'));
            section.appendChild(frameDiv);
            
            section.appendChild(this.createLabeledValue('Drops', 'perf-drops'));
            
            this.container.appendChild(section);
            
            // Store element references
            this.elements.fps = document.getElementById('perf-fps');
            this.elements.avgFps = document.getElementById('perf-avg-fps');
            this.elements.minFps = document.getElementById('perf-min-fps');
            this.elements.frameTime = document.getElementById('perf-frame-time');
            this.elements.drops = document.getElementById('perf-drops');
        }
        
        /**
         * Create quality level section
         */
        createQualitySection() {
            const section = document.createElement('div');
            section.style.marginTop = '10px';
            
            // Create title
            const title = this.createElement('div');
            title.style.fontWeight = 'bold';
            title.style.marginBottom = '5px';
            title.textContent = '⚙️ Quality';
            section.appendChild(title);
            
            // Create metric elements
            section.appendChild(this.createLabeledValue('Level', 'perf-quality-level'));
            section.appendChild(this.createLabeledValue('Particles', 'perf-max-particles'));
            section.appendChild(this.createLabeledValue('Shadows', 'perf-shadows'));
            section.appendChild(this.createLabeledValue('Effects', 'perf-effects'));
            
            this.container.appendChild(section);
            
            this.elements.qualityLevel = document.getElementById('perf-quality-level');
            this.elements.maxParticles = document.getElementById('perf-max-particles');
            this.elements.shadows = document.getElementById('perf-shadows');
            this.elements.effects = document.getElementById('perf-effects');
        }
        
        /**
         * Create object pools section
         */
        createPoolsSection() {
            const section = document.createElement('div');
            section.style.marginTop = '10px';
            
            // Create title
            const title = this.createElement('div');
            title.style.fontWeight = 'bold';
            title.style.marginBottom = '5px';
            title.textContent = '🎱 Object Pools';
            section.appendChild(title);
            
            // Create content container
            const content = document.createElement('div');
            content.id = 'perf-pools-content';
            section.appendChild(content);
            
            this.container.appendChild(section);
            this.elements.poolsContent = document.getElementById('perf-pools-content');
        }
        
        /**
         * Create detailed metrics section
         */
        createDetailsSection() {
            const section = document.createElement('div');
            section.style.marginTop = '10px';
            
            // Create title
            const title = this.createElement('div');
            title.style.fontWeight = 'bold';
            title.style.marginBottom = '5px';
            title.textContent = '📊 Details';
            section.appendChild(title);
            
            // Create metric elements
            section.appendChild(this.createLabeledValue('Memory', 'perf-memory'));
            section.appendChild(this.createLabeledValue('Entities', 'perf-entities'));
            section.appendChild(this.createLabeledValue('Draw Calls', 'perf-draw-calls'));
            section.appendChild(this.createLabeledValue('Performance', 'perf-health'));
            
            this.container.appendChild(section);
            
            this.elements.memory = document.getElementById('perf-memory');
            this.elements.entities = document.getElementById('perf-entities');
            this.elements.drawCalls = document.getElementById('perf-draw-calls');
            this.elements.health = document.getElementById('perf-health');
        }
        
        /**
         * Create FPS graph section
         */
        createGraphSection() {
            const section = document.createElement('div');
            section.style.marginTop = '10px';
            
            // Create title
            const title = this.createElement('div');
            title.style.fontWeight = 'bold';
            title.style.marginBottom = '5px';
            title.textContent = '📈 FPS Graph';
            section.appendChild(title);
            
            // Create canvas
            const canvas = document.createElement('canvas');
            canvas.id = 'perf-graph';
            canvas.width = 180;
            canvas.height = 50;
            canvas.style.background = 'rgba(255,255,255,0.1)';
            canvas.style.borderRadius = '3px';
            section.appendChild(canvas);
            
            this.container.appendChild(section);
            this.elements.graph = document.getElementById('perf-graph');
            this.graphCtx = this.elements.graph.getContext('2d');
        }
        
        /**
         * Create toggle button
         */
        createToggleButton() {
            const button = document.createElement('button');
            button.textContent = '👁️';
            button.style.cssText = \`
            position: absolute;
            top: -5px;
            right: -5px;
            width: 20px;
            height: 20px;
            border: none;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            font-size: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        \`;
            
            button.onclick = () => this.toggle();
            this.container.appendChild(button);
        }
        
        /**
         * Update performance display
         * @param {number} currentTime - Current timestamp
         * @param {object} gameData - Additional game data (entities, etc.)
         */
        update(currentTime, gameData = {}) {
            if (!this.enabled || !this.container || !this.performanceMonitor) return;
            
            // Throttle updates
            if (currentTime - this.lastUpdate < this.updateInterval) return;
            this.lastUpdate = currentTime;
            
            const stats = this.performanceMonitor.getStats();
            const qualitySettings = this.performanceMonitor.getQualitySettings();
            
            // Update FPS data
            if (this.showFPS) {
                this.updateFPSDisplay(stats);
            }
            
            // Update quality data
            if (this.showQuality) {
                this.updateQualityDisplay(stats, qualitySettings);
            }
            
            // Update pool data
            if (this.showPools && this.poolManager) {
                this.updatePoolsDisplay();
            }
            
            // Update detailed metrics
            if (this.showDetails) {
                this.updateDetailsDisplay(stats, gameData);
            }
            
            // Update graph
            if (this.showGraph) {
                this.updateGraph(stats.currentFPS);
            }
        }
        
        /**
         * Update FPS display elements
         */
        updateFPSDisplay(stats) {
            if (this.elements.fps) {
                this.elements.fps.textContent = stats.currentFPS.toFixed(1);
                this.elements.fps.style.color = this.getFPSColor(stats.currentFPS);
            }
            
            if (this.elements.avgFps) {
                this.elements.avgFps.textContent = stats.averageFPS.toFixed(1);
            }
            
            if (this.elements.minFps) {
                this.elements.minFps.textContent = stats.minFPS.toFixed(1);
            }
            
            if (this.elements.frameTime) {
                this.elements.frameTime.textContent = stats.frameTimeMS.toFixed(2);
            }
            
            if (this.elements.drops) {
                this.elements.drops.textContent = stats.droppedFrames;
                this.elements.drops.style.color = stats.droppedFrames > 5 ? '#ff6b6b' : '#51cf66';
            }
        }
        
        /**
         * Update quality display elements
         */
        updateQualityDisplay(stats, qualitySettings) {
            if (this.elements.qualityLevel) {
                this.elements.qualityLevel.textContent = stats.performanceLevel;
                this.elements.qualityLevel.style.color = this.getQualityColor(stats.performanceLevel);
            }
            
            if (this.elements.maxParticles) {
                this.elements.maxParticles.textContent = qualitySettings.maxParticles;
            }
            
            if (this.elements.shadows) {
                this.elements.shadows.textContent = qualitySettings.enableShadows ? '✅' : '❌';
            }
            
            if (this.elements.effects) {
                this.elements.effects.textContent = qualitySettings.enableEffects ? '✅' : '❌';
            }
        }
        
        /**
         * Update pools display
         */
        updatePoolsDisplay() {
            const poolStats = this.poolManager.getStats();
            
            if (this.elements.poolsContent) {
                // Clear existing content
                while (this.elements.poolsContent.firstChild) {
                    this.elements.poolsContent.removeChild(this.elements.poolsContent.firstChild);
                }
                
                // Create pool stat elements
                for (const [name, stats] of Object.entries(poolStats)) {
                    const utilization = ((stats.activeCount / (stats.poolSize + stats.activeCount)) * 100).toFixed(0);
                    const efficiency = (stats.reuseRatio * 100).toFixed(0);
                    
                    const poolDiv = document.createElement('div');
                    poolDiv.style.fontSize = '10px';
                    poolDiv.style.margin = '2px 0';
                    
                    const nameDiv = document.createElement('div');
                    nameDiv.textContent = \`\${name}: \${stats.activeCount}/\${stats.poolSize + stats.activeCount}\`;
                    poolDiv.appendChild(nameDiv);
                    
                    const statsDiv = document.createElement('div');
                    statsDiv.style.color = '#888';
                    statsDiv.textContent = \`Use: \${utilization}% | Reuse: \${efficiency}%\`;
                    poolDiv.appendChild(statsDiv);
                    
                    this.elements.poolsContent.appendChild(poolDiv);
                }
            }
        }
        
        /**
         * Update detailed metrics
         */
        updateDetailsDisplay(stats, gameData) {
            if (this.elements.memory && window.performance && window.performance.memory) {
                const mb = (window.performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1);
                this.elements.memory.textContent = \`\${mb}MB\`;
            }
            
            if (this.elements.entities) {
                const entityCount = (gameData.particles || []).length + 
                                  (gameData.ingredients || []).length + 
                                  (gameData.powerUps || []).length;
                this.elements.entities.textContent = entityCount;
            }
            
            if (this.elements.drawCalls && gameData.renderer) {
                const rendererStats = gameData.renderer.getStats();
                this.elements.drawCalls.textContent = rendererStats.drawCalls || '--';
            }
            
            if (this.elements.health) {
                const isHealthy = this.performanceMonitor.isPerformanceGood();
                this.elements.health.textContent = isHealthy ? '✅ Good' : '⚠️ Poor';
                this.elements.health.style.color = isHealthy ? '#51cf66' : '#ff6b6b';
            }
        }
        
        /**
         * Update FPS graph
         */
        updateGraph(currentFPS) {
            if (!this.graphCtx) return;
            
            this.fpsHistory.push(currentFPS);
            if (this.fpsHistory.length > this.maxHistory) {
                this.fpsHistory.shift();
            }
            
            // Clear canvas
            this.graphCtx.clearRect(0, 0, 180, 50);
            
            // Draw grid
            this.graphCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            this.graphCtx.lineWidth = 1;
            for (let i = 0; i <= 50; i += 10) {
                this.graphCtx.beginPath();
                this.graphCtx.moveTo(0, i);
                this.graphCtx.lineTo(180, i);
                this.graphCtx.stroke();
            }
            
            // Draw FPS line
            if (this.fpsHistory.length > 1) {
                this.graphCtx.strokeStyle = '#51cf66';
                this.graphCtx.lineWidth = 2;
                this.graphCtx.beginPath();
                
                for (let i = 0; i < this.fpsHistory.length; i++) {
                    const x = (i / this.fpsHistory.length) * 180;
                    const y = 50 - (this.fpsHistory[i] / 60) * 50; // Assume 60 FPS max
                    
                    if (i === 0) {
                        this.graphCtx.moveTo(x, y);
                    } else {
                        this.graphCtx.lineTo(x, y);
                    }
                }
                
                this.graphCtx.stroke();
            }
            
            // Draw 60 FPS reference line
            this.graphCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            this.graphCtx.lineWidth = 1;
            this.graphCtx.setLineDash([2, 2]);
            this.graphCtx.beginPath();
            this.graphCtx.moveTo(0, 0);
            this.graphCtx.lineTo(180, 0);
            this.graphCtx.stroke();
            this.graphCtx.setLineDash([]);
        }
        
        /**
         * Get color for FPS display
         */
        getFPSColor(fps) {
            if (fps >= 55) return '#51cf66'; // Green
            if (fps >= 45) return '#ffd43b'; // Yellow
            if (fps >= 30) return '#ff8c42'; // Orange
            return '#ff6b6b'; // Red
        }
        
        /**
         * Get color for quality level display
         */
        getQualityColor(level) {
            const colors = {
                'high': '#51cf66',
                'medium': '#ffd43b',
                'low': '#ff8c42',
                'critical': '#ff6b6b'
            };
            return colors[level] || '#ffffff';
        }
        
        /**
         * Toggle UI visibility
         */
        toggle() {
            if (this.container) {
                this.enabled = !this.enabled;
                this.container.style.display = this.enabled ? 'block' : 'none';
            }
        }
        
        /**
         * Show the UI
         */
        show() {
            this.enabled = true;
            if (this.container) {
                this.container.style.display = 'block';
            } else {
                this.createUI();
            }
        }
        
        /**
         * Hide the UI
         */
        hide() {
            this.enabled = false;
            if (this.container) {
                this.container.style.display = 'none';
            }
        }
        
        /**
         * Destroy the UI
         */
        destroy() {
            if (this.container) {
                this.container.remove();
                this.container = null;
            }
            this.elements = {};
        }
        
        /**
         * Set position of the UI
         * @param {string} position - New position (top-left, top-right, bottom-left, bottom-right)
         */
        setPosition(position) {
            this.position = position;
            if (this.container) {
                const styles = this.getContainerStyles();
                this.container.style.cssText = styles;
            }
        }
        
        /**
         * Configure which sections to show
         * @param {object} options - Display options
         */
        configure(options) {
            Object.assign(this, options);
            
            if (this.container) {
                this.container.remove();
                this.createUI();
            }
        }
    }

    /**
     * @fileoverview Main Game class that orchestrates all game systems and entities
     * Integrates all modular components to create the complete Burger Drop game experience
     */


    /**
     * Main Game class that manages the game loop and coordinates all systems
     */
    class Game {
        /**
         * Create a new game instance
         * @param {HTMLCanvasElement} canvas - The canvas element to render to
         * @param {Object} options - Game configuration options
         */
        constructor(canvas, options = {}) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            
            // Configuration
            this.config = {
                initialLives: 3,
                initialSpeed: 4,
                spawnRate: 40,
                maxOrders: 3,
                powerUpSpawnInterval: 900, // 15 seconds at 60fps
                difficultyIncreaseRate: 0.0001,
                ...options
            };
            
            // Initialize game state
            this.state = new GameState();
            this.state.core.lives = this.config.initialLives;
            
            // Add gameState property for compatibility
            this.gameState = 'menu';
            
            // Initialize systems
            this.audioSystem = new AudioSystem();
            this.renderer = new Renderer(this.canvas);
            this.inputSystem = new InputSystem(this.canvas);
            this.physicsSystem = new PhysicsSystem();
            this.performanceMonitor = new PerformanceMonitor({
                enabled: options.enablePerformanceMonitoring !== false,
                debugMode: options.debugPerformance || false
            });
            this.performanceUI = new PerformanceUI({
                enabled: options.showPerformanceUI || false,
                position: options.performanceUIPosition || 'top-right',
                showFPS: true,
                showPools: true,
                showQuality: true,
                showDetails: options.debugPerformance || false,
                showGraph: options.debugPerformance || false
            });
            
            // Entity arrays
            this.ingredients = [];
            this.orders = [];
            this.particles = [];
            this.powerUps = [];
            
            // Initialize object pools
            this.poolManager = new PoolManager();
            this.initializeObjectPools();
            
            // Game loop variables
            this.animationId = null;
            this.lastTime = 0;
            this.deltaTime = 0;
            this.frameCount = 0;
            this.isPaused = false;
            
            // Spawn timers
            this.lastSpawn = 0;
            this.lastPowerUpSpawn = 0;
            
            // Order templates
            this.orderTemplates = [
                { name: 'Classic Burger', ingredients: ['bun_bottom', 'patty', 'cheese', 'lettuce', 'tomato', 'bun_top'], time: 30 },
                { name: 'Simple Burger', ingredients: ['bun_bottom', 'patty', 'bun_top'], time: 20 },
                { name: 'Cheese Burger', ingredients: ['bun_bottom', 'patty', 'cheese', 'bun_top'], time: 25 },
                { name: 'Veggie Burger', ingredients: ['bun_bottom', 'lettuce', 'tomato', 'onion', 'pickle', 'bun_top'], time: 30 },
                { name: 'Bacon Burger', ingredients: ['bun_bottom', 'patty', 'bacon', 'cheese', 'bun_top'], time: 35 },
                { name: 'Breakfast Burger', ingredients: ['bun_bottom', 'patty', 'egg', 'bacon', 'cheese', 'bun_top'], time: 40 }
            ];
            
            // Bind methods
            this.update = this.update.bind(this);
            this.render = this.render.bind(this);
            this.gameLoop = this.gameLoop.bind(this);
            this.handleInput = this.handleInput.bind(this);
            
            // Setup input handlers
            this.setupInputHandlers();
            
            // Initialize renderer patterns
            this.renderer.initializePatterns();
            
            // Load high score
            this.loadHighScore();
        }
        
        /**
         * Initialize object pools for frequently created objects
         */
        initializeObjectPools() {
            // Particle pool for general particles
            this.poolManager.createPool('particle',
                Particle.createFactory(),
                Particle.resetParticle,
                50, // initial size
                200 // max size
            );
            
            // Celebration particle pool (for special effects)
            this.poolManager.createPool('celebrationParticle',
                Particle.createFactory(),
                Particle.resetParticle,
                20, // initial size
                100 // max size
            );
            
            // Ingredient pool
            this.poolManager.createPool('ingredient',
                () => new Ingredient('bun_top', { canvasWidth: this.canvas.width, canvasHeight: this.canvas.height }),
                (ingredient, type, options = {}) => {
                    ingredient.init(type, {
                        ...options,
                        canvasWidth: this.canvas.width,
                        canvasHeight: this.canvas.height
                    });
                },
                15, // initial size
                50  // max size
            );
            
            // Setup performance monitoring callbacks
            this.setupPerformanceCallbacks();
            
            // Initialize performance UI
            this.performanceUI.init(this.performanceMonitor, this.poolManager);
        }
        
        /**
         * Setup performance monitoring callbacks
         */
        setupPerformanceCallbacks() {
            // Listen for performance level changes
            this.performanceMonitor.on('performanceLevelChanged', (data) => {
                const { newLevel, settings } = data;
                console.log(\`Performance level changed to: \${newLevel}\`);
                
                // Apply new quality settings
                this.applyQualitySettings(settings);
            });
            
            // Listen for frame drops
            this.performanceMonitor.on('frameDropDetected', (data) => {
                if (this.config.debugPerformance) {
                    console.warn(\`Frame drop detected: \${data.frameTime.toFixed(2)}ms\`);
                }
            });
        }
        
        /**
         * Apply quality settings based on performance level
         * @param {Object} settings - Quality settings to apply
         */
        applyQualitySettings(settings) {
            // Update renderer settings
            this.renderer.setFeature('shadows', settings.enableShadows);
            this.renderer.setFeature('textures', settings.enableTextures);
            this.renderer.setFeature('effects', settings.enableEffects);
            
            // Update particle limits
            this.maxParticles = settings.maxParticles;
            
            // Update pool sizes based on performance level
            const particlePool = this.poolManager.getPool('particle');
            const celebrationPool = this.poolManager.getPool('celebrationParticle');
            
            if (particlePool) {
                particlePool.resize(Math.floor(settings.maxParticles * 1.5));
            }
            if (celebrationPool) {
                celebrationPool.resize(Math.floor(settings.maxParticles * 0.5));
            }
            
            // Trim excess particles if we're over the new limit
            if (this.particles.length > settings.maxParticles) {
                const excessParticles = this.particles.splice(settings.maxParticles);
                excessParticles.forEach(particle => {
                    if (particle.type === 'celebration') {
                        this.poolManager.release('celebrationParticle', particle);
                    } else {
                        this.poolManager.release('particle', particle);
                    }
                });
            }
        }
        
        /**
         * Setup input event handlers
         */
        setupInputHandlers() {
            this.unregisterClick = this.inputSystem.onClick((x, y, type) => this.handleInput({ x, y, type }));
        }
        
        /**
         * Handle input events
         * @param {Object} event - Input event data
         */
        handleInput(event) {
            if (this.gameState !== 'playing' || this.isPaused) return;
            
            const { x, y } = event;
            
            // Check power-up collection
            for (let i = this.powerUps.length - 1; i >= 0; i--) {
                const powerUp = this.powerUps[i];
                if (powerUp.isClicked(x, y)) {
                    this.collectPowerUp(powerUp, i);
                    return;
                }
            }
            
            // Check ingredient collection
            for (let i = this.ingredients.length - 1; i >= 0; i--) {
                const ingredient = this.ingredients[i];
                if (ingredient.isClicked(x, y)) {
                    this.collectIngredient(ingredient, i);
                    return;
                }
            }
        }
        
        /**
         * Collect a power-up
         * @param {PowerUp} powerUp - The power-up to collect
         * @param {number} index - Index in the power-ups array
         */
        collectPowerUp(powerUp, index) {
            // Activate the power-up
            this.state.activatePowerUp(powerUp.type);
            
            // Play sound
            this.audioSystem.playPowerUpActivate(powerUp.type);
            
            // Visual feedback
            this.renderer.startScreenFlash(powerUp.data.color, 0.2, 8);
            
            // Create celebration particles
            const centerX = powerUp.x + powerUp.size / 2;
            const centerY = powerUp.y + powerUp.size / 2;
            
            for (let i = 0; i < 3; i++) {
                const particle = this.poolManager.get('celebrationParticle',
                    centerX + randomRange(-50, 50),
                    centerY + randomRange(-50, 50),
                    powerUp.data.color,
                    powerUp.data.emoji,
                    {}
                );
                this.particles.push(particle);
            }
            
            // Remove power-up
            this.powerUps.splice(index, 1);
        }
        
        /**
         * Collect an ingredient
         * @param {Ingredient} ingredient - The ingredient to collect
         * @param {number} index - Index in the ingredients array
         */
        collectIngredient(ingredient, index) {
            let correctOrder = null;
            let result = 'wrong';
            
            // Check all orders for matching ingredient
            for (const order of this.orders) {
                result = order.checkIngredient(ingredient.type);
                if (result !== 'wrong') {
                    correctOrder = order;
                    break;
                }
            }
            
            if (result !== 'wrong') {
                // Correct ingredient
                const points = this.calculatePoints(ingredient, correctOrder);
                this.state.updateScore(points);
                
                if (result === 'completed') {
                    // Order completed
                    this.completeOrder(correctOrder);
                } else {
                    // Correct ingredient, order continues
                    this.state.incrementCombo();
                    this.audioSystem.playCollect();
                    
                    // Create success particles
                    for (let i = 0; i < 5; i++) {
                        const particle = this.poolManager.get('particle',
                            ingredient.x + ingredient.data.size / 2,
                            ingredient.y + ingredient.data.size / 2,
                            '#00FF00',
                            '',
                            'star',
                            {}
                        );
                        this.particles.push(particle);
                    }
                }
                
                // Create floating score text
                this.createFloatingText(
                    \`+\${points}\`,
                    ingredient.x + ingredient.data.size / 2,
                    ingredient.y,
                    '#00FF00'
                );
            } else {
                // Wrong ingredient
                this.state.resetCombo();
                this.renderer.startScreenShake(10, 15);
                this.audioSystem.playError();
                
                // Destroy with visual effect
                this.destroyIngredient(ingredient, index);
                return;
            }
            
            // Correct ingredient - remove without destruction effect
            ingredient.collected = true;
            this.ingredients.splice(index, 1);
            this.poolManager.release('ingredient', ingredient);
        }
        
        /**
         * Destroy an ingredient with visual effects
         * @param {Ingredient} ingredient - The ingredient to destroy
         * @param {number} index - Index in the ingredients array
         */
        destroyIngredient(ingredient, index) {
            const centerX = ingredient.x + ingredient.data.size / 2;
            const centerY = ingredient.y + ingredient.data.size / 2;
            
            // Create explosion particles
            const particleCount = 8; // Balanced for performance
            const angleStep = (Math.PI * 2) / particleCount;
            
            for (let i = 0; i < particleCount; i++) {
                const angle = i * angleStep;
                const speed = 3 + Math.random() * 3;
                const particle = this.poolManager.get('particle',
                    centerX,
                    centerY,
                    ingredient.data.color || ingredient.getColor(),
                    '',
                    'circle',
                    {
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        size: 3 + Math.random() * 3,
                        gravity: 0.2,
                        decay: 0.02,
                        bounce: 0.5
                    }
                );
                this.particles.push(particle);
            }
            
            // Create emoji fragments (just a few for performance)
            for (let i = 0; i < 3; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 2 + Math.random() * 4;
                const fragment = this.poolManager.get('particle',
                    centerX + (Math.random() - 0.5) * 10,
                    centerY + (Math.random() - 0.5) * 10,
                    ingredient.data.color || '#FFD700',
                    ingredient.data.emoji,
                    'default',
                    {
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed - 2,
                        size: ingredient.data.size * 0.3,
                        gravity: 0.3,
                        decay: 0.025,
                        rotationSpeed: (Math.random() - 0.5) * 0.4
                    }
                );
                this.particles.push(fragment);
            }
            
            // Add screen ripple effect at destruction point
            this.renderer.startRippleEffect(centerX, centerY, 40);
            
            // Play destruction sound (error sound already played for wrong ingredients)
            
            // Remove ingredient
            ingredient.collected = true;
            this.ingredients.splice(index, 1);
            this.poolManager.release('ingredient', ingredient);
        }
        
        /**
         * Calculate points for collecting an ingredient
         * @param {Ingredient} ingredient - The collected ingredient
         * @param {Order} order - The order being filled
         * @returns {number} Points earned
         */
        calculatePoints(ingredient, order) {
            let basePoints = 10;
            
            // Time bonus
            const timeBonus = Math.floor(order.timeLeft / 1000);
            
            // Combo multiplier
            const comboMultiplier = this.state.core.combo;
            
            // Power-up multiplier - fixed to use correct state path
            const scoreMultiplier = this.state.powerUps?.scoreMultiplier;
            const powerUpMultiplier = (scoreMultiplier?.active && scoreMultiplier?.multiplier) || 1;
            
            return Math.floor((basePoints + timeBonus) * comboMultiplier * powerUpMultiplier);
        }
        
        /**
         * Complete an order
         * @param {Order} order - The completed order
         */
        completeOrder(order) {
            // Big combo increase
            this.state.incrementCombo(5);
            
            // Bonus points
            const bonusPoints = Math.floor(100 * this.state.combo * 
                (this.state.activePowerUps.scoreMultiplier.active ? 2 : 1));
            this.state.addScore(bonusPoints);
            
            // Play success sound
            this.audioSystem.playOrderComplete();
            
            // Visual celebration
            this.renderer.startScreenFlash('#FFD700', 0.3, 10);
            
            // Create celebration particles
            const orderCenterX = order.x + order.width / 2;
            const orderCenterY = order.y + order.height / 2;
            
            for (let i = 0; i < 10; i++) {
                const angle = (i / 10) * Math.PI * 2;
                const speed = randomRange(3, 6);
                const particle = this.poolManager.get('celebrationParticle',
                    orderCenterX,
                    orderCenterY,
                    getRandomColor(),
                    '⭐',
                    {
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed
                    }
                );
                this.particles.push(particle);
            }
            
            // Create floating text
            this.createFloatingText(
                \`+\${bonusPoints}\`,
                orderCenterX,
                orderCenterY,
                '#FFD700'
            );
            
            // Remove completed order
            const index = this.orders.indexOf(order);
            if (index > -1) {
                this.orders.splice(index, 1);
            }
        }
        
        /**
         * Create floating text effect
         * @param {string} text - Text to display
         * @param {number} x - X position
         * @param {number} y - Y position
         * @param {string} color - Text color
         */
        createFloatingText(text, x, y, color) {
            const floatingText = document.createElement('div');
            floatingText.className = 'floating-text';
            floatingText.textContent = text;
            floatingText.style.left = \`\${x}px\`;
            floatingText.style.top = \`\${y}px\`;
            floatingText.style.color = color;
            floatingText.style.fontSize = '24px';
            
            document.getElementById('ui').appendChild(floatingText);
            
            // Remove after animation
            setTimeout(() => {
                floatingText.remove();
            }, 1000);
        }
        
        /**
         * Spawn a new ingredient
         */
        spawnIngredient() {
            // Get all possible ingredients from current orders
            const possibleTypes = new Set();
            this.orders.forEach(order => {
                if (order.currentIndex < order.ingredients.length) {
                    possibleTypes.add(order.ingredients[order.currentIndex]);
                    // Add some random ingredients for challenge
                    const ingredientTypes = Ingredient.getAvailableTypes();
                    const randomType = ingredientTypes[Math.floor(Math.random() * ingredientTypes.length)];
                    possibleTypes.add(randomType);
                }
            });
            
            // If no orders, spawn random ingredients to keep game active
            if (possibleTypes.size === 0) {
                const ingredientTypes = Ingredient.getAvailableTypes();
                // Add 2-3 random ingredient types
                for (let i = 0; i < Math.floor(Math.random() * 2) + 2; i++) {
                    const randomType = ingredientTypes[Math.floor(Math.random() * ingredientTypes.length)];
                    possibleTypes.add(randomType);
                }
            }
            
            if (possibleTypes.size > 0) {
                const typesArray = Array.from(possibleTypes);
                const type = typesArray[Math.floor(Math.random() * typesArray.length)];
                
                // Get ingredient from pool
                const ingredient = this.poolManager.get('ingredient', type, {
                    canvasWidth: this.canvas.width,
                    canvasHeight: this.canvas.height
                });
                
                // Apply current speed with difficulty scaling
                const difficultyMultiplier = 1 + (this.state.core.score * this.config.difficultyIncreaseRate);
                ingredient.speed *= difficultyMultiplier;
                ingredient.baseSpeed *= difficultyMultiplier;
                
                this.ingredients.push(ingredient);
            }
        }
        
        /**
         * Spawn a new order
         */
        spawnOrder() {
            if (this.orders.length < this.config.maxOrders) {
                const template = this.orderTemplates[Math.floor(Math.random() * this.orderTemplates.length)];
                this.orders.push(new Order(template));
                this.audioSystem.playNewOrder();
            }
        }
        
        /**
         * Spawn a power-up
         */
        spawnPowerUp() {
            if (this.powerUps.length < 1 && this.frameCount - this.lastPowerUpSpawn > this.config.powerUpSpawnInterval) {
                const types = Object.keys(PowerUp.getPowerUpTypes());
                const randomType = types[Math.floor(Math.random() * types.length)];
                this.powerUps.push(new PowerUp(randomType));
                this.lastPowerUpSpawn = this.frameCount;
            }
        }
        
        /**
         * Update game state
         * @param {number} deltaTime - Time since last update in milliseconds
         */
        update(deltaTime) {
            try {
                if (this.gameState !== 'playing' || this.isPaused) return;
            
            this.frameCount++;
            
            // Update game state
            this.state.update(deltaTime);
            
            // Update color theme
            if (this.renderer.updateColorTheme) {
                this.renderer.updateColorTheme(this.state.core.combo, this.state.core.score, this.frameCount);
            }
            
            // Spawn entities
            if (this.frameCount - this.lastSpawn > this.config.spawnRate) {
                this.spawnIngredient();
                this.lastSpawn = this.frameCount;
            }
            
            // Spawn orders
            if (this.orders.length === 0 || (this.orders.length < this.config.maxOrders && Math.random() < 0.01)) {
                this.spawnOrder();
            }
            
            // Spawn power-ups
            this.spawnPowerUp();
            
            // Update ingredients
            for (let i = this.ingredients.length - 1; i >= 0; i--) {
                const ingredient = this.ingredients[i];
                // Pass deltaTime so ingredient physics stay consistent
                ingredient.update(this.frameCount, this.state, deltaTime);
                
                // Remove if off screen
                if (ingredient.y > this.canvas.height + 50) {
                    this.ingredients.splice(i, 1);
                    this.poolManager.release('ingredient', ingredient);
                }
            }
            
            // Update orders
            for (let i = this.orders.length - 1; i >= 0; i--) {
                const order = this.orders[i];
                if (!order.update(deltaTime, this.state.powerUps)) {
                    // Order expired
                    this.orders.splice(i, 1);
                    this.state.loseLife();
                    if (typeof this.audioSystem.playOrderExpired === 'function') {
                        this.audioSystem.playOrderExpired();
                    }
                    this.renderer.startScreenShake(20, 30);
                    
                    // Check game over
                    if (this.state.core.lives <= 0) {
                        this.gameOver();
                    }
                }
            }
            
            // Update particles
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const particle = this.particles[i];
                particle.update(this.frameCount);
                
                if (particle.life <= 0) {
                    this.particles.splice(i, 1);
                    // Release back to appropriate pool
                    if (particle.type === 'celebration') {
                        this.poolManager.release('celebrationParticle', particle);
                    } else {
                        this.poolManager.release('particle', particle);
                    }
                }
            }
            
            // Update power-ups
            for (let i = this.powerUps.length - 1; i >= 0; i--) {
                const powerUp = this.powerUps[i];
                powerUp.update();
                
                // Remove if off screen
                if (powerUp.y > this.canvas.height + 50) {
                    this.powerUps.splice(i, 1);
                }
            }
            
            // Update systems
            this.renderer.updateScreenEffects();
            
            // Update UI
            this.updateUI();
            } catch (error) {
                console.error('Update error:', error);
                throw error; // Re-throw to be caught by game loop
            }
        }
        
        /**
         * Render game state
         */
        render() {
            try {
                // Clear canvas
                this.renderer.clear(this.canvas.width, this.canvas.height);
            
            // Screen shake is applied via updateScreenShake
            // (legacy applyScreenShake call removed)
            
            // Draw background
            this.renderer.drawBackground(this.canvas.width, this.canvas.height);
            
            // Draw orders
            this.orders.forEach((order, index) => {
                order.draw(this.ctx, index, this.frameCount, this.renderer);
            });
            
            // Draw ingredients
            this.ingredients.forEach(ingredient => {
                ingredient.draw(this.ctx, this.frameCount);
            });
            
            // Draw power-ups
            this.powerUps.forEach(powerUp => {
                powerUp.draw(this.ctx, this.frameCount);
            });
            
            // Draw particles
            this.particles.forEach(particle => {
                particle.draw(this.ctx, this.frameCount);
            });
            

            // Draw overlay effects like flashes and ripples
            this.renderer.drawScreenEffects();
            
            // Reset transform
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            } catch (error) {
                console.error('Render error:', error);
                // Try to clear canvas to prevent visual artifacts
                try {
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                } catch (clearError) {
                    console.error('Failed to clear canvas:', clearError);
                }
                throw error; // Re-throw to be caught by game loop
            }
        }
        
        /**
         * Main game loop
         * @param {number} currentTime - Current timestamp
         */
        gameLoop(currentTime) {
            try {
                if (!this.lastTime) {
                    this.lastTime = currentTime;
                }
                
                // Update performance monitoring
                this.performanceMonitor.update(currentTime);
                
                this.deltaTime = currentTime - this.lastTime;
                this.lastTime = currentTime;
                this.frameCount++;
                
                this.update(this.deltaTime);
                this.render();
                
                // Update performance UI
                this.performanceUI.update(currentTime, {
                    particles: this.particles,
                    ingredients: this.ingredients,
                    powerUps: this.powerUps,
                    renderer: this.renderer
                });
                
                this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
            } catch (error) {
                console.error('Game loop error:', error);
                this.handleGameError(error);
            }
        }
        
        /**
         * Update UI elements
         */
        updateUI() {
            // Update score
            const scoreElement = document.getElementById('score');
            if (scoreElement) {
                scoreElement.textContent = \`Score: \${this.state.core.score}\`;
                if (this.state.scoreChanged) {
                    scoreElement.classList.add('bounce');
                    setTimeout(() => scoreElement.classList.remove('bounce'), 400);
                    this.state.scoreChanged = false;
                }
            }
            
            // Update combo
            const comboElement = document.getElementById('combo');
            if (comboElement) {
                comboElement.textContent = \`Combo: x\${this.state.core.combo}\`;
                if (this.state.comboChanged) {
                    comboElement.classList.add('pulse');
                    setTimeout(() => comboElement.classList.remove('pulse'), 300);
                    this.state.comboChanged = false;
                }
            }
            
            // Update lives
            const livesElement = document.getElementById('lives');
            if (livesElement) {
                livesElement.textContent = '❤️'.repeat(this.state.core.lives);
                if (this.state.livesChanged) {
                    livesElement.classList.add('shake');
                    setTimeout(() => livesElement.classList.remove('shake'), 500);
                    this.state.livesChanged = false;
                }
            }
            
            // Update power-up status
            const powerUpStatus = document.getElementById('powerUpStatus');
            if (powerUpStatus) {
                // Clear children safely
                while (powerUpStatus.firstChild) {
                    powerUpStatus.removeChild(powerUpStatus.firstChild);
                }
                
                for (const [type, powerUp] of Object.entries(this.state.powerUps)) {
                    if (powerUp.active) {
                        const indicator = document.createElement('div');
                        indicator.className = \`power-up-indicator \${type.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase()}\`;
                        
                        const powerUpData = PowerUp.getPowerUpTypes()[type];
                        
                        // Create elements safely to prevent XSS
                        const emojiSpan = document.createElement('span');
                        emojiSpan.textContent = powerUpData.emoji;
                        indicator.appendChild(emojiSpan);
                        
                        const nameSpan = document.createElement('span');
                        nameSpan.textContent = powerUpData.name;
                        indicator.appendChild(nameSpan);
                        
                        const timerSpan = document.createElement('span');
                        timerSpan.className = 'power-up-timer';
                        timerSpan.textContent = \`\${Math.ceil(powerUp.timeLeft / 1000)}s\`;
                        indicator.appendChild(timerSpan);
                        
                        powerUpStatus.appendChild(indicator);
                    }
                }
            }
        }
        
        /**
         * Handle game over
         */
        gameOver() {
            this.gameState = 'gameOver';
            this.state.core.running = false;
            this.audioSystem.playGameOver();
            
            // Update high score
            if (this.state.core.score > this.state.core.highScore) {
                this.state.core.highScore = this.state.core.score;
                this.saveHighScore();
            }
            
            // Show game over screen
            const gameOverElement = document.getElementById('gameOverOverlay');
            if (gameOverElement) {
                gameOverElement.style.display = 'block';
                document.getElementById('finalScore').textContent = \`Final Score: \${this.state.core.score}\`;
                document.getElementById('highScore').textContent = \`High Score: \${this.state.core.highScore}\`;
            }
        }
        
        /**
         * Load high score from localStorage
         */
        loadHighScore() {
            if (isLocalStorageAvailable()) {
                try {
                    const savedScore = localStorage.getItem('burgerDropHighScore');
                    if (savedScore) {
                        this.state.core.highScore = parseInt(savedScore) || 0;
                    }
                } catch (e) {
                    console.warn('Could not load high score:', e);
                }
            }
        }
        
        /**
         * Save high score to localStorage
         */
        saveHighScore() {
            if (isLocalStorageAvailable()) {
                try {
                    localStorage.setItem('burgerDropHighScore', this.state.core.highScore.toString());
                } catch (e) {
                    console.warn('Could not save high score:', e);
                }
            }
        }
        
        /**
         * Start the game
         */
        start() {
            // Hide start screen
            const startScreen = document.getElementById('startScreen');
            if (startScreen) {
                startScreen.style.display = 'none';
            }
            
            // Reset game state
            this.state.startGame();
            
            // Release all entities back to pools
            this.particles.forEach(particle => {
                if (particle.type === 'celebration') {
                    this.poolManager.release('celebrationParticle', particle);
                } else {
                    this.poolManager.release('particle', particle);
                }
            });
            this.ingredients.forEach(ingredient => {
                this.poolManager.release('ingredient', ingredient);
            });
            
            // Clear arrays
            this.ingredients = [];
            this.orders = [];
            this.particles = [];
            this.powerUps = [];
            this.frameCount = 0;
            this.lastSpawn = 0;
            this.lastPowerUpSpawn = 0;

            // Set game state
            this.gameState = 'playing';
            this.state.core.running = true;
            
            // Start game loop
            this.lastTime = 0;
            this.gameLoop(0);
        }
        
        /**
         * Stop the game
         */
        stop() {
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
            
            this.audioSystem.stopBackgroundMusic();
            this.gameState = 'stopped';
            this.state.core.running = false;
        }
        
        /**
         * Toggle performance UI display
         */
        togglePerformanceUI() {
            this.performanceUI.toggle();
        }
        
        /**
         * Show performance UI
         */
        showPerformanceUI() {
            this.performanceUI.show();
        }
        
        /**
         * Hide performance UI
         */
        hidePerformanceUI() {
            this.performanceUI.hide();
        }
        
        /**
         * Pause/unpause the game
         */
        pause() {
            this.isPaused = !this.isPaused;
            
            if (this.isPaused) {
                this.audioSystem.pauseBackgroundMusic();
            } else {
                this.audioSystem.resumeBackgroundMusic();
            }
        }
        
        /**
         * Handle window resize
         */
        resize() {
            // Canvas will be resized externally
            // Update canvas dimensions in pools
            const ingredientPool = this.poolManager.getPool('ingredient');
            if (ingredientPool) {
                ingredientPool.config.canvasWidth = this.canvas.width;
                ingredientPool.config.canvasHeight = this.canvas.height;
            }
        }
        
        /**
         * Get object pool statistics for debugging
         * @returns {Object} Pool statistics
         */
        getPoolStats() {
            return this.poolManager.getAllStats();
        }
        
        /**
         * Log pool statistics to console
         */
        logPoolStats() {
            const stats = this.getPoolStats();
            console.log('Object Pool Statistics:');
            Object.entries(stats).forEach(([poolName, poolStats]) => {
                console.log(\`  \${poolName}:\`, poolStats);
            });
        }
        
        /**
         * Handle game errors
         * @param {Error} error - The error that occurred
         */
        handleGameError(error) {
            // Log error details
            console.error('Game Error Details:', {
                error: error.message,
                stack: error.stack,
                gameState: this.gameState,
                frameCount: this.frameCount
            });
            
            // Initialize error count if needed
            if (this.errorCount === undefined) this.errorCount = 0;
            this.errorCount++;
            
            if (this.errorCount < 3) {
                // Attempt to recover
                console.warn('Attempting to recover from error...');
                this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
            } else {
                // Too many errors, stop the game
                this.gameState = 'error';
                this.showErrorMessage('Game encountered an error. Please refresh to restart.');
            }
        }
        
        /**
         * Show error message to user
         * @param {string} message - Error message to display
         */
        showErrorMessage(message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'game-error-message';
            errorDiv.textContent = message;
            errorDiv.style.cssText = \`
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            font-size: 16px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        \`;
            document.body.appendChild(errorDiv);
        }
        
        /**
         * Clean up resources
         */
        destroy() {
            this.stop();
            this.inputSystem.destroy();
            this.audioSystem.destroy();
            
            // Remove event listeners
            if (this.unregisterClick) {
                this.unregisterClick();
            }
            
            // Release all pooled objects
            this.particles.forEach(particle => {
                if (particle.type === 'celebration') {
                    this.poolManager.release('celebrationParticle', particle);
                } else {
                    this.poolManager.release('particle', particle);
                }
            });
            this.ingredients.forEach(ingredient => {
                this.poolManager.release('ingredient', ingredient);
            });
            
            // Clear references
            this.ingredients = [];
            this.orders = [];
            this.particles = [];
            this.powerUps = [];
            
            // Clear all pools
            this.poolManager.clearAll();
            
            // Cleanup performance UI
            this.performanceUI.destroy();
        }
    }

    // Export for use in worker.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Game;
    }

    return Game;

})();


        // Wait for DOM to be ready before initializing the game
        function initGame() {
            const canvas = document.getElementById('gameCanvas');
            if (canvas && typeof Game !== 'undefined') {
                const game = new Game(canvas, {
                    enablePerformanceMonitoring: false,
                    showPerformanceUI: false
                });
                
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
                        const gameOverOverlay = document.getElementById('gameOverOverlay');
                        if (gameOverOverlay) {
                            gameOverOverlay.style.display = 'none';
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
                        const gameOverOverlay = document.getElementById('gameOverOverlay');
                        if (gameOverOverlay) {
                            gameOverOverlay.style.display = 'none';
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
>>>>>>> origin/main
