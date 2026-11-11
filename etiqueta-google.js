/* Etiqueta de Google Ads + origen del anuncio (ACUERDO #9, 10/11/2026).
   Va en el <head> de todas las paginas (diferida). Hace tres cosas:
   1) Deja lista la etiqueta de Google (gtag.js se carga aparte, async, desde el <head>).
   2) Cada clic a wa.me/5216462875283 manda la conversion de «clic en WhatsApp». NO se manda en /pagos/
      (ahi escriben clientes que ya pagan). El enlace abre igual: aqui no se frena ni se retrasa nada.
   3) Detecta de donde llego la persona (anuncio de Google/YouTube, Instagram/Facebook, utm_source),
      lo guarda en sessionStorage (vale para toda la visita) y lo pone en el mensaje de WhatsApp.
   Todo dentro de try/catch: si algo falla, la pagina sigue igual. */
(function () {
  'use strict'
  var ID = 'AW-18555345517'
  var ENVIO = 'AW-18555345517/BhxrCLnIg7YdEO208I9F'
  var NUMERO = '5216462875283'
  var CLAVE = 'neron-origen'
  var enPagos = /^\/pagos(\/|$)/.test(location.pathname)

  // gtag (el <script async> de gtag.js va en el <head>; la cola dataLayer espera su turno)
  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments) }
  try { window.gtag('js', new Date()); window.gtag('config', ID) } catch (e) {}

  // ---- Origen ----
  function limpiaOrigen(v) {
    return String(v || '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 40)
  }
  function detecta() {
    var q = new URLSearchParams(location.search), host = ''
    try { host = new URL(document.referrer).hostname.toLowerCase() } catch (e) {}
    var utm = limpiaOrigen(q.get('utm_source'))
    if (utm) return utm
    if (q.get('gclid') || q.get('gbraid') || q.get('wbraid')) return /(^|\.)google\.[a-z.]+$/.test(host) ? 'Google' : 'YouTube'
    if (/(^|\.)(instagram|facebook)\.com$/.test(host)) return 'Instagram'
    return ''
  }
  var origen = ''
  try {
    var nuevo = detecta()
    if (nuevo) { origen = nuevo; try { sessionStorage.setItem(CLAVE, nuevo) } catch (e) {} }
    else { try { origen = limpiaOrigen(sessionStorage.getItem(CLAVE)) } catch (e) {} }
  } catch (e) {}

  // ---- Texto de WhatsApp ----
  var SALUDO = 'Hola, quiero acceso a StorePhone'
  function esWa(a) {
    var h = a && a.getAttribute && a.getAttribute('href')
    return !!h && h.indexOf('wa.me/' + NUMERO) !== -1
  }
  function textoNuevo(t) {
    if (t === SALUDO) return 'Hola, vi su anuncio en ' + origen + ' y quiero acceso a StorePhone'
    return 'Vi su anuncio en ' + origen + '. ' + t
  }
  function aplica(a) {
    try {
      if (!origen || enPagos || !esWa(a)) return
      var h = a.getAttribute('href')
      if (a.getAttribute('data-origen-href') === h) return // ya lo hice con este mismo enlace
      var i = h.indexOf('?'), base = i === -1 ? h : h.slice(0, i), resto = i === -1 ? '' : h.slice(i + 1)
      var partes = resto ? resto.split('&') : [], otros = [], t = null
      for (var k = 0; k < partes.length; k++) {
        if (partes[k].indexOf('text=') === 0) { try { t = decodeURIComponent(partes[k].slice(5)) } catch (e) { t = null } }
        else otros.push(partes[k])
      }
      var nuevoT = t === null ? 'Vi su anuncio en ' + origen + '.' : textoNuevo(t)
      var nh = base + '?text=' + encodeURIComponent(nuevoT) + (otros.length ? '&' + otros.join('&') : '')
      a.setAttribute('href', nh)
      a.setAttribute('data-origen-href', nh)
    } catch (e) {}
  }
  function todos() {
    try { var l = document.querySelectorAll('a[href*="wa.me/' + NUMERO + '"]'); for (var i = 0; i < l.length; i++) aplica(l[i]) } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', todos)
  else todos()

  // ---- Clic: texto al dia (por si el enlace cambio) + conversion. Nada frena la navegacion. ----
  function toque(ev) {
    try {
      if (ev.type === 'click' ? ev.button !== 0 : ev.button !== 1) return
      var a = ev.target && ev.target.closest ? ev.target.closest('a[href*="wa.me/' + NUMERO + '"]') : null
      if (!a || a.hasAttribute('data-encuesta')) return // data-encuesta abre la encuesta, no WhatsApp
      aplica(a)
      if (enPagos) return
      window.gtag('event', 'conversion', { 'send_to': ENVIO, 'value': 1.0, 'currency': 'MXN' })
    } catch (e) {}
  }
  document.addEventListener('click', toque, true)
  document.addEventListener('auxclick', toque, true)
})()
