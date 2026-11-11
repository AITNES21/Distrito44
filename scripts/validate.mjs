#!/usr/bin/env node
/**
 * Validación post-build (sin dependencias): `npm run build && npm run validate`
 *
 * - Todas las URLs originales existen en dist/ con la misma ruta.
 * - <title>, meta description y canonical coinciden con la web original
 *   (legacy/*.html) para no perder posicionamiento.
 * - Un único <h1> por página.
 * - Enlaces internos, imágenes y recursos apuntan a ficheros existentes.
 * - Todas las <img> tienen atributo alt.
 * - JSON-LD válido.
 * - sitemap.xml bien formado y solo con URLs existentes e indexables.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const legacy = join(root, 'legacy');
const SITE = 'https://distrito-44.com';

const pages = [
  'index.html',
  'quienes-somos.html',
  'nuestros-servicios.html',
  'nuestro-metodo.html',
  'galeria.html',
  'contacto.html',
  'departamento-juridico.html',
  'aviso-legal.html',
];

let failures = 0;
let warnings = 0;
const fail = (m) => {
  failures++;
  console.log(`  ✗ ${m}`);
};
const warn = (m) => {
  warnings++;
  console.log(`  ! ${m}`);
};
const pass = (m) => console.log(`  ✓ ${m}`);

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
const pick = (html, re) => {
  const m = html.match(re);
  return m ? decode(m[1]) : null;
};
const meta = {
  title: (h) => pick(h, /<title>([\s\S]*?)<\/title>/i),
  description: (h) => pick(h, /<meta\s+name="description"\s+content="([^"]*)"/i),
  canonical: (h) => pick(h, /<link\s+rel="canonical"\s+href="([^"]*)"/i),
};

const resolveLocal = (ref, fromPage) => {
  const clean = ref.split('#')[0].split('?')[0];
  if (!clean) return true;
  const path = clean.startsWith('/') ? clean : '/' + join(dirname(fromPage), clean);
  if (path === '/') return existsSync(join(dist, 'index.html'));
  const file = join(dist, decodeURI(path));
  return existsSync(file) || existsSync(file + '.html') || existsSync(join(file, 'index.html'));
};

for (const page of pages) {
  console.log(`\n${page}`);
  const file = join(dist, page);
  if (!existsSync(file)) {
    fail('no existe en dist/');
    continue;
  }
  const html = readFileSync(file, 'utf8');
  const old = existsSync(join(legacy, page)) ? readFileSync(join(legacy, page), 'utf8') : null;

  for (const key of ['title', 'description', 'canonical']) {
    const now = meta[key](html);
    if (!now) {
      fail(`falta ${key}`);
      continue;
    }
    if (old) {
      const before = meta[key](old);
      if (before === now) pass(`${key} idéntico al original`);
      else fail(`${key} distinto al original:\n      antes: ${before}\n      ahora: ${now}`);
    }
  }

  const h1 = (html.match(/<h1[\s>]/gi) || []).length;
  h1 === 1 ? pass('un único <h1>') : fail(`${h1} elementos <h1>`);

  for (const prop of ['og:title', 'og:description', 'og:image', 'og:url']) {
    if (!new RegExp(`property="${prop}"`).test(html)) fail(`falta ${prop}`);
  }
  if (!/name="twitter:card"/.test(html)) fail('falta twitter:card');

  const ogUrl = pick(html, /property="og:url"\s+content="([^"]*)"/);
  if (ogUrl && !ogUrl.startsWith(SITE)) fail(`og:url apunta a otro dominio: ${ogUrl}`);
  const ogImg = pick(html, /property="og:image"\s+content="([^"]*)"/);
  if (ogImg && !resolveLocal(ogImg.replace(SITE, ''), page)) fail(`og:image no existe: ${ogImg}`);

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch {
      fail('JSON-LD inválido');
    }
  }

  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const noAlt = imgs.filter((t) => !/\balt(=|[\s>])/.test(t));
  noAlt.length ? fail(`${noAlt.length} <img> sin alt`) : pass(`${imgs.length} imágenes con alt`);

  const refs = [
    ...[...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/\bsrcset="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(/\s+/)[0])),
    ...[...html.matchAll(/data-large="([^"]+)"/g)].map((m) => m[1]),
  ];
  const broken = [...new Set(refs)].filter(
    (r) => !/^(https?:|mailto:|tel:|#|data:)/.test(r) && !resolveLocal(r, page),
  );
  broken.length ? broken.forEach((r) => fail(`recurso/enlace roto: ${r}`)) : pass('enlaces internos y recursos OK');

  const deadAnchors = [...html.matchAll(/href="#"/g)].length;
  if (deadAnchors) warn(`${deadAnchors} enlaces href="#"`);

  for (const m of html.matchAll(/href="#([^"]+)"/g)) {
    if (!new RegExp(`id="${m[1]}"`).test(html)) fail(`ancla sin destino: #${m[1]}`);
  }
}

console.log('\nsitemap.xml');
const sm = join(dist, 'sitemap.xml');
if (!existsSync(sm)) fail('no existe');
else {
  const xml = readFileSync(sm, 'utf8');
  if (!xml.startsWith('<?xml') || !/<urlset[\s\S]*<\/urlset>\s*$/.test(xml)) fail('XML mal formado');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const loc of locs) {
    const path = loc.replace(SITE, '');
    if (!resolveLocal(path, 'index.html')) fail(`URL del sitemap no existe: ${loc}`);
    const f = path.endsWith('/') ? 'index.html' : path.replace(/^\//, '').replace(/\.(png|webp|jpg|avif)$/, '');
    if (f.endsWith('.html') && /noindex/.test(readFileSync(join(dist, f), 'utf8'))) fail(`URL noindex en el sitemap: ${loc}`);
  }
  pass(`${locs.length} URLs válidas`);
}

console.log('\nrobots.txt');
const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
/Sitemap:\s*https:\/\/distrito-44\.com\/sitemap\.xml/.test(robots) ? pass('declara el sitemap') : fail('no declara el sitemap');
existsSync(join(dist, 'CNAME')) ? pass('CNAME presente') : fail('falta CNAME');
existsSync(join(dist, '404.html')) ? pass('404.html presente') : fail('falta 404.html');
existsSync(join(dist, 'googleacec88370f3d9fc6.html')) ? pass('verificación de Search Console presente') : fail('falta verificación de Search Console');

console.log(`\n${failures ? '✗' : '✓'} ${failures} errores, ${warnings} avisos`);
process.exit(failures ? 1 : 0);
