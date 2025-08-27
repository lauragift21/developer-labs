/**
 * Storage Utility - Clean localStorage management
 */

export class StorageManager {
  constructor(namespace = 'mcp') {
    this.namespace = namespace;
  }

  /**
   * Get a key with namespace
   */
  _getKey(key) {
    return `${this.namespace}_${key}`;
  }

  /**
   * Save data to localStorage with error handling
   */
  save(key, data) {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(this._getKey(key), serialized);
      return true;
    } catch (error) {
      console.warn(`Failed to save to localStorage:`, error);
      return false;
    }
  }

  /**
   * Load data from localStorage with error handling
   */
  load(key, defaultValue = null) {
    try {
      const serialized = localStorage.getItem(this._getKey(key));
      if (serialized === null) {
        return defaultValue;
      }
      return JSON.parse(serialized);
    } catch (error) {
      console.warn(`Failed to load from localStorage:`, error);
      return defaultValue;
    }
  }

  /**
   * Remove data from localStorage
   */
  remove(key) {
    try {
      localStorage.removeItem(this._getKey(key));
      return true;
    } catch (error) {
      console.warn(`Failed to remove from localStorage:`, error);
      return false;
    }
  }

  /**
   * Clear all data for this namespace
   */
  clear() {
    try {
      const keys = Object.keys(localStorage);
      const namespaceKeys = keys.filter((key) => key.startsWith(`${this.namespace}_`));

      namespaceKeys.forEach((key) => {
        localStorage.removeItem(key);
      });

      return true;
    } catch (error) {
      console.warn(`Failed to clear localStorage:`, error);
      return false;
    }
  }

  /**
   * Check if localStorage is available
   */
  static isAvailable() {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }
}
