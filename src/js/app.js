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

  /* Photo lightbox (.lightbox, opened via CSS :target and stepped through
     via Prev/Next anchors — works without this script). Escape-to-close
     and the arrow-key shortcuts are the only things that need JS. */
  document.addEventListener('keydown', function (e) {
    var open = document.querySelector('.lightbox:target');
    if (!open) return;
    if (e.key === 'Escape') { location.hash = ''; }
    else if (e.key === 'ArrowLeft' && open.dataset.prev) { location.hash = open.dataset.prev; }
    else if (e.key === 'ArrowRight' && open.dataset.next) { location.hash = open.dataset.next; }
  });

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
