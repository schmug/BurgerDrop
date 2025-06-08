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
                throw new Error(`Unknown entity type: ${type}`);
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
                throw new Error(`Unknown power-up type: ${type}`);
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
                        console.error(`Error in event listener for ${event}:`, error);
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
                    errors.push(`Entity collection ${type} must be an array`);
                }
            });
            
            // Power-up validation
            Object.entries(this.powerUps).forEach(([type, powerUp]) => {
                if (powerUp.active && powerUp.timeLeft <= 0) {
                    errors.push(`Active power-up ${type} has invalid timeLeft`);
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
                ctx.font = `bold ${20 + this.size * 2}px Arial`; // Keep Arial for emoji compatibility
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
                throw new Error(`Unknown power-up type: ${type}`);
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
                this.cachedFont = `${this.size * 0.6}px Arial`;
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
                throw new Error(`Unknown ingredient type: ${type}`);
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
            
            ctx.font = `${this.data.size}px Arial`; // Keep Arial for emoji compatibility
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
                gradient.addColorStop(0, `rgba(255, 255, 255, ${point.alpha * 0.3})`);
                gradient.addColorStop(1, `rgba(255, 255, 255, ${nextPoint.alpha * 0.3})`);
                
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
                throw new Error(`Unknown ingredient type: ${type}`);
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
            ctx.fillText(`${timeSeconds}s`, this.x + this.width / 2, this.y + 30);

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
                ctx.fillStyle = `rgba(255, 215, 0, ${pulseAlpha})`;
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
            
            const { frequency, type = 'sine', duration = 0.1, volume = 1, duck = false } = soundConfig;
            const result = this.createOscillator(frequency, type, duration, volume);
            
            if (result) {
                const { oscillator } = result;
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
                        console.error(`Error in audio event listener for ${event}:`, error);
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
                    patternCtx.strokeStyle = `rgba(220, 220, 200, ${Math.random() * 0.3})`;
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
                
                this.canvas.style.transform = `translate(${shake.x}px, ${shake.y}px)`;
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
            div.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            color: ${color};
            font-size: 24px;
            font-weight: bold;
            pointer-events: none;
            z-index: 1000;
            animation: floatUp 1s ease-out forwards;
        `;
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
                console.log(`InputSystem: ${event.changedTouches.length} touch(es) started`);
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
                console.log(`InputSystem: Touch ended, ${this.touches.size} active touches`);
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
                console.log(`InputSystem: Mouse down at ${canvasCoords.x}, ${canvasCoords.y}`);
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
                console.log(`InputSystem: Canvas resized to ${this.canvas.width}x${this.canvas.height}`);
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
                        console.log(`Performance level changed: ${oldLevel} → ${dominantLevel}`);
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
                        console.error(`Error in performance monitor ${event} callback:`, error);
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
         * Get container CSS styles based on position
         */
        getContainerStyles() {
            const baseStyles = `
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
        `;
            
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
            section.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">🎯 Performance</div>
            <div>FPS: <span id="perf-fps">--</span></div>
            <div>Avg: <span id="perf-avg-fps">--</span></div>
            <div>Min: <span id="perf-min-fps">--</span></div>
            <div>Frame: <span id="perf-frame-time">--</span>ms</div>
            <div>Drops: <span id="perf-drops">--</span></div>
        `;
            
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
            section.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">⚙️ Quality</div>
            <div>Level: <span id="perf-quality-level">--</span></div>
            <div>Particles: <span id="perf-max-particles">--</span></div>
            <div>Shadows: <span id="perf-shadows">--</span></div>
            <div>Effects: <span id="perf-effects">--</span></div>
        `;
            
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
            section.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">🎱 Object Pools</div>
            <div id="perf-pools-content">
                <!-- Pool stats will be inserted here -->
            </div>
        `;
            
            this.container.appendChild(section);
            this.elements.poolsContent = document.getElementById('perf-pools-content');
        }
        
        /**
         * Create detailed metrics section
         */
        createDetailsSection() {
            const section = document.createElement('div');
            section.style.marginTop = '10px';
            section.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">📊 Details</div>
            <div>Memory: <span id="perf-memory">--</span></div>
            <div>Entities: <span id="perf-entities">--</span></div>
            <div>Draw Calls: <span id="perf-draw-calls">--</span></div>
            <div>Performance: <span id="perf-health">--</span></div>
        `;
            
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
            section.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">📈 FPS Graph</div>
            <canvas id="perf-graph" width="180" height="50" style="background: rgba(255,255,255,0.1); border-radius: 3px;"></canvas>
        `;
            
            this.container.appendChild(section);
            this.elements.graph = document.getElementById('perf-graph');
            this.graphCtx = this.elements.graph.getContext('2d');
        }
        
        /**
         * Create toggle button
         */
        createToggleButton() {
            const button = document.createElement('button');
            button.innerHTML = '👁️';
            button.style.cssText = `
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
        `;
            
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
            let html = '';
            
            for (const [name, stats] of Object.entries(poolStats)) {
                const utilization = ((stats.activeCount / (stats.poolSize + stats.activeCount)) * 100).toFixed(0);
                const efficiency = (stats.reuseRatio * 100).toFixed(0);
                
                html += `
                <div style="font-size: 10px; margin: 2px 0;">
                    <div>${name}: ${stats.activeCount}/${stats.poolSize + stats.activeCount}</div>
                    <div style="color: #888;">Use: ${utilization}% | Reuse: ${efficiency}%</div>
                </div>
            `;
            }
            
            if (this.elements.poolsContent) {
                this.elements.poolsContent.innerHTML = html;
            }
        }
        
        /**
         * Update detailed metrics
         */
        updateDetailsDisplay(stats, gameData) {
            if (this.elements.memory && window.performance && window.performance.memory) {
                const mb = (window.performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1);
                this.elements.memory.textContent = `${mb}MB`;
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
            this.unregisterClick = this.inputSystem.onClick((event) => this.handleInput(event));
        }
        
        /**
         * Handle input events
         * @param {Object} event - Input event data
         */
        handleInput(event) {
            if (this.state.gameState !== 'playing' || this.isPaused) return;
            
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
                this.state.addScore(points);
                
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
                
                // Create error particles
                for (let i = 0; i < 3; i++) {
                    const particle = this.poolManager.get('particle',
                        ingredient.x + ingredient.data.size / 2,
                        ingredient.y + ingredient.data.size / 2,
                        '#FF0000',
                        '✗',
                        'default',
                        {}
                    );
                    this.particles.push(particle);
                }
            }
            
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
            
            // Power-up multiplier
            const powerUpMultiplier = this.state.activePowerUps.scoreMultiplier.active ? 
                this.state.activePowerUps.scoreMultiplier.multiplier : 1;
            
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
        }
        
        /**
         * Render game state
         */
        render() {
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
        }
        
        /**
         * Main game loop
         * @param {number} currentTime - Current timestamp
         */
        gameLoop(currentTime) {
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
                powerUpStatus.innerHTML = '';
                
                for (const [type, powerUp] of Object.entries(this.state.powerUps)) {
                    if (powerUp.active) {
                        const indicator = document.createElement('div');
                        indicator.className = `power-up-indicator ${type.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase()}`;
                        
                        const powerUpData = PowerUp.getPowerUpTypes()[type];
                        indicator.innerHTML = `
                        <span>${powerUpData.emoji}</span>
                        <span>${powerUpData.name}</span>
                        <span class="power-up-timer">${Math.ceil(powerUp.timeLeft / 1000)}s</span>
                    `;
                        
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
