/**
 * @fileoverview Main Game class that orchestrates all game systems and entities
 * Integrates all modular components to create the complete Burger Drop game experience
 */

import GameState from './State.js';
import { Particle } from './entities/Particle.js';
import { PowerUp } from './entities/PowerUp.js';
import { Ingredient } from './entities/Ingredient.js';
import { Order } from './entities/Order.js';
import AudioSystem from './systems/Audio.js';
import Renderer from './systems/Renderer.js';
import { InputSystem } from './systems/Input.js';
import PhysicsSystem from './systems/Physics.js';
import { easing } from './utils/Easing.js';
import { getRandomColor, getThemeColor } from './utils/Colors.js';
import { clamp, lerp, randomRange } from './utils/Math.js';
import { ObjectPool, PoolManager } from './utils/ObjectPool.js';
import PerformanceMonitor from './utils/PerformanceMonitor.js';
import PerformanceUI from './utils/PerformanceUI.js';
import { isLocalStorageAvailable } from './utils/Storage.js';

/**
 * Main Game class that manages the game loop and coordinates all systems
 */
export default class Game {
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
            console.log(`Performance level changed to: ${newLevel}`);
            
            // Apply new quality settings
            this.applyQualitySettings(settings);
        });
        
        // Listen for frame drops
        this.performanceMonitor.on('frameDropDetected', (data) => {
            if (this.config.debugPerformance) {
                console.warn(`Frame drop detected: ${data.frameTime.toFixed(2)}ms`);
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
                `+${points}`,
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
        const bonusPoints = Math.floor(100 * this.state.core.combo * 
            (this.state.powerUps.scoreMultiplier.active ? 2 : 1));
        this.state.updateScore(bonusPoints);
        
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
            `+${bonusPoints}`,
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
        floatingText.style.left = `${x}px`;
        floatingText.style.top = `${y}px`;
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
            scoreElement.textContent = `Score: ${this.state.core.score}`;
            if (this.state.scoreChanged) {
                scoreElement.classList.add('bounce');
                setTimeout(() => scoreElement.classList.remove('bounce'), 400);
                this.state.scoreChanged = false;
            }
        }
        
        // Update combo
        const comboElement = document.getElementById('combo');
        if (comboElement) {
            comboElement.textContent = `Combo: x${this.state.core.combo}`;
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
                    indicator.className = `power-up-indicator ${type.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase()}`;
                    
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
                    timerSpan.textContent = `${Math.ceil(powerUp.timeLeft / 1000)}s`;
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
            document.getElementById('finalScore').textContent = `Final Score: ${this.state.core.score}`;
            document.getElementById('highScore').textContent = `High Score: ${this.state.core.highScore}`;
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
            console.log(`  ${poolName}:`, poolStats);
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
        errorDiv.style.cssText = `
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
        `;
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