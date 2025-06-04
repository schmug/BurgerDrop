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

## Deployment

- **Cloudflare Workers**: Game is deployed via Cloudflare Workers with embedded HTML
- **GitHub Actions**: Automatic deployment on push to main branch
- **Wrangler**: Uses wrangler 4.18.0 for deployment management
- **Worker Architecture**: HTML is embedded directly in `src/worker.js` for serverless deployment

⚠️ **IMPORTANT**: Any changes made to `index.html` must also be replicated in `src/worker.js` for deployment. The worker.js file contains an embedded copy of the entire game HTML that gets served to users. Always update both files when making changes to maintain consistency between local development and production deployment.

## Commands

- `npm run dev` - Start local development server with wrangler
- `npm run deploy` - Deploy to Cloudflare Workers
- `wrangler login` - Authenticate with Cloudflare (required once)

## Setup Requirements

For deployment, add these GitHub repository secrets:
- `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID