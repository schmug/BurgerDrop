import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InputSystem } from '../src/game/systems/Input.js';
import { PhysicsSystem, PHYSICS_CONSTANTS } from '../src/game/systems/Physics.js';

describe('InputSystem', () => {
    let canvas;
    let inputSystem;
    let mockRect;

    beforeEach(() => {
        // Create mock canvas
        canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        document.body.appendChild(canvas);

        // Mock getBoundingClientRect
        mockRect = {
            left: 100,
            top: 50,
            width: 800,
            height: 600,
            right: 900,
            bottom: 650
        };
        canvas.getBoundingClientRect = vi.fn(() => mockRect);

        // Create InputSystem instance
        inputSystem = new InputSystem(canvas);
    });

    afterEach(() => {
        if (inputSystem) {
            inputSystem.destroy();
        }
        document.body.removeChild(canvas);
        vi.clearAllMocks();
    });

    describe('Constructor and initialization', () => {
        it('should initialize with default options', () => {
            expect(inputSystem.canvas).toBe(canvas);
            expect(inputSystem.options.preventScroll).toBe(true);
            expect(inputSystem.options.debug).toBe(false);
        });

        it('should accept custom options', () => {
            const customInput = new InputSystem(canvas, {
                preventScroll: false,
                debug: true
            });
            expect(customInput.options.preventScroll).toBe(false);
            expect(customInput.options.debug).toBe(true);
            customInput.destroy();
        });

        it('should initialize input state correctly', () => {
            expect(inputSystem.touches.size).toBe(0);
            expect(inputSystem.mousePosition).toEqual({ x: 0, y: 0 });
            expect(inputSystem.isMouseDown).toBe(false);
        });

        it('should cache canvas bounds on initialization', () => {
            expect(inputSystem.canvasBounds).toEqual(mockRect);
            expect(canvas.getBoundingClientRect).toHaveBeenCalledOnce();
        });
    });

    describe('Coordinate transformation', () => {
        it('should correctly transform client to canvas coordinates', () => {
            const clientX = 500; // 400px into canvas
            const clientY = 350; // 300px into canvas
            
            const canvasCoords = inputSystem.clientToCanvas(clientX, clientY);
            
            expect(canvasCoords.x).toBe(400);
            expect(canvasCoords.y).toBe(300);
        });

        it('should handle canvas scaling', () => {
            // Simulate canvas being displayed at half size
            mockRect.width = 400;
            mockRect.height = 300;
            inputSystem.updateCanvasBounds();
            
            const clientX = 300; // 200px into displayed canvas
            const clientY = 200; // 150px into displayed canvas
            
            const canvasCoords = inputSystem.clientToCanvas(clientX, clientY);
            
            // Should scale to actual canvas coordinates
            expect(canvasCoords.x).toBe(400); // 200 * 2
            expect(canvasCoords.y).toBe(300); // 150 * 2
        });
    });

    describe('Mouse events', () => {
        it('should handle mouse down events', () => {
            const clickHandler = vi.fn();
            inputSystem.onClick(clickHandler);

            const event = new MouseEvent('mousedown', {
                clientX: 500,
                clientY: 350
            });
            canvas.dispatchEvent(event);

            expect(inputSystem.isMouseDown).toBe(true);
            expect(inputSystem.mousePosition).toEqual({ x: 400, y: 300 });
            expect(clickHandler).toHaveBeenCalledWith(400, 300, 'mouse');
        });

        it('should handle mouse move events', () => {
            const moveHandler = vi.fn();
            inputSystem.onMove(moveHandler);

            // Mouse down first
            canvas.dispatchEvent(new MouseEvent('mousedown', {
                clientX: 500,
                clientY: 350
            }));

            // Then move
            canvas.dispatchEvent(new MouseEvent('mousemove', {
                clientX: 550,
                clientY: 400
            }));

            expect(inputSystem.mousePosition).toEqual({ x: 450, y: 350 });
            expect(moveHandler).toHaveBeenCalledWith(450, 350, 'mouse');
        });

        it('should not trigger move handler when mouse is not down', () => {
            const moveHandler = vi.fn();
            inputSystem.onMove(moveHandler);

            canvas.dispatchEvent(new MouseEvent('mousemove', {
                clientX: 550,
                clientY: 400
            }));

            expect(inputSystem.mousePosition).toEqual({ x: 450, y: 350 });
            expect(moveHandler).not.toHaveBeenCalled();
        });

        it('should handle mouse up events', () => {
            // Mouse down first
            canvas.dispatchEvent(new MouseEvent('mousedown', {
                clientX: 500,
                clientY: 350
            }));
            expect(inputSystem.isMouseDown).toBe(true);

            // Then mouse up
            canvas.dispatchEvent(new MouseEvent('mouseup'));
            expect(inputSystem.isMouseDown).toBe(false);
        });

        it('should handle mouse leave as mouse up', () => {
            canvas.dispatchEvent(new MouseEvent('mousedown', {
                clientX: 500,
                clientY: 350
            }));
            expect(inputSystem.isMouseDown).toBe(true);

            canvas.dispatchEvent(new MouseEvent('mouseleave'));
            expect(inputSystem.isMouseDown).toBe(false);
        });

        it('should prevent context menu', () => {
            const event = new MouseEvent('contextmenu');
            const preventDefault = vi.spyOn(event, 'preventDefault');
            
            canvas.dispatchEvent(event);
            
            expect(preventDefault).toHaveBeenCalled();
        });
    });

    describe('Touch events', () => {
        it('should handle touch start events', () => {
            const clickHandler = vi.fn();
            inputSystem.onClick(clickHandler);

            const touch = {
                identifier: 1,
                clientX: 500,
                clientY: 350
            };
            const event = new TouchEvent('touchstart', {
                touches: [touch],
                changedTouches: [touch]
            });
            const preventDefault = vi.spyOn(event, 'preventDefault');
            
            canvas.dispatchEvent(event);

            expect(preventDefault).toHaveBeenCalled();
            expect(inputSystem.touches.size).toBe(1);
            expect(inputSystem.touches.get(1)).toMatchObject({
                id: 1,
                startX: 400,
                startY: 300,
                currentX: 400,
                currentY: 300
            });
            expect(clickHandler).toHaveBeenCalledWith(400, 300, 'touch');
        });

        it('should handle multi-touch', () => {
            const clickHandler = vi.fn();
            inputSystem.onClick(clickHandler);

            const touches = [
                { identifier: 1, clientX: 300, clientY: 250 },
                { identifier: 2, clientX: 600, clientY: 450 }
            ];
            const event = new TouchEvent('touchstart', {
                touches: touches,
                changedTouches: touches
            });
            
            canvas.dispatchEvent(event);

            expect(inputSystem.touches.size).toBe(2);
            expect(clickHandler).toHaveBeenCalledTimes(2);
            expect(clickHandler).toHaveBeenCalledWith(200, 200, 'touch');
            expect(clickHandler).toHaveBeenCalledWith(500, 400, 'touch');
        });

        it('should handle touch move events', () => {
            const moveHandler = vi.fn();
            inputSystem.onMove(moveHandler);

            // Start touch
            const startTouch = { identifier: 1, clientX: 500, clientY: 350 };
            canvas.dispatchEvent(new TouchEvent('touchstart', {
                touches: [startTouch],
                changedTouches: [startTouch]
            }));

            // Move touch
            const moveTouch = { identifier: 1, clientX: 550, clientY: 400 };
            const moveEvent = new TouchEvent('touchmove', {
                touches: [moveTouch],
                changedTouches: [moveTouch]
            });
            const preventDefault = vi.spyOn(moveEvent, 'preventDefault');
            
            canvas.dispatchEvent(moveEvent);

            expect(preventDefault).toHaveBeenCalled();
            const touchData = inputSystem.touches.get(1);
            expect(touchData.currentX).toBe(450);
            expect(touchData.currentY).toBe(350);
            expect(moveHandler).toHaveBeenCalledWith(450, 350, 'touch');
        });

        it('should handle touch end events', () => {
            // Start touch
            const touch = { identifier: 1, clientX: 500, clientY: 350 };
            canvas.dispatchEvent(new TouchEvent('touchstart', {
                touches: [touch],
                changedTouches: [touch]
            }));
            expect(inputSystem.touches.size).toBe(1);

            // End touch
            const endEvent = new TouchEvent('touchend', {
                touches: [],
                changedTouches: [touch]
            });
            const preventDefault = vi.spyOn(endEvent, 'preventDefault');
            
            canvas.dispatchEvent(endEvent);

            expect(preventDefault).toHaveBeenCalled();
            expect(inputSystem.touches.size).toBe(0);
        });

        it('should handle touch cancel as touch end', () => {
            const touch = { identifier: 1, clientX: 500, clientY: 350 };
            canvas.dispatchEvent(new TouchEvent('touchstart', {
                touches: [touch],
                changedTouches: [touch]
            }));
            expect(inputSystem.touches.size).toBe(1);

            canvas.dispatchEvent(new TouchEvent('touchcancel', {
                touches: [],
                changedTouches: [touch]
            }));
            expect(inputSystem.touches.size).toBe(0);
        });
    });

    describe('Handler registration and management', () => {
        it('should register and trigger click handlers', () => {
            const handler1 = vi.fn(() => false);
            const handler2 = vi.fn(() => false);
            
            inputSystem.onClick(handler1);
            inputSystem.onClick(handler2);

            canvas.dispatchEvent(new MouseEvent('mousedown', {
                clientX: 500,
                clientY: 350
            }));

            expect(handler1).toHaveBeenCalledWith(400, 300, 'mouse');
            expect(handler2).toHaveBeenCalledWith(400, 300, 'mouse');
        });

        it('should stop propagation when handler returns true', () => {
            const handler1 = vi.fn(() => true);
            const handler2 = vi.fn(() => false);
            
            inputSystem.onClick(handler1);
            inputSystem.onClick(handler2);

            canvas.dispatchEvent(new MouseEvent('mousedown', {
                clientX: 500,
                clientY: 350
            }));

            expect(handler1).toHaveBeenCalled();
            expect(handler2).not.toHaveBeenCalled();
        });

        it('should unregister handlers', () => {
            const handler = vi.fn();
            const unregister = inputSystem.onClick(handler);

            // Trigger once
            canvas.dispatchEvent(new MouseEvent('mousedown', {
                clientX: 500,
                clientY: 350
            }));
            expect(handler).toHaveBeenCalledTimes(1);

            // Unregister
            unregister();

            // Should not trigger again
            canvas.dispatchEvent(new MouseEvent('mousedown', {
                clientX: 500,
                clientY: 350
            }));
            expect(handler).toHaveBeenCalledTimes(1);
        });

        it('should handle resize events', () => {
            const resizeHandler = vi.fn();
            inputSystem.onResize(resizeHandler);

            window.dispatchEvent(new Event('resize'));

            expect(resizeHandler).toHaveBeenCalledWith(800, 600);
            expect(canvas.getBoundingClientRect).toHaveBeenCalled();
        });
    });

    describe('State queries', () => {
        it('should return current touches', () => {
            const touch1 = { identifier: 1, clientX: 300, clientY: 250 };
            const touch2 = { identifier: 2, clientX: 600, clientY: 450 };
            
            canvas.dispatchEvent(new TouchEvent('touchstart', {
                touches: [touch1, touch2],
                changedTouches: [touch1, touch2]
            }));

            const touches = inputSystem.getTouches();
            expect(touches).toHaveLength(2);
            expect(touches[0]).toMatchObject({
                id: 1,
                currentX: 200,
                currentY: 200
            });
            expect(touches[1]).toMatchObject({
                id: 2,
                currentX: 500,
                currentY: 400
            });
        });

        it('should return current mouse position', () => {
            canvas.dispatchEvent(new MouseEvent('mousedown', {
                clientX: 500,
                clientY: 350
            }));

            const position = inputSystem.getMousePosition();
            expect(position).toEqual({ x: 400, y: 300 });
            // Should return a copy, not reference
            expect(position).not.toBe(inputSystem.mousePosition);
        });

        it('should check if point is active with mouse', () => {
            canvas.dispatchEvent(new MouseEvent('mousedown', {
                clientX: 500,
                clientY: 350
            }));

            expect(inputSystem.isPointActive(400, 300)).toBe(true);
            expect(inputSystem.isPointActive(400, 300, 10)).toBe(true);
            expect(inputSystem.isPointActive(410, 310, 15)).toBe(true);
            expect(inputSystem.isPointActive(450, 350, 10)).toBe(false);
        });

        it('should check if point is active with touch', () => {
            const touch = { identifier: 1, clientX: 500, clientY: 350 };
            canvas.dispatchEvent(new TouchEvent('touchstart', {
                touches: [touch],
                changedTouches: [touch]
            }));

            expect(inputSystem.isPointActive(400, 300)).toBe(true);
            expect(inputSystem.isPointActive(400, 300, 10)).toBe(true);
            expect(inputSystem.isPointActive(450, 350, 10)).toBe(false);
        });
    });

    describe('Mobile scroll prevention', () => {
        it('should prevent scroll on canvas when enabled', () => {
            // Create a custom event that we can control
            const event = new TouchEvent('touchmove', {
                touches: [{ clientX: 100, clientY: 100 }],
                bubbles: true,
                cancelable: true
            });
            
            // Use defineProperty to set a read-only target
            Object.defineProperty(event, 'target', {
                value: canvas,
                configurable: true
            });
            
            const preventDefault = vi.spyOn(event, 'preventDefault');
            
            document.body.dispatchEvent(event);
            
            expect(preventDefault).toHaveBeenCalled();
        });

        it('should not prevent scroll outside canvas', () => {
            const div = document.createElement('div');
            document.body.appendChild(div);
            
            const event = new TouchEvent('touchmove', {
                touches: [{ clientX: 100, clientY: 100 }],
                bubbles: true,
                cancelable: true
            });
            
            Object.defineProperty(event, 'target', {
                value: div,
                configurable: true
            });
            
            const preventDefault = vi.spyOn(event, 'preventDefault');
            
            document.body.dispatchEvent(event);
            
            expect(preventDefault).not.toHaveBeenCalled();
            
            document.body.removeChild(div);
        });

        it('should not setup scroll prevention when disabled', () => {
            // Destroy the default InputSystem first
            inputSystem.destroy();
            
            const customInput = new InputSystem(canvas, { preventScroll: false });
            
            const event = new TouchEvent('touchmove', {
                touches: [{ clientX: 100, clientY: 100 }],
                bubbles: true,
                cancelable: true
            });
            
            Object.defineProperty(event, 'target', {
                value: canvas,
                configurable: true
            });
            
            const preventDefault = vi.spyOn(event, 'preventDefault');
            
            document.body.dispatchEvent(event);
            
            expect(preventDefault).not.toHaveBeenCalled();
            
            customInput.destroy();
            
            // Prevent the afterEach from trying to destroy again
            inputSystem = null;
        });
    });

    describe('Cleanup and destruction', () => {
        it('should remove all event listeners on destroy', () => {
            const removeEventListenerSpy = vi.spyOn(canvas, 'removeEventListener');
            const bodyRemoveListenerSpy = vi.spyOn(document.body, 'removeEventListener');
            const windowRemoveListenerSpy = vi.spyOn(window, 'removeEventListener');
            
            inputSystem.destroy();
            
            // Canvas listeners
            expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
            expect(removeEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function));
            expect(removeEventListenerSpy).toHaveBeenCalledWith('touchend', expect.any(Function));
            expect(removeEventListenerSpy).toHaveBeenCalledWith('touchcancel', expect.any(Function));
            expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
            expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
            expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseup', expect.any(Function));
            expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseleave', expect.any(Function));
            expect(removeEventListenerSpy).toHaveBeenCalledWith('contextmenu', expect.any(Function));
            
            // Body listener
            expect(bodyRemoveListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function));
            
            // Window listener
            expect(windowRemoveListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
        });

        it('should clear all handlers on destroy', () => {
            const clickHandler = vi.fn();
            const moveHandler = vi.fn();
            const resizeHandler = vi.fn();
            
            inputSystem.onClick(clickHandler);
            inputSystem.onMove(moveHandler);
            inputSystem.onResize(resizeHandler);
            
            inputSystem.destroy();
            
            // Handlers should be cleared
            expect(inputSystem.clickHandlers).toHaveLength(0);
            expect(inputSystem.moveHandlers).toHaveLength(0);
            expect(inputSystem.resizeHandlers).toHaveLength(0);
        });

        it('should clear touch state on destroy', () => {
            const touch = { identifier: 1, clientX: 500, clientY: 350 };
            canvas.dispatchEvent(new TouchEvent('touchstart', {
                touches: [touch],
                changedTouches: [touch]
            }));
            expect(inputSystem.touches.size).toBe(1);
            
            inputSystem.destroy();
            
            expect(inputSystem.touches.size).toBe(0);
        });
    });

    describe('Debug logging', () => {
        it('should log when debug is enabled', () => {
            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
            
            const debugInput = new InputSystem(canvas, { debug: true });
            
            // Should log initialization
            expect(consoleSpy).toHaveBeenCalledWith('InputSystem: Event listeners attached');
            
            // Touch event
            const touch = { identifier: 1, clientX: 500, clientY: 350 };
            canvas.dispatchEvent(new TouchEvent('touchstart', {
                touches: [touch],
                changedTouches: [touch]
            }));
            expect(consoleSpy).toHaveBeenCalledWith('InputSystem: 1 touch(es) started');
            
            // Mouse event
            canvas.dispatchEvent(new MouseEvent('mousedown', {
                clientX: 500,
                clientY: 350
            }));
            expect(consoleSpy).toHaveBeenCalledWith('InputSystem: Mouse down at 400, 300');
            
            // Resize event
            window.dispatchEvent(new Event('resize'));
            expect(consoleSpy).toHaveBeenCalledWith('InputSystem: Canvas resized to 800x600');
            
            // Destroy
            debugInput.destroy();
            expect(consoleSpy).toHaveBeenCalledWith('InputSystem: Destroyed and cleaned up');
            
            consoleSpy.mockRestore();
        });
    });
});

describe('PhysicsSystem', () => {
    let physics;
    
    beforeEach(() => {
        physics = new PhysicsSystem({
            width: 800,
            height: 600,
            gravity: 0.5,
            terminalVelocity: 15,
            bounceDamping: 0.7,
            friction: 0.9
        });
    });
    
    describe('Constructor and initialization', () => {
        it('should initialize with default values', () => {
            const defaultPhysics = new PhysicsSystem();
            expect(defaultPhysics.bounds.width).toBe(480);
            expect(defaultPhysics.bounds.height).toBe(600);
            expect(defaultPhysics.gravity).toBe(PHYSICS_CONSTANTS.GRAVITY);
            expect(defaultPhysics.terminalVelocity).toBe(PHYSICS_CONSTANTS.TERMINAL_VELOCITY);
        });
        
        it('should accept custom options', () => {
            expect(physics.bounds.width).toBe(800);
            expect(physics.bounds.height).toBe(600);
            expect(physics.gravity).toBe(0.5);
            expect(physics.terminalVelocity).toBe(15);
            expect(physics.bounceDamping).toBe(0.7);
            expect(physics.friction).toBe(0.9);
        });
        
        it('should have feature flags enabled by default', () => {
            expect(physics.enableRotation).toBe(true);
            expect(physics.enableSway).toBe(true);
            expect(physics.enableBounce).toBe(true);
        });
        
        it('should allow disabling features', () => {
            const customPhysics = new PhysicsSystem({
                enableRotation: false,
                enableSway: false,
                enableBounce: false
            });
            expect(customPhysics.enableRotation).toBe(false);
            expect(customPhysics.enableSway).toBe(false);
            expect(customPhysics.enableBounce).toBe(false);
        });
    });
    
    describe('Gravity calculations', () => {
        it('should apply gravity correctly', () => {
            const velocity = physics.applyGravity(0);
            expect(velocity).toBe(0.5);
        });
        
        it('should apply gravity with multiplier', () => {
            const velocity = physics.applyGravity(0, 2);
            expect(velocity).toBe(1);
        });
        
        it('should respect terminal velocity', () => {
            const velocity = physics.applyGravity(14.8);
            expect(velocity).toBe(15); // Terminal velocity
        });
        
        it('should not exceed terminal velocity with multiplier', () => {
            const velocity = physics.applyGravity(10, 10);
            expect(velocity).toBe(15); // Terminal velocity
        });
    });
    
    describe('Position updates', () => {
        it('should update position with velocity', () => {
            const position = { x: 100, y: 100 };
            const velocity = { x: 5, y: 10 };
            const newPos = physics.updatePosition(position, velocity);
            
            expect(newPos.x).toBe(105);
            expect(newPos.y).toBe(110);
        });
        
        it('should update position with delta time', () => {
            const position = { x: 100, y: 100 };
            const velocity = { x: 5, y: 10 };
            const newPos = physics.updatePosition(position, velocity, 0.5);
            
            expect(newPos.x).toBe(102.5);
            expect(newPos.y).toBe(105);
        });
        
        it('should handle negative velocities', () => {
            const position = { x: 100, y: 100 };
            const velocity = { x: -5, y: -10 };
            const newPos = physics.updatePosition(position, velocity);
            
            expect(newPos.x).toBe(95);
            expect(newPos.y).toBe(90);
        });
    });
    
    describe('Sway motion', () => {
        it('should apply sway when enabled', () => {
            const baseX = 100;
            // Calculate time for peak of sine wave after phase shift
            const time = 0; // sin(0 + Math.PI) = sin(Math.PI) = 0
            const swayX = physics.applySway(baseX, time, 0.5); // Use 0.5 to get sin(π/2) = 1
            
            // Should add sway amplitude
            expect(swayX).toBeCloseTo(100 + PHYSICS_CONSTANTS.SWAY_AMPLITUDE, 3);
        });
        
        it('should return base position when sway disabled', () => {
            physics.enableSway = false;
            const baseX = 100;
            const time = Math.PI / 2;
            const swayX = physics.applySway(baseX, time, 1);
            
            expect(swayX).toBe(100);
        });
        
        it('should vary sway with factor', () => {
            const baseX = 100;
            const time = 10; // Non-zero time to see effect
            const swayX1 = physics.applySway(baseX, time, 0);
            const swayX2 = physics.applySway(baseX, time, 1);
            
            expect(swayX1).not.toBe(swayX2);
        });
    });
    
    describe('Rotation updates', () => {
        it('should update rotation when enabled', () => {
            const result = physics.updateRotation(0, 0.1);
            expect(result.rotation).toBe(0.1);
            expect(result.rotationSpeed).toBe(0.1);
        });
        
        it('should apply damping when requested', () => {
            const result = physics.updateRotation(0, 1, true);
            expect(result.rotation).toBe(1);
            expect(result.rotationSpeed).toBe(1 * PHYSICS_CONSTANTS.ROTATION_DAMPING);
        });
        
        it('should stop rotation when speed is too small', () => {
            const result = physics.updateRotation(0, 0.001, true);
            expect(result.rotationSpeed).toBe(0);
        });
        
        it('should wrap rotation around 2π', () => {
            const result = physics.updateRotation(Math.PI * 2 - 0.1, 0.2);
            expect(result.rotation).toBeCloseTo(0.1, 5);
        });
        
        it('should return zero when rotation disabled', () => {
            physics.enableRotation = false;
            const result = physics.updateRotation(1, 1);
            expect(result.rotation).toBe(0);
            expect(result.rotationSpeed).toBe(0);
        });
    });
    
    describe('Boundary checking', () => {
        it('should detect entity in bounds', () => {
            const entity = { x: 100, y: 100, width: 50, height: 50 };
            const bounds = physics.checkBounds(entity);
            
            expect(bounds.inBounds).toBe(true);
            expect(bounds.left).toBe(false);
            expect(bounds.right).toBe(false);
            expect(bounds.top).toBe(false);
            expect(bounds.bottom).toBe(false);
        });
        
        it('should detect left boundary collision', () => {
            const entity = { x: -10, y: 100, width: 50, height: 50 };
            const bounds = physics.checkBounds(entity);
            
            expect(bounds.inBounds).toBe(false);
            expect(bounds.left).toBe(true);
        });
        
        it('should detect right boundary collision', () => {
            const entity = { x: 760, y: 100, width: 50, height: 50 };
            const bounds = physics.checkBounds(entity);
            
            expect(bounds.inBounds).toBe(false);
            expect(bounds.right).toBe(true);
        });
        
        it('should detect top boundary collision', () => {
            const entity = { x: 100, y: -10, width: 50, height: 50 };
            const bounds = physics.checkBounds(entity);
            
            expect(bounds.inBounds).toBe(false);
            expect(bounds.top).toBe(true);
        });
        
        it('should detect bottom boundary collision', () => {
            const entity = { x: 100, y: 560, width: 50, height: 50 };
            const bounds = physics.checkBounds(entity);
            
            expect(bounds.inBounds).toBe(false);
            expect(bounds.bottom).toBe(true);
        });
        
        it('should detect off-screen entities', () => {
            const entityBottom = { x: 100, y: 610, width: 50, height: 50 };
            const boundsBottom = physics.checkBounds(entityBottom);
            expect(boundsBottom.offScreenBottom).toBe(true);
            
            const entityTop = { x: 100, y: -60, width: 50, height: 50 };
            const boundsTop = physics.checkBounds(entityTop);
            expect(boundsTop.offScreenTop).toBe(true);
        });
        
        it('should use custom bounds when provided', () => {
            const entity = { x: 100, y: 100, width: 50, height: 50 };
            const customBounds = { width: 200, height: 200 };
            const bounds = physics.checkBounds(entity, customBounds);
            
            expect(bounds.inBounds).toBe(true);
            
            const entity2 = { x: 250, y: 100, width: 50, height: 50 };
            const bounds2 = physics.checkBounds(entity2, customBounds);
            expect(bounds2.right).toBe(true);
        });
    });
    
    describe('Boundary collision handling', () => {
        it('should bounce off left boundary', () => {
            const entity = {
                x: -10, y: 100, vx: -5, vy: 0,
                width: 50, height: 50
            };
            const boundaryCheck = { left: true };
            const result = physics.applyBoundaryCollision(entity, boundaryCheck);
            
            expect(result.x).toBe(0);
            expect(result.vx).toBe(5 * physics.bounceDamping);
            expect(result.bounced).toBe(true);
        });
        
        it('should bounce off right boundary', () => {
            const entity = {
                x: 760, y: 100, vx: 5, vy: 0,
                width: 50, height: 50
            };
            const boundaryCheck = { right: true };
            const result = physics.applyBoundaryCollision(entity, boundaryCheck);
            
            expect(result.x).toBe(750);
            expect(result.vx).toBe(-5 * physics.bounceDamping);
            expect(result.bounced).toBe(true);
        });
        
        it('should bounce off bottom boundary', () => {
            const entity = {
                x: 100, y: 560, vx: 5, vy: 10,
                width: 50, height: 50
            };
            const boundaryCheck = { bottom: true };
            const result = physics.applyBoundaryCollision(entity, boundaryCheck);
            
            expect(result.y).toBe(550);
            expect(result.vy).toBe(-10 * physics.bounceDamping);
            expect(result.vx).toBe(5 * physics.friction);
            expect(result.bounced).toBe(true);
        });
        
        it('should stop tiny bounces', () => {
            const entity = {
                x: 100, y: 560, vx: 0, vy: 0.005,
                width: 50, height: 50
            };
            const boundaryCheck = { bottom: true };
            const result = physics.applyBoundaryCollision(entity, boundaryCheck);
            
            expect(result.vy).toBe(0);
        });
        
        it('should stop movement when bounce disabled', () => {
            physics.enableBounce = false;
            const entity = {
                x: -10, y: 100, vx: -5, vy: 0,
                width: 50, height: 50
            };
            const boundaryCheck = { left: true };
            const result = physics.applyBoundaryCollision(entity, boundaryCheck);
            
            expect(result.x).toBe(0);
            expect(result.vx).toBe(0);
            expect(result.bounced).toBe(false);
        });
    });
    
    describe('Collision detection', () => {
        describe('Circle-circle collision', () => {
            it('should detect collision between overlapping circles', () => {
                const circle1 = { x: 100, y: 100, radius: 50 };
                const circle2 = { x: 130, y: 100, radius: 50 };
                
                expect(physics.checkCircleCollision(circle1, circle2)).toBe(true);
            });
            
            it('should not detect collision between separated circles', () => {
                const circle1 = { x: 100, y: 100, radius: 50 };
                const circle2 = { x: 200, y: 100, radius: 40 };
                
                expect(physics.checkCircleCollision(circle1, circle2)).toBe(false);
            });
            
            it('should detect exact touching', () => {
                const circle1 = { x: 100, y: 100, radius: 50 };
                const circle2 = { x: 200, y: 100, radius: 50 };
                
                expect(physics.checkCircleCollision(circle1, circle2)).toBe(false);
            });
        });
        
        describe('Point-circle collision', () => {
            it('should detect point inside circle', () => {
                const circle = { x: 100, y: 100, radius: 50 };
                
                expect(physics.checkPointCircleCollision(100, 100, circle)).toBe(true);
                expect(physics.checkPointCircleCollision(120, 100, circle)).toBe(true);
            });
            
            it('should not detect point outside circle', () => {
                const circle = { x: 100, y: 100, radius: 50 };
                
                expect(physics.checkPointCircleCollision(200, 100, circle)).toBe(false);
            });
            
            it('should detect point on circle edge', () => {
                const circle = { x: 100, y: 100, radius: 50 };
                
                expect(physics.checkPointCircleCollision(150, 100, circle)).toBe(true);
            });
        });
        
        describe('Rectangle-rectangle collision', () => {
            it('should detect collision between overlapping rectangles', () => {
                const rect1 = { x: 100, y: 100, width: 50, height: 50 };
                const rect2 = { x: 125, y: 125, width: 50, height: 50 };
                
                expect(physics.checkRectCollision(rect1, rect2)).toBe(true);
            });
            
            it('should not detect collision between separated rectangles', () => {
                const rect1 = { x: 100, y: 100, width: 50, height: 50 };
                const rect2 = { x: 200, y: 100, width: 50, height: 50 };
                
                expect(physics.checkRectCollision(rect1, rect2)).toBe(false);
            });
            
            it('should not detect touching rectangles as collision', () => {
                const rect1 = { x: 100, y: 100, width: 50, height: 50 };
                const rect2 = { x: 150, y: 100, width: 50, height: 50 };
                
                expect(physics.checkRectCollision(rect1, rect2)).toBe(false);
            });
        });
        
        describe('Point-rectangle collision', () => {
            it('should detect point inside rectangle', () => {
                const rect = { x: 100, y: 100, width: 50, height: 50 };
                
                expect(physics.checkPointRectCollision(125, 125, rect)).toBe(true);
                expect(physics.checkPointRectCollision(100, 100, rect)).toBe(true);
            });
            
            it('should not detect point outside rectangle', () => {
                const rect = { x: 100, y: 100, width: 50, height: 50 };
                
                expect(physics.checkPointRectCollision(200, 125, rect)).toBe(false);
                expect(physics.checkPointRectCollision(125, 200, rect)).toBe(false);
            });
            
            it('should detect point on rectangle edge', () => {
                const rect = { x: 100, y: 100, width: 50, height: 50 };
                
                expect(physics.checkPointRectCollision(150, 125, rect)).toBe(true);
            });
        });
    });
    
    describe('Click/tap detection', () => {
        it('should detect click on circular entity', () => {
            const entity = { x: 100, y: 100, radius: 25, size: 50 };
            
            expect(physics.isClicked(125, 125, entity)).toBe(true);
            expect(physics.isClicked(200, 200, entity)).toBe(false);
        });
        
        it('should detect click on rectangular entity', () => {
            const entity = { x: 100, y: 100, width: 50, height: 50 };
            
            expect(physics.isClicked(125, 125, entity)).toBe(true);
            expect(physics.isClicked(200, 200, entity)).toBe(false);
        });
        
        it('should detect click on entity with size property', () => {
            const entity = { x: 100, y: 100, size: 50 };
            
            expect(physics.isClicked(125, 125, entity)).toBe(true);
            expect(physics.isClicked(200, 200, entity)).toBe(false);
        });
        
        it('should return false for invalid entities', () => {
            const entity = { x: 100, y: 100 };
            
            expect(physics.isClicked(100, 100, entity)).toBe(false);
        });
    });
    
    describe('Utility functions', () => {
        describe('Distance calculation', () => {
            it('should calculate distance correctly', () => {
                expect(physics.distance(0, 0, 3, 4)).toBe(5);
                expect(physics.distance(10, 10, 10, 10)).toBe(0);
                expect(physics.distance(-5, -5, 5, 5)).toBeCloseTo(14.142, 3);
            });
        });
        
        describe('Angle calculation', () => {
            it('should calculate angles correctly', () => {
                expect(physics.angle(0, 0, 1, 0)).toBe(0);
                expect(physics.angle(0, 0, 0, 1)).toBe(Math.PI / 2);
                expect(physics.angle(0, 0, -1, 0)).toBe(Math.PI);
                expect(physics.angle(0, 0, 0, -1)).toBe(-Math.PI / 2);
            });
        });
        
        describe('Vector normalization', () => {
            it('should normalize vectors correctly', () => {
                const norm1 = physics.normalize(3, 4);
                expect(norm1.x).toBeCloseTo(0.6, 5);
                expect(norm1.y).toBeCloseTo(0.8, 5);
                
                const norm2 = physics.normalize(5, 0);
                expect(norm2.x).toBe(1);
                expect(norm2.y).toBe(0);
            });
            
            it('should handle zero vector', () => {
                const norm = physics.normalize(0, 0);
                expect(norm.x).toBe(0);
                expect(norm.y).toBe(0);
            });
        });
    });
    
    describe('Entity physics update', () => {
        it('should update entity with gravity', () => {
            const entity = {
                x: 100, y: 100,
                vx: 5, vy: 0,
                size: 50
            };
            
            const result = physics.updateEntity(entity);
            
            expect(result.x).toBe(105);
            expect(result.y).toBe(100.5); // Moved by gravity-applied velocity
            expect(result.vy).toBe(0.5); // Gravity applied
        });
        
        it('should respect gravity settings', () => {
            const entity = {
                x: 100, y: 100,
                vx: 0, vy: 0,
                size: 50,
                hasGravity: false
            };
            
            const result = physics.updateEntity(entity);
            
            expect(result.vy).toBe(0); // No gravity
        });
        
        it('should apply gravity multiplier', () => {
            const entity = {
                x: 100, y: 100,
                vx: 0, vy: 0,
                size: 50,
                gravityMultiplier: 2
            };
            
            const result = physics.updateEntity(entity);
            
            expect(result.vy).toBe(1); // Double gravity
        });
        
        it('should apply sway motion', () => {
            const entity = {
                x: 100, y: 100,
                vx: 0, vy: 0,
                size: 50,
                sway: 1
            };
            
            const result = physics.updateEntity(entity, 1, { time: Math.PI / 2 });
            
            expect(result.x).not.toBe(100);
        });
        
        it('should update rotation', () => {
            const entity = {
                x: 100, y: 100,
                vx: 0, vy: 0,
                size: 50,
                rotation: 0,
                rotationSpeed: 0.1
            };
            
            const result = physics.updateEntity(entity);
            
            expect(result.rotation).toBe(0.1);
        });
        
        it('should handle boundary collisions', () => {
            const entity = {
                x: -10, y: 100,
                vx: -5, vy: 0,
                size: 50,
                bounceOnBounds: true
            };
            
            const result = physics.updateEntity(entity);
            
            expect(result.x).toBe(0);
            expect(result.vx).toBeGreaterThan(0); // Bounced
            expect(result.bounced).toBe(true);
        });
        
        it('should detect off-screen entities', () => {
            const entity = {
                x: 100, y: 650,
                vx: 0, vy: 0,
                size: 50
            };
            
            const result = physics.updateEntity(entity);
            
            expect(result.offScreen).toBe(true);
            expect(result.boundaryCheck.offScreenBottom).toBe(true);
        });
    });
    
    describe('Position prediction', () => {
        it('should predict future position', () => {
            const entity = {
                x: 100, y: 100,
                vx: 5, vy: 0
            };
            
            const predicted = physics.predictPosition(entity, 10);
            
            expect(predicted.x).toBe(150);
            expect(predicted.y).toBeGreaterThan(100); // Gravity applied
        });
        
        it('should predict with custom delta time', () => {
            const entity = {
                x: 100, y: 100,
                vx: 10, vy: 0
            };
            
            const predicted = physics.predictPosition(entity, 5, 0.5);
            
            expect(predicted.x).toBe(125); // 10 * 0.5 * 5
        });
        
        it('should respect gravity settings in prediction', () => {
            const entity = {
                x: 100, y: 100,
                vx: 0, vy: 0,
                hasGravity: false
            };
            
            const predicted = physics.predictPosition(entity, 10);
            
            expect(predicted.y).toBe(100); // No gravity
        });
    });
    
    describe('Intercept calculation', () => {
        it('should calculate intercept for moving target', () => {
            const shooter = { x: 0, y: 0 };
            const target = { x: 100, y: 0, vx: 0, vy: 10 };
            const projectileSpeed = 50;
            
            const intercept = physics.calculateIntercept(shooter, target, projectileSpeed);
            
            expect(intercept).not.toBeNull();
            expect(intercept.x).toBe(100);
            expect(intercept.y).toBeGreaterThan(0);
        });
        
        it('should return null for impossible intercept', () => {
            const shooter = { x: 0, y: 0 };
            const target = { x: 100, y: 0, vx: 100, vy: 0 };
            const projectileSpeed = 10; // Too slow
            
            const intercept = physics.calculateIntercept(shooter, target, projectileSpeed);
            
            expect(intercept).toBeNull();
        });
        
        it('should handle stationary targets', () => {
            const shooter = { x: 0, y: 0 };
            const target = { x: 100, y: 100, vx: 0, vy: 0 };
            const projectileSpeed = 50;
            
            const intercept = physics.calculateIntercept(shooter, target, projectileSpeed);
            
            expect(intercept).not.toBeNull();
            expect(intercept.x).toBe(100);
            expect(intercept.y).toBe(100);
        });
    });
    
    describe('Bounds management', () => {
        it('should update bounds', () => {
            physics.updateBounds(1024, 768);
            
            expect(physics.bounds.width).toBe(1024);
            expect(physics.bounds.height).toBe(768);
        });
    });
});