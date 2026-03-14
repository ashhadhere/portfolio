(() => {
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('#navMenu');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const revealItems = document.querySelectorAll('[data-reveal]');
  const sections = document.querySelectorAll('main section[id]');
  const scrollTopBtn = document.querySelector('#scrollTop');
  const year = document.querySelector('#year');

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const closeMenu = () => {
    if (!navMenu || !navToggle) {
      return;
    }
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('open');
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('scroll', () => {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 8);
    }
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('show', window.scrollY > 450);
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (revealItems.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  if (sections.length > 0 && navLinks.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', isActive);
          });
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  const contactForm = document.querySelector('#contactForm');
  const formFeedback = document.querySelector('#formFeedback');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      formFeedback.className = 'form-feedback';
      formFeedback.textContent = '';

      const formData = new FormData(contactForm);
      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const subject = String(formData.get('subject') || '').trim();
      const message = String(formData.get('message') || '').trim();
      const valid = name && emailPattern.test(email) && subject && message;

      if (!valid) {
        formFeedback.classList.add('error');
        formFeedback.textContent = 'Please complete all fields with a valid email.';
        return;
      }

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Submission failed');
        }

        contactForm.reset();
        formFeedback.classList.add('success');
        formFeedback.textContent = 'Thanks. Your message has been sent successfully.';
      } catch {
        formFeedback.classList.add('error');
        formFeedback.textContent = 'Something went wrong. Please try again in a moment.';
      }
    });
  }
})();