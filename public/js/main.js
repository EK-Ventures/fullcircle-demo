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
})();
