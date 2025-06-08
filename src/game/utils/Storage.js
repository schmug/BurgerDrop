/**
 * Storage utility functions
 * Provides safe access to localStorage in environments
 * where storage access may be restricted.
 */

export function isLocalStorageAvailable() {
    try {
        const key = '__storage_test__';
        window.localStorage.setItem(key, key);
        window.localStorage.removeItem(key);
        return true;
    } catch (e) {
        return false;
    }
}
