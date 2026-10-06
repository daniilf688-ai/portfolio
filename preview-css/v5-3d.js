/* Tilt для 3D-варианта — наклон карточек за курсором */
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isTouch) return;

  var selectors = '.skill-card, .exp-card, .project-card, .info-item';
  var cards = document.querySelectorAll(selectors);
  if (!cards.length) return;

  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      if (document.body.classList.contains('edit-mode')) return;
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--rx', (-py * 10).toFixed(2) + 'deg');
      card.style.setProperty('--ry', (px * 12).toFixed(2) + 'deg');
    });
    card.addEventListener('mouseleave', function () {
      card.style.removeProperty('--rx');
      card.style.removeProperty('--ry');
    });
  });
})();