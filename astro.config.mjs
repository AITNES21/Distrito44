// @ts-check
import { defineConfig } from 'astro/config';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://distrito-44.com',
  // Se conservan EXACTAMENTE las URLs actuales (/quienes-somos.html, etc.)
  // para no perder posicionamiento: build.format "file" genera "pagina.html".
  build: {
    format: 'file',
    inlineStylesheets: 'auto',
  },
  trailingSlash: 'ignore',
  compressHTML: true,
  image: {
    // Imágenes locales optimizadas con sharp (AVIF + WebP)
    responsiveStyles: false,
  },
  devToolbar: { enabled: false },
});
