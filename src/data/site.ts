/**
 * DISTRITO 44 — Datos centrales del sitio
 * ------------------------------------------------------------------
 * Toda la información de empresa, navegación y contacto vive aquí para
 * que un cambio se haga en un único lugar.
 *
 * IMPORTANTE: los datos se han migrado TAL CUAL estaban en la web
 * original. En ella conviven datos contradictorios (direcciones,
 * teléfonos, emails y datos registrales de ejemplo). No se han
 * corregido para no inventar información: están señalados con
 * "REVISAR" y documentados en docs/AUDITORIA.md.
 */

export const site = {
  name: 'Distrito 44',
  alternateName: 'Distrito44',
  url: 'https://distrito-44.com',
  locale: 'es_ES',
  tagline: 'Hacemos Sueños Realidad',
  footerClaim: 'Tu inmobiliaria de confianza en Madrid.',
  footerClaimLegal: 'Tu inmobiliaria y asesoría legal de confianza.',
  defaultOgImage: '/img/ft1.webp',
  logo: '/img/logo2.webp',
  credit: { label: 'NESTEK.es', url: 'https://nestek.es' },
} as const;

/** Enlace externo al catálogo de inmuebles (Idealista), usado en la portada. */
export const propertiesUrl = 'https://www.idealista.com/pro/distrito-44/venta-viviendas';

/** Endpoint real de Formspree que ya usaba el formulario de contacto. */
export const formEndpoint = 'https://formspree.io/f/xqebkblj';

/**
 * Datos de contacto "oficiales" usados en cabecera, pie y datos estructurados.
 * Se toman de la portada original (dirección y email del pie + JSON-LD)
 * y del teléfono que aparece en la mayoría de páginas.
 */
export const contact = {
  phone: '+34 646 055 532',
  phoneHref: 'tel:+34646055532',
  /** Teléfono que figuraba en el pie del Departamento Jurídico. REVISAR. */
  legalPhone: '+34 696 569 931',
  legalPhoneHref: 'tel:+34696569931',
  email: 'dadiga4444@gmail.com',
  address: {
    street: 'Avda. del Cantábrico, 131',
    postalCode: '28939',
    locality: 'Arroyomolinos',
    region: 'Madrid',
    country: 'ES',
  },
  geo: { lat: 40.2833, lng: -3.9167 },
} as const;

/**
 * Datos del cuerpo de la página de contacto (confirmados por el cliente).
 * El horario coincide con el de los datos estructurados (schema.ts).
 */
export const contactPageData = {
  addressLines: ['Avda. del Cantábrico, 131', '28939 Arroyomolinos, Madrid'],
  phone: '+34 646 055 532',
  phoneHref: 'tel:+34646055532',
  email: 'dadiga4444@gmail.com',
  schedule: [
    { day: 'Lunes - Viernes', time: '9:00 - 19:00' },
    { day: 'Sábado', time: 'Cerrado' },
    { day: 'Domingo', time: 'Cerrado' },
  ],
} as const;

export interface NavItem {
  label: string;
  href: string;
  legal?: boolean;
}

/** Navegación principal: mismas páginas y textos que la web original. */
export const mainNav: NavItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Quiénes Somos', href: '/quienes-somos.html' },
  { label: 'Nuestros Servicios', href: '/nuestros-servicios.html' },
  { label: 'Nuestro Método', href: '/nuestro-metodo.html' },
  { label: 'Galería', href: '/galeria.html' },
  { label: 'Contacto', href: '/contacto.html' },
  { label: 'Dpto. Jurídico', href: '/departamento-juridico.html', legal: true },
  { label: 'Aviso Legal', href: '/aviso-legal.html', legal: true },
];

export const footerLinks: NavItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Quiénes Somos', href: '/quienes-somos.html' },
  { label: 'Servicios', href: '/nuestros-servicios.html' },
  { label: 'Nuestro Método', href: '/nuestro-metodo.html' },
  { label: 'Galería', href: '/galeria.html' },
  { label: 'Contacto', href: '/contacto.html' },
];

export const legalLinks: NavItem[] = [
  { label: 'Aviso Legal', href: '/aviso-legal.html' },
  { label: 'Dpto. Jurídico', href: '/departamento-juridico.html' },
];

/** URLs del sitio (idénticas a las originales) para sitemap y validación. */
export const pages = [
  { path: '/', changefreq: 'weekly', priority: '1.0', image: '/img/ft1.webp', imageTitle: 'Distrito 44 Inmobiliaria Madrid' },
  { path: '/quienes-somos.html', changefreq: 'monthly', priority: '0.8' },
  { path: '/nuestros-servicios.html', changefreq: 'monthly', priority: '0.9' },
  { path: '/nuestro-metodo.html', changefreq: 'monthly', priority: '0.7' },
  { path: '/galeria.html', changefreq: 'weekly', priority: '0.8' },
  { path: '/contacto.html', changefreq: 'monthly', priority: '0.9' },
  { path: '/departamento-juridico.html', changefreq: 'yearly', priority: '0.3' },
  // Aviso Legal lleva noindex (igual que en el original): no se incluye en el
  // sitemap para no enviar a Google señales contradictorias.
  { path: '/aviso-legal.html', changefreq: 'yearly', priority: '0.3', noindex: true },
] as const;
