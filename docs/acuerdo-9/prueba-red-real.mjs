import { chromium } from 'playwright'
const nav = await chromium.launch({ executablePath: process.env.CHROMIUM, args: ['--no-sandbox'] })
for (const ruta of ['?gclid=prueba', 'pagos/?gclid=prueba']) {
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 } }), pag = await ctx.newPage()
  const red = [], viol = []
  await ctx.route(/wa\.me/, (r) => r.fulfill({ status: 200, body: 'wa' }))
  pag.on('request', (r) => { if (/google|doubleclick/.test(r.url())) red.push(r.url().slice(0, 110)) })
  await pag.addInitScript(() => { window.__v = []; document.addEventListener('securitypolicyviolation', (e) => window.__v.push(e.blockedURI + ' ' + e.violatedDirective)) })
  await pag.goto('http://127.0.0.1:9400/' + ruta, { waitUntil: 'networkidle', referer: 'https://www.google.com/' })
  await pag.locator('.hero .cta a[href*="wa.me"], a.btn[href*="wa.me"]:visible').first().click(); await pag.waitForTimeout(2500)
  console.log('==', ruta, '\nviolaciones:', JSON.stringify(await pag.evaluate(() => window.__v)), '\nred:\n ' + red.join('\n '))
  await ctx.close()
}
await nav.close()
