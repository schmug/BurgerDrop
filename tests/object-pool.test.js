import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ObjectPool, PoolManager } from '../src/game/utils/ObjectPool.js';

describe('ObjectPool', () => {
    let pool;
    let createCount = 0;
    let resetCount = 0;
    
    const createFn = () => {
        createCount++;
        return { id: createCount, value: 0 };
    };
    
    const resetFn = (obj, value = 0) => {
        resetCount++;
        obj.value = value;
    };
    
    beforeEach(() => {
        createCount = 0;
        resetCount = 0;
        pool = new ObjectPool(createFn, resetFn, {
            initialSize: 5,
            maxSize: 20,
            expandSize: 5,
            preWarm: true
        });
    });
    
    describe('initialization', () => {
        it('should pre-warm pool with initial size', () => {
            expect(createCount).toBe(5);
            expect(pool.getSize().available).toBe(5);
            expect(pool.getSize().active).toBe(0);
            expect(pool.getSize().total).toBe(5);
        });
        
        it('should not pre-warm when disabled', () => {
            const noPreWarmPool = new ObjectPool(createFn, resetFn, {
                initialSize: 5,
                preWarm: false
            });
            
            expect(noPreWarmPool.getSize().available).toBe(0);
            expect(noPreWarmPool.getSize().total).toBe(0);
        });
    });
    
    describe('get', () => {
        it('should reuse objects from pool', () => {
            const obj1 = pool.get();
            expect(createCount).toBe(5); // No new objects created
            expect(resetCount).toBe(1); // Object was reset
            expect(pool.getSize().available).toBe(4);
            expect(pool.getSize().active).toBe(1);
        });
        
        it('should pass arguments to reset function', () => {
            const obj = pool.get(42);
            expect(obj.value).toBe(42);
        });
        
        it('should expand pool when all objects are in use', () => {
            // Get all initial objects
            const objects = [];
            for (let i = 0; i < 5; i++) {
                objects.push(pool.get());
            }
            
            expect(pool.getSize().available).toBe(0);
            expect(createCount).toBe(5);
            
            // Get one more - should trigger expansion
            const extraObj = pool.get();
            expect(createCount).toBe(10); // Expanded by expandSize (5)
            expect(pool.getSize().available).toBe(4); // 5 new - 1 used
        });
        
        it('should respect max size limit', () => {
            // Fill pool to max
            const objects = [];
            for (let i = 0; i < 20; i++) {
                objects.push(pool.get());
            }
            
            expect(pool.getSize().total).toBe(20);
            
            // Try to get more - should create anyway but warn
            const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            pool.config.debug = true;
            
            const extraObj = pool.get();
            expect(extraObj).toBeDefined();
            expect(consoleWarnSpy).toHaveBeenCalledWith(
                '[ObjectPool] Max size reached, creating new object anyway'
            );
            
            consoleWarnSpy.mockRestore();
        });
        
        it('should track high water mark', () => {
            const objects = [];
            expect(pool.getStats().highWaterMark).toBe(0);
            
            for (let i = 0; i < 7; i++) {
                objects.push(pool.get());
            }
            
            expect(pool.getStats().highWaterMark).toBe(7);
            
            // Release some
            pool.release(objects.pop());
            pool.release(objects.pop());
            
            // High water mark should remain
            expect(pool.getStats().highWaterMark).toBe(7);
        });
    });
    
    describe('release', () => {
        it('should return objects to pool', () => {
            const obj = pool.get();
            expect(pool.getSize().active).toBe(1);
            
            const released = pool.release(obj);
            expect(released).toBe(true);
            expect(pool.getSize().active).toBe(0);
            expect(pool.getSize().available).toBe(5);
        });
        
        it('should not release invalid objects', () => {
            const fakeObj = { id: 999 };
            const released = pool.release(fakeObj);
            expect(released).toBe(false);
        });
        
        it('should not release same object twice', () => {
            const obj = pool.get();
            pool.release(obj);
            
            const secondRelease = pool.release(obj);
            expect(secondRelease).toBe(false);
        });
        
        it('should discard objects when pool is full', () => {
            // Get and release max objects
            const objects = [];
            for (let i = 0; i < 20; i++) {
                objects.push(pool.get());
            }
            
            // Release all
            objects.forEach(obj => pool.release(obj));
            
            // Try to release one more (external object)
            const externalObj = { id: 999 };
            pool.active.add(externalObj); // Manually add to active
            
            const released = pool.release(externalObj);
            expect(released).toBe(false); // Should be discarded
        });
    });
    
    describe('releaseAll', () => {
        it('should release multiple objects at once', () => {
            const objects = [];
            for (let i = 0; i < 3; i++) {
                objects.push(pool.get());
            }
            
            const released = pool.releaseAll(objects);
            expect(released).toBe(3);
            expect(pool.getSize().active).toBe(0);
            expect(pool.getSize().available).toBe(5);
        });
        
        it('should handle mixed valid/invalid objects', () => {
            const obj1 = pool.get();
            const obj2 = pool.get();
            const fakeObj = { id: 999 };
            
            const released = pool.releaseAll([obj1, fakeObj, obj2]);
            expect(released).toBe(2);
        });
    });
    
    describe('expand', () => {
        it('should expand pool by specified amount', () => {
            pool.expand(3);
            expect(createCount).toBe(8); // 5 initial + 3 expanded
            expect(pool.getSize().total).toBe(8);
            expect(pool.getSize().available).toBe(8);
        });
        
        it('should respect max size when expanding', () => {
            pool.expand(50); // Try to expand beyond max
            expect(pool.getSize().total).toBe(20); // Should stop at max
        });
        
        it('should not expand when at max size', () => {
            // Fill to max
            for (let i = 0; i < 15; i++) {
                pool.get();
            }
            
            const initialTotal = pool.getSize().total;
            pool.expand(5);
            expect(pool.getSize().total).toBe(20); // Still at max
        });
    });
    
    describe('clear', () => {
        it('should clear available objects', () => {
            pool.clear();
            expect(pool.getSize().available).toBe(0);
            expect(pool.getSize().total).toBe(0);
        });
        
        it('should keep active objects when requested', () => {
            const obj1 = pool.get();
            const obj2 = pool.get();
            
            pool.clear(true); // Keep active
            expect(pool.getSize().available).toBe(0);
            expect(pool.getSize().active).toBe(2);
        });
        
        it('should clear active objects by default', () => {
            const obj1 = pool.get();
            const obj2 = pool.get();
            
            pool.clear();
            expect(pool.getSize().active).toBe(0);
        });
    });
    
    describe('reset', () => {
        it('should reset pool to initial state', () => {
            // Use pool
            for (let i = 0; i < 10; i++) {
                pool.get();
            }
            
            const statsBefore = pool.getStats();
            expect(statsBefore.created).toBeGreaterThan(5);
            expect(statsBefore.reused).toBeGreaterThan(0);
            
            // Reset
            pool.reset();
            
            expect(pool.getSize().total).toBe(5); // Back to initial
            expect(pool.getSize().available).toBe(5);
            expect(pool.getSize().active).toBe(0);
            
            const statsAfter = pool.getStats();
            expect(statsAfter.created).toBe(0);
            expect(statsAfter.reused).toBe(0);
            expect(statsAfter.highWaterMark).toBe(0);
        });
    });
    
    describe('trim', () => {
        it('should trim excess available objects', () => {
            // Expand pool
            pool.expand(10);
            expect(pool.getSize().available).toBe(15);
            
            // Trim to target size
            pool.trim(5);
            expect(pool.getSize().available).toBe(5);
            expect(pool.getSize().total).toBe(5);
        });
        
        it('should not trim below target size', () => {
            pool.trim(10);
            expect(pool.getSize().available).toBe(5); // Unchanged
        });
    });
    
    describe('statistics', () => {
        it('should track creation and reuse statistics', () => {
            const stats1 = pool.getStats();
            expect(stats1.created).toBe(0); // Pre-warmed objects don't count
            expect(stats1.reused).toBe(0);
            
            // Use some objects
            const obj1 = pool.get();
            const obj2 = pool.get();
            pool.release(obj1);
            const obj3 = pool.get(); // Reuse
            
            const stats2 = pool.getStats();
            expect(stats2.reused).toBe(3); // All gets were reuses
        });
        
        it('should calculate utilization', () => {
            const obj1 = pool.get();
            const obj2 = pool.get();
            
            const stats = pool.getStats();
            expect(stats.utilization).toBe(2 / 5); // 2 active out of 5 total
        });
    });
    
    describe('createTyped', () => {
        class TestClass {
            constructor() {
                this.value = 0;
                this.name = 'test';
            }
            
            reset(value = 0, name = 'test') {
                this.value = value;
                this.name = name;
            }
        }
        
        it('should create pool for class with auto-reset', () => {
            const typedPool = ObjectPool.createTyped(TestClass);
            
            const obj = typedPool.get(42, 'custom');
            expect(obj).toBeInstanceOf(TestClass);
            expect(obj.value).toBe(42);
            expect(obj.name).toBe('custom');
        });
        
        it('should use custom reset function if provided', () => {
            const customReset = vi.fn((obj, val) => {
                obj.value = val * 2;
            });
            
            const typedPool = ObjectPool.createTyped(TestClass, {
                resetFn: customReset
            });
            
            const obj = typedPool.get(21);
            expect(customReset).toHaveBeenCalledWith(obj, 21);
            expect(obj.value).toBe(42);
        });
    });
});

describe('PoolManager', () => {
    let manager;
    
    beforeEach(() => {
        manager = new PoolManager();
    });
    
    describe('register', () => {
        it('should register new pools', () => {
            const createFn = () => ({ value: 0 });
            const resetFn = (obj, val) => { obj.value = val; };
            
            manager.register('test', createFn, resetFn);
            
            const pool = manager.getPool('test');
            expect(pool).toBeInstanceOf(ObjectPool);
        });
        
        it('should warn on duplicate registration', () => {
            const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            
            manager.register('test', () => ({}), () => {});
            manager.register('test', () => ({}), () => {}); // Duplicate
            
            expect(consoleWarnSpy).toHaveBeenCalledWith("[PoolManager] Pool 'test' already exists");
            consoleWarnSpy.mockRestore();
        });
    });
    
    describe('registerTyped', () => {
        class TestClass {
            reset() {}
        }
        
        it('should register typed pools', () => {
            manager.registerTyped('testClass', TestClass);
            
            const obj = manager.get('testClass');
            expect(obj).toBeInstanceOf(TestClass);
        });
    });
    
    describe('get/release', () => {
        beforeEach(() => {
            manager.register('test', () => ({ id: Math.random() }), (obj) => {});
        });
        
        it('should get objects from named pools', () => {
            const obj = manager.get('test');
            expect(obj).toBeDefined();
            expect(obj.id).toBeDefined();
        });
        
        it('should throw on invalid pool name', () => {
            expect(() => manager.get('invalid')).toThrow("Pool 'invalid' not found");
        });
        
        it('should release objects to named pools', () => {
            const obj = manager.get('test');
            const released = manager.release('test', obj);
            expect(released).toBe(true);
        });
        
        it('should handle release to invalid pool', () => {
            const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            
            const released = manager.release('invalid', {});
            expect(released).toBe(false);
            expect(consoleWarnSpy).toHaveBeenCalledWith("[PoolManager] Pool 'invalid' not found");
            
            consoleWarnSpy.mockRestore();
        });
    });
    
    describe('getAllStats', () => {
        it('should return statistics for all pools', () => {
            manager.register('pool1', () => ({}), () => {});
            manager.register('pool2', () => ({}), () => {});
            
            manager.get('pool1');
            manager.get('pool2');
            manager.get('pool2');
            
            const stats = manager.getAllStats();
            expect(stats.pool1.active).toBe(1);
            expect(stats.pool2.active).toBe(2);
        });
    });
    
    describe('clearAll/resetAll', () => {
        beforeEach(() => {
            manager.register('pool1', () => ({ id: 1 }), () => {});
            manager.register('pool2', () => ({ id: 2 }), () => {});
        });
        
        it('should clear all pools', () => {
            manager.get('pool1');
            manager.get('pool2');
            
            manager.clearAll();
            
            const stats = manager.getAllStats();
            expect(stats.pool1.active).toBe(0);
            expect(stats.pool2.active).toBe(0);
        });
        
        it('should reset all pools', () => {
            manager.get('pool1');
            manager.get('pool2');
            
            manager.resetAll();
            
            const stats = manager.getAllStats();
            expect(stats.pool1.created).toBe(0);
            expect(stats.pool2.created).toBe(0);
        });
    });
    
    describe('debug mode', () => {
        it('should set debug mode for all pools', () => {
            manager.register('pool1', () => ({}), () => {});
            manager.register('pool2', () => ({}), () => {});
            
            manager.setDebug(true);
            
            expect(manager.getPool('pool1').config.debug).toBe(true);
            expect(manager.getPool('pool2').config.debug).toBe(true);
        });
    });
});