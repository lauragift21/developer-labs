/**
 * Lab Navigation Component - Manages workshop step navigation
 */

import { DOMUtils } from '../utils/dom.js';

export class LabNavigation {
  constructor(options = {}) {
    this.options = {
      navItemSelector: '.lab-nav-item',
      contentSelector: '.step-content',
      activeClass: 'active',
      ...options,
    };

    this.navItems = DOMUtils.$$(this.options.navItemSelector);
    this.contentSections = DOMUtils.$$(this.options.contentSelector);
    this.cleanupFunctions = [];
    this.currentStep = null;

    this.init();
  }

  /**
   * Initialize lab navigation
   */
  init() {
    if (this.navItems.length === 0) {
      console.warn('No lab navigation items found');
      return;
    }

    this.setupNavigation();
    this.showInitialStep();
  }

  /**
   * Setup navigation event listeners
   */
  setupNavigation() {
    this.navItems.forEach((item, index) => {
      const stepNumber = item.getAttribute('data-step');

      if (!stepNumber) {
        console.warn(`Nav item at index ${index} missing data-step attribute`);
        return;
      }

      const cleanup = DOMUtils.addEventListenerWithCleanup(item, 'click', () =>
        this.handleStepClick(stepNumber, item)
      );

      if (cleanup) {
        this.cleanupFunctions.push(cleanup);
      }

      // Add keyboard support
      const keyboardCleanup = DOMUtils.addEventListenerWithCleanup(item, 'keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleStepClick(stepNumber, item);
        }
      });

      if (keyboardCleanup) {
        this.cleanupFunctions.push(keyboardCleanup);
      }

      // Make focusable
      if (!item.hasAttribute('tabindex')) {
        item.setAttribute('tabindex', '0');
      }
    });
  }

  /**
   * Handle step navigation click
   */
  handleStepClick(stepNumber, navItem) {
    this.showStep(stepNumber);
    this.setActiveNavItem(navItem);
    this.dispatchStepChangeEvent(stepNumber);
  }

  /**
   * Show specific step content
   */
  showStep(stepNumber) {
    const targetStep = DOMUtils.$(`#step-${stepNumber}`);

    if (!targetStep) {
      console.warn(`Step content #step-${stepNumber} not found`);
      return false;
    }

    // Hide all step content
    this.contentSections.forEach((content) => {
      content.style.display = 'none';
    });

    // Show target step
    targetStep.style.display = 'block';
    this.currentStep = stepNumber;

    // Smooth scroll to content (optional)
    if (window.innerWidth <= 1024) {
      // Mobile/tablet
      DOMUtils.scrollToElement(targetStep, 80);
    }

    return true;
  }

  /**
   * Set active navigation item
   */
  setActiveNavItem(activeItem) {
    // Remove active class from all items
    this.navItems.forEach((item) => {
      DOMUtils.toggleClass(item, this.options.activeClass, false);
    });

    // Add active class to current item
    if (activeItem) {
      DOMUtils.toggleClass(activeItem, this.options.activeClass, true);
    }
  }

  /**
   * Show initial step (first step by default)
   */
  showInitialStep() {
    const firstNavItem = this.navItems[0];
    if (firstNavItem) {
      const firstStepNumber = firstNavItem.getAttribute('data-step');
      if (firstStepNumber) {
        this.handleStepClick(firstStepNumber, firstNavItem);
      }
    }
  }

  /**
   * Navigate to next step
   */
  nextStep() {
    const currentIndex = this.getCurrentStepIndex();
    const nextIndex = currentIndex + 1;

    if (nextIndex < this.navItems.length) {
      const nextNavItem = this.navItems[nextIndex];
      const nextStepNumber = nextNavItem.getAttribute('data-step');
      this.handleStepClick(nextStepNumber, nextNavItem);
      return true;
    }

    return false;
  }

  /**
   * Navigate to previous step
   */
  previousStep() {
    const currentIndex = this.getCurrentStepIndex();
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      const prevNavItem = this.navItems[prevIndex];
      const prevStepNumber = prevNavItem.getAttribute('data-step');
      this.handleStepClick(prevStepNumber, prevNavItem);
      return true;
    }

    return false;
  }

  /**
   * Get current step index
   */
  getCurrentStepIndex() {
    if (!this.currentStep) return 0;

    return this.navItems.findIndex((item) => item.getAttribute('data-step') === this.currentStep);
  }

  /**
   * Get current step number
   */
  getCurrentStep() {
    return this.currentStep;
  }

  /**
   * Get total number of steps
   */
  getTotalSteps() {
    return this.navItems.length;
  }

  /**
   * Check if step exists
   */
  hasStep(stepNumber) {
    return DOMUtils.$(`#step-${stepNumber}`) !== null;
  }

  /**
   * Navigate to specific step by number
   */
  navigateToStep(stepNumber) {
    const navItem = this.navItems.find(
      (item) => item.getAttribute('data-step') === stepNumber.toString()
    );

    if (navItem) {
      this.handleStepClick(stepNumber.toString(), navItem);
      return true;
    }

    console.warn(`Step ${stepNumber} not found`);
    return false;
  }

  /**
   * Get step info
   */
  getStepInfo(stepNumber) {
    const navItem = this.navItems.find(
      (item) => item.getAttribute('data-step') === stepNumber.toString()
    );

    if (!navItem) return null;

    const stepContent = DOMUtils.$(`#step-${stepNumber}`);

    return {
      number: stepNumber,
      navItem,
      contentElement: stepContent,
      title: DOMUtils.$('.lab-name', navItem)?.textContent || `Step ${stepNumber}`,
      duration: DOMUtils.$('.lab-duration', navItem)?.textContent || null,
      isActive: navItem.classList.contains(this.options.activeClass),
    };
  }

  /**
   * Get all steps info
   */
  getAllStepsInfo() {
    return this.navItems
      .map((item) => {
        const stepNumber = item.getAttribute('data-step');
        return this.getStepInfo(stepNumber);
      })
      .filter(Boolean);
  }

  /**
   * Dispatch step change event
   */
  dispatchStepChangeEvent(stepNumber) {
    const event = new CustomEvent('lab:step-change', {
      detail: {
        stepNumber,
        previousStep: this.currentStep,
        stepInfo: this.getStepInfo(stepNumber),
      },
    });
    document.dispatchEvent(event);
  }

  /**
   * Add keyboard navigation support
   */
  enableKeyboardNavigation() {
    const cleanup = DOMUtils.addEventListenerWithCleanup(document, 'keydown', (e) => {
      // Only handle if focus is within lab navigation
      const focusedElement = document.activeElement;
      const isInLabNav = this.navItems.some(
        (item) => item === focusedElement || item.contains(focusedElement)
      );

      if (!isInLabNav) return;

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          this.previousStep();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          this.nextStep();
          break;
        case 'Home':
          e.preventDefault();
          this.navigateToStep(1);
          break;
        case 'End':
          e.preventDefault();
          this.navigateToStep(this.getTotalSteps());
          break;
      }
    });

    if (cleanup) {
      this.cleanupFunctions.push(cleanup);
    }
  }

  /**
   * Cleanup event listeners
   */
  destroy() {
    this.cleanupFunctions.forEach((cleanup) => cleanup());
    this.cleanupFunctions = [];
  }
}
