/**
 * Performance UI Display
 * 
 * Creates a real-time performance monitoring overlay for debugging and optimization.
 * Shows FPS, object pool stats, quality level, and detailed performance metrics.
 */

export class PerformanceUI {
    constructor(options = {}) {
        this.enabled = options.enabled || false;
        this.position = options.position || 'top-left'; // top-left, top-right, bottom-left, bottom-right
        this.updateInterval = options.updateInterval || 250; // ms
        this.maxHistory = options.maxHistory || 100;
        
        // UI elements
        this.container = null;
        this.elements = {};
        
        // Performance data
        this.performanceMonitor = null;
        this.poolManager = null;
        this.fpsHistory = [];
        this.lastUpdate = 0;
        
        // Display options
        this.showFPS = options.showFPS !== false;
        this.showPools = options.showPools !== false;
        this.showQuality = options.showQuality !== false;
        this.showDetails = options.showDetails || false;
        this.showGraph = options.showGraph || false;
        
        if (this.enabled) {
            this.createUI();
        }
    }
    
    /**
     * Initialize with performance monitor and pool manager
     * @param {PerformanceMonitor} performanceMonitor - Performance monitoring system
     * @param {PoolManager} poolManager - Object pool manager
     */
    init(performanceMonitor, poolManager) {
        this.performanceMonitor = performanceMonitor;
        this.poolManager = poolManager;
    }
    
    /**
     * Create the UI overlay
     */
    createUI() {
        // Create container
        this.container = document.createElement('div');
        this.container.id = 'performance-ui';
        this.container.style.cssText = this.getContainerStyles();
        
        // Create sections
        if (this.showFPS) {
            this.createFPSSection();
        }
        
        if (this.showQuality) {
            this.createQualitySection();
        }
        
        if (this.showPools) {
            this.createPoolsSection();
        }
        
        if (this.showDetails) {
            this.createDetailsSection();
        }
        
        if (this.showGraph) {
            this.createGraphSection();
        }
        
        // Add toggle button
        this.createToggleButton();
        
        document.body.appendChild(this.container);
    }
    
    /**
     * Get container CSS styles based on position
     */
    getContainerStyles() {
        const baseStyles = `
            position: fixed;
            z-index: 10000;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            padding: 10px;
            border-radius: 5px;
            min-width: 200px;
            max-width: 300px;
            backdrop-filter: blur(5px);
        `;
        
        const positions = {
            'top-left': 'top: 10px; left: 10px;',
            'top-right': 'top: 10px; right: 10px;',
            'bottom-left': 'bottom: 10px; left: 10px;',
            'bottom-right': 'bottom: 10px; right: 10px;'
        };
        
        return baseStyles + positions[this.position];
    }
    
    /**
     * Create FPS display section
     */
    createFPSSection() {
        const section = document.createElement('div');
        section.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">🎯 Performance</div>
            <div>FPS: <span id="perf-fps">--</span></div>
            <div>Avg: <span id="perf-avg-fps">--</span></div>
            <div>Min: <span id="perf-min-fps">--</span></div>
            <div>Frame: <span id="perf-frame-time">--</span>ms</div>
            <div>Drops: <span id="perf-drops">--</span></div>
        `;
        
        this.container.appendChild(section);
        
        // Store element references
        this.elements.fps = document.getElementById('perf-fps');
        this.elements.avgFps = document.getElementById('perf-avg-fps');
        this.elements.minFps = document.getElementById('perf-min-fps');
        this.elements.frameTime = document.getElementById('perf-frame-time');
        this.elements.drops = document.getElementById('perf-drops');
    }
    
    /**
     * Create quality level section
     */
    createQualitySection() {
        const section = document.createElement('div');
        section.style.marginTop = '10px';
        section.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">⚙️ Quality</div>
            <div>Level: <span id="perf-quality-level">--</span></div>
            <div>Particles: <span id="perf-max-particles">--</span></div>
            <div>Shadows: <span id="perf-shadows">--</span></div>
            <div>Effects: <span id="perf-effects">--</span></div>
        `;
        
        this.container.appendChild(section);
        
        this.elements.qualityLevel = document.getElementById('perf-quality-level');
        this.elements.maxParticles = document.getElementById('perf-max-particles');
        this.elements.shadows = document.getElementById('perf-shadows');
        this.elements.effects = document.getElementById('perf-effects');
    }
    
    /**
     * Create object pools section
     */
    createPoolsSection() {
        const section = document.createElement('div');
        section.style.marginTop = '10px';
        section.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">🎱 Object Pools</div>
            <div id="perf-pools-content">
                <!-- Pool stats will be inserted here -->
            </div>
        `;
        
        this.container.appendChild(section);
        this.elements.poolsContent = document.getElementById('perf-pools-content');
    }
    
    /**
     * Create detailed metrics section
     */
    createDetailsSection() {
        const section = document.createElement('div');
        section.style.marginTop = '10px';
        section.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">📊 Details</div>
            <div>Memory: <span id="perf-memory">--</span></div>
            <div>Entities: <span id="perf-entities">--</span></div>
            <div>Draw Calls: <span id="perf-draw-calls">--</span></div>
            <div>Performance: <span id="perf-health">--</span></div>
        `;
        
        this.container.appendChild(section);
        
        this.elements.memory = document.getElementById('perf-memory');
        this.elements.entities = document.getElementById('perf-entities');
        this.elements.drawCalls = document.getElementById('perf-draw-calls');
        this.elements.health = document.getElementById('perf-health');
    }
    
    /**
     * Create FPS graph section
     */
    createGraphSection() {
        const section = document.createElement('div');
        section.style.marginTop = '10px';
        section.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">📈 FPS Graph</div>
            <canvas id="perf-graph" width="180" height="50" style="background: rgba(255,255,255,0.1); border-radius: 3px;"></canvas>
        `;
        
        this.container.appendChild(section);
        this.elements.graph = document.getElementById('perf-graph');
        this.graphCtx = this.elements.graph.getContext('2d');
    }
    
    /**
     * Create toggle button
     */
    createToggleButton() {
        const button = document.createElement('button');
        button.innerHTML = '👁️';
        button.style.cssText = `
            position: absolute;
            top: -5px;
            right: -5px;
            width: 20px;
            height: 20px;
            border: none;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            font-size: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        button.onclick = () => this.toggle();
        this.container.appendChild(button);
    }
    
    /**
     * Update performance display
     * @param {number} currentTime - Current timestamp
     * @param {object} gameData - Additional game data (entities, etc.)
     */
    update(currentTime, gameData = {}) {
        if (!this.enabled || !this.container || !this.performanceMonitor) return;
        
        // Throttle updates
        if (currentTime - this.lastUpdate < this.updateInterval) return;
        this.lastUpdate = currentTime;
        
        const stats = this.performanceMonitor.getStats();
        const qualitySettings = this.performanceMonitor.getQualitySettings();
        
        // Update FPS data
        if (this.showFPS) {
            this.updateFPSDisplay(stats);
        }
        
        // Update quality data
        if (this.showQuality) {
            this.updateQualityDisplay(stats, qualitySettings);
        }
        
        // Update pool data
        if (this.showPools && this.poolManager) {
            this.updatePoolsDisplay();
        }
        
        // Update detailed metrics
        if (this.showDetails) {
            this.updateDetailsDisplay(stats, gameData);
        }
        
        // Update graph
        if (this.showGraph) {
            this.updateGraph(stats.currentFPS);
        }
    }
    
    /**
     * Update FPS display elements
     */
    updateFPSDisplay(stats) {
        if (this.elements.fps) {
            this.elements.fps.textContent = stats.currentFPS.toFixed(1);
            this.elements.fps.style.color = this.getFPSColor(stats.currentFPS);
        }
        
        if (this.elements.avgFps) {
            this.elements.avgFps.textContent = stats.averageFPS.toFixed(1);
        }
        
        if (this.elements.minFps) {
            this.elements.minFps.textContent = stats.minFPS.toFixed(1);
        }
        
        if (this.elements.frameTime) {
            this.elements.frameTime.textContent = stats.frameTimeMS.toFixed(2);
        }
        
        if (this.elements.drops) {
            this.elements.drops.textContent = stats.droppedFrames;
            this.elements.drops.style.color = stats.droppedFrames > 5 ? '#ff6b6b' : '#51cf66';
        }
    }
    
    /**
     * Update quality display elements
     */
    updateQualityDisplay(stats, qualitySettings) {
        if (this.elements.qualityLevel) {
            this.elements.qualityLevel.textContent = stats.performanceLevel;
            this.elements.qualityLevel.style.color = this.getQualityColor(stats.performanceLevel);
        }
        
        if (this.elements.maxParticles) {
            this.elements.maxParticles.textContent = qualitySettings.maxParticles;
        }
        
        if (this.elements.shadows) {
            this.elements.shadows.textContent = qualitySettings.enableShadows ? '✅' : '❌';
        }
        
        if (this.elements.effects) {
            this.elements.effects.textContent = qualitySettings.enableEffects ? '✅' : '❌';
        }
    }
    
    /**
     * Update pools display
     */
    updatePoolsDisplay() {
        const poolStats = this.poolManager.getStats();
        let html = '';
        
        for (const [name, stats] of Object.entries(poolStats)) {
            const utilization = ((stats.activeCount / (stats.poolSize + stats.activeCount)) * 100).toFixed(0);
            const efficiency = (stats.reuseRatio * 100).toFixed(0);
            
            html += `
                <div style="font-size: 10px; margin: 2px 0;">
                    <div>${name}: ${stats.activeCount}/${stats.poolSize + stats.activeCount}</div>
                    <div style="color: #888;">Use: ${utilization}% | Reuse: ${efficiency}%</div>
                </div>
            `;
        }
        
        if (this.elements.poolsContent) {
            this.elements.poolsContent.innerHTML = html;
        }
    }
    
    /**
     * Update detailed metrics
     */
    updateDetailsDisplay(stats, gameData) {
        if (this.elements.memory && window.performance && window.performance.memory) {
            const mb = (window.performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1);
            this.elements.memory.textContent = `${mb}MB`;
        }
        
        if (this.elements.entities) {
            const entityCount = (gameData.particles || []).length + 
                              (gameData.ingredients || []).length + 
                              (gameData.powerUps || []).length;
            this.elements.entities.textContent = entityCount;
        }
        
        if (this.elements.drawCalls && gameData.renderer) {
            const rendererStats = gameData.renderer.getStats();
            this.elements.drawCalls.textContent = rendererStats.drawCalls || '--';
        }
        
        if (this.elements.health) {
            const isHealthy = this.performanceMonitor.isPerformanceGood();
            this.elements.health.textContent = isHealthy ? '✅ Good' : '⚠️ Poor';
            this.elements.health.style.color = isHealthy ? '#51cf66' : '#ff6b6b';
        }
    }
    
    /**
     * Update FPS graph
     */
    updateGraph(currentFPS) {
        if (!this.graphCtx) return;
        
        this.fpsHistory.push(currentFPS);
        if (this.fpsHistory.length > this.maxHistory) {
            this.fpsHistory.shift();
        }
        
        // Clear canvas
        this.graphCtx.clearRect(0, 0, 180, 50);
        
        // Draw grid
        this.graphCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.graphCtx.lineWidth = 1;
        for (let i = 0; i <= 50; i += 10) {
            this.graphCtx.beginPath();
            this.graphCtx.moveTo(0, i);
            this.graphCtx.lineTo(180, i);
            this.graphCtx.stroke();
        }
        
        // Draw FPS line
        if (this.fpsHistory.length > 1) {
            this.graphCtx.strokeStyle = '#51cf66';
            this.graphCtx.lineWidth = 2;
            this.graphCtx.beginPath();
            
            for (let i = 0; i < this.fpsHistory.length; i++) {
                const x = (i / this.fpsHistory.length) * 180;
                const y = 50 - (this.fpsHistory[i] / 60) * 50; // Assume 60 FPS max
                
                if (i === 0) {
                    this.graphCtx.moveTo(x, y);
                } else {
                    this.graphCtx.lineTo(x, y);
                }
            }
            
            this.graphCtx.stroke();
        }
        
        // Draw 60 FPS reference line
        this.graphCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.graphCtx.lineWidth = 1;
        this.graphCtx.setLineDash([2, 2]);
        this.graphCtx.beginPath();
        this.graphCtx.moveTo(0, 0);
        this.graphCtx.lineTo(180, 0);
        this.graphCtx.stroke();
        this.graphCtx.setLineDash([]);
    }
    
    /**
     * Get color for FPS display
     */
    getFPSColor(fps) {
        if (fps >= 55) return '#51cf66'; // Green
        if (fps >= 45) return '#ffd43b'; // Yellow
        if (fps >= 30) return '#ff8c42'; // Orange
        return '#ff6b6b'; // Red
    }
    
    /**
     * Get color for quality level display
     */
    getQualityColor(level) {
        const colors = {
            'high': '#51cf66',
            'medium': '#ffd43b',
            'low': '#ff8c42',
            'critical': '#ff6b6b'
        };
        return colors[level] || '#ffffff';
    }
    
    /**
     * Toggle UI visibility
     */
    toggle() {
        if (this.container) {
            this.enabled = !this.enabled;
            this.container.style.display = this.enabled ? 'block' : 'none';
        }
    }
    
    /**
     * Show the UI
     */
    show() {
        this.enabled = true;
        if (this.container) {
            this.container.style.display = 'block';
        } else {
            this.createUI();
        }
    }
    
    /**
     * Hide the UI
     */
    hide() {
        this.enabled = false;
        if (this.container) {
            this.container.style.display = 'none';
        }
    }
    
    /**
     * Destroy the UI
     */
    destroy() {
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
        this.elements = {};
    }
    
    /**
     * Set position of the UI
     * @param {string} position - New position (top-left, top-right, bottom-left, bottom-right)
     */
    setPosition(position) {
        this.position = position;
        if (this.container) {
            const styles = this.getContainerStyles();
            this.container.style.cssText = styles;
        }
    }
    
    /**
     * Configure which sections to show
     * @param {object} options - Display options
     */
    configure(options) {
        Object.assign(this, options);
        
        if (this.container) {
            this.container.remove();
            this.createUI();
        }
    }
}

export default PerformanceUI;