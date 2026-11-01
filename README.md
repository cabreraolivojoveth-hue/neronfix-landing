# neronfix-landing · www.neronfix.com

Página pública de **StorePhone** (por Neron), el sistema para tiendas de celulares.
Una sola página estática, sin scripts ni fuentes externas.

| Archivo | Qué es |
|---|---|
| `index.html` | Toda la página: textos, estilo (en `<style>`), metadatos y JSON-LD |
| `og-storephone.jpg` | Imagen 1200×630 para WhatsApp, Facebook y X |
| `logo-oficial.png` | Logo oficial (negro sobre blanco), tal cual; lo usa el JSON-LD |
| `logo-oficial-cabecera.png` | Marca + palabra del oficial, en negro y fondo transparente, para la cabecera |
| `site.webmanifest`, `favicon-32/192/512.png`, `apple-touch-icon.png` | Iconos: la marca «NO» del oficial, negra sobre blanco, con centrado óptico |
| `logo-perfil.png`, `logo-perfil-completo.png` | Para el perfil de Google (720 y 1080, centrado óptico); no se ligan desde la página |
| `robots.txt`, `sitemap.xml` | Para buscadores (cambiar `lastmod` al publicar un cambio de texto) |
| `vercel.json` | Cabeceras de seguridad, caché y redirecciones de las páginas viejas |

Prueba: `URL=<sitio> SAL=<carpeta-fotos> [REPO=<este repo>] node /home/joveth/neron/neron-landing/pruebas/prueba-landing.mjs`
(local: `python3 -m http.server` en este repo). Reglas en `CLAUDE.md`.
