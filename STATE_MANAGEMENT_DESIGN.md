# BurgerDrop State Management Design

## 🎯 **Goal**
Replace the current global variable approach with a centralized, predictable state management system that improves testability, debugging, and maintainability.

---

## 🔍 **Current State Analysis**

### **Global Variables Identified (Lines 520-584 in worker.js)**
```javascript
// Game state globals
let gameRunning = false;
let score = 0;
let lives = 3;
let combo = 1;
let level = 1;
let frameCount = 0;
let lastTime = 0;

// Entity arrays
let ingredients = [];
let orders = [];
let powerUps = [];
let particles = [];

// Power-up state
let activePowerUps = {
    speedBoost: { active: false, timeLeft: 0, multiplier: 0.5 },
    timeFreeze: { active: false, timeLeft: 0 },
    scoreMultiplier: { active: false, timeLeft: 0, multiplier: 2 }
};

// UI state
let colorTheme = { hue: 200, saturation: 50, lightness: 45 };
let shakeIntensity = 0;
let shakeDuration = 0;
let flashIntensity = 0;
let flashColor = '#ffffff';

// Audio state
let audioEnabled = true;
let audioSettings = { master: 0.7, effects: 0.8, music: 0.6 };
```

---

## 🏗️ **Proposed State Management Architecture**

### **1. GameState Class**
```javascript
export class GameState {
  constructor() {
    this.core = {
      running: false,
      score: 0,
      lives: 3,
      combo: 1,
      level: 1,
      frameCount: 0,
      lastTime: 0,
      highScore: 0
    };

    this.entities = {
      ingredients: [],
      orders: [],
      powerUps: [],
      particles: []
    };

    this.powerUps = {
      speedBoost: { active: false, timeLeft: 0, multiplier: 0.5 },
      timeFreeze: { active: false, timeLeft: 0 },
      scoreMultiplier: { active: false, timeLeft: 0, multiplier: 2 }
    };

    this.ui = {
      colorTheme: { hue: 200, saturation: 50, lightness: 45 },
      screenEffects: {
        shake: { intensity: 0, duration: 0, x: 0, y: 0 },
        flash: { intensity: 0, color: '#ffffff' }
      }
    };

    this.audio = {
      enabled: true,
      settings: { master: 0.7, effects: 0.8, music: 0.6 }
    };

    // Event listeners for state changes
    this.listeners = new Map();
  }
}
```

### **2. State Mutation Methods**
```javascript
// Core game state mutations
updateScore(points) {
  const oldScore = this.core.score;
  this.core.score += points;
  this.emit('scoreChanged', { old: oldScore, new: this.core.score });
}

updateCombo(value) {
  const oldCombo = this.core.combo;
  this.core.combo = Math.max(1, Math.min(value, 10)); // Cap at 10
  this.emit('comboChanged', { old: oldCombo, new: this.core.combo });
}

loseLife() {
  this.core.lives = Math.max(0, this.core.lives - 1);
  this.emit('livesChanged', this.core.lives);
  
  if (this.core.lives === 0) {
    this.emit('gameOver');
  }
}

// Entity management
addEntity(type, entity) {
  if (!this.entities[type]) {
    throw new Error(`Unknown entity type: ${type}`);
  }
  
  this.entities[type].push(entity);
  this.emit('entityAdded', { type, entity });
}

removeEntity(type, predicate) {
  const initialLength = this.entities[type].length;
  this.entities[type] = this.entities[type].filter(predicate);
  const removed = initialLength - this.entities[type].length;
  
  if (removed > 0) {
    this.emit('entitiesRemoved', { type, count: removed });
  }
}
```

### **3. Power-up State Management**
```javascript
activatePowerUp(type, duration) {
  if (!this.powerUps[type]) {
    throw new Error(`Unknown power-up type: ${type}`);
  }

  // Deactivate if already active (reset timer)
  if (this.powerUps[type].active) {
    this.deactivatePowerUp(type);
  }

  this.powerUps[type].active = true;
  this.powerUps[type].timeLeft = duration;
  
  this.emit('powerUpActivated', { type, duration });
}

updatePowerUps(deltaTime) {
  const deltaMs = deltaTime * 1000;
  
  Object.entries(this.powerUps).forEach(([type, powerUp]) => {
    if (powerUp.active) {
      powerUp.timeLeft -= deltaMs;
      
      if (powerUp.timeLeft <= 0) {
        this.deactivatePowerUp(type);
      }
    }
  });
}

deactivatePowerUp(type) {
  this.powerUps[type].active = false;
  this.powerUps[type].timeLeft = 0;
  this.emit('powerUpDeactivated', { type });
}
```

### **4. UI State Management**
```javascript
updateColorTheme() {
  const targetHue = Math.min((this.core.combo - 1) * 30, 300);
  this.ui.colorTheme.hue += (targetHue - this.ui.colorTheme.hue) * 0.1;
  
  const scoreFactor = Math.min(this.core.score / 1000, 1);
  this.ui.colorTheme.saturation = 50 + (scoreFactor * 50);
  this.ui.colorTheme.lightness = 45 + (Math.sin(this.core.frameCount * 0.05) * 10);
  
  this.emit('colorThemeChanged', this.ui.colorTheme);
}

triggerScreenShake(intensity, duration) {
  this.ui.screenEffects.shake.intensity = intensity;
  this.ui.screenEffects.shake.duration = duration;
  this.emit('screenShakeTriggered', { intensity, duration });
}

triggerScreenFlash(color, intensity) {
  this.ui.screenEffects.flash.color = color;
  this.ui.screenEffects.flash.intensity = intensity;
  this.emit('screenFlashTriggered', { color, intensity });
}
```

### **5. Event System**
```javascript
// Event listener management
on(event, callback) {
  if (!this.listeners.has(event)) {
    this.listeners.set(event, []);
  }
  this.listeners.get(event).push(callback);
}

off(event, callback) {
  const callbacks = this.listeners.get(event);
  if (callbacks) {
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }
}

emit(event, data) {
  const callbacks = this.listeners.get(event);
  if (callbacks) {
    callbacks.forEach(callback => callback(data));
  }
}
```

---

## 🔄 **State Validation & Debugging**

### **State Validation**
```javascript
validate() {
  const errors = [];
  
  // Core state validation
  if (this.core.score < 0) errors.push('Score cannot be negative');
  if (this.core.lives < 0) errors.push('Lives cannot be negative');
  if (this.core.combo < 1 || this.core.combo > 10) errors.push('Combo must be between 1-10');
  
  // Entity validation
  Object.entries(this.entities).forEach(([type, entities]) => {
    if (!Array.isArray(entities)) {
      errors.push(`Entity collection ${type} must be an array`);
    }
  });
  
  // Power-up validation
  Object.entries(this.powerUps).forEach(([type, powerUp]) => {
    if (powerUp.active && powerUp.timeLeft <= 0) {
      errors.push(`Active power-up ${type} has invalid timeLeft`);
    }
  });
  
  return errors;
}
```

### **State Debugging Tools**
```javascript
// Development mode debugging
getDebugInfo() {
  return {
    core: { ...this.core },
    entityCounts: Object.fromEntries(
      Object.entries(this.entities).map(([type, arr]) => [type, arr.length])
    ),
    activePowerUps: Object.fromEntries(
      Object.entries(this.powerUps)
        .filter(([_, powerUp]) => powerUp.active)
        .map(([type, powerUp]) => [type, powerUp.timeLeft])
    ),
    ui: { ...this.ui },
    listenerCounts: Object.fromEntries(
      Array.from(this.listeners.entries())
        .map(([event, callbacks]) => [event, callbacks.length])
    )
  };
}

// State history for debugging
enableHistory() {
  this.history = [];
  
  this.on('*', (event, data) => {
    this.history.push({
      timestamp: Date.now(),
      event,
      data,
      state: this.getDebugInfo()
    });
    
    // Keep only last 100 events
    if (this.history.length > 100) {
      this.history.shift();
    }
  });
}
```

---

## 🔧 **Migration Strategy**

### **Phase 1: Create State Class**
1. Create `GameState` class with current global structure
2. Add basic mutation methods
3. Add validation and debugging tools

### **Phase 2: Gradual Variable Replacement**
```javascript
// Before (global)
score += 100;

// After (state managed)
gameState.updateScore(100);
```

### **Phase 3: Event-Driven Updates**
```javascript
// UI responds to state changes
gameState.on('scoreChanged', ({ new: newScore }) => {
  document.getElementById('score').textContent = newScore;
});

// Audio responds to events
gameState.on('powerUpActivated', ({ type }) => {
  audioSystem.playSound('powerUpCollected');
});
```

### **Phase 4: Dependency Injection**
```javascript
// Entities receive state reference
class Ingredient {
  constructor(type, x, y, gameState) {
    this.gameState = gameState;
    // No more global access
  }
  
  update(deltaTime) {
    // Use this.gameState instead of globals
    const speedMultiplier = this.gameState.powerUps.speedBoost.active ? 
      this.gameState.powerUps.speedBoost.multiplier : 1;
  }
}
```

---

## 🧪 **Testing Benefits**

### **Before: Difficult to Test**
```javascript
// Hard to test due to global dependencies
function updateScore(points) {
  score += points; // Global variable
  combo++; // Global variable
  if (score > highScore) {
    highScore = score; // Global variable
  }
}
```

### **After: Easy to Test**
```javascript
describe('GameState', () => {
  it('should update score correctly', () => {
    const state = new GameState();
    const listener = vi.fn();
    
    state.on('scoreChanged', listener);
    state.updateScore(100);
    
    expect(state.core.score).toBe(100);
    expect(listener).toHaveBeenCalledWith({ old: 0, new: 100 });
  });
  
  it('should validate state correctly', () => {
    const state = new GameState();
    state.core.score = -100; // Invalid state
    
    const errors = state.validate();
    expect(errors).toContain('Score cannot be negative');
  });
});
```

---

## ⚡ **Performance Considerations**

### **Memory Usage**
- **Event listeners**: Managed with weak references where possible
- **State history**: Limited to 100 entries in development mode
- **Validation**: Only runs in development mode

### **Performance Impact**
- **Method calls**: Minimal overhead vs direct variable access
- **Event emission**: Only when listeners exist
- **State copying**: Shallow copies for debugging, not deep clones

---

## 🎯 **Benefits Summary**

### **Development Benefits**
- **Predictable state changes**: All mutations go through methods
- **Easy debugging**: State history and validation
- **Better testing**: No global dependencies
- **Event-driven architecture**: Decoupled components

### **Maintenance Benefits**
- **Single source of truth**: All state in one place
- **Clear data flow**: Explicit state mutations
- **Type safety**: Methods validate inputs
- **Documentation**: State structure is self-documenting

---

## 📋 **Implementation Checklist**

- [ ] Create `GameState` class with current structure
- [ ] Add core mutation methods (score, lives, combo)
- [ ] Add entity management methods
- [ ] Add power-up state management
- [ ] Add UI state management
- [ ] Implement event system
- [ ] Add validation and debugging tools
- [ ] Create migration scripts for global variables
- [ ] Update entity classes for dependency injection
- [ ] Add comprehensive tests
- [ ] Performance benchmarking

---

*This state management design provides a solid foundation for maintainable, testable, and debuggable game state while maintaining performance and simplicity.*