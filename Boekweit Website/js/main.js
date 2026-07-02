// Boekweit Transport — shared front-end behaviour
document.addEventListener('DOMContentLoaded', () => {

  /* ---- Sticky header shadow ---- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Mobile nav ---- */
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileClose = document.querySelector('.mobile-nav-close');
  const mobileBackdrop = document.querySelector('.mobile-nav-backdrop');
  const openMobileNav = () => { mobileNav?.classList.add('is-open'); document.body.style.overflow = 'hidden'; };
  const closeMobileNav = () => { mobileNav?.classList.remove('is-open'); document.body.style.overflow = ''; };
  navToggle?.addEventListener('click', openMobileNav);
  mobileClose?.addEventListener('click', closeMobileNav);
  mobileBackdrop?.addEventListener('click', closeMobileNav);

  document.querySelectorAll('.mobile-nav li.has-sub > a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      link.closest('li').classList.toggle('is-open');
    });
  });

  /* ---- Hero slider ---- */
  const hero = document.querySelector('.hero');
  if (hero) {
    const slides = [...hero.querySelectorAll('.hero-slide')];
    const dots = [...hero.querySelectorAll('.hero-dots button')];
    let active = 0;
    let timer;

    const show = (index) => {
      slides[active]?.classList.remove('is-active');
      dots[active]?.classList.remove('is-active');
      active = (index + slides.length) % slides.length;
      slides[active].classList.add('is-active');
      dots[active]?.classList.add('is-active');
    };

    const next = () => show(active + 1);

    const startTimer = () => { timer = setInterval(next, 6000); };
    const stopTimer = () => clearInterval(timer);

    dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); stopTimer(); startTimer(); }));
    hero.addEventListener('mouseenter', stopTimer);
    hero.addEventListener('mouseleave', startTimer);

    if (slides.length > 1) startTimer();
  }

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---- Animated counters ---- */
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const animateCount = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target % 1 === 0 ? Math.round(target * eased) : (target * eased).toFixed(1);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cio.observe(el));
  }

  /* ---- Back to top ---- */
  const toTop = document.querySelector('.to-top');
  if (toTop) {
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('is-visible', window.scrollY > 500);
    }, { passive: true });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---- Cookie banner ---- */
  const cookieBanner = document.querySelector('.cookie-banner');
  if (cookieBanner) {
    if (!localStorage.getItem('bt_cookie_ok')) {
      setTimeout(() => cookieBanner.classList.add('is-visible'), 900);
    }
    cookieBanner.querySelector('[data-accept]')?.addEventListener('click', () => {
      localStorage.setItem('bt_cookie_ok', '1');
      cookieBanner.classList.remove('is-visible');
    });
  }

});
