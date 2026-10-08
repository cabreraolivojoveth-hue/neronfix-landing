# Neron · Landing

Sitio estático (HTML + CSS + JavaScript, sin framework ni paso de compilación).
Se publica en Vercel tal cual está: no hay que instalar ni construir nada.

```
index.html          Landing principal
faq.html            Centro de ayuda
contacto.html       Contacto
vercel.json         Encabezados de seguridad y caché
assets/
  config.js         ← TODO el contenido editable vive aquí
  neron.css         Sistema de diseño (tokens, botones, componentes)
  pages.css         Estilos de las páginas internas
  icons.js          Sprite de iconos compartido
  ui.js             Primitivas: revelado, count-up, acordeón, modal, analítica
  components.js     Render de cada sección a partir de config.js
  app.js            Arranque: header, menú, scrollspy, barra móvil
  faq-search.js     Buscador del Centro de ayuda
```

## Dónde cambiar cada cosa

Casi todo se edita en **`assets/config.js`**. No hace falta tocar el HTML.

| Quiero cambiar… | Edita en `config.js` |
|---|---|
| Mensaje precargado de WhatsApp | `CONTACT_CONFIG.whatsappMessage` |
| Número de WhatsApp | `CONTACT_CONFIG.whatsappNumber` y `.whatsappDisplay` |
| Precios de los tres planes de un sistema | `PLANS.<sistema>[].precios` |
| Precio "Desde" de la tarjeta de un sistema | Sale solo del plan Normal de `PLANS` |
| Sección del ecosistema / Neron One | `ECOSISTEMA` |
| Formas de pago y su etiqueta | `PERIODS[]` |
| Textos y beneficios de cada sistema | `SYSTEMS[]` |
| Métricas de la franja de números | `STATS[]` |
| Tarjetas de "Por qué Neron" | `BENEFITS[]` |
| Fila de confianza bajo el hero | `TRUST[]` |
| Preguntas frecuentes | `FAQS[]` |
| Enlaces del menú | `NAV[]` |
| Términos y Aviso de privacidad | `ROUTES.terminos` / `ROUTES.privacidad` |

### Precios

Neron Celulares y Neron Autos tienen tres planes cada uno (Normal, Premium y
Pro) y tres formas de pago (mensual, trimestral y anual). Neron One no tiene
precio publicado: su tarjeta (`tipo: 'app'`) no sale en las pestañas de
precios. Todo vive en `PLANS` dentro de
`assets/config.js`; la sección de precios no consulta ninguna API.

El visitante elige primero su sistema y después la forma de pago, así que
nunca ve nueve tarjetas al mismo tiempo. Las pestañas se generan solas de
`SYSTEMS` y de `PERIODS`.

La regla de la escalera: **el anual son diez mensualidades** (dos meses
gratis) y **el trimestral es tres meses con 10% de descuento**. Autos la
calcula sola con `escalera(mensual)`: se cambia el mensual y lo demás se
recalcula. Celulares conserva sus tres cifras escritas a mano porque son sus
precios publicados (el trimestral está redondeado a números cerrados). Las
tarjetas calculan solas el "te sale en $X al mes", a centavo exacto.

El "Tres planes desde $X al mes" de cada tarjeta y la métrica "Desde $X al
mes" salen solos del plan Normal de `PLANS`: ya no hay un `price` que
actualizar aparte.

Un plan con `alta` (hoy, el Normal de Celulares) no va a WhatsApp: su botón
lleva a crear la cuenta en el sistema y debajo dice su nota ("1 mes gratis ·
Sin tarjeta").

La tarjeta del sistema **no repite el precio completo**: anuncia que hay tres
planes y lleva a la sección de precios con la pestaña de ese sistema ya
elegida (`data-plans-for`). Si el precio vuelve a aparecer entero en la
tarjeta, la misma información queda en dos lugares y se desincroniza.

Los precios se publican **con IVA incluido**.

### Enlaces legales

`ROUTES.terminos` y `ROUTES.privacidad` están vacíos, así que esos enlaces
están ocultos en el footer. En cuanto pongas una URL aparecen solos.

## Canal de atención

**WhatsApp es el único canal de servicio y soporte** (646 287 5283). No se
publica correo, formulario ni teléfono como vía de atención. Instagram y
YouTube son perfiles de marca y así se indican en la página, para que nadie
pida soporte por ahí.

Para cambiar el número basta con editar `CONTACT_CONFIG.whatsappNumber`
(formato internacional, sólo dígitos) y `whatsappDisplay` (cómo se muestra en
pantalla). Los 17 enlaces de las tres páginas se regeneran solos.

## Reglas del contenido

**No se publican datos que no sean reales.** En `STATS[]` hay entradas marcadas
como `PLACEHOLDER` con `enabled:false` (negocios activos, ventas procesadas,
tiempo activo garantizado). Cuando tengas las cifras reales, cámbialas y pon
`enabled:true`. No las actives con números inventados.

Las cifras que aparecen dentro del mockup del panel son ilustrativas de la
interfaz del sistema, no afirmaciones sobre el negocio.

## Logotipo

Los cuatro archivos originales (`logo-final.png`, `logo-principal-full.png`,
`logo-mono.png`, `logo-neron.png`) **no se modificaron**.

- `logo-header.png` es una copia reducida a escala exacta 1:3 de
  `logo-final.png` (282×233 en vez de 846×699). Mismo diseño, mismas
  proporciones, sólo menos píxeles: 34 KB en vez de 336 KB. Se usa en el
  header, el menú móvil y el footer.
- Como el logotipo original es blanco (pensado para fondo oscuro), sobre el
  fondo claro se pinta con `filter:brightness(0)` en CSS. Eso sólo cambia el
  color: la forma, las proporciones y la transparencia se conservan intactas.
- `logo-principal-full.png` se sigue usando para redes sociales (Open Graph).
- Los iconos de pestaña (`favicon-*.png`, `apple-touch-icon.png`) son el mismo
  logotipo sin alterar, sobre el burgundy de marca.

## Analítica

No hay ninguna plataforma instalada. `assets/ui.js` expone un puente único:
cada evento se acumula en `window.dataLayer` y se reenvía a `gtag` o `fbq` si
algún día se cargan.

Para conectar Google Tag Manager o Meta Pixel basta con pegar su script en el
`<head>` del HTML; no hay que tocar nada más.

Eventos que emite la landing:

```
hero_cta_click   whatsapp_click   system_autos_click   system_cellphones_click
system_pos_click plan_click       faq_open             login_click
nav_click        final_cta_click  mobile_bar_click     help_click
```

Para verlos en consola durante pruebas: `ANALYTICS_CONFIG.debug = true`.

## Inicio de sesión

No existe una ruta de login unificada en `neronfix.com`. El botón "Iniciar
sesión" abre un modal que lleva al sistema real que el negocio ya contrató
(`storephone.neronfix.com` para Celulares, `autos.neronfix.com` para Autos).
Un sistema sin `url` en `SYSTEMS[]` no aparece en el modal y su botón de la
tarjeta va a WhatsApp, para no dejar un enlace que no abre. Neron One
(`tipo: 'app'`) tampoco aparece: no tiene alta pública. Neron Terapias salió de
la oferta el 25/09/2026 y su contenido quedó en `ARCHIVO_TERAPIAS`. Si algún día hay un acceso
único, se cambia en `SYSTEMS[].url` o se añade un `loginUrl`.

## Capa de movimiento (animación)

La landing se anima con una capa **opcional** encima del sitio, sin tocar su contenido:

```
assets/motion.js      Animaciones (GSAP + ScrollTrigger): hero, encabezados, sistemas,
                      "del desorden al control", planes, FAQ y cierre
assets/motion.css     Estados y micro-interacciones (hover, foco, FAQ, botones)
assets/vendor/        GSAP 3.13 + ScrollTrigger servidos desde el propio sitio
                      (la CSP de vercel.json no permite CDN). Ver LEEME.txt
```

- Los textos de las piezas animadas viven en `MOTION` dentro de `assets/config.js`.
  Son decorativos o ilustrativos (no son cifras ni resultados de ningún negocio).
- La sección `#orden` ("Del desorden al control") se genera en `components.js`
  (`renderOrden`) a partir de `MOTION.orden`.
- Mejora progresiva: sin GSAP, con un error de JS o con "reducir movimiento" activado
  la página se muestra completa en su estado final (clase `motion-static` / `motion-fail`).
- Sólo se animan `transform` y `opacity` (y las propiedades `translate`/`scale` con
  variables CSS). No hay scroll-jacking: la sección fijada usa `position:sticky`.
- Para ajustar tiempos o curvas, edita las constantes al inicio de cada bloque `build…()`
  en `motion.js`.

## Probar en local

```bash
python3 -m http.server 8000
# abrir http://127.0.0.1:8000
```

## Accesibilidad

- Toda la interfaz es navegable con teclado; el primer tabulador abre el
  enlace "Saltar al contenido".
- Los colores de texto cumplen contraste AA (4.5:1) sobre sus fondos.
- Con `prefers-reduced-motion: reduce` se desactivan todas las animaciones.
