// Prueba de la encuesta del mes gratis (10/11/2026). Hermana de prueba-landing.mjs (mismas variables):
// URL=http://127.0.0.1:PUERTO/ SAL=/carpeta/fotos CHROMIUM=/ruta/chrome node prueba-encuesta.mjs
// Sin URL, sirve la carpeta REPO (por omisión ..) con un servidor mínimo.
import { chromium } from 'playwright'
import http from 'http'
import fs from 'fs'
import path from 'path'
const SAL = process.env.SAL || '/tmp/fotos-encuesta'
fs.mkdirSync(SAL, { recursive: true })
let URL = process.env.URL, srv
if (!URL) {
  const raiz = path.resolve(process.env.REPO || new globalThis.URL('..', import.meta.url).pathname)
  const tipos = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain' }
  srv = http.createServer((q, r) => {
    if (q.method === 'POST') { r.writeHead(204); return r.end() }
    let f = path.join(raiz, decodeURIComponent(q.url.split('?')[0])); if (f.endsWith('/')) f += 'index.html'
    fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end() } r.writeHead(200, { 'content-type': tipos[path.extname(f)] || 'application/octet-stream' }); r.end(b) })
  }).listen(0, '127.0.0.1')
  await new Promise((x) => srv.on('listening', x))
  URL = `http://127.0.0.1:${srv.address().port}/`
}
const casos = []
const di = (ok, t, d = '') => { casos.push(!!ok); console.log(`${ok ? 'BIEN' : 'MAL '} | ${t}${d ? ' — ' + d : ''}`) }
const nav = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined })
const WA = 'https://wa.me/5216462875283?text='
const NO = 'no estás obligado a quedarte'

async function recorre(nombre, vista, plan, sufijo) {
  const ctx = await nav.newContext({ viewport: vista, deviceScaleFactor: 2 })
  const pag = await ctx.newPage()
  const marcas = []; const errores = []
  pag.on('request', (r) => { if (/\/clic\?/.test(r.url())) marcas.push(new globalThis.URL(r.url()).searchParams.get('d') + ':' + r.method()) })
  pag.on('pageerror', (e) => errores.push(e.message))
  const raros = []
  pag.on('request', (r) => { const u = new globalThis.URL(r.url()); if (u.hostname !== '127.0.0.1' && u.hostname !== 'wa.me') raros.push(u.hostname) })
  await pag.route('https://wa.me/**', (r) => r.fulfill({ status: 200, contentType: 'text/html', body: 'wa' }))
  await pag.goto(URL, { waitUntil: 'networkidle' })
  const hero = (await pag.locator('.hero').innerText()).replace(/\s+/g, ' ')
  di(/Empieza gratis: 30 días de prueba/.test(hero) && hero.includes(NO) && hero.includes('Atención directa con nosotros, los programadores'), `${nombre}: el hero dice «gratis», «${NO}» y la atención directa con los programadores`)
  await pag.screenshot({ path: `${SAL}/hero-${sufijo}.png` })
  const tarjetas = await pag.locator('.plan').allInnerTexts()
  const pr = [['$450', '$450'], ['$750', '$750'], ['$1,250', 'desde $1,250']]
  const est = await pag.locator('.plan').evaluateAll((ps) => ps.map((p) => { const b = p.querySelector('.precio b'), g = p.querySelector('.precio .gratis-grande'), l = p.querySelector('.letra'); return { tach: getComputedStyle(b).textDecorationLine, b: b.textContent, g: g && g.textContent, gs: g && parseFloat(getComputedStyle(g).fontSize), bs: parseFloat(getComputedStyle(b).fontSize), l: l && l.textContent } }))
  di(est.length === 3 && est.every((e, i) => e.tach === 'line-through' && e.b === pr[i][0] && e.g === 'Gratis' && e.gs > e.bs && e.l === `Primer mes gratis. A partir del segundo mes empieza a correr tu plan: ${pr[i][1]} al mes con IVA`), `${nombre}: cada plan tiene precio tachado, «Gratis» en grande y la letra chica del segundo mes`, JSON.stringify(est.map((e) => e.l)))
  di(await pag.evaluate(() => [...document.querySelectorAll('.plan .letra')].every((l) => parseFloat(getComputedStyle(l).fontSize) >= 12.5 && l.scrollWidth <= l.clientWidth + 1)), `${nombre}: la letra chica se lee (>=12.5px) y no se corta`)
  const botones = await pag.locator('a[data-encuesta]').allInnerTexts()
  di(botones.length === 4 && botones.every((t) => t.trim() === 'Probar gratis 30 días'), `${nombre}: los 4 botones que abren la encuesta dicen «Probar gratis 30 días»`, botones.map((t) => t.trim()).join(' | '))
  const precios = (await pag.locator('.plan .precio b').allInnerTexts()).join(' ')
  di(precios === '$450 $750 $1,250', `${nombre}: precios sin cambios`, precios)
  const meta = await pag.locator('meta[name=description]').getAttribute('content')
  di(/gratis/.test(meta), `${nombre}: la description menciona la prueba gratis`)
  const sin = await pag.evaluate(() => ['#empezar', '.pie'].map((q) => /30 días gratis|primer mes gratis/i.test(document.querySelector(q).innerText)))
  di(!sin[0] && !sin[1], `${nombre}: la franja de cierre y el pie no repiten la oferta`)

  // abrir desde el botón del plan
  const btn = pag.locator(`a[data-encuesta="${plan}"]`)
  await btn.scrollIntoViewIfNeeded()
  if (sufijo === "390") { await pag.waitForTimeout(1200) }
  if (sufijo === "390") await pag.locator(`.plan:has(a[data-encuesta="${plan}"])`).screenshot({ path: `${SAL}/plan-${plan}-390.png` })
  await btn.focus(); await btn.click()
  const dlg = pag.locator('#encuesta [role=dialog]')
  await dlg.waitFor()
  const a11y = await dlg.evaluate((e) => ({ m: e.getAttribute('aria-modal'), l: document.getElementById(e.getAttribute('aria-labelledby'))?.textContent.trim() }))
  di(a11y.m === 'true' && !!a11y.l, `${nombre}: la ventana es un dialog con aria-modal y título`, a11y.l)
  di((await pag.locator('.enc__sello').innerText()).includes('Prueba gratuita'), `${nombre}: el encabezado dice «Prueba gratuita»`)
  di(await pag.locator(`input[name=plan][value="${plan}"]`).isChecked(), `${nombre}: el plan ${plan} llega seleccionado`)
  di(await pag.evaluate(() => document.activeElement?.name === 'plan' && document.activeElement.checked), `${nombre}: el foco entra al plan seleccionado`)
  di(await pag.evaluate(() => document.querySelector('main').inert), `${nombre}: el resto de la página queda inerte`)
  di(marcas.join() === 'encuesta-inicio:POST', `${nombre}: la medición cuenta el inicio de la encuesta (y no un clic a WhatsApp)`, marcas.join())
  const sinScroll = () => pag.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.querySelector('.enc__caja').scrollWidth <= document.querySelector('.enc__caja').clientWidth)
  di(await sinScroll(), `${nombre}: paso 1 sin scroll horizontal`)
  await pag.screenshot({ path: `${SAL}/encuesta-1-${sufijo}.png` })

  // Esc cierra y devuelve el foco; X también
  await pag.keyboard.press('Escape')
  di(await pag.locator('#encuesta').isHidden() && await pag.evaluate(() => document.activeElement?.hasAttribute('data-encuesta')), `${nombre}: Esc cierra y el foco vuelve al botón`)
  await btn.click(); await dlg.waitFor(); await pag.click('#enc-x')
  di(await pag.locator('#encuesta').isHidden() && await pag.evaluate(() => document.activeElement?.hasAttribute('data-encuesta') && !document.querySelector('main').inert), `${nombre}: la X cierra, foco de vuelta y página activa`)
  await btn.click(); await dlg.waitFor()

  // pasos con validación
  const sig = pag.locator('#enc-sig'), err = pag.locator('#enc-err')
  await sig.click()
  const paso = () => pag.locator('#enc-pasos').innerText()
  di(await paso() === 'Paso 2 de 6', `${nombre}: Siguiente avanza (barra de progreso)`, await paso())
  di(await pag.evaluate(() => document.activeElement?.id === 'enc-tienda'), `${nombre}: el foco pasa al campo de la tienda`)
  await sig.click(); di(/nombre de tu tienda/.test(await err.innerText()) && await paso() === 'Paso 2 de 6', `${nombre}: tienda vacía no deja avanzar`)
  await pag.fill('#enc-tienda', '  Celulares   El Güero  '); await pag.keyboard.press('Enter')
  await pag.fill('#enc-ciudad', 'Ensenada'); await sig.click()
  await pag.fill('#enc-sucursales', 'dos'); await sig.click()
  di(/con número/.test(await err.innerText()) && await paso() === 'Paso 4 de 6', `${nombre}: sucursales no numérico no avanza`)
  await pag.fill('#enc-sucursales', '0'); await sig.click(); di(await paso() === 'Paso 4 de 6', `${nombre}: 0 sucursales no avanza`)
  await pag.fill('#enc-sucursales', '3'); await sig.click()
  for (const mal of ['hola', 'a@b', 'a b@c.com', '@c.com', 'a@c.']) {
    await pag.fill('#enc-correo', mal); await sig.click()
    di(/correo válido/.test(await err.innerText()) && await paso() === 'Paso 5 de 6' && await pag.locator('#enc-correo').getAttribute('aria-invalid') === 'true', `${nombre}: correo «${mal}» se rechaza`)
  }
  // Atrás conserva respuestas
  await pag.click('#enc-atras'); const v = await pag.inputValue('#enc-sucursales')
  di(v === '3' && await paso() === 'Paso 4 de 6', `${nombre}: Atrás conserva lo escrito`, v)
  await sig.click()
  await pag.fill('#enc-correo', 'dueño@tienda.com.mx'.replace('ñ', 'n')); await pag.screenshot({ path: `${SAL}/encuesta-5-${sufijo}.png` }); await sig.click()
  di(await paso() === 'Paso 6 de 6' && await pag.locator('#enc-sig').isHidden(), `${nombre}: paso final de confirmación`)
  const res = (await pag.locator('#enc-resumen').innerText()).replace(/\s+/g, ' ')
  di(res.includes(plan) && res.includes('Celulares El Güero') && res.includes('Ensenada') && res.includes('3') && res.includes('dueno'.replace('о', 'o') + '@tienda.com.mx'.slice(0)), `${nombre}: el resumen trae los 5 datos`, res)
  const fin = (await pag.locator('.enc__caja').innerText()).replace(/\s+/g, ' ')
  di(fin.includes('Atención directa con nosotros: cualquier duda, aquí platicamos') && !fin.includes('obligado'), `${nombre}: el último paso trae la línea de atención directa (sin repetir lo de «no estás obligado»)`)
  const href = await pag.locator('#enc-wa').getAttribute('href')
  const esperado = `Hola, quiero mi prueba gratuita (30 días) de StorePhone. Plan: ${plan}. Mi tienda: Celulares El Güero. Ciudad: Ensenada. Sucursales: 3. Correo: dueno@tienda.com.mx. Me gustaría platicar con el equipo para empezar.`.replace('dueno', 'dueno')
  di(href === WA + encodeURIComponent(esperado), `${nombre}: el enlace a WhatsApp lleva el mensaje exacto codificado`, decodeURIComponent(href.slice(WA.length)))
  di(href.includes(encodeURIComponent('Celulares El Güero')) && href.includes('%40') , `${nombre}: tienda con acento y correo codificados`)
  di(await sinScroll(), `${nombre}: paso final sin scroll horizontal`)
  await pag.screenshot({ path: `${SAL}/encuesta-6-${sufijo}.png` })
  // Tab no se escapa de la ventana
  let dentro = true; for (let i = 0; i < 8; i++) { await pag.keyboard.press('Tab'); dentro = dentro && await pag.evaluate(() => !!document.activeElement.closest('.enc__caja')) }
  di(dentro, `${nombre}: Tab se queda dentro de la ventana`)
  marcas.length = 0
  await pag.evaluate(() => document.addEventListener('click', (e) => { if (e.target.closest('#enc-wa')) e.preventDefault() }))
  await pag.click('#enc-wa'); await pag.waitForTimeout(400)
  di(marcas.join() === `encuesta-whatsapp:POST`, `${nombre}: el clic final a WhatsApp se cuenta aparte`, marcas.join())
  di(raros.length === 0 && errores.length === 0, `${nombre}: sin servidores de fuera ni errores de JS`, [...raros, ...errores].join(' '))
  const guardado = await pag.evaluate(() => JSON.stringify([localStorage, sessionStorage]))
  di(!/tienda\.com|Ensenada|Güero/.test(guardado), `${nombre}: nada de datos personales en localStorage ni sessionStorage`)
  await ctx.close()
}
await recorre('390 px', { width: 390, height: 844 }, 'Premium', '390')
await recorre('escritorio', { width: 1366, height: 800 }, 'Pro', 'escritorio')

// El botón del cierre abre la encuesta sin plan marcado; el botón flotante sigue directo a WhatsApp
{
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 } }); const pag = await ctx.newPage()
  await pag.goto(URL, { waitUntil: 'networkidle' })
  await pag.locator('#empezar a[data-encuesta]').scrollIntoViewIfNeeded(); await pag.locator('#empezar a[data-encuesta]').click()
  di(await pag.locator('input[name=plan]:checked').count() === 0, 'Botón del cierre: abre la encuesta sin plan marcado')
  await pag.click('#enc-sig'); di(/Elige un plan/.test(await pag.locator('#enc-err').innerText()), 'Sin plan elegido no avanza')
  await pag.click('#enc-x')
  const directos = await pag.evaluate(() => [...document.querySelectorAll('.barra a, .hdr a[href*="wa.me"], .hero a[href*="wa.me"]')].every((a) => !a.hasAttribute('data-encuesta') && a.href.startsWith('https://wa.me/5216462875283?text=')))
  di(directos, 'Botón flotante, cabecera y portada siguen directos a WhatsApp')
  await ctx.close()
}
await nav.close(); srv?.close()
const mal = casos.filter((x) => !x).length
console.log(`\n${casos.length - mal}/${casos.length} BIEN`)
process.exit(mal ? 1 : 0)
