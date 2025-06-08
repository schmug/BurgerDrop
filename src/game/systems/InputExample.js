<<<<<<< HEAD
/**
 * Example of how to integrate the InputSystem into the BurgerDrop game
 * 
 * This shows how to replace the existing input handling in worker.js
 * with the new modular InputSystem
 */

import { InputSystem } from './Input.js';

// Example integration in the game initialization
export function setupGameInput(canvas, gameState) {
    // Create the input system
    const inputSystem = new InputSystem(canvas, {
        preventScroll: true,
        debug: false
    });
    
    // Register click handler for game interaction
    inputSystem.onClick((x, y, type) => {
        if (!gameState.gameRunning) return false;
        
        // Check power-ups first (highest priority)
        for (let i = gameState.powerUps.length - 1; i >= 0; i--) {
            const powerUp = gameState.powerUps[i];
            if (powerUp.isClicked(x, y) && !powerUp.collected) {
                powerUp.collected = true;
                
                // Handle power-up collection
                gameState.playPowerUpCollect();
                gameState.activatePowerUp(powerUp.type);
                
                // Create visual feedback
                const rect = canvas.getBoundingClientRect();
                gameState.createFloatingText(
                    x + rect.left, 
                    y + rect.top,
                    powerUp.data.name + '!', 
                    powerUp.data.color
                );
                
                gameState.powerUps.splice(i, 1);
                return true; // Stop propagation
            }
        }
        
        // Check ingredients
        for (let i = gameState.ingredients.length - 1; i >= 0; i--) {
            const ingredient = gameState.ingredients[i];
            if (ingredient.isClicked(x, y) && !ingredient.collected) {
                ingredient.collected = true;
                
                // Check against orders
                let correctOrder = false;
                for (let order of gameState.orders) {
                    const result = order.checkIngredient(ingredient.type);
                    
                    if (result === 'correct') {
                        handleCorrectIngredient(gameState, ingredient, order, x, y);
                        correctOrder = true;
                        break;
                    } else if (result === 'completed') {
                        handleCompletedOrder(gameState, ingredient, order, x, y);
                        correctOrder = true;
                        break;
                    }
                }
                
                if (!correctOrder) {
                    handleWrongIngredient(gameState, ingredient, x, y);
                }
                
                gameState.ingredients.splice(i, 1);
                return true; // Stop propagation
            }
        }
        
        return false; // Allow propagation
    });
    
    // Optional: Add resize handler
    inputSystem.onResize((width, height) => {
        console.log(`Canvas resized to ${width}x${height}`);
        // Update any game elements that depend on canvas size
    });
    
    return inputSystem;
}

// Helper functions for handling game logic
function handleCorrectIngredient(gameState, ingredient, order, x, y) {
    const rect = gameState.canvas.getBoundingClientRect();
    const basePoints = 10 * gameState.combo;
    const scoreMultiplier = gameState.activePowerUps.scoreMultiplier.active ? 
        gameState.activePowerUps.scoreMultiplier.multiplier : 1;
    const finalScore = Math.floor(basePoints * scoreMultiplier);
    
    gameState.score += finalScore;
    const scoreText = scoreMultiplier > 1 ? 
        `+${finalScore} (x${scoreMultiplier})` : `+${finalScore}`;
    
    gameState.createFloatingText(x + rect.left, y + rect.top, scoreText, '#00FF00');
    gameState.startScreenFlash('#00FF88', 0.15, 6);
    gameState.vibrateSuccess();
    gameState.playIngredientCorrect();
    
    // Create particles
    for (let j = 0; j < 2; j++) {
        gameState.particles.push(
            new gameState.Particle(
                ingredient.x + ingredient.data.size / 2,
                ingredient.y + ingredient.data.size / 2,
                gameState.colorTheme.accent
            )
        );
    }
}

function handleCompletedOrder(gameState, ingredient, order, x, y) {
    const rect = gameState.canvas.getBoundingClientRect();
    const bonus = Math.floor(order.timeLeft / 1000) * 5;
    const baseScore = 50 + bonus;
    const comboScore = baseScore * gameState.combo;
    const scoreMultiplier = gameState.activePowerUps.scoreMultiplier.active ? 
        gameState.activePowerUps.scoreMultiplier.multiplier : 1;
    const finalScore = Math.floor(comboScore * scoreMultiplier);
    
    gameState.score += finalScore;
    
    const scoreText = scoreMultiplier > 1 ? 
        `ORDER COMPLETE! +${finalScore} (x${scoreMultiplier})` : 
        `ORDER COMPLETE! +${finalScore}`;
    
    gameState.createFloatingText(x + rect.left, y + rect.top, scoreText, gameState.colorTheme.primary);
    gameState.startScreenShake(2, 4);
    gameState.startScreenFlash(gameState.colorTheme.primary, 0.15, 5);
    gameState.vibrateCompletion();
    gameState.startRippleEffect(order.x + order.width / 2, order.y + order.height / 2, 100);
    gameState.playOrderComplete();
    
    // Update combo
    const oldCombo = gameState.combo;
    gameState.combo = Math.min(gameState.combo + 1, 10);
    
    if (gameState.combo > oldCombo) {
        gameState.playComboSound();
    }
    
    // Remove completed order and add new one
    const orderIndex = gameState.orders.indexOf(order);
    gameState.orders.splice(orderIndex, 1);
    gameState.orders.push(new gameState.Order(gameState.canvas.width));
}

function handleWrongIngredient(gameState, ingredient, x, y) {
    const rect = gameState.canvas.getBoundingClientRect();
    gameState.lives = Math.max(0, gameState.lives - 1);
    gameState.combo = 1;
    
    gameState.createFloatingText(x + rect.left, y + rect.top, 'WRONG!', '#FF0000');
    gameState.startScreenShake(5, 10);
    gameState.startScreenFlash('#FF0000', 0.3, 8);
    gameState.vibrateError();
    gameState.playIngredientWrong();
    
    if (gameState.lives === 0) {
        gameState.endGame();
    }
}

// Usage in worker.js would be:
/*
// In the game setup:
const inputSystem = setupGameInput(canvas, {
    gameRunning,
    powerUps,
    ingredients,
    orders,
    particles,
    score,
    combo,
    lives,
    activePowerUps,
    colorTheme,
    // ... other game state and methods
});

// In the game cleanup:
inputSystem.destroy();
=======
/**
 * Example of how to integrate the InputSystem into the BurgerDrop game
 * 
 * This shows how to replace the existing input handling in worker.js
 * with the new modular InputSystem
 */

import { InputSystem } from './Input.js';

// Example integration in the game initialization
export function setupGameInput(canvas, gameState) {
    // Create the input system
    const inputSystem = new InputSystem(canvas, {
        preventScroll: true,
        debug: false
    });

    // Expose the canvas on the game state for helper functions
    // that require access to its dimensions and position.
    // Tests expect this property to be set when the input
    // system is initialized.
    gameState.canvas = canvas;
    
    // Register click handler for game interaction
    inputSystem.onClick((x, y, type) => {
        if (!gameState.gameRunning) return false;
        
        // Check power-ups first (highest priority)
        for (let i = gameState.powerUps.length - 1; i >= 0; i--) {
            const powerUp = gameState.powerUps[i];
            if (powerUp.isClicked(x, y) && !powerUp.collected) {
                powerUp.collected = true;
                
                // Handle power-up collection
                gameState.playPowerUpCollect();
                gameState.activatePowerUp(powerUp.type);
                
                // Create visual feedback
                const rect = canvas.getBoundingClientRect();
                gameState.createFloatingText(
                    x + rect.left, 
                    y + rect.top,
                    powerUp.data.name + '!', 
                    powerUp.data.color
                );
                
                gameState.powerUps.splice(i, 1);
                return true; // Stop propagation
            }
        }
        
        // Check ingredients
        for (let i = gameState.ingredients.length - 1; i >= 0; i--) {
            const ingredient = gameState.ingredients[i];
            if (ingredient.isClicked(x, y) && !ingredient.collected) {
                ingredient.collected = true;
                
                // Check against orders
                let correctOrder = false;
                for (let order of gameState.orders) {
                    const result = order.checkIngredient(ingredient.type);
                    
                    if (result === 'correct') {
                        handleCorrectIngredient(gameState, ingredient, order, x, y);
                        correctOrder = true;
                        break;
                    } else if (result === 'completed') {
                        handleCompletedOrder(gameState, ingredient, order, x, y);
                        correctOrder = true;
                        break;
                    }
                }
                
                if (!correctOrder) {
                    handleWrongIngredient(gameState, ingredient, x, y);
                }
                
                gameState.ingredients.splice(i, 1);
                return true; // Stop propagation
            }
        }
        
        return false; // Allow propagation
    });
    
    // Optional: Add resize handler
    inputSystem.onResize((width, height) => {
        console.log(`Canvas resized to ${width}x${height}`);
        // Update any game elements that depend on canvas size
    });
    
    return inputSystem;
}

// Helper functions for handling game logic
function handleCorrectIngredient(gameState, ingredient, order, x, y) {
    const rect = gameState.canvas.getBoundingClientRect();
    const basePoints = 10 * gameState.combo;
    const scoreMultiplier = gameState.activePowerUps.scoreMultiplier.active ? 
        gameState.activePowerUps.scoreMultiplier.multiplier : 1;
    const finalScore = Math.floor(basePoints * scoreMultiplier);
    
    gameState.score += finalScore;
    const scoreText = scoreMultiplier > 1 ? 
        `+${finalScore} (x${scoreMultiplier})` : `+${finalScore}`;
    
    gameState.createFloatingText(x + rect.left, y + rect.top, scoreText, '#00FF00');
    gameState.startScreenFlash('#00FF88', 0.15, 6);
    gameState.vibrateSuccess();
    gameState.playIngredientCorrect();
    
    // Create particles
    for (let j = 0; j < 2; j++) {
        gameState.particles.push(
            new gameState.Particle(
                ingredient.x + ingredient.data.size / 2,
                ingredient.y + ingredient.data.size / 2,
                gameState.colorTheme.accent
            )
        );
    }
}

function handleCompletedOrder(gameState, ingredient, order, x, y) {
    const rect = gameState.canvas.getBoundingClientRect();
    const bonus = Math.floor(order.timeLeft / 1000) * 5;
    const baseScore = 50 + bonus;
    const comboScore = baseScore * gameState.combo;
    const scoreMultiplier = gameState.activePowerUps.scoreMultiplier.active ? 
        gameState.activePowerUps.scoreMultiplier.multiplier : 1;
    const finalScore = Math.floor(comboScore * scoreMultiplier);
    
    gameState.score += finalScore;
    
    const scoreText = scoreMultiplier > 1 ? 
        `ORDER COMPLETE! +${finalScore} (x${scoreMultiplier})` : 
        `ORDER COMPLETE! +${finalScore}`;
    
    gameState.createFloatingText(x + rect.left, y + rect.top, scoreText, gameState.colorTheme.primary);
    gameState.startScreenShake(2, 4);
    gameState.startScreenFlash(gameState.colorTheme.primary, 0.15, 5);
    gameState.vibrateCompletion();
    gameState.startRippleEffect(order.x + order.width / 2, order.y + order.height / 2, 100);
    gameState.playOrderComplete();
    
    // Update combo
    const oldCombo = gameState.combo;
    gameState.combo = Math.min(gameState.combo + 1, 10);
    
    if (gameState.combo > oldCombo) {
        gameState.playComboSound();
    }
    
    // Remove completed order and add new one
    const orderIndex = gameState.orders.indexOf(order);
    gameState.orders.splice(orderIndex, 1);
    gameState.orders.push(new gameState.Order(gameState.canvas.width));
}

function handleWrongIngredient(gameState, ingredient, x, y) {
    const rect = gameState.canvas.getBoundingClientRect();
    gameState.lives = Math.max(0, gameState.lives - 1);
    gameState.combo = 1;
    
    gameState.createFloatingText(x + rect.left, y + rect.top, 'WRONG!', '#FF0000');
    gameState.startScreenShake(5, 10);
    gameState.startScreenFlash('#FF0000', 0.3, 8);
    gameState.vibrateError();
    gameState.playIngredientWrong();
    
    if (gameState.lives === 0) {
        gameState.endGame();
    }
}

// Usage in worker.js would be:
/*
// In the game setup:
const inputSystem = setupGameInput(canvas, {
    gameRunning,
    powerUps,
    ingredients,
    orders,
    particles,
    score,
    combo,
    lives,
    activePowerUps,
    colorTheme,
    // ... other game state and methods
});

// In the game cleanup:
inputSystem.destroy();
>>>>>>> origin/main
*/