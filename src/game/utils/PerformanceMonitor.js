/**
 * Performance Monitor
 * 
 * Monitors frame rate and performance metrics to enable adaptive quality
 * and provide insights into performance bottlenecks for mobile optimization.
 */

export class PerformanceMonitor {
    constructor(options = {}) {
        this.enabled = options.enabled !== false;
        this.sampleSize = options.sampleSize || 60; // Track last 60 frames
        this.targetFPS = options.targetFPS || 60;
        this.lowFPSThreshold = options.lowFPSThreshold || 45;
        this.criticalFPSThreshold = options.criticalFPSThreshold || 30;
        
        // Frame timing arrays
        this.frameTimes = [];
        this.lastFrameTime = 0;
        this.frameCount = 0;
        
        // Performance statistics
        this.stats = {
            currentFPS: 60,
            averageFPS: 60,
            minFPS: 60,
            maxFPS: 60,
            frameTimeMS: 16.67,
            droppedFrames: 0,
            performanceLevel: 'high' // high, medium, low, critical
        };
        
        // Performance level history for stability
        this.performanceLevels = [];
        this.levelChangeDelay = options.levelChangeDelay || 120; // Frames to wait before changing level
        
        // Quality settings per performance level
        this.qualitySettings = {
            high: {
                maxParticles: 200,
                enableShadows: true,
                enableTextures: true,
                enableEffects: true,
                particleDetail: 1.0,
                renderScale: 1.0
            },
            medium: {
                maxParticles: 100,
                enableShadows: true,
                enableTextures: true,
                enableEffects: true,
                particleDetail: 0.8,
                renderScale: 1.0
            },
            low: {
                maxParticles: 50,
                enableShadows: false,
                enableTextures: false,
                enableEffects: true,
                particleDetail: 0.6,
                renderScale: 0.9
            },
            critical: {
                maxParticles: 25,
                enableShadows: false,
                enableTextures: false,
                enableEffects: false,
                particleDetail: 0.4,
                renderScale: 0.8
            }
        };
        
        // Event callbacks
        this.callbacks = {
            performanceLevelChanged: [],
            frameDropDetected: [],
            statsUpdated: []
        };
        
        // Debug mode
        this.debugMode = options.debugMode || false;
    }
    
    /**
     * Start monitoring (call once per frame)
     * @param {number} currentTime - Current timestamp
     */
    update(currentTime) {
        if (!this.enabled) return;
        
        if (this.lastFrameTime === 0) {
            this.lastFrameTime = currentTime;
            return;
        }
        
        const frameTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        this.frameCount++;
        
        // Add frame time to samples
        this.frameTimes.push(frameTime);
        if (this.frameTimes.length > this.sampleSize) {
            this.frameTimes.shift();
        }
        
        // Update statistics
        this.updateStats();
        
        // Check for performance level changes
        this.checkPerformanceLevel();
        
        // Emit callbacks
        this.emit('statsUpdated', this.stats);
    }
    
    /**
     * Update performance statistics
     */
    updateStats() {
        if (this.frameTimes.length === 0) return;
        
        const times = this.frameTimes;
        const frameTimeMS = times[times.length - 1];
        
        // Calculate FPS metrics
        const currentFPS = Math.min(1000 / frameTimeMS, this.targetFPS);
        const averageFrameTime = times.reduce((sum, time) => sum + time, 0) / times.length;
        const averageFPS = Math.min(1000 / averageFrameTime, this.targetFPS);
        const minFPS = Math.min(1000 / Math.max(...times), this.targetFPS);
        const maxFPS = Math.min(1000 / Math.min(...times), this.targetFPS);
        
        // Count dropped frames (frames longer than target)
        const targetFrameTime = 1000 / this.targetFPS;
        const droppedFrames = times.filter(time => time > targetFrameTime * 1.5).length;
        
        this.stats = {
            currentFPS: Math.round(currentFPS * 10) / 10,
            averageFPS: Math.round(averageFPS * 10) / 10,
            minFPS: Math.round(minFPS * 10) / 10,
            maxFPS: Math.round(maxFPS * 10) / 10,
            frameTimeMS: Math.round(frameTimeMS * 100) / 100,
            droppedFrames,
            performanceLevel: this.stats.performanceLevel
        };
        
        // Detect frame drops
        if (frameTimeMS > targetFrameTime * 2) {
            this.emit('frameDropDetected', { frameTime: frameTimeMS, targetTime: targetFrameTime });
        }
    }
    
    /**
     * Check if performance level should change
     */
    checkPerformanceLevel() {
        let newLevel = this.determinePerformanceLevel();
        
        // Add to history
        this.performanceLevels.push(newLevel);
        if (this.performanceLevels.length > this.levelChangeDelay) {
            this.performanceLevels.shift();
        }
        
        // Only change level if it's been consistent
        if (this.performanceLevels.length >= this.levelChangeDelay) {
            const recentLevels = this.performanceLevels.slice(-30); // Last 30 frames
            const levelCounts = {};
            
            recentLevels.forEach(level => {
                levelCounts[level] = (levelCounts[level] || 0) + 1;
            });
            
            // Find most common level
            const dominantLevel = Object.keys(levelCounts).reduce((a, b) => 
                levelCounts[a] > levelCounts[b] ? a : b
            );
            
            if (dominantLevel !== this.stats.performanceLevel) {
                const oldLevel = this.stats.performanceLevel;
                this.stats.performanceLevel = dominantLevel;
                
                if (this.debugMode) {
                    console.log(`Performance level changed: ${oldLevel} → ${dominantLevel}`);
                }
                
                this.emit('performanceLevelChanged', {
                    oldLevel,
                    newLevel: dominantLevel,
                    settings: this.getQualitySettings()
                });
            }
        }
    }
    
    /**
     * Determine appropriate performance level based on current metrics
     * @returns {string} Performance level
     */
    determinePerformanceLevel() {
        const { averageFPS, droppedFrames } = this.stats;
        const dropRate = droppedFrames / this.sampleSize;
        
        if (averageFPS >= this.targetFPS * 0.9 && dropRate < 0.1) {
            return 'high';
        } else if (averageFPS >= this.lowFPSThreshold && dropRate < 0.2) {
            return 'medium';
        } else if (averageFPS >= this.criticalFPSThreshold && dropRate < 0.4) {
            return 'low';
        } else {
            return 'critical';
        }
    }
    
    /**
     * Get current quality settings
     * @returns {object} Quality settings for current performance level
     */
    getQualitySettings() {
        return { ...this.qualitySettings[this.stats.performanceLevel] };
    }
    
    /**
     * Get performance statistics
     * @returns {object} Current performance stats
     */
    getStats() {
        return { ...this.stats };
    }
    
    /**
     * Check if performance is acceptable
     * @returns {boolean} True if performance is good
     */
    isPerformanceGood() {
        return this.stats.averageFPS >= this.lowFPSThreshold && 
               this.stats.droppedFrames / this.sampleSize < 0.2;
    }
    
    /**
     * Check if performance is critical
     * @returns {boolean} True if performance is critically poor
     */
    isPerformanceCritical() {
        return this.stats.performanceLevel === 'critical';
    }
    
    /**
     * Force a specific performance level
     * @param {string} level - Performance level to set
     */
    setPerformanceLevel(level) {
        if (this.qualitySettings[level]) {
            const oldLevel = this.stats.performanceLevel;
            this.stats.performanceLevel = level;
            
            // Clear history to prevent immediate reversion
            this.performanceLevels = new Array(this.levelChangeDelay).fill(level);
            
            this.emit('performanceLevelChanged', {
                oldLevel,
                newLevel: level,
                settings: this.getQualitySettings(),
                forced: true
            });
        }
    }
    
    /**
     * Reset performance monitoring
     */
    reset() {
        this.frameTimes = [];
        this.lastFrameTime = 0;
        this.frameCount = 0;
        this.performanceLevels = [];
        this.stats = {
            currentFPS: 60,
            averageFPS: 60,
            minFPS: 60,
            maxFPS: 60,
            frameTimeMS: 16.67,
            droppedFrames: 0,
            performanceLevel: 'high'
        };
    }
    
    /**
     * Enable/disable monitoring
     * @param {boolean} enabled - Whether to enable monitoring
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled) {
            this.reset();
        }
    }
    
    /**
     * Set debug mode
     * @param {boolean} debug - Whether to enable debug logging
     */
    setDebugMode(debug) {
        this.debugMode = debug;
    }
    
    /**
     * Add event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    on(event, callback) {
        if (this.callbacks[event]) {
            this.callbacks[event].push(callback);
        }
    }
    
    /**
     * Remove event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function to remove
     */
    off(event, callback) {
        if (this.callbacks[event]) {
            const index = this.callbacks[event].indexOf(callback);
            if (index > -1) {
                this.callbacks[event].splice(index, 1);
            }
        }
    }
    
    /**
     * Emit event to listeners
     * @param {string} event - Event name
     * @param {any} data - Event data
     */
    emit(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in performance monitor ${event} callback:`, error);
                }
            });
        }
    }
    
    /**
     * Get performance report
     * @returns {object} Detailed performance report
     */
    getReport() {
        return {
            enabled: this.enabled,
            frameCount: this.frameCount,
            stats: this.getStats(),
            qualitySettings: this.getQualitySettings(),
            isHealthy: this.isPerformanceGood(),
            isCritical: this.isPerformanceCritical(),
            sampleSize: this.frameTimes.length,
            targetFPS: this.targetFPS
        };
    }
}

export default PerformanceMonitor;