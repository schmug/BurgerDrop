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
     * Helper function to create elements safely
     */
    createElement(tag, className = null, textContent = null) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (textContent) element.textContent = textContent;
        return element;
    }
    
    /**
     * Helper function to create labeled value element
     */
    createLabeledValue(label, id) {
        const container = document.createElement('div');
        container.textContent = label + ': ';
        const span = document.createElement('span');
        span.id = id;
        span.textContent = '--';
        container.appendChild(span);
        return container;
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
        
        // Create title
        const title = this.createElement('div');
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '5px';
        title.textContent = '🎯 Performance';
        section.appendChild(title);
        
        // Create metric elements with direct references
        const fpsDiv = this.createLabeledValue('FPS', 'perf-fps');
        const avgDiv = this.createLabeledValue('Avg', 'perf-avg-fps');
        const minDiv = this.createLabeledValue('Min', 'perf-min-fps');
        const frameDiv = this.createLabeledValue('Frame', 'perf-frame-time');
        frameDiv.appendChild(document.createTextNode('ms'));
        const dropsDiv = this.createLabeledValue('Drops', 'perf-drops');
        
        section.appendChild(fpsDiv);
        section.appendChild(avgDiv);
        section.appendChild(minDiv);
        section.appendChild(frameDiv);
        section.appendChild(dropsDiv);
        
        this.container.appendChild(section);
        
        // Store element references directly
        this.elements.fps = fpsDiv.querySelector('span');
        this.elements.avgFps = avgDiv.querySelector('span');
        this.elements.minFps = minDiv.querySelector('span');
        this.elements.frameTime = frameDiv.querySelector('span');
        this.elements.drops = dropsDiv.querySelector('span');
    }
    
    /**
     * Create quality level section
     */
    createQualitySection() {
        const section = document.createElement('div');
        section.style.marginTop = '10px';
        
        // Create title
        const title = this.createElement('div');
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '5px';
        title.textContent = '⚙️ Quality';
        section.appendChild(title);
        
        // Create metric elements with direct references
        const levelDiv = this.createLabeledValue('Level', 'perf-quality-level');
        const particlesDiv = this.createLabeledValue('Particles', 'perf-max-particles');
        const shadowsDiv = this.createLabeledValue('Shadows', 'perf-shadows');
        const effectsDiv = this.createLabeledValue('Effects', 'perf-effects');
        
        section.appendChild(levelDiv);
        section.appendChild(particlesDiv);
        section.appendChild(shadowsDiv);
        section.appendChild(effectsDiv);
        
        this.container.appendChild(section);
        
        // Store element references directly
        this.elements.qualityLevel = levelDiv.querySelector('span');
        this.elements.maxParticles = particlesDiv.querySelector('span');
        this.elements.shadows = shadowsDiv.querySelector('span');
        this.elements.effects = effectsDiv.querySelector('span');
    }
    
    /**
     * Create object pools section
     */
    createPoolsSection() {
        const section = document.createElement('div');
        section.style.marginTop = '10px';
        
        // Create title
        const title = this.createElement('div');
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '5px';
        title.textContent = '🎱 Object Pools';
        section.appendChild(title);
        
        // Create content container
        const content = document.createElement('div');
        content.id = 'perf-pools-content';
        section.appendChild(content);
        
        this.container.appendChild(section);
        
        // Store element reference directly
        this.elements.poolsContent = content;
    }
    
    /**
     * Create detailed metrics section
     */
    createDetailsSection() {
        const section = document.createElement('div');
        section.style.marginTop = '10px';
        
        // Create title
        const title = this.createElement('div');
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '5px';
        title.textContent = '📊 Details';
        section.appendChild(title);
        
        // Create metric elements with direct references
        const memoryDiv = this.createLabeledValue('Memory', 'perf-memory');
        const entitiesDiv = this.createLabeledValue('Entities', 'perf-entities');
        const drawCallsDiv = this.createLabeledValue('Draw Calls', 'perf-draw-calls');
        const healthDiv = this.createLabeledValue('Performance', 'perf-health');
        
        section.appendChild(memoryDiv);
        section.appendChild(entitiesDiv);
        section.appendChild(drawCallsDiv);
        section.appendChild(healthDiv);
        
        this.container.appendChild(section);
        
        // Store element references directly
        this.elements.memory = memoryDiv.querySelector('span');
        this.elements.entities = entitiesDiv.querySelector('span');
        this.elements.drawCalls = drawCallsDiv.querySelector('span');
        this.elements.health = healthDiv.querySelector('span');
    }
    
    /**
     * Create FPS graph section
     */
    createGraphSection() {
        const section = document.createElement('div');
        section.style.marginTop = '10px';
        
        // Create title
        const title = this.createElement('div');
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '5px';
        title.textContent = '📈 FPS Graph';
        section.appendChild(title);
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.id = 'perf-graph';
        canvas.width = 180;
        canvas.height = 50;
        canvas.style.background = 'rgba(255,255,255,0.1)';
        canvas.style.borderRadius = '3px';
        section.appendChild(canvas);
        
        this.container.appendChild(section);
        
        // Store element reference directly
        this.elements.graph = canvas;
        this.graphCtx = canvas.getContext('2d');
    }
    
    /**
     * Create toggle button
     */
    createToggleButton() {
        const button = document.createElement('button');
        button.textContent = '👁️';
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
        
        if (this.elements.poolsContent) {
            // Clear existing content
            while (this.elements.poolsContent.firstChild) {
                this.elements.poolsContent.removeChild(this.elements.poolsContent.firstChild);
            }
            
            // Create pool stat elements
            for (const [name, stats] of Object.entries(poolStats)) {
                const utilization = ((stats.activeCount / (stats.poolSize + stats.activeCount)) * 100).toFixed(0);
                const efficiency = (stats.reuseRatio * 100).toFixed(0);
                
                const poolDiv = document.createElement('div');
                poolDiv.style.fontSize = '10px';
                poolDiv.style.margin = '2px 0';
                
                const nameDiv = document.createElement('div');
                nameDiv.textContent = `${name}: ${stats.activeCount}/${stats.poolSize + stats.activeCount}`;
                poolDiv.appendChild(nameDiv);
                
                const statsDiv = document.createElement('div');
                statsDiv.style.color = '#888';
                statsDiv.textContent = `Use: ${utilization}% | Reuse: ${efficiency}%`;
                poolDiv.appendChild(statsDiv);
                
                this.elements.poolsContent.appendChild(poolDiv);
            }
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