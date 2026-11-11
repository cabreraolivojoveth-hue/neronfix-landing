import { chromium } from 'playwright'
const URL_ = process.env.URL || 'http://127.0.0.1:9400/'
const nav = await chromium.launch({ executablePath: process.env.CHROMIUM, args: ['--no-sandbox'] })
let bien = 0, mal = 0
const di = (ok, t, d = '') => { ok ? bien++ : mal++; console.log((ok ? 'BIEN ' : 'MAL  ') + t + (ok ? '' : ' :: ' + d)) }
const SALUDO = 'Hola, quiero acceso a StorePhone'
async function visita(ruta, { referer, sel, nombre }) {
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 } }), pag = await ctx.newPage()
  const goog = [], csp = [], errores = []
  pag.on('pageerror', (e) => errores.push(String(e)))
  await pag.addInitScript(() => { window.__csp = []; document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(e.blockedURI + ' ' + e.violatedDirective)) })
  // Red de Google interceptada (no sale a internet): gtag.js falso que SI hace los pedidos reales de conversion
  await pag.route(/googletagmanager\.com|googleadservices\.com|doubleclick\.net|google\.com(\.mx)?\//, async (r) => {
    const u = r.request().url(); goog.push(u)
    if (/gtag\/js/.test(u)) return r.fulfill({ status: 200, contentType: 'text/javascript', body: "window.__gtagjs=1;(function(){var q=window.dataLayer;function p(a){var x=[].slice.call(a);if(x[0]==='event'&&x[1]==='conversion'){new Image().src='https://www.googleadservices.com/pagead/conversion/18555345517/?label=BhxrCLnIg7YdEO208I9F&value='+x[2].value+'&currency_code='+x[2].currency}}var o=q.push.bind(q);q.push=function(a){p(a);return o(a)};for(var i=0;i<q.length;i++)p(q[i])})()" })
    return r.fulfill({ status: 200, contentType: 'image/gif', body: Buffer.from('R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', 'base64') })
  })
  // el destino de WhatsApp tampoco sale
  const wa = []
  await ctx.route(/wa\.me/, (r) => { wa.push(r.request().url()); r.fulfill({ status: 200, contentType: 'text/html', body: 'wa' }) })
  await pag.goto(URL_ + ruta, { waitUntil: 'networkidle', ...(referer ? { referer } : {}) })
  const antes = await pag.$$eval('a[href*="wa.me/5216462875283"]', (l) => l.map((a) => a.getAttribute('href')))
  const textos = antes.map((h) => decodeURIComponent((h.split('text=')[1] || '')))
  const info = await pag.evaluate(() => ({ ss: (() => { try { return sessionStorage.getItem('neron-origen') } catch { return 'x' } })(), csp: window.__csp, js: window.__gtagjs || 0, dl0: (window.dataLayer || []).map((a) => JSON.stringify([...a])).slice(0, 3) }))
  const conv0 = goog.filter((u) => /pagead\/conversion/.test(u)).length
  let t0 = Date.now(), pop = null
  const link = pag.locator(sel).first()
  const hrefClic = await link.getAttribute('href')
  const pp = pag.context().waitForEvent('page', { timeout: 4000 }).catch(() => null)
  await link.click(); const dt = Date.now() - t0; const popup = await pp
  await pag.waitForTimeout(700)
  const conv = goog.filter((u) => /pagead\/conversion/.test(u))
  const abrio = wa.length > 0 || !!popup
  await ctx.close()
  return { textos, info, conv0, conv, dt, abrio, wa, errores, hrefClic, goog }
}
const dec = (u) => decodeURIComponent((u.split('text=')[1] || ''))
// 1) gclid + referrer google
let r = await visita('?gclid=prueba', { referer: 'https://www.google.com/', sel: '.hero .cta a[href*="wa.me"]' })
di(r.info.ss === 'Google', '1 gclid + referrer google: origen = Google', r.info.ss)
di(r.textos.length >= 8 && r.textos.every((t) => t === '' || /^Hola, vi su anuncio en Google y quiero acceso a StorePhone|^Vi su anuncio en Google\. /.test(t)), '1 todos los textos cambiaron', JSON.stringify(r.textos))
di(r.textos.some((t) => t === 'Hola, vi su anuncio en Google y quiero acceso a StorePhone, me interesa el plan Premium' || /Vi su anuncio en Google\. Hola, quiero acceso a StorePhone, me interesa el plan Premium/.test(t)), '1 plan Premium conserva su texto', JSON.stringify(r.textos))
di(r.conv.length === 1 && /18555345517/.test(r.conv[0]), '1 el clic manda UNA conversion (googleadservices)', JSON.stringify(r.conv))
di(r.info.js === 1 && r.info.csp.length === 0, '1 gtag.js carga con la CSP y sin bloqueos', JSON.stringify(r.info.csp))
di(r.info.dl0.some((x) => x === '["config","AW-18555345517"]'), '1 config AW-18555345517 en dataLayer', r.info.dl0.join(' '))
di(r.abrio && r.dt < 1500, `1 el enlace abre (${r.dt} ms) y apunta a ${dec(r.hrefClic)}`, String(r.wa))
di(r.errores.length === 0, '1 sin errores de JS', r.errores.join())
console.log('   texto en el clic:', dec(r.wa[0] || ''), '| url:', (r.wa[0] || '').slice(0, 140))
// 2) gclid sin referrer
r = await visita('?gclid=prueba', { sel: '.hero .cta a[href*="wa.me"]' })
di(r.info.ss === 'YouTube' && /vi su anuncio en YouTube/.test(r.textos[1] || r.textos[0]), '2 gclid sin referrer: YouTube', r.info.ss)
di(r.conv.length === 1, '2 conversion enviada', String(r.conv.length))
// 3) normal
r = await visita('', { sel: '.hero .cta a[href*="wa.me"]' })
di(r.info.ss === null && r.textos.every((t) => !/anuncio/.test(t)) && r.textos.includes(SALUDO), '3 visita normal: sin origen, textos intactos', JSON.stringify(r.textos))
di(r.conv.length === 1 && r.abrio, '3 visita normal: igual manda conversion y abre', String(r.conv.length))
di(dec(r.wa[0]) === SALUDO, '3 texto al abrir = original', dec(r.wa[0]))
// 4) /pagos/
r = await visita('pagos/?gclid=prueba', { referer: 'https://www.google.com/', sel: 'a[href*="wa.me"]' })
di(r.conv.length === 0 && r.conv0 === 0, '4 /pagos/: NO se manda conversion', JSON.stringify(r.conv))
di(r.abrio && /Hola, les env/.test(dec(r.wa[0] || '')), '4 /pagos/: abre y el texto no cambia', dec(r.wa[0] || ''))
di(r.info.js === 1, '4 /pagos/: la etiqueta si carga (punto 1)', '')
// 5) utm_source e Instagram + sesion en otra pagina
r = await visita('?utm_source=newsletter', { sel: '.hero .cta a[href*="wa.me"]' }); di(r.info.ss === 'newsletter', '5 utm_source=newsletter', r.info.ss)
r = await visita('', { referer: 'https://l.instagram.com/', sel: '.hero .cta a[href*="wa.me"]' }); di(r.info.ss === 'Instagram', '5 referrer instagram', r.info.ss)
r = await visita('', { referer: 'https://www.facebook.com/', sel: '.hero .cta a[href*="wa.me"]' }); di(r.info.ss === 'Instagram', '5 referrer facebook = Instagram', r.info.ss)
r = await visita('?gclid=x', { referer: 'https://www.google.com.mx/search?q=a', sel: '.hero .cta a[href*="wa.me"]' }); di(r.info.ss === 'Google', '5 google.com.mx', r.info.ss)
// 6) toda la visita: entra con gclid, navega a otra pagina sin parametros
{
  const ctx = await nav.newContext(), pag = await ctx.newPage()
  await pag.route(/googletagmanager\.com|google\.com|doubleclick|wa\.me/, (r) => r.fulfill({ status: 200, body: '' }))
  await pag.goto(URL_ + '?gclid=z', { referer: 'https://www.google.com/' }); await pag.goto(URL_ + 'control-de-imei/')
  const h = await pag.$$eval('a[href*="wa.me/5216462875283"]', (l) => l.map((a) => decodeURIComponent(a.getAttribute('href').split('text=')[1] || '')))
  di(h.length >= 3 && h.every((t) => /vi su anuncio en Google/i.test(t)), '6 sesion: otra pagina de la visita conserva el origen', JSON.stringify(h))
  await ctx.close()
}
// 7) sessionStorage roto: la pagina sigue
{
  const ctx = await nav.newContext(), pag = await ctx.newPage(); const err = []
  pag.on('pageerror', (e) => err.push(String(e)))
  await pag.route(/googletagmanager\.com|google\.com|doubleclick|wa\.me/, (r) => r.fulfill({ status: 200, body: '' }))
  await pag.addInitScript(() => { Object.defineProperty(window, 'sessionStorage', { get() { throw new Error('bloqueado') } }) })
  await pag.goto(URL_ + '?gclid=z', { referer: 'https://www.google.com/' })
  const h = await pag.$$eval('a[href*="wa.me/5216462875283"]', (l) => l.map((a) => decodeURIComponent(a.getAttribute('href').split('text=')[1] || '')))
  di(err.length === 0 && /vi su anuncio en Google/.test(h[1]), '7 sessionStorage bloqueado: sin errores y aun asi pone el origen de esta pagina', err.join() + h[1])
  await ctx.close()
}
// 8) encuesta: el enlace final lleva el origen
{
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 } }), pag = await ctx.newPage()
  await pag.route(/googletagmanager\.com|google\.com|doubleclick/, (r) => r.fulfill({ status: 200, body: '' }))
  const wa = []; await ctx.route(/wa\.me/, (r) => { wa.push(r.request().url()); r.fulfill({ status: 200, body: 'wa' }) })
  await pag.goto(URL_ + '?gclid=z', { referer: 'https://www.google.com/', waitUntil: 'networkidle' })
  await pag.locator('a[data-encuesta]').first().click(); await pag.waitForTimeout(500)
  await pag.locator('input[name=plan]').first().check({ force: true }); await pag.waitForTimeout(100); await pag.click('#enc-sig'); await pag.waitForTimeout(450)
  for (const v of ['Mi Tienda', 'Ensenada', '2', 'a@b.com']) { await pag.locator('.enc__paso:not([hidden]) input[type=text],.enc__paso:not([hidden]) input[type=email]').first().fill(v); await pag.click('#enc-sig'); await pag.waitForTimeout(450) }
  console.log('   encuesta err:', await pag.textContent('#enc-err'), await pag.textContent('#enc-pasos')); await pag.click('#enc-wa'); await pag.waitForTimeout(700)
  di(wa.length === 1 && /^Vi su anuncio en Google\. Hola, quiero mi prueba gratuita/.test(dec(wa[0])), '8 encuesta: el WhatsApp final lleva el origen', dec(wa[0] || ''))
  await ctx.close()
}
// 9) /privacidad/ (aviso): abre a 390 y 1280, sin desborde, con la etiqueta y ligado en el pie de las 7 paginas
for (const ancho of [390, 1280]) {
  const ctx = await nav.newContext({ viewport: { width: ancho, height: 800 } }), pag = await ctx.newPage(); const err = []
  pag.on('pageerror', (e) => err.push(String(e)))
  await pag.route(/googletagmanager\.com|google\.com|doubleclick|googleadservices/, (r) => r.fulfill({ status: 200, body: '' }))
  const resp = await pag.goto(URL_ + 'privacidad/', { waitUntil: 'networkidle' })
  const d = await pag.evaluate(() => ({ h1: document.querySelector('h1')?.textContent, sobra: document.documentElement.scrollWidth - innerWidth, txt: document.body.innerText, etiqueta: !!document.querySelector('script[src*="AW-18555345517"]') }))
  di(resp.status() === 200 && d.h1 === 'Aviso de privacidad' && d.sobra <= 0 && err.length === 0, `9 /privacidad/ ${ancho}: abre, un h1, sin desborde ni errores`, JSON.stringify([resp.status(), d.sobra, err]))
  di(/etiqueta de Google Ads/.test(d.txt) && /cookies/.test(d.txt) && /646 287 5283/.test(d.txt) && /no vendemos/i.test(d.txt) && d.etiqueta, `9 /privacidad/ ${ancho}: dice lo de Google Ads, cookies, WhatsApp y que no se venden datos; lleva la etiqueta`)
  await pag.screenshot({ path: `privacidad-${ancho}.png`, fullPage: true }); await ctx.close()
}
{
  const ctx = await nav.newContext(), pag = await ctx.newPage(); const mal = []
  await pag.route(/googletagmanager\.com|google\.com|doubleclick|googleadservices/, (r) => r.fulfill({ status: 200, body: '' }))
  for (const r of ['', 'control-de-imei/', 'punto-de-venta-con-creditos/', 'sistema-para-celulares-monterrey/', 'sistema-para-celulares-cdmx/', 'recomienda/', 'pagos/']) {
    await pag.goto(URL_ + r); const n = await pag.locator('footer.pie a[href="/privacidad/"]').count(); if (n !== 1) mal.push(r)
  }
  di(mal.length === 0, '9 el pie de las 7 paginas liga a /privacidad/ (una vez)', mal.join(' ')); await ctx.close()
}
console.log(`\nRESULTADO: ${bien} bien, ${mal} mal`)
await nav.close(); process.exit(mal ? 1 : 0)
