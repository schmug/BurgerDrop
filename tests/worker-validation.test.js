import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Worker Validation', () => {
  let workerContent;
  
  beforeAll(() => {
    const workerPath = path.join(process.cwd(), 'src', 'worker.js');
    workerContent = fs.readFileSync(workerPath, 'utf-8');
  });

  it('should not contain merge conflict markers', () => {
    expect(workerContent).not.toMatch(/<<<<<<< HEAD/);
    expect(workerContent).not.toMatch(/=======/);
    expect(workerContent).not.toMatch(/>>>>>>> /);
  });

  it('should contain required HTML elements', () => {
    // Check for start screen
    expect(workerContent).toMatch(/<div id="startScreen">/);
    expect(workerContent).toMatch(/<button[^>]*id="startButton"[^>]*>Start Game<\/button>/);
    
    // Check for game canvas
    expect(workerContent).toMatch(/<canvas id="gameCanvas"><\/canvas>/);
    
    // Check for game over overlay
    expect(workerContent).toMatch(/<div[^>]*id="gameOverOverlay"[^>]*>/);
    expect(workerContent).toMatch(/<button[^>]*id="playAgainBtn"[^>]*>Play Again!<\/button>/);
    
    // Check for audio toggle
    expect(workerContent).toMatch(/<button[^>]*id="audioToggle"[^>]*>/);
    
    // Check for score display
    expect(workerContent).toMatch(/<div[^>]*id="score"[^>]*>Score: 0<\/div>/);
  });

  it('should contain game initialization script', () => {
    // Check for game initialization
    expect(workerContent).toMatch(/new Game\(/);
    expect(workerContent).toMatch(/game\.start\(\)/);
    
    // Check for event listeners
    expect(workerContent).toMatch(/startButton\.addEventListener\('click'/);
    expect(workerContent).toMatch(/playAgainBtn\.addEventListener\('click'/);
    expect(workerContent).toMatch(/audioToggle\.addEventListener\('click'/);
  });

  it('should be a valid ES module', () => {
    expect(workerContent).toMatch(/export default \{/);
    expect(workerContent).toMatch(/async fetch\(request, env, ctx\)/);
  });

  it('should contain embedded game bundle', () => {
    // Check that the game bundle is properly embedded
    expect(workerContent).toMatch(/class Game/);
    expect(workerContent).toMatch(/class Ingredient/);
    expect(workerContent).toMatch(/class Order/);
    expect(workerContent).toMatch(/class Particle/);
    expect(workerContent).toMatch(/class PowerUp/);
  });

  it('should have proper HTML structure', () => {
    // Check for DOCTYPE and basic HTML structure
    expect(workerContent).toMatch(/<!DOCTYPE html>/);
    expect(workerContent).toMatch(/<html lang="en">/);
    expect(workerContent).toMatch(/<head>/);
    expect(workerContent).toMatch(/<body>/);
    expect(workerContent).toMatch(/<\/html>/);
  });

  it('should return HTML with correct headers', () => {
    // Check that the worker returns HTML with correct content type
    expect(workerContent).toMatch(/'Content-Type': 'text\/html/);
  });
});