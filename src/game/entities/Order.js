/**
 * Order Entity
 * 
 * Represents customer orders with time limits and ingredient tracking.
 * Includes visual rendering with progress indication and timer management.
 */

import { ingredientTypes } from './Ingredient.js';

/**
 * Order template configurations
 */
export const orderTemplates = [
    { name: 'Classic Burger', ingredients: ['bun_bottom', 'patty', 'cheese', 'lettuce', 'tomato', 'bun_top'], time: 30 },
    { name: 'Simple Burger', ingredients: ['bun_bottom', 'patty', 'bun_top'], time: 20 },
    { name: 'Cheese Burger', ingredients: ['bun_bottom', 'patty', 'cheese', 'bun_top'], time: 25 },
    { name: 'Veggie Burger', ingredients: ['bun_bottom', 'lettuce', 'tomato', 'onion', 'pickle', 'bun_top'], time: 30 },
    { name: 'Bacon Burger', ingredients: ['bun_bottom', 'patty', 'bacon', 'cheese', 'bun_top'], time: 35 },
    { name: 'Breakfast Burger', ingredients: ['bun_bottom', 'patty', 'egg', 'bacon', 'cheese', 'bun_top'], time: 40 }
];

export class Order {
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

export default Order;