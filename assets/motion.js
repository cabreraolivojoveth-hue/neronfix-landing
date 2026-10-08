/* ==========================================================================
   NERON · Capa de movimiento (GSAP + ScrollTrigger)
   --------------------------------------------------------------------------
   Mejora progresiva sobre la landing existente: no cambia contenido, rutas ni
   SEO. Si GSAP no carga, si algo falla o si el usuario pidió "reducir
   movimiento", la página queda en su estado final y completa.

   Reglas de rendimiento: sólo transform / opacity (y las propiedades
   individuales translate / scale con variables CSS), will-change únicamente
   donde hace falta, ScrollTrigger con matchMedia y nada de scroll-jacking: la
   sección "del desorden al control" se fija con position:sticky de CSS, el
   scroll nunca se secuestra.
   ========================================================================== */
(function (w, d) {
  'use strict';

  var U = w.NeronUI, C = w.NERON_CONFIG, g = w.gsap, ST = w.ScrollTrigger;
  var root = d.documentElement;
  if (!U || !C || !g || !ST) return;               /* sin GSAP: se queda como estaba */

  var $ = U.$, $$ = U.$$;
  var M = C.MOTION || {};

  /* ---- Movimiento reducido: composición final, sin animar nada --------- */
  if (U.reduced) {
    root.classList.add('motion-static');
    buildHeroCards();            /* quedan visibles y quietas */
    buildFlows();
    return;
  }

  g.registerPlugin(ST);
  ST.config({ ignoreMobileResize: true });
  root.classList.add('has-motion');

  /* Si algo no termina de montarse, todo vuelve a verse (nunca se queda oculto). */
  var guard = setTimeout(function () { root.classList.add('motion-fail'); }, 4500);

  var EASE = 'power3.out';
  var fine = w.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ------------------------------------------------------------ UTILES -- */
  function unrv(el) { if (el) el.classList.remove('rv', 'rv--scale'); }
  function mo(el) { if (el) el.setAttribute('data-mo', ''); }

  /* Parte un texto en palabras envueltas en una máscara, sin perder <em> ni
     <br>; el texto sigue siendo texto real (lectores de pantalla y SEO). */
  function splitWords(el) {
    var out = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = d.createDocumentFragment();
          n.nodeValue.split(/(\s+)/).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(d.createTextNode(p)); return; }
            var o = d.createElement('span'); o.className = 'mw';
            var i = d.createElement('span'); i.className = 'mw__i'; i.textContent = p;
            o.appendChild(i); frag.appendChild(o); out.push(i);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') { walk(n); }
      });
    })(el);
    return out;
  }

  /* ------------------------------------------------------ PROGRESO ------ */
  function buildProgress() {
    var bar = d.createElement('div');
    bar.className = 'mprog'; bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = '<i></i>';
    d.body.appendChild(bar);
    g.to($('i', bar), { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } });
  }

  /* --------------------------------------------- HERO · piezas flotantes -- */
  function buildHeroCards() {
    var host = $('#mockup');
    if (!host || !M.heroCards || $('.fx', host)) return;
    var cls = ['a', 'b', 'c', 'd'];
    host.insertAdjacentHTML('beforeend', M.heroCards.slice(0, 4).map(function (c, i) {
      return '<div class="fx fx--' + cls[i] + '" aria-hidden="true"><div class="fx__in" style="--fd:-' + (i * 1.3) + 's">' +
        '<span class="fx__ic">' + U.icon(c.icon) + '</span>' +
        '<span><b>' + U.esc(c.title) + '</b><small>' + U.esc(c.sub) + '</small></span></div></div>';
    }).join(''));
  }

  /* -------------------------------------------------------------- HERO -- */
  function buildHero() {
    var hero = $('#inicio');
    if (!hero) return;
    buildHeroCards();

    var badge = $('.hero__badge'), h1 = $('.hero h1'), lead = $('.hero .lead');
    var ctas = $$('.hero__cta .btn'), mock = $('#mockup'), fx = $$('.fx', hero);
    var textCol = $('.hero__grid > div:first-child');
    [badge, h1, lead, mock].forEach(function (n) { unrv(n); mo(n); });
    ctas.forEach(mo); fx.forEach(mo);

    var words = splitWords(h1);
    g.set(words, { yPercent: 118 });
    g.set([badge, lead], { opacity: 0, y: 22 });
    g.set(ctas, { opacity: 0, y: 22 });
    g.set(mock, { opacity: 0, y: 46, scale: 0.955, transformOrigin: '50% 60%' });
    g.set(fx, { opacity: 0, y: 24, scale: 0.88 });

    /* Entrada cinematográfica al cargar */
    var tl = g.timeline({ defaults: { ease: EASE }, delay: 0.1 });
    tl.to(badge, { opacity: 1, y: 0, duration: 0.8 }, 0)
      .to(words, { yPercent: 0, duration: 1.15, stagger: 0.075, ease: 'expo.out' }, 0.18)
      .to(lead, { opacity: 1, y: 0, duration: 0.9 }, 0.75)
      .to(ctas, { opacity: 1, y: 0, duration: 0.8, stagger: 0.09 }, 0.95)
      .to(mock, { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: 'expo.out' }, 0.45)
      .to(fx, { opacity: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.12, ease: 'back.out(1.5)' }, 1.15)
      .call(function () { clearTimeout(guard); });

    /* Parallax con el cursor (sólo escritorio con mouse) */
    if (fine) {
      var layers = [
        { el: $('.mock__halo', hero), d: 10 },
        { el: $('.mock__laptop', hero), d: 18 },
        { el: $('.mock__phone', hero), d: 38 },
      ].concat($$('.fx__in', hero).map(function (el, i) { return { el: el, d: 24 + i * 9 }; }))
        .filter(function (l) { return l.el; });
      var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
      var tick = function () {
        cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
        layers.forEach(function (l) {
          l.el.style.setProperty('--tx', (-cx * l.d).toFixed(2) + 'px');
          l.el.style.setProperty('--ty', (-cy * l.d).toFixed(2) + 'px');
        });
        raf = (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) ? requestAnimationFrame(tick) : 0;
      };
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width - 0.5;
        ty = (e.clientY - r.top) / r.height - 0.5;
        if (!raf) raf = requestAnimationFrame(tick);
      });
      hero.addEventListener('pointerleave', function () { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(tick); });
    }

    /* Al bajar, el hero se desarma: las piezas son absorbidas por el panel */
    var scrub = g.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 28%', scrub: 0.6, invalidateOnRefresh: true },
    });
    scrub.to(textCol, { y: -46, opacity: 0.15 }, 0)
      .to(mock, { '--sy': '-34px', '--ss': 0.92 }, 0)
      .to(fx, {
        x: function (i, el) { var m = mock.getBoundingClientRect(), r = el.getBoundingClientRect(); return (m.left + m.width / 2) - (r.left + r.width / 2); },
        y: function (i, el) { var m = mock.getBoundingClientRect(), r = el.getBoundingClientRect(); return (m.top + m.height / 2) - (r.top + r.height / 2); },
        scale: 0.35, opacity: 0, stagger: 0.04,
      }, 0.05)
      .to($$('.deco__glow', hero), { opacity: 0.25 }, 0);
  }

  /* ------------------------------------------------ ENCABEZADOS DE SECCIÓN -- */
  function buildHeads() {
    $$('.sec-head').forEach(function (head) {
      var eyebrow = $('.eyebrow', head), h2 = $('h2', head), p = $('p', head);
      unrv(head);
      var words = h2 ? splitWords(h2) : [];
      var rest = [eyebrow, p].filter(Boolean);
      mo(h2); rest.forEach(mo);
      g.set(words, { yPercent: 118 });
      g.set(rest, { opacity: 0, y: 20 });
      ST.create({
        trigger: head, start: 'top 86%', once: true,
        onEnter: function () {
          g.timeline({ defaults: { ease: EASE } })
            .to(eyebrow, { opacity: 1, y: 0, duration: 0.7 }, 0)
            .to(words, { yPercent: 0, duration: 1, stagger: 0.06, ease: 'expo.out' }, 0.05)
            .to(p, { opacity: 1, y: 0, duration: 0.8 }, 0.35);
        },
      });
    });
  }

  /* ---------------------------------------------- SISTEMAS · tarjetas ---- */
  function buildFlows() {
    var flows = M.flujos || {};
    $$('.sys').forEach(function (card) {
      var id = (card.id || '').replace('sistema-', '');
      var steps = flows[id];
      var host = $('.sys__desc', card);
      if (!steps || !host || $('.sys__flow', card)) return;
      host.insertAdjacentHTML('afterend',
        '<ol class="sys__flow" aria-hidden="true">' + steps.map(function (s) { return '<li>' + U.esc(s) + '</li>'; }).join('') + '</ol>' +
        '<div class="sys__flow-bar" aria-hidden="true"><i></i></div>');
    });
  }

  function buildSystems() {
    buildFlows();
    var cards = $$('.sys');
    if (!cards.length) return;

    cards.forEach(function (card) { unrv(card); mo(card); });
    g.set(cards, { opacity: 0, y: 72 });
    cards.forEach(function (card) {
      var media = $('.sys__media', card);
      if (media) g.set(media.firstElementChild, { scale: 1.18, transformOrigin: '50% 50%' });
    });

    ST.batch(cards, {
      start: 'top 90%', once: true,
      onEnter: function (batch) {
        g.to(batch, {
          opacity: 1, y: 0, duration: 1, stagger: 0.14, ease: EASE, clearProps: 'opacity,transform',
        });
        batch.forEach(function (card, i) {
          var media = $('.sys__media', card);
          if (media && media.firstElementChild) {
            g.to(media.firstElementChild, { scale: 1, duration: 1.6, delay: i * 0.14, ease: 'expo.out' });
          }
        });
      },
    });

    /* Recorrido contextual: hover/foco en escritorio, al entrar al centro en touch */
    cards.forEach(function (card) {
      var chips = $$('.sys__flow li', card), bar = $('.sys__flow-bar i', card);
      if (!chips.length) return;
      var tl = g.timeline({ paused: true, repeat: -1, repeatDelay: 0.9 });
      chips.forEach(function (chip, i) {
        tl.call(function () {
          chips.forEach(function (c, j) {
            c.classList.toggle('is-on', j === i);
            c.classList.toggle('is-past', j < i);
          });
        }, null, i * 0.55);
      });
      tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: chips.length * 0.55, ease: 'none' }, 0);
      tl.call(function () { chips.forEach(function (c) { c.classList.remove('is-on'); c.classList.add('is-past'); }); }, null, chips.length * 0.55 + 0.2);

      function start() { tl.restart(); }
      function stop() {
        tl.pause(0);
        chips.forEach(function (c) { c.classList.remove('is-on', 'is-past'); });
        g.set(bar, { scaleX: 0 });
      }
      if (fine) {
        card.addEventListener('pointerenter', start);
        card.addEventListener('pointerleave', stop);
      } else {
        /* Touch: una pasada al llegar al centro de la pantalla y otra con cada toque */
        ST.create({ trigger: card, start: 'top 55%', once: true, onEnter: function () { tl.repeat(0).restart(); } });
        card.addEventListener('click', function (e) { if (!e.target.closest('a,button')) tl.repeat(0).restart(); });
      }
      card.addEventListener('focusin', start);
      card.addEventListener('focusout', function (e) { if (!card.contains(e.relatedTarget)) stop(); });
    });
  }

  /* ----------------------------------------------- ECOSISTEMA (Neron One) -- */
  function buildEco() {
    var map = $('.eco__mapa');
    if (!map) return;
    var nodes = $$('.eco__nodo', map), lines = $$('.eco__linea', map), core = $('.eco__centro', map), dest = $('.eco__destino', map);
    var parts = nodes.concat([core, dest]);
    mo(map);
    g.set(parts, { opacity: 0, y: 24 });
    g.set(lines, { scaleY: 0, transformOrigin: '50% 0%' });
    ST.create({
      trigger: map, start: 'top 80%', once: true,
      onEnter: function () {
        g.timeline({ defaults: { ease: EASE } })
          .to(nodes, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, 0)
          .to(lines[0], { scaleY: 1, duration: 0.6 }, 0.45)
          .to(core, { opacity: 1, y: 0, duration: 0.8 }, 0.7)
          .to(lines[1], { scaleY: 1, duration: 0.6 }, 1.0)
          .to(dest, { opacity: 1, y: 0, duration: 0.8 }, 1.25);
      },
    });
  }

  /* ----------------------------------------- DEL DESORDEN AL CONTROL ------ */
  function buildOrden() {
    var sec = $('#orden'), stage = $('.orden__stage');
    if (!sec || !stage) return;
    var mods = $$('.mod', stage), chips = $$('.nz', stage), lines = $$('.orden__lines path', stage), hub = $$('.orden__hub, .orden__cap', stage);
    var tick = $('.tick span', stage), rows = $$('.row', stage), fill = $('.tl__fill', stage), nodes = $$('.tl__n', stage);
    var bars = $$('.bars i', stage), skels = $$('.mod--venta .sk', stage), tickIc = $('.tick .ic', stage);
    mo(stage);

    function build() {
      var step = rows.length > 1 ? rows[1].offsetTop - rows[0].offsetTop : 32;
      var chaos = [
        { xPercent: -12, yPercent: -9, rotation: -7 }, { xPercent: 13, yPercent: -5, rotation: 6 },
        { xPercent: -7, yPercent: 12, rotation: 5 }, { xPercent: 10, yPercent: 9, rotation: -6 },
      ];
      mods.forEach(function (m, i) { g.set(m, Object.assign({ scale: 0.93, opacity: 0.9 }, chaos[i])); });
      g.set(chips, { opacity: 1, rotation: function (i) { return [-8, 7, 6, -5][i]; } });
      g.set(lines, { strokeDashoffset: 1 });
      g.set(hub, { opacity: 0, scale: 0.7 });
      g.set(tick, { opacity: 0, scale: 0.7, y: 8 });
      g.set(skels, { scaleX: 0.25 });
      g.set(bars, { scaleY: 0.08 });
      g.set(fill, { scale: '0 1' });
      nodes.forEach(function (n) { n.classList.remove('is-done'); });
      var perm = [2, -1, 1, -2];                               /* orden desordenado de las filas */
      g.set(rows, { y: function (i) { return perm[i] * step; } });

      var tl = g.timeline({ paused: true, defaults: { ease: 'power2.inOut' } });
      /* 1 · el ruido converge al centro y desaparece */
      tl.to(chips, {
        x: function (i, el) { var s = stage.getBoundingClientRect(), r = el.getBoundingClientRect(); return (s.left + s.width / 2) - (r.left + r.width / 2); },
        y: function (i, el) { var s = stage.getBoundingClientRect(), r = el.getBoundingClientRect(); return (s.top + s.height / 2) - (r.top + r.height / 2); },
        scale: 0.3, opacity: 0, rotation: 0, duration: 0.42, stagger: 0.04, ease: 'power3.in',
      }, 0);
      /* 2 · los módulos se acomodan */
      tl.to(mods, { xPercent: 0, yPercent: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.42, stagger: 0.05, ease: 'power3.out' }, 0.14);
      /* 3 · líneas de conexión y nodo central */
      tl.to(lines, { strokeDashoffset: 0, duration: 0.2, stagger: 0.03 }, 0.5);
      tl.to(hub, { opacity: 1, scale: 1, duration: 0.16, ease: 'back.out(2)' }, 0.56);
      /* 4 · cada módulo cobra vida */
      tl.to(skels, { scaleX: 1, duration: 0.14, stagger: 0.04 }, 0.6);
      tl.to(tick, { opacity: 1, scale: 1, y: 0, duration: 0.14, ease: 'back.out(2.4)' }, 0.72);
      tl.to(rows, { y: 0, duration: 0.22, stagger: 0.03, ease: 'power3.inOut' }, 0.62);
      tl.to(fill, { scale: '0.72 1', duration: 0.24, ease: 'none' }, 0.66);
      nodes.slice(0, 3).forEach(function (n, i) { tl.call(function () { n.classList.add('is-done'); }, null, 0.7 + i * 0.08); });
      tl.to(bars, { scaleY: 1, duration: 0.2, stagger: 0.03, ease: 'back.out(1.4)' }, 0.72);
      return tl;
    }

    var mm = g.matchMedia();
    mm.add('(min-width: 961px)', function () {
      var tl = build();
      ST.create({
        trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.7, animation: tl,
        invalidateOnRefresh: true,
      });
      return function () { tl.kill(); };
    });
    mm.add('(max-width: 960px)', function () {
      var tl = build();
      tl.duration(2.4);
      ST.create({ trigger: stage, start: 'top 72%', once: true, onEnter: function () { tl.play(0); } });
      return function () { tl.kill(); };
    });
  }

  /* --------------------------------------------------------- PLANES ------ */
  function buildPlans() {
    var host = $('#plans');
    if (!host) return;
    var seen = false, busy = false;

    function cardsOf() { return $$('.plan', host); }
    function lit() { var f = $('.plan--featured', host); if (f) f.classList.add('is-lit'); }

    function hidePrepare() {
      cardsOf().forEach(function (c) { unrv(c); mo(c); c.classList.remove('is-lit'); });
      g.set(cardsOf(), { opacity: 0, y: 44 });
    }
    function reveal() {
      var cards = cardsOf();
      if (!cards.length) return;
      busy = true;
      g.to(cards, {
        opacity: 1, y: 0, duration: 0.85, stagger: 0.12, ease: EASE, clearProps: 'opacity,transform',
        onComplete: function () { busy = false; lit(); },
      });
    }

    hidePrepare();
    ST.create({ trigger: host, start: 'top 85%', once: true, onEnter: function () { seen = true; reveal(); } });

    /* Al cambiar de sistema o de forma de pago se vuelven a dibujar: entrada breve */
    new MutationObserver(function () {
      if (busy) return;
      hidePrepare();
      if (seen) { g.delayedCall(0.02, function () { reveal(); }); }
    }).observe(host, { childList: true });
  }

  /* ------------------------------------------------------------ FAQ ------ */
  function buildFaq() {
    var host = $('#faq-list');
    if (!host) return;
    host.addEventListener('click', function (e) {
      var q = e.target.closest('.faq__q');
      if (!q) return;
      if (q.getAttribute('aria-expanded') !== 'true') return;
      /* Si la respuesta queda fuera de la pantalla, se acerca con suavidad. */
      setTimeout(function () {
        var panel = q.nextElementSibling;
        var bottom = panel.getBoundingClientRect().bottom + panel.scrollHeight;
        var over = bottom - (w.innerHeight - 24);
        if (over > 0) w.scrollBy({ top: Math.min(over, q.getBoundingClientRect().top - 90), behavior: 'smooth' });
      }, 120);
    });
  }

  /* ---------------------------------------------------------- CIERRE ----- */
  function buildCta() {
    var sec = $('#cta-final'), wrap = sec && $('.wrap', sec);
    if (!sec || !wrap) return;
    var rule = $('.cta__rule', wrap), h2 = $('h2', wrap), p = $('p', wrap), btns = $$('.cta__btns .btn', wrap);
    var inner = $('.rv', wrap);
    unrv(inner);

    /* Ecosistema: los módulos se reúnen alrededor de la marca */
    var eco = d.createElement('div');
    eco.className = 'cta__eco'; eco.setAttribute('aria-hidden', 'true');
    eco.innerHTML =
      '<svg viewBox="0 0 440 176" preserveAspectRatio="none" focusable="false">' +
        '<path pathLength="1" d="M104 40 L172 46"/><path pathLength="1" d="M336 40 L268 46"/><path pathLength="1" d="M220 98 L220 140"/>' +
      '</svg>' +
      '<span class="ce ce--c">' + U.icon('i-mobile') + 'Celulares</span>' +
      '<span class="ce ce--a">' + U.icon('i-car') + 'Autos</span>' +
      '<span class="ce ce--o">' + U.icon('i-chart') + 'Neron One</span>' +
      '<span class="ce__core"><img src="/logo-header.png" alt="" width="282" height="233" loading="lazy" decoding="async" /></span>';
    inner.insertBefore(eco, inner.firstChild);

    var words = splitWords(h2);
    var sats = $$('.ce', eco), core = $('.ce__core', eco), lines = $$('path', eco);
    [eco, h2, p].concat(btns).forEach(mo);
    g.set(words, { yPercent: 118 });
    g.set([p].concat(btns), { opacity: 0, y: 24 });
    g.set(rule, { scaleX: 0 });
    g.set(core, { opacity: 0, scale: 0.6 });
    g.set(sats, { opacity: 0 });
    g.set($('.ce--c', eco), { x: -70, y: -20 });
    g.set($('.ce--a', eco), { x: 70, y: -20 });
    g.set($('.ce--o', eco), { y: 30 });
    g.set(lines, { strokeDashoffset: 1 });

    ST.create({
      trigger: sec, start: 'top 68%', once: true,
      onEnter: function () {
        g.timeline({ defaults: { ease: EASE } })
          .to(core, { opacity: 1, scale: 1, duration: 0.9, ease: 'back.out(1.6)' }, 0)
          .to(sats, { opacity: 1, x: 0, y: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out' }, 0.15)
          .to(lines, { strokeDashoffset: 0, duration: 0.8, stagger: 0.1 }, 0.7)
          .to(rule, { scaleX: 1, duration: 0.8 }, 0.5)
          .to(words, { yPercent: 0, duration: 1.1, stagger: 0.07, ease: 'expo.out' }, 0.6)
          .to(p, { opacity: 1, y: 0, duration: 0.8 }, 1.1)
          .to(btns, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 1.25);
      },
    });
  }

  /* ----------------------------------------------------- TARJETAS Y OTROS -- */
  function buildMisc() {
    /* Tarjetas de beneficios: ligero escalonado con elevación */
    var items = $$('.benefit');
    if (items.length) {
      items.forEach(function (n) { unrv(n); mo(n); });
      g.set(items, { opacity: 0, y: 36 });
      ST.batch(items, {
        start: 'top 90%', once: true,
        onEnter: function (b) { g.to(b, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: EASE, clearProps: 'opacity,transform' }); },
      });
    }
  }

  /* -------------------------------------------------------------- INIT ---- */
  function init() {
    try {
      buildProgress();
      buildHero();
      buildHeads();
      buildSystems();
      buildEco();
      buildOrden();
      buildMisc();
      buildPlans();
      buildFaq();
      buildCta();
    } catch (err) {
      root.classList.add('motion-fail');
      if (w.console) w.console.warn('[neron:motion]', err);
    }
    /* Las fuentes cambian las medidas: se recalculan las posiciones. */
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { ST.refresh(); });
    w.addEventListener('load', function () { ST.refresh(); });
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init);
  else init();
})(window, document);
