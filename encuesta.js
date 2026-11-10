/* Encuesta del mes gratis (10/11/2026). Todo pasa en el navegador: no se guarda ni se manda nada.
   Las respuestas viven solo en esta variable mientras la página está abierta (sin localStorage). */
(function () {
  'use strict'
  var raiz = document.getElementById('encuesta')
  if (!raiz) return
  var WA = 'https://wa.me/5216462875283'
  var form = document.getElementById('enc-form')
  var pasos = [].slice.call(form.querySelectorAll('.enc__paso'))
  var bAtras = document.getElementById('enc-atras'), bSig = document.getElementById('enc-sig')
  var err = document.getElementById('enc-err'), txt = document.getElementById('enc-pasos')
  var barra = raiz.querySelector('.enc__barra'), relleno = barra.querySelector('i')
  var enlace = document.getElementById('enc-wa'), resumen = document.getElementById('enc-resumen')
  var caja = raiz.querySelector('.enc__caja')
  var datos = { plan: '', tienda: '', ciudad: '', sucursales: '', correo: '' }
  var actual = 0, abierto = false, quien = null, aparte = []

  function limpio(v) { return String(v || '').replace(/\s+/g, ' ').trim() }
  function campo(i) { return pasos[i].querySelector('input[type=text],input[type=email]') }
  function titulo(i) { return pasos[i].querySelector('h2') }

  function mensaje() {
    return 'Hola, quiero mi prueba gratuita (30 días) de StorePhone. Plan: ' + datos.plan +
      '. Mi tienda: ' + datos.tienda + '. Ciudad: ' + datos.ciudad +
      '. Sucursales: ' + datos.sucursales + '. Correo: ' + datos.correo +
      '. Me gustaría platicar con el equipo para empezar.'
  }

  function validar(i) {
    var n = pasos[i].getAttribute('data-paso'), v
    if (n === 'plan') {
      var r = form.querySelector('input[name=plan]:checked')
      if (!r) return { m: 'Elige un plan para continuar.', el: form.querySelector('input[name=plan]') }
      datos.plan = r.value; return null
    }
    var el = campo(i); v = limpio(el.value)
    if (n === 'tienda' || n === 'ciudad') {
      if (v.length < 2) return { m: n === 'tienda' ? 'Escribe el nombre de tu tienda.' : 'Escribe tu ciudad.', el: el }
    } else if (n === 'sucursales') {
      if (!/^\d{1,2}$/.test(v) || +v < 1) return { m: 'Escribe cuántas sucursales tienes, con número (por ejemplo 1).', el: el }
      v = String(+v)
    } else if (n === 'correo') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return { m: 'Escribe un correo válido, por ejemplo nombre@correo.com.', el: el }
    }
    datos[n] = v; el.value = v; return null
  }

  function pinta() {
    pasos.forEach(function (p, i) { p.hidden = i !== actual })
    var ultimo = actual === pasos.length - 1
    txt.textContent = 'Paso ' + (actual + 1) + ' de ' + pasos.length
    barra.setAttribute('aria-valuenow', actual + 1)
    relleno.style.width = Math.round((actual + 1) / pasos.length * 100) + '%'
    bAtras.hidden = actual === 0
    bSig.hidden = ultimo
    err.textContent = ''
    if (ultimo) {
      var f = [['Plan', datos.plan], ['Tienda', datos.tienda], ['Ciudad', datos.ciudad], ['Sucursales', datos.sucursales], ['Correo', datos.correo]]
      resumen.textContent = ''
      f.forEach(function (x) {
        var dt = document.createElement('dt'), dd = document.createElement('dd')
        dt.textContent = x[0]; dd.textContent = x[1]; resumen.appendChild(dt); resumen.appendChild(dd)
      })
      enlace.href = WA + '?text=' + encodeURIComponent(mensaje())
      enlace.setAttribute('data-plan', datos.plan)
    }
  }

  function enfoca() {
    var el = campo(actual) || pasos[actual].querySelector('input[name=plan]:checked') || pasos[actual].querySelector('input[name=plan]') || titulo(actual)
    if (el) el.focus()
  }

  function ir(i) { actual = i; pinta(); enfoca() }

  function siguiente() {
    var e = validar(actual)
    if (e) {
      err.textContent = e.m
      if (e.el.type !== 'radio') e.el.setAttribute('aria-invalid', 'true')
      e.el.setAttribute('aria-describedby', 'enc-err'); e.el.focus(); return
    }
    if (actual < pasos.length - 1) ir(actual + 1)
  }

  form.addEventListener('submit', function (ev) { ev.preventDefault(); if (actual < pasos.length - 1) siguiente() })
  form.addEventListener('input', function (ev) { if (ev.target.removeAttribute) { ev.target.removeAttribute('aria-invalid'); err.textContent = '' } })
  bAtras.addEventListener('click', function () { if (actual > 0) ir(actual - 1) })

  function abrir(plan, desde) {
    if (abierto) return
    abierto = true; quien = desde
    if (plan) { datos.plan = plan }
    var r = form.querySelector('input[name=plan][value="' + datos.plan + '"]'); if (r) r.checked = true
    // el resto de la página no recibe foco ni lector mientras la ventana está abierta
    aparte = [].slice.call(document.body.children).filter(function (e) { return e !== raiz && e.tagName !== 'SCRIPT' })
    aparte.forEach(function (e) { e.inert = true; e.setAttribute('aria-hidden', 'true') })
    raiz.hidden = false
    document.documentElement.classList.add('noscroll'); document.body.classList.add('noscroll')
    ir(0)
    document.dispatchEvent(new CustomEvent('encuesta:inicio', { detail: { plan: datos.plan } }))
  }

  function cerrar() {
    if (!abierto) return
    abierto = false; raiz.hidden = true
    aparte.forEach(function (e) { e.inert = false; e.removeAttribute('aria-hidden') }); aparte = []
    document.documentElement.classList.remove('noscroll'); document.body.classList.remove('noscroll')
    if (quien && quien.focus) quien.focus()
  }

  document.getElementById('enc-x').addEventListener('click', cerrar)
  raiz.addEventListener('mousedown', function (ev) { if (ev.target === raiz) cerrar() })
  document.addEventListener('keydown', function (ev) {
    if (!abierto) return
    if (ev.key === 'Escape') { ev.preventDefault(); cerrar(); return }
    if (ev.key !== 'Tab') return
    var f = [].slice.call(caja.querySelectorAll('button,input,a[href]')).filter(function (e) { return !e.hidden && !e.closest('[hidden]') && !e.disabled && e.offsetParent !== null })
    if (!f.length) return
    var a = document.activeElement, p = f[0], u = f[f.length - 1]
    if (ev.shiftKey && (a === p || !caja.contains(a))) { ev.preventDefault(); u.focus() }
    else if (!ev.shiftKey && (a === u || !caja.contains(a))) { ev.preventDefault(); p.focus() }
  })

  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[data-encuesta]') : null
    if (!a || ev.button !== 0 || ev.ctrlKey || ev.metaKey || ev.shiftKey) return
    ev.preventDefault(); abrir(a.getAttribute('data-encuesta'), a)
  })
})()
