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
| Precio "Desde" de la tarjeta de un sistema | `SYSTEMS[].price` |
| Formas de pago y su etiqueta | `PERIODS[]` |
| Textos y beneficios de cada sistema | `SYSTEMS[]` |
| Métricas de la franja de números | `STATS[]` |
| Tarjetas de "Por qué Neron" | `BENEFITS[]` |
| Fila de confianza bajo el hero | `TRUST[]` |
| Preguntas frecuentes | `FAQS[]` |
| Enlaces del menú | `NAV[]` |
| Términos y Aviso de privacidad | `ROUTES.terminos` / `ROUTES.privacidad` |

### Precios

Los tres sistemas tienen tres planes (Normal, Premium y Pro) y tres formas de
pago (mensual, trimestral y anual). Todo vive en `PLANS` dentro de
`assets/config.js`; la sección de precios no consulta ninguna API.

El visitante elige primero su sistema y después la forma de pago, así que
nunca ve nueve tarjetas al mismo tiempo. Las pestañas se generan solas de
`SYSTEMS` y de `PERIODS`.

Al cambiar un precio hay que respetar la regla de la escalera: **el anual son
diez mensualidades** (dos meses gratis) y **el trimestral ronda el 10% de
descuento** sobre tres meses. Las tarjetas calculan solas el "te sale en $X al
mes"; no se escribe a mano.

El `price` de `SYSTEMS[]` es el precio del plan Normal y sólo alimenta el
gancho "Tres planes desde $X al mes" de la tarjeta y la métrica "Desde $X al
mes". Si cambias el Normal, cámbialo también ahí.

La tarjeta del sistema **no repite el precio completo**: anuncia que hay tres
planes y lleva a la sección de precios con la pestaña de ese sistema ya
elegida (`data-plans-for`). Si el precio vuelve a aparecer entero en la
tarjeta, la misma información queda en dos lugares y se desincroniza.

Los precios se publican **con IVA incluido**.

### Enlaces legales

`ROUTES.terminos` y `ROUTES.privacidad` están vacíos, así que esos enlaces
están ocultos en el footer. En cuanto pongas una URL aparecen solos.

## Canal de atención

**WhatsApp es el único canal de servicio y soporte** (663 542 7493). No se
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
tarjeta va a WhatsApp, para no dejar un enlace que no abre: es el caso de
Terapias mientras no tenga subdominio propio. Si algún día hay un acceso
único, se cambia en `SYSTEMS[].url` o se añade un `loginUrl`.

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
