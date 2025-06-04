/**
 * Mathematical Utilities
 * 
 * Common mathematical functions and utilities used throughout the game.
 * Includes physics calculations, random number generation, and geometric functions.
 */

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
export function lerp(start, end, t) {
    return start + (end - start) * t;
}

/**
 * Map a value from one range to another
 * @param {number} value - Value to map
 * @param {number} inMin - Input range minimum
 * @param {number} inMax - Input range maximum
 * @param {number} outMin - Output range minimum
 * @param {number} outMax - Output range maximum
 * @returns {number} Mapped value
 */
export function mapRange(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

/**
 * Calculate distance between two points
 * @param {number} x1 - First point x coordinate
 * @param {number} y1 - First point y coordinate
 * @param {number} x2 - Second point x coordinate
 * @param {number} y2 - Second point y coordinate
 * @returns {number} Distance between points
 */
export function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate squared distance (faster than distance for comparisons)
 * @param {number} x1 - First point x coordinate
 * @param {number} y1 - First point y coordinate
 * @param {number} x2 - Second point x coordinate
 * @param {number} y2 - Second point y coordinate
 * @returns {number} Squared distance between points
 */
export function distanceSquared(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return dx * dx + dy * dy;
}

/**
 * Random number generation utilities
 */
export const random = {
    /**
     * Generate random number between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random number
     */
    between(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    /**
     * Generate random integer between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random integer
     */
    int(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * Choose random element from array
     * @param {Array} array - Array to choose from
     * @returns {*} Random element
     */
    choice(array) {
        return array[Math.floor(Math.random() * array.length)];
    },
    
    /**
     * Generate random boolean with optional probability
     * @param {number} probability - Probability of true (0-1, default: 0.5)
     * @returns {boolean} Random boolean
     */
    boolean(probability = 0.5) {
        return Math.random() < probability;
    },
    
    /**
     * Generate random point within a circle
     * @param {number} centerX - Circle center x
     * @param {number} centerY - Circle center y
     * @param {number} radius - Circle radius
     * @returns {object} Random point {x, y}
     */
    pointInCircle(centerX, centerY, radius) {
        const angle = Math.random() * 2 * Math.PI;
        const r = Math.sqrt(Math.random()) * radius;
        return {
            x: centerX + r * Math.cos(angle),
            y: centerY + r * Math.sin(angle)
        };
    }
};

/**
 * Angle and rotation utilities
 */
export const angles = {
    /**
     * Convert degrees to radians
     * @param {number} degrees - Angle in degrees
     * @returns {number} Angle in radians
     */
    toRadians(degrees) {
        return degrees * Math.PI / 180;
    },
    
    /**
     * Convert radians to degrees
     * @param {number} radians - Angle in radians
     * @returns {number} Angle in degrees
     */
    toDegrees(radians) {
        return radians * 180 / Math.PI;
    },
    
    /**
     * Normalize angle to 0-2π range
     * @param {number} angle - Angle in radians
     * @returns {number} Normalized angle
     */
    normalize(angle) {
        while (angle < 0) angle += 2 * Math.PI;
        while (angle >= 2 * Math.PI) angle -= 2 * Math.PI;
        return angle;
    },
    
    /**
     * Calculate angle between two points
     * @param {number} x1 - First point x
     * @param {number} y1 - First point y
     * @param {number} x2 - Second point x
     * @param {number} y2 - Second point y
     * @returns {number} Angle in radians
     */
    between(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    }
};

/**
 * Physics and motion utilities
 */
export const physics = {
    /**
     * Apply gravity to velocity
     * @param {number} velocity - Current y velocity
     * @param {number} gravity - Gravity force (default: 0.5)
     * @returns {number} New velocity
     */
    applyGravity(velocity, gravity = 0.5) {
        return velocity + gravity;
    },
    
    /**
     * Apply friction to velocity
     * @param {number} velocity - Current velocity
     * @param {number} friction - Friction coefficient (0-1)
     * @returns {number} New velocity
     */
    applyFriction(velocity, friction = 0.9) {
        return velocity * friction;
    },
    
    /**
     * Bounce velocity off a surface
     * @param {number} velocity - Current velocity
     * @param {number} restitution - Bounce factor (0-1)
     * @returns {number} New velocity
     */
    bounce(velocity, restitution = 0.8) {
        return -velocity * restitution;
    },
    
    /**
     * Check if point is within bounds
     * @param {number} x - Point x coordinate
     * @param {number} y - Point y coordinate
     * @param {number} minX - Minimum x bound
     * @param {number} minY - Minimum y bound
     * @param {number} maxX - Maximum x bound
     * @param {number} maxY - Maximum y bound
     * @returns {boolean} True if within bounds
     */
    inBounds(x, y, minX, minY, maxX, maxY) {
        return x >= minX && x <= maxX && y >= minY && y <= maxY;
    }
};

/**
 * Collision detection utilities
 */
export const collision = {
    /**
     * Point-rectangle collision
     * @param {number} px - Point x coordinate
     * @param {number} py - Point y coordinate
     * @param {number} rx - Rectangle x coordinate
     * @param {number} ry - Rectangle y coordinate
     * @param {number} rw - Rectangle width
     * @param {number} rh - Rectangle height
     * @returns {boolean} True if collision detected
     */
    pointRect(px, py, rx, ry, rw, rh) {
        return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
    },
    
    /**
     * Point-circle collision
     * @param {number} px - Point x coordinate
     * @param {number} py - Point y coordinate
     * @param {number} cx - Circle center x
     * @param {number} cy - Circle center y
     * @param {number} radius - Circle radius
     * @returns {boolean} True if collision detected
     */
    pointCircle(px, py, cx, cy, radius) {
        return distanceSquared(px, py, cx, cy) <= radius * radius;
    },
    
    /**
     * Rectangle-rectangle collision
     * @param {number} r1x - First rectangle x
     * @param {number} r1y - First rectangle y
     * @param {number} r1w - First rectangle width
     * @param {number} r1h - First rectangle height
     * @param {number} r2x - Second rectangle x
     * @param {number} r2y - Second rectangle y
     * @param {number} r2w - Second rectangle width
     * @param {number} r2h - Second rectangle height
     * @returns {boolean} True if collision detected
     */
    rectRect(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
        return r1x < r2x + r2w &&
               r1x + r1w > r2x &&
               r1y < r2y + r2h &&
               r1y + r1h > r2y;
    },
    
    /**
     * Circle-circle collision
     * @param {number} x1 - First circle center x
     * @param {number} y1 - First circle center y
     * @param {number} r1 - First circle radius
     * @param {number} x2 - Second circle center x
     * @param {number} y2 - Second circle center y
     * @param {number} r2 - Second circle radius
     * @returns {boolean} True if collision detected
     */
    circleCircle(x1, y1, r1, x2, y2, r2) {
        const minDistance = r1 + r2;
        return distanceSquared(x1, y1, x2, y2) <= minDistance * minDistance;
    }
};

/**
 * Performance optimization utilities
 */
export const performance = {
    /**
     * Pre-calculated sine values for performance
     */
    sinTable: Array.from({ length: 360 }, (_, i) => Math.sin(i * Math.PI / 180)),
    
    /**
     * Pre-calculated cosine values for performance
     */
    cosTable: Array.from({ length: 360 }, (_, i) => Math.cos(i * Math.PI / 180)),
    
    /**
     * Fast sine lookup (approximate)
     * @param {number} degrees - Angle in degrees
     * @returns {number} Sine value
     */
    fastSin(degrees) {
        return this.sinTable[Math.floor(degrees) % 360];
    },
    
    /**
     * Fast cosine lookup (approximate)
     * @param {number} degrees - Angle in degrees
     * @returns {number} Cosine value
     */
    fastCos(degrees) {
        return this.cosTable[Math.floor(degrees) % 360];
    }
};

// Default export with all utilities
export default {
    clamp,
    lerp,
    mapRange,
    distance,
    distanceSquared,
    random,
    angles,
    physics,
    collision,
    performance
};