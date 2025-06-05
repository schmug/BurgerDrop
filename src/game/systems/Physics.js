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
export const PHYSICS_CONSTANTS = {
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
export class PhysicsSystem {
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
export const physics = new PhysicsSystem();

export default PhysicsSystem;