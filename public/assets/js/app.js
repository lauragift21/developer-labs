/**
 * Main Application Class - Orchestrates all components
 */

import { ThemeToggle } from './components/ThemeToggle.js';
import { ProgressTracker } from './components/ProgressTracker.js';
import { Navigation } from './components/Navigation.js';
import { LabNavigation } from './components/LabNavigation.js';
import { CopyToClipboard } from './components/CopyToClipboard.js';
import { DOMUtils } from './utils/dom.js';

class MCPWorkshopApp {
  constructor() {
    this.components = {};
    this.cleanupFunctions = [];
    this.isInitialized = false;
  }

  /**
   * Initialize the application
   */
  async init() {
    if (this.isInitialized) {
      console.warn('App already initialized');
      return;
    }

    try {
      console.log('🚀 Initializing MCP Workshop App...');

      // Wait for DOM to be ready
      await this.waitForDOM();

      // Initialize core components
      await this.initializeComponents();

      // Setup global event listeners
      this.setupGlobalEvents();

      // Setup performance optimizations
      this.setupPerformanceOptimizations();

      // Set dynamic copyright year
      this.setCurrentYear();

      this.isInitialized = true;
      console.log('✅ MCP Workshop App initialized successfully');

      // Dispatch ready event
      this.dispatchReadyEvent();
    } catch (error) {
      console.error('❌ Failed to initialize app:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * Wait for DOM to be ready
   */
  waitForDOM() {
    return new Promise((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve, { once: true });
      } else {
        resolve();
      }
    });
  }

  /**
   * Initialize all components
   */
  async initializeComponents() {
    // Initialize theme toggle
    try {
      this.components.themeToggle = new ThemeToggle();
      console.log('✅ Theme toggle initialized');
    } catch (error) {
      console.warn('⚠️ Theme toggle initialization failed:', error);
    }

    // Initialize main navigation
    try {
      this.components.navigation = new Navigation();
      console.log('✅ Navigation initialized');
    } catch (error) {
      console.warn('⚠️ Navigation initialization failed:', error);
    }

    // Initialize lab navigation
    try {
      this.components.labNavigation = new LabNavigation();
      console.log('✅ Lab navigation initialized');
    } catch (error) {
      console.warn('⚠️ Lab navigation initialization failed:', error);
    }

    // Initialize progress tracker
    try {
      this.components.progressTracker = new ProgressTracker();
      console.log('✅ Progress tracker initialized');
    } catch (error) {
      console.warn('⚠️ Progress tracker initialization failed:', error);
    }

    // Initialize copy to clipboard
    try {
      this.components.copyToClipboard = new CopyToClipboard();
      console.log('✅ Copy to clipboard initialized');
    } catch (error) {
      console.warn('⚠️ Copy to clipboard initialization failed:', error);
    }
  }

  /**
   * Setup global event listeners
   */
  setupGlobalEvents() {
    // Theme change events
    const themeCleanup = DOMUtils.addEventListenerWithCleanup(document, 'themechange', (e) =>
      this.handleThemeChange(e.detail)
    );

    // Progress events
    const progressCleanup = DOMUtils.addEventListenerWithCleanup(
      document,
      'progress:step-completed',
      (e) => this.handleProgressUpdate(e.detail)
    );

    // Lab navigation events
    const labCleanup = DOMUtils.addEventListenerWithCleanup(document, 'lab:step-change', (e) =>
      this.handleStepChange(e.detail)
    );

    // Visibility change (for performance)
    const visibilityCleanup = DOMUtils.addEventListenerWithCleanup(
      document,
      'visibilitychange',
      () => this.handleVisibilityChange()
    );

    // Store cleanup functions
    [themeCleanup, progressCleanup, labCleanup, visibilityCleanup]
      .filter(Boolean)
      .forEach((cleanup) => this.cleanupFunctions.push(cleanup));
  }

  /**
   * Setup performance optimizations
   */
  setupPerformanceOptimizations() {
    // Preload critical resources
    this.preloadCriticalResources();

    // Setup intersection observer for animations
    this.setupAnimationObserver();

    // Setup scroll performance
    this.setupScrollOptimizations();
  }

  /**
   * Preload critical resources
   */
  preloadCriticalResources() {
    // Preload next section content when user is near bottom
    const throttledScroll = DOMUtils.throttle(() => {
      const scrollPercent = (window.scrollY + window.innerHeight) / document.body.offsetHeight;
      if (scrollPercent > 0.8) {
        this.preloadNextContent();
      }
    }, 1000);

    const cleanup = DOMUtils.addEventListenerWithCleanup(window, 'scroll', throttledScroll);

    if (cleanup) {
      this.cleanupFunctions.push(cleanup);
    }
  }

  /**
   * Setup intersection observer for animations - DISABLED to prevent flashing
   */
  setupAnimationObserver() {
    // Disabled to prevent flashing and layout issues
    // All elements should be visible by default
    console.log('Animation observer disabled to prevent flashing issues');
  }

  /**
   * Setup scroll optimizations
   */
  setupScrollOptimizations() {
    // Use passive listeners for better performance
    const options = { passive: true };

    const scrollCleanup = DOMUtils.addEventListenerWithCleanup(
      window,
      'scroll',
      this.handleScroll.bind(this),
      options
    );

    if (scrollCleanup) {
      this.cleanupFunctions.push(scrollCleanup);
    }
  }

  /**
   * Handle scroll events
   */
  handleScroll() {
    // Update scroll-based UI elements
    requestAnimationFrame(() => {
      this.updateScrollBasedElements();
    });
  }

  /**
   * Update scroll-based UI elements
   */
  updateScrollBasedElements() {
    // Update scroll-to-top button visibility
    const scrollButton = DOMUtils.$('.scroll-to-top');
    if (scrollButton) {
      const shouldShow = window.pageYOffset > 300;
      scrollButton.style.opacity = shouldShow ? '1' : '0';
      scrollButton.style.visibility = shouldShow ? 'visible' : 'hidden';
    }
  }

  /**
   * Preload next content (placeholder for future enhancement)
   */
  preloadNextContent() {
    // This could preload images, code examples, etc.
    console.debug('Preloading next content...');
  }

  /**
   * Handle theme change
   */
  handleThemeChange(themeDetail) {
    console.log(`Theme changed to: ${themeDetail.theme}`);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = DOMUtils.$('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.content = themeDetail.theme === 'dark' ? '#000000' : '#ffffff';
    }

    // Dispatch to analytics if available
    if (window.gtag) {
      window.gtag('event', 'theme_change', {
        theme: themeDetail.theme,
      });
    }
  }

  /**
   * Handle progress updates
   */
  handleProgressUpdate(progressDetail) {
    console.log(`Step completed: ${progressDetail.stepId}`);

    // Could trigger celebrations, save to analytics, etc.
    if (window.gtag) {
      window.gtag('event', 'step_completed', {
        step_id: progressDetail.stepId,
        progress_percentage: progressDetail.summary.percentage,
      });
    }
  }

  /**
   * Handle step changes
   */
  handleStepChange(stepDetail) {
    console.log(`Navigated to step: ${stepDetail.stepNumber}`);

    // Update URL hash if needed
    if (history.replaceState && stepDetail.stepNumber) {
      history.replaceState(null, null, `#step-${stepDetail.stepNumber}`);
    }

    // Analytics
    if (window.gtag) {
      window.gtag('event', 'step_navigation', {
        step_number: stepDetail.stepNumber,
        previous_step: stepDetail.previousStep,
      });
    }
  }

  /**
   * Handle visibility change (page hidden/shown)
   */
  handleVisibilityChange() {
    if (document.hidden) {
      // Page is hidden - pause non-essential operations
      this.pauseNonEssentialOperations();
    } else {
      // Page is visible - resume operations
      this.resumeOperations();
    }
  }

  /**
   * Pause non-essential operations
   */
  pauseNonEssentialOperations() {
    // Pause animations, polling, etc.
    console.debug('Pausing non-essential operations');
  }

  /**
   * Resume operations
   */
  resumeOperations() {
    // Resume animations, polling, etc.
    console.debug('Resuming operations');
  }

  /**
   * Handle initialization errors
   */
  handleInitializationError(error) {
    // Show user-friendly error message
    const errorContainer = DOMUtils.$('.error-container') || this.createErrorContainer();
    errorContainer.innerHTML = `
      <div class="error-message">
        <h3>Oops! Something went wrong</h3>
        <p>The workshop failed to load properly. Please refresh the page to try again.</p>
        <button onclick="location.reload()" class="btn btn-primary">Refresh Page</button>
      </div>
    `;
    errorContainer.style.display = 'block';
  }

  /**
   * Create error container
   */
  createErrorContainer() {
    const container = DOMUtils.createElement('div', {
      className: 'error-container',
      style:
        'display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--bg-secondary); padding: 2rem; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index: 9999; text-align: center;',
    });

    document.body.appendChild(container);
    return container;
  }

  /**
   * Dispatch app ready event
   */
  dispatchReadyEvent() {
    const event = new CustomEvent('app:ready', {
      detail: {
        components: Object.keys(this.components),
        timestamp: Date.now(),
      },
    });
    document.dispatchEvent(event);
  }

  /**
   * Get component instance
   */
  getComponent(name) {
    return this.components[name] || null;
  }

  /**
   * Set dynamic copyright year
   */
  setCurrentYear() {
    const yearElement = DOMUtils.$('#current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
      console.log('✅ Dynamic copyright year set');
    }
  }

  /**
   * Check if app is ready
   */
  isReady() {
    return this.isInitialized;
  }

  /**
   * Destroy app and cleanup
   */
  destroy() {
    console.log('🧹 Cleaning up MCP Workshop App...');

    // Cleanup components
    Object.values(this.components).forEach((component) => {
      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }
    });

    // Cleanup global event listeners
    this.cleanupFunctions.forEach((cleanup) => cleanup());

    // Reset state
    this.components = {};
    this.cleanupFunctions = [];
    this.isInitialized = false;

    console.log('✅ App cleanup complete');
  }
}

// Create singleton instance
const app = new MCPWorkshopApp();

// Auto-initialize when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

// Export for global access
window.MCPWorkshopApp = app;

// Add global test functions for debugging
window.testProgressBar = () => {
  const progressTracker = app.getComponent('progressTracker');
  if (progressTracker) {
    return progressTracker.testProgressBar();
  } else {
    console.error('❌ Progress tracker not found');
    return null;
  }
};

window.resetProgress = () => {
  const progressTracker = app.getComponent('progressTracker');
  if (progressTracker) {
    return progressTracker.resetProgress();
  } else {
    console.error('❌ Progress tracker not found');
    return false;
  }
};

window.markStepCompleted = (stepId) => {
  const progressTracker = app.getComponent('progressTracker');
  if (progressTracker) {
    return progressTracker.markStepCompleted(stepId);
  } else {
    console.error('❌ Progress tracker not found');
    return false;
  }
};

window.refreshCopyButtons = () => {
  const copyToClipboard = app.getComponent('copyToClipboard');
  if (copyToClipboard) {
    copyToClipboard.refresh();
    console.log('✅ Copy buttons refreshed');
    return true;
  } else {
    console.error('❌ Copy to clipboard component not found');
    return false;
  }
};

export default app;
