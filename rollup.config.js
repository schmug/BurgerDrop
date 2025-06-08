import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { string } from 'rollup-plugin-string';

const isProduction = process.env.NODE_ENV === 'production';

// Two-step build process
export default [
  // Step 1: Build the game as an IIFE bundle
  {
    input: 'src/game/Game.js',
    output: {
      file: 'src/build/game.iife.js',
      format: 'iife',
      name: 'Game',
      exports: 'default',
      sourcemap: false
    },
    plugins: [
      nodeResolve(),
      isProduction && terser({
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      })
    ].filter(Boolean)
  },
  
  // Step 2: Build the worker
  {
    input: 'src/game/worker-final.js',
    output: {
      file: 'src/worker.js',
      format: 'es',
      banner: '// BurgerDrop Game - Built from modular source\n// Auto-generated - do not edit directly',
      sourcemap: !isProduction
    },
    plugins: [
      string({
        include: ['**/*.css', '**/*.html', '**/*.iife.js']
      }),
      nodeResolve(),
      isProduction && terser({
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      })
    ].filter(Boolean)
  }
];
