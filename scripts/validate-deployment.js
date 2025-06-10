#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Validating deployment readiness...\n');

let hasErrors = false;

// Check worker.js exists
const workerPath = path.join(__dirname, '..', 'src', 'worker.js');
if (!fs.existsSync(workerPath)) {
  console.error('❌ Error: worker.js not found at', workerPath);
  hasErrors = true;
  process.exit(1);
}

const workerContent = fs.readFileSync(workerPath, 'utf-8');

// Check for merge conflicts
const conflictPatterns = [
  /<<<<<<< HEAD/,
  /=======/,
  />>>>>>> /
];

conflictPatterns.forEach(pattern => {
  if (pattern.test(workerContent)) {
    console.error('❌ Error: Merge conflict markers found in worker.js');
    console.error('   Pattern:', pattern);
    hasErrors = true;
  }
});

// Check for required UI elements
const requiredElements = [
  { pattern: /<div id="startScreen">/, name: 'Start screen' },
  { pattern: /<button[^>]*id="startButton"/, name: 'Start button' },
  { pattern: /<canvas id="gameCanvas">/, name: 'Game canvas' },
  { pattern: /<div[^>]*id="gameOverOverlay"/, name: 'Game over overlay' },
  { pattern: /<button[^>]*id="playAgainBtn"/, name: 'Play again button' },
  { pattern: /<button[^>]*id="audioToggle"/, name: 'Audio toggle button' },
  { pattern: /<div[^>]*id="score"/, name: 'Score display' }
];

console.log('📋 Checking required UI elements:');
requiredElements.forEach(({ pattern, name }) => {
  if (pattern.test(workerContent)) {
    console.log(`   ✅ ${name}`);
  } else {
    console.error(`   ❌ ${name} - NOT FOUND`);
    hasErrors = true;
  }
});

// Check for game code
const gameClasses = [
  { pattern: /class Game/, name: 'Game class' },
  { pattern: /class Ingredient/, name: 'Ingredient class' },
  { pattern: /class Order/, name: 'Order class' },
  { pattern: /class Particle/, name: 'Particle class' },
  { pattern: /class PowerUp/, name: 'PowerUp class' }
];

console.log('\n📦 Checking game bundle:');
gameClasses.forEach(({ pattern, name }) => {
  if (pattern.test(workerContent)) {
    console.log(`   ✅ ${name}`);
  } else {
    console.error(`   ❌ ${name} - NOT FOUND`);
    hasErrors = true;
  }
});

// Check ES module structure
console.log('\n🏗️  Checking worker structure:');
if (/export default \{/.test(workerContent)) {
  console.log('   ✅ ES module export');
} else {
  console.error('   ❌ ES module export - NOT FOUND');
  hasErrors = true;
}

if (/async fetch\(request, env, ctx\)/.test(workerContent)) {
  console.log('   ✅ Fetch handler');
} else {
  console.error('   ❌ Fetch handler - NOT FOUND');
  hasErrors = true;
}

// Check file size (warn if too large)
const stats = fs.statSync(workerPath);
const sizeInKB = stats.size / 1024;
console.log(`\n📏 Worker size: ${sizeInKB.toFixed(2)} KB`);
if (sizeInKB > 1024) {
  console.warn('   ⚠️  Warning: Worker is larger than 1MB');
}

// Final result
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.error('\n❌ VALIDATION FAILED - Please fix the errors above before deploying');
  process.exit(1);
} else {
  console.log('\n✅ VALIDATION PASSED - Ready to deploy! 🚀');
  process.exit(0);
}