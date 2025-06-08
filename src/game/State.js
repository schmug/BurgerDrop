<<<<<<< HEAD
/**
 * Game State Management
 * 
 * Centralized state management system replacing global variables.
 * Provides event-driven architecture with validation and debugging capabilities.
 */

export class GameState {
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
        try {
            return parseInt(localStorage.getItem('burgerDropHighScore') || '0');
        } catch (e) {
            console.warn('Could not load high score from localStorage');
            return 0;
        }
    }

    saveHighScore() {
        try {
            localStorage.setItem('burgerDropHighScore', this.core.highScore.toString());
        } catch (e) {
            console.warn('Could not save high score to localStorage');
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

=======
/**
 * Game State Management
 * 
 * Centralized state management system replacing global variables.
 * Provides event-driven architecture with validation and debugging capabilities.
*/

import { isLocalStorageAvailable } from './utils/Storage.js';

export class GameState {
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

>>>>>>> origin/main
export default GameState;