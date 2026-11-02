/* Movimiento de la página (02/11/2026, pedido de Joveth): «más limpio, no exagerado».
   1. Aparecer al bajar: SOLO lo que está abajo de la pantalla al cargar se esconde
      (nada parpadea) y entra escalonado: opacidad + 12px, 450 ms, sin rebote.
   2. Carruseles: planes (puntitos + flechas con ratón; arranca en el Recomendado) y
      videos (flechas con ratón; avanza solo una tarjeta cada 4.5 s y regresa al inicio).
      El de videos se detiene al tocarlo, al pasar el ratón, con foco de teclado, fuera
      de pantalla o con la pestaña oculta; sigue 4 s después de soltar.
   Con «reducir movimiento» nada aparece ni avanza solo: todo se mueve con el dedo o flechas.
   Sin este archivo la página se ve completa y los carruseles se deslizan con el dedo. */
(function () {
  var mm = function (q) { return window.matchMedia ? matchMedia(q) : { matches: false } };
  var reduce = mm('(prefers-reduced-motion: reduce)');
  var raton = mm('(hover: hover) and (pointer: fine)').matches;
  var suave = function () { return reduce.matches ? 'auto' : 'smooth' };

  /* ── 1. Aparecer al bajar ── */
  if (!reduce.matches && 'IntersectionObserver' in window) {
    var abajo = [].filter.call(document.querySelectorAll('.rv'), function (e) {
      var r = e.getBoundingClientRect(); return r.height > 0 && r.top > innerHeight;
    });
    var io = new IntersectionObserver(function (es) {
      var llegan = es.filter(function (x) { return x.isIntersecting }).map(function (x) { return x.target });
      llegan.sort(function (a, b) { var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(); return (ra.top - rb.top) || (ra.left - rb.left) });
      llegan.forEach(function (e, i) {
        io.unobserve(e);
        e.style.transitionDelay = Math.min(i, 4) * 70 + 'ms';
        e.classList.add('rv-entra'); e.classList.remove('rv-espera');
        setTimeout(function () { e.classList.remove('rv-entra'); e.style.transitionDelay = '' }, 450 + Math.min(i, 4) * 70 + 100);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    abajo.forEach(function (e) { e.classList.add('rv-espera'); io.observe(e) });
  }

  /* ── 2. Carruseles ── */
  function carrusel(pista, o) {
    if (!pista) return null;
    var cosas = function () { return [].slice.call(pista.children).filter(function (e) { return e.offsetWidth > 0 }) };
    var pad = function () { return parseFloat(getComputedStyle(pista).scrollPaddingLeft) || 0 };
    // Dónde queda cada tarjeta según cómo se acomoda (al centro o al inicio)
    var lugar = function (e) {
      var x = o.centro ? e.offsetLeft + e.offsetWidth / 2 - pista.clientWidth / 2 : e.offsetLeft - pad();
      return Math.max(0, Math.min(x, pista.scrollWidth - pista.clientWidth));
    };
    var cual = function () {
      var c = cosas(), m = 0, d = Infinity;
      c.forEach(function (e, i) { var k = Math.abs(lugar(e) - pista.scrollLeft); if (k < d) { d = k; m = i } });
      return m;
    };
    var ir = function (i, como) { var c = cosas(); if (!c.length) return; i = Math.max(0, Math.min(i, c.length - 1)); pista.scrollTo({ left: lugar(c[i]), behavior: como || suave() }) };
    var puntos = o.puntos ? [] : null;
    function pintarPuntos() {
      if (!o.puntos) return;
      o.puntos.textContent = ''; puntos = [];
      cosas().forEach(function (e, i) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'punto';
        var n = e.querySelector('h3'); b.setAttribute('aria-label', 'Ver ' + (n ? 'plan ' + n.textContent.trim() : 'tarjeta ' + (i + 1)));
        b.addEventListener('click', function () { ir(i) });
        o.puntos.appendChild(b); puntos.push(b);
      });
    }
    function estado() {
      var fin = pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 2;
      if (o.antes) { o.antes.disabled = pista.scrollLeft <= 2; o.despues.disabled = fin }
      if (puntos) { var a = cual(); puntos.forEach(function (b, i) { b.setAttribute('aria-current', i === a ? 'true' : 'false') }) }
    }
    var pendiente = false;
    pista.addEventListener('scroll', function () { if (pendiente) return; pendiente = true; requestAnimationFrame(function () { pendiente = false; estado() }) }, { passive: true });
    window.addEventListener('resize', estado, { passive: true });
    if (o.antes && raton) {
      o.caja.classList.add('flechas--si');
      o.antes.addEventListener('click', function () { o.pagina ? pista.scrollBy({ left: -pista.clientWidth * 0.85, behavior: suave() }) : ir(cual() - 1) });
      o.despues.addEventListener('click', function () { o.pagina ? pista.scrollBy({ left: pista.clientWidth * 0.85, behavior: suave() }) : ir(cual() + 1) });
    }
    pintarPuntos();
    pista.addEventListener('carrusel:cambio', function () { pintarPuntos(); estado() });
    estado();
    return { ir: ir, cual: cual, cosas: cosas, lugar: lugar, estado: estado };
  }

  // Planes: arranca con el Recomendado a la vista (sin mover la página hacia abajo)
  var planes = carrusel(document.getElementById('planes-pista'), {
    centro: true, caja: document.getElementById('planes-ctrl'), puntos: document.getElementById('planes-puntos'),
    antes: document.getElementById('planes-antes'), despues: document.getElementById('planes-despues')
  });
  if (planes) {
    var p = document.getElementById('planes-pista'), rec = p.querySelector('.plan--rec');
    if (rec && p.scrollWidth > p.clientWidth) { p.scrollLeft = planes.lugar(rec); planes.estado() }
  }

  // Videos: flechas como antes (una «página» por clic) y avance solo
  var vp = document.getElementById('videos-pista');
  var videos = carrusel(vp, {
    pagina: true, caja: document.getElementById('videos-flechas'),
    antes: document.getElementById('videos-antes'), despues: document.getElementById('videos-despues')
  });
  if (!videos) return;
  var INTERVALO = 4500, ESPERA = 4000;
  var zona = [vp.parentNode, document.getElementById('videos-flechas')].filter(Boolean);
  var pausa = { raton: 0, dedo: 0, foco: 0 }, visible = false, prox = 0, reloj = 0;
  var marca = function (t) { vp.setAttribute('data-auto', t) };
  var libre = function () { return visible && !document.hidden && !pausa.raton && !pausa.dedo && !pausa.foco };
  var esperar = function (ms) { prox = Math.max(prox, Date.now() + ms) };
  function paso() {
    if (reduce.matches) { marca('quieto'); return parar() }
    if (vp.scrollWidth <= vp.clientWidth + 2) { marca('cabe'); return }
    if (!libre()) { marca('pausa'); prox = Math.max(prox, Date.now() + ESPERA); return }
    marca('corre');
    if (Date.now() < prox) return;
    prox = Date.now() + INTERVALO;
    var c = videos.cosas(), i = videos.cual();
    if (vp.scrollLeft + vp.clientWidth >= vp.scrollWidth - 2 || i >= c.length - 1) vp.scrollTo({ left: 0, behavior: 'smooth' });
    else videos.ir(i + 1, 'smooth');
  }
  function arrancar() { if (!reloj && !reduce.matches) { reloj = setInterval(paso, 250); paso() } }
  function parar() { if (reloj) { clearInterval(reloj); reloj = 0 } }
  zona.forEach(function (z) {
    z.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') pausa.raton++ });
    z.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { pausa.raton = Math.max(0, pausa.raton - 1); esperar(ESPERA) } });
    z.addEventListener('focusin', function (e) { var t = e.target; try { if (t.matches(':focus-visible')) pausa.foco = 1 } catch (x) { pausa.foco = 1 } });
    z.addEventListener('focusout', function (e) { if (!zona.some(function (k) { return k.contains(e.relatedTarget) })) { pausa.foco = 0; esperar(ESPERA) } });
  });
  vp.addEventListener('touchstart', function () { pausa.dedo = 1 }, { passive: true });
  var soltar = function () { pausa.dedo = 0; esperar(ESPERA) };
  vp.addEventListener('touchend', soltar, { passive: true }); vp.addEventListener('touchcancel', soltar, { passive: true });
  vp.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') pausa.dedo = 1 });
  vp.addEventListener('pointerup', function (e) { if (e.pointerType !== 'mouse') soltar() });
  vp.addEventListener('wheel', function () { esperar(ESPERA) }, { passive: true });
  vp.addEventListener('keydown', function () { esperar(ESPERA) });
  document.addEventListener('visibilitychange', function () { esperar(ESPERA) });
  if (reduce.addEventListener) reduce.addEventListener('change', function () { if (reduce.matches) { parar(); marca('quieto') } else if (visible) arrancar() });
  if (reduce.matches) { marca('quieto'); return }
  marca('pausa');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      visible = es[es.length - 1].isIntersecting;
      if (visible) { prox = Date.now() + INTERVALO; arrancar() } else { parar(); marca('pausa') }
    }, { threshold: 0.4 }).observe(vp);
  } else { visible = true; prox = Date.now() + INTERVALO; arrancar() }
})();
