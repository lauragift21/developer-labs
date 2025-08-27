/**
 * Copy to Clipboard Component - Enhanced clipboard functionality
 */

import { DOMUtils } from '../utils/dom.js';

export class CopyToClipboard {
  constructor(options = {}) {
    this.options = {
      selector: 'pre code, .code-block code',
      buttonClass: 'copy-btn',
      buttonText: '📋 Copy',
      successText: '✅ Copied!',
      errorText: '❌ Failed',
      timeout: 2000,
      showTooltip: true,
      ...options,
    };

    this.cleanupFunctions = [];
    this.init();
  }

  /**
   * Initialize copy to clipboard functionality
   */
  async init() {
    try {
      console.log('🔧 Initializing copy-to-clipboard...');
      
      // Wait for DOM to be ready
      await this.waitForCodeBlocks();
      
      this.setupCopyButtons();
      console.log('✅ Copy-to-clipboard initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize copy-to-clipboard:', error);
    }
  }

  /**
   * Wait for code blocks to be available
   */
  async waitForCodeBlocks() {
    return new Promise((resolve) => {
      const checkCodeBlocks = () => {
        const codeBlocks = DOMUtils.$$(this.options.selector);
        
        if (codeBlocks.length > 0) {
          console.log(`🎯 Found ${codeBlocks.length} code blocks`);
          resolve();
        } else {
          console.log('⏳ Waiting for code blocks...');
          setTimeout(checkCodeBlocks, 100);
        }
      };
      
      checkCodeBlocks();
    });
  }

  /**
   * Setup copy buttons for all code blocks
   */
  setupCopyButtons() {
    const codeBlocks = DOMUtils.$$(this.options.selector);
    
    codeBlocks.forEach((codeBlock, index) => {
      this.addCopyButton(codeBlock, index);
    });
  }

  /**
   * Add copy button to a code block
   */
  addCopyButton(codeBlock, index) {
    const container = codeBlock.closest('pre') || codeBlock.parentElement;
    
    // Skip if button already exists
    if (container.querySelector(`.${this.options.buttonClass}`)) {
      return;
    }

    // Make container relative for absolute positioning
    if (getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }

    // Create copy button
    const copyButton = DOMUtils.createElement(
      'button',
      {
        className: `${this.options.buttonClass}`,
        type: 'button',
        'aria-label': 'Copy code to clipboard',
        'data-code-index': index,
      },
      this.options.buttonText
    );

    // Add click handler
    const cleanup = DOMUtils.addEventListenerWithCleanup(
      copyButton,
      'click',
      (e) => this.handleCopyClick(e, codeBlock, copyButton)
    );

    if (cleanup) {
      this.cleanupFunctions.push(cleanup);
    }

    // Insert button into container
    container.appendChild(copyButton);
  }

  /**
   * Handle copy button click
   */
  async handleCopyClick(event, codeBlock, button) {
    event.preventDefault();
    event.stopPropagation();

    try {
      const code = this.extractCode(codeBlock);
      const success = await this.copyToClipboard(code);
      
      if (success) {
        this.showFeedback(button, this.options.successText, 'success');
        console.log('✅ Code copied to clipboard');
      } else {
        this.showFeedback(button, this.options.errorText, 'error');
        console.warn('⚠️ Failed to copy code to clipboard');
      }
    } catch (error) {
      console.error('❌ Copy operation failed:', error);
      this.showFeedback(button, this.options.errorText, 'error');
    }
  }

  /**
   * Extract clean code from code block
   */
  extractCode(codeBlock) {
    // Get text content and clean it up
    let code = codeBlock.textContent || codeBlock.innerText || '';
    
    // Remove common artifacts
    code = code
      .replace(/^\$\s+/gm, '') // Remove shell prompts
      .replace(/^>\s+/gm, '')  // Remove quote markers
      .trim();

    return code;
  }

  /**
   * Copy text to clipboard using modern API with fallback
   */
  async copyToClipboard(text) {
    try {
      // Modern clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      
      // Fallback for older browsers
      return this.fallbackCopyToClipboard(text);
    } catch (error) {
      console.warn('Modern clipboard API failed, trying fallback:', error);
      return this.fallbackCopyToClipboard(text);
    }
  }

  /**
   * Fallback copy method for older browsers
   */
  fallbackCopyToClipboard(text) {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      return successful;
    } catch (error) {
      console.error('Fallback copy failed:', error);
      return false;
    }
  }

  /**
   * Show visual feedback on button
   */
  showFeedback(button, text, type) {
    const originalText = button.textContent;
    const originalClass = button.className;
    
    // Update button appearance
    button.textContent = text;
    button.classList.add(`copy-${type}`);
    button.disabled = true;

    // Reset after timeout
    setTimeout(() => {
      button.textContent = originalText;
      button.className = originalClass;
      button.disabled = false;
    }, this.options.timeout);
  }

  /**
   * Refresh copy buttons (useful after dynamic content updates)
   */
  refresh() {
    console.log('🔄 Refreshing copy buttons...');
    this.setupCopyButtons();
  }

  /**
   * Destroy and cleanup
   */
  destroy() {
    this.cleanupFunctions.forEach((cleanup) => cleanup());
    this.cleanupFunctions = [];

    // Remove all copy buttons
    const buttons = DOMUtils.$$(`button.${this.options.buttonClass}`);
    buttons.forEach((button) => {
      if (button.parentNode) {
        button.parentNode.removeChild(button);
      }
    });
  }
}
