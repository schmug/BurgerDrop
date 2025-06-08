<<<<<<< HEAD
# 🍔 Burger Drop

A fast-paced HTML5 canvas game where players tap falling ingredients to complete burger orders. Built for the web and deployed serverlessly via Cloudflare Workers.

**[🎮 Play Now](https://burger-drop.cory7593.workers.dev/)**

## 🎯 About

Burger Drop combines quick reflexes with strategic thinking as players race to complete customer orders by catching the right ingredients in the correct sequence. With dynamic difficulty scaling, power-ups, and stunning visual effects, it's an engaging experience for players of all skill levels.

## ✨ Features

### 🎮 Core Gameplay
- **Ingredient Matching**: Tap falling ingredients in the correct order to complete orders
- **Multiple Orders**: Manage several customer orders simultaneously 
- **Time Pressure**: Orders expire if not completed in time
- **Combo System**: Build combos for higher scores and multipliers
- **Lives System**: Strategic gameplay with limited lives

### 🚀 Power-ups
- **⚡ Speed Boost**: Slow down falling ingredients temporarily
- **❄️ Time Freeze**: Pause order timers for breathing room
- **💰 Score Multiplier**: Double your points for a limited time

### 🎨 Visual Effects
- **Particle System**: Dynamic particles for trails, explosions, and feedback
- **Trail Effects**: Smooth ingredient trails with gradient rendering
- **Color Themes**: Background colors that shift based on performance
- **Smooth Animations**: Custom easing functions for natural movement

### 🔊 Audio Experience
- **Procedural Music**: Dynamic background music generated with Web Audio API
- **Sound Effects**: Custom synthesized sounds for all interactions
- **Audio Controls**: Persistent mute/unmute settings

### 📱 Mobile Optimized
- **Touch Controls**: Responsive touch handling for mobile devices
- **Vibration Feedback**: Haptic feedback for enhanced mobile experience
- **Responsive Design**: Automatic canvas resizing for all screen sizes
- **Performance Aware**: Frame-rate adaptive animations

## 🛠️ Technology Stack

- **Frontend**: HTML5 Canvas, Vanilla JavaScript
- **Audio**: Web Audio API with procedural generation
- **Deployment**: Cloudflare Workers (serverless)
- **Testing**: Vitest with comprehensive test coverage
- **CI/CD**: GitHub Actions for automatic deployment

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/burger-drop.git
cd burger-drop

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Development Commands

```bash
# Development server
npm run dev

# Run tests
npm test

# Run tests once
npm run test:run

# Test coverage
npm run test:coverage

# Deploy to Cloudflare Workers
npm run deploy
```

## 🌐 Deployment

### Cloudflare Workers Setup

1. **Install Wrangler CLI** (if not already installed):
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

### GitHub Actions (Automatic Deployment)

The project includes automatic deployment via GitHub Actions. Add these secrets to your repository:

- `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

Pushes to the `main` branch will automatically deploy to Cloudflare Workers.

## 🧪 Testing

Comprehensive test suite covering:
- Game logic (ingredients, orders, scoring)
- Collision detection
- Audio system functionality
- Power-up mechanics
- Cloudflare Worker deployment

```bash
# Run all tests
npm test

# Single test run
npm run test:run

# Coverage report
npm run test:coverage
```

## 🎯 Game Mechanics

### Scoring System
- **Base Points**: Each ingredient has a base point value
- **Combo Multiplier**: Consecutive correct ingredients increase multiplier
- **Time Bonus**: Faster order completion awards bonus points
- **Power-up Bonuses**: Special multipliers from power-ups

### Difficulty Scaling
- Ingredient fall speed increases over time
- More complex orders appear as game progresses
- Spawn rate increases with player skill level

## 🔧 Architecture

- **Single File Deployment**: HTML embedded directly in Cloudflare Worker
- **Entity System**: Object-oriented design with Ingredient, Order, Particle, and PowerUp classes
- **Game Loop**: RequestAnimationFrame-based loop with delta time calculations
- **Performance Optimized**: Automatic particle culling and frame-rate aware animations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎮 Gameplay Tips

- **Watch the Orders**: Keep an eye on multiple orders and their timers
- **Build Combos**: Try to complete ingredients in sequence for higher scores
- **Use Power-ups Strategically**: Save power-ups for challenging moments
- **Stay Calm**: The game gets faster, but accuracy is more important than speed

## 🏆 High Scores

High scores are saved locally using localStorage, so you can track your personal best!

---

**Made with ❤️ and lots of ☕**

=======
# 🍔 Burger Drop

A fast-paced HTML5 canvas game where players tap falling ingredients to complete burger orders. Built for the web and deployed serverlessly via Cloudflare Workers.

**[🎮 Play Now](https://burger-drop.cory7593.workers.dev/)**

## 🎯 About

Burger Drop combines quick reflexes with strategic thinking as players race to complete customer orders by catching the right ingredients in the correct sequence. With dynamic difficulty scaling, power-ups, and stunning visual effects, it's an engaging experience for players of all skill levels.

## ✨ Features

### 🎮 Core Gameplay
- **Ingredient Matching**: Tap falling ingredients in the correct order to complete orders
- **Multiple Orders**: Manage several customer orders simultaneously 
- **Time Pressure**: Orders expire if not completed in time
- **Combo System**: Build combos for higher scores and multipliers
- **Lives System**: Strategic gameplay with limited lives

### 🚀 Power-ups
- **⚡ Speed Boost**: Slow down falling ingredients temporarily
- **❄️ Time Freeze**: Pause order timers for breathing room
- **💰 Score Multiplier**: Double your points for a limited time

### 🎨 Visual Effects
- **Particle System**: Dynamic particles for trails, explosions, and feedback
- **Trail Effects**: Smooth ingredient trails with gradient rendering
- **Color Themes**: Background colors that shift based on performance
- **Smooth Animations**: Custom easing functions for natural movement

### 🔊 Audio Experience
- **Procedural Music**: Dynamic background music generated with Web Audio API
- **Sound Effects**: Custom synthesized sounds for all interactions
- **Audio Controls**: Persistent mute/unmute settings

### 📱 Mobile Optimized
- **Touch Controls**: Responsive touch handling for mobile devices
- **Vibration Feedback**: Haptic feedback for enhanced mobile experience
- **Responsive Design**: Automatic canvas resizing for all screen sizes
- **Performance Aware**: Frame-rate adaptive animations

## 🛠️ Technology Stack

- **Frontend**: HTML5 Canvas, Vanilla JavaScript
- **Audio**: Web Audio API with procedural generation
- **Deployment**: Cloudflare Workers (serverless)
- **Testing**: Vitest with comprehensive test coverage
- **CI/CD**: GitHub Actions for automatic deployment

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/burger-drop.git
cd burger-drop

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Development Commands

```bash
# Development server
npm run dev

# Run tests
npm test

# Run tests once
npm run test:run

# Test coverage
npm run test:coverage

# Deploy to Cloudflare Workers
npm run deploy
```

### Local Testing

A standalone build is included for quick local play. After cloning and
installing dependencies, open `index.html` in your browser. The page loads the
prebuilt bundle from `src/build/game.iife.js` so no server is required.

## 🌐 Deployment

### Cloudflare Workers Setup

1. **Install Wrangler CLI** (if not already installed):
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```
   This uploads `index.html` and the game bundle to Cloudflare and serves them via a lightweight Worker.

### GitHub Actions (Automatic Deployment)

The project includes automatic deployment via GitHub Actions. Add these secrets to your repository:

- `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

Pushes to the `main` branch will automatically deploy to Cloudflare Workers.

## 🧪 Testing

Comprehensive test suite covering:
- Game logic (ingredients, orders, scoring)
- Collision detection
- Audio system functionality
- Power-up mechanics
- Cloudflare Worker deployment

```bash
# Run all tests
npm test

# Single test run
npm run test:run

# Coverage report
npm run test:coverage
```

## 🎯 Game Mechanics

### Scoring System
- **Base Points**: Each ingredient has a base point value
- **Combo Multiplier**: Consecutive correct ingredients increase multiplier
- **Time Bonus**: Faster order completion awards bonus points
- **Power-up Bonuses**: Special multipliers from power-ups

### Difficulty Scaling
- Ingredient fall speed increases over time
- More complex orders appear as game progresses
- Spawn rate increases with player skill level

## 🔧 Architecture

- **Static Deployment**: index.html served by Cloudflare Worker
- **Entity System**: Object-oriented design with Ingredient, Order, Particle, and PowerUp classes
- **Game Loop**: RequestAnimationFrame-based loop with delta time calculations
- **Performance Optimized**: Automatic particle culling and frame-rate aware animations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎮 Gameplay Tips

- **Watch the Orders**: Keep an eye on multiple orders and their timers
- **Build Combos**: Try to complete ingredients in sequence for higher scores
- **Use Power-ups Strategically**: Save power-ups for challenging moments
- **Stay Calm**: The game gets faster, but accuracy is more important than speed

## 🏆 High Scores

High scores are saved locally using localStorage, so you can track your personal best!

---

**Made with ❤️ and lots of ☕**

>>>>>>> origin/main
*Ready to test your reflexes? [Play Burger Drop now!](https://burger-drop.cory7593.workers.dev/)*