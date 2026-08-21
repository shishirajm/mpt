/* Mac Precitec India Private Limited — measurement layer.
   The ONLY file that names an analytics vendor. Enabling Hotjar is a
   change to VENDORS below; no HTML file is ever touched.
   See claude/project-direction.md section 11. */
(function () {
  'use strict';

  var VENDORS = {
    // Cookieless, no personal data, so it runs without a consent gate.
    plausible: { enabled: true, domain: 'macprecitecindia.com', needsConsent: false },
    // Sets cookies and records sessions — consent required.
    hotjar:    { enabled: false, siteId: null, needsConsent: true },
    clarity:   { enabled: false, projectId: null, needsConsent: true }
  };

  var CONSENT_COOKIE = 'mpi_consent';
  var queue = [];

  function consent() {
    var m = document.cookie.match(/(?:^|;\s*)mpi_consent=([^;]*)/);
    return m ? m[1] : null;
  }

  // Vendor-neutral. Call sites never know which tools are running.
  function track(event, props) {
    var base = document.body.dataset;
    var payload = Object.assign({ page: base.page, page_type: base.pageType }, props || {});
    if (VENDORS.plausible.enabled && window.plausible) window.plausible(event, { props: payload });
    if (VENDORS.hotjar.enabled && window.hj) window.hj('event', event);
    queue.push([event, payload]);
  }
  window.mpiTrack = track;

  // Delegated: every [data-hook] click is measured with no bespoke code.
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-hook]');
    if (el) track('element_click', { hook: el.dataset.hook,
      section: (el.closest('[data-section]') || {}).dataset ? el.closest('[data-section]').dataset.section : null });
  });

  // Conversion signals worth having from day one.
  var form = document.querySelector('[data-hook="rfq-form"]');
  if (form) {
    var started = false;
    form.addEventListener('input', function () {
      if (!started) { started = true; track('rfq_started'); }
    }, { once: false });
    form.addEventListener('submit', function () { track('rfq_submitted'); });
  }

  function loadPlausible(v) {
    var s = document.createElement('script');
    s.defer = true;
    s.src = 'https://plausible.io/js/script.js';
    s.setAttribute('data-domain', v.domain);
    document.head.appendChild(s);
  }

  function loadVendors() {
    var c = consent();
    Object.keys(VENDORS).forEach(function (k) {
      var v = VENDORS[k];
      if (!v.enabled) return;
      if (v.needsConsent && c !== 'accepted') return;
      // Hotjar/Clarity loaders follow the same pattern once enabled.
      if (k === 'plausible') loadPlausible(v);
    });
  }

  // Never before the load event; never before LCP.
  window.addEventListener('load', function () {
    if (window.requestIdleCallback) requestIdleCallback(loadVendors, { timeout: 3000 });
    else setTimeout(loadVendors, 2000);
  });
})();
