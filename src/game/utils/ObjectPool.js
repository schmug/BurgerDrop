/**
 * Object Pool Utility
 * 
 * Manages pools of reusable objects to reduce garbage collection pressure
 * and improve performance, especially on mobile devices.
 */

export class ObjectPool {
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
export class PoolManager {
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

export default ObjectPool;