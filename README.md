# neronfix-landing · www.neronfix.com

Página pública de **StorePhone** (por Neron), el sistema para tiendas de celulares.
Una sola página estática, sin scripts ni fuentes externas.

| Archivo | Qué es |
|---|---|
| `index.html` | Toda la página: textos, estilo (en `<style>`), metadatos y JSON-LD |
| `og-storephone.jpg` | Imagen 1200×630 para WhatsApp, Facebook y X |
| `logo-header-88.webp` | Copia chica del logo para la cabecera (los originales no se tocan) |
| `site.webmanifest`, `favicon-*.png`, `apple-touch-icon.png` | Iconos |
| `robots.txt`, `sitemap.xml` | Para buscadores (cambiar `lastmod` al publicar un cambio de texto) |
| `vercel.json` | Cabeceras de seguridad, caché y redirecciones de las páginas viejas |

Prueba: `URL=<sitio> SAL=<carpeta-fotos> [REPO=<este repo>] node /home/joveth/neron/neron-landing/pruebas/prueba-landing.mjs`
(local: `python3 -m http.server` en este repo). Reglas en `CLAUDE.md`.
