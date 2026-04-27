/**
 * Mobile Optimizations - Touch Events & Mobile UX
 * Handles mobile-specific interactions and optimizations
 */

class MobileOptimizer {
  constructor() {
    this.isMobile = window.innerWidth <= 768;
    this.isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    this.isDesktop = window.innerWidth > 1024;
    
    this.init();
  }

  init() {
    this.setupViewportOptimizations();
    this.setupTouchOptimizations();
    this.setupResponsiveEvents();
    this.optimizeImages();
    this.optimizeFormInputs();
  }

  setupViewportOptimizations() {
    // Ensure viewport is set correctly (handled in HTML, but backup here)
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport && !viewport.content.includes('viewport-fit')) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=yes'
      );
    }
  }

  setupTouchOptimizations() {
    // Add touch event handling for better mobile UX
    document.addEventListener('touchstart', (e) => {
      const btn = e.target.closest('button, a.btn, [role="button"]');
      if (btn) {
        btn.style.opacity = '0.8';
      }
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      const btn = e.target.closest('button, a.btn, [role="button"]');
      if (btn) {
        btn.style.opacity = '1';
      }
    }, { passive: true });

    // Prevent 300ms tap delay on mobile
    document.addEventListener('touchstart', () => {}, { passive: true });
  }

  setupResponsiveEvents() {
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.updateDeviceType();
      }, 250);
    });
  }

  updateDeviceType() {
    const width = window.innerWidth;
    this.isMobile = width <= 768;
    this.isTablet = width > 768 && width <= 1024;
    this.isDesktop = width > 1024;
    
    // Dispatch custom event for responsive changes
    window.dispatchEvent(new CustomEvent('deviceTypeChanged', {
      detail: {
        isMobile: this.isMobile,
        isTablet: this.isTablet,
        isDesktop: this.isDesktop,
        width: width
      }
    }));
  }

  optimizeImages() {
    // Add srcset to images for responsive loading
    const images = document.querySelectorAll('img[data-responsive]');
    images.forEach(img => {
      if (this.isMobile && img.dataset.mobileSrc) {
        img.src = img.dataset.mobileSrc;
      }
    });
  }

  optimizeFormInputs() {
    // Ensure form inputs are mobile-optimized
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      // Increase touch target size
      const currentPadding = window.getComputedStyle(input).padding;
      if (this.isMobile) {
        input.style.minHeight = '48px';
        input.style.padding = '0.75rem';
        input.style.fontSize = '16px'; // Prevent zoom on iOS
      }
    });
  }

  // Static helper methods
  static isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  static isPortrait() {
    return window.innerHeight > window.innerWidth;
  }

  static isLandscape() {
    return window.innerWidth > window.innerHeight;
  }
}

// Prevent pinch zoom on desktop while allowing on mobile
document.addEventListener('gesturestart', (e) => {
  if (window.innerWidth > 768) {
    e.preventDefault();
  }
}, { passive: false });

// Optimize touch targets
document.addEventListener('DOMContentLoaded', () => {
  new MobileOptimizer();
  
  // Make all interactive elements properly sized
  const interactiveElements = document.querySelectorAll(
    'button, a.btn, [role="button"], input[type="button"], input[type="submit"]'
  );
  
  interactiveElements.forEach(el => {
    const height = el.offsetHeight;
    if (height < 48) {
      el.style.minHeight = '48px';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.padding = '0.75rem 1.25rem';
    }
  });

  // Optimize select dropdowns for mobile
  const selects = document.querySelectorAll('select');
  selects.forEach(select => {
    select.style.fontSize = '16px';
    select.style.minHeight = '48px';
    select.style.padding = '0.75rem';
  });

  // Optimize form labels for mobile
  const labels = document.querySelectorAll('label');
  labels.forEach(label => {
    label.style.display = 'block';
    label.style.marginBottom = '0.5rem';
    label.style.fontWeight = '600';
    label.style.fontSize = '0.95rem';
  });
});

// Export for module usage
export { MobileOptimizer };
