/**
 * Template Module
 * 
 * Handles loading and processing of HTML and CSS templates for the game.
 * Provides methods to inject CSS into HTML templates and prepare them for serving.
 */

import htmlTemplate from './index.html';
import cssContent from './styles.css';

/**
 * Process the HTML template by injecting CSS and other dynamic content
 * @returns {string} The processed HTML string ready to be served
 */
export function getGameHTML() {
    // Replace the CSS placeholder with actual CSS content
    return htmlTemplate.replace('{{CSS_CONTENT}}', cssContent);
}

/**
 * Get just the CSS content
 * @returns {string} The CSS content
 */
export function getCSS() {
    return cssContent;
}

/**
 * Get just the HTML template
 * @returns {string} The HTML template
 */
export function getHTMLTemplate() {
    return htmlTemplate;
}

export default {
    getGameHTML,
    getCSS,
    getHTMLTemplate
};