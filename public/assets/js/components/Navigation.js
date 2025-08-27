/**
 * Navigation Component - Clean navigation management
 */

import { DOMUtils } from '../utils/dom.js';

export class Navigation {
  constructor(options = {}) {
    this.options = {
      navSelector: '.navbar',
      navLinksSelector: '.nav-link',
      sectionsSelector: 'section[id]',
      activeClass: 'active',
      scrollOffset: 100,
      ...options,
    };

    this.navbar = DOMUtils.$(this.options.navSelector);
    this.navLinks = DOMUtils.$$(this.options.navLinksSelector);
    this.sections = DOMUtils.$$(this.options.sectionsSelector);
    this.cleanupFunctions = [];

    this.init();
  }

  /**
   * Initialize navigation
   */
  init() {
    if (!this.navbar) {
      console.warn('Navigation not found');
      return;
    }

    this.setupSmoothScrolling();
    this.setupActiveHighlighting();
    this.setupScrollEffects();
  }

  /**
   * Setup smooth scrolling for navigation links
   */
  setupSmoothScrolling() {
    this.navLinks.forEach((link) => {
      const cleanup = DOMUtils.addEventListenerWithCleanup(link, 'click', (e) =>
        this.handleNavClick(e, link)
      );

      if (cleanup) {
        this.cleanupFunctions.push(cleanup);
      }
    });
  }

  /**
   * Handle navigation link click
   */
  handleNavClick(event, link) {
    const href = link.getAttribute('href');

    // Only handle internal anchors
    if (!href || !href.startsWith('#')) {
      return;
    }

    event.preventDefault();

    const targetId = href.substring(1);
    const targetElement = DOMUtils.$(`#${targetId}`);

    if (targetElement) {
      this.scrollToSection(targetElement);
      this.updateActiveLink(href);
    }
  }

  /**
   * Scroll to section with offset
   */
  scrollToSection(element, customOffset) {
    const offset = customOffset !== undefined ? customOffset : this.options.scrollOffset;
    DOMUtils.scrollToElement(element, offset);
  }

  /**
   * Setup active link highlighting based on scroll position
   */
  setupActiveHighlighting() {
    const throttledHighlight = DOMUtils.throttle(() => {
      this.highlightActiveSection();
    }, 100);

    const cleanup = DOMUtils.addEventListenerWithCleanup(window, 'scroll', throttledHighlight);

    if (cleanup) {
      this.cleanupFunctions.push(cleanup);
    }

    // Initial highlight
    this.highlightActiveSection();
  }

  /**
   * Highlight active section based on scroll position
   */
  highlightActiveSection() {
    let current = '';

    this.sections.forEach((section) => {
      const sectionTop = section.offsetTop - this.options.scrollOffset;
      const sectionHeight = section.offsetHeight;
      const scrollPosition = window.pageYOffset;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = `#${section.getAttribute('id')}`;
      }
    });

    this.updateActiveLink(current);
  }

  /**
   * Update active navigation link
   */
  updateActiveLink(activeHref) {
    this.navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      const isActive = href === activeHref;

      DOMUtils.toggleClass(link, this.options.activeClass, isActive);
    });
  }

  /**
   * Setup scroll effects for navbar
   */
  setupScrollEffects() {
    const throttledScroll = DOMUtils.throttle(() => {
      this.handleNavbarScroll();
    }, 16); // ~60fps

    const cleanup = DOMUtils.addEventListenerWithCleanup(window, 'scroll', throttledScroll);

    if (cleanup) {
      this.cleanupFunctions.push(cleanup);
    }
  }

  /**
   * Handle navbar scroll effects
   */
  handleNavbarScroll() {
    if (!this.navbar) return;

    const scrolled = window.scrollY > 50;
    DOMUtils.toggleClass(this.navbar, 'scrolled', scrolled);
  }

  /**
   * Get current active section
   */
  getCurrentSection() {
    const activeLink = DOMUtils.$(`.${this.options.activeClass}`, this.navbar);
    return activeLink ? activeLink.getAttribute('href') : null;
  }

  /**
   * Navigate to section programmatically
   */
  navigateToSection(sectionId, smooth = true) {
    const targetElement = DOMUtils.$(`#${sectionId}`);

    if (targetElement) {
      if (smooth) {
        this.scrollToSection(targetElement);
      } else {
        targetElement.scrollIntoView({ behavior: 'auto' });
      }

      this.updateActiveLink(`#${sectionId}`);
      return true;
    }

    console.warn(`Section #${sectionId} not found`);
    return false;
  }

  /**
   * Get all navigation sections
   */
  getSections() {
    return this.sections.map((section) => ({
      id: section.getAttribute('id'),
      element: section,
      title: section.querySelector('h1, h2, h3')?.textContent || section.getAttribute('id'),
    }));
  }

  /**
   * Add new navigation link
   */
  addNavLink(href, text, position = 'end') {
    const navMenu = DOMUtils.$('.nav-menu', this.navbar);
    if (!navMenu) return null;

    const li = DOMUtils.createElement('li');
    const link = DOMUtils.createElement(
      'a',
      {
        href,
        className: 'nav-link',
      },
      text
    );

    li.appendChild(link);

    if (position === 'start') {
      navMenu.insertBefore(li, navMenu.firstChild);
    } else {
      navMenu.appendChild(li);
    }

    // Update internal arrays
    this.navLinks = DOMUtils.$$(this.options.navLinksSelector);

    // Setup events for new link
    const cleanup = DOMUtils.addEventListenerWithCleanup(link, 'click', (e) =>
      this.handleNavClick(e, link)
    );

    if (cleanup) {
      this.cleanupFunctions.push(cleanup);
    }

    return link;
  }

  /**
   * Remove navigation link
   */
  removeNavLink(href) {
    const link = DOMUtils.$(`a[href="${href}"]`, this.navbar);
    if (link && link.parentNode) {
      link.parentNode.remove();

      // Update internal arrays
      this.navLinks = DOMUtils.$$(this.options.navLinksSelector);
      return true;
    }
    return false;
  }

  /**
   * Cleanup event listeners
   */
  destroy() {
    this.cleanupFunctions.forEach((cleanup) => cleanup());
    this.cleanupFunctions = [];
  }
}
