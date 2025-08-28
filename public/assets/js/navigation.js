// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
  console.log('Navigation script loaded');
  
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  console.log('Mobile toggle:', mobileToggle);
  console.log('Nav menu:', navMenu);
  
  if (mobileToggle && navMenu) {
    console.log('Both elements found, adding event listener');
    
    mobileToggle.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Mobile toggle clicked');
      
      navMenu.classList.toggle('active');
      
      // Update aria-expanded for accessibility
      const isExpanded = navMenu.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
      
      console.log('Menu is now:', isExpanded ? 'open' : 'closed');
      
      // Change hamburger icon to X when open
      mobileToggle.textContent = isExpanded ? '✕' : '☰';
    });
    
    // Close mobile menu when clicking on nav links
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.textContent = '☰';
      });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!navMenu.contains(event.target) && !mobileToggle.contains(event.target)) {
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.textContent = '☰';
      }
    });
  } else {
    console.log('Elements not found - toggle:', !!mobileToggle, 'menu:', !!navMenu);
  }
});
