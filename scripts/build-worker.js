#!/usr/bin/env node
// Build script to create the final worker.js

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('Building Cloudflare Worker...');

// Read the files
const workerTemplate = readFileSync(join(rootDir, 'src/game/worker-template.js'), 'utf8');
const cssContent = readFileSync(join(rootDir, 'src/game/templates/styles.css'), 'utf8');
const gameBundle = readFileSync(join(rootDir, 'src/build/game.iife.js'), 'utf8');

// Escape backticks in the game bundle to prevent template literal conflicts
const escapedGameBundle = gameBundle.replace(/`/g, '\\`').replace(/\${/g, '\\${');

// Inject CSS and game bundle into the worker template
let finalWorker = workerTemplate
  .replace('/* INJECT_CSS_HERE */', cssContent)
  .replace('/* INJECT_GAME_HERE */', escapedGameBundle);

// Write the final worker
writeFileSync(join(rootDir, 'src/worker.js'), finalWorker);

console.log('Worker built successfully!');