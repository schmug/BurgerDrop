/**
 * Audio System
 * 
 * Complete Web Audio API-based audio system with procedural sound generation,
 * background music, volume controls, and audio ducking.
 */

/**
 * Sound effect definitions
 */
export const soundEffects = {
    ingredientCorrect: {
        frequency: 880,
        type: 'sine',
        duration: 0.15,
        volume: 0.6
    },
    ingredientWrong: {
        frequency: 220,
        type: 'sawtooth',
        duration: 0.2,
        volume: 0.5
    },
    orderComplete: {
        frequencies: [523, 659, 784, 1047], // C, E, G, High C
        type: 'sine',
        duration: 0.2,
        volume: 0.8
    },
    orderExpired: {
        frequency: 165,
        type: 'square',
        duration: 0.3,
        volume: 0.7
    },
    powerUpCollect: {
        frequency: 698,
        type: 'triangle',
        duration: 0.25,
        volume: 0.7
    },
    doublePointsActivate: {
        frequency: 1397, // F6
        type: 'sine',
        duration: 0.3,
        volume: 0.8,
        duck: true
    },
    slowTimeActivate: {
        frequency: 440, // A4
        type: 'triangle',
        duration: 0.4,
        volume: 0.8,
        duck: true
    },
    comboMultiplierActivate: {
        frequency: 587, // D5
        type: 'square',
        duration: 0.35,
        volume: 0.7,
        duck: true
    },
    comboIncrease: {
        frequency: 659, // E5
        type: 'sine',
        duration: 0.1,
        volume: 0.5
    },
    buttonClick: {
        frequency: 1000,
        type: 'sine',
        duration: 0.05,
        volume: 0.3
    },
    gameOver: {
        frequencies: [330, 311, 294, 277], // E, Eb, D, Db
        type: 'sawtooth',
        duration: 0.4,
        volume: 0.8
    }
};

/**
 * Music note definitions
 */
export const musicNotes = {
    melody: [523, 587, 659, 784, 880], // C5, D5, E5, G5, A5 (pentatonic)
    bass: [131, 147, 165, 196, 220]    // C3, D3, E3, G3, A3
};

export class AudioSystem {
    constructor(options = {}) {
        // Audio context and processing chain
        this.audioContext = null;
        this.audioProcessingChain = null;
        this.enabled = true;
        
        // Audio settings
        this.settings = {
            master: options.master || 0.3,
            effects: options.effects || 1.0,
            music: options.music || 0.5,
            preset: options.preset || 'normal'
        };
        
        // Background music state
        this.backgroundMusic = {
            playing: false,
            oscillators: [],
            gainNodes: [],
            melodyInterval: null,
            cleanupInterval: null
        };
        
        // Audio ducking
        this.musicGainNode = null;
        this.isDucking = false;
        
        // Event listeners
        this.eventListeners = new Map();
        
        // Initialize audio system
        this.init();
    }
    
    /**
     * Initialize the audio system
     */
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.setupAudioProcessingChain();
            this.setupUserInteractionHandlers();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    }
    
    /**
     * Set up audio processing chain with compressor and limiter
     */
    setupAudioProcessingChain() {
        if (!this.audioContext) return;
        
        // Create compressor
        const compressor = this.audioContext.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-20, this.audioContext.currentTime);
        compressor.knee.setValueAtTime(10, this.audioContext.currentTime);
        compressor.ratio.setValueAtTime(6, this.audioContext.currentTime);
        compressor.attack.setValueAtTime(0.003, this.audioContext.currentTime);
        compressor.release.setValueAtTime(0.1, this.audioContext.currentTime);
        
        // Create limiter
        const limiter = this.audioContext.createDynamicsCompressor();
        limiter.threshold.setValueAtTime(-6, this.audioContext.currentTime);
        limiter.knee.setValueAtTime(0, this.audioContext.currentTime);
        limiter.ratio.setValueAtTime(20, this.audioContext.currentTime);
        limiter.attack.setValueAtTime(0.001, this.audioContext.currentTime);
        limiter.release.setValueAtTime(0.01, this.audioContext.currentTime);
        
        // Chain: compressor -> limiter -> destination
        compressor.connect(limiter);
        limiter.connect(this.audioContext.destination);
        
        this.audioProcessingChain = compressor;
    }
    
    /**
     * Set up user interaction handlers for audio context resume
     */
    setupUserInteractionHandlers() {
        const resumeAudio = () => {
            if (!this.audioContext) return;

            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume().then(() => {
                    if (this.settings.music > 0 && !this.backgroundMusic.playing) {
                        this.startBackgroundMusic();
                    }
                });
            } else if (this.settings.music > 0 && !this.backgroundMusic.playing) {
                this.startBackgroundMusic();
            }
        };

        document.addEventListener('click', resumeAudio, { once: true });
        document.addEventListener('touchstart', resumeAudio, { once: true });
    }
    
    /**
     * Create an oscillator with the audio processing chain
     */
    createOscillator(frequency, type = 'sine', duration = 0.1, volumeMultiplier = 1) {
        if (!this.audioContext || !this.enabled) return null;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        // Add low-pass filter to smooth harsh frequencies
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(8000, this.audioContext.currentTime);
        filter.Q.setValueAtTime(0.7, this.audioContext.currentTime);
        
        // Connect audio chain
        oscillator.connect(gainNode);
        gainNode.connect(filter);
        
        if (this.audioProcessingChain) {
            filter.connect(this.audioProcessingChain);
        } else {
            filter.connect(this.audioContext.destination);
        }
        
        // Configure oscillator
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        // Calculate final volume
        const finalVolume = this.settings.master * this.settings.effects * volumeMultiplier;
        
        // Smooth volume envelope
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(finalVolume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        return { oscillator, gainNode, filter };
    }
    
    /**
     * Play a sound effect
     */
    playSound(soundConfig) {
        if (!this.audioContext || !this.enabled || this.settings.effects === 0) return;
        
        const { frequency, type = 'sine', duration = 0.1, volume = 1, duck = false } = soundConfig;
        const result = this.createOscillator(frequency, type, duration, volume);
        
        if (result) {
            const { oscillator } = result;
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + duration);
            
            // Clean up after sound finishes
            oscillator.addEventListener('ended', () => {
                oscillator.disconnect();
            });
            
            // Handle audio ducking
            if (duck) {
                this.duckBackgroundMusic();
                setTimeout(() => this.restoreBackgroundMusic(), duration * 1000);
            }
        }
    }
    
    /**
     * Play a sequence of sounds
     */
    playSequence(frequencies, type = 'sine', duration = 0.1, volume = 1) {
        if (!this.audioContext || !this.enabled || this.settings.effects === 0) return;
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.playSound({ frequency: freq, type, duration: duration * 0.8, volume });
            }, index * duration * 1000 * 0.9);
        });
    }
    
    /**
     * Play specific game sound effects
     */
    playIngredientCorrect() {
        this.playSound(soundEffects.ingredientCorrect);
    }
    
    playIngredientWrong() {
        this.playSound(soundEffects.ingredientWrong);
    }
    
    playOrderComplete() {
        this.playSequence(
            soundEffects.orderComplete.frequencies,
            soundEffects.orderComplete.type,
            soundEffects.orderComplete.duration,
            soundEffects.orderComplete.volume
        );
    }
    
    playOrderExpired() {
        this.playSound(soundEffects.orderExpired);
    }
    
    playPowerUpCollect() {
        this.playSound(soundEffects.powerUpCollect);
    }
    
    playPowerUpActivate(type) {
        const soundKey = type + 'Activate';
        const sound = soundEffects[soundKey];
        if (sound) {
            this.duckBackgroundMusic();
            this.playSound(sound);
            setTimeout(() => this.restoreBackgroundMusic(), 300);
        }
    }
    
    playComboIncrease() {
        this.playSound(soundEffects.comboIncrease);
    }
    
    playButtonClick() {
        this.playSound(soundEffects.buttonClick);
    }
    
    playGameOver() {
        if (!this.audioContext || !this.enabled || this.settings.effects === 0) return;
        
        soundEffects.gameOver.frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.playSound({
                    frequency: freq,
                    type: soundEffects.gameOver.type,
                    duration: soundEffects.gameOver.duration * 0.7,
                    volume: soundEffects.gameOver.volume
                });
            }, index * 150);
        });
    }
    
    /**
     * Alias methods for backward compatibility
     */
    playCollect() {
        this.playIngredientCorrect();
    }
    
    playError() {
        this.playIngredientWrong();
    }
    
    playNewOrder() {
        this.playButtonClick();
    }
    
    /**
     * Start background music
     */
    startBackgroundMusic() {
        if (
            !this.audioContext ||
            !this.enabled ||
            this.backgroundMusic.playing ||
            this.settings.music === 0 ||
            this.audioContext.state === 'suspended'
        ) {
            return;
        }
        
        // Create master gain node for music
        if (!this.musicGainNode) {
            this.musicGainNode = this.audioContext.createGain();
            
            if (this.audioProcessingChain) {
                this.musicGainNode.connect(this.audioProcessingChain);
            } else {
                this.musicGainNode.connect(this.audioContext.destination);
            }
            
            this.musicGainNode.gain.setValueAtTime(
                this.settings.master * this.settings.music,
                this.audioContext.currentTime
            );
        }
        
        this.backgroundMusic.playing = true;
        
        // Start melody interval
        this.backgroundMusic.melodyInterval = setInterval(() => {
            if (this.backgroundMusic.playing && this.settings.music > 0) {
                this.playMelodyNote();
            } else {
                clearInterval(this.backgroundMusic.melodyInterval);
            }
        }, 3000 + Math.random() * 2000);
        
        // Start cleanup interval
        this.backgroundMusic.cleanupInterval = setInterval(() => {
            this.cleanupOscillators();
        }, 5000);
    }
    
    /**
     * Stop background music
     */
    stopBackgroundMusic() {
        this.backgroundMusic.playing = false;
        
        // Clear intervals
        if (this.backgroundMusic.melodyInterval) {
            clearInterval(this.backgroundMusic.melodyInterval);
            this.backgroundMusic.melodyInterval = null;
        }
        if (this.backgroundMusic.cleanupInterval) {
            clearInterval(this.backgroundMusic.cleanupInterval);
            this.backgroundMusic.cleanupInterval = null;
        }
        
        // Stop all oscillators
        this.backgroundMusic.oscillators.forEach(osc => {
            try {
                osc.stop();
                osc.disconnect();
            } catch (e) {
                // Oscillator might already be stopped
            }
        });
        
        this.backgroundMusic.oscillators = [];
        this.backgroundMusic.gainNodes = [];
    }
    
    /**
     * Play a single melody note
     */
    playMelodyNote() {
        if (!this.backgroundMusic.playing || !this.musicGainNode || this.settings.music === 0) {
            return;
        }
        
        const noteIndex = Math.floor(Math.random() * musicNotes.melody.length);
        const frequency = musicNotes.melody[noteIndex];
        const musicVolume = this.settings.master * this.settings.music * 0.1;
        
        const melodyOsc = this.audioContext.createOscillator();
        const melodyGain = this.audioContext.createGain();
        
        melodyOsc.connect(melodyGain);
        melodyGain.connect(this.musicGainNode);
        
        melodyOsc.type = 'sine';
        melodyOsc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        melodyGain.gain.setValueAtTime(0, this.audioContext.currentTime);
        melodyGain.gain.linearRampToValueAtTime(musicVolume, this.audioContext.currentTime + 0.1);
        melodyGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1.5);
        
        melodyOsc.start();
        melodyOsc.stop(this.audioContext.currentTime + 2);
        
        // Cleanup after note finishes
        melodyOsc.addEventListener('ended', () => {
            const oscIndex = this.backgroundMusic.oscillators.indexOf(melodyOsc);
            const gainIndex = this.backgroundMusic.gainNodes.indexOf(melodyGain);
            if (oscIndex > -1) this.backgroundMusic.oscillators.splice(oscIndex, 1);
            if (gainIndex > -1) this.backgroundMusic.gainNodes.splice(gainIndex, 1);
        });
        
        this.backgroundMusic.oscillators.push(melodyOsc);
        this.backgroundMusic.gainNodes.push(melodyGain);
    }
    
    /**
     * Clean up ended oscillators
     */
    cleanupOscillators() {
        this.backgroundMusic.oscillators = this.backgroundMusic.oscillators.filter(osc => {
            try {
                return osc.context.state !== 'closed';
            } catch (e) {
                return false;
            }
        });
        
        this.backgroundMusic.gainNodes = this.backgroundMusic.gainNodes.filter(gain => {
            try {
                return gain.context.state !== 'closed';
            } catch (e) {
                return false;
            }
        });
    }
    
    /**
     * Duck background music volume
     */
    duckBackgroundMusic() {
        if (!this.musicGainNode || this.isDucking) return;
        
        this.isDucking = true;
        const currentVolume = this.settings.master * this.settings.music;
        const duckedVolume = currentVolume * 0.3;
        
        this.musicGainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
        this.musicGainNode.gain.setValueAtTime(currentVolume, this.audioContext.currentTime);
        this.musicGainNode.gain.linearRampToValueAtTime(duckedVolume, this.audioContext.currentTime + 0.1);
    }
    
    /**
     * Restore background music volume
     */
    restoreBackgroundMusic() {
        if (!this.musicGainNode || !this.isDucking) return;
        
        this.isDucking = false;
        const normalVolume = this.settings.master * this.settings.music;
        
        this.musicGainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
        this.musicGainNode.gain.linearRampToValueAtTime(normalVolume, this.audioContext.currentTime + 0.3);
    }
    
    /**
     * Update master volume
     */
    setMasterVolume(value) {
        this.settings.master = Math.max(0, Math.min(1, value));
        
        if (this.musicGainNode && !this.isDucking) {
            const musicVolume = this.settings.master * this.settings.music;
            this.musicGainNode.gain.setValueAtTime(musicVolume, this.audioContext.currentTime);
        }
        
        this.emit('volumeChanged', { type: 'master', value: this.settings.master });
    }
    
    /**
     * Update effects volume
     */
    setEffectsVolume(value) {
        this.settings.effects = Math.max(0, Math.min(1, value));
        this.emit('volumeChanged', { type: 'effects', value: this.settings.effects });
    }
    
    /**
     * Update music volume
     */
    setMusicVolume(value) {
        this.settings.music = Math.max(0, Math.min(1, value));
        
        if (this.musicGainNode && !this.isDucking) {
            const musicVolume = this.settings.master * this.settings.music;
            this.musicGainNode.gain.setValueAtTime(musicVolume, this.audioContext.currentTime);
        }
        
        // Handle music start/stop based on volume
        if (value > 0 && !this.backgroundMusic.playing) {
            this.startBackgroundMusic();
        } else if (value === 0) {
            this.stopBackgroundMusic();
        }
        
        this.emit('volumeChanged', { type: 'music', value: this.settings.music });
    }
    
    /**
     * Set audio preset
     */
    setPreset(preset) {
        const presets = {
            quiet: { master: 0.15, effects: 0.8, music: 0.3 },
            normal: { master: 0.3, effects: 1.0, music: 0.5 },
            energetic: { master: 0.5, effects: 1.0, music: 0.7 }
        };
        
        const config = presets[preset];
        if (config) {
            this.setMasterVolume(config.master);
            this.setEffectsVolume(config.effects);
            this.setMusicVolume(config.music);
            this.settings.preset = preset;
            this.emit('presetChanged', preset);
        }
    }
    
    /**
     * Enable/disable audio system
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        
        if (!enabled) {
            this.stopBackgroundMusic();
        }
        
        this.emit('enabledChanged', enabled);
    }
    
    /**
     * Get current audio settings
     */
    getSettings() {
        return { ...this.settings };
    }
    
    /**
     * Check if audio is enabled and supported
     */
    isEnabled() {
        return this.enabled && !!this.audioContext;
    }
    
    /**
     * Cleanup audio system
     */
    destroy() {
        this.stopBackgroundMusic();
        
        if (this.musicGainNode) {
            this.musicGainNode.disconnect();
            this.musicGainNode = null;
        }
        
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        
        this.eventListeners.clear();
    }
    
    /**
     * Event system for audio callbacks
     */
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }
    
    off(event, callback) {
        const callbacks = this.eventListeners.get(event);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
    
    emit(event, data) {
        const callbacks = this.eventListeners.get(event);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in audio event listener for ${event}:`, error);
                }
            });
        }
    }
}

export default AudioSystem;