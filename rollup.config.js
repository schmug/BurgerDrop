import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from '@rollup/plugin-terser';
import { string } from 'rollup-plugin-string';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'src/game/Game.js', // Will be our main entry point
  output: {
    file: 'src/worker.js',
    format: 'es',
    banner: '// BurgerDrop Game - Built from modular source\n// Auto-generated - do not edit directly',
    sourcemap: !isProduction
  },
  plugins: [
    // Handle CSS and HTML as strings
    string({
      include: ['**/*.css', '**/*.html']
    }),
    
    // Resolve node modules
    nodeResolve(),
    
    // Minify in production
    isProduction && terser({
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    })
  ].filter(Boolean),
  
  // External dependencies (don't bundle these)
  external: [],
  
  // Watch files for development
  watch: {
    include: 'src/**'
  }
};