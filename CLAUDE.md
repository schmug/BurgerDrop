# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BurgerDrop is an HTML5 canvas game where players tap falling ingredients to complete burger orders. The game is deployed via Cloudflare Workers for serverless hosting.

## Architecture

- **Cloudflare Workers deployment**: Game is served from `src/worker.js` with embedded HTML
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

## Deployment

- **Cloudflare Workers**: Game is deployed via Cloudflare Workers with embedded HTML
- **GitHub Actions**: Automatic deployment on push to main branch
- **Wrangler**: Uses wrangler 4.18.0 for deployment management
- **Worker Architecture**: HTML is embedded directly in `src/worker.js` for serverless deployment

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

## Setup Requirements

For deployment, add these GitHub repository secrets:
- `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID