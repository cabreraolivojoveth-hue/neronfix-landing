/* ==========================================================================
   NERON · Capa de movimiento (GSAP + ScrollTrigger)
   --------------------------------------------------------------------------
   Mejora progresiva sobre la landing existente: no cambia contenido, rutas ni
   SEO. Si GSAP no carga, si algo falla o si el usuario pidió "reducir
   movimiento", la página queda en su estado final y completa.

   Rendimiento: sólo transform / opacity (y las propiedades individuales
   translate / scale / rotate con variables CSS), will-change únicamente donde
   hace falta, los bucles continuos se pausan fuera de pantalla y nada de
   scroll-jacking: las secciones fijadas usan position:sticky de CSS.
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
    buildHeroCards();
    buildFlows();
    buildMarquee();
    buildEco();
    return;
  }

  g.registerPlugin(ST);
  ST.config({ ignoreMobileResize: true });
  root.classList.add('has-motion');

  /* Si algo no termina de montarse, todo vuelve a verse (nunca se queda oculto). */
  var guard = setTimeout(failSafe, 4500);
  function failSafe() {
    root.classList.add('motion-fail');
    try { g.set('[data-mo], .mw__i', { clearProps: 'all' }); } catch (e) {}
  }

  var EASE = 'power3.out';
  var fine = w.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var wide = function () { return w.innerWidth > 960; };

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

  /* Ejecuta un bucle continuo sólo mientras su elemento está en pantalla. */
  function whileVisible(el, fn, margin) {
    var on = false;
    ST.create({
      trigger: el, start: 'top ' + (margin || '110%'), end: 'bottom ' + (margin ? '-10%' : '-10%'),
      onToggle: function (s) {
        if (s.isActive && !on) { on = true; g.ticker.add(fn); }
        else if (!s.isActive && on) { on = false; g.ticker.remove(fn); }
      },
    });
  }

  /* Revelados "una sola vez" que NO se pierden si alguien salta con el menú o
     recarga a mitad de página: se disparan al entrar, al rebasar, o al medir. */
  function once(trigger, start, fn) {
    var fired = false;
    function fire() { if (fired) return; fired = true; fn(); }
    ST.create({
      trigger: trigger, start: start,
      onEnter: fire, onLeave: fire,
      onUpdate: function (s) { if (s.progress > 0) fire(); },
      onRefresh: function (s) { if (s.progress > 0 || s.scroll() > s.start) fire(); },
    });
  }
  function batchReveal(items, start, run) {
    var queue = [], timer = 0;
    items.forEach(function (el) {
      once(el, start, function () {
        queue.push(el);
        if (!timer) timer = setTimeout(function () { var q = queue; queue = []; timer = 0; run(q); }, 30);
      });
    });
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
    host.insertAdjacentHTML('beforeend',
      '<span class="mock__ring" aria-hidden="true"></span><span class="mock__ring mock__ring--2" aria-hidden="true"></span>' +
      M.heroCards.slice(0, 4).map(function (c, i) {
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
    var ctas = $$('.hero__cta .btn'), mock = $('#mockup'), fx = $$('.fx', hero), rings = $$('.mock__ring', hero);
    var textCol = $('.hero__grid > div:first-child');
    [badge, h1, lead, mock].forEach(function (n) { unrv(n); mo(n); });
    ctas.forEach(mo); fx.forEach(mo);

    var words = splitWords(h1);
    g.set(words, { yPercent: 118, rotation: 5, transformOrigin: '0% 100%' });
    g.set([badge, lead], { opacity: 0, y: 22 });
    g.set(ctas, { opacity: 0, y: 26 });
    g.set(mock, { opacity: 0, y: 70, scale: 0.9, transformOrigin: '50% 60%' });
    g.set(fx, { opacity: 0, y: 34, scale: 0.8, z: function (i) { return [70, 110, 60, 90][i] || 60; } });

    /* Entrada cinematográfica al cargar */
    var tl = g.timeline({ defaults: { ease: EASE }, delay: 0.1 });
    tl.to(badge, { opacity: 1, y: 0, duration: 0.8 }, 0)
      .to(words, { yPercent: 0, rotation: 0, duration: 1.2, stagger: 0.085, ease: 'expo.out' }, 0.15)
      .to(lead, { opacity: 1, y: 0, duration: 0.9 }, 0.8)
      .to(ctas, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 1.0)
      .to(mock, { opacity: 1, y: 0, scale: 1, duration: 1.6, ease: 'expo.out' }, 0.4)
      .to(fx, { opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.14, ease: 'back.out(1.7)' }, 1.1)
      .from(rings, { scale: 0.4, opacity: 0, duration: 1.4, stagger: 0.2, ease: 'expo.out' }, 0.8)
      .call(function () { clearTimeout(guard); });

    /* Las luces de fondo derivan despacio, todo el tiempo */
    $$('.deco__glow', hero).forEach(function (el, i) {
      g.to(el, { x: i ? -70 : 80, y: i ? 60 : -40, duration: 9 + i * 2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });

    /* Inclinación 3D + parallax: con el cursor en escritorio, autónomo en touch */
    var lap = $('.mock__laptop', hero), ph = $('.mock__phone', hero);
    var layers = [
      { el: $('.mock__halo', hero), d: 12 },
      { el: ph, d: 30 },
    ].concat($$('.fx__in', hero).map(function (el, i) { return { el: el, d: 26 + i * 10 }; }))
      .filter(function (l) { return l.el; });
    var tx = 0, ty = 0, cx = 0, cy = 0, t0 = performance.now();
    var scrollTilt = 0, lastKey = '';

    if (fine) {
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width - 0.5;
        ty = (e.clientY - r.top) / r.height - 0.5;
      });
      hero.addEventListener('pointerleave', function () { tx = 0; ty = 0; });
    }
    function tiltStr(ax, ay) {
      var m = Math.hypot(ax, ay);
      return m < 0.01 ? '1 0 0 0deg' : ax.toFixed(2) + ' ' + ay.toFixed(2) + ' 0 ' + m.toFixed(2) + 'deg';
    }
    /* Sin variables CSS (recalcularían el estilo de todo el mockup en cada cuadro):
       se escriben directamente translate y rotate de sólo 2 + 4 elementos. */
    function heroTick() {
      var t = (performance.now() - t0) / 1000;
      if (!fine) { tx = Math.sin(t * 0.8) * 0.5; ty = Math.cos(t * 0.6) * 0.4; }
      cx += (tx - cx) * 0.07; cy += (ty - cy) * 0.07;
      var key = cx.toFixed(3) + cy.toFixed(3) + scrollTilt.toFixed(1);
      if (key === lastKey) return;                              /* nada cambió: no se toca el DOM */
      lastKey = key;
      for (var i = 0; i < layers.length; i++) {
        var l = layers[i];
        l.el.style.translate = (-cx * l.d).toFixed(1) + 'px ' + (-cy * l.d).toFixed(1) + 'px';
      }
      if (lap) lap.style.rotate = tiltStr(cy * -9 + scrollTilt, cx * 13);
      if (ph) ph.style.rotate = tiltStr(cy * 8, cx * -16);
    }
    whileVisible(hero, heroTick);

    /* Al bajar, el hero se desarma: las piezas son absorbidas por el panel */
    var scrub = g.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero, start: 'top top', end: 'bottom 28%', scrub: 0.6, invalidateOnRefresh: true,
        onUpdate: function (s) { scrollTilt = s.progress * 14; },
      },
    });
    scrub.to(textCol, { y: -60, opacity: 0.12 }, 0)
      .to(mock, { yPercent: -7 }, 0)
      .to(rings, { scale: 1.8, opacity: 0 }, 0)
      .to(fx, {
        x: function (i, el) { var m = mock.getBoundingClientRect(), r = el.getBoundingClientRect(); return (m.left + m.width / 2) - (r.left + r.width / 2); },
        y: function (i, el) { var m = mock.getBoundingClientRect(), r = el.getBoundingClientRect(); return (m.top + m.height / 2) - (r.top + r.height / 2); },
        scale: 0.3, opacity: 0, stagger: 0.04,
      }, 0.05)
      .to($$('.deco__glow', hero), { opacity: 0.2 }, 0);
  }

  /* ------------------------------------------------ ENCABEZADOS DE SECCIÓN -- */
  function buildHeads() {
    $$('.sec-head').forEach(function (head) {
      var eyebrow = $('.eyebrow', head), h2 = $('h2', head), p = $('p', head);
      unrv(head);
      var words = h2 ? splitWords(h2) : [];
      var rest = [eyebrow, p].filter(Boolean);
      mo(h2); rest.forEach(mo);
      g.set(words, { yPercent: 118, rotation: 4, transformOrigin: '0% 100%' });
      g.set(rest, { opacity: 0, y: 20 });
      once(head, 'top 88%', function () {
        g.timeline({ defaults: { ease: EASE } })
          .to(eyebrow, { opacity: 1, y: 0, duration: 0.7 }, 0)
          .to(words, { yPercent: 0, rotation: 0, duration: 1.05, stagger: 0.07, ease: 'expo.out' }, 0.05)
          .to(p, { opacity: 1, y: 0, duration: 0.8 }, 0.4);
      });
    });
  }

  /* -------------------------------------------- FRANJA TIPOGRÁFICA ------- */
  function buildMarquee() {
    var words = M.marquee;
    var anchor = $('#sistemas');
    if (!words || !words.length || !anchor || $('.mq')) return;
    var unit = words.map(function (w0, i) {
      return '<span class="mq__w' + (i % 2 ? ' mq__w--fill' : '') + '">' + U.esc(w0) + '</span><i class="mq__d"></i>';
    }).join('');
    var row = function (cls) {
      return '<div class="mq__row ' + cls + '"><div class="mq__t">' + unit + unit + '</div></div>';
    };
    var sec = d.createElement('section');
    sec.className = 'mq is-off'; sec.setAttribute('aria-hidden', 'true');
    sec.innerHTML = row('mq__row--a') + row('mq__row--b');
    anchor.parentNode.insertBefore(sec, anchor);
    if (U.reduced) return;

    ST.create({ trigger: sec, start: 'top bottom', end: 'bottom top', onToggle: function (s) { sec.classList.toggle('is-off', !s.isActive); } });
    var rowA = $('.mq__row--a', sec), rowB = $('.mq__row--b', sec);
    g.fromTo(rowA, { xPercent: 4 }, { xPercent: -26, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
    g.fromTo(rowB, { xPercent: -26 }, { xPercent: 4, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
    /* La velocidad del scroll inclina la tipografía: se siente física */
    var skew = g.quickTo([rowA, rowB], 'skewX', { duration: 0.5, ease: 'power3.out' });
    ST.create({
      trigger: sec, start: 'top bottom', end: 'bottom top',
      onUpdate: function (s) { skew(g.utils.clamp(-9, 9, s.getVelocity() / -260)); },
      onLeave: function () { skew(0); }, onLeaveBack: function () { skew(0); },
    });
    mo(sec);
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
    g.set(cards, { opacity: 0, y: 96, rotationX: 14, transformPerspective: 900, transformOrigin: '50% 100%' });
    cards.forEach(function (card) {
      var svg = $('.sys__media svg', card);
      if (svg) g.set(svg, { scale: 1.2, transformOrigin: '50% 50%' });
    });

    batchReveal(cards, 'top 92%', function (batch) {
      g.to(batch, {
        opacity: 1, y: 0, rotationX: 0, duration: 1.15, stagger: 0.16, ease: 'expo.out', clearProps: 'opacity,transform',
      });
      batch.forEach(function (card, i) {
        var svg = $('.sys__media svg', card);
        if (svg) g.to(svg, { scale: 1.12, duration: 1.8, delay: i * 0.16, ease: 'expo.out' });
      });
    });

    cards.forEach(function (card) {
      var svg = $('.sys__media svg', card);
      /* La captura se desliza dentro de su marco mientras la tarjeta cruza la pantalla */
      if (svg) g.fromTo(svg, { yPercent: -5 }, {
        yPercent: 5, ease: 'none',
        scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
      });

      /* Haz de luz que sigue al cursor (sólo con mouse) */
      if (fine) {
        var glow = d.createElement('i');
        glow.className = 'sys__glow'; glow.setAttribute('aria-hidden', 'true');
        card.appendChild(glow);
        var gx = g.quickSetter(glow, 'x', 'px'), gy = g.quickSetter(glow, 'y', 'px');
        card.addEventListener('pointermove', function (e) {
          var r = card.getBoundingClientRect();
          gx(e.clientX - r.left); gy(e.clientY - r.top);
        });
      }

      /* Recorrido contextual */
      var chips = $$('.sys__flow li', card), bar = $('.sys__flow-bar i', card);
      if (!chips.length) return;
      var STEP = 0.55;
      var tl = g.timeline({ paused: true, repeat: -1, repeatDelay: 0.8 });
      chips.forEach(function (chip, i) {
        tl.call(function () {
          chips.forEach(function (c, j) {
            c.classList.toggle('is-on', j === i);
            c.classList.toggle('is-past', j < i);
          });
        }, null, i * STEP);
      });
      tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: chips.length * STEP, ease: 'none' }, 0);
      tl.call(function () { chips.forEach(function (c) { c.classList.remove('is-on'); c.classList.add('is-past'); }); }, null, chips.length * STEP + 0.15);

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
        /* Touch: el recorrido corre solo mientras la tarjeta está en el centro de la pantalla */
        ST.create({
          trigger: card, start: 'top 62%', end: 'bottom 38%',
          onToggle: function (s) { if (s.isActive) start(); else stop(); },
        });
      }
      card.addEventListener('focusin', start);
      card.addEventListener('focusout', function (e) { if (!card.contains(e.relatedTarget)) stop(); });
    });
  }

  /* ----------------------------------------------- ECOSISTEMA (Neron One) -- */
  function buildEco() {
    var map = $('.eco__mapa');
    if (!map || U.reduced) return;
    var nodes = $$('.eco__nodo', map), lines = $$('.eco__linea', map), core = $('.eco__centro', map), dest = $('.eco__destino', map);
    var parts = nodes.concat([core, dest]);
    unrv(map); mo(map);
    g.set(parts, { opacity: 0, y: 28 });
    g.set(lines, { scaleY: 0, transformOrigin: '50% 0%' });
    once(map, 'top 82%', function () {
      g.timeline({ defaults: { ease: EASE } })
        .to(nodes, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, 0)
        .to(lines[0], { scaleY: 1, duration: 0.6 }, 0.45)
        .to(core, { opacity: 1, y: 0, duration: 0.8 }, 0.7)
        .to(lines[1], { scaleY: 1, duration: 0.6 }, 1.0)
        .to(dest, { opacity: 1, y: 0, duration: 0.8 }, 1.25);
    });
  }

  /* ----------------------------------------- DEL DESORDEN AL CONTROL ------ */
  function buildOrden() {
    var sec = $('#orden'), stage = $('.orden__stage');
    if (!sec || !stage) return;
    var bg = $('.orden__bg', sec);
    var mods = $$('.mod', stage), chips = $$('.nz', stage), lines = $$('.orden__lines path', stage), hub = $$('.orden__hub, .orden__cap', stage);
    var tick = $('.tick span', stage), rows = $$('.row', stage), fill = $('.tl__fill', stage), nodes = $$('.tl__n', stage);
    var bars = $$('.bars i', stage), skels = $$('.mod--venta .sk', stage);
    var pts = $$('.orden__pt', sec), pills = $$('.pill', stage);
    mo(stage);

    /* El panel oscuro "crece" desde los lados al entrar a la sección */
    if (bg) {
      var pinned = wide();
      g.fromTo(bg, { scaleX: 0.86, borderRadius: 48 }, {
        scaleX: 1, borderRadius: pinned ? 0 : 24, ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top 95%', end: 'top 25%', scrub: 0.5 },
      });
    }

    function setActive(i) {
      pts.forEach(function (p, j) { p.classList.toggle('is-active', j === i); });
      sec.classList.toggle('has-focus', i >= 0);
    }

    function build() {
      var step = rows.length > 1 ? rows[1].offsetTop - rows[0].offsetTop : 32;
      var chaos = [
        { xPercent: -14, yPercent: -10, rotation: -8, rotationY: -32, rotationX: 16, z: -190 },
        { xPercent: 15, yPercent: -6, rotation: 7, rotationY: 34, rotationX: 12, z: -150 },
        { xPercent: -8, yPercent: 14, rotation: 6, rotationY: -26, rotationX: -14, z: -170 },
        { xPercent: 12, yPercent: 10, rotation: -7, rotationY: 30, rotationX: -12, z: -210 },
      ];
      mods.forEach(function (m, i) { g.set(m, Object.assign({ scale: 0.92, opacity: 0.9, transformPerspective: 1100 }, chaos[i])); });
      g.set(chips, { opacity: 1, rotation: function (i) { return [-8, 7, 6, -5][i]; } });
      g.set(lines, { strokeDashoffset: 1 });
      g.set(hub, { opacity: 0, scale: 0.7 });
      g.set(tick, { opacity: 0, scale: 0.7, y: 8 });
      g.set(skels, { scaleX: 0.25 });
      g.set(bars, { scaleY: 0.08 });
      g.set(fill, { scale: '0 1' });
      nodes.forEach(function (n) { n.classList.remove('is-done'); });
      var perm = [2, -1, 1, -2];
      g.set(rows, { y: function (i) { return perm[i] * step; } });

      /* Fase 1 · el desorden se ordena (duración normalizada a 1) */
      var asm = g.timeline({ defaults: { ease: 'power2.inOut' } });
      asm.to(chips, {
        x: function (i, el) { var s = stage.getBoundingClientRect(), r = el.getBoundingClientRect(); return (s.left + s.width / 2) - (r.left + r.width / 2); },
        y: function (i, el) { var s = stage.getBoundingClientRect(), r = el.getBoundingClientRect(); return (s.top + s.height / 2) - (r.top + r.height / 2); },
        scale: 0.3, opacity: 0, rotation: 0, duration: 0.42, stagger: 0.04, ease: 'power3.in',
      }, 0);
      asm.to(mods, { xPercent: 0, yPercent: 0, rotation: 0, rotationX: 0, rotationY: 0, z: 0, scale: 1, opacity: 1, duration: 0.42, stagger: 0.05, ease: 'power3.out' }, 0.14);
      asm.to(lines, { strokeDashoffset: 0, duration: 0.2, stagger: 0.03 }, 0.5);
      asm.to(hub, { opacity: 1, scale: 1, duration: 0.16, ease: 'back.out(2)' }, 0.56);
      asm.to(skels, { scaleX: 1, duration: 0.14, stagger: 0.04 }, 0.6);
      asm.to(tick, { opacity: 1, scale: 1, y: 0, duration: 0.14, ease: 'back.out(2.4)' }, 0.72);
      asm.to(rows, { y: 0, duration: 0.22, stagger: 0.03, ease: 'power3.inOut' }, 0.62);
      asm.to(fill, { scale: '0.72 1', duration: 0.24, ease: 'none' }, 0.66);
      nodes.slice(0, 3).forEach(function (n, i) { asm.call(function () { n.classList.add('is-done'); }, null, 0.7 + i * 0.08); });
      asm.to(bars, { scaleY: 1, duration: 0.2, stagger: 0.03, ease: 'back.out(1.4)' }, 0.72);
      asm.duration(1);
      return asm;
    }

    /* Foco en un módulo: se acerca, los demás se atenúan */
    function focusTo(tl, i, at, dur) {
      tl.to(mods, {
        opacity: function (j) { return j === i ? 1 : 0.38; },
        scale: function (j) { return j === i ? 1.04 : 0.97; },
        z: function (j) { return j === i ? 70 : -30; },
        rotationY: function (j) { return j === i ? 0 : (j % 2 ? 7 : -7); },
        duration: dur, ease: 'power2.out',
      }, at);
    }
    function pulse(tl, i, at) {
      var targets = [
        [tick], pills, nodes, bars,
      ][i];
      tl.fromTo(targets, { scale: 0.7 }, { scale: 1, duration: 0.07, stagger: 0.01, ease: 'back.out(3)' }, at);
      if (i === 3) tl.fromTo(bars, { scaleY: 0.45 }, { scaleY: 1, duration: 0.1, stagger: 0.015, ease: 'back.out(1.8)' }, at);
    }

    var mm = g.matchMedia();

    /* Escritorio: la sección se fija (sticky) y el scroll recorre las 4 funciones */
    mm.add('(min-width: 961px)', function () {
      var master = g.timeline({ paused: true });
      master.add(build(), 0);                                  /* ensamblado: 0 → 1 */
      var focus = g.timeline();
      var T0 = 1.0, SPAN = 1.0;
      for (var i = 0; i < 4; i++) {
        var at = T0 + i * SPAN;
        focusTo(focus, i, at, 0.35);
        pulse(focus, i, at + 0.1);
      }
      focus.to(mods, { opacity: 1, scale: 1, z: 0, rotationY: 0, duration: 0.4, ease: 'power2.inOut' }, T0 + 4 * SPAN);
      master.add(focus, 0);
      ST.create({
        trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.7, animation: master, invalidateOnRefresh: true,
        onUpdate: function (s) {
          var time = s.progress * master.duration();
          var idx = time < T0 - 0.05 ? -1 : (time >= T0 + 4 * SPAN ? -1 : Math.min(3, Math.floor((time - T0) / SPAN)));
          setActive(idx);
        },
      });
      return function () { master.kill(); setActive(-1); };
    });

    /* Móvil: una pasada al entrar y luego un recorrido automático por los módulos */
    mm.add('(max-width: 960px)', function () {
      var asm = build();
      asm.pause(0).duration(2.4);
      var loop = g.timeline({ paused: true, repeat: -1 });
      for (var i = 0; i < 4; i++) {
        (function (k) {
          var at = k * 1.5;
          loop.call(function () { setActive(k); }, null, at);
          focusTo(loop, k, at, 0.45);
          pulse(loop, k, at + 0.15);
        })(i);
      }
      loop.to(mods, { opacity: 1, scale: 1, z: 0, rotationY: 0, duration: 0.4 }, 6);
      loop.duration(6.6);
      once(stage, 'top 75%', function () { asm.play(0); asm.eventCallback('onComplete', function () { loop.play(0); }); });
      ST.create({
        trigger: stage, start: 'top 90%', end: 'bottom 5%',
        onToggle: function (s) { if (!asm.isActive() && asm.progress() === 1) { if (s.isActive) loop.play(); else loop.pause(); } },
      });
      return function () { asm.kill(); loop.kill(); setActive(-1); };
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
      g.set(cardsOf(), { opacity: 0, y: 60, rotationX: 10, transformPerspective: 900, transformOrigin: '50% 100%' });
    }
    /* El precio sube hasta su valor real y se queda con el texto exacto. */
    function countUp(card) {
      var b = $('.plan__price b', card);
      if (!b) return;
      var final = b.textContent, n = parseFloat(final.replace(/[^0-9.]/g, ''));
      if (!n || n < 1) return;
      var o = { v: 0 };
      g.to(o, {
        v: n, duration: 1.3, ease: 'power3.out',
        onUpdate: function () { b.textContent = '$' + Math.round(o.v).toLocaleString('es-MX'); },
        onComplete: function () { b.textContent = final; },
      });
    }
    function reveal() {
      var cards = cardsOf();
      if (!cards.length) return;
      busy = true;
      g.to(cards, {
        opacity: 1, y: 0, rotationX: 0, duration: 1, stagger: 0.13, ease: 'expo.out', clearProps: 'opacity,transform',
        onComplete: function () { busy = false; lit(); },
      });
      cards.forEach(function (c, i) { g.delayedCall(0.2 + i * 0.13, function () { countUp(c); }); });
    }

    hidePrepare();
    once(host, 'top 86%', function () { seen = true; reveal(); });

    /* Al cambiar de sistema o de forma de pago se vuelven a dibujar: entrada breve */
    new MutationObserver(function () {
      if (busy) return;
      hidePrepare();
      if (seen) { g.delayedCall(0.02, reveal); }
    }).observe(host, { childList: true });
  }

  /* ------------------------------------------------------------ FAQ ------ */
  function buildFaq() {
    var host = $('#faq-list');
    if (!host) return;
    var items = $$('.faq__item', host);
    items.forEach(function (n) { unrv(n); mo(n); });
    g.set(items, { opacity: 0, x: -24 });
    batchReveal(items, 'top 92%', function (b) { g.to(b, { opacity: 1, x: 0, duration: 0.8, stagger: 0.07, ease: EASE, clearProps: 'opacity,transform' }); });
    host.addEventListener('click', function (e) {
      var q = e.target.closest('.faq__q');
      if (!q || q.getAttribute('aria-expanded') !== 'true') return;
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

    /* Ecosistema: tres módulos orbitan la marca y se conectan con ella */
    var eco = d.createElement('div');
    eco.className = 'cta__eco'; eco.setAttribute('aria-hidden', 'true');
    eco.innerHTML =
      '<svg class="ce__svg" focusable="false"></svg>' +
      '<span class="ce__orbit"></span><span class="ce__orbit ce__orbit--2"></span>' +
      '<span class="ce__core"><i class="ce__pulse"></i><i class="ce__pulse ce__pulse--2"></i><img src="/logo-header.png" alt="" width="282" height="233" loading="lazy" decoding="async" /></span>' +
      '<span class="ce ce--c">' + U.icon('i-mobile') + 'Celulares</span>' +
      '<span class="ce ce--a">' + U.icon('i-car') + 'Autos</span>' +
      '<span class="ce ce--o">' + U.icon('i-chart') + 'Neron One</span>';
    inner.insertBefore(eco, inner.firstChild);

    var svg = $('.ce__svg', eco), core = $('.ce__core', eco), sats = $$('.ce', eco);
    var paths = [], dots = [];
    var NS = 'http://www.w3.org/2000/svg';

    /* Las líneas se miden en pantalla: siempre tocan el centro de la marca y de cada módulo */
    function layout() {
      /* Se miden en su posición final (sin los desplazamientos de la entrada) */
      var all = [core].concat(sats);
      var saved = all.map(function (el) { return [g.getProperty(el, 'x'), g.getProperty(el, 'y'), g.getProperty(el, 'scale')]; });
      g.set(all, { x: 0, y: 0, scale: 1 });
      var b = eco.getBoundingClientRect();
      svg.setAttribute('viewBox', '0 0 ' + b.width + ' ' + b.height);
      svg.innerHTML = '';
      paths = []; dots = [];
      var c = core.getBoundingClientRect();
      var cx = c.left - b.left + c.width / 2, cy = c.top - b.top + c.height / 2;
      sats.forEach(function (s) {
        var r = s.getBoundingClientRect();
        var sx = r.left - b.left + r.width / 2, sy = r.top - b.top + r.height / 2;
        var path = d.createElementNS(NS, 'path');
        path.setAttribute('d', 'M' + cx + ' ' + cy + ' L' + sx + ' ' + sy);
        path.setAttribute('pathLength', '1');
        svg.appendChild(path); paths.push(path);
        var dot = d.createElementNS(NS, 'circle');
        dot.setAttribute('r', '3.2'); dot.setAttribute('cx', cx); dot.setAttribute('cy', cy);
        svg.appendChild(dot); dots.push({ el: dot, x0: cx, y0: cy, x1: sx, y1: sy });
      });
      all.forEach(function (el, i) { g.set(el, { x: saved[i][0], y: saved[i][1], scale: saved[i][2] }); });
    }
    layout();

    var words = splitWords(h2);
    [eco, h2, p].concat(btns).forEach(mo);
    g.set(words, { yPercent: 118, rotation: 4, transformOrigin: '0% 100%' });
    g.set([p].concat(btns), { opacity: 0, y: 28 });
    g.set(rule, { scaleX: 0 });
    g.set(core, { opacity: 0, scale: 0.5 });
    g.set(sats, { opacity: 0, scale: 0.7 });
    g.set($('.ce--c', eco), { x: -80, y: -30 });
    g.set($('.ce--a', eco), { x: 80, y: -30 });
    g.set($('.ce--o', eco), { y: 50 });
    g.set(paths, { strokeDashoffset: 1 });
    g.set(dots.map(function (x) { return x.el; }), { opacity: 0 });

    var shown = false;
    function startIdle() {
      /* Pulsos de datos viajan por las líneas y los módulos "respiran" */
      dots.forEach(function (o, i) {
        var tw = { t: 0 };
        g.to(tw, {
          t: 1, duration: 2.2, repeat: -1, delay: i * 0.7, ease: 'power1.inOut', repeatDelay: 0.6,
          onUpdate: function () {
            o.el.setAttribute('cx', o.x0 + (o.x1 - o.x0) * tw.t);
            o.el.setAttribute('cy', o.y0 + (o.y1 - o.y0) * tw.t);
            o.el.setAttribute('opacity', Math.sin(tw.t * Math.PI).toFixed(2));
          },
        });
      });
      sats.forEach(function (s, i) {
        g.to(s, { y: '+=5', duration: 2.4 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.3 });
      });
    }

    once(sec, 'top 70%', function () {
        shown = true;
        g.timeline({ defaults: { ease: EASE } })
          .to(core, { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.6)' }, 0)
          .to(sats, { opacity: 1, x: 0, y: 0, scale: 1, duration: 1.2, stagger: 0.14, ease: 'expo.out' }, 0.15)
          .to(paths, { strokeDashoffset: 0, duration: 0.9, stagger: 0.12 }, 0.8)
          .to(rule, { scaleX: 1, duration: 0.8 }, 0.5)
          .to(words, { yPercent: 0, rotation: 0, duration: 1.15, stagger: 0.08, ease: 'expo.out' }, 0.7)
          .to(p, { opacity: 1, y: 0, duration: 0.8 }, 1.2)
          .to(btns, { opacity: 1, y: 0, duration: 0.85, stagger: 0.12 }, 1.35)
          .call(startIdle, null, 1.8);
    });
    w.addEventListener('resize', function () { if (!shown) layout(); });
  }

  /* ----------------------------------------------------- TARJETAS Y OTROS -- */
  function buildMisc() {
    /* Beneficios: entrada escalonada y el icono "salta" al aparecer */
    var items = $$('.benefit');
    if (items.length) {
      items.forEach(function (n) { unrv(n); mo(n); });
      g.set(items, { opacity: 0, y: 48, rotationY: -38, transformPerspective: 900, transformOrigin: '0% 50%' });
      g.set($$('.benefit__ic', items[0].parentNode), { scale: 0.4, rotation: -18 });
      batchReveal(items, 'top 92%', function (b) {
        g.to(b, { opacity: 1, y: 0, rotationY: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out', clearProps: 'opacity,transform' });
        g.to(b.map(function (n) { return $('.benefit__ic', n); }), { scale: 1, rotation: 0, duration: 0.9, stagger: 0.12, delay: 0.25, ease: 'back.out(2.2)' });
      });
    }

    /* Inclinación 3D al pasar el cursor (sólo escritorio, con la propiedad `rotate`) */
    if (fine) {
      tiltGroup($('#systems'), '.sys', 5);
      tiltGroup($('#plans'), '.plan', 6);
      tiltGroup($('#benefits'), '.benefit', 8);
    }

    /* Botones grandes: atracción magnética hacia el cursor (sólo escritorio) */
    if (fine) {
      $$('.btn--lg').forEach(function (btn) {
        var qx = g.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
        var qy = g.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
        btn.addEventListener('pointermove', function (e) {
          var r = btn.getBoundingClientRect();
          qx((e.clientX - (r.left + r.width / 2)) * 0.18);
          qy((e.clientY - (r.top + r.height / 2)) * 0.28);
        });
        btn.addEventListener('pointerleave', function () { qx(0); qy(0); });
      });
    }
  }

  /* Inclinación hacia el cursor con un solo bucle por tarjeta activa. */
  function tiltGroup(host, sel, max) {
    if (!host) return;
    var state = new WeakMap();
    function st(el) { if (!state.has(el)) state.set(el, { x: 0, y: 0, cx: 0, cy: 0, raf: 0 }); return state.get(el); }
    function loop(el, s) {
      s.cx += (s.x - s.cx) * 0.13; s.cy += (s.y - s.cy) * 0.13;
      var a = -s.cy * max, b = s.cx * max, m = Math.hypot(a, b);
      var rest = Math.abs(s.x - s.cx) + Math.abs(s.y - s.cy) < 0.002;
      el.style.rotate = (rest && !s.x && !s.y) || m < 0.02 ? '' : a.toFixed(2) + ' ' + b.toFixed(2) + ' 0 ' + m.toFixed(2) + 'deg';
      s.raf = rest ? 0 : requestAnimationFrame(function () { loop(el, s); });
    }
    host.addEventListener('pointermove', function (e) {
      var el = e.target.closest(sel);
      if (!el || !host.contains(el)) return;
      var s = st(el), r = el.getBoundingClientRect();
      s.x = (e.clientX - r.left) / r.width - 0.5; s.y = (e.clientY - r.top) / r.height - 0.5;
      if (!s.raf) s.raf = requestAnimationFrame(function () { loop(el, s); });
    });
    host.addEventListener('pointerout', function (e) {
      var el = e.target.closest(sel);
      if (!el || el.contains(e.relatedTarget)) return;
      var s = st(el); s.x = 0; s.y = 0;
      if (!s.raf) s.raf = requestAnimationFrame(function () { loop(el, s); });
    });
  }

  /* -------------------------------------------------------------- INIT ---- */
  function init() {
    try {
      buildProgress();
      buildHero();
      buildMarquee();
      buildHeads();
      buildSystems();
      buildEco();
      buildOrden();
      buildMisc();
      buildPlans();
      buildFaq();
      buildCta();
    } catch (err) {
      failSafe();
      if (w.console) w.console.warn('[neron:motion]', err);
    }
    /* Las fuentes cambian las medidas: se recalculan las posiciones. */
    var loaded = new Promise(function (ok) { if (d.readyState === 'complete') ok(); else w.addEventListener('load', ok); });
    var fonts = (d.fonts && d.fonts.ready) ? d.fonts.ready : Promise.resolve();
    Promise.all([loaded, fonts]).then(function () { g.delayedCall(0.25, function () { ST.refresh(); }); });
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init);
  else init();
})(window, document);
