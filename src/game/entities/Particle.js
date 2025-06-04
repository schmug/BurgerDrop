/**
 * Particle Entity
 * 
 * Represents visual effect particles with physics simulation.
 * Supports multiple types: default, celebration, star, circle, triangle.
 * Includes gravity, bouncing, rotation, and easing animations.
 */

import { easing } from '../utils/Easing.js';

export class Particle {
    /**
     * Create a new particle
     * @param {number} x - Initial x position
     * @param {number} y - Initial y position
     * @param {string} color - Particle color
     * @param {string} text - Optional text/emoji to display
     * @param {string} type - Particle type ('default', 'celebration', 'star', 'circle', 'triangle')
     * @param {object} options - Additional options
     */
    constructor(x, y, color, text = '', type = 'default', options = {}) {
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

export default Particle;