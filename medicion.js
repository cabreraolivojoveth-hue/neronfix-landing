/* Medición de StorePhone (06/11/2026). Chico, propio y diferido.

   1) MARCA PROPIA (ya prendida): cada toque a un botón de WhatsApp manda una marca
      vacía a NUESTRO servidor (POST /clic?d=<botón>&p=<página>&a=<1 si llegó por un
      anuncio>). Solo queda en el registro de nginx; neron-landing/clics.py la cuenta.
      Sin cookies, sin datos de la persona y sin nada de fuera.

   2) ETIQUETA DE GOOGLE ADS (lista, APAGADA): se enciende llenando las dos líneas de
      abajo con lo que da Google Ads (Objetivos → Conversiones → «Clic en WhatsApp» →
      Configurar etiqueta → «Usar Google tag»: AW-… y la etiqueta de conversión) y
      abriendo la CSP del servidor con neron-landing/google-ads.sh encender.
      Vacías = no se carga nada de Google. No se inventan: las da Joveth. */
(function () {
  'use strict'
  var GOOGLE_ADS = ''        // ID de conversión, ej. 'AW-123456789'
  var ETIQUETA_WHATSAPP = '' // etiqueta de la conversión «Clic en WhatsApp», ej. 'AbC-dEfGh12'

  var DE_ANUNCIO = /[?&](gclid|gbraid|wbraid|gad_source)=/
  var anuncio = DE_ANUNCIO.test(location.search)
  try {
    if (anuncio) sessionStorage.setItem('neron-anuncio', '1')
    else anuncio = sessionStorage.getItem('neron-anuncio') === '1'
  } catch (e) {}

  var conGoogle = /^AW-\d{6,}$/.test(GOOGLE_ADS) && /^[\w-]{4,}$/.test(ETIQUETA_WHATSAPP)
  if (conGoogle) {
    window.dataLayer = window.dataLayer || []
    window.gtag = function () { window.dataLayer.push(arguments) }
    window.gtag('js', new Date())
    window.gtag('config', GOOGLE_ADS)
    var s = document.createElement('script')
    s.async = true
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GOOGLE_ADS)
    document.head.appendChild(s)
  }

  // De qué botón salió: barra de abajo, cabecera o la sección (y el plan, si lo dice el mensaje)
  function donde(a) {
    if (a.closest('.barra')) return 'barra'
    if (a.closest('.hdr')) return 'cabecera'
    var sec = a.closest('section')
    var d = sec ? (sec.id || (sec.classList.contains('hero') ? 'portada' : 'seccion')) : 'pie'
    var texto = ''
    try { texto = new URL(a.href).searchParams.get('text') || '' } catch (e) {}
    var plan = texto.match(/plan (\w+)/i)
    if (plan) d += '-' + plan[1].toLowerCase()
    else if (/a la medida/i.test(texto)) d += '-medida'
    return d
  }

  function marca(d) {
    var u = '/clic?d=' + encodeURIComponent(d) + '&p=' + encodeURIComponent(location.pathname) + '&a=' + (anuncio ? 1 : 0)
    try { if (navigator.sendBeacon && navigator.sendBeacon(u)) return } catch (e) {}
    try { fetch(u, { method: 'POST', keepalive: true, credentials: 'omit' }) } catch (e) {}
  }

  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href*="wa.me/"]') : null
    if (!a) return
    var d = donde(a)
    marca(d)
    if (conGoogle) window.gtag('event', 'conversion', { send_to: GOOGLE_ADS + '/' + ETIQUETA_WHATSAPP, transport_type: 'beacon' })
  }, true)
})()
