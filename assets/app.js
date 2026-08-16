/* ==========================================================================
   NERON · Arranque
   Conecta comportamientos globales (header, menú, scrollspy, barra móvil)
   y monta las secciones definidas en config.js.
   ========================================================================== */
(function (w, d) {
  'use strict';

  var U = w.NeronUI, K = w.NeronComponents, C = w.NERON_CONFIG;
  var $ = U.$, $$ = U.$$;

  /* ------------------------------------------------------------ HEADER -- */
  function initHeader() {
    var hdr = $('.hdr');
    if (!hdr) return;
    var ticking = false;
    function update() {
      hdr.classList.toggle('is-stuck', w.scrollY > 12);
      ticking = false;
    }
    update();
    w.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
  }

  /* ------------------------------------------------------------ DRAWER -- */
  function initDrawer() {
    var drawer = $('#drawer'), burger = $('#burger');
    if (!drawer || !burger) return;

    function open() {
      drawer.classList.add('is-open');
      drawer.removeAttribute('aria-hidden');
      burger.setAttribute('aria-expanded', 'true');
      U.lockScroll();
      var first = $('.drawer__close', drawer);
      if (first) setTimeout(function () { first.focus(); }, 60);
    }
    function close() {
      if (!drawer.classList.contains('is-open')) return;
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      burger.setAttribute('aria-expanded', 'false');
      U.unlockScroll();
      burger.focus();
    }
    w.NeronUI.closeDrawer = close;

    burger.addEventListener('click', function () {
      drawer.classList.contains('is-open') ? close() : open();
    });
    $$('[data-drawer-close]', drawer).forEach(function (b) {
      b.addEventListener('click', close);
    });
    /* Al elegir una sección el menú se cierra solo. */
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Tab' && drawer.classList.contains('is-open')) U.trapFocus(drawer, e);
    });
    /* Si se pasa a escritorio con el menú abierto, se cierra. */
    w.addEventListener('resize', function () {
      if (w.innerWidth > 960) close();
    });
  }

  /* --------------------------------------------------------- SCROLLSPY -- */
  function initSpy() {
    var links = $$('[data-spy]');
    if (!links.length) return;
    var targets = links.map(function (l) {
      return { href: l.getAttribute('data-spy'), el: d.querySelector(l.getAttribute('data-spy')) };
    }).filter(function (t) { return t.el; });
    if (!targets.length) return;

    /* Se ordena por posición en la página, no por orden del menú: así el
       enlace activo es siempre correcto aunque ambos órdenes difieran. */
    function sortByPosition() {
      targets.sort(function (a, b) { return a.el.offsetTop - b.el.offsetTop; });
    }
    sortByPosition();

    var ticking = false;
    function update() {
      ticking = false;
      var offset = w.scrollY + (parseInt(getComputedStyle(d.documentElement).getPropertyValue('--header-h-sticky'), 10) || 64) + 40;
      var active = targets[0].href;
      targets.forEach(function (t) {
        if (t.el.offsetTop <= offset) active = t.href;
      });
      /* Al final de la página gana la última sección visible. */
      if (w.innerHeight + w.scrollY >= d.body.offsetHeight - 4) {
        active = targets[targets.length - 1].href;
      }
      links.forEach(function (l) {
        l.classList.toggle('is-active', l.getAttribute('data-spy') === active);
      });
    }
    update();
    w.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    w.addEventListener('resize', function () { sortByPosition(); update(); });
  }

  /* -------------------------------------------------------- BARRA MÓVIL -- */
  /* Aparece al pasar el hero y se esconde sobre el CTA final para no tapar
     los botones de cierre de la página. */
  function initMobileBar() {
    var bar = $('#mbar');
    if (!bar) return;
    var hero = $('#inicio'), end = $('#cta-final');
    var ticking = false;
    function update() {
      ticking = false;
      var past = w.scrollY > (hero ? hero.offsetHeight * 0.75 : 500);
      var atEnd = end ? (end.getBoundingClientRect().top < w.innerHeight - 80) : false;
      bar.classList.toggle('is-visible', past && !atEnd);
    }
    update();
    w.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    w.addEventListener('resize', update);
  }

  /* ------------------------------------------------- ENTRADA DEL HERO -- */
  /* Escalonado: badge → título → texto → botones → mockup. */
  function initHeroEnter() {
    var nodes = $$('.hero [data-enter]');
    if (!nodes.length) return;
    if (U.reduced) { nodes.forEach(function (n) { n.classList.add('is-in'); }); return; }
    nodes.forEach(function (n, i) {
      setTimeout(function () { n.classList.add('is-in'); }, 90 + i * 110);
    });
  }

  /* ---------------------------------------------- DESPLAZAMIENTO SUAVE -- */
  /* scroll-behavior:smooth cubre el caso general; esto sólo corrige el
     enfoque de teclado para que el foco siga al usuario a la sección. */
  function initAnchorFocus() {
    d.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = d.querySelector(id);
      if (!target) return;
      setTimeout(function () {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }, 420);
    });
  }

  /* -------------------------------------------------------------- INIT -- */
  function boot() {
    if (!C || !U || !K) return;

    K.renderNav();
    K.renderMockup();
    K.renderTrust();
    K.renderStats();
    K.renderSystems();
    K.renderBenefits();
    K.initPricing();
    K.renderFaq();
    K.renderContact();
    K.renderLoginModal();
    K.wireLinks();

    initHeader();
    initDrawer();
    initSpy();
    initMobileBar();
    initAnchorFocus();
    initHeroEnter();

    U.initReveal();
    U.initCountUp();
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window, document);
