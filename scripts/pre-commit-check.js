#!/usr/bin/env node

/**
 * Pre-commit check script
 * Runs all necessary checks before allowing a commit
 * This ensures code quality and adherence to TDD practices
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, silent = false) {
  try {
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: silent ? 'pipe' : 'inherit'
    });
    return { success: true, output };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function checkTests() {
  log('\n📋 Running tests...', 'blue');
  const result = runCommand('npm run test:run');
  
  if (result.success) {
    log('✅ All tests passed', 'green');
    return true;
  } else {
    log('❌ Tests failed', 'red');
    return false;
  }
}

async function checkCoverage() {
  log('\n📊 Checking test coverage...', 'blue');
  const result = runCommand('npm run test:coverage', true);
  
  if (result.success) {
    const coveragePath = join(process.cwd(), 'coverage', 'coverage-summary.json');
    if (existsSync(coveragePath)) {
      const coverage = JSON.parse(readFileSync(coveragePath, 'utf8'));
      const lineCoverage = coverage.total.lines.pct;
      
      if (lineCoverage >= 80) {
        log(`✅ Coverage: ${lineCoverage.toFixed(2)}% (meets 80% threshold)`, 'green');
        return true;
      } else {
        log(`❌ Coverage: ${lineCoverage.toFixed(2)}% (below 80% threshold)`, 'red');
        return false;
      }
    }
  }
  
  log('⚠️  Could not determine coverage', 'yellow');
  return false;
}

async function checkBuild() {
  log('\n🔨 Checking build...', 'blue');
  const result = runCommand('npm run build');
  
  if (result.success) {
    log('✅ Build successful', 'green');
    return true;
  } else {
    log('❌ Build failed', 'red');
    return false;
  }
}

async function checkStagedFiles() {
  log('\n📁 Checking staged files...', 'blue');
  const result = runCommand('git diff --cached --name-only', true);
  
  if (result.success) {
    const files = result.output.trim().split('\n').filter(f => f);
    const jsFiles = files.filter(f => f.endsWith('.js'));
    const testFiles = files.filter(f => f.includes('test'));
    
    if (jsFiles.length > 0) {
      log(`Found ${jsFiles.length} JavaScript files`, 'yellow');
      
      // Check if source files have corresponding tests
      const srcFiles = jsFiles.filter(f => f.startsWith('src/') && !f.includes('test'));
      if (srcFiles.length > 0 && testFiles.length === 0) {
        log('⚠️  Source files modified but no test files included', 'yellow');
        log('   Remember: TDD requires tests for all functional code', 'yellow');
      }
    }
    
    return true;
  }
  
  return false;
}

async function main() {
  log('🚀 Running pre-commit checks...', 'blue');
  log('This ensures compliance with TDD practices outlined in CLAUDE.md\n', 'yellow');
  
  const checks = [
    { name: 'Staged Files', fn: checkStagedFiles, required: false },
    { name: 'Tests', fn: checkTests, required: true },
    { name: 'Coverage', fn: checkCoverage, required: true },
    { name: 'Build', fn: checkBuild, required: true }
  ];
  
  let allPassed = true;
  
  for (const check of checks) {
    const passed = await check.fn();
    if (!passed && check.required) {
      allPassed = false;
    }
  }
  
  if (allPassed) {
    log('\n✅ All checks passed! Ready to commit.', 'green');
    process.exit(0);
  } else {
    log('\n❌ Some checks failed. Please fix the issues before committing.', 'red');
    log('\nRefer to CLAUDE.md for TDD workflow guidelines.', 'yellow');
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}