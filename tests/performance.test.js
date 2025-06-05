/**
 * @fileoverview Tests for performance optimization utilities
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ObjectPool, PoolManager } from '../src/game/utils/ObjectPool.js';
import PerformanceMonitor from '../src/game/utils/PerformanceMonitor.js';
import { Particle } from '../src/game/entities/Particle.js';

describe('Performance Optimization', () => {
    describe('ObjectPool', () => {
        let pool;
        
        beforeEach(() => {
            const createFn = () => ({ id: Math.random(), value: 0 });
            const resetFn = (obj, value = 0) => { obj.value = value; };
            pool = new ObjectPool(createFn, resetFn, 5, 20);
        });
        
        it('should create pool with initial objects', () => {
            expect(pool.pool.length).toBe(5);
            expect(pool.totalCreated).toBe(5);
        });
        
        it('should get object from pool', () => {
            const obj = pool.get(42);
            
            expect(obj).toBeDefined();
            expect(obj.value).toBe(42);
            expect(pool.activeCount).toBe(1);
            expect(pool.pool.length).toBe(4);
        });
        
        it('should release object back to pool', () => {
            const obj = pool.get();
            pool.release(obj);
            
            expect(pool.activeCount).toBe(0);
            expect(pool.pool.length).toBe(5);
        });
        
        it('should create new object when pool is empty', () => {
            // Get all objects from pool
            const objects = [];
            for (let i = 0; i < 10; i++) {
                objects.push(pool.get());
            }
            
            expect(pool.pool.length).toBe(0);
            expect(pool.totalCreated).toBeGreaterThan(5);
        });
        
        it('should not exceed max pool size', () => {
            const objects = [];
            
            // Get many objects
            for (let i = 0; i < 30; i++) {
                objects.push(pool.get());
            }
            
            // Release them all
            objects.forEach(obj => pool.release(obj));
            
            expect(pool.pool.length).toBeLessThanOrEqual(20);
        });
        
        it('should release multiple objects at once', () => {
            const objects = [pool.get(), pool.get(), pool.get()];
            pool.releaseAll(objects);
            
            expect(pool.activeCount).toBe(0);
            expect(pool.pool.length).toBe(5);
        });
        
        it('should provide accurate statistics', () => {
            pool.get();
            pool.get();
            const obj = pool.get();
            pool.release(obj);
            
            const stats = pool.getStats();
            expect(stats.activeCount).toBe(2);
            expect(stats.poolSize).toBe(3);
            expect(stats.totalCreated).toBe(5);
            expect(stats.totalReused).toBe(3);
        });
        
        it('should check pool health', () => {
            // Generate some reuse to make pool healthy
            const obj1 = pool.get();
            const obj2 = pool.get();
            pool.release(obj1);
            pool.release(obj2);
            pool.get(); // Reuse obj2
            pool.get(); // Reuse obj1
            
            expect(pool.isHealthy()).toBe(true);
            
            // Make pool unhealthy by creating many new objects
            for (let i = 0; i < 50; i++) {
                pool.get();
            }
            expect(pool.isHealthy()).toBe(false);
        });
        
        it('should resize pool correctly', () => {
            pool.resize(10);
            expect(pool.maxSize).toBe(10);
            
            pool.resize(3);
            expect(pool.maxSize).toBe(3);
            expect(pool.pool.length).toBeLessThanOrEqual(3);
        });
        
        it('should pre-warm pool', () => {
            pool.preWarm(10);
            expect(pool.pool.length).toBeGreaterThan(5);
        });
        
        it('should clear pool', () => {
            pool.get();
            pool.clear();
            
            expect(pool.pool.length).toBe(0);
            expect(pool.activeCount).toBe(0);
            expect(pool.totalCreated).toBe(0);
        });
    });
    
    describe('PoolManager', () => {
        let manager;
        
        beforeEach(() => {
            manager = new PoolManager();
        });
        
        it('should create and manage multiple pools', () => {
            const createFn = () => ({ type: 'test' });
            const resetFn = (obj) => { obj.used = false; };
            
            manager.createPool('testPool', createFn, resetFn, 5, 20);
            
            const pool = manager.getPool('testPool');
            expect(pool).toBeDefined();
            expect(pool.pool.length).toBe(5);
        });
        
        it('should get and release objects through manager', () => {
            const createFn = () => ({ value: 0 });
            const resetFn = (obj, val) => { obj.value = val; };
            
            manager.createPool('numbers', createFn, resetFn);
            
            const obj = manager.get('numbers', 42);
            expect(obj.value).toBe(42);
            
            manager.release('numbers', obj);
            const pool = manager.getPool('numbers');
            expect(pool.activeCount).toBe(0);
        });
        
        it('should provide combined statistics', () => {
            manager.createPool('pool1', () => ({}), null);
            manager.createPool('pool2', () => ({}), null);
            
            manager.get('pool1');
            manager.get('pool2');
            
            const stats = manager.getStats();
            expect(stats.pool1).toBeDefined();
            expect(stats.pool2).toBeDefined();
        });
        
        it('should calculate memory savings', () => {
            const createFn = () => ({});
            manager.createPool('savings', createFn, null);
            
            // Use objects to generate reuse
            const obj1 = manager.get('savings');
            manager.release('savings', obj1);
            manager.get('savings'); // This should reuse obj1
            
            const savings = manager.getMemorySavings();
            expect(savings.objectsReused).toBeGreaterThan(0);
        });
        
        it('should check pool health across all pools', () => {
            manager.createPool('healthy', () => ({}), null, 5, 10);
            
            // Generate sufficient reuse to make pool healthy
            const obj1 = manager.get('healthy');
            const obj2 = manager.get('healthy');
            manager.release('healthy', obj1);
            manager.release('healthy', obj2);
            manager.get('healthy'); // Reuse obj2
            manager.get('healthy'); // Reuse obj1
            manager.get('healthy'); // Create new (now have created 5+2=7, reused 2, ratio = 2/7 = 0.29)
            
            // Need more reuse to get above 50% threshold
            const pool = manager.getPool('healthy');
            const obj3 = pool.get();
            const obj4 = pool.get();
            pool.release(obj3);
            pool.release(obj4);
            pool.get(); // Reuse
            pool.get(); // Reuse
            pool.get(); // Create new
            pool.release(pool.get()); // Get and immediately release
            pool.get(); // Reuse again
            
            expect(manager.areAllPoolsHealthy()).toBe(true);
        });
        
        it('should clear all pools', () => {
            manager.createPool('pool1', () => ({}), null);
            manager.createPool('pool2', () => ({}), null);
            
            manager.get('pool1');
            manager.get('pool2');
            
            manager.clearAll();
            
            const stats = manager.getStats();
            expect(stats.pool1.activeCount).toBe(0);
            expect(stats.pool2.activeCount).toBe(0);
        });
    });
    
    describe('Particle Object Pooling', () => {
        it('should support pooling with reset function', () => {
            const factory = Particle.createFactory();
            const resetFn = Particle.resetParticle;
            
            const pool = new ObjectPool(factory, resetFn, 5, 20);
            
            const particle1 = pool.get(100, 50, '#FF0000', '✨', 'celebration');
            expect(particle1.x).toBe(100);
            expect(particle1.y).toBe(50);
            expect(particle1.color).toBe('#FF0000');
            expect(particle1.text).toBe('✨');
            expect(particle1.type).toBe('celebration');
            
            pool.release(particle1);
            
            const particle2 = pool.get(200, 100, '#00FF00', '🎉', 'star');
            expect(particle2.x).toBe(200);
            expect(particle2.y).toBe(100);
            expect(particle2.color).toBe('#00FF00');
            expect(particle2 === particle1).toBe(true); // Same object, reused
        });
        
        it('should initialize particle correctly for pooling', () => {
            const particle = new Particle();
            
            particle.init(50, 75, '#BLUE', '⭐', 'star', { size: 10 });
            
            expect(particle.x).toBe(50);
            expect(particle.y).toBe(75);
            expect(particle.color).toBe('#BLUE');
            expect(particle.text).toBe('⭐');
            expect(particle.type).toBe('star');
            expect(particle.size).toBe(10);
        });
    });
    
    describe('PerformanceMonitor', () => {
        let monitor;
        
        beforeEach(() => {
            monitor = new PerformanceMonitor({
                sampleSize: 10,
                targetFPS: 60,
                debugMode: false
            });
        });
        
        it('should initialize with default settings', () => {
            const stats = monitor.getStats();
            expect(stats.currentFPS).toBe(60);
            expect(stats.performanceLevel).toBe('high');
        });
        
        it('should track frame times and calculate FPS', () => {
            const baseTime = 1000;
            
            // Simulate 60 FPS (16.67ms per frame)
            for (let i = 0; i < 10; i++) {
                monitor.update(baseTime + (i * 16.67));
            }
            
            const stats = monitor.getStats();
            expect(stats.averageFPS).toBeCloseTo(60, 1);
            expect(stats.performanceLevel).toBe('high');
        });
        
        it('should detect performance degradation', () => {
            const baseTime = 1000;
            
            // Simulate poor performance (30 FPS)
            for (let i = 0; i < 15; i++) {
                monitor.update(baseTime + (i * 33.33));
            }
            
            const stats = monitor.getStats();
            expect(stats.averageFPS).toBeLessThan(35);
        });
        
        it('should adjust quality settings based on performance', () => {
            const highSettings = monitor.getQualitySettings();
            expect(highSettings.maxParticles).toBe(200);
            expect(highSettings.enableShadows).toBe(true);
            
            monitor.setPerformanceLevel('low');
            const lowSettings = monitor.getQualitySettings();
            expect(lowSettings.maxParticles).toBe(50);
            expect(lowSettings.enableShadows).toBe(false);
        });
        
        it('should emit performance level change events', () => {
            const callback = vi.fn();
            monitor.on('performanceLevelChanged', callback);
            
            monitor.setPerformanceLevel('medium');
            
            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    oldLevel: 'high',
                    newLevel: 'medium',
                    forced: true
                })
            );
        });
        
        it('should detect frame drops', () => {
            const callback = vi.fn();
            monitor.on('frameDropDetected', callback);
            
            monitor.update(1000);
            monitor.update(1050); // 50ms frame (should trigger frame drop)
            
            expect(callback).toHaveBeenCalled();
        });
        
        it('should check performance status', () => {
            expect(monitor.isPerformanceGood()).toBe(true);
            expect(monitor.isPerformanceCritical()).toBe(false);
            
            monitor.setPerformanceLevel('critical');
            expect(monitor.isPerformanceCritical()).toBe(true);
        });
        
        it('should reset monitoring state', () => {
            monitor.update(1000);
            monitor.update(1016.67);
            
            monitor.reset();
            
            const stats = monitor.getStats();
            expect(stats.currentFPS).toBe(60);
            expect(monitor.frameCount).toBe(0);
        });
        
        it('should enable/disable monitoring', () => {
            monitor.setEnabled(false);
            monitor.update(1000);
            monitor.update(1016.67);
            
            expect(monitor.frameCount).toBe(0);
            
            monitor.setEnabled(true);
            monitor.update(2000);
            monitor.update(2016.67);
            
            expect(monitor.frameCount).toBe(1);
        });
        
        it('should provide detailed performance report', () => {
            monitor.update(1000);
            monitor.update(1016.67);
            
            const report = monitor.getReport();
            expect(report.enabled).toBe(true);
            expect(report.frameCount).toBe(1);
            expect(report.stats).toBeDefined();
            expect(report.qualitySettings).toBeDefined();
            expect(report.isHealthy).toBeDefined();
            expect(report.targetFPS).toBe(60);
        });
    });
});