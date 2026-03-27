import './style.css'

// Check elements and setup animations
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Logic (if needed later)
  const navLinks = document.querySelectorAll('.nav-links a');
  
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe sections
  document.querySelectorAll('section').forEach(section => {
    // Add default hidden class if not already set by CSS
    if (!section.classList.contains('section-about') && !section.classList.contains('hero')) {
       // section.classList.add('scroll-hidden');
    }
    observer.observe(section);
  });

  // Modal Logic for Showcase
  const modal = document.getElementById('showcase-modal');
  const openModalBtn = document.getElementById('open-showcase-modal');
  const closeModalBtn = document.querySelector('.modal-close');
  const modalExploreBtn = document.getElementById('modal-explore');

  if (modal && openModalBtn && closeModalBtn) {
    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    openModalBtn.addEventListener('click', (e) => {
       e.preventDefault();
       modal.classList.add('active');
       document.body.style.overflow = 'hidden';
    });

    if (modalExploreBtn) {
      modalExploreBtn.addEventListener('click', () => {
        closeModal();
        const target = document.querySelector('#nuestros-agentes');
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    }

    closeModalBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Handle ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // Auto-show modal for first-time visitors
  const hasSeenModal = localStorage.getItem('hasSeenModal');
  if (!hasSeenModal) {
    setTimeout(() => {
      if (modal) {
        modal.classList.add('active');
        localStorage.setItem('hasSeenModal', 'true');
      }
    }, 5000);
  }

  // Logo marquee logic (optional, for smooth infinite scroll if native CSS isn't enough)
  /*
  const marquee = document.querySelector('.logo-track');
  if (marquee) {
    const content = marquee.innerHTML;
    marquee.innerHTML = content + content; // Duplicate for smooth loop
  }
  */

  // Scroll to anchor links smoothly
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- STICKY SCROLL LOGIC (FOR AUTOMATIZACIONES) ---
  const scrollItems = document.querySelectorAll('.scroll-item');
  const navItems = document.querySelectorAll('.scroll-nav-side .nav-item');
  const navFill = document.querySelector('.nav-progress-fill');

  if (scrollItems.length > 0) {
    const scrollObserverOptions = {
      threshold: 0.5,
      rootMargin: '-10% 0px -20% 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Remove active from all
          scrollItems.forEach(item => item.classList.remove('is-active'));
          navItems.forEach(nav => nav.classList.remove('active'));

          // Add active to current
          entry.target.classList.add('is-active');
          
          // Get Index
          const allItemsArray = Array.from(scrollItems);
          const index = allItemsArray.indexOf(entry.target);
          
          // Update Sidebar
          if (navItems[index]) {
            navItems[index].classList.add('active');
            // Update Fill Position
            if (navFill) {
              navFill.style.height = `${100 / scrollItems.length}%`;
              navFill.style.transform = `translateY(${index * 100}%)`;
            }
          }
        }
      });
    }, scrollObserverOptions);

    scrollItems.forEach(item => scrollObserver.observe(item));

    // Nav Item Clicks
    navItems.forEach((nav, index) => {
      nav.addEventListener('click', () => {
        scrollItems[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }

  // Parallax for Solution Backdrops
  window.addEventListener('scroll', () => {
    const backdrops = document.querySelectorAll('.solucion-backdrop');
    const scrollPos = window.pageYOffset;
    
    backdrops.forEach(backdrop => {
        const speed = 0.15;
        const rect = backdrop.parentElement.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const yPos = -(rect.top * speed);
            backdrop.style.transform = `translateY(calc(-50% + ${yPos}px))`;
        }
    });
  });
});

/* 3D CAROUSEL LOGIC */
function init3DCarousel() {
  const cards = document.querySelectorAll('.carousel-card');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  
  if (!cards.length) return;
  
  let currentIndex = 0;
  
  function updateCarousel() {
    cards.forEach((card, index) => {
      // Clean up classes
      card.classList.remove('active', 'prev', 'far-prev', 'next', 'far-next', 'hidden');
      
      // Calculate relative position with wrapping
      let rel = index - currentIndex;
      if (rel > Math.floor(cards.length / 2)) rel -= cards.length;
      if (rel < -Math.floor(cards.length / 2)) rel += cards.length;
      
      // Assign classes based on relative position
      if (rel === 0) card.classList.add('active');
      else if (rel === 1) card.classList.add('next');
      else if (rel === 2) card.classList.add('far-next');
      else if (rel === -1) card.classList.add('prev');
      else if (rel === -2) card.classList.add('far-prev');
      else card.classList.add('hidden');
    });
  }
  
  prevBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateCarousel();
  });
  
  nextBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % cards.length;
    updateCarousel();
  });

  // Tap to focus
  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });
  });

  // Initial update
  updateCarousel();
}

// Ensure init after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init3DCarousel);
} else {
  init3DCarousel();
}
