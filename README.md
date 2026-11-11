# Distrito 44 — web

Web de [distrito-44.com](https://distrito-44.com), construida con [Astro](https://astro.build) como sitio
100 % estático y publicada en GitHub Pages.

La auditoría de la web anterior, las decisiones de diseño y la estrategia SEO de la migración están en
**[docs/AUDITORIA.md](docs/AUDITORIA.md)**.

## Requisitos

- Node.js ≥ 22.12

## Uso

```bash
npm install
```

```bash
npm run dev        # servidor de desarrollo en http://localhost:4321
```

```bash
npm run build      # genera dist/
```

```bash
npm run preview    # sirve dist/ para revisarlo tal y como se publicará
```

```bash
npm run validate   # tras el build: URLs, metadatos SEO, enlaces, imágenes, sitemap
```

## Dónde se edita cada cosa

| Quiero cambiar… | Fichero |
|---|---|
| Teléfono, email, dirección, menú | `src/data/site.ts` |
| ID de Google Analytics (`G-…`) | `src/data/site.ts` → `analytics.measurementId` |
| Datos estructurados (Schema.org) | `src/data/schema.ts` |
| Fotos y textos de la galería | `src/data/gallery.ts` + `src/assets/img/` |
| Textos de una página | `src/pages/<pagina>.astro` |
| Colores, tipografía, espaciados | `src/styles/variables.css` |
| Líneas decorativas | `src/components/OrganicLines.astro` |

Las imágenes nuevas se añaden en `src/assets/img/` en su mayor resolución: Astro genera automáticamente
las versiones AVIF/WebP y los tamaños responsive.

## Google Analytics

Se activa poniendo el ID de medición GA4 en `analytics.measurementId` (`src/data/site.ts`).
Con el ID vacío no se incluye nada. Con ID, se muestra un aviso de cookies y Google Analytics
solo se carga si el visitante pulsa «Aceptar» (LSSI art. 22.2); la elección se puede cambiar desde
«Configurar cookies» en el pie. Eventos enviados: `generate_lead` (formulario de contacto enviado
con éxito) y `contact_click` (clic en teléfono o email); GA4 mide solo los clics salientes (Idealista).

## Imagen para compartir

`public/og/distrito-44.jpg` (1200×630, JPG) es la vista previa al compartir en WhatsApp, Facebook,
LinkedIn o X en todas las páginas. Logo y nombre van centrados para que también se vean bien en
la miniatura cuadrada de WhatsApp. Si se sustituye, mantener tamaño, formato JPG y nombre (o cambiar
`defaultOgImage` en `src/data/site.ts`).

## URLs

Se mantienen exactamente las URLs originales (`/quienes-somos.html`, `/contacto.html`…).
`astro.config.mjs` usa `build.format: 'file'` para ello. Si se crea una página nueva, añádela también a
`pages` en `src/data/site.ts` para que entre en el sitemap.

## Despliegue

`.github/workflows/deploy.yml` compila, valida y publica en GitHub Pages **solo al fusionar en `main`**.
Requiere, una única vez: *Settings → Pages → Source → GitHub Actions*.
Las ramas y pull requests ejecutan solo `ci.yml` (comprobación, sin publicar).

## Estructura

```
src/components   Componentes reutilizables (cabecera, pie, trazos SVG, botones…)
src/data         Datos del sitio (fuente única)
src/layouts      Layout común con SEO
src/pages        Una página por URL
src/styles       Tokens de diseño y estilos globales
public           Ficheros servidos tal cual (CNAME, robots.txt, favicon, /img original)
scripts          Validación post-build
legacy           Web anterior, solo como referencia (no se publica)
```
