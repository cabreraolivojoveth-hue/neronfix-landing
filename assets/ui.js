/* ==========================================================================
   NERON · Primitivas de interfaz
   Utilidades y comportamientos reutilizables. Sin dependencias externas.
   ========================================================================== */
(function (w, d) {
  'use strict';

  var CFG = w.NERON_CONFIG || {};
  var reduced = w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- DOM -- */
  function $(sel, ctx) { return (ctx || d).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || d).querySelectorAll(sel)); }

  /* Escapa texto que se inyecta como HTML (todo el contenido viene de
     config.js, pero mantenerlo escapado evita sorpresas al editarlo). */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function icon(id, cls) {
    return '<svg class="ic ' + (cls || '') + '" aria-hidden="true"><use href="#' + id + '"></use></svg>';
  }

  function money(n) {
    return '$' + Number(n || 0).toLocaleString('es-MX');
  }

  /* ---------------------------------------------------------- ANALÍTICA -- */
  /* Puente único hacia cualquier plataforma. Hoy no hay ninguna instalada:
     los eventos se acumulan en dataLayer y se reenvían si aparece gtag/fbq. */
  function track(event, props) {
    var cfg = CFG.ANALYTICS_CONFIG || {};
    if (!cfg.enabled) return;
    var payload = Object.assign({ event: event }, props || {});
    var name = cfg.dataLayerName || 'dataLayer';
    w[name] = w[name] || [];
    w[name].push(payload);
    if (typeof w.gtag === 'function') w.gtag('event', event, props || {});
    if (typeof w.fbq === 'function') { try { w.fbq('trackCustom', event, props || {}); } catch (e) {} }
    if (cfg.debug && w.console) w.console.log('[neron:track]', event, props || {});
  }

  /* Delega los clics con data-track para no repetir listeners. */
  d.addEventListener('click', function (e) {
    var t = e.target.closest('[data-track]');
    if (!t) return;
    track(t.getAttribute('data-track'), { label: (t.getAttribute('data-track-label') || t.textContent || '').trim().slice(0, 60) });
  });

  /* ----------------------------------------------- BLOQUEO DE SCROLL --- */
  var lockCount = 0, lockY = 0;
  function lockScroll() {
    if (lockCount++ > 0) return;
    lockY = w.scrollY || 0;
    var sb = w.innerWidth - d.documentElement.clientWidth;
    d.body.classList.add('is-locked');
    if (sb > 0) d.body.style.paddingRight = sb + 'px';
  }
  function unlockScroll() {
    if (--lockCount > 0) return;
    lockCount = 0;
    d.body.classList.remove('is-locked');
    d.body.style.paddingRight = '';
  }

  /* -------------------------------------------------- FOCO ATRAPADO ---- */
  var FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';
  function trapFocus(container, e) {
    var items = $$(FOCUSABLE, container).filter(function (n) { return n.offsetParent !== null; });
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ------------------------------------------------------- REVELADO ---- */
  /* Fade + desplazamiento al entrar al viewport, con retraso escalonado. */
  function initReveal(scope) {
    /* Los elementos del hero se animan con su propio escalonado (app.js). */
    var nodes = $$('.rv', scope || d).filter(function (n) {
      return !n.__rv && !n.hasAttribute('data-enter');
    });
    if (!nodes.length) return;
    if (reduced || !('IntersectionObserver' in w)) {
      nodes.forEach(function (n) { n.__rv = 1; n.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    nodes.forEach(function (n) { n.__rv = 1; io.observe(n); });
  }

  /* ------------------------------------------------------- COUNT-UP ---- */
  /* Se ejecuta una sola vez, cuando el bloque entra al viewport. */
  function initCountUp(scope) {
    var nodes = $$('[data-count]', scope || d).filter(function (n) { return !n.__cu; });
    if (!nodes.length) return;

    function run(node) {
      var target = parseFloat(node.getAttribute('data-count')) || 0;
      var pre = node.getAttribute('data-prefix') || '';
      var suf = node.getAttribute('data-suffix') || '';
      var fmt = function (v) { return pre + Math.round(v).toLocaleString('es-MX') + suf; };
      if (reduced || target === 0) { node.textContent = fmt(target); return; }
      var dur = 1100, t0 = 0;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        node.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in w)) { nodes.forEach(function (n) { n.__cu = 1; run(n); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        run(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0.4 });
    nodes.forEach(function (n) { n.__cu = 1; io.observe(n); });
  }

  /* ------------------------------------------------------- ACORDEÓN ---- */
  function initAccordion(root) {
    if (!root) return;
    root.addEventListener('click', function (e) {
      var q = e.target.closest('.faq__q');
      if (!q || !root.contains(q)) return;
      var panel = q.nextElementSibling;
      var open = q.getAttribute('aria-expanded') === 'true';

      if (open) {
        panel.style.height = panel.scrollHeight + 'px';
        requestAnimationFrame(function () { panel.style.height = '0px'; });
        q.setAttribute('aria-expanded', 'false');
      } else {
        /* Cierra el resto: sólo una respuesta abierta a la vez. */
        $$('.faq__q[aria-expanded="true"]', root).forEach(function (other) {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.style.height = other.nextElementSibling.scrollHeight + 'px';
          requestAnimationFrame(function () { other.nextElementSibling.style.height = '0px'; });
        });
        q.setAttribute('aria-expanded', 'true');
        panel.style.height = panel.scrollHeight + 'px';
        track('faq_open', { question: q.textContent.trim().slice(0, 80) });
      }
    });

    /* Al terminar de abrir, height:auto para que el texto pueda reflujar. */
    root.addEventListener('transitionend', function (e) {
      if (e.propertyName !== 'height' || !e.target.classList.contains('faq__a')) return;
      var q = e.target.previousElementSibling;
      if (q && q.getAttribute('aria-expanded') === 'true') e.target.style.height = 'auto';
    });

    /* Si cambia el ancho, recalcula el panel abierto. */
    w.addEventListener('resize', function () {
      $$('.faq__q[aria-expanded="true"]', root).forEach(function (q) {
        q.nextElementSibling.style.height = 'auto';
      });
    });
  }

  /* ---------------------------------------------------------- MODAL ---- */
  var modalReturnFocus = null;
  function openModal(id, opener) {
    var m = d.getElementById(id);
    if (!m) return;
    modalReturnFocus = opener || d.activeElement;
    m.classList.add('is-open');
    m.removeAttribute('aria-hidden');
    lockScroll();
    var first = $(FOCUSABLE, m);
    if (first) setTimeout(function () { first.focus(); }, 60);
  }
  function closeModal(m) {
    m = typeof m === 'string' ? d.getElementById(m) : (m || $('.modal.is-open'));
    if (!m || !m.classList.contains('is-open')) return;
    m.classList.remove('is-open');
    m.setAttribute('aria-hidden', 'true');
    unlockScroll();
    if (modalReturnFocus && modalReturnFocus.focus) modalReturnFocus.focus();
    modalReturnFocus = null;
  }

  d.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-modal-open]');
    if (opener) { e.preventDefault(); openModal(opener.getAttribute('data-modal-open'), opener); return; }
    if (e.target.closest('[data-modal-close]') || e.target.classList.contains('modal__overlay')) {
      closeModal(e.target.closest('.modal'));
    }
  });

  d.addEventListener('keydown', function (e) {
    var open = $('.modal.is-open');
    if (e.key === 'Escape') {
      if (open) { closeModal(open); return; }
      var drawer = $('.drawer.is-open');
      if (drawer && w.NeronUI.closeDrawer) w.NeronUI.closeDrawer();
      return;
    }
    if (e.key === 'Tab' && open) trapFocus(open, e);
  });

  /* --------------------------------------------------------- EXPORT ---- */
  w.NeronUI = {
    $: $, $$: $$, esc: esc, icon: icon, money: money, track: track,
    reduced: reduced,
    lockScroll: lockScroll, unlockScroll: unlockScroll, trapFocus: trapFocus,
    initReveal: initReveal, initCountUp: initCountUp, initAccordion: initAccordion,
    openModal: openModal, closeModal: closeModal,
  };
})(window, document);
