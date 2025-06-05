import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Game from '../src/game/Game.js';
import { Particle } from '../src/game/entities/Particle.js';
import { Ingredient } from '../src/game/entities/Ingredient.js';
import GameState from '../src/game/State.js';

describe('Game Object Pooling', () => {
    let canvas;
    let game;
    
    beforeEach(() => {
        // Create mock canvas
        canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        
        // Mock canvas context
        const ctx = {
            clearRect: vi.fn(),
            fillRect: vi.fn(),
            fillText: vi.fn(),
            strokeText: vi.fn(),
            save: vi.fn(),
            restore: vi.fn(),
            translate: vi.fn(),
            rotate: vi.fn(),
            scale: vi.fn(),
            beginPath: vi.fn(),
            moveTo: vi.fn(),
            lineTo: vi.fn(),
            arc: vi.fn(),
            closePath: vi.fn(),
            fill: vi.fn(),
            stroke: vi.fn(),
            setTransform: vi.fn(),
            createLinearGradient: vi.fn(() => ({
                addColorStop: vi.fn()
            })),
            createRadialGradient: vi.fn(() => ({
                addColorStop: vi.fn()
            })),
            createPattern: vi.fn(),
            measureText: vi.fn(() => ({ width: 100 }))
        };
        
        canvas.getContext = vi.fn(() => ctx);
        
        // Create game instance
        game = new Game(canvas);
        
        // Initialize state properties that Game.js expects
        game.state.gameState = 'playing';
        game.state.score = 0;
        game.state.lives = 3;
        game.state.combo = 1;
        game.state.activePowerUps = {
            scoreMultiplier: { active: false, multiplier: 2 },
            speedBoost: { active: false, multiplier: 0.5 },
            timeFreeze: { active: false }
        };
        game.state.addScore = (points) => { game.state.score += points; };
        game.state.incrementCombo = (amount = 1) => { game.state.combo += amount; };
        game.state.resetCombo = () => { game.state.combo = 1; };
        game.state.loseLife = () => { game.state.lives--; };
        game.state.activatePowerUp = vi.fn();
        game.state.isPowerUpActive = (type) => game.state.activePowerUps[type]?.active || false;
        game.state.update = vi.fn();
        game.state.startGame = vi.fn();
    });
    
    afterEach(() => {
        if (game) {
            game.destroy();
        }
    });
    
    describe('Pool Initialization', () => {
        it('should initialize object pools on game creation', () => {
            expect(game.poolManager).toBeDefined();
            expect(game.poolManager.getPool('particle')).toBeDefined();
            expect(game.poolManager.getPool('ingredient')).toBeDefined();
            expect(game.poolManager.getPool('celebrationParticle')).toBeDefined();
        });
        
        it('should pre-warm pools with correct sizes', () => {
            const particlePool = game.poolManager.getPool('particle');
            const ingredientPool = game.poolManager.getPool('ingredient');
            const celebrationPool = game.poolManager.getPool('celebrationParticle');
            
            expect(particlePool.getSize().available).toBe(50);
            expect(ingredientPool.getSize().available).toBe(20);
            expect(celebrationPool.getSize().available).toBe(30);
        });
    });
    
    describe('Particle Pooling', () => {
        it('should use pool for creating particles', () => {
            const particlePool = game.poolManager.getPool('particle');
            const initialStats = particlePool.getStats();
            
            // Simulate collecting an ingredient (creates success particles)
            game.orders.push({
                ingredients: ['patty'],
                currentIndex: 0,
                checkIngredient: (type) => type === 'patty' ? 'correct' : 'wrong',
                timeLeft: 10000
            });
            
            const ingredient = new Ingredient('patty', { x: 100, y: 100 });
            game.ingredients.push(ingredient);
            
            // Collect ingredient
            game.collectIngredient(ingredient, 0);
            
            // Check that particles were created from pool
            expect(game.particles.length).toBe(5); // Success particles
            expect(particlePool.getStats().active).toBe(5);
            expect(particlePool.getStats().reused).toBeGreaterThan(initialStats.reused);
        });
        
        it('should release particles back to pool when they expire', () => {
            const particlePool = game.poolManager.getPool('particle');
            
            // Add particles directly
            for (let i = 0; i < 3; i++) {
                const particle = game.poolManager.get('particle', 100, 100, '#FF0000', '', 'default', {});
                game.particles.push(particle);
            }
            
            expect(particlePool.getStats().active).toBe(3);
            
            // Simulate particles expiring
            game.particles.forEach(p => p.life = 0);
            
            // Update game to clean up particles
            game.update(16);
            
            expect(game.particles.length).toBe(0);
            expect(particlePool.getStats().active).toBe(0);
            expect(particlePool.getStats().available).toBe(50); // All returned
        });
        
        it('should use celebration particle pool for celebration effects', () => {
            const celebrationPool = game.poolManager.getPool('celebrationParticle');
            const initialActive = celebrationPool.getStats().active;
            
            // Create a mock order to complete
            const mockOrder = {
                x: 100,
                y: 100,
                width: 200,
                height: 100,
                ingredients: ['patty'],
                currentIndex: 0,
                checkIngredient: () => 'completed',
                timeLeft: 10000
            };
            game.orders.push(mockOrder);
            
            // Complete the order
            game.completeOrder(mockOrder);
            
            // Check celebration particles were created
            expect(celebrationPool.getStats().active).toBeGreaterThan(initialActive);
        });
    });
    
    describe('Ingredient Pooling', () => {
        it('should use pool for spawning ingredients', () => {
            const ingredientPool = game.poolManager.getPool('ingredient');
            const initialStats = ingredientPool.getStats();
            
            // Add an order to enable ingredient spawning
            game.orders.push({
                ingredients: ['patty', 'cheese', 'lettuce'],
                currentIndex: 0
            });
            
            // Spawn ingredient
            game.spawnIngredient();
            
            expect(game.ingredients.length).toBe(1);
            expect(ingredientPool.getStats().active).toBe(1);
            expect(ingredientPool.getStats().reused).toBeGreaterThan(initialStats.reused);
        });
        
        it('should release ingredients when collected', () => {
            const ingredientPool = game.poolManager.getPool('ingredient');
            
            // Add ingredient from pool
            const ingredient = game.poolManager.get('ingredient', 'patty', {});
            game.ingredients.push(ingredient);
            
            expect(ingredientPool.getStats().active).toBe(1);
            
            // Add matching order
            game.orders.push({
                ingredients: ['patty'],
                currentIndex: 0,
                checkIngredient: (type) => type === 'patty' ? 'correct' : 'wrong',
                timeLeft: 10000
            });
            
            // Collect ingredient
            game.collectIngredient(ingredient, 0);
            
            expect(game.ingredients.length).toBe(0);
            expect(ingredientPool.getStats().active).toBe(0);
        });
        
        it('should release ingredients when they go off screen', () => {
            const ingredientPool = game.poolManager.getPool('ingredient');
            
            // Add ingredient from pool
            const ingredient = game.poolManager.get('ingredient', 'patty', {});
            ingredient.y = canvas.height + 100; // Off screen
            game.ingredients.push(ingredient);
            
            expect(ingredientPool.getStats().active).toBe(1);
            
            // Update game
            game.update(16);
            
            expect(game.ingredients.length).toBe(0);
            expect(ingredientPool.getStats().active).toBe(0);
        });
    });
    
    describe('Pool Management', () => {
        it('should release all objects on game reset', () => {
            // Add some objects
            for (let i = 0; i < 5; i++) {
                const particle = game.poolManager.get('particle', 100, 100, '#FF0000', '', 'default', {});
                game.particles.push(particle);
            }
            
            for (let i = 0; i < 3; i++) {
                const ingredient = game.poolManager.get('ingredient', 'patty', {});
                game.ingredients.push(ingredient);
            }
            
            const particlePool = game.poolManager.getPool('particle');
            const ingredientPool = game.poolManager.getPool('ingredient');
            
            expect(particlePool.getStats().active).toBe(5);
            expect(ingredientPool.getStats().active).toBe(3);
            
            // Start new game (triggers reset)
            game.start();
            
            expect(particlePool.getStats().active).toBe(0);
            expect(ingredientPool.getStats().active).toBe(0);
        });
        
        it('should handle pool expansion under heavy load', () => {
            const particlePool = game.poolManager.getPool('particle');
            const initialTotal = particlePool.getSize().total;
            
            // Create many particles to trigger expansion
            for (let i = 0; i < 60; i++) {
                const particle = game.poolManager.get('particle', 100, 100, '#FF0000', '', 'default', {});
                game.particles.push(particle);
            }
            
            expect(particlePool.getSize().total).toBeGreaterThan(initialTotal);
            expect(particlePool.getStats().expanded).toBeGreaterThan(0);
        });
        
        it('should provide pool statistics', () => {
            const stats = game.getPoolStats();
            
            expect(stats).toHaveProperty('particle');
            expect(stats).toHaveProperty('ingredient');
            expect(stats).toHaveProperty('celebrationParticle');
            
            expect(stats.particle).toHaveProperty('created');
            expect(stats.particle).toHaveProperty('reused');
            expect(stats.particle).toHaveProperty('active');
            expect(stats.particle).toHaveProperty('available');
        });
        
        it('should log pool statistics', () => {
            const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
            
            game.logPoolStats();
            
            expect(consoleLogSpy).toHaveBeenCalledWith('Object Pool Statistics:');
            expect(consoleLogSpy).toHaveBeenCalledTimes(4); // Header + 3 pools
            
            consoleLogSpy.mockRestore();
        });
    });
    
    describe('Performance Impact', () => {
        it('should reuse objects efficiently', () => {
            const particlePool = game.poolManager.getPool('particle');
            
            // Simulate multiple spawn/release cycles
            for (let cycle = 0; cycle < 5; cycle++) {
                // Spawn particles
                for (let i = 0; i < 10; i++) {
                    const particle = game.poolManager.get('particle', 100, 100, '#FF0000', '', 'default', {});
                    game.particles.push(particle);
                }
                
                // Release all
                game.particles.forEach(p => p.life = 0);
                game.update(16);
            }
            
            const stats = particlePool.getStats();
            // Most gets should be reuses after first cycle
            expect(stats.reused).toBeGreaterThan(stats.created * 3);
        });
        
        it('should maintain reasonable pool sizes', () => {
            // Simulate normal gameplay
            game.start();
            
            // Add some orders
            for (let i = 0; i < 3; i++) {
                game.orders.push({
                    ingredients: ['patty', 'cheese'],
                    currentIndex: 0,
                    checkIngredient: () => 'wrong',
                    timeLeft: 10000,
                    update: () => true
                });
            }
            
            // Run several update cycles
            for (let i = 0; i < 100; i++) {
                game.update(16);
            }
            
            // Check pool sizes are reasonable
            const particlePool = game.poolManager.getPool('particle');
            const ingredientPool = game.poolManager.getPool('ingredient');
            
            expect(particlePool.getSize().total).toBeLessThanOrEqual(200); // Max size
            expect(ingredientPool.getSize().total).toBeLessThanOrEqual(50); // Max size
        });
    });
});