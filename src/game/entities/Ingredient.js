/**
 * Ingredient Entity
 * 
 * Represents falling burger ingredients with physics simulation, trail effects,
 * and visual variants. Includes integration with power-up system.
 */

import { easing } from '../utils/Easing.js';

/**
 * Ingredient type configurations
 */
export const ingredientTypes = {
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

export class Ingredient {
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
    update(frameCount, gameState, deltaTime = 1/60) {
        this.animationTime += deltaTime;
        
        // Apply speed boost power-up if available
        let speedMultiplier = 1;
        if (gameState && gameState.isPowerUpActive && gameState.isPowerUpActive('speedBoost')) {
            speedMultiplier = gameState.powerUps.speedBoost.multiplier;
        }
        this.speed = this.baseSpeed * speedMultiplier;
        
        // Smooth falling motion with easing
        this.fallProgress += 0.02;
        const fallEase = easing.easeInQuad(Math.min(this.fallProgress, 1));
        this.y += this.speed * (0.5 + fallEase * 0.5) * deltaTime * 60;
        
        // Add subtle horizontal sway
        const swayAmount = Math.sin(frameCount * 0.05 + this.sway * Math.PI) * 0.5;
        this.x += swayAmount * deltaTime * 60;
        
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
            
            // Validate point coordinates
            if (!isFinite(point.x) || !isFinite(point.y) || 
                !isFinite(nextPoint.x) || !isFinite(nextPoint.y)) {
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

export default Ingredient;