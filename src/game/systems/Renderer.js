/**
 * Renderer System
 * 
 * Comprehensive canvas rendering system with texture patterns, screen effects,
 * custom graphics, and dynamic visual features.
 */

import { colorTheme, createTexturePattern } from '../utils/Colors.js';

export class Renderer {
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

export default Renderer;