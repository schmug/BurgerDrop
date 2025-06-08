# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BurgerDrop is an HTML5 canvas game where players tap falling ingredients to complete burger orders. The game is deployed via Cloudflare Workers for serverless hosting.

## Architecture

- **Cloudflare Workers deployment**: Game is served from `src/worker.js` with embedded HTML
- **Canvas-based rendering**: Uses HTML5 canvas for game graphics with 2D context
- **Entity system**: Implemented through classes:
  - `Ingredient`: Falling game objects with physics, trail effects, and rotation
  - `Order`: Customer orders with timer mechanics and progress tracking
  - `Particle`: Advanced particle system for visual effects and feedback
  - `PowerUp`: Collectible items with various gameplay effects
- **Game loop**: Standard requestAnimationFrame-based game loop with delta time
- **State management**: Global variables for game state (score, lives, combo, etc.)
- **Touch/click input**: Unified event handling for mobile and desktop
- **Audio system**: Web Audio API with procedural music generation and sound synthesis
- **Visual effects**: Dynamic color themes, particle systems, and smooth animations
- **Easing functions**: Custom mathematical easing for smooth transitions

## Game Mechanics

### Core Gameplay
- **Ingredient matching**: Players must tap ingredients in the correct order to complete orders
- **Order system**: Multiple simultaneous orders with time limits and progress tracking
- **Scoring**: Base points multiplied by combo multiplier, with time bonuses
- **Difficulty scaling**: Ingredient speed and spawn rate increase over time
- **Lives system**: Players lose lives when orders expire

### Power-Up System
- **Speed Boost**: Temporarily slows down falling ingredients
- **Time Freeze**: Pauses order timers for a brief period
- **Score Multiplier**: Doubles points for a limited time
- **Random spawning**: Power-ups appear occasionally during gameplay
- **Visual feedback**: Distinct animations and effects for each power-up type

### Audio System
- **Procedural music**: Dynamic background music generated using Web Audio API
- **Sound effects**: Custom synthesized sounds for interactions
- **Audio controls**: Mute/unmute functionality with persistent settings
- **Web Audio API**: Advanced audio synthesis with custom waveforms

### Visual Effects
- **Particle system**: Dynamic particles for ingredient trails, explosions, and feedback
- **Trail effects**: Smooth ingredient trails with gradient rendering
- **Color themes**: Dynamic background colors that shift based on performance
- **Smooth animations**: Custom easing functions for natural movement
- **Screen effects**: Subtle visual feedback for game events

### Mobile Features
- **Touch optimization**: Responsive touch handling with proper event prevention
- **Vibration feedback**: Haptic feedback for enhanced mobile experience
- **Responsive design**: Automatic canvas resizing for different screen sizes
- **Performance optimization**: Frame-rate aware animations and effects

## Development Notes

- No build process or external dependencies required
- Game uses localStorage for high score persistence (with fallback for sandboxed environments)
- Responsive design with canvas resizing for different screen sizes
- Mobile-optimized with touch event handling and scroll prevention

## Performance Optimizations

- **Particle management**: Automatic culling of particles when count exceeds limits
- **Trail rendering**: Efficient gradient-based trail effects with alpha blending
- **Frame-rate awareness**: Animations scaled by delta time for consistent performance
- **Memory management**: Automatic cleanup of expired game objects
- **Canvas optimization**: Minimal redraw operations and efficient rendering
- **Audio optimization**: Reusable AudioContext and efficient sound synthesis
- **Event handling**: Debounced input processing to prevent excessive calculations

## Deployment

- **Cloudflare Workers**: Game is deployed via Cloudflare Workers with embedded HTML
- **GitHub Actions**: Automatic deployment on push to main branch
- **Wrangler**: Uses wrangler 4.18.0 for deployment management
- **Worker Architecture**: HTML is embedded directly in `src/worker.js` for serverless deployment

## Advanced Features

- **Dynamic difficulty**: Game speed and complexity increase based on player performance
- **Emoji variants**: Ingredients occasionally display alternate emoji variants for visual variety
- **Mathematical easing**: Custom cubic and exponential easing functions for smooth animations
- **Contextual audio**: Audio frequencies and patterns that respond to game events
- **Progressive enhancement**: Game works in sandboxed environments with graceful feature degradation
- **Performance monitoring**: Frame-rate aware systems that adapt to device capabilities

## Testing

The project includes a comprehensive testing framework using Vitest:

- **Test Framework**: Vitest with JSDOM environment for DOM testing
- **Coverage**: V8 coverage provider with HTML, JSON, and text reports
- **Test Categories**:
  - Game logic tests (ingredients, orders, scoring)
  - Collision detection tests
  - Audio system tests
  - Power-up system tests
  - Cloudflare Worker tests
- **Mocking**: Canvas API, Web Audio API, and localStorage are mocked for testing

## Commands

- `npm run dev` - Start local development server with wrangler
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage report
- `wrangler login` - Authenticate with Cloudflare (required once)

## Development Workflow

### Building and Deploying Changes

After making substantial changes to the game:

1. **Build the game**: Run `npm run build` to bundle the game and inject it into the worker
2. **Test locally**: Run `npm run dev` and test at http://localhost:8787
3. **Commit changes**: Stage all changes with `git add -A`, then commit with a descriptive message
4. **Push to deploy**: Push to the main branch to trigger automatic deployment via GitHub Actions

**Important**: The game won't work in production until the build process is run and changes are deployed. Always ensure `npm run build` is run before committing when game code is modified.

## Setup Requirements

For deployment, add these GitHub repository secrets:
- `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

## Troubleshooting

### Known Issues
- **Test coverage source mapping error**: The V8 coverage provider may show a source mapping error. This doesn't affect test execution or results, only coverage report generation. Use `npm run test:run` for testing without coverage if needed.
- **CJS deprecation warning**: Vitest shows a warning about CJS build deprecation. This is non-critical and doesn't affect functionality.

### Performance Tips
- Game automatically adapts to device performance capabilities
- Audio can be muted for better performance on lower-end devices
- Particle effects are automatically culled to maintain frame rate