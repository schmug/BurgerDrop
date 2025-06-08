#!/usr/bin/env node
// Build script to create the final worker.js

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Paths
const GAME_BUNDLE_PATH = join(rootDir, 'src/build/game.js');
const CSS_PATH = join(rootDir, 'src/game/templates/styles.css');
const TEMPLATE_PATH = join(rootDir, 'src/game/worker-template.js');
const OUTPUT_PATH = join(rootDir, 'src/worker.js');

console.log('Building Cloudflare Worker...');

try {
  // Read the game bundle
  if (!existsSync(GAME_BUNDLE_PATH)) {
    throw new Error(`Game bundle not found at ${GAME_BUNDLE_PATH}. Run 'npm run build:game' first.`);
  }
  const gameBundle = readFileSync(GAME_BUNDLE_PATH, 'utf8');
  console.log(`✓ Read game bundle (${(gameBundle.length / 1024).toFixed(2)} KB)`);

  // Read the CSS
  if (!existsSync(CSS_PATH)) {
    throw new Error(`CSS file not found at ${CSS_PATH}`);
  }
  const css = readFileSync(CSS_PATH, 'utf8');
  console.log(`✓ Read CSS (${(css.length / 1024).toFixed(2)} KB)`);

  // Read the template
  if (!existsSync(TEMPLATE_PATH)) {
    throw new Error(`Template file not found at ${TEMPLATE_PATH}`);
  }
  let template = readFileSync(TEMPLATE_PATH, 'utf8');
  console.log(`✓ Read template`);

  // Escape backticks and template literal syntax in content to prevent conflicts
  const escapedCSS = css.replace(/`/g, '\\`').replace(/\${/g, '\\${');
  const escapedGameBundle = gameBundle.replace(/`/g, '\\`').replace(/\${/g, '\\${');

  // Replace placeholders
  template = template.replace('{{CSS_CONTENT}}', escapedCSS);
  template = template.replace('{{GAME_BUNDLE}}', escapedGameBundle);

  // Write the final worker file
  writeFileSync(OUTPUT_PATH, template);
  console.log(`✓ Written worker to ${OUTPUT_PATH} (${(template.length / 1024).toFixed(2)} KB)`);

  console.log('\n✅ Worker build complete!');
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}