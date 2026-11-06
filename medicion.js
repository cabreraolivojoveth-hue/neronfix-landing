/* Medición de StorePhone (06/11/2026). Chico, propio y diferido.

   1) MARCA PROPIA (prendida): cada toque a un botón de WhatsApp manda una marca vacía
      a nuestro servidor: POST /clic?d=<botón>&p=<página>&a=<1 llegó por anuncio · 0 no ·
      p prueba>. Esta marca no usa cookies ni datos de la persona ni nada de fuera.

   2) ETIQUETA DE GOOGLE ADS (lista, APAGADA): se llenan las dos líneas de abajo con lo que
      da Google Ads (Objetivos → Conversiones → «Clic en WhatsApp» → etiqueta de Google).
      Vacías = no se carga nada de Google. Encendida, Google pone sus propias cookies:
      antes va el aviso de privacidad. Los IDs no se inventan. */
(function () {
  'use strict'
  var GOOGLE_ADS = ''        // ID de conversión, ej. 'AW-123456789'
  var ETIQUETA_WHATSAPP = '' // etiqueta de la conversión «Clic en WhatsApp», ej. 'AbC-dEfGh12'

  // a=1 llegó por anuncio · a=p visita de prueba (gclid=prueba…) · a=0 lo demás
  var DE_ANUNCIO = /[?&](gclid|gbraid|wbraid|gad_source)=/
  var anuncio = /[?&]gclid=prueba/.test(location.search) ? 'p' : (DE_ANUNCIO.test(location.search) ? '1' : '')
  try {
    if (anuncio) sessionStorage.setItem('neron-anuncio', anuncio)
    else anuncio = sessionStorage.getItem('neron-anuncio') || ''
  } catch (e) {}
  if (anuncio !== '1' && anuncio !== 'p') anuncio = '0'

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
    var u = '/clic?d=' + encodeURIComponent(d) + '&p=' + encodeURIComponent(location.pathname) + '&a=' + anuncio
    try { if (navigator.sendBeacon && navigator.sendBeacon(u)) return } catch (e) {}
    try { fetch(u, { method: 'POST', keepalive: true, credentials: 'omit' }) } catch (e) {}
  }

  function toque(ev) {
    // clic normal = botón principal; el de en medio llega como auxclick (abrir en otra pestaña).
    // Así un navegador que mande los dos no cuenta doble.
    if (ev.type === 'click' ? ev.button !== 0 : ev.button !== 1) return
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href*="wa.me/"]') : null
    if (!a) return
    marca(donde(a))
    if (conGoogle) window.gtag('event', 'conversion', { send_to: GOOGLE_ADS + '/' + ETIQUETA_WHATSAPP, transport_type: 'beacon' })
  }
  document.addEventListener('click', toque, true)
  document.addEventListener('auxclick', toque, true)
})()
