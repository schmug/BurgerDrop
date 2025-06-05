/**
 * @fileoverview Tests for the main Game class integration
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock Renderer
vi.mock('../src/game/systems/Renderer.js', () => ({
    default: class MockRenderer {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext ? canvas.getContext('2d') : {};
        }
        initializePatterns() {}
        clear() {}
        applyScreenShake() {}
        applyScreenFlash() {}
        drawBackground() {}
        drawGradientBackground() {}
        drawOrder() {}
        drawIngredient() {}
        drawPowerUp() {}
        drawParticle() {}
        drawScreenEffects() {}
        updateScreenEffects() {}
        triggerScreenShake() {}
        triggerScreenFlash() {}
        startScreenShake() {}
        startScreenFlash() {}
        showFloatingText() {}
        updateColorTheme() {}
        destroy() {}
    }
}));

// Mock AudioSystem
vi.mock('../src/game/systems/Audio.js', () => ({
    default: class MockAudioSystem {
        constructor() {
            this.enabled = true;
        }
        playNewOrder() {}
        playCollect() {}
        playCombo() {}
        playPowerUp() {}
        playPowerUpActivate() {}
        playOrderComplete() {}
        playOrderExpire() {}
        playWrong() {}
        playError() {}
        playGameOver() {}
        startBackgroundMusic() {}
        stopBackgroundMusic() {}
        pauseBackgroundMusic() {}
        resumeBackgroundMusic() {}
        destroy() {}
    }
}));

// Mock GameState before importing Game
vi.mock('../src/game/State.js', () => {
    class MockGameState {
        constructor() {
            this.gameState = 'menu';
            this.score = 0;
            this.lives = 3;
            this.combo = 1;
            this.highScore = 0;
            this.activePowerUps = {
                speedBoost: { active: false, timeLeft: 0, multiplier: 0.5 },
                timeFreeze: { active: false, timeLeft: 0 },
                scoreMultiplier: { active: false, timeLeft: 0, multiplier: 2 }
            };
            this.core = {
                lives: 3
            };
        }
        
        startGame() {
            this.gameState = 'playing';
            this.score = 0;
            this.lives = 3;
            this.combo = 1;
        }
        
        addScore(points) {
            this.score += points;
        }
        
        incrementCombo() {
            this.combo++;
        }
        
        resetCombo() {
            this.combo = 1;
        }
        
        loseLife() {
            this.lives--;
            if (this.lives <= 0) {
                this.gameState = 'gameOver';
            }
        }
        
        activatePowerUp(type, duration = 10000) {
            if (this.activePowerUps[type]) {
                this.activePowerUps[type].active = true;
                this.activePowerUps[type].timeLeft = duration;
            }
        }
        
        update(deltaTime) {
            // Update power-ups
            Object.values(this.activePowerUps).forEach(powerUp => {
                if (powerUp.active) {
                    powerUp.timeLeft -= deltaTime * 1000;
                    if (powerUp.timeLeft <= 0) {
                        powerUp.active = false;
                    }
                }
            });
        }
    }
    
    return {
        default: MockGameState,
        GameState: MockGameState
    };
});

import Game from '../src/game/Game.js';
import GameState from '../src/game/State.js';
import { Ingredient } from '../src/game/entities/Ingredient.js';
import { Order } from '../src/game/entities/Order.js';
import { PowerUp } from '../src/game/entities/PowerUp.js';
import { Particle } from '../src/game/entities/Particle.js';

// Mock utility functions that might be missing
vi.mock('../src/game/utils/Math.js', () => ({
    randomRange: vi.fn((min, max) => Math.random() * (max - min) + min),
    clamp: vi.fn((value, min, max) => Math.min(Math.max(value, min), max)),
    lerp: vi.fn((a, b, t) => a + (b - a) * t)
}));

vi.mock('../src/game/utils/Colors.js', () => ({
    getRandomColor: vi.fn(() => '#' + Math.floor(Math.random()*16777215).toString(16)),
    getThemeColor: vi.fn(() => '#4A90E2'),
    colorTheme: {
        primary: '#4A90E2',
        secondary: '#50C878',
        background: '#F5F5F5'
    },
    createTexturePattern: vi.fn()
}));

// Mock PowerUp static method
PowerUp.getPowerUpTypes = vi.fn(() => ({
    speedBoost: { emoji: '⚡', name: 'Slow Motion', duration: 10000 },
    scoreMultiplier: { emoji: '✨', name: 'Double Points', duration: 15000 },
    timeFreeze: { emoji: '⏱️', name: 'Time Freeze', duration: 8000 }
}));

// Mock Ingredient static method
Ingredient.getIngredientTypes = vi.fn(() => ({
    bun_bottom: { name: 'Bottom Bun', emoji: '🍞' },
    bun_top: { name: 'Top Bun', emoji: '🍞' },
    patty: { name: 'Patty', emoji: '🍖' },
    cheese: { name: 'Cheese', emoji: '🧀' },
    lettuce: { name: 'Lettuce', emoji: '🥬' },
    tomato: { name: 'Tomato', emoji: '🍅' }
}));

// Mock requestAnimationFrame
vi.stubGlobal('requestAnimationFrame', (cb) => setTimeout(cb, 16));
vi.stubGlobal('cancelAnimationFrame', (id) => clearTimeout(id));

// Mock DOM elements
const mockUI = () => {
    document.body.innerHTML = `
        <div id="ui">
            <div id="score">Score: 0</div>
            <div id="combo">Combo: x1</div>
            <div id="lives">❤️❤️❤️</div>
            <div id="powerUpStatus"></div>
            <div id="gameOver" style="display: none;">
                <p id="finalScore">Final Score: 0</p>
                <p id="highScore">High Score: 0</p>
            </div>
            <div id="startScreen" style="display: block;"></div>
        </div>
    `;
};

describe('Game Integration', () => {
    let canvas;
    let game;
    let mockContext;

    beforeEach(() => {
        // Mock UI elements
        mockUI();
        
        // Create comprehensive canvas context mock
        mockContext = {
            fillStyle: '',
            strokeStyle: '',
            lineWidth: 1,
            shadowColor: '',
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            globalAlpha: 1,
            font: '',
            textAlign: '',
            textBaseline: '',
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high',
            fillRect: vi.fn(),
            clearRect: vi.fn(),
            strokeRect: vi.fn(),
            getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
            putImageData: vi.fn(),
            createImageData: vi.fn(),
            setTransform: vi.fn(),
            drawImage: vi.fn(),
            save: vi.fn(),
            restore: vi.fn(),
            fillText: vi.fn(),
            strokeText: vi.fn(),
            beginPath: vi.fn(),
            closePath: vi.fn(),
            moveTo: vi.fn(),
            lineTo: vi.fn(),
            stroke: vi.fn(),
            fill: vi.fn(),
            translate: vi.fn(),
            scale: vi.fn(),
            rotate: vi.fn(),
            arc: vi.fn(),
            ellipse: vi.fn(),
            bezierCurveTo: vi.fn(),
            quadraticCurveTo: vi.fn(),
            measureText: vi.fn(() => ({ width: 10 })),
            transform: vi.fn(),
            rect: vi.fn(),
            clip: vi.fn(),
            createLinearGradient: vi.fn(() => ({
                addColorStop: vi.fn()
            })),
            createRadialGradient: vi.fn(() => ({
                addColorStop: vi.fn()
            })),
            createPattern: vi.fn(() => ({})),
            canvas: { width: 480, height: 600 }
        };
        
        // Create canvas element
        canvas = {
            width: 480,
            height: 600,
            getContext: vi.fn(() => mockContext),
            style: {
                transform: '',
                setProperty: vi.fn(),
                getPropertyValue: vi.fn(),
                width: '480px',
                height: '600px'
            },
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            getBoundingClientRect: vi.fn(() => ({
                left: 0,
                top: 0,
                width: 480,
                height: 600
            }))
        };
        
        // Create game instance
        game = new Game(canvas, {
            initialLives: 3,
            initialSpeed: 4,
            spawnRate: 40,
            maxOrders: 3,
            powerUpSpawnInterval: 900
        });
    });

    afterEach(() => {
        if (game) {
            game.destroy();
        }
        vi.clearAllMocks();
    });

    describe('Initialization', () => {
        it('should create game with default configuration', () => {
            expect(game.canvas).toBe(canvas);
            expect(game.ctx).toBeDefined();
            expect(game.config.initialLives).toBe(3);
            expect(game.config.initialSpeed).toBe(4);
            expect(game.config.spawnRate).toBe(40);
            expect(game.config.maxOrders).toBe(3);
        });

        it('should initialize all systems', () => {
            expect(game.state).toBeInstanceOf(GameState);
            expect(game.audioSystem).toBeDefined();
            expect(game.renderer).toBeDefined();
            expect(game.inputSystem).toBeDefined();
            expect(game.physicsSystem).toBeDefined();
        });

        it('should initialize empty entity arrays', () => {
            expect(game.ingredients).toEqual([]);
            expect(game.orders).toEqual([]);
            expect(game.particles).toEqual([]);
            expect(game.powerUps).toEqual([]);
        });

        it('should setup input handlers', () => {
            const mockEvent = { x: 100, y: 100 };
            // Test that click handler was registered
            expect(game.unregisterClick).toBeDefined();
            expect(typeof game.unregisterClick).toBe('function');
        });
    });

    describe('Game Loop', () => {
        it('should start game when start() is called', () => {
            game.start();
            
            expect(game.state.gameState).toBe('playing');
            expect(game.frameCount).toBeDefined();
            expect(document.getElementById('startScreen').style.display).toBe('none');
        });

        it('should stop game when stop() is called', () => {
            game.start();
            game.stop();
            
            expect(game.state.gameState).toBe('stopped');
            expect(game.animationId).toBeNull();
        });

        it('should toggle pause state', () => {
            game.start();
            
            expect(game.isPaused).toBe(false);
            
            game.pause();
            expect(game.isPaused).toBe(true);
            
            game.pause();
            expect(game.isPaused).toBe(false);
        });

        it('should update game state when running', async () => {
            game.start();
            
            // Wait for a few frames
            await new Promise(resolve => setTimeout(resolve, 50));
            
            expect(game.frameCount).toBeGreaterThan(0);
            game.stop();
        });
    });

    describe('Entity Spawning', () => {
        beforeEach(() => {
            game.start();
        });

        it('should spawn orders when needed', () => {
            // Orders might be spawned automatically on start
            const initialOrders = game.orders.length;
            
            game.spawnOrder();
            
            expect(game.orders.length).toBe(initialOrders + 1);
            expect(game.orders[game.orders.length - 1]).toBeInstanceOf(Order);
        });

        it('should not spawn orders beyond max limit', () => {
            // Fill up to max
            for (let i = 0; i < game.config.maxOrders; i++) {
                game.spawnOrder();
            }
            
            expect(game.orders.length).toBe(game.config.maxOrders);
            
            // Try to spawn one more
            game.spawnOrder();
            
            expect(game.orders.length).toBe(game.config.maxOrders);
        });

        it('should spawn ingredients based on current orders', () => {
            // Add an order first
            game.spawnOrder();
            
            expect(game.ingredients.length).toBe(0);
            
            game.spawnIngredient();
            
            expect(game.ingredients.length).toBe(1);
            expect(game.ingredients[0]).toBeInstanceOf(Ingredient);
        });

        it('should spawn power-ups after interval', () => {
            expect(game.powerUps.length).toBe(0);
            
            // Simulate enough frames passing
            game.frameCount = game.config.powerUpSpawnInterval + 1;
            game.spawnPowerUp();
            
            expect(game.powerUps.length).toBe(1);
            expect(game.powerUps[0]).toBeInstanceOf(PowerUp);
        });
    });

    describe('Ingredient Collection', () => {
        beforeEach(() => {
            game.start();
            // Add an order with known ingredients
            const testOrder = new Order({
                name: 'Test Burger',
                ingredients: ['bun_bottom', 'patty', 'bun_top'],
                time: 30
            });
            game.orders.push(testOrder);
        });

        it('should handle correct ingredient collection', () => {
            const ingredient = new Ingredient('bun_bottom');
            ingredient.x = 100;
            ingredient.y = 100;
            game.ingredients.push(ingredient);
            
            const initialScore = game.state.score;
            const initialCombo = game.state.combo;
            
            game.collectIngredient(ingredient, 0);
            
            expect(game.state.score).toBeGreaterThan(initialScore);
            expect(game.state.combo).toBeGreaterThan(initialCombo);
            expect(game.ingredients.length).toBe(0);
        });

        it('should handle wrong ingredient collection', () => {
            const ingredient = new Ingredient('cheese'); // Not in order
            ingredient.x = 100;
            ingredient.y = 100;
            game.ingredients.push(ingredient);
            
            game.state.combo = 5;
            const initialScore = game.state.score;
            
            game.collectIngredient(ingredient, 0);
            
            expect(game.state.score).toBe(initialScore); // No points
            expect(game.state.combo).toBe(1); // Reset combo
            expect(game.ingredients.length).toBe(0);
        });

        it('should complete order when all ingredients collected', () => {
            const order = game.orders[0];
            const requiredIngredients = order.ingredients;
            
            // Collect all ingredients in order
            requiredIngredients.forEach((type, index) => {
                const ingredient = new Ingredient(type);
                game.ingredients.push(ingredient);
                game.collectIngredient(ingredient, 0);
                
                if (index < requiredIngredients.length - 1) {
                    expect(order.completed).toBe(false);
                } else {
                    expect(order.completed).toBe(true);
                    expect(game.orders.includes(order)).toBe(false); // Order removed
                }
            });
        });
    });

    describe('Power-up Collection', () => {
        beforeEach(() => {
            game.start();
        });

        it('should activate power-up when collected', () => {
            const powerUp = new PowerUp('speedBoost');
            powerUp.x = 100;
            powerUp.y = 100;
            game.powerUps.push(powerUp);
            
            expect(game.state.activePowerUps.speedBoost.active).toBe(false);
            
            game.collectPowerUp(powerUp, 0);
            
            expect(game.state.activePowerUps.speedBoost.active).toBe(true);
            expect(game.powerUps.length).toBe(0);
        });

        it('should create celebration particles on power-up collection', () => {
            const powerUp = new PowerUp('scoreMultiplier');
            powerUp.x = 100;
            powerUp.y = 100;
            game.powerUps.push(powerUp);
            
            const initialParticles = game.particles.length;
            
            game.collectPowerUp(powerUp, 0);
            
            expect(game.particles.length).toBeGreaterThan(initialParticles);
            expect(game.particles[0]).toBeInstanceOf(Particle);
        });
    });

    describe('Game Over', () => {
        beforeEach(() => {
            game.start();
        });

        it('should handle game over when lives reach zero', () => {
            game.state.lives = 1;
            
            // Add an order and let it expire
            const order = new Order({
                name: 'Test',
                ingredients: ['bun_bottom'],
                time: 0.1 // Very short time
            });
            game.orders.push(order);
            
            // Simulate order expiring
            order.timeLeft = -1;
            game.update(16);
            
            expect(game.state.gameState).toBe('gameOver');
            expect(document.getElementById('gameOver').style.display).toBe('block');
        });

        it('should update high score if current score is higher', () => {
            game.state.score = 1000;
            game.state.highScore = 500;
            
            game.gameOver();
            
            expect(game.state.highScore).toBe(1000);
        });
    });

    describe('UI Updates', () => {
        beforeEach(() => {
            game.start();
        });

        it('should update score display', () => {
            game.state.score = 123;
            game.updateUI();
            
            expect(document.getElementById('score').textContent).toBe('Score: 123');
        });

        it('should update combo display', () => {
            game.state.combo = 5;
            game.updateUI();
            
            expect(document.getElementById('combo').textContent).toBe('Combo: x5');
        });

        it('should update lives display', () => {
            game.state.lives = 2;
            game.updateUI();
            
            expect(document.getElementById('lives').textContent).toBe('❤️❤️');
        });

        it('should update power-up status display', () => {
            game.state.activePowerUps.speedBoost.active = true;
            game.state.activePowerUps.speedBoost.timeLeft = 5000;
            
            game.updateUI();
            
            const powerUpStatus = document.getElementById('powerUpStatus');
            expect(powerUpStatus.children.length).toBe(1);
            expect(powerUpStatus.innerHTML).toContain('Slow Motion');
        });
    });

    describe('Input Handling', () => {
        beforeEach(() => {
            game.start();
        });

        it('should handle ingredient clicks', () => {
            const ingredient = new Ingredient('patty');
            ingredient.x = 100;
            ingredient.y = 100;
            ingredient.data = { size: 40 };
            game.ingredients.push(ingredient);
            
            // Add matching order
            game.orders.push(new Order({
                name: 'Test',
                ingredients: ['patty'],
                time: 30
            }));
            
            game.handleInput({ x: 120, y: 120 });
            
            expect(game.ingredients.length).toBe(0);
        });

        it('should handle power-up clicks', () => {
            const powerUp = new PowerUp('speedBoost');
            powerUp.x = 100;
            powerUp.y = 100;
            powerUp.size = 40;
            game.powerUps.push(powerUp);
            
            game.handleInput({ x: 120, y: 120 });
            
            expect(game.powerUps.length).toBe(0);
            expect(game.state.activePowerUps.speedBoost.active).toBe(true);
        });

        it('should not handle input when paused', () => {
            const ingredient = new Ingredient('patty');
            ingredient.x = 100;
            ingredient.y = 100;
            game.ingredients.push(ingredient);
            
            game.pause(); // Pause the game
            
            game.handleInput({ x: 120, y: 120 });
            
            expect(game.ingredients.length).toBe(1); // Still there
        });
    });

    describe('Cleanup', () => {
        it('should clean up resources on destroy', () => {
            game.start();
            
            // Add some entities
            game.ingredients.push(new Ingredient('patty'));
            game.orders.push(new Order({ name: 'Test', ingredients: ['patty'], time: 30 }));
            game.particles.push(new Particle(100, 100, '#FF0000'));
            game.powerUps.push(new PowerUp('speedBoost'));
            
            game.destroy();
            
            expect(game.ingredients.length).toBe(0);
            expect(game.orders.length).toBe(0);
            expect(game.particles.length).toBe(0);
            expect(game.powerUps.length).toBe(0);
            expect(game.animationId).toBeNull();
        });
    });
});