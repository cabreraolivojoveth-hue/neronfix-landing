// Prueba de www.neronfix.com — página única de StorePhone (rediseño 23/10/2026).
// Uso: URL=http://127.0.0.1:8732/ SAL=/tmp/fotos REPO=/ruta/neronfix-landing node prueba-landing.mjs
// Con la página vieja (la de Celulares/Autos/Neron One) sale en ROJO a propósito.
// 01/11/2026 (etapa 1, más limpia): sin el sello rojo «StorePhone · por Neron», «Hecho para»
// en UNA línea que se recorre de lado (se detiene al tocarla/pasar el ratón; quieta con
// «reducir movimiento»), colores de Neron (vino/dorado/negro/blanco), contraste AA y sin
// scroll horizontal aunque el navegador no respete el recorte del body (iPhone). También
// revisa las 4 páginas para buscadores. Con la versión del 29/10 sale en ROJO.
import { chromium } from 'playwright'
import fs from 'fs'
const URL = process.env.URL || 'https://www.neronfix.com/'
const SAL = process.env.SAL || '/fotos'
const REPO = process.env.REPO || ''
// ESTADO (10/11/2026, ACUERDO #9 en dos pasos): la prueba decide por lo que SIRVE la portada. Sin etiqueta de Google = paso 1 (CSP normal, nada de Google);
// con la etiqueta = paso 2 (CSP con Google). Un estado a medias (etiqueta en unas paginas si y otras no, o CSP que no corresponde) sale en MAL.
const GOOGLE_ON = await (async () => { try { return /googletagmanager\.com\/gtag\/js\?id=AW-18555345517/.test(await (await fetch(URL)).text()) } catch { return false } })()
const WA = '5216462875283', WA_VISIBLE = '646 287 5283'
const PEDIR = 'Hola, quiero acceso a StorePhone'
const casos = []
const di = (ok, t, d = '') => { casos.push(!!ok); console.log(`${ok ? 'BIEN' : 'MAL '} | ${t}${d ? ' — ' + d : ''}`) }
const limpio = (s) => String(s || '').replace(/\s+/g, ' ').trim()
const nav = await chromium.launch({ executablePath: process.env.CHROMIUM })
const HECHO = 'Tiendas de celulares|Proveedores y distribuidores|Accesorios al mayoreo|Técnicos en reparación|Todo negocio de celulares'
const VINO = 'rgb(122, 18, 37)', VERDE_VIEJO = 'rgb(18, 140, 74)'
const RESENA_GOOGLE = 'https://g.page/r/CVudwG50ReTqEBM/review' // Perfil de Negocio de Neron (Joveth, 01/11/2026)
// Contraste AA de todo texto visible: 4.5 (3 si es grande), con el fondo real (se mezclan las transparencias)
const contraste = () => {
  const rgba = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const [r, g, b, a = '1'] = m[1].split(/[ ,/]+/).filter(Boolean); return [+r, +g, +b, +a] }
  const sobre = (f, b) => [0, 1, 2].map((i) => f[i] * f[3] + b[i] * (1 - f[3])).concat(1)
  const lum = (c) => { const [r, g, b] = c.slice(0, 3).map((v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
  const fondo = (el) => { const capas = []; for (let e = el; e; e = e.parentElement) { const c = rgba(getComputedStyle(e).backgroundColor); if (c && c[3] > 0) { capas.push(c); if (c[3] >= 1) break } } let f = [255, 255, 255, 1]; for (const c of capas.reverse()) f = sobre(c, f); return f }
  const malos = []; let vistos = 0
  for (const el of document.querySelectorAll('body *')) {
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue
    const cs = getComputedStyle(el), r = el.getBoundingClientRect()
    if (cs.visibility === 'hidden' || cs.display === 'none' || r.width === 0 || r.height === 0 || el.closest('[aria-hidden="true"]') || el.closest('.skip')) continue
    vistos++
    const f = fondo(el), t = sobre(rgba(cs.color), f), L1 = lum(t), L2 = lum(f)
    const cr = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
    const px = parseFloat(cs.fontSize), grande = px >= 24 || (px >= 18.66 && +cs.fontWeight >= 700)
    if (cr < (grande ? 3 : 4.5)) malos.push(`${el.tagName}.${el.className || ''} «${el.textContent.trim().slice(0, 24)}» ${cr.toFixed(2)}`)
  }
  return { vistos, malos }
}
// Desborde a lo ancho SIN el recorte del body (Safari del iPhone deja deslizar aunque el body recorte)
const sinRecorte = () => { const h = document.documentElement, b = document.body, a = [h.style.overflowX, b.style.overflowX]; h.style.overflowX = 'visible'; b.style.overflowX = 'visible'; const sobra = h.scrollWidth - innerWidth; const fuera = [...document.querySelectorAll('body *')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > innerWidth + 1 && !e.closest('.cinta, .carrusel__pista, .planes') }).map((e) => e.className || e.tagName).slice(0, 4); h.style.overflowX = a[0]; b.style.overflowX = a[1]; return { sobra, fuera } }
// La línea «Hecho para»: una sola línea, la copia igual a la lista, sin hueco al dar la vuelta
const linea = () => {
  const c = document.querySelector('.para .cinta'), listas = [...document.querySelectorAll('.para .cinta__lista')]
  if (!c || listas.length !== 2) return { ok: false, por: `cinta ${!!c}, listas ${listas.length}` }
  const txt = (l) => [...l.querySelectorAll('li')].map((li) => li.textContent.trim()).join('|')
  const tops = [...listas[0].querySelectorAll('li')].map((li) => Math.round(li.getBoundingClientRect().top))
  const rc = c.getBoundingClientRect(), para = document.querySelector('.para').getBoundingClientRect()
  return { ok: true, visibles: txt(listas[0]), copia: txt(listas[1]), copiaOculta: listas[1].getAttribute('aria-hidden') === 'true' && !listas[0].hasAttribute('aria-hidden'),
    unaLinea: Math.max(...tops) - Math.min(...tops) <= 2, alto: Math.round(para.height), dentro: rc.left >= -1 && rc.right <= innerWidth + 1,
    ancho: Math.round(rc.width), anchoCopia: Math.round(listas[0].getBoundingClientRect().width), recorta: getComputedStyle(c).overflowX !== 'visible' }
}
const posicion = () => { const p = document.querySelector('.cinta__pista'); return p ? new DOMMatrix(getComputedStyle(p).transform).m41 : NaN }
const sinSello = () => !document.querySelector('.eyebrow') && !/por Neron/i.test(document.querySelector('.hero')?.innerText || '')

// ── 1. Lo que ve un buscador: el HTML tal cual llega, sin ejecutar nada ──
const crudo = await (await fetch(URL)).text()
const sinComentarios = crudo.replace(/<!--[\s\S]*?-->/g, '')
const meta = (re) => (sinComentarios.match(re) || [])[1] || ''
const titulo = meta(/<title>([^<]*)<\/title>/)
di(/StorePhone/.test(titulo) && /tiendas de celulares/i.test(titulo) && titulo.length <= 65, 'SEO: título con StorePhone y «tiendas de celulares», máximo 65 letras', titulo)
const desc = meta(/<meta name="description" content="([^"]*)"/)
di(desc.length >= 110 && desc.length <= 160 && /IMEI/.test(desc) && /\$450/.test(desc), 'SEO: descripción de 110 a 160 letras con IMEI y el precio de entrada', `${desc.length} letras`)
di(/<html lang="es-MX">/.test(crudo), 'SEO: idioma es-MX')
di(meta(/<link rel="canonical" href="([^"]*)"/) === 'https://www.neronfix.com/', 'SEO: canonical a https://www.neronfix.com/')
di((sinComentarios.match(/<h1[\s>]/g) || []).length === 1, 'SEO: un solo h1 en el HTML')
di(/<h1>[^<]*tiendas de celulares[^<]*<\/h1>/i.test(sinComentarios), 'SEO: el h1 dice «tiendas de celulares» y viene en el HTML, no lo pinta un script')
const og = meta(/<meta property="og:image" content="([^"]*)"/), tw = meta(/<meta name="twitter:image" content="([^"]*)"/)
di(og && og === tw && meta(/og:image:width" content="(\d+)"/) === '1200' && meta(/og:image:height" content="(\d+)"/) === '630', 'SEO: Open Graph y Twitter con la misma imagen 1200×630', og)
// 02/11/2026: UN script propio, chico y diferido (opiniones.js, pedido por Joveth); nada de fuera
const scripts = [...crudo.matchAll(/<script[^>]+src="([^"]+)"[^>]*>/gi)].map((m) => m[0])
// 02/11/2026: + videos.js (fila de videos de YouTube), también propio y diferido
// 02/11/2026 (tarde): + movimiento.js (carruseles de planes y videos, aparecer al bajar)
// 06/11/2026: + medicion.js (marca propia de los toques a WhatsApp y etiqueta de Google lista, apagada)
// 10/11/2026 (ACUERDO #9): Google ENCENDIDO. En el head: gtag.js async con el ID y /etiqueta-google.js diferido; luego los 5 propios, todos diferidos
if (GOOGLE_ON) { di(scripts.length === 7 && /^<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=AW-18555345517">$/.test(scripts[0]) && /src="\/etiqueta-google\.js(\?v=\d+)?" defer/.test(scripts[1]) && /src="\/opiniones\.js(\?v=\d+)?"/.test(scripts[2]) && /src="\/videos\.js(\?v=\d+)?"/.test(scripts[3]) && /src="\/movimiento\.js(\?v=\d+)?"/.test(scripts[4]) && /src="\/medicion\.js(\?v=\d+)?"/.test(scripts[5]) && /src="\/encuesta\.js(\?v=\d+)?"/.test(scripts[6]) && scripts.slice(1).every((x) => /\bdefer\b/.test(x)) && (sinComentarios.match(/googletagmanager/g) || []).length === 1 && !/<link[^>]+stylesheet/i.test(crudo) && !/fonts\.googleapis|gsap|ScrollTrigger/i.test(crudo), 'Velocidad: gtag.js (async, AW-18555345517), /etiqueta-google.js y los 5 propios (diferidos), sin hojas externas, sin Google Fonts ni GSAP', scripts.join(' ')) } else { di(scripts.length === 5 && /src="\/opiniones\.js(\?v=\d+)?"/.test(scripts[0]) && /src="\/videos\.js(\?v=\d+)?"/.test(scripts[1]) && /src="\/movimiento\.js(\?v=\d+)?"/.test(scripts[2]) && /src="\/medicion\.js(\?v=\d+)?"/.test(scripts[3]) && /src="\/encuesta\.js(\?v=\d+)?"/.test(scripts[4]) && !/googletagmanager|gtag\(/.test(sinComentarios) && scripts.every((x) => /\bdefer\b/.test(x)) && !/<link[^>]+stylesheet/i.test(crudo) && !/fonts\.googleapis|gsap|ScrollTrigger/i.test(crudo), 'Velocidad: solo /opiniones.js, /videos.js, /movimiento.js, /medicion.js y /encuesta.js (propios y diferidos), sin hojas externas, sin Google Fonts ni GSAP', scripts.join(' ')) }
di(/<link rel="manifest" href="\/site.webmanifest">/.test(crudo) && /favicon-32\.png/.test(crudo) && /apple-touch-icon/.test(crudo), 'SEO: favicon, icono de Apple y manifest enlazados')

// JSON-LD
let ld = null
try { ld = JSON.parse(meta(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)) } catch (e) { di(false, 'JSON-LD: es JSON válido', String(e)) }
const grafo = ld?.['@graph'] || []
const tipo = (t) => grafo.find((n) => n['@type'] === t)
di(!!ld, 'JSON-LD: es JSON válido')
const app = tipo('SoftwareApplication')
const ofertas = (app?.offers || []).map((o) => `${o.name}:${o.price}:${o.priceCurrency}`).join(' ')
di(app?.name === 'StorePhone' && ofertas === 'Normal:450:MXN Premium:750:MXN Pro:1250:MXN', 'JSON-LD: SoftwareApplication StorePhone con los 3 planes en MXN', ofertas)
di((app?.offers || []).every((o) => o.priceSpecification?.valueAddedTaxIncluded === true), 'JSON-LD: los 3 planes dicen IVA incluido')
di(tipo('Organization')?.address?.addressLocality === 'Ensenada', 'JSON-LD: Organization con Ensenada')
di(!/aggregateRating|"Review"|ratingValue|schema\.org\/(Review|Rating)|itemprop="(review|rating)/i.test(crudo), 'JSON-LD: sin reseñas ni estrellas inventadas (ni marcado de reseñas)')
const faqLD = (tipo('FAQPage')?.mainEntity || []).map((q) => [q.name, q.acceptedAnswer?.text])
// 02/11/2026 (Joveth: «que Neron Fix salga SOLO como StorePhone»): la empresa se llama «Neron Fix», su ÚNICO
// producto es StorePhone (punto de venta para tiendas de celulares) y se liga a su YouTube y su perfil de Google.
const org = tipo('Organization'), apps = grafo.filter((n) => /SoftwareApplication|Product|Service/.test(String(n['@type'])))
di(org?.name === 'Neron Fix' && (org?.sameAs || []).includes('https://www.youtube.com/@neronfix') && (org?.sameAs || []).some((s) => /g\.page\/r\/CVudwG50ReTqEBM/.test(s)) && /logo-oficial\.png$/.test(org?.logo || ''), 'JSON-LD: Organization «Neron Fix» con logo oficial, YouTube y perfil de Google', `${org?.name} · ${(org?.sameAs || []).join(' ')}`)
const funciones = (app?.featureList || []).join(' | ')
di(apps.length === 1 && app?.publisher?.['@id'] === org?.['@id'] && app?.applicationCategory === 'BusinessApplication' && /tiendas de celulares/i.test(app?.applicationSubCategory || '') && [/IMEI/, /reparaci/i, /garant/i, /cr[eé]dito/i, /caja/i, /sin internet/i].every((re) => re.test(funciones)), 'JSON-LD: StorePhone es el ÚNICO producto de Neron Fix (punto de venta para tiendas de celulares: IMEI, reparaciones, garantías, créditos, caja, sin internet)', `${apps.length} producto(s) · ${funciones}`)

// ── 2. Lo que ve una persona, en tres anchos ──
for (const [ancho, alto, nombre] of [[1440, 900, '1440'], [820, 1180, '820'], [390, 844, '390']]) {
  const ctx = await nav.newContext({ viewport: { width: ancho, height: alto } })
  const pag = await ctx.newPage()
  const errores = [], fallidas = []
  pag.on('pageerror', (e) => errores.push(String(e)))
  pag.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()) })
  pag.on('requestfailed', (r) => fallidas.push(r.url()))
  let bytes = 0
  const cdp = await ctx.newCDPSession(pag); await cdp.send('Network.enable')
  // 02/11: las miniaturas de videos son diferidas (se cuentan aparte, abajo)
  const urls = new Map(); cdp.on('Network.responseReceived', (e) => urls.set(e.requestId, e.response.url))
  let bytesVideos = 0; cdp.on('Network.loadingFinished', (e) => { if (/\/videos\/[A-Za-z0-9_-]{11}\.jpg/.test(urls.get(e.requestId) || '')) bytesVideos += e.encodedDataLength; else bytes += e.encodedDataLength })
  // 10/11/2026: la red de Google se simula (sin salir a internet); su peso no cuenta en el de la pagina
  await pag.route((u) => /(^|\.)(googletagmanager\.com|googleadservices\.com|google\.com|google\.com\.mx|doubleclick\.net)$/.test(u.hostname), (r) => r.fulfill({ status: /gtag\/js/.test(r.request().url()) ? 200 : 204, contentType: 'text/javascript', body: '' }))
  await pag.goto(URL, { waitUntil: 'networkidle' })
  const todo = limpio(await pag.locator('body').innerText())
  const html = await pag.content()

  // Coherencia: alta cerrada, un solo programa
  di(!/crear (tu )?cuenta|sin tarjeta|1 mes|se contrata solo/i.test(todo), `${nombre}: nada de «crear cuenta», «sin tarjeta» ni «1 mes» (10/11/2026: «gratis» ya es la oferta de Joveth)`)
  di(/por invitación/.test(todo), `${nombre}: dice que el alta es por invitación`)
  di(!/Neron One|Neron Autos|\bAutos\b|terapia|masaje|Celulares, Autos/i.test(todo) && !/Neron One|Neron Autos|Terapias/i.test(html.replace(/<!--[\s\S]*?-->/g, '')), `${nombre}: ni Neron One, ni Autos, ni Terapias (pantalla, metadatos ni JSON-LD)`)
  di(!/Más elegido|clientes satisfechos|\+\d+ negocios|estrellas/i.test(todo), `${nombre}: sin cifras ni clientes inventados`)
  di(await pag.locator('h1').count() === 1 && /StorePhone/.test(todo), `${nombre}: un solo h1 y se nombra StorePhone`)
  // Encabezados en orden (no salta de h1 a h3)
  const saltos = await pag.evaluate(() => { let prev = 0, mal = []; for (const h of document.querySelectorAll('h1,h2,h3,h4,h5,h6')) { const n = +h.tagName[1]; if (n > prev + 1) mal.push(h.tagName + ':' + h.textContent.trim().slice(0, 20)); prev = n } return mal })
  di(saltos.length === 0, `${nombre}: encabezados en orden`, saltos.join(' '))

  // Lo que pidió Joveth
  for (const [re, t] of [[/Ensenada, Baja California/, 'Ensenada, Baja California'], [/platica(r|mos) en persona/, 'en Ensenada, en persona'], [/llamada, Google Meet o mensaje/, 'llamada, Google Meet o mensaje'], [/programadores y especialistas del área/, 'programadores y especialistas'], [/se personaliza/, 'se personaliza'], [/a la medida/, 'a la medida para empresas grandes'], [/Tu información es tuya/, 'tu información es tuya'], [/contrato de confidencialidad/, 'contrato de confidencialidad'], [/sin plazo forzoso/, 'con contrato y sin plazo forzoso']])
    di(re.test(todo), `${nombre}: dice «${t}»`)
  // «Hecho para»: los mismos 5 giros, en UNA línea que se recorre de lado (01/11/2026)
  const ln = await pag.evaluate(linea)
  di(ln.ok && ln.visibles === HECHO && ln.copia === HECHO && ln.copiaOculta, `${nombre}: «Hecho para» con los 5 giros (la copia para dar la vuelta, oculta a lectores)`, ln.visibles || ln.por)
  di(ln.ok && ln.unaLinea && ln.alto <= 64 && ln.dentro && ln.recorta, `${nombre}: «Hecho para» es UNA línea (no se desglosa hacia abajo) y no se sale de la pantalla`, `alto ${ln.alto}px`)
  di(ln.ok && ln.anchoCopia >= ln.ancho, `${nombre}: la línea no deja hueco al dar la vuelta`, `lista ${ln.anchoCopia}px / cinta ${ln.ancho}px`)
  const x0 = await pag.evaluate(posicion); await pag.waitForTimeout(700); const x1 = await pag.evaluate(posicion)
  di(Math.abs(x1 - x0) >= 2, `${nombre}: la línea se mueve sola`, `${x0.toFixed(1)} → ${x1.toFixed(1)}`)
  const hayCinta = await pag.locator('.para .cinta').count() === 1
  if (hayCinta) { await pag.locator('.para .cinta').hover(); await pag.waitForTimeout(150) }
  const h0 = await pag.evaluate(posicion); await pag.waitForTimeout(600); const h1 = await pag.evaluate(posicion)
  di(hayCinta && Math.abs(h1 - h0) < 0.5, `${nombre}: la línea se detiene al pasar el ratón`, `${h0.toFixed(1)} → ${h1.toFixed(1)}`)
  await pag.mouse.move(2, 2)
  di(await pag.evaluate(sinSello), `${nombre}: sin el sello rojo «StorePhone · por Neron» arriba del título`)
  // Colores de Neron: el botón principal (y el fijo) en vino con el icono de WhatsApp; nada del verde de antes
  const boton = await pag.evaluate(() => { const b = document.querySelector('.hero .cta a'); return [getComputedStyle(b).backgroundColor, !!b.querySelector('svg'), b.textContent.trim()] })
  di(boton[0] === VINO && boton[1] && boton[2] === 'Quiero acceso por WhatsApp', `${nombre}: «Quiero acceso por WhatsApp» en vino con el icono de WhatsApp`, boton.join(' · '))
  const marca = await pag.evaluate(() => { const v = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim().toLowerCase(); return [v('--wine'), v('--gold'), v('--ink')].join(' ') })
  const verdes = await pag.evaluate((V) => [...document.querySelectorAll('body *')].filter((e) => getComputedStyle(e).backgroundColor === V).length, VERDE_VIEJO)
  di(marca === '#7a1225 #c79a3e #111' && verdes === 0, `${nombre}: colores de Neron (vino, dorado, negro) y ningún fondo verde`, `${marca} · verdes ${verdes}`)
  // Opiniones (01/11/2026): solo el botón a Google, en otra pestaña; nada de reseñas ni estrellas en la página
  const op = await pag.evaluate((G) => [...document.querySelectorAll('a[href]')].filter((a) => a.getAttribute('href') === G).map((a) => [a.textContent.trim(), a.target, a.rel, getComputedStyle(a).backgroundColor, !!a.closest('#opiniones')]), RESENA_GOOGLE)
  di(op.length === 1 && op[0][0] === 'Déjanos tu opinión en Google' && op[0][1] === '_blank' && /noopener/.test(op[0][2]) && op[0][3] !== VINO && op[0][4], `${nombre}: botón «Déjanos tu opinión en Google» abre ${RESENA_GOOGLE} en otra pestaña (no es el botón principal)`, JSON.stringify(op))
  const sinResenas = await pag.evaluate(() => { const s = document.querySelector('#opiniones'); if (!s) return 'no hay sección'; const sig = s.compareDocumentPosition(document.querySelector('.cierre')) & Node.DOCUMENT_POSITION_FOLLOWING; return [s.querySelectorAll('blockquote, q, cite, [itemprop], [itemtype]').length === 0, !/★|☆|⭐|estrella|\d([.,]\d)?\s*\/\s*5/i.test(s.innerText), !!sig].join(',') })
  di(sinResenas === 'true,true,true', `${nombre}: la sección de opiniones va antes del cierre y no trae reseñas, estrellas ni citas`, sinResenas)

  // ── Lo de Joveth 02/11: sin internet (exacto), cualquier pantalla, Neri, YouTube y videos ──
  const dif = await pag.evaluate(() => { const s = document.getElementById('diferente'); if (!s) return null
    return { h3: [...s.querySelectorAll('h3')].map((h) => h.textContent.trim()).join('|'), txt: s.innerText.replace(/\s+/g, ' '), cta: s.querySelector('.cta a')?.textContent.trim(), ctaBg: s.querySelector('.cta a') ? getComputedStyle(s.querySelector('.cta a')).backgroundColor : '', despues: s.nextElementSibling?.id } })
  di(dif && dif.h3 === 'Funciona sin internet|Hecho para cualquier pantalla|Neri, tu ayudante con IA' && dif.cta === 'Quiero acceso por WhatsApp' && dif.ctaBg === VINO && dif.despues === 'planes', `${nombre}: «Sigue trabajando»: 3 tarjetas y termina en «Quiero acceso por WhatsApp» (vino), antes de los planes`, dif ? `${dif.h3} · ${dif.cta} · ${dif.despues}` : 'no hay sección')
  di(dif && /de contado/.test(dif.txt) && /abrir la caja/.test(dif.txt) && /se sube solo/.test(dif.txt) && /Equipos con IMEI, créditos, abonos, tarjeta o transferencia, devoluciones y cierre de caja esperan/.test(dif.txt), `${nombre}: «Funciona sin internet» dice lo que sí y lo que NO (IMEI, créditos, abonos, tarjeta, devoluciones, cierre)`)
  di(dif && /pregúntale cómo hacer algo en StorePhone o pídele revisar algo que no te cuadra/.test(dif.txt) && /Solo mira, no cambia nada/.test(dif.txt) && /WhatsApp/.test(dif.txt), `${nombre}: Neri con el texto de la app (solo mira) y la ayuda por WhatsApp`)
  const yts = await pag.evaluate(() => [...document.querySelectorAll('a[href*="youtube"], a[href*="youtu.be"]')].map((a) => [a.getAttribute('href'), a.target, a.rel, a.closest('#diferente') ? 'ayuda' : a.closest('.pie') ? 'pie' : a.closest('#videos') ? 'videos' : 'otro']))
  const canal = yts.filter((y) => y[0] === 'https://www.youtube.com/@neronfix'), vids = yts.filter((y) => /^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/.test(y[0]))
  di(yts.length >= 4 && canal.length + vids.length === yts.length && yts.every((y) => y[1] === '_blank' && /noopener/.test(y[2])) && ['ayuda', 'pie', 'videos'].every((d) => canal.some((c) => c[3] === d)), `${nombre}: YouTube: el canal es EXACTO https://www.youtube.com/@neronfix (ayuda, pie y «Ver todos»), los videos van a watch?v=…, en otra pestaña`, yts.filter((y) => !canal.includes(y) && !vids.includes(y)).map((y) => y[0]).join(' '))
  const car = await pag.evaluate(() => { const p = document.getElementById('videos-pista'); if (!p) return null; const a = [...p.querySelectorAll('a.video')]
    return { n: a.length, ok: a.every((x) => x.querySelector('img[loading="lazy"][width][height]') && x.querySelector('.video__play') && x.querySelector('.video__titulo')?.textContent.trim()), titulos: a.map((x) => x.querySelector('.video__titulo').textContent.trim()), imgs: a.map((x) => x.querySelector('img').src),
      corta: p.scrollWidth > p.clientWidth, snap: getComputedStyle(p).scrollSnapType, iframes: document.querySelectorAll('iframe').length } })
  di(car && car.n >= 1 && car.ok && car.iframes === 0 && /x/.test(car.snap), `${nombre}: «Aprende a usar StorePhone»: ${car?.n} videos con miniatura, play y título; sin reproductor cargado`, car ? `${car.n} · snap ${car.snap} · iframes ${car.iframes}` : 'no hay fila')
  if (car) {
    di(car.titulos.every((t) => crudo.includes(t.replace(/&/g, '&amp;'))), `${nombre}: los títulos de los videos vienen en el HTML (buscadores)`)
    const mins = await Promise.all(car.imgs.map(async (u) => { try { const r = await fetch(u); return r.status === 200 && /image\/jpeg/.test(r.headers.get('content-type') || '') } catch { return false } }))
    di(mins.every(Boolean), `${nombre}: las ${mins.length} miniaturas responden 200 (servidas por la página, no por YouTube)`)
    const pesoMin = (await Promise.all(car.imgs.map(async (u) => { try { return (await (await fetch(u)).arrayBuffer()).byteLength } catch { return 1e9 } }))).reduce((a, b) => a + b, 0)
    di(pesoMin < 200 * 1024, `${nombre}: las miniaturas juntas pesan menos de 200 KB (y se cargan al bajar)`, `${(pesoMin / 1024).toFixed(1)} KB`)
    if (ancho === 1440) {
      const fl = await pag.evaluate(async () => { const p = document.getElementById('videos-pista'), d = document.getElementById('videos-despues'); const vis = document.getElementById('videos-flechas').classList.contains('flechas--si'); if (!p.scrollWidth || p.scrollWidth <= p.clientWidth) return { vis, movio: 'no hace falta' }; d.click(); await new Promise((r) => setTimeout(r, 900)); return { vis, movio: p.scrollLeft > 50 } })
      di(fl.vis && fl.movio !== false, '1440: las flechas mueven la fila de videos', JSON.stringify(fl))
    }
  }
  const cr = await pag.evaluate(contraste)
  di(cr.vistos > 40 && cr.malos.length === 0, `${nombre}: contraste AA en todo texto (${cr.vistos} textos)`, cr.malos.slice(0, 4).join(' | '))

  // Planes (los de config.js del 02/10/2026)
  const precios = (await pag.locator('.plan .precio b').allInnerTexts()).join(' ')
  di(precios === '$450 $750 $1,250', `${nombre}: precios $450 · $750 · $1,250`, precios)
  const planes = pag.locator('.plan')
  di(await planes.count() === 3, `${nombre}: 3 planes`)
  const esperado = [['Normal', '2 usuarios · 1 sucursal'], ['Premium', '5 usuarios · 1 sucursal'], ['Pro', 'Usuarios ilimitados · 2 sucursales incluidas']]
  for (let i = 0; i < 3; i++) {
    const [n, lim] = esperado[i]; const t = limpio(await planes.nth(i).innerText())
    const href = await planes.nth(i).locator('a.btn').getAttribute('href')
    const texto = new globalThis.URL(href).searchParams.get('text')
    di(t.startsWith(n) && t.includes(lim) && href.startsWith(`https://wa.me/${WA}?`) && texto === `${PEDIR}, me interesa el plan ${n}`, `${nombre}: plan ${n} con «${lim}» y su botón abre WhatsApp con su mensaje`, texto)
  }
  di(/desde\s*\$1,250/i.test(limpio(await planes.nth(2).innerText())) && /\+\$280 al mes por cada sucursal extra/.test(await planes.nth(2).innerText()), `${nombre}: Pro «desde $1,250» y +$280 por sucursal extra`)
  di(/mes con mes, IVA incluido/.test(todo) && !/trimestral|anual/i.test(todo), `${nombre}: solo mensual, IVA incluido`)

  // Ligas: todo WhatsApp va al número de Joveth; «Entrar» es la única liga a StorePhone
  const ligas = await pag.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => [a.getAttribute('href'), a.textContent.trim()]))
  const was = ligas.filter(([h]) => /wa\.me|whatsapp/i.test(h))
  di(was.length >= 5 && was.every(([h]) => h.startsWith(`https://wa.me/${WA}?text=`) && new globalThis.URL(h).searchParams.get('text').startsWith(PEDIR)), `${nombre}: los ${was.length} botones de WhatsApp van al ${WA_VISIBLE} con «${PEDIR}…»`)
  di(todo.includes(WA_VISIBLE) && !/646 212 9495|646 178 1525/.test(todo), `${nombre}: el número visible es ${WA_VISIBLE} (no los de Versalles)`)
  const sp = ligas.filter(([h]) => /storephone\.neronfix\.com/.test(h))
  di(sp.length >= 1 && sp.every(([, t]) => /^Entra(r| a StorePhone)$/.test(t)), `${nombre}: StorePhone solo se liga para «Entrar» (el alta va por WhatsApp)`, sp.map((x) => x[1]).join('|'))
  const rotas = await pag.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href')).filter((h) => h.length > 1 && !document.querySelector(h)))
  di(rotas.length === 0, `${nombre}: ningún enlace interno roto`, rotas.join(' '))

  // FAQ visible = FAQ del JSON-LD
  const faqVis = await pag.evaluate(() => [...document.querySelectorAll('.faq details')].map((d) => [d.querySelector('summary').textContent.trim(), d.querySelector('p').textContent.replace(/\s+/g, ' ').trim()]))
  di(faqVis.length >= 4 && JSON.stringify(faqVis) === JSON.stringify(faqLD), `${nombre}: las preguntas del JSON-LD son idénticas a las visibles`, `${faqVis.length} visibles / ${faqLD.length} en JSON-LD`)

  // Imágenes con texto alternativo y tamaño
  const imgs = await pag.evaluate(() => [...document.images].map((i) => [i.getAttribute('src'), i.hasAttribute('alt'), i.getAttribute('width'), i.getAttribute('height'), i.naturalWidth, i.loading === 'lazy']))
  di(imgs.every(([, alt, w, h, nat, lazy]) => alt && w && h && (nat > 0 || lazy)), `${nombre}: imágenes con alt, ancho y alto, y cargadas`, JSON.stringify(imgs))

  // Que se vea bien
  const sobra = await pag.evaluate(() => document.documentElement.scrollWidth - innerWidth)
  di(sobra <= 0, `${nombre}: sin desborde horizontal`, `${sobra}px`)
  const sr = await pag.evaluate(sinRecorte)
  di(sr.sobra <= 0 && sr.fuera.length === 0, `${nombre}: sin scroll horizontal aunque se quite el recorte del body (iPhone)`, `${sr.sobra}px ${sr.fuera.join(' ')}`)
  // Las palabras de la línea salen de la pantalla a propósito (las recorta la cinta): se mide la cinta, no cada palabra
  // 02/11/2026: los planes son carrusel: las tarjetas fuera de la pista se recorren a propósito; se mide la pista
  const fuera = await pag.evaluate(() => [...document.querySelectorAll('.btn, .plan, .item, h1, h2, .para .cinta, .planes')].filter((e) => { const r = e.getBoundingClientRect(); const enPista = !e.classList.contains('planes') && !!e.closest('.planes'); return r.width > 0 && ((!enPista && (r.right > innerWidth + 1 || r.left < -1)) || (!e.classList.contains('cinta') && !e.classList.contains('planes') && e.scrollWidth > e.clientWidth + 1)) }).map((e) => e.className || e.tagName).slice(0, 5))
  di(fuera.length === 0, `${nombre}: ningún botón, tarjeta o título cortado o fuera de pantalla`, fuera.join(' '))
  // Ningún botón partido en dos renglones (01/11/2026: «Déjanos tu opinión en Google» se partía a 390)
  const partidos = await pag.evaluate(() => [...document.querySelectorAll('.btn')].filter((b) => { const r = b.getBoundingClientRect(); return r.width > 0 && r.height > 60 }).map((b) => `«${b.textContent.trim().slice(0, 30)}» ${Math.round(b.getBoundingClientRect().height)}px`))
  di(partidos.length === 0, `${nombre}: ningún botón partido en dos renglones`, partidos.join(' | '))
  const altoPag = await pag.evaluate(() => document.documentElement.scrollHeight)
  // 01/11/2026: +~200px a propósito en PC por la sección de opiniones que pidió Joveth (antes 4200)
  // 02/11/2026: + «Sigue trabajando» (3 tarjetas) y «Aprende a usar StorePhone» (videos), pedidos por Joveth (antes 4400/5600/7400)
  // 10/11/2026: +~140px en PC por la oferta de prueba gratis (hero y tarjetas de plan), pedida por Joveth
  const tope = ancho >= 1000 ? 6000 : ancho >= 700 ? 7600 : 9000
  di(altoPag <= tope, `${nombre}: página corta (máximo ${tope}px)`, `${altoPag}px`)
  di(bytes < 150 * 1024, `${nombre}: pesa menos de 150 KB`, `${(bytes / 1024).toFixed(1)} KB`)
  di(errores.length === 0, `${nombre}: consola sin errores`, errores.join(' | ').slice(0, 200))
  di(fallidas.length === 0, `${nombre}: ninguna petición fallida`, fallidas.join(' ').slice(0, 200))

  // Lo de abajo aparece al bajar: se recorre la página antes de la foto completa
  await pag.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight / 2) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)) } await new Promise((r) => setTimeout(r, 900)); scrollTo(0, 0) })
  await pag.screenshot({ path: `${SAL}/landing-${nombre}.png`, fullPage: true })
  await pag.screenshot({ path: `${SAL}/arriba-${nombre}.png` })
  await pag.evaluate(() => document.querySelector('#planes')?.scrollIntoView()); await pag.waitForTimeout(400)
  await pag.screenshot({ path: `${SAL}/planes-${nombre}.png` })
  await ctx.close()
}

// ── 2c. Opiniones de Google en vivo (02/11/2026): se pinta con datos, se esconde sin ellos ──
{
  const op = (n, extra = {}) => ({ actualizado: '2026-11-02T00:00:00Z', nombre: 'Neron Fix', promedio: 4.7, total: n, mapa: 'https://maps.google.com/?cid=16925729665941806427',
    opiniones: Array.from({ length: n }, (_, i) => ({ autor: `Cliente ${i + 1}`, perfil: 'https://www.google.com/maps/contrib/1', estrellas: 5 - (i % 2), cuando: 'hace una semana',
      texto: i === 0 ? '<img src=x onerror="window.__malo=1">Muy buen sistema, la caja cuadra al centavo y el inventario con IMEI me ahorra horas cada semana.' : 'Excelente atención por WhatsApp.' })), ...extra })
  const ver = async (ancho, cuerpo, estado = 200) => {
    const ctx = await nav.newContext({ viewport: { width: ancho, height: 900 } })
    const pag = await ctx.newPage(); const errores = []
    pag.on('pageerror', (e) => errores.push(String(e)))
    await pag.route('**/opiniones.json', (r) => r.fulfill({ status: estado, contentType: 'application/json', body: typeof cuerpo === 'string' ? cuerpo : JSON.stringify(cuerpo) }))
    await pag.goto(URL, { waitUntil: 'networkidle' }); await pag.waitForTimeout(300)
    const r = await pag.evaluate(() => { const s = document.getElementById('resenas'); const vis = !!s && !s.hidden && s.getBoundingClientRect().height > 0
      const listas = s ? s.querySelectorAll('.resenas__lista') : []
      return { vis, antes: s?.previousElementSibling?.id, prom: document.getElementById('resenas-promedio')?.textContent, total: document.getElementById('resenas-total')?.textContent,
        tarjetas: listas[0]?.querySelectorAll('.resena').length || 0, copias: listas.length, imgs: s ? s.querySelectorAll('img').length : -1, malo: !!window.__malo,
        txt: listas[0]?.querySelector('.resena__txt')?.textContent || '', corre: document.getAnimations().some((a) => a.effect?.target?.id === 'resenas-pista' && a.playState === 'running'),
        relleno: document.getElementById('resenas-relleno')?.style.width, oro: getComputedStyle(document.getElementById('resenas-relleno') || document.body).color, cinta: !document.getElementById('resenas-cinta')?.hidden } })
    const sr = await pag.evaluate(sinRecorte)
    return { r, sr, errores, pag, ctx }
  }
  for (const ancho of [1440, 390]) {
    const { r, sr, errores, pag, ctx } = await ver(ancho, op(3))
    di(r.vis && r.antes === 'funciones', `${ancho}: con opiniones, la línea sale justo después de «Lo que resuelve»`, `${r.vis} ${r.antes}`)
    di(r.prom === '4.7' && r.total === '· 3 calificaciones' && r.relleno === '94%' && r.oro === 'rgb(199, 154, 62)', `${ancho}: promedio, total y estrellas DORADAS como los da Google`, `${r.prom} ${r.total} ${r.relleno} ${r.oro}`)
    di(r.tarjetas === 3 && r.copias === 2 && r.corre, `${ancho}: 3 tarjetas en una línea que se recorre`, `${r.tarjetas} tarjetas · ${r.copias} listas · corre ${r.corre}`)
    di(r.imgs === 0 && !r.malo && r.txt.startsWith('<img'), `${ancho}: el texto de una opinión se pinta como texto, nunca como HTML`, `imgs ${r.imgs} malo ${r.malo}`)
    di(sr.sobra <= 0 && sr.fuera.length === 0 && errores.length === 0, `${ancho}: con opiniones, sin scroll de lado y sin errores`, `${sr.sobra}px ${errores.join(' ')}`)
    await pag.evaluate(() => document.getElementById('resenas').scrollIntoView({ block: 'center' })); await pag.waitForTimeout(500)
    await pag.screenshot({ path: `${SAL}/opiniones-${ancho}.png` })
    await ctx.close()
  }
  { const { r, ctx, pag } = await ver(390, op(1)); di(r.vis && r.tarjetas === 1 && r.copias === 1 && !r.corre, '390: con UNA opinión, una tarjeta quieta (sin copia que se recorra)', `${r.tarjetas} ${r.copias} ${r.corre}`)
    await pag.evaluate(() => document.getElementById('resenas').scrollIntoView({ block: 'center' })); await pag.waitForTimeout(300); await pag.screenshot({ path: `${SAL}/opiniones-una-390.png` }); await ctx.close() }
  { const { r, ctx } = await ver(390, op(0, { total: 2, promedio: 5 })); di(r.vis && !r.cinta && r.prom === '5.0' && r.total === '· 2 calificaciones', '390: con calificaciones sin texto, solo estrellas y total (sin tarjetas)', `${r.vis} ${r.cinta} ${r.prom} ${r.total}`); await ctx.close() }
  { const { r, ctx } = await ver(390, op(0, { total: 0, promedio: 0 })); di(!r.vis, '390: sin calificaciones, la línea NO se pinta'); await ctx.close() }
  { const { r, ctx } = await ver(390, 'no existe', 404); di(!r.vis, '390: si no hay /opiniones.json (404), la línea NO se pinta'); await ctx.close() }
  { const { r, ctx, errores } = await ver(390, '{roto', 200); di(!r.vis && errores.length === 0, '390: si el archivo viene roto, no se pinta y no truena'); await ctx.close() }
}

// ── 2b. «Reducir movimiento» y el dedo en el teléfono ──
{
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  const pag = await ctx.newPage(); await pag.goto(URL, { waitUntil: 'networkidle' }); await pag.waitForTimeout(300)
  const q = await pag.evaluate(() => { const c = document.querySelector('.para .cinta'), p = document.querySelector('.cinta__pista'), copia = document.querySelectorAll('.cinta__lista')[1]
    if (!c || !p || !copia) return { corriendo: document.getAnimations().filter((a) => a.playState === 'running').length, quieta: false, movida: 0, copia: 'no hay línea' }
    const x0 = c.scrollLeft; c.scrollLeft = 120; const movida = c.scrollLeft - x0; c.scrollLeft = 0
    return { corriendo: document.getAnimations().filter((a) => a.playState === 'running').length, quieta: getComputedStyle(p).transform === 'none', movida, copia: getComputedStyle(copia).display }})
  di(q.corriendo === 0 && q.quieta, '390 con «reducir movimiento»: nada se mueve (ni la línea ni la portada)', `animaciones corriendo ${q.corriendo}`)
  di(q.movida >= 100 && q.copia === 'none', '390 con «reducir movimiento»: la línea se recorre con el dedo y sin la copia', `se recorrió ${q.movida}px · copia ${q.copia}`)
  const sr = await pag.evaluate(sinRecorte)
  di(sr.sobra <= 0 && sr.fuera.length === 0, '390 con «reducir movimiento»: sin scroll horizontal', `${sr.sobra}px`)
  await pag.screenshot({ path: `${SAL}/quieta-390.png` })
  await ctx.close()
  const tc = await nav.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 })
  const tp = await tc.newPage(); await tp.goto(URL, { waitUntil: 'networkidle' }); await tp.waitForTimeout(700)
  const hayCintaT = await tp.locator('.para .cinta').count() === 1
  if (hayCintaT) { await tp.locator('.para .cinta').tap(); await tp.waitForTimeout(150) }
  const t0 = await tp.evaluate(posicion); await tp.waitForTimeout(600); const t1 = await tp.evaluate(posicion)
  di(hayCintaT && Math.abs(t1 - t0) < 0.5, '390 con el dedo: la línea se detiene al tocarla', `${t0.toFixed(1)} → ${t1.toFixed(1)}`)
  const sr2 = await tp.evaluate(sinRecorte)
  di(sr2.sobra <= 0, '390 como teléfono (táctil): sin scroll horizontal', `${sr2.sobra}px`)
  await tc.close()
}

// ── 2c. Las 4 páginas para buscadores: mismos colores y la misma línea ──
for (const ruta of ['control-de-imei/', 'punto-de-venta-con-creditos/', 'sistema-para-celulares-monterrey/', 'sistema-para-celulares-cdmx/']) {
  const u = new globalThis.URL(ruta, URL).href
  const crudoP = (await (await fetch(u)).text()).replace(/<!--[\s\S]*?-->/g, '')
  const canon = (crudoP.match(/<link rel="canonical" href="([^"]*)"/) || [])[1], tit = (crudoP.match(/<title>([^<]*)<\/title>/) || [])[1] || ''
  di(canon === 'https://www.neronfix.com/' + ruta && /StorePhone/.test(tit) && (crudoP.match(/<h1[\s>]/g) || []).length === 1, `/${ruta}: canónica, título y un solo h1`, tit)
  let ldP = null; try { ldP = JSON.parse((crudoP.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/) || [])[1]) } catch {}
  di(ldP?.['@type'] === 'SoftwareApplication' && ldP?.name === 'StorePhone' && ldP?.publisher?.name === 'Neron Fix' && ldP?.publisher?.['@id'] === 'https://www.neronfix.com/#organizacion', `/${ruta}: JSON-LD válido, StorePhone de «Neron Fix»`, ldP ? `${ldP['@type']} · ${ldP.publisher?.name}` : 'sin JSON-LD válido')
  for (const [ancho, alto] of [[390, 844], [1440, 900]]) {
    const ctx = await nav.newContext({ viewport: { width: ancho, height: alto } })
    const pag = await ctx.newPage(); const errores = []
    pag.on('pageerror', (e) => errores.push(String(e))); pag.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()) })
    await pag.goto(u, { waitUntil: 'networkidle' }); await pag.waitForTimeout(400)
    const ln = await pag.evaluate(linea), sr = await pag.evaluate(sinRecorte), cr = await pag.evaluate(contraste)
    const boton = await pag.evaluate(() => { const b = document.querySelector('.hero .cta a'); return b ? [getComputedStyle(b).backgroundColor, !!b.querySelector('svg')] : ['sin botón', false] })
    const x0 = await pag.evaluate(posicion); await pag.waitForTimeout(600); const x1 = await pag.evaluate(posicion)
    const was = await pag.evaluate(() => [...document.querySelectorAll('a[href*="wa.me"]')].map((a) => a.getAttribute('href')))
    di(await pag.evaluate(sinSello) && ln.ok && ln.visibles === HECHO && ln.unaLinea && ln.dentro && ln.anchoCopia >= ln.ancho && Math.abs(x1 - x0) >= 2, `/${ruta} ${ancho}: sin sello, «Hecho para» en una línea que se mueve`, ln.visibles || ln.por)
    di(boton[0] === VINO && boton[1] && was.length >= 2 && was.every((h) => h.startsWith(`https://wa.me/${WA}?text=`)), `/${ruta} ${ancho}: botón vino con icono y WhatsApp al ${WA_VISIBLE}`, boton.join(' · '))
    di(sr.sobra <= 0 && sr.fuera.length === 0 && cr.malos.length === 0 && errores.length === 0, `/${ruta} ${ancho}: sin scroll horizontal, contraste AA (${cr.vistos} textos) y sin errores`, `${sr.sobra}px ${cr.malos.slice(0, 3).join(' | ')} ${errores.join(' ').slice(0, 120)}`)
    if (ruta === 'control-de-imei/') await pag.screenshot({ path: `${SAL}/imei-${ancho}.png`, fullPage: true })
    await ctx.close()
  }
}

// ── 2d2. Condiciones de «Recomienda StorePhone» (Joveth 02/11/2026): página propia, los 6 puntos, enlace en el pie ──
{
  const PUNTOS = [
    'Pueden participar los negocios que ya usan StorePhone con su mensualidad al corriente.',
    'La recomendación cuenta cuando la tienda nueva nos escribe diciendo de parte de qué negocio viene (el botón «Recomendar a una tienda» del sistema ya lo pone en el mensaje), no era cliente ni estaba ya en plática con nosotros, y cierra el trato: firma su contrato y empieza a usar el sistema.',
    'Beneficio: 10% de descuento en la siguiente mensualidad del negocio que recomendó. Se da una sola vez por negocio y no se suma: aunque recomiende varias tiendas, el descuento es 10%.',
    'El equipo de Neron Fix confirma por WhatsApp cuando la recomendación cuenta y en qué mensualidad se aplica.',
    'El descuento no se cambia por dinero ni se pasa a otro negocio.',
    'Neron Fix puede cambiar o terminar el programa avisando en esta página; las recomendaciones ya confirmadas se respetan.',
  ]
  const u = new globalThis.URL('recomienda/', URL).href
  let st = 0, crudoR = ''; try { const r = await fetch(u); st = r.status; crudoR = (await r.text()).replace(/<!--[\s\S]*?-->/g, '') } catch {}
  const canon = (crudoR.match(/<link rel="canonical" href="([^"]*)"/) || [])[1]
  di(st === 200 && canon === 'https://www.neronfix.com/recomienda/' && (crudoR.match(/<h1[\s>]/g) || []).length === 1, '/recomienda/: existe (200), canónica y un solo h1', `${st} ${canon || ''}`)
  const enPie = await (async () => { const c = await nav.newContext({ viewport: { width: 1280, height: 900 } }); const p = await c.newPage(); await p.goto(URL, { waitUntil: 'networkidle' })
    const a = await p.evaluate(() => [...document.querySelectorAll('footer.pie a')].filter((x) => x.getAttribute('href') === '/recomienda/').map((x) => x.textContent.trim())); await c.close(); return a })()
  di(enPie.length === 1 && enPie[0] === 'Programa de recomendación', 'Portada: enlace «Programa de recomendación» en el pie → /recomienda/', enPie.join(' | ') || 'no está')
  for (const [ancho, alto] of [[390, 844], [1280, 900]]) {
    const ctx = await nav.newContext({ viewport: { width: ancho, height: alto } })
    const pag = await ctx.newPage(); const errores = []
    pag.on('pageerror', (e) => errores.push(String(e))); pag.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()) })
    let ok = false; try { ok = (await pag.goto(u, { waitUntil: 'networkidle' }))?.status() === 200 } catch {}
    if (!ok) { di(false, `/recomienda/ ${ancho}: abre`, 'no responde'); await ctx.close(); continue }
    const d = await pag.evaluate(() => ({ h1: document.querySelector('h1')?.textContent.trim(), titulo: document.title,
      puntos: [...document.querySelectorAll('ol.puntos > li')].map((li) => li.textContent.replace(/\s+/g, ' ').trim()),
      vigente: document.body.innerText.includes('Vigente desde el 2 de noviembre de 2026.'),
      wa: [...document.querySelectorAll('a[href*="wa.me"]')].map((a) => a.getAttribute('href')), tel: document.body.innerText.includes('646 287 5283'),
      logo: document.querySelector('.brand img')?.getAttribute('src'), scripts: [...document.scripts].filter((s) => !s.src || s.src.startsWith(location.origin) || /gtag\/js\?id=AW-18555345517$/.test(s.src)).length }))
    di(d.h1 === 'Recomienda StorePhone — condiciones' && /^Recomienda StorePhone — condiciones/.test(d.titulo), `/recomienda/ ${ancho}: título «Recomienda StorePhone — condiciones»`, `${d.h1} · ${d.titulo}`)
    const faltan = PUNTOS.filter((t, i) => d.puntos[i] !== t)
    di(d.puntos.length === 6 && faltan.length === 0, `/recomienda/ ${ancho}: los 6 puntos, en orden y con el texto exacto`, `${d.puntos.length} puntos${faltan.length ? ' · distinto: ' + faltan.map((t) => t.slice(0, 30)).join(' | ') : ''}`)
    di(d.vigente && d.tel && d.wa.length >= 1 && d.wa.every((h) => h.startsWith(`https://wa.me/${WA}`)) && d.logo === '/logo-oficial-cabecera.png' && d.scripts === (GOOGLE_ON ? 2 : 0), `/recomienda/ ${ancho}: vigencia, WhatsApp ${WA_VISIBLE}, logo oficial y ${GOOGLE_ON ? 'solo los 2 scripts de la etiqueta de Google' : 'sin scripts'}`, `${d.wa.join(' ')} · ${d.logo} · scripts ${d.scripts}`)
    const sr = await pag.evaluate(sinRecorte), sobra = await pag.evaluate(() => document.documentElement.scrollWidth - innerWidth), cr = await pag.evaluate(contraste)
    di(sobra <= 0 && sr.sobra <= 0 && sr.fuera.length === 0 && cr.malos.length === 0 && errores.length === 0, `/recomienda/ ${ancho}: sin desborde, contraste AA (${cr.vistos} textos) y sin errores`, `${sobra}px ${sr.sobra}px ${sr.fuera.join(' ')} ${cr.malos.slice(0, 3).join(' | ')} ${errores.join(' ').slice(0, 120)}`)
    await pag.screenshot({ path: `${SAL}/recomienda-${ancho}.png`, fullPage: true })
    await ctx.close()
  }
}

// ── 2e. Carruseles (Joveth 02/11/2026): planes con flechas y puntitos; videos que avanzan solos ──
{
  const planesDe = () => { const p = document.getElementById('planes-pista') || document.querySelector('.planes'), ctrl = document.getElementById('planes-ctrl')
    if (!p) return null; const c = [...p.querySelectorAll('.plan')], pr = p.getBoundingClientRect()
    const vis = (e) => { const r = e.getBoundingClientRect(); return r.left >= pr.left - 1 && r.right <= pr.right + 1 }
    const puntos = [...document.querySelectorAll('#planes-puntos .punto')]
    return { snap: getComputedStyle(p).scrollSnapType, desliza: p.scrollWidth > p.clientWidth + 2, scroll: p.scrollLeft, n: c.length, visibles: c.filter(vis).map((e) => e.querySelector('h3').textContent),
      unaFila: new Set(c.map((e) => Math.round(e.getBoundingClientRect().top))).size === 1, ctrl: ctrl ? getComputedStyle(ctrl).display : 'no hay', puntos: puntos.length,
      activo: puntos.findIndex((b) => b.getAttribute('aria-current') === 'true'), flechas: [...document.querySelectorAll('#planes-ctrl .flecha')].filter((b) => b.getBoundingClientRect().width > 0).length }
  }
  for (const [ancho, alto] of [[390, 844], [768, 1024], [1280, 800]]) {
    const ctx = await nav.newContext(ancho === 390 ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 } : { viewport: { width: ancho, height: alto } })
    const pag = await ctx.newPage(); const errores = []; pag.on('pageerror', (e) => errores.push(String(e)))
    await pag.goto(URL, { waitUntil: 'networkidle' }); await pag.waitForTimeout(400)
    await pag.evaluate(() => document.querySelector('#planes')?.scrollIntoView()); await pag.waitForTimeout(900)
    const a = await pag.evaluate(planesDe)
    if (ancho === 1280) {
      di(a && a.n === 3 && a.unaFila && a.visibles.length === 3 && !a.desliza && a.ctrl === 'none', '1280: los 3 planes caben juntos en una fila (sin flechas ni puntitos que sobren)', JSON.stringify(a))
    } else {
      di(a && /x/.test(a.snap) && a.desliza && a.n === 3 && a.unaFila && a.puntos === 3 && a.ctrl !== 'none', `${ancho}: los planes son carrusel de una fila que se desliza, con 3 puntitos`, JSON.stringify(a))
      di(a && a.activo === 1 && a.visibles.includes('Premium'), `${ancho}: arranca con el plan Recomendado (Premium) a la vista y su puntito marcado`, a ? `activo ${a.activo} · se ven ${a.visibles.join(',')}` : '')
      if (ancho === 390) {
        // Deslizar con el dedo de verdad (eventos táctiles), hacia la izquierda
        const cdp = await ctx.newCDPSession(pag); const caja = await pag.locator('.planes').first().boundingBox({ timeout: 3000 }).catch(() => null)
        const y = caja ? caja.y + caja.height / 2 : 400, t = (type, x) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] })
        await t('touchStart', 330); for (let x = 320; x >= 90; x -= 23) { await t('touchMove', x); await pag.waitForTimeout(16) } await t('touchEnd'); await pag.waitForTimeout(1200)
        const b = await pag.evaluate(planesDe)
        di(b && b.scroll > a.scroll + 100 && b.activo === 2 && b.flechas === 0, '390: con el dedo se desliza al plan Pro y el puntito lo sigue (sin flechas en el teléfono)', b ? `${a.scroll}→${b.scroll} · activo ${b.activo} · flechas ${b.flechas}` : '')
      } else {
        const b0 = await pag.evaluate(planesDe)
        if (b0 && b0.flechas === 2) { await pag.click('#planes-despues'); await pag.waitForTimeout(900) }
        const b = await pag.evaluate(planesDe)
        if (b && b0.flechas === 2) { await pag.click('#planes-puntos .punto >> nth=0'); await pag.waitForTimeout(900) }
        const c = await pag.evaluate(planesDe)
        di(b0?.flechas === 2 && b?.activo === 2 && c?.activo === 0 && c?.scroll < 5, `${ancho}: en computadora las flechas y los puntitos mueven los planes`, b ? `flechas ${b0?.flechas} · tras flecha ${b.activo} · tras puntito ${c.activo}` : '')
        await pag.click('#planes-puntos .punto >> nth=1').catch(() => {}); await pag.waitForTimeout(700)
      }
    }
    const sr = await pag.evaluate(sinRecorte), sobra = await pag.evaluate(() => document.documentElement.scrollWidth - innerWidth)
    di(sobra <= 0 && sr.sobra <= 0 && sr.fuera.length === 0 && errores.length === 0, `${ancho}: con los carruseles, sin desborde horizontal y sin errores`, `${sobra}px ${sr.sobra}px ${sr.fuera.join(' ')} ${errores.join(' ')}`)
    await pag.evaluate(() => document.querySelector('#planes')?.scrollIntoView()); await pag.waitForTimeout(500)
    await pag.screenshot({ path: `${SAL}/carrusel-planes-${ancho}.png` })
    await pag.evaluate(() => document.querySelector('#videos')?.scrollIntoView()); await pag.waitForTimeout(700)
    await pag.screenshot({ path: `${SAL}/carrusel-videos-${ancho}.png` })
    await ctx.close()
  }
  // Videos: avanza solo; se detiene con el ratón encima, con el dedo y fuera de pantalla
  const vid = () => { const p = document.getElementById('videos-pista'); return p ? { x: Math.round(p.scrollLeft), auto: p.dataset.auto || '' } : { x: -1, auto: 'no hay' } }
  const alVideo = async (pag) => { await pag.evaluate(() => document.getElementById('videos').scrollIntoView({ block: 'center' })) }
  {
    const ctx = await nav.newContext({ viewport: { width: 1280, height: 800 } }); const pag = await ctx.newPage()
    await pag.goto(URL, { waitUntil: 'networkidle' }); await pag.mouse.move(5, 5)
    // Aparecer al bajar: lo de abajo empieza escondido y aparece al llegar
    const rv0 = await pag.evaluate(() => { const e = document.querySelector('#preguntas .rv'); return e ? [e.classList.contains('rv-espera'), getComputedStyle(e).opacity] : ['no hay'] })
    await pag.evaluate(() => document.getElementById('preguntas').scrollIntoView()); await pag.waitForTimeout(1500)
    const rv1 = await pag.evaluate(() => { const e = document.querySelector('#preguntas .rv'); return e ? [e.classList.contains('rv-espera'), getComputedStyle(e).opacity, getComputedStyle(e).transform] : ['no hay'] })
    di(rv0[0] === true && rv1[0] === false && rv1[1] === '1' && rv1[2] === 'none', '1280: lo de abajo aparece al bajar (opacidad y 12px) y queda quieto en su lugar', `${rv0.join(' ')} → ${rv1.join(' ')}`)
    await alVideo(pag); await pag.waitForTimeout(400); const v0 = await pag.evaluate(vid)
    await pag.waitForTimeout(5600); const v1 = await pag.evaluate(vid)
    di(v1.x > v0.x + 50 && v1.auto === 'corre', '1280: la fila de videos avanza sola', `${v0.x}→${v1.x} · ${v1.auto}`)
    const caja = (await pag.locator('#videos-pista').boundingBox({ timeout: 3000 }).catch(() => null)) || { x: 600, y: 400, width: 0, height: 0 }; await pag.mouse.move(caja.x + caja.width / 2, caja.y + caja.height / 2)
    await pag.waitForTimeout(800); const v2 = await pag.evaluate(vid); await pag.waitForTimeout(6000); const v3 = await pag.evaluate(vid)
    di(v3.x === v2.x && v3.auto === 'pausa', '1280: con el ratón encima, la fila de videos se detiene', `${v2.x}→${v3.x} · ${v3.auto}`)
    await pag.mouse.move(5, 5); await pag.evaluate(() => scrollTo(0, 0)); await pag.waitForTimeout(500); const v4 = await pag.evaluate(vid); await pag.waitForTimeout(6000); const v5 = await pag.evaluate(vid)
    di(v5.x === v4.x && v5.auto === 'pausa', '1280: con la fila fuera de pantalla, no avanza', `${v4.x}→${v5.x} · ${v5.auto}`)
    await ctx.close()
  }
  {
    const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 }); const pag = await ctx.newPage()
    await pag.goto(URL, { waitUntil: 'networkidle' }); await alVideo(pag); await pag.waitForTimeout(400)
    const v0 = await pag.evaluate(vid); await pag.waitForTimeout(5600); const v1 = await pag.evaluate(vid)
    di(v1.x > v0.x + 50 && v1.auto === 'corre', '390 (táctil): la fila de videos avanza sola', `${v0.x}→${v1.x} · ${v1.auto}`)
    const cdp = await ctx.newCDPSession(pag); const caja = (await pag.locator('#videos-pista').boundingBox({ timeout: 3000 }).catch(() => null)) || { x: 20, y: 400 }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: caja.x + 40, y: caja.y + 60 }] }); await pag.waitForTimeout(600)
    const v2 = await pag.evaluate(vid); await pag.waitForTimeout(6000); const v3 = await pag.evaluate(vid)
    di(v3.x === v2.x && v3.auto === 'pausa', '390 (táctil): al tocarla se detiene', `${v2.x}→${v3.x} · ${v3.auto}`)
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await pag.waitForTimeout(10000); const v4 = await pag.evaluate(vid)
    di(v4.x !== v3.x && v4.auto === 'corre', '390 (táctil): unos segundos después de soltarla sigue sola', `${v3.x}→${v4.x} · ${v4.auto}`)
    await ctx.close()
  }
  {
    const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' }); const pag = await ctx.newPage()
    await pag.goto(URL, { waitUntil: 'networkidle' }); await alVideo(pag); await pag.waitForTimeout(6500); const v = await pag.evaluate(vid)
    const escondidos = await pag.evaluate(() => document.querySelectorAll('.rv-espera').length)
    di(v.x === 0 && v.auto === 'quieto' && escondidos === 0, '390 con «reducir movimiento»: la fila de videos NO avanza sola y nada se esconde para aparecer', `x ${v.x} · ${v.auto} · escondidos ${escondidos}`)
    await ctx.close()
  }
}

// ── 2d. Videos: la fila se repinta con /videos.json (como texto) y el cron no borra la lista si el RSS falla ──
{
  const ver = async (cuerpo, estado = 200) => {
    const ctx = await nav.newContext({ viewport: { width: 390, height: 844 } }); const pag = await ctx.newPage(); const errores = []
    pag.on('pageerror', (e) => errores.push(String(e)))
    await pag.route('**/videos.json', (r) => r.fulfill({ status: estado, contentType: 'application/json', body: typeof cuerpo === 'string' ? cuerpo : JSON.stringify(cuerpo) }))
    await pag.goto(URL, { waitUntil: 'networkidle' }); await pag.waitForTimeout(300)
    const r = await pag.evaluate(() => { const a = [...document.querySelectorAll('#videos-pista a.video')]; return { n: a.length, ids: a.map((x) => x.dataset.id).join(','), malo: !!window.__malo, imgsRaras: document.querySelectorAll('#videos-pista img:not([src^="/videos/"])').length, primero: a[0]?.querySelector('.video__titulo')?.textContent } })
    const sr = await pag.evaluate(sinRecorte); await ctx.close(); return { r, sr, errores }
  }
  const html0 = (await (await fetch(URL)).text()).match(/data-id="[A-Za-z0-9_-]{11}"/g) || []
  { const { r, sr, errores } = await ver({ videos: [{ id: 'AAAAAAAAAAA', titulo: '<img src=x onerror="window.__malo=1">Video nuevo' }, { id: 'malo', titulo: 'id inválido' }, { id: 'BBBBBBBBBBB', titulo: 'Otro video' }] })
    di(r.n === 2 && r.ids === 'AAAAAAAAAAA,BBBBBBBBBBB' && !r.malo && r.imgsRaras === 0 && r.primero.startsWith('<img'), '390: con un video nuevo en /videos.json la fila se repinta sola (como texto; ids raros fuera)', JSON.stringify(r))
    di(sr.sobra <= 0 && errores.length === 0, '390: con la fila repintada, sin scroll de lado y sin errores', `${sr.sobra}px ${errores.join(' ')}`) }
  { const { r } = await ver('no existe', 404); di(r.n === html0.length && r.n >= 1, '390: sin /videos.json (404) se queda la lista del HTML', `${r.n} / ${html0.length}`) }
  { const { r, errores } = await ver('{roto'); di(r.n === html0.length && errores.length === 0, '390: /videos.json roto: se queda la del HTML y no truena') }
  // El cron (neron-landing/videos.py) con el RSS caído o vacío NO borra la última lista buena
  const { execFileSync } = await import('child_process'); const os = await import('os'); const path = await import('path')
  const cron = process.env.VIDEOS_PY || '/home/joveth/neron/neron-landing/videos.py', tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'videos-'))
  const lista = JSON.stringify({ actualizado: 'x', videos: [{ id: 'QLFRXqWBjIc', titulo: 'Entradas, salidas y retiros de caja', publicado: '2026-11-02' }] })
  fs.mkdirSync(tmp + '/videos'); fs.writeFileSync(tmp + '/videos.json', lista); fs.writeFileSync(tmp + '/videos/QLFRXqWBjIc.jpg', Buffer.from([0xff, 0xd8, 0xff, 0xe0]))
  const correr = (rss) => { try { execFileSync('python3', [cron], { env: { ...process.env, VIDEOS_RSS: rss, VIDEOS_DATOS: tmp }, stdio: 'pipe' }); return 0 } catch (e) { return e.status } }
  const c1 = correr('http://127.0.0.1:9/no-hay'); const igual1 = fs.readFileSync(tmp + '/videos.json', 'utf8') === lista
  fs.writeFileSync(tmp + '/vacio.xml', '<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom"></feed>')
  const c2 = correr('file://' + tmp + '/vacio.xml'); const igual2 = fs.readFileSync(tmp + '/videos.json', 'utf8') === lista && fs.existsSync(tmp + '/videos/QLFRXqWBjIc.jpg')
  fs.writeFileSync(tmp + '/bueno.xml', '<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom" xmlns:yt="http://www.youtube.com/xml/schemas/2015"><entry><yt:videoId>QLFRXqWBjIc</yt:videoId><title>Entradas, salidas y retiros de caja | StorePhone</title><published>2026-11-02T00:00:00+00:00</published></entry></feed>')
  const c3 = correr('file://' + tmp + '/bueno.xml'); let n3 = -1, t3 = ''; try { const j = JSON.parse(fs.readFileSync(tmp + '/videos.json', 'utf8')); n3 = j.videos.length; t3 = j.videos[0].titulo } catch {}
  di(c1 === 1 && igual1, 'Cron de videos: con el RSS caído sale con 1 y la lista se queda igual', `salida ${c1}`)
  di(c2 === 1 && igual2, 'Cron de videos: con el RSS vacío sale con 1 y no borra lista ni miniaturas', `salida ${c2}`)
  di(c3 === 0 && n3 === 1 && t3 === 'Entradas, salidas y retiros de caja', 'Cron de videos: con un RSS bueno escribe la lista (sin « | StorePhone»)', `salida ${c3} · ${n3} · ${t3}`)
  fs.rmSync(tmp, { recursive: true, force: true })
}

// ── 2f. Medición (06/11/2026): cada toque a WhatsApp deja una marca propia (POST /clic) y la
// etiqueta de Google Ads queda lista. La prueba sabe si está APAGADA (sin IDs) o ENCENDIDA (IDs con
// forma válida) y prueba las DOS CSP por su archivo (servidor/csp-normal.txt y csp-con-google.txt):
// con la normal Google queda bloqueado; con la de Google, un gtag.js SIMULADO pide las mismas
// direcciones de conversión que el real (googleadservices, google.com, google.com.mx, doubleclick,
// td.doubleclick) y ninguna puede quedar bloqueada. El gtag.js real se prueba al encender (PENDIENTES).
{
  const SV = process.env.SERVIDOR_CSP || '/home/joveth/neron/neron-landing/servidor'
  const leer = (f) => { try { return fs.readFileSync(SV + '/' + f, 'utf8').trim() } catch { return '' } }
  const cspN = leer('csp-normal.txt'), cspG = leer('csp-con-google.txt')
  const pideM = async (p) => { try { const r = await fetch(new globalThis.URL(p, URL)); return [r.status, await r.text(), r.headers] } catch { return [0, '', new Headers()] } }
  const sinMed = []
  for (const r of ['control-de-imei/', 'punto-de-venta-con-creditos/', 'sistema-para-celulares-monterrey/', 'sistema-para-celulares-cdmx/']) {
    const [st, t] = await pideM(r); if (st !== 200 || !/<script src="\/medicion\.js(\?v=\d+)?" defer><\/script>/.test(t) || (GOOGLE_ON ? (!/<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=AW-18555345517"><\/script>\s*<script src="\/etiqueta-google\.js\?v=\d+" defer><\/script>/.test(t) || (t.replace(/<!--[\s\S]*?-->/g, '').match(/googletagmanager/g) || []).length !== 1) : /googletagmanager|gtag\(/.test(t.replace(/<!--[\s\S]*?-->/g, '')))) sinMed.push(r)
  }
  di(sinMed.length === 0, 'Medición: las 4 páginas para buscadores también llevan /medicion.js y ' + (GOOGLE_ON ? 'la etiqueta de Google (una sola vez, en el head)' : 'nada de Google en el HTML'), sinMed.join(' '))
  const [sJ, js] = await pideM('medicion.js')
  const id = (js.match(/var GOOGLE_ADS = '([^']*)'/) || [])[1], et = (js.match(/var ETIQUETA_WHATSAPP = '([^']*)'/) || [])[1]
  // 10/11/2026: Google va por /etiqueta-google.js (ID fijo); medicion.js se queda SIN IDs a proposito (si no, la conversion saldria doble)
  const [, tEt] = await pideM('etiqueta-google.js'); const encendida = GOOGLE_ON ? (/AW-18555345517\/BhxrCLnIg7YdEO208I9F/.test(tEt) && /pagos/.test(tEt)) : (/^AW-\d{6,}$/.test(id || '') && /^[\w-]{4,}$/.test(et || '')), apagada = id === '' && et === ''
  di(sJ === 200 && (GOOGLE_ON ? apagada && encendida : apagada && !encendida), `Medición: Google ${encendida ? 'ENCENDIDO por etiqueta-google.js (medicion.js sin IDs: no hay conversión doble)' : 'APAGADO'}, nada a medias`, `${sJ} ${id}/${et}`)
  const [, , hs] = await pideM(''); const cspS = hs.get('content-security-policy') || ''
  di(cspN && cspG && (GOOGLE_ON ? cspS === cspG : cspS === cspN), `Medición: la CSP servida es la ${cspS === cspG ? 'de Google' : cspS === cspN ? 'normal' : 'OTRA'}${encendida ? ' (con IDs tiene que ser la de Google)' : ''}`, cspS.slice(0, 60))
  {
    const [sP, tP] = await pideM('privacidad/'); const sinLiga = []
    for (const r of ['', 'control-de-imei/', 'punto-de-venta-con-creditos/', 'sistema-para-celulares-monterrey/', 'sistema-para-celulares-cdmx/', 'recomienda/', 'pagos/']) { const [, t] = await pideM(r); if (!/href="\/privacidad\/"/.test(t)) sinLiga.push('/' + r) }
    di(sP === 200 && /privacidad/i.test(tP) && /cookies/i.test(tP) && /etiqueta de Google Ads/i.test(tP) && /5216462875283|646 287 5283/.test(tP) && sinLiga.length === 0, 'Medición: con Google encendido hay aviso de privacidad (/privacidad/, habla de cookies) y las 7 páginas lo ligan; dice que se usa la etiqueta de Google Ads', `${sP} · sin liga: ${sinLiga.join(' ')}`)
  }
  { let st = 0; try { st = (await fetch(new globalThis.URL('clic?d=prueba-get&p=/&a=p', URL))).status } catch {}
    di(st === 405, 'Medición: /clic solo acepta POST (una imagen o liga de otra página no suma toques)', `GET → ${st}`) }
  // revisar-csp.py (06/11): la normal EXACTA de siempre; la de Google = la normal + solo https de Google
  {
    const { execFileSync } = await import('child_process'); const os = await import('os'); const path = await import('path')
    const REV = process.env.REVISAR_CSP || '/home/joveth/neron/neron-landing/revisar-csp.py'
    const rev = (modo, texto) => { const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'csp-')), 'c.txt'); fs.writeFileSync(f, texto); try { execFileSync('python3', ['-I', REV, modo, f], { stdio: 'pipe' }); return '' } catch (e) { return String(e.stdout || e.message).trim() || 'mal' } }
    const rN = rev('normal', cspN), rG = rev('google', cspG), rS = rev(cspS === cspG ? 'google' : 'normal', cspS)
    di(!rN && !rG && !rS, 'Medición: las CSP pasan revisar-csp.py (la normal es la de siempre; la de Google solo agrega direcciones https de Google)', [rN, rG, rS].filter(Boolean).join(' | '))
  }
  const GOOGLE = /(^|\.)(googletagmanager\.com|googleadservices\.com|google\.com|google\.com\.mx|doubleclick\.net)$/
  const stubG = `(function(){window.__gtag=(window.__gtag||0)+1;var dl=window.dataLayer=window.dataLayer||[];var push=dl.push.bind(dl);
function pide(){var i=new Image();i.src='https://www.googleadservices.com/pagead/conversion/000000001/?prueba=1';var j=new Image();j.src='https://www.google.com.mx/pagead/1p-conversion/000000001/?prueba=1';
try{fetch('https://www.google.com/pagead/1p-conversion/000000001/?prueba=1',{mode:'no-cors',keepalive:true}).catch(function(){})}catch(e){}
try{fetch('https://googleads.g.doubleclick.net/pagead/viewthroughconversion/000000001/?prueba=1',{mode:'no-cors'}).catch(function(){})}catch(e){}
var f=document.createElement('iframe');f.style.display='none';f.src='https://td.doubleclick.net/td/rul/000000001?prueba=1';document.body.appendChild(f)}
dl.push=function(a){var r=push(a);try{if(a&&a[0]==='event'&&a[1]==='conversion')pide()}catch(e){}return r}})()`
  const rutaGoogle = (pag, cuenta) => pag.route((u) => GOOGLE.test(u.hostname), (r) => {
    const u = new globalThis.URL(r.request().url())
    if (u.hostname === 'www.googletagmanager.com') return r.fulfill({ status: 200, contentType: 'text/javascript', body: stubG })
    cuenta.push(u.hostname); return r.fulfill({ status: u.hostname === 'td.doubleclick.net' ? 200 : 204, contentType: 'text/html', body: '' })
  })
  const marcas = (pag) => { const m = []; pag.on('request', (r) => { if (/\/clic\?/.test(r.url())) m.push({ url: r.url(), metodo: r.method() }) }); return m }
  const q = (m) => m ? Object.fromEntries(new globalThis.URL(m.url).searchParams) : {}
  const sinIr = () => { const no = (e) => { if (e.target.closest('a[href*="wa.me/"]')) e.preventDefault() }; document.addEventListener('click', no); document.addEventListener('auxclick', no) }
  // a) Visita de prueba por anuncio (390 táctil): hero, plan Premium, barra y botón de en medio dejan su marca (a=p)
  {
    const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 }); const pag = await ctx.newPage()
    const errores = []; pag.on('pageerror', (e) => errores.push(String(e))); pag.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()) })
    const fuera = new Set(); pag.on('request', (r) => { const h = new globalThis.URL(r.url()).hostname; if (h !== new globalThis.URL(URL).hostname) fuera.add(h) })
    const m = marcas(pag); const resp = []; pag.on('response', (r) => { if (/\/clic\?/.test(r.url())) resp.push(r.status()) })
    await pag.route('https://wa.me/**', (r) => r.fulfill({ status: 200, contentType: 'text/plain', body: 'wa' })); await rutaGoogle(pag, [])
    await pag.goto(new globalThis.URL('?gad_source=2&gclid=prueba-landing', URL).href, { waitUntil: 'networkidle' }); await pag.evaluate(sinIr)
    await pag.locator('.hero .cta a[href*="wa.me"]').click(); await pag.waitForTimeout(400)
    const prem = pag.locator('#planes a[href*="plan%20Premium"]'); await prem.scrollIntoViewIfNeeded(); await prem.click(); await pag.waitForTimeout(400)
    // 10/11/2026: el botón del plan abre la encuesta (marca encuesta-inicio); se cierra con Esc para seguir
    await pag.keyboard.press('Escape'); await pag.waitForTimeout(200)
    await pag.locator('.barra a[href*="wa.me"]').click(); await pag.waitForTimeout(400)
    await pag.locator('.barra a[href*="wa.me"]').click({ button: 'middle' }); await pag.waitForTimeout(600)
    // Firefox y otros mandan TAMBIÉN «click» con el botón de en medio: no puede contar doble
    await pag.evaluate(() => document.querySelector('.barra a[href*="wa.me"]').dispatchEvent(new MouseEvent('click', { button: 1, bubbles: true, cancelable: true }))); await pag.waitForTimeout(400)
    const ds = m.map((x) => q(x).d).join(',')
    di(m.length === 4 && ds === 'portada,encuesta-inicio,barra,barra' && m.every((x) => x.metodo === 'POST' && q(x).a === 'p' && q(x).p === '/'), '390 visita de prueba por anuncio: portada, inicio de la encuesta (plan Premium), barra y botón de en medio dejan su marca POST /clic (a=p, no se cuenta)', ds + ' ' + m.map((x) => x.metodo + ' a=' + q(x).a).join(' '))
    di(resp.length === 4 && resp.every((x) => x === 204), 'Medición: el servidor contesta 204 a cada marca', resp.join(','))
    const permitidos = encendida ? (h) => h === 'wa.me' || GOOGLE.test(h) : (h) => h === 'wa.me'
    di([...fuera].every(permitidos) && errores.length === 0, `Medición: ${encendida ? 'con IDs solo se pide a Google' : 'sin IDs no se pide nada de Google ni de fuera'}, y sin errores`, [...fuera].join(' ') + ' ' + errores.join(' ').slice(0, 120))
    // el mismo toque, sin detenerlo: WhatsApp abre con el mismo enlace y la marca sale igual
    await pag.goto(URL, { waitUntil: 'networkidle' }); const m2 = marcas(pag); const href = await pag.locator('.hero .cta a[href*="wa.me"]').getAttribute('href')
    await Promise.all([pag.waitForURL(/wa\.me/), pag.locator('.hero .cta a[href*="wa.me"]').click()])
    di(pag.url() === href && m2.length === 1 && q(m2[0]).a === 'p', 'Medición: WhatsApp abre igual (mismo enlace y mensaje) y la marca sale; recuerda la visita en la pestaña', `${pag.url().slice(0, 60)} · ${m2.length} · a=${q(m2[0]).a}`)
    // y si la marca falla (servidor caído o bloqueada), WhatsApp abre igual
    await pag.goto(URL, { waitUntil: 'networkidle' }); await pag.route('**/clic*', (r) => r.abort())
    await Promise.all([pag.waitForURL(/wa\.me/), pag.locator('.hero .cta a[href*="wa.me"]').click()])
    di(pag.url() === href, 'Medición: con /clic caído WhatsApp abre igual', pag.url().slice(0, 60))
    await ctx.close()
  }
  // b) Sin anuncio (1440) la cabecera marca a=0; con ?gad_source=2 marca a=1
  {
    const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 } }); const pag = await ctx.newPage(); const m = marcas(pag); await rutaGoogle(pag, [])
    await pag.goto(URL, { waitUntil: 'networkidle' }); await pag.evaluate(sinIr); await pag.locator('.hdr a[href*="wa.me"]').click(); await pag.waitForTimeout(500)
    const c2 = await nav.newContext({ viewport: { width: 1440, height: 900 } }); const p2 = await c2.newPage(); const m2 = marcas(p2); await rutaGoogle(p2, [])
    await p2.goto(new globalThis.URL('?gad_source=2', URL).href, { waitUntil: 'networkidle' }); await p2.evaluate(sinIr); await p2.locator('.hdr a[href*="wa.me"]').click(); await p2.waitForTimeout(500)
    di(m.length === 1 && q(m[0]).d === 'cabecera' && q(m[0]).a === '0' && m2.length === 1 && q(m2[0]).a === '1', '1440: la cabecera marca a=0 sin anuncio y a=1 con anuncio', [...m, ...m2].map((x) => x.url.split('?')[1]).join(' | '))
    await ctx.close(); await c2.close()
  }
  // c) Google con IDs SIMULADOS, una vez con cada CSP (por su archivo)
  for (const [nombreCsp, csp] of [['NORMAL', cspN], ['CON GOOGLE', cspG]]) {
    const ctx = await nav.newContext({ viewport: { width: 390, height: 844 } }); const pag = await ctx.newPage(); const m = marcas(pag); const errores = []; const cuenta = []
    pag.on('pageerror', (e) => errores.push(String(e)))
    await pag.addInitScript(() => { window.__csp = []; document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(e.blockedURI + ' ' + e.violatedDirective)) })
    let cambiado = GOOGLE_ON // con la etiqueta puesta la pagina ya trae los IDs reales; sin ella (paso 1) se simulan en medicion.js como antes
    if (!GOOGLE_ON) await pag.route('**/medicion.js*', async (r) => { const res = await r.fetch(); const t = await res.text(); const t2 = t.replace(/var GOOGLE_ADS = '[^']*'/, "var GOOGLE_ADS = 'AW-000000001'").replace(/var ETIQUETA_WHATSAPP = '[^']*'/, "var ETIQUETA_WHATSAPP = 'prueba123'"); cambiado = /'AW-000000001'/.test(t2) && /'prueba123'/.test(t2); await r.fulfill({ response: res, body: t2 }) })
    await rutaGoogle(pag, cuenta)
    await pag.route((u) => u.href.split('?')[0] === URL, async (r) => { const res = await r.fetch(); await r.fulfill({ response: res, headers: { ...res.headers(), 'content-security-policy': csp } }) })
    await pag.goto(new globalThis.URL('?gclid=prueba-landing', URL).href, { waitUntil: 'networkidle' }); await pag.evaluate(sinIr); await pag.waitForTimeout(300)
    await pag.locator('.hero .cta a[href*="wa.me"]').click(); await pag.waitForTimeout(900)
    const r = await pag.evaluate(() => ({ gtag: window.__gtag || 0, csp: window.__csp, dl: (window.dataLayer || []).map((a) => JSON.stringify([...a])) }))
    const IDX = GOOGLE_ON ? 'AW-18555345517' : 'AW-000000001', ENVX = GOOGLE_ON ? 'AW-18555345517/BhxrCLnIg7YdEO208I9F' : 'AW-000000001/prueba123'
    const config = r.dl.some((x) => x === JSON.stringify(['config', IDX])), conv = r.dl.some((x) => x.includes('"event","conversion",{"send_to":"' + ENVX + '"'))
    const hosts = [...new Set(cuenta)].sort().join(' ')
    if (nombreCsp === 'NORMAL') di(cambiado && r.gtag === 0 && r.csp.some((x) => /googletagmanager/.test(x)) && cuenta.length === 0 && m.length === 1, 'Google encendido y la CSP NORMAL: no se carga nada de Google y la marca propia sigue', JSON.stringify(r.csp).slice(0, 140))
    else di(cambiado && r.gtag === 1 && r.csp.length === 0 && config && conv && hosts === 'googleads.g.doubleclick.net td.doubleclick.net www.google.com www.google.com.mx www.googleadservices.com' && m.length === 1 && errores.length === 0, 'Google encendido y la CSP CON GOOGLE: carga la etiqueta, la conversión entra al dataLayer y sus 5 pedidos pasan la CSP (gtag simulado)', `gtag ${r.gtag} · bloqueos ${JSON.stringify(r.csp).slice(0, 120)} · config ${config} · conv ${conv} · ${hosts} · ${errores.join(' ').slice(0, 80)}`)
    await ctx.close()
  }
}

// ── 2g. Estado de Google coherente (ACUERDO #9, dos pasos): todas las paginas igual, y la CSP que toca ──
{
  const sin = []
  for (const r of ['', 'control-de-imei/', 'punto-de-venta-con-creditos/', 'sistema-para-celulares-monterrey/', 'sistema-para-celulares-cdmx/', 'recomienda/', 'pagos/', 'privacidad/']) {
    try { const t = (await (await fetch(new globalThis.URL(r, URL))).text()).replace(/<!--[\s\S]*?-->/g, ''); const tiene = /googletagmanager\.com\/gtag\/js\?id=AW-18555345517/.test(t) && /\/etiqueta-google\.js/.test(t); if (tiene !== GOOGLE_ON) sin.push('/' + r); if (!GOOGLE_ON && /googletagmanager|gtag\(|etiqueta-google/.test(t)) sin.push('/' + r + ' (Google a medias)') } catch { sin.push('/' + r + ' (no abre)') }
  }
  di(sin.length === 0, `Estado de Google: ${GOOGLE_ON ? 'ENCENDIDO' : 'APAGADO'} igual en las 8 páginas (la portada, las 4 de buscadores, /recomienda/, /pagos/ y /privacidad/)`, sin.join(' '))
}

// ── 2h. Origen, texto de WhatsApp y conversion (ACUERDO #9, revision del 10/11/2026). Solo con la etiqueta puesta (paso 2) ──
if (GOOGLE_ON) {
  const GH = /(^|\.)(googletagmanager\.com|googleadservices\.com|google\.com|google\.com\.mx|doubleclick\.net)$/
  const ENV = 'AW-18555345517/BhxrCLnIg7YdEO208I9F'
  const SALUDO = 'Hola, quiero acceso a StorePhone'
  // Una visita: devuelve origen guardado, textos de los enlaces y las conversiones que entraron al dataLayer
  async function visita(ruta, { referer, mutar, antes } = {}) {
    const ctx = await nav.newContext({ viewport: { width: 1280, height: 900 } }), pag = await ctx.newPage(); const wa = []
    await ctx.route((u) => GH.test(u.hostname), (r) => r.fulfill({ status: /gtag\/js/.test(r.request().url()) ? 200 : 204, contentType: 'text/javascript', body: '' }))
    await ctx.route(/wa\.me|whatsapp\.com/, (r) => { wa.push(r.request().url()); r.fulfill({ status: 200, contentType: 'text/html', body: 'wa' }) })
    ctx.on('page', (np) => wa.push('pestaña ' + np.url())) // ctrl/shift/medio abren WhatsApp en otra pestaña
    if (mutar) await pag.route('**/etiqueta-google.js*', async (r) => { const res = await r.fetch(); await r.fulfill({ response: res, body: mutar(await res.text()) }) })
    await pag.goto(new globalThis.URL(ruta, URL).href, { waitUntil: 'networkidle', ...(referer ? { referer } : {}) })
    if (antes) await antes(pag)
    const lee = async () => pag.evaluate(() => ({
      ss: (() => { try { return sessionStorage.getItem('neron-origen') } catch { return null } })(),
      textos: [...document.querySelectorAll('a[href*="wa.me/5216462875283"]')].map((a) => decodeURIComponent((a.getAttribute('href').split('text=')[1] || ''))),
      conv: (window.dataLayer || []).map((a) => [...a]).filter((a) => a[0] === 'event' && a[1] === 'conversion').map((a) => a[2]) }))
    return { pag, ctx, wa, lee }
  }
  // a) origen y texto
  for (const [ruta, referer, esperado, nombre] of [
    ['?gclid=prueba', 'https://www.google.com/', 'Google', 'gclid + referrer google → «Google»'],
    ['?gclid=prueba', undefined, 'YouTube', 'gclid sin referrer → «YouTube»'],
    ['?gbraid=x', 'https://www.google.com.mx/', 'Google', 'gbraid + referrer google.com.mx → «Google»'],
    ['?utm_source=newsletter', undefined, 'newsletter', 'utm_source=newsletter → «newsletter»'],
    ['?utm_source=ig', undefined, 'Instagram', 'utm_source=ig → «Instagram»'],
    ['?utm_source=FB', undefined, 'Facebook', 'utm_source=FB → «Facebook»'],
    ['?utm_source=tiktok', undefined, 'TikTok', 'utm_source=tiktok → «TikTok»'],
    ['', 'https://l.instagram.com/', 'Instagram', 'referrer instagram → «Instagram»'],
    ['?utm_source=' + encodeURIComponent('Mi‮evil​ anuncio x'), undefined, 'Mievil anunciox', 'utm_source con U+202E, espacio invisible y NBSP → sin esos caracteres'],
    ['?utm_source=' + encodeURIComponent('a'.repeat(50)), undefined, 'a'.repeat(30), 'utm_source de 50 letras → corta a 30'],
    ['?utm_source=' + encodeURIComponent('a'.repeat(29) + '\u{1D400}'), undefined, 'a'.repeat(29) + '\u{1D400}', 'utm_source de 29 «a» + 𝐀 (4 bytes) → exacto, sin partir el carácter'],
    ['?utm_source=' + encodeURIComponent('<script>'), undefined, 'script', 'utm_source con < > → solo texto seguro'],
  ]) {
    const v = await visita(ruta, { referer }); const r = await v.lee()
    di(r.ss === esperado && r.textos.includes(`Hola, vi su anuncio en ${esperado} y quiero acceso a StorePhone`) && r.textos.every((t) => t === '' || t.startsWith(`Hola, vi su anuncio en ${esperado} y quiero acceso a StorePhone`) || t.startsWith(`Vi su anuncio en ${esperado}. `)), `Origen: ${nombre}, y el texto de WhatsApp cambia`, `${r.ss} · ${r.textos.slice(0, 2).join(' | ')}`)
    await v.ctx.close()
  }
  { const v = await visita('?utm_source=' + encodeURIComponent('\u{1F600}‮​'), {}); const r = await v.lee()
    di(r.ss === null && r.textos.includes(SALUDO) && r.textos.every((t) => !/anuncio/.test(t)), 'Origen: utm_source sin nada de texto seguro → sin origen y los textos quedan iguales', `${r.ss} · ${r.textos[0]}`); await v.ctx.close() }
  { const v = await visita('', {}); const r = await v.lee()
    di(r.ss === null && r.textos.includes(SALUDO) && r.textos.every((t) => !/anuncio/.test(t)), 'Origen: visita normal → sin origen y los textos quedan iguales', `${r.ss}`); await v.ctx.close() }
  { // textos con su original respetado (plan Premium) y emoji partido no
    const v = await visita('?gclid=x', { referer: 'https://www.google.com/' }); const r = await v.lee()
    di(r.textos.includes('Vi su anuncio en Google. Hola, quiero acceso a StorePhone, me interesa el plan Premium'), 'Texto: los demás enlaces llevan «Vi su anuncio en Google. » al inicio y conservan su texto original', r.textos.join(' | ').slice(0, 200)); await v.ctx.close() }
  // b) conversion: parametros exactos, una vez (el clic no navega para poder leer el dataLayer) y, aparte, el enlace abre sin retraso
  {
    const v = await visita('?gclid=x', { referer: 'https://www.google.com/' })
    await v.pag.evaluate(() => document.addEventListener('click', (e) => { if (e.target.closest('a[href*="wa.me"]')) e.preventDefault() }))
    await v.pag.locator('.hero .cta a[href*="wa.me"]').first().click(); await v.pag.waitForTimeout(500)
    const c = (await v.lee()).conv
    di(c.length === 1 && c[0].send_to === ENV && c[0].value === 1 && c[0].currency === 'MXN' && c[0].transport_type === 'beacon', 'Conversión: el clic manda send_to exacto, value:1, currency:MXN y transport_type:beacon (una sola vez)', JSON.stringify(c))
    await v.ctx.close()
    const w = await visita('?gclid=x', { referer: 'https://www.google.com/' })
    const t0 = Date.now(); await w.pag.locator('.hero .cta a[href*="wa.me"]').first().click(); const dt = Date.now() - t0; await w.pag.waitForTimeout(400)
    di(w.wa.length >= 1 && dt < 1500, `Conversión: el enlace abre igual y sin retraso (${dt} ms)`, String(w.wa)); await w.ctx.close()
  }
  // c) /pagos/ con un enlace INYECTADO a wa.me/5216462875283: 0 conversiones; y la prueba se pone roja si se quita el candado
  const pagosInyectado = async (mutar) => {
    const v = await visita('pagos/?gclid=x', { referer: 'https://www.google.com/', mutar })
    await v.pag.evaluate(() => { const a = document.createElement('a'); a.id = 'inyectado'; a.href = 'https://wa.me/5216462875283?text=Hola%2C%20quiero%20acceso%20a%20StorePhone'; a.target = '_blank'; a.textContent = 'inyectado'; a.style.cssText = 'display:block;padding:20px'; document.querySelector('main').appendChild(a) })
    await v.pag.locator('#inyectado').click(); await v.pag.waitForTimeout(500)
    const r = await v.lee(); const abrio = v.wa.length >= 1; await v.ctx.close(); return { n: r.conv.length, abrio }
  }
  { const r = await pagosInyectado(); di(r.n === 0 && r.abrio, '/pagos/: un enlace inyectado a wa.me/5216462875283 abre y NO manda conversión (0)', JSON.stringify(r)) }
  { const r = await pagosInyectado((t) => t.replace('if (enPagos) return', '')); di(r.n >= 1, '/pagos/: la prueba se pone ROJA si se quita «if (enPagos) return» (con el candado quitado entra la conversión)', JSON.stringify(r)) }
  // d) «Probar gratis» (data-encuesta): el clic normal abre la encuesta y NO cuenta; ctrl+clic y botón de en medio abren WhatsApp y cuentan una vez
  for (const [nombre, opts, esperado] of [['clic normal (abre la encuesta)', {}, 0], ['ctrl+clic', { modifiers: ['Control'] }, 1], ['shift+clic', { modifiers: ['Shift'] }, 1], ['botón de en medio', { button: 'middle' }, 1], ['alt+clic (no abre WhatsApp)', { modifiers: ['Alt'] }, 0]]) {
    const v = await visita('?gclid=x', { referer: 'https://www.google.com/' })
    await v.pag.locator('#planes a[data-encuesta="Premium"]').first().scrollIntoViewIfNeeded(); await v.pag.locator('#planes a[data-encuesta="Premium"]').first().click(opts); await v.pag.waitForTimeout(600)
    const r = await v.lee()
    di(r.conv.length === esperado && (esperado === 1 ? v.wa.length >= 1 : v.wa.length === 0), `Conversión en «Probar gratis»: ${nombre} → ${esperado} conversión(es)${esperado === 1 ? ' y WhatsApp abre' : ' y WhatsApp no abre'}`, `${r.conv.length} · WhatsApp abierto: ${v.wa.length}`); await v.ctx.close()
  }
}

// ── 3. Archivos para buscadores y redirecciones ──
const pide = async (p) => { try { const r = await fetch(new globalThis.URL(p, URL)); return [r.status, await r.text(), r.headers.get('content-type') || ''] } catch (e) { return [0, '', ''] } }
const [sS, sitemap] = await pide('sitemap.xml')
// Desde el 25/10/2026 el mapa lleva la portada y las 4 páginas para buscadores (commit ae392fa)
const locs = (sitemap.match(/<loc>([^<]*)<\/loc>/g) || []).map((l) => l.replace(/<\/?loc>/g, ''))
const esperadas = ['/', '/control-de-imei/', '/punto-de-venta-con-creditos/', '/sistema-para-celulares-monterrey/', '/sistema-para-celulares-cdmx/', '/recomienda/', '/privacidad/'].map((x) => 'https://www.neronfix.com' + x)
di(sS === 200 && JSON.stringify(locs) === JSON.stringify(esperadas) && (sitemap.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g) || []).length === 7 && !/faq\.html|contacto\.html/.test(sitemap), 'sitemap.xml: la portada, las 4 páginas para buscadores, /recomienda/ y /privacidad/, cada una con lastmod, sin faq ni contacto', locs.join(' '))
const [sR, robots] = await pide('robots.txt')
di(sR === 200 && /Allow: \//.test(robots) && /Sitemap: https:\/\/www\.neronfix\.com\/sitemap\.xml/.test(robots), 'robots.txt: permite todo y señala el sitemap')
// 02/11/2026: /llms.txt — lo que leen las IAs (ChatGPT, Gemini…): Neron Fix = StorePhone, para quién, qué NO es y cómo contactar
const [sL, llms, tL] = await pide('llms.txt')
di(sL === 200 && /^text\/(plain|markdown)/.test(tL) && /charset=utf-8/i.test(tL) && /^# Neron Fix/.test(llms) && /^> .*StorePhone/m.test(llms) && /tiendas de celulares/i.test(llms) && /reparaci/i.test(llms) && /accesorios/i.test(llms) && /México/.test(llms) && /no hace sistemas para otros/i.test(llms) && llms.includes(WA_VISIBLE) && llms.includes(`https://wa.me/${WA}`) && llms.includes('https://www.youtube.com/@neronfix') && llms.includes('https://www.neronfix.com/#planes'), '/llms.txt: existe (texto UTF-8) y dice Neron Fix = StorePhone para tiendas de celulares, qué no es, planes, videos y WhatsApp', `${sL} ${tL} ${llms.slice(0, 60).replace(/\n/g, ' ')}`)
// Ninguna palabra de otros giros en lo que se sirve (HTML con comentarios, JSON-LD, alt, metas, llms.txt, robots, sitemap, scripts)
{
  const GIROS = /\bautos\b|automotr|autom[oó]vil|agencia de carros|est[eé]tica|sal[oó]n de belleza|belleza|barber|\bspa\b|restaurant|taquer|cafeter|\bcomida\b|terapia|masaje|cl[ií]nica|consultorio|veterinari|farmacia|ferreter|abarrote|gimnasio|Neron One|Neron Autos|Karuna|Versalles|Carrera\b|cualquier giro|todo tipo de negocio/i
  const malos = []
  for (const r of ['', 'control-de-imei/', 'punto-de-venta-con-creditos/', 'sistema-para-celulares-monterrey/', 'sistema-para-celulares-cdmx/', 'recomienda/', 'llms.txt', 'robots.txt', 'sitemap.xml', 'site.webmanifest', 'opiniones.js', 'videos.js', 'movimiento.js', 'medicion.js']) {
    const [st, txt] = await pide(r); const m = txt.match(GIROS)
    if (st !== 200) malos.push(`/${r} ${st}`); else if (m) malos.push(`/${r} «${txt.slice(Math.max(0, m.index - 30), m.index + 30).replace(/\s+/g, ' ')}»`)
  }
  di(malos.length === 0, 'Nada de otros giros (autos, estéticas, restaurantes, taquerías, terapias…) en ninguna página, JSON-LD, alt, llms.txt ni archivo servido', malos.join(' | '))
}
const [sM, man] = await pide('site.webmanifest')
let mOk = false; try { const m = JSON.parse(man); mOk = /StorePhone/.test(m.name) && m.lang === 'es-MX' && m.icons?.length >= 1 } catch {}
di(sM === 200 && mOk, 'site.webmanifest: válido y dice StorePhone')

// Logo oficial e iconos (Joveth, 01/11/2026): todo lo que las páginas, el manifest y el JSON-LD nombran existe,
// responde 200, mide lo que dice, y es la marca NEGRA sobre blanco (nada vino ni plateado)
{
  const refs = new Map()
  // Las direcciones absolutas de www.neronfix.com se buscan en el sitio que se está probando (igual que la imagen de Open Graph)
  const pon = (u, de, tam) => { if (u) refs.set(new globalThis.URL(u.replace('https://www.neronfix.com/', ''), URL).href, { de, tam }) }
  for (const ruta of ['', 'control-de-imei/', 'punto-de-venta-con-creditos/', 'sistema-para-celulares-monterrey/', 'sistema-para-celulares-cdmx/', 'recomienda/']) {
    const h = (await (await fetch(new globalThis.URL(ruta, URL))).text()).replace(/<!--[\s\S]*?-->/g, '')
    for (const m of h.matchAll(/<link rel="(icon|apple-touch-icon)"[^>]*>/g)) { const sz = m[0].match(/sizes="(\d+)x\d+"/); pon(m[0].match(/href="([^"]+)"/)?.[1], `/${ruta} ${m[1]}`, sz ? +sz[1] : m[1] === 'apple-touch-icon' ? 180 : 0) }
    for (const m of h.matchAll(/<img [^>]*src="([^"]+)"/g)) if (!/^\/videos\//.test(m[1])) pon(m[1], `/${ruta} img`, 0) // las miniaturas de videos se revisan aparte
  }
  try { for (const i of JSON.parse(man).icons || []) pon(i.src, 'manifest', +String(i.sizes).split('x')[0]) } catch {}
  pon(tipo('Organization')?.logo, 'JSON-LD logo', 0)
  const mal = [], tamMal = []
  for (const [u, { de, tam }] of refs) {
    let st = 0, ct = '', buf = Buffer.alloc(0)
    try { const r = await fetch(u); st = r.status; ct = r.headers.get('content-type') || ''; buf = Buffer.from(await r.arrayBuffer()) } catch {}
    if (st !== 200 || !/^image\//.test(ct) || buf.length < 100) { mal.push(`${de} ${u} → ${st} ${ct}`); continue }
    if (tam && buf.readUInt32BE(0) === 0x89504e47 && (buf.readUInt32BE(16) !== tam || buf.readUInt32BE(20) !== tam)) tamMal.push(`${u.replace(/.*\//, '')} ${buf.readUInt32BE(16)}×${buf.readUInt32BE(20)} (dice ${tam})`)
  }
  di(refs.size >= 6 && mal.length === 0, `Iconos y logos referenciados (${refs.size}) existen y responden 200`, mal.join(' | ') || [...refs.keys()].map((u) => u.replace(/.*\//, '')).join(' '))
  di(tamMal.length === 0, 'Iconos: cada uno mide lo que dicen la página y el manifest', tamMal.join(' | '))
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 } }); const pag = await ctx.newPage(); await pag.goto(URL, { waitUntil: 'networkidle' })
  const vistos = await pag.evaluate(async (us) => { const out = []
    for (const u of us) { try {
      const bm = await createImageBitmap(await (await fetch(u)).blob()); const c = document.createElement('canvas'); c.width = bm.width; c.height = bm.height
      const x = c.getContext('2d'); x.drawImage(bm, 0, 0); const d = x.getImageData(0, 0, c.width, c.height).data
      let oscuro = 255, rojizos = 0; for (let i = 0; i < d.length; i += 4) { if (d[i + 3] < 128) continue; const L = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; if (L < oscuro) oscuro = L; if (d[i] - Math.max(d[i + 1], d[i + 2]) > 30) rojizos++ }
      const esq = [0, (c.width - 1) * 4, (c.width * (c.height - 1)) * 4, (c.width * c.height - 1) * 4].map((i) => d[i + 3] < 10 ? 'transparente' : Math.min(d[i], d[i + 1], d[i + 2]) >= 245 ? 'blanco' : 'otro')
      out.push([u.replace(/.*\//, ''), Math.round(oscuro), rojizos, esq.every((e) => e === 'blanco') ? 'blanco' : esq.every((e) => e === 'transparente') ? 'transparente' : esq.join('/')])
    } catch (e) { out.push([u, 'error', String(e)]) } } return out }, [...refs.keys()])
  const feos = vistos.filter(([n, osc, roj, fondo]) => !(osc <= 40 && roj === 0 && (fondo === 'blanco' || (fondo === 'transparente' && /cabecera/.test(n)))))
  di(vistos.length === refs.size && feos.length === 0, 'Iconos y logos: marca negra sobre blanco (la cabecera, negra sobre transparente), sin vino ni plateado', feos.map((f) => f.join(' ')).join(' | '))
  // Centrado ÓPTICO (Joveth 01/11/2026, «se mira colgado a la izquierda»): el centro de PESO de la marca va al
  // centro horizontal (±1%); margen ≥12% por lado y nada fuera del círculo (Android, perfil de Google)
  const opt = await pag.evaluate(async (us) => { const out = []
    for (const [n, u, tam] of us) { try {
      const r = await fetch(u); if (!r.ok) { out.push([n, `${r.status}`]); continue }
      const bm = await createImageBitmap(await r.blob()), W = bm.width, H = bm.height, c = document.createElement('canvas'); c.width = W; c.height = H
      const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, W, H); x.drawImage(bm, 0, 0); const d = x.getImageData(0, 0, W, H).data
      let sw = 0, sx = 0, x0 = W, x1 = -1, y0 = H, y1 = -1, rm = 0
      for (let y = 0; y < H; y++) for (let xx = 0; xx < W; xx++) { const i = (y * W + xx) * 4, w = 255 - (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]); if (w < 8) continue
        sw += w; sx += w * (xx + 0.5); if (w > 100) { x0 = Math.min(x0, xx); x1 = Math.max(x1, xx); y0 = Math.min(y0, y); y1 = Math.max(y1, y); rm = Math.max(rm, Math.hypot(xx + 0.5 - W / 2, y + 0.5 - H / 2)) } }
      out.push([n, 'ok', W === tam && H === tam, +((sx / sw / W - 0.5) * 100).toFixed(2), +(Math.min(x0, W - 1 - x1, y0, H - 1 - y1) / W * 100).toFixed(1), +(rm / W).toFixed(3)])
    } catch (e) { out.push([n, 'error ' + e]) } } return out },
    [['favicon-512.png', 512], ['logo-perfil.png', 720], ['logo-perfil-completo.png', 1080]].map(([n, t]) => [n, new globalThis.URL(n, URL).href, t]))
  for (const [n, st, tamOk, px, margen, radio] of opt)
    di(st === 'ok' && tamOk && Math.abs(px) <= 1 && margen >= 12 && radio <= 0.46, `${n}: centrado óptico (centro de peso al centro ±1%), margen ≥12% y dentro del círculo`, st === 'ok' ? `peso ${px > 0 ? '+' : ''}${px}% · margen ${margen}% · radio ${radio} · tamaño ${tamOk ? 'bien' : 'MAL'}` : st)
  const cab = await pag.evaluate(() => { const i = document.querySelector('.brand img'); return [i?.getAttribute('src'), i ? getComputedStyle(i).filter : ''] })
  di(cab[0] === '/logo-oficial-cabecera.png' && cab[1] === 'none', 'Cabecera: el logo oficial en negro, sin filtros encima', cab.join(' · '))
  await ctx.close()
}
const [sO, , tO] = await pide(og.replace('https://www.neronfix.com/', ''))
di(sO === 200 && /image\/jpeg/.test(tO), 'La imagen de Open Graph existe', `${sO} ${tO}`)
if (REPO) {
  let v = {}; try { v = JSON.parse(fs.readFileSync(REPO + '/vercel.json', 'utf8')) } catch {}
  const red = (v.redirects || []).filter((r) => r.destination === '/' && r.permanent).map((r) => r.source)
  di(['/faq.html', '/contacto.html'].every((s) => red.includes(s)), 'vercel.json: faq.html y contacto.html redirigen a la portada (no se pierden ligas)', red.join(' '))
  const csp = JSON.stringify(v).match(/Content-Security-Policy","value":"([^"]*)/)?.[1] || ''
  di(csp && !/fonts\.googleapis/.test(csp), 'vercel.json: la CSP ya no abre Google Fonts')
} else {
  // Contra el sitio publicado: las redirecciones se preguntan al servidor
  for (const p of ['faq.html', 'contacto.html']) {
    const r = await fetch(new globalThis.URL(p, URL), { redirect: 'manual' })
    di([301, 308].includes(r.status) && /^\/$|neronfix\.com\/$/.test(r.headers.get('location') || ''), `${p} redirige a la portada`, `${r.status} ${r.headers.get('location')}`)
  }
}

// /punto-de-venta/celulares nunca existio y daba 404 (10/11/2026): 301 a la portada, conservando gclid/utm
if (REPO) {
  let v2 = {}; try { v2 = JSON.parse(fs.readFileSync(REPO + '/vercel.json', 'utf8')) } catch {}
  const r2 = (v2.redirects || []).filter((r) => r.destination === '/' && r.permanent).map((r) => r.source)
  di(['/punto-de-venta/celulares', '/punto-de-venta/celulares/'].every((x) => r2.includes(x)), 'vercel.json: /punto-de-venta/celulares (con y sin /) redirige a la portada', r2.join(' '))
}
for (const [ruta, q] of [['punto-de-venta/celulares', ''], ['punto-de-venta/celulares/', ''], ['punto-de-venta/celulares', '?gclid=prueba123&utm_source=g'], ['punto-de-venta/celulares/', '?gclid=prueba123&utm_source=g']]) {
  let st = 0, lo = ''; try { const r = await fetch(new globalThis.URL(ruta + q, URL), { redirect: 'manual' }); st = r.status; lo = r.headers.get('location') || '' } catch {}
  const loRel = lo.replace(/^https?:\/\/[^/]+/, '')
  di(st === 301 && loRel === '/' + q, `/${ruta}${q} da 301 a la portada${q ? ' conservando el query' : ''}`, `${st} ${lo}`)
}
{ let st = 0; try { st = (await fetch(new globalThis.URL('', URL), { redirect: 'manual' })).status } catch {}
  di(st === 200, 'La portada sigue en 200 (la redirección no la toca)', String(st)) }

await nav.close()
const malos = casos.filter((c) => !c).length
console.log(`\nlanding — casos: ${casos.length} · en MAL: ${malos}`)
process.exit(malos ? 1 : 0)
