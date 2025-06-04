/**
 * Easing Functions Collection
 * 
 * Mathematical easing functions for smooth animations and transitions.
 * All functions take a parameter t (0 to 1) and return the eased value.
 */

export const easing = {
    /**
     * Linear interpolation - no easing
     * @param {number} t - Progress value (0 to 1)
     * @returns {number} Eased value
     */
    linear: t => t,

    /**
     * Quadratic ease-in - starts slow, accelerates
     * @param {number} t - Progress value (0 to 1)
     * @returns {number} Eased value
     */
    easeInQuad: t => t * t,

    /**
     * Quadratic ease-out - starts fast, decelerates
     * @param {number} t - Progress value (0 to 1)
     * @returns {number} Eased value
     */
    easeOutQuad: t => t * (2 - t),

    /**
     * Quadratic ease-in-out - slow start and end, fast middle
     * @param {number} t - Progress value (0 to 1)
     * @returns {number} Eased value
     */
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

    /**
     * Cubic ease-in - starts very slow, accelerates strongly
     * @param {number} t - Progress value (0 to 1)
     * @returns {number} Eased value
     */
    easeInCubic: t => t * t * t,

    /**
     * Cubic ease-out - starts fast, decelerates strongly
     * @param {number} t - Progress value (0 to 1)
     * @returns {number} Eased value
     */
    easeOutCubic: t => (--t) * t * t + 1,

    /**
     * Cubic ease-in-out - very slow start and end, very fast middle
     * @param {number} t - Progress value (0 to 1)
     * @returns {number} Eased value
     */
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

    /**
     * Elastic ease-in - spring-like effect at the beginning
     * @param {number} t - Progress value (0 to 1)
     * @returns {number} Eased value
     */
    easeInElastic: t => {
        if (t === 0 || t === 1) return t;
        const p = 0.3;
        const s = p / 4;
        return -(Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
    },

    /**
     * Elastic ease-out - spring-like effect at the end
     * @param {number} t - Progress value (0 to 1)
     * @returns {number} Eased value
     */
    easeOutElastic: t => {
        if (t === 0 || t === 1) return t;
        const p = 0.3;
        const s = p / 4;
        return Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1;
    },

    /**
     * Bounce ease-out - bouncing ball effect at the end
     * @param {number} t - Progress value (0 to 1)
     * @returns {number} Eased value
     */
    easeOutBounce: t => {
        if (t < 1 / 2.75) {
            return 7.5625 * t * t;
        } else if (t < 2 / 2.75) {
            return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        } else if (t < 2.5 / 2.75) {
            return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        } else {
            return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        }
    }
};

// Define easeInBounce after easeOutBounce is defined
easing.easeInBounce = t => 1 - easing.easeOutBounce(1 - t);

// Export individual functions for convenience
export const {
    linear,
    easeInQuad,
    easeOutQuad,
    easeInOutQuad,
    easeInCubic,
    easeOutCubic,
    easeInOutCubic,
    easeInElastic,
    easeOutElastic,
    easeInBounce,
    easeOutBounce
} = easing;

// Default export
export default easing;