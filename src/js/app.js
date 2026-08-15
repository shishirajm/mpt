/* Mac Precitec India — interface behaviour.
   The site is fully functional without this file. */
(function () {
  'use strict';
  var check = document.getElementById('navcheck');
  if (!check) return;

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && check.checked) { check.checked = false; check.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (check.checked && !e.target.closest('.site-head')) check.checked = false;
  });
})();
