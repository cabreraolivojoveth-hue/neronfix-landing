/* ==========================================================================
   NERON · Buscador del Centro de ayuda
   Filtra las tarjetas de tema en tiempo real, sin recargar la página.
   ========================================================================== */
(function (d) {
  'use strict';

  var input = d.getElementById('buscador');
  var grid = d.getElementById('grid');
  var empty = d.getElementById('noMatch');
  if (!input || !grid || !empty) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.cat'));

  /* Ignora acentos y mayúsculas para que "facturacion" encuentre "Facturación". */
  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  var index = cards.map(function (c) {
    return norm((c.getAttribute('data-cat') || '') + ' ' + c.textContent);
  });

  function filtrar() {
    var q = norm(input.value.trim());
    var visibles = 0;
    cards.forEach(function (c, i) {
      var ok = !q || index[i].indexOf(q) !== -1;
      c.hidden = !ok;
      if (ok) visibles++;
    });
    empty.classList.toggle('is-visible', visibles === 0);
  }

  input.addEventListener('input', filtrar);
  input.addEventListener('search', filtrar);
  filtrar();
})(document);
