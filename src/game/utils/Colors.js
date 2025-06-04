/**
 * Color Theme System
 * 
 * Dynamic color management with theme transitions and texture pattern generation.
 * Colors respond to game state (combo level and score) for enhanced visual feedback.
 */

/**
 * Main color theme object with dynamic colors
 */
export const colorTheme = {
    primary: '#FFD700',
    secondary: '#FF6347', 
    accent: '#00FF88',
    warning: '#FF4444',
    hue: 0
};

/**
 * Update color theme based on game state
 * @param {number} combo - Current combo multiplier
 * @param {number} score - Current game score
 * @param {number} frameCount - Current frame count for animations
 */
export function updateColorTheme(combo, score, frameCount) {
    // Base hue changes based on combo level
    const targetHue = Math.min((combo - 1) * 30, 300); // Max 300 degrees for rainbow effect
    colorTheme.hue += (targetHue - colorTheme.hue) * 0.1; // Smooth transition
    
    // Score-based saturation and brightness
    const scoreFactor = Math.min(score / 1000, 1); // Normalize to 0-1
    const saturation = 50 + (scoreFactor * 50); // 50-100%
    const lightness = 45 + (Math.sin(frameCount * 0.05) * 10); // Subtle pulsing 35-55%
    
    // Update theme colors
    colorTheme.primary = `hsl(${colorTheme.hue + 45}, ${saturation}%, ${lightness + 15}%)`;
    colorTheme.secondary = `hsl(${colorTheme.hue + 15}, ${saturation}%, ${lightness}%)`;
    colorTheme.accent = `hsl(${colorTheme.hue + 120}, ${saturation}%, ${lightness}%)`;
    colorTheme.warning = `hsl(${0}, ${saturation + 20}%, ${lightness}%)`;
}

/**
 * Power-up specific colors
 */
export const powerUpColors = {
    speedBoost: '#FFD700',
    timeFreeze: '#87CEEB', 
    scoreMultiplier: '#FF69B4'
};

/**
 * Create texture patterns for visual enhancement
 * @param {CanvasRenderingContext2D} ctx - Canvas context for pattern creation
 * @param {string} type - Type of texture ('wood', 'marble', 'fabric', 'paper')
 * @param {number} size - Size of the pattern (default: 50)
 * @returns {CanvasPattern} Canvas pattern object
 */
export function createTexturePattern(ctx, type, size = 50) {
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
 * Screen flash effect management
 */
export class ScreenFlash {
    constructor() {
        this.color = '#ffffff';
        this.intensity = 0;
        this.duration = 0;
    }
    
    /**
     * Start a screen flash effect
     * @param {string} color - Flash color
     * @param {number} intensity - Flash intensity (0-1)
     * @param {number} duration - Flash duration in frames
     */
    start(color, intensity, duration) {
        this.color = color;
        this.intensity = intensity;
        this.duration = duration;
    }
    
    /**
     * Update flash effect (call each frame)
     */
    update() {
        if (this.duration > 0) {
            this.duration--;
            this.intensity *= 0.85; // Fade out
        }
    }
    
    /**
     * Check if flash is active
     * @returns {boolean} True if flash is active
     */
    isActive() {
        return this.intensity > 0.01;
    }
}

/**
 * Utility functions for color manipulation
 */
export const colorUtils = {
    /**
     * Convert HSL to RGB
     * @param {number} h - Hue (0-360)
     * @param {number} s - Saturation (0-100)
     * @param {number} l - Lightness (0-100)
     * @returns {object} RGB object {r, g, b}
     */
    hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        return {
            r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
            g: Math.round(hue2rgb(p, q, h) * 255),
            b: Math.round(hue2rgb(p, q, h - 1/3) * 255)
        };
    },
    
    /**
     * Add alpha transparency to a color
     * @param {string} color - Color string
     * @param {number} alpha - Alpha value (0-1)
     * @returns {string} Color with alpha
     */
    addAlpha(color, alpha) {
        if (color.startsWith('#')) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        return color; // Return as-is if not hex
    }
};

export default {
    colorTheme,
    updateColorTheme,
    powerUpColors,
    createTexturePattern,
    ScreenFlash,
    colorUtils
};