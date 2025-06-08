/**
 * PowerUp Entity
 * 
 * Represents collectible power-ups that provide temporary game advantages.
 * Supports multiple types: speedBoost (slow motion), timeFreeze, and scoreMultiplier.
 */

/**
 * Power-up type configurations
 */
export const powerUpTypes = {
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

export class PowerUp {
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

export default PowerUp;