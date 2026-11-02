/* Videos de YouTube (02/11/2026). Los títulos ya vienen en el HTML (para buscadores).
   /videos.json lo deja el servidor NERON cada 30 min (neron-landing/videos.py) con el
   RSS público del canal; si trae otra lista, la fila se repinta (todo como texto).
   Si no hay archivo o viene roto, se queda la del HTML. Flechas y avance solo: movimiento.js. */
(function () {
  var pista = document.getElementById('videos-pista');
  if (!pista) return;
  var ID = /^[A-Za-z0-9_-]{11}$/;
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; }
  function tarjeta(v) {
    var li = document.createElement('li');
    var a = el('a', 'video'); a.href = 'https://www.youtube.com/watch?v=' + v.id; a.target = '_blank'; a.rel = 'noopener'; a.setAttribute('data-id', v.id);
    var marco = el('span', 'video__img'), img = document.createElement('img');
    img.src = '/videos/' + v.id + '.jpg'; img.alt = ''; img.width = 320; img.height = 180; img.loading = 'lazy'; img.decoding = 'async';
    marco.appendChild(img); var play = el('span', 'video__play'); play.setAttribute('aria-hidden', 'true'); marco.appendChild(play);
    a.appendChild(marco); a.appendChild(el('span', 'video__titulo', v.titulo)); li.appendChild(a); return li;
  }
  if (!window.fetch) return;
  fetch('/videos.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
    if (!d || !Array.isArray(d.videos)) return;
    var vs = d.videos.filter(function (v) { return v && ID.test(v.id) && typeof v.titulo === 'string' && v.titulo.trim(); }).slice(0, 12);
    if (!vs.length) return;
    var hay = [].map.call(pista.querySelectorAll('.video'), function (a) { return a.getAttribute('data-id') + '|' + a.textContent; }).join(',');
    var llega = vs.map(function (v) { return v.id + '|' + v.titulo.trim(); }).join(',');
    if (hay === llega) return;
    pista.textContent = '';
    vs.forEach(function (v) { v.titulo = v.titulo.trim().slice(0, 120); pista.appendChild(tarjeta(v)); });
    pista.dispatchEvent(new Event('carrusel:cambio'));
  }).catch(function () {});
})();
