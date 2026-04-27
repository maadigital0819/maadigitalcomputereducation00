/*!
 * Maa Digital Computer Education – Main JavaScript
 * Handles navigation, smooth scrolling, scroll‑spy, lazy loading,
 * mobile menu toggle, lightbox, and professional enhancements.
 * ES2022+, no external libraries.
 */

class HeaderScroll {
  #header;
  
  constructor(headerSelector) {
    this.#header = document.querySelector(headerSelector);
  }

  init() {
    if (!this.#header) return;
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        this.#header.classList.add('scrolled');
      } else {
        this.#header.classList.remove('scrolled');
      }
    }, { passive: true });
  }
}

class MobileMenu {
  #toggleBtn;
  #menu;
  #isOpen = false;

  constructor(toggleSelector, menuSelector) {
    this.#toggleBtn = document.querySelector(toggleSelector);
    this.#menu = document.querySelector(menuSelector);
    if (!this.#toggleBtn || !this.#menu) return;
  }

  #toggle = () => {
    this.#isOpen = !this.#isOpen;
    this.#menu.classList.toggle('open', this.#isOpen);
    this.#toggleBtn.setAttribute('aria-expanded', this.#isOpen);
  };

  init() {
    if (!this.#toggleBtn) return;
    this.#toggleBtn.addEventListener('click', this.#toggle);
    // close menu on link click (mobile)
    this.#menu.addEventListener('click', e => {
      if (e.target.matches('a')) {
        this.#toggle();
      }
    });
  }
}

class SmoothScroll {
  #links;

  constructor(linkSelector) {
    this.#links = document.querySelectorAll(linkSelector);
  }

  #handleClick = e => {
    const href = e.currentTarget.getAttribute('href');
    if (!href?.startsWith('#')) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, '', href);
  };

  init() {
    this.#links.forEach(link => {
      link.addEventListener('click', this.#handleClick);
    });
  }
}

class ScrollSpy {
  #sections;
  #navLinks;
  #observer;

  constructor(sectionSelector, navLinkSelector) {
    this.#sections = document.querySelectorAll(sectionSelector);
    this.#navLinks = document.querySelectorAll(navLinkSelector);
  }

  #onIntersect = entries => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const navLink = document.querySelector(`a[href="#${id}"]`);
      if (!navLink) return;
      if (entry.isIntersecting) {
        this.#navLinks.forEach(link => link.classList.remove('active'));
        navLink.classList.add('active');
      }
    });
  };

  init() {
    if (!('IntersectionObserver' in window)) return;
    this.#observer = new IntersectionObserver(this.#onIntersect, {
      root: null,
      rootMargin: '0px 0px -70% 0px',
      threshold: 0.1,
    });
    this.#sections.forEach(sec => this.#observer.observe(sec));
  }
}

class LazyLoadImages {
  #imgs;
  #observer;

  constructor(imgSelector) {
    this.#imgs = document.querySelectorAll(imgSelector);
  }

  #load = img => {
    const src = img.dataset.src || img.src;
    if (!src) return;
    
    const tempImg = new Image();
    tempImg.onload = () => {
      img.src = src;
      img.removeAttribute('data-src');
      img.classList.add('loaded');
    };
    tempImg.src = src;
  };

  #onIntersect = entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.#load(entry.target);
        this.#observer.unobserve(entry.target);
      }
    });
  };

  init() {
    if (!('IntersectionObserver' in window)) {
      this.#imgs.forEach(img => this.#load(img));
      return;
    }
    this.#observer = new IntersectionObserver(this.#onIntersect, {
      rootMargin: '0px 0px 200px 0px',
      threshold: 0.01,
    });
    this.#imgs.forEach(img => this.#observer.observe(img));
  }
}

class Lightbox {
  #overlay;
  #img;
  #closeBtn;

  constructor(gallerySelector) {
    this.gallery = document.querySelector(gallerySelector);
    if (!this.gallery) return;
    this.#createOverlay();
  }

  #createOverlay() {
    this.#overlay = document.createElement('div');
    this.#overlay.className = 'lightbox-overlay';
    this.#overlay.innerHTML = `
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <img class="lightbox-img" alt="Enlarged view"/>
    `;
    document.body.appendChild(this.#overlay);
    this.#img = this.#overlay.querySelector('.lightbox-img');
    this.#closeBtn = this.#overlay.querySelector('.lightbox-close');

    this.#overlay.addEventListener('click', e => {
      if (e.target === this.#overlay || e.target === this.#closeBtn) this.hide();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.isVisible()) this.hide();
    });
  }

  #open = src => {
    this.#img.src = src;
    this.#overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  };

  hide() {
    this.#overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  isVisible() {
    return this.#overlay.classList.contains('visible');
  }

  init() {
    if (!this.gallery) return;
    this.gallery.addEventListener('click', e => {
      const target = e.target.closest('img[data-src]');
      if (!target) return;
      e.preventDefault();
      const src = target.dataset.src || target.src;
      this.#open(src);
    });
  }
}

class IntersectionAnimations {
  #elements;
  #observer;

  constructor(selector = '[data-animation]') {
    this.#elements = document.querySelectorAll(selector);
  }

  #onIntersect = entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const animation = entry.target.dataset.animation;
        entry.target.classList.add(animation);
        this.#observer.unobserve(entry.target);
      }
    });
  };

  init() {
    if (!('IntersectionObserver' in window)) return;
    this.#observer = new IntersectionObserver(this.#onIntersect, {
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1,
    });
    this.#elements.forEach(el => this.#observer.observe(el));
  }
}

/* Course Filter Class (NEW) */
class CourseFilter {
  #filterBtns;
  #courseCards;
  #noCoursesMsg;

  constructor() {
    this.#filterBtns = document.querySelectorAll('.filter-btn');
    this.#courseCards = document.querySelectorAll('.course-card');
    this.#noCoursesMsg = document.getElementById('no-courses-message');
  }

  init() {
    if (this.#filterBtns.length === 0) return;
    
    this.#filterBtns.forEach(btn => {
      btn.addEventListener('click', () => this.#handleFilter(btn));
    });
  }

  #handleFilter(btn) {
    const filter = btn.dataset.filter;
    
    // Update button states
    this.#filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Filter courses
    let visibleCount = 0;
    this.#courseCards.forEach(card => {
      if (filter === 'all' || card.dataset.level === filter) {
        card.style.animation = 'none';
        card.style.display = 'block';
        // Trigger reflow
        void card.offsetWidth;
        card.style.animation = 'fadeInUp 0.5s ease-out forwards';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    
    // Show/hide no courses message
    if (this.#noCoursesMsg) {
      this.#noCoursesMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }
}

/* Course Details Toggle (NEW) */
function toggleDetails(courseId) {
  const detailsEl = document.getElementById(`details-${courseId}`);
  const btnEl = event?.target;
  
  if (!detailsEl) return;
  
  const isActive = detailsEl.classList.contains('active');
  detailsEl.classList.toggle('active', !isActive);
  
  if (btnEl) {
    btnEl.textContent = isActive ? 'More Details ↓' : 'Less Details ↑';
  }
}

/* Course Search Class (NEW) */
class CourseSearch {
  #searchInput;
  #courseCards;
  #filterBtns;
  #noCoursesMsg;

  constructor(searchSelector = '#courseSearch', courseSelector = '.course-card') {
    this.#searchInput = document.querySelector(searchSelector);
    this.#courseCards = document.querySelectorAll(courseSelector);
    this.#filterBtns = document.querySelectorAll('.filter-btn');
    this.#noCoursesMsg = document.getElementById('no-courses-message');
  }

  init() {
    if (!this.#searchInput) return;
    
    this.#searchInput.addEventListener('input', (e) => this.#handleSearch(e.target.value));
  }

  #handleSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    
    let visibleCount = 0;
    this.#courseCards.forEach(card => {
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const description = card.querySelector('.course-content > p')?.textContent.toLowerCase() || '';
      const tags = Array.from(card.querySelectorAll('.course-tag')).map(t => t.textContent.toLowerCase()).join(' ');
      
      const matches = title.includes(searchTerm) || description.includes(searchTerm) || tags.includes(searchTerm);
      
      // Check current filter
      const activeFilter = Array.from(this.#filterBtns).find(b => b.classList.contains('active'))?.dataset.filter || 'all';
      const levelMatch = activeFilter === 'all' || card.dataset.level === activeFilter;
      
      if (matches && levelMatch) {
        card.style.display = 'block';
        card.style.animation = 'fadeInUp 0.5s ease-out forwards';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });
    
    // Show/hide no courses message
    if (this.#noCoursesMsg) {
      this.#noCoursesMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }
}

/* Counter Animation for Stats */
class CounterAnimation {
  #elements;
  #observer;

  constructor(selector = '.stat-box h3') {
    this.#elements = document.querySelectorAll(selector);
  }

  #animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''), 10);
    if (isNaN(target)) return;
    
    let current = 0;
    const increment = Math.ceil(target / 50);
    const suffix = element.textContent.replace(/\d/g, '');
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target + suffix;
        clearInterval(timer);
      } else {
        element.textContent = current + suffix;
      }
    }, 20);
  }

  #onIntersect = entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.#animateCounter(entry.target);
        this.#observer.unobserve(entry.target);
      }
    });
  };

  init() {
    if (!('IntersectionObserver' in window)) {
      this.#elements.forEach(el => this.#animateCounter(el));
      return;
    }
    
    this.#observer = new IntersectionObserver(this.#onIntersect, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.5,
    });
    this.#elements.forEach(el => this.#observer.observe(el));
  }
}

/* Initialize all modules after DOM is ready */
document.addEventListener('DOMContentLoaded', () => {
  // Header scroll effect
  new HeaderScroll('header').init();

  // Mobile navigation (hamburger)
  new MobileMenu('.nav-toggle', '.main-nav').init();

  // Smooth scrolling for internal anchors
  new SmoothScroll('a[href^="#"]').init();

  // Highlight nav items based on scroll position
  new ScrollSpy('section[id]', '.main-nav a, .nav-links a').init();

  // Lazy‑load images that use data-src attribute
  new LazyLoadImages('img[data-src]').init();

  // Intersection animations
  new IntersectionAnimations().init();

  // Course filtering
  new CourseFilter().init();

  // Course search (on courses page)
  new CourseSearch().init();

  // Counter animations for stats
  new CounterAnimation().init();

  // Lightbox for gallery pages
  new Lightbox('.gallery-grid').init();
  new Lightbox('.gallery').init();
});

/* Ripple effect for buttons (micro‑interaction) */
document.addEventListener('click', e => {
  const btn = e.target.closest('.btn, button, a');
  if (!btn) return;
  
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}, { passive: true });

/* Export for potential module usage (tree‑shakable) */
export {
  HeaderScroll,
  MobileMenu,
  SmoothScroll,
  ScrollSpy,
  LazyLoadImages,
  Lightbox,
  IntersectionAnimations,
  CourseFilter,
  CourseSearch,
  CounterAnimation,
};

/* Global function for course details toggle */
window.toggleDetails = toggleDetails;