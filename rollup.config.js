import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const isProduction = process.env.NODE_ENV === 'production';

// Build the game as an IIFE bundle
export default {
  input: 'src/game/Game.js',
  output: {
    file: 'src/build/game.js',
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
};
