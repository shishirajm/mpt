/* Mac Precitec India Private Limited — interface behaviour.
   The site is fully functional without this file. */
(function () {
  'use strict';

  var check = document.getElementById('navcheck');
  if (check) {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && check.checked) { check.checked = false; check.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (check.checked && !e.target.closest('.site-head')) check.checked = false;
    });
  }

  /* Scroll-reveal: .reveal sections fade/slide up as they enter view.
     Content is fully visible without this script — the hidden state only
     applies once html.js is set, see .reveal in site.css. */
  document.documentElement.classList.add('js');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }
})();
