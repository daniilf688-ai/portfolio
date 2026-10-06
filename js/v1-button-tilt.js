/* 1-TILT: кнопки наклоняются в сторону мышки (style 3 по умолчанию).
   Слушатели делегированы на document, поэтому работают и для кнопок
   в карточках, добавленных после загрузки страницы. */
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isTouch) return;

  var selectors =
    '.btn, .theme-btn, .edit-btn, .burger, .add-item-btn, .delete-card-btn, .image-edit-btn, .mobile-nav a';

  function findButton(el) {
    if (!el || typeof el.closest !== 'function') return null;
    return el.closest(selectors);
  }

  function getStyle(el) {
    var styleAttr = (el.dataset && el.dataset.tiltStyle) || (document.documentElement && document.documentElement.getAttribute && document.documentElement.getAttribute('data-tilt-style'));
    var s = Number(styleAttr);
    if (s === 1 || s === 2 || s === 3) return s;
    return 3; // strong по умолчанию
  }

  function coeffsForStyle(s) {
    if (s === 1) return { ry: 4, rx: 3 };
    if (s === 2) return { ry: 9, rx: 7 };
    if (s === 3) return { ry: 22, rx: 16 };
    return { ry: 22, rx: 16 };
  }

  function resetTilt(target) {
    target.style.removeProperty('--btn-ry');
    target.style.removeProperty('--btn-rx');
  }

  function onMove(e) {
    var target = findButton(e.target);
    if (!target) return;
    if (document.body.classList.contains('edit-mode')) {
      resetTilt(target); // в режиме редактирования наклон не нужен
      return;
    }
    var rect = target.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    var px = (e.clientX - rect.left) / rect.width - 0.5;
    var py = (e.clientY - rect.top) / rect.height - 0.5;
    var c = coeffsForStyle(getStyle(target));
    target.style.setProperty('--btn-ry', (px * c.ry).toFixed(2) + 'deg');
    target.style.setProperty('--btn-rx', (-py * c.rx).toFixed(2) + 'deg');
  }

  function onLeave(e) {
    var target = findButton(e.target);
    if (!target) return;
    // курсор всё ещё внутри этого же элемента (переход между детьми) — не сбрасываем
    if (e.relatedTarget && target.contains(e.relatedTarget)) return;
    resetTilt(target);
  }

  document.addEventListener('mousemove', onMove, { passive: true });
  document.addEventListener('mouseout', onLeave, { passive: true });
})();
