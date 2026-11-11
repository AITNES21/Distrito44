import type { APIRoute } from 'astro';
import { pages, site } from '../data/site';

/**
 * sitemap.xml propio (sin dependencias): conserva exactamente las URLs
 * originales (.html), la ruta /sitemap.xml declarada en robots.txt y la
 * extensión de imágenes del sitemap anterior.
 */
export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = pages
    .filter((p) => !('noindex' in p && p.noindex))
    .map((p) => {
      const image =
        'image' in p && p.image
          ? `
    <image:image>
      <image:loc>${site.url}${p.image}</image:loc>
      <image:title>${p.imageTitle}</image:title>
    </image:image>`
          : '';
      return `  <url>
    <loc>${new URL(p.path, site.url).href}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>${image}
  </url>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
