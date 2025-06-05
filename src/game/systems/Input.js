/**
 * InputSystem - Handles all user input for the game
 * 
 * Features:
 * - Unified touch and mouse event handling
 * - Canvas coordinate transformation
 * - Mobile-optimized touch handling
 * - Event delegation for game entities
 * - Scroll prevention on mobile devices
 * - Automatic cleanup on destruction
 */
export class InputSystem {
    /**
     * Creates a new InputSystem instance
     * @param {HTMLCanvasElement} canvas - The game canvas element
     * @param {Object} options - Configuration options
     * @param {boolean} options.preventScroll - Whether to prevent document scrolling on mobile
     * @param {boolean} options.debug - Enable debug logging
     */
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.options = {
            preventScroll: true,
            debug: false,
            ...options
        };
        
        // Input state
        this.touches = new Map(); // Track active touches
        this.mousePosition = { x: 0, y: 0 };
        this.isMouseDown = false;
        
        // Event handlers (bound to preserve context)
        this.boundHandlers = {
            handleTouchStart: this.handleTouchStart.bind(this),
            handleTouchMove: this.handleTouchMove.bind(this),
            handleTouchEnd: this.handleTouchEnd.bind(this),
            handleMouseDown: this.handleMouseDown.bind(this),
            handleMouseMove: this.handleMouseMove.bind(this),
            handleMouseUp: this.handleMouseUp.bind(this),
            handleContextMenu: this.handleContextMenu.bind(this),
            preventScroll: this.preventScroll.bind(this),
            handleResize: this.handleResize.bind(this)
        };
        
        // Click/tap callbacks
        this.clickHandlers = [];
        this.moveHandlers = [];
        this.resizeHandlers = [];
        
        // Canvas bounds cache
        this.canvasBounds = null;
        this.updateCanvasBounds();
        
        this.setupEventListeners();
    }
    
    /**
     * Sets up all event listeners
     * @private
     */
    setupEventListeners() {
        // Touch events
        this.canvas.addEventListener('touchstart', this.boundHandlers.handleTouchStart, { passive: false });
        this.canvas.addEventListener('touchmove', this.boundHandlers.handleTouchMove, { passive: false });
        this.canvas.addEventListener('touchend', this.boundHandlers.handleTouchEnd, { passive: false });
        this.canvas.addEventListener('touchcancel', this.boundHandlers.handleTouchEnd, { passive: false });
        
        // Mouse events
        this.canvas.addEventListener('mousedown', this.boundHandlers.handleMouseDown);
        this.canvas.addEventListener('mousemove', this.boundHandlers.handleMouseMove);
        this.canvas.addEventListener('mouseup', this.boundHandlers.handleMouseUp);
        this.canvas.addEventListener('mouseleave', this.boundHandlers.handleMouseUp);
        
        // Prevent context menu on right-click
        this.canvas.addEventListener('contextmenu', this.boundHandlers.handleContextMenu);
        
        // Prevent scrolling on mobile
        if (this.options.preventScroll) {
            document.body.addEventListener('touchmove', this.boundHandlers.preventScroll, { passive: false });
        }
        
        // Window resize
        window.addEventListener('resize', this.boundHandlers.handleResize);
        
        if (this.options.debug) {
            console.log('InputSystem: Event listeners attached');
        }
    }
    
    /**
     * Updates cached canvas bounds
     * @private
     */
    updateCanvasBounds() {
        this.canvasBounds = this.canvas.getBoundingClientRect();
    }
    
    /**
     * Converts client coordinates to canvas coordinates
     * @param {number} clientX - Client X coordinate
     * @param {number} clientY - Client Y coordinate
     * @returns {{x: number, y: number}} Canvas coordinates
     */
    clientToCanvas(clientX, clientY) {
        const bounds = this.canvasBounds || this.canvas.getBoundingClientRect();
        
        // Account for canvas scaling
        const scaleX = this.canvas.width / bounds.width;
        const scaleY = this.canvas.height / bounds.height;
        
        return {
            x: (clientX - bounds.left) * scaleX,
            y: (clientY - bounds.top) * scaleY
        };
    }
    
    /**
     * Handles touch start events
     * @param {TouchEvent} event - The touch event
     * @private
     */
    handleTouchStart(event) {
        event.preventDefault();
        
        for (const touch of event.changedTouches) {
            const canvasCoords = this.clientToCanvas(touch.clientX, touch.clientY);
            
            this.touches.set(touch.identifier, {
                id: touch.identifier,
                startX: canvasCoords.x,
                startY: canvasCoords.y,
                currentX: canvasCoords.x,
                currentY: canvasCoords.y,
                startTime: Date.now()
            });
            
            // Trigger click handlers for touch start
            this.triggerClick(canvasCoords.x, canvasCoords.y, 'touch');
        }
        
        if (this.options.debug) {
            console.log(`InputSystem: ${event.changedTouches.length} touch(es) started`);
        }
    }
    
    /**
     * Handles touch move events
     * @param {TouchEvent} event - The touch event
     * @private
     */
    handleTouchMove(event) {
        event.preventDefault();
        
        for (const touch of event.changedTouches) {
            const touchData = this.touches.get(touch.identifier);
            if (touchData) {
                const canvasCoords = this.clientToCanvas(touch.clientX, touch.clientY);
                touchData.currentX = canvasCoords.x;
                touchData.currentY = canvasCoords.y;
                
                // Trigger move handlers
                this.triggerMove(canvasCoords.x, canvasCoords.y, 'touch');
            }
        }
    }
    
    /**
     * Handles touch end events
     * @param {TouchEvent} event - The touch event
     * @private
     */
    handleTouchEnd(event) {
        event.preventDefault();
        
        for (const touch of event.changedTouches) {
            this.touches.delete(touch.identifier);
        }
        
        if (this.options.debug) {
            console.log(`InputSystem: Touch ended, ${this.touches.size} active touches`);
        }
    }
    
    /**
     * Handles mouse down events
     * @param {MouseEvent} event - The mouse event
     * @private
     */
    handleMouseDown(event) {
        const canvasCoords = this.clientToCanvas(event.clientX, event.clientY);
        this.isMouseDown = true;
        this.mousePosition = canvasCoords;
        
        // Trigger click handlers for mouse down
        this.triggerClick(canvasCoords.x, canvasCoords.y, 'mouse');
        
        if (this.options.debug) {
            console.log(`InputSystem: Mouse down at ${canvasCoords.x}, ${canvasCoords.y}`);
        }
    }
    
    /**
     * Handles mouse move events
     * @param {MouseEvent} event - The mouse event
     * @private
     */
    handleMouseMove(event) {
        const canvasCoords = this.clientToCanvas(event.clientX, event.clientY);
        this.mousePosition = canvasCoords;
        
        if (this.isMouseDown) {
            this.triggerMove(canvasCoords.x, canvasCoords.y, 'mouse');
        }
    }
    
    /**
     * Handles mouse up events
     * @param {MouseEvent} event - The mouse event
     * @private
     */
    handleMouseUp(event) {
        this.isMouseDown = false;
        
        if (this.options.debug) {
            console.log('InputSystem: Mouse up');
        }
    }
    
    /**
     * Prevents context menu
     * @param {Event} event - The context menu event
     * @private
     */
    handleContextMenu(event) {
        event.preventDefault();
    }
    
    /**
     * Prevents document scrolling
     * @param {TouchEvent} event - The touch event
     * @private
     */
    preventScroll(event) {
        if (event.target === this.canvas || this.canvas.contains(event.target)) {
            event.preventDefault();
        }
    }
    
    /**
     * Handles window resize
     * @param {Event} event - The resize event
     * @private
     */
    handleResize(event) {
        this.updateCanvasBounds();
        
        // Trigger resize handlers
        for (const handler of this.resizeHandlers) {
            handler(this.canvas.width, this.canvas.height);
        }
        
        if (this.options.debug) {
            console.log(`InputSystem: Canvas resized to ${this.canvas.width}x${this.canvas.height}`);
        }
    }
    
    /**
     * Triggers click handlers
     * @param {number} x - Canvas X coordinate
     * @param {number} y - Canvas Y coordinate
     * @param {string} type - Input type ('touch' or 'mouse')
     * @private
     */
    triggerClick(x, y, type) {
        for (const handler of this.clickHandlers) {
            const handled = handler(x, y, type);
            if (handled) break; // Stop propagation if handler returns true
        }
    }
    
    /**
     * Triggers move handlers
     * @param {number} x - Canvas X coordinate
     * @param {number} y - Canvas Y coordinate
     * @param {string} type - Input type ('touch' or 'mouse')
     * @private
     */
    triggerMove(x, y, type) {
        for (const handler of this.moveHandlers) {
            handler(x, y, type);
        }
    }
    
    /**
     * Registers a click/tap handler
     * @param {Function} handler - Handler function (x, y, type) => boolean
     * @returns {Function} Unregister function
     */
    onClick(handler) {
        this.clickHandlers.push(handler);
        
        // Return unregister function
        return () => {
            const index = this.clickHandlers.indexOf(handler);
            if (index !== -1) {
                this.clickHandlers.splice(index, 1);
            }
        };
    }
    
    /**
     * Registers a move handler
     * @param {Function} handler - Handler function (x, y, type) => void
     * @returns {Function} Unregister function
     */
    onMove(handler) {
        this.moveHandlers.push(handler);
        
        // Return unregister function
        return () => {
            const index = this.moveHandlers.indexOf(handler);
            if (index !== -1) {
                this.moveHandlers.splice(index, 1);
            }
        };
    }
    
    /**
     * Registers a resize handler
     * @param {Function} handler - Handler function (width, height) => void
     * @returns {Function} Unregister function
     */
    onResize(handler) {
        this.resizeHandlers.push(handler);
        
        // Return unregister function
        return () => {
            const index = this.resizeHandlers.indexOf(handler);
            if (index !== -1) {
                this.resizeHandlers.splice(index, 1);
            }
        };
    }
    
    /**
     * Gets current touch points
     * @returns {Array} Array of active touch points
     */
    getTouches() {
        return Array.from(this.touches.values());
    }
    
    /**
     * Gets current mouse position
     * @returns {{x: number, y: number}} Mouse position in canvas coordinates
     */
    getMousePosition() {
        return { ...this.mousePosition };
    }
    
    /**
     * Checks if a point is being touched/clicked
     * @param {number} x - X coordinate to check
     * @param {number} y - Y coordinate to check
     * @param {number} radius - Radius around the point to check
     * @returns {boolean} True if point is being interacted with
     */
    isPointActive(x, y, radius = 0) {
        // Check mouse
        if (this.isMouseDown) {
            const dx = this.mousePosition.x - x;
            const dy = this.mousePosition.y - y;
            if (Math.sqrt(dx * dx + dy * dy) <= radius) {
                return true;
            }
        }
        
        // Check touches
        for (const touch of this.touches.values()) {
            const dx = touch.currentX - x;
            const dy = touch.currentY - y;
            if (Math.sqrt(dx * dx + dy * dy) <= radius) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Removes all event listeners and cleans up
     */
    destroy() {
        // Remove canvas event listeners
        this.canvas.removeEventListener('touchstart', this.boundHandlers.handleTouchStart);
        this.canvas.removeEventListener('touchmove', this.boundHandlers.handleTouchMove);
        this.canvas.removeEventListener('touchend', this.boundHandlers.handleTouchEnd);
        this.canvas.removeEventListener('touchcancel', this.boundHandlers.handleTouchEnd);
        this.canvas.removeEventListener('mousedown', this.boundHandlers.handleMouseDown);
        this.canvas.removeEventListener('mousemove', this.boundHandlers.handleMouseMove);
        this.canvas.removeEventListener('mouseup', this.boundHandlers.handleMouseUp);
        this.canvas.removeEventListener('mouseleave', this.boundHandlers.handleMouseUp);
        this.canvas.removeEventListener('contextmenu', this.boundHandlers.handleContextMenu);
        
        // Remove document event listeners
        if (this.options.preventScroll) {
            document.body.removeEventListener('touchmove', this.boundHandlers.preventScroll);
        }
        
        // Remove window event listeners
        window.removeEventListener('resize', this.boundHandlers.handleResize);
        
        // Clear handlers
        this.clickHandlers = [];
        this.moveHandlers = [];
        this.resizeHandlers = [];
        
        // Clear state
        this.touches.clear();
        
        if (this.options.debug) {
            console.log('InputSystem: Destroyed and cleaned up');
        }
    }
}