/* Mac Precitec India Private Limited — measurement layer.
   The ONLY file that names an analytics vendor. Enabling Hotjar is a
   change to VENDORS below; no HTML file is ever touched.
   See claude/project-direction.md section 11. */
(function () {
  'use strict';

  var VENDORS = {
    // Cookieless, no personal data, so it runs without a consent gate.
    plausible: { enabled: true, scriptId: 'pa-0OH-Nn_N8DKyrq22voS1W', needsConsent: false },
    // Sets cookies and records sessions — consent required.
    hotjar:    { enabled: true, src: 'https://t.contentsquare.net/uxa/e3e9f1db3d1e3.js', needsConsent: true },
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
    // Queue/init shim, verbatim from Plausible's own issued snippet
    // (docs/plausible_installation.md) — needed before the script runs.
    window.plausible = window.plausible || function () { (plausible.q = plausible.q || []).push(arguments); };
    plausible.init = plausible.init || function (i) { plausible.o = i || {}; };
    plausible.init();
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://plausible.io/js/' + v.scriptId + '.js';
    document.head.appendChild(s);
  }

  function loadHotjar(v) {
    // Issued snippet is a single opaque async script — no inline config
    // object, so the site's identity lives entirely in the URL.
    var s = document.createElement('script');
    s.async = true;
    s.src = v.src;
    document.head.appendChild(s);
  }

  // Guards against loading twice — the consent banner (js/app.js) can call
  // mpiLoadVendors() right after Accept, and the load-event handler below
  // also calls it; either can run first.
  var loaded = {};
  function loadVendors() {
    var c = consent();
    Object.keys(VENDORS).forEach(function (k) {
      var v = VENDORS[k];
      if (!v.enabled || loaded[k]) return;
      if (v.needsConsent && c !== 'accepted') return;
      loaded[k] = true;
      if (k === 'plausible') loadPlausible(v);
      if (k === 'hotjar') loadHotjar(v);
    });
  }
  // Called by the consent banner right after Accept, so a consent-gated
  // vendor can start in the same session, not just the next.
  window.mpiLoadVendors = loadVendors;

  // Never before the load event; never before LCP.
  window.addEventListener('load', function () {
    if (window.requestIdleCallback) requestIdleCallback(loadVendors, { timeout: 3000 });
    else setTimeout(loadVendors, 2000);
  });
})();
