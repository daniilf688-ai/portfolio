/* 3-стильный tilt для ВСЕХ кнопок + навигационных ссылок */
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isTouch) return;

  var selectors =
    '.btn, .theme-btn, .edit-btn, .burger, .add-item-btn, .delete-card-btn, .image-edit-btn, .mobile-nav a, .header .nav a';

  var buttons = Array.prototype.slice.call(document.querySelectorAll(selectors));
  if (!buttons.length) return;

  // Получаем стиль наклона (1=subtle, 2=medium, 3=strong)
function getStyle(el) {
    var styleAttr = (el.dataset && el.dataset.tiltStyle) || (document.documentElement && document.documentElement.getAttribute && document.documentElement.getAttribute('data-tilt-style'));
    var s = Number(styleAttr);
    if (s === 1 || s === 2 || s === 3) return s;
    return 2; // medium по умолчанию
  }

function coeffsForStyle(s) {
    // (ryMult, rxMult)
    if (s === 1) return { ry: 4, rx: 3 };   // subtle
    if (s === 2) return { ry: 9, rx: 7 };   // medium
    if (s === 3) return { ry: 16, rx: 12 }; // strong
    return { ry: 9, rx: 7 };
  }

  function onMove(e) {
    if (document.body.classList.contains('edit-mode')) return;
    var target = e.currentTarget;
    if (!target) return;
    var rect = target.getBoundingClientRect();
    var px = (e.clientX - rect.left) / rect.width - 0.5;
    var py = (e.clientY - rect.top) / rect.height - 0.5;
    var c = coeffsForStyle(getStyle(target));
    target.style.setProperty('--btn-ry', (px * c.ry).toFixed(2) + 'deg');
    target.style.setProperty('--btn-rx', (-py * c.rx).toFixed(2) + 'deg');
  }

  function onLeave(e) {
    var target = e.currentTarget;
    if (!target) return;
    target.style.removeProperty('--btn-ry');
    target.style.removeProperty('--btn-rx');
  }

  buttons.forEach(function (b) {
    b.addEventListener('mousemove', onMove, { passive: true });
    b.addEventListener('mouseleave', onLeave, { passive: true });
    b.addEventListener('blur', onLeave, { passive: true });
  });
})();