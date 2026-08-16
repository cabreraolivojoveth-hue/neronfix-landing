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
  contacto.js       Tarjeta de correo de la página de contacto
```

## Dónde cambiar cada cosa

Casi todo se edita en **`assets/config.js`**. No hace falta tocar el HTML.

| Quiero cambiar… | Edita en `config.js` |
|---|---|
| Número o mensaje de WhatsApp | `CONTACT_CONFIG.whatsappNumber` / `.whatsappMessage` |
| Correo de contacto | `CONTACT_CONFIG.email` (vacío = la tarjeta se oculta sola) |
| Precios de Autos y Celulares | `SYSTEMS[].price` |
| Textos y beneficios de cada sistema | `SYSTEMS[]` |
| Métricas de la franja de números | `STATS[]` |
| Tarjetas de "Por qué Neron" | `BENEFITS[]` |
| Fila de confianza bajo el hero | `TRUST[]` |
| Preguntas frecuentes | `FAQS[]` |
| Enlaces del menú | `NAV[]` |
| Términos y Aviso de privacidad | `ROUTES.terminos` / `ROUTES.privacidad` |

### Precios de Neron Caja

**No se editan aquí.** La sección de precios consulta la API real
`https://caja.neronfix.com/api/planes` y se sincroniza sola. `PLANS_FALLBACK`
es únicamente el respaldo que se muestra si la API no responde.

El precio más bajo que devuelve la API se propaga automáticamente a la tarjeta
de Neron Caja y a la métrica "Desde $X al mes".

### Enlaces legales

`ROUTES.terminos` y `ROUTES.privacidad` están vacíos, así que esos enlaces
están ocultos en el footer. En cuanto pongas una URL aparecen solos.

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
(`autos.`, `celulares.` o `caja.neronfix.com`). Si algún día hay un acceso
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
