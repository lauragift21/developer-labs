/**
 * Progress Tracker Component - Clean progress management
 */

import { StorageManager } from '../utils/storage.js';
import { DOMUtils } from '../utils/dom.js';

export class ProgressTracker {
  constructor(options = {}) {
    this.options = {
      storageKey: 'progress',
      navSelector: '.lab-nav',
      navItemSelector: '.lab-nav-item',
      ...options,
    };

    this.storage = new StorageManager('mcp');
    this.progress = this.loadProgress();
    this.cleanupFunctions = [];
    this.progressContainer = null;

    this.init();
  }

  /**
   * Initialize progress tracker
   */
  async init() {
    try {
      // Wait for DOM to be ready
      await this.waitForDOM();
      
      console.log('🔧 Initializing progress tracker...');
      
      await this.setupProgressBar();
      this.setupNavigation();
      this.updateUI();
      
      console.log('✅ Progress tracker initialized successfully');
      console.log(`📊 Total steps: ${this.getTotalSteps()}`);
      console.log(`✅ Completed steps: ${this.getCompletedStepsCount()}`);
      console.log(`📈 Progress: ${this.getCompletionPercentage()}%`);
    } catch (error) {
      console.error('❌ Failed to initialize progress tracker:', error);
      console.error('Stack trace:', error.stack);
    }
  }

  /**
   * Wait for DOM elements to be available
   */
  async waitForDOM() {
    return new Promise((resolve) => {
      const checkDOM = () => {
        const navContainer = DOMUtils.$(this.options.navSelector);
        const navItems = DOMUtils.$$(this.options.navItemSelector);
        
        if (navContainer && navItems.length > 0) {
          console.log(`🎯 Found navigation container and ${navItems.length} nav items`);
          resolve();
        } else {
          console.log('⏳ Waiting for DOM elements...');
          setTimeout(checkDOM, 100);
        }
      };
      
      checkDOM();
    });
  }

  /**
   * Load progress from storage
   */
  loadProgress() {
    return this.storage.load(this.options.storageKey, {});
  }

  /**
   * Save progress to storage
   */
  saveProgress() {
    return this.storage.save(this.options.storageKey, this.progress);
  }

  /**
   * Mark step as completed
   */
  markStepCompleted(stepId) {
    if (!stepId) {
      console.warn('⚠️ Cannot mark step completed: stepId is missing');
      return false;
    }

    console.log(`✅ Marking step ${stepId} as completed`);
    
    this.progress[stepId] = true;
    const saved = this.saveProgress();

    if (saved) {
      console.log(`💾 Progress saved for step ${stepId}`);
      this.updateStepUI(stepId);
      this.updateProgressBar();
      this.dispatchProgressEvent('step-completed', { stepId });
      
      // Log updated progress
      console.log(`📈 New progress: ${this.getCompletionPercentage()}% (${this.getCompletedStepsCount()}/${this.getTotalSteps()})`);
    } else {
      console.error(`❌ Failed to save progress for step ${stepId}`);
    }

    return saved;
  }

  /**
   * Mark step as incomplete
   */
  markStepIncomplete(stepId) {
    if (!stepId) {
      console.warn('Step ID is required');
      return false;
    }

    delete this.progress[stepId];
    const saved = this.saveProgress();

    if (saved) {
      this.updateStepUI(stepId);
      this.updateProgressBar();
      this.dispatchProgressEvent('step-incompleted', { stepId });
    }

    return saved;
  }

  /**
   * Check if step is completed
   */
  isStepCompleted(stepId) {
    return Boolean(this.progress[stepId]);
  }

  /**
   * Get completion percentage
   */
  getCompletionPercentage() {
    const totalSteps = this.getTotalSteps();
    const completedSteps = this.getCompletedStepsCount();

    return totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  }

  /**
   * Get total number of steps
   */
  getTotalSteps() {
    const navItems = DOMUtils.$$(this.options.navItemSelector);
    return navItems.length;
  }

  /**
   * Get completed steps count
   */
  getCompletedStepsCount() {
    return Object.values(this.progress).filter(Boolean).length;
  }

  /**
   * Setup overall progress bar
   */
  async setupProgressBar() {
    const navContainer = DOMUtils.$(this.options.navSelector);
    if (!navContainer) {
      console.warn('Navigation container not found');
      return;
    }

    // Don't create if already exists
    if (DOMUtils.$('.progress-container', navContainer)) {
      this.progressContainer = DOMUtils.$('.progress-container', navContainer);
      return;
    }

    this.progressContainer = DOMUtils.createElement(
      'div',
      {
        className: 'progress-container',
      },
      `
      <div class="progress-header">
        <span class="progress-label">Overall Progress</span>
        <span class="progress-percentage">0%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>
    `
    );

    navContainer.insertBefore(this.progressContainer, navContainer.firstChild);
  }

  /**
   * Setup navigation event listeners
   */
  setupNavigation() {
    const navItems = DOMUtils.$$(this.options.navItemSelector);

    navItems.forEach((item) => {
      const stepId = item.getAttribute('data-step');
      if (!stepId) return;

      // Update UI based on current progress
      this.updateStepUI(stepId);

      // Add click handler
      const cleanup = DOMUtils.addEventListenerWithCleanup(item, 'click', () =>
        this.handleStepClick(stepId)
      );

      if (cleanup) {
        this.cleanupFunctions.push(cleanup);
      }
    });
  }

  /**
   * Handle step click
   */
  handleStepClick(stepId) {
    this.markStepCompleted(stepId);
  }

  /**
   * Update step UI
   */
  updateStepUI(stepId) {
    const navItem = DOMUtils.$(`[data-step="${stepId}"]`);
    if (!navItem) return;

    const isCompleted = this.isStepCompleted(stepId);
    DOMUtils.toggleClass(navItem, 'completed', isCompleted);
  }

  /**
   * Update progress bar
   */
  updateProgressBar() {
    if (!this.progressContainer) {
      console.warn('⚠️ Progress container not found, cannot update progress bar');
      return;
    }

    const percentage = this.getCompletionPercentage();
    console.log(`📊 Updating progress bar to ${percentage}%`);

    const percentageElement = DOMUtils.$('.progress-percentage', this.progressContainer);
    const progressFill = DOMUtils.$('.progress-fill', this.progressContainer);

    if (percentageElement) {
      percentageElement.textContent = `${percentage}%`;
      console.log('✅ Updated percentage text');
    } else {
      console.warn('⚠️ Progress percentage element not found');
    }

    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
      console.log(`✅ Updated progress fill width to ${percentage}%`);
    } else {
      console.warn('⚠️ Progress fill element not found');
    }
  }

  /**
   * Update all UI elements
   */
  updateUI() {
    // Update all step indicators
    Object.keys(this.progress).forEach((stepId) => {
      this.updateStepUI(stepId);
    });

    // Update progress bar
    this.updateProgressBar();
  }

  /**
   * Reset all progress
   */
  resetProgress() {
    this.progress = {};
    const saved = this.saveProgress();

    if (saved) {
      this.updateUI();
      this.dispatchProgressEvent('progress-reset');
    }

    return saved;
  }

  /**
   * Get progress summary
   */
  getProgressSummary() {
    return {
      totalSteps: this.getTotalSteps(),
      completedSteps: this.getCompletedStepsCount(),
      percentage: this.getCompletionPercentage(),
      completedStepIds: Object.keys(this.progress).filter((stepId) => this.progress[stepId]),
    };
  }

  /**
   * Dispatch progress event
   */
  dispatchProgressEvent(eventType, detail = {}) {
    const event = new CustomEvent(`progress:${eventType}`, {
      detail: {
        ...detail,
        summary: this.getProgressSummary(),
      },
    });
    document.dispatchEvent(event);
  }

  /**
   * Export progress data
   */
  exportProgress() {
    return {
      progress: { ...this.progress },
      summary: this.getProgressSummary(),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Import progress data
   */
  importProgress(data) {
    if (!data || typeof data !== 'object') {
      console.warn('Invalid progress data');
      return false;
    }

    this.progress = { ...data.progress } || {};
    const saved = this.saveProgress();

    if (saved) {
      this.updateUI();
      this.dispatchProgressEvent('progress-imported', { data });
    }

    return saved;
  }

  /**
   * Test progress bar functionality (for debugging)
   */
  testProgressBar() {
    console.log('🧪 Testing progress bar functionality...');
    console.log(`📊 Total steps: ${this.getTotalSteps()}`);
    console.log(`✅ Completed steps: ${this.getCompletedStepsCount()}`);
    console.log(`📈 Progress percentage: ${this.getCompletionPercentage()}%`);
    console.log('🎯 Current progress state:', this.progress);
    
    // Test marking a step as completed
    console.log('🧪 Testing step completion...');
    this.markStepCompleted('1');
    
    return {
      totalSteps: this.getTotalSteps(),
      completedSteps: this.getCompletedStepsCount(),
      percentage: this.getCompletionPercentage(),
      progress: this.progress
    };
  }

  /**
   * Destroy and cleanup
   */
  destroy() {
    this.cleanupFunctions.forEach((cleanup) => cleanup());
    this.cleanupFunctions = [];

    if (this.progressContainer && this.progressContainer.parentNode) {
      this.progressContainer.parentNode.removeChild(this.progressContainer);
    }

    this.progressContainer = null;
  }
}
