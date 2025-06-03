# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BurgerDrop is a single-file HTML5 canvas game where players tap falling ingredients to complete burger orders. The entire game is contained in one `index.html` file with embedded CSS and JavaScript.

## Architecture

- **Single-file architecture**: All game logic, styling, and HTML are contained in `index.html`
- **Canvas-based rendering**: Uses HTML5 canvas for game graphics with 2D context
- **Entity system**: Implemented through classes:
  - `Ingredient`: Falling game objects with physics
  - `Order`: Customer orders with timer mechanics  
  - `Particle`: Visual effects for feedback
- **Game loop**: Standard requestAnimationFrame-based game loop with delta time
- **State management**: Global variables for game state (score, lives, combo, etc.)
- **Touch/click input**: Unified event handling for mobile and desktop

## Game Mechanics

- **Ingredient matching**: Players must tap ingredients in the correct order to complete orders
- **Order system**: Multiple simultaneous orders with time limits
- **Scoring**: Base points multiplied by combo multiplier, with time bonuses
- **Difficulty scaling**: Ingredient speed and spawn rate increase over time
- **Lives system**: Players lose lives when orders expire

## Development Notes

- No build process or external dependencies required
- Game uses localStorage for high score persistence (with fallback for sandboxed environments)
- Responsive design with canvas resizing for different screen sizes
- Mobile-optimized with touch event handling and scroll prevention
- Cloudflare Workers for deployment
- TypeScript for type safety and better code quality

## TODO

- Add sound effects
- Add music
- Add particle effects
- Add particle physics
- Add particle emitter
- Cloudflare and Wrangler setup