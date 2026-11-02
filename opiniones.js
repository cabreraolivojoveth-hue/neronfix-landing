/* Opiniones de Google en vivo (02/11/2026).
   /opiniones.json lo deja el servidor NERON cada 30 min (neron-landing/opiniones.py)
   con lo que entrega Google, tal cual. Si no hay archivo o no hay calificaciones,
   la línea NO se pinta: no se inventa nada. Todo se escribe como texto (sin HTML). */
(function () {
  var sec = document.getElementById('resenas');
  if (!sec || !window.fetch) return;
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; }
  function https(u) { return typeof u === 'string' && /^https:\/\//.test(u) ? u : ''; }
  function tarjeta(o) {
    var a = el('article', 'resena');
    var n = Math.max(1, Math.min(5, Math.round(+o.estrellas || 0)));
    var e = el('p', 'resena__est', '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n));
    e.setAttribute('aria-label', n + ' de 5');
    a.appendChild(e);
    if (o.texto) a.appendChild(el('p', 'resena__txt', o.texto));
    var pie = el('p', 'resena__pie');
    var perfil = https(o.perfil), quien = el(perfil ? 'a' : 'span', 'resena__autor', String(o.autor || 'Cliente de Google'));
    if (perfil) { quien.href = perfil; quien.target = '_blank'; quien.rel = 'noopener nofollow'; }
    pie.appendChild(quien);
    if (o.cuando) pie.appendChild(el('span', 'resena__cuando', ' · ' + o.cuando));
    a.appendChild(pie);
    return a;
  }
  fetch('/opiniones.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
    if (!d || !(+d.total > 0) || !(+d.promedio > 0)) return;
    var prom = Math.min(5, +d.promedio);
    document.getElementById('resenas-relleno').style.width = (prom / 5 * 100) + '%';
    document.getElementById('resenas-promedio').textContent = prom.toFixed(1);
    document.getElementById('resenas-total').textContent = '· ' + d.total + (+d.total === 1 ? ' calificación' : ' calificaciones');
    var nota = document.getElementById('resenas-nota');
    nota.setAttribute('aria-label', prom.toFixed(1) + ' de 5 en Google, ' + d.total + (+d.total === 1 ? ' calificación' : ' calificaciones') + '. Abrir en Google Maps');
    var mapa = https(d.mapa); if (mapa) { nota.href = mapa; document.getElementById('resenas-mapa').href = mapa; }
    var ops = (d.opiniones || []).filter(function (o) { return o && +o.estrellas > 0; });
    if (ops.length) {
      var cinta = document.getElementById('resenas-cinta'), pista = document.getElementById('resenas-pista');
      var lista = el('div', 'cinta__lista resenas__lista');
      ops.forEach(function (o) { lista.appendChild(tarjeta(o)); });
      pista.appendChild(lista);
      if (ops.length > 1) {
        var copia = lista.cloneNode(true); copia.setAttribute('aria-hidden', 'true');
        copia.querySelectorAll('a').forEach(function (a) { a.tabIndex = -1; });
        pista.appendChild(copia);
        pista.style.animationDuration = (ops.length * 9) + 's';
      } else { cinta.classList.add('resenas__cinta--quieta'); }
      cinta.hidden = false;
    }
    sec.hidden = false;
  }).catch(function () {});
})();
