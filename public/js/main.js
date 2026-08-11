(function () {
  'use strict';

  // Nav scroll state
  var header = document.getElementById('site-header');
  var SCROLL_THRESHOLD = 24;

  function updateHeaderState() {
    header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
  }
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  // Join form
  var form = document.getElementById('join-form');
  var confirmation = document.getElementById('join-confirmation');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    form.hidden = true;
    confirmation.hidden = false;
    confirmation.setAttribute('tabindex', '-1');
    confirmation.focus();
  });

  // Scroll reveal
  var revealTargets = document.querySelectorAll('[data-reveal]');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
  revealTargets.forEach(function (target) {
    revealObserver.observe(target);
  });

  // Hero parallax
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var heroImage = document.getElementById('hero-parallax');

  if (heroImage && !reduceMotion) {
    var ticking = false;
    var PARALLAX_RANGE = 60;

    function updateHeroParallax() {
      var offset = Math.min(window.scrollY, window.innerHeight) / window.innerHeight;
      heroImage.style.transform = 'translateY(' + (offset * PARALLAX_RANGE) + 'px)';
      ticking = false;
    }
    updateHeroParallax();
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateHeroParallax);
        ticking = true;
      }
    }, { passive: true });
  }
})();
