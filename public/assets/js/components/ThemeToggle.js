/**
 * Theme Toggle Component - Clean theme management
 */

import { StorageManager } from '../utils/storage.js';
import { DOMUtils } from '../utils/dom.js';

export class ThemeToggle {
  constructor(buttonSelector = '#theme-toggle') {
    this.storage = new StorageManager('theme');
    this.button = DOMUtils.$(buttonSelector);
    this.currentTheme = this.loadTheme();
    this.cleanupFunctions = [];

    this.init();
  }

  /**
   * Initialize theme toggle
   */
  init() {
    if (!this.button) {
      console.warn('Theme toggle button not found');
      return;
    }

    this.applyTheme(this.currentTheme);
    this.setupEventListeners();
  }

  /**
   * Load theme from storage or default to dark
   */
  loadTheme() {
    const saved = this.storage.load('preference');
    return saved || 'dark';
  }

  /**
   * Save theme preference
   */
  saveTheme(theme) {
    this.storage.save('preference', theme);
  }

  /**
   * Apply theme to document
   */
  applyTheme(theme) {
    const body = document.body;
    const isDark = theme === 'dark';

    DOMUtils.toggleClass(body, 'light-mode', !isDark);

    // Update button icon
    if (this.button) {
      this.button.textContent = isDark ? '🌙' : '☀️';
      this.button.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
    }

    // Dispatch theme change event
    this.dispatchThemeChangeEvent(theme);
  }

  /**
   * Toggle between themes
   */
  toggle() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  /**
   * Set specific theme
   */
  setTheme(theme) {
    if (!['dark', 'light'].includes(theme)) {
      console.warn(`Invalid theme: ${theme}`);
      return;
    }

    this.currentTheme = theme;
    this.applyTheme(theme);
    this.saveTheme(theme);
  }

  /**
   * Get current theme
   */
  getTheme() {
    return this.currentTheme;
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    if (!this.button) return;

    const cleanup = DOMUtils.addEventListenerWithCleanup(this.button, 'click', () => this.toggle());

    if (cleanup) {
      this.cleanupFunctions.push(cleanup);
    }

    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = (e) => {
        // Only auto-switch if user hasn't manually set a preference
        const hasPreference = this.storage.load('preference');
        if (!hasPreference) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      };

      const cleanup2 = DOMUtils.addEventListenerWithCleanup(
        mediaQuery,
        'change',
        handleSystemThemeChange
      );

      if (cleanup2) {
        this.cleanupFunctions.push(cleanup2);
      }
    }

    // Keyboard support
    const cleanup3 = DOMUtils.addEventListenerWithCleanup(this.button, 'keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle();
      }
    });

    if (cleanup3) {
      this.cleanupFunctions.push(cleanup3);
    }
  }

  /**
   * Dispatch custom theme change event
   */
  dispatchThemeChangeEvent(theme) {
    const event = new CustomEvent('themechange', {
      detail: { theme, previousTheme: this.currentTheme },
    });
    document.dispatchEvent(event);
  }

  /**
   * Detect system preference
   */
  static detectSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Cleanup event listeners
   */
  destroy() {
    this.cleanupFunctions.forEach((cleanup) => cleanup());
    this.cleanupFunctions = [];
  }
}
