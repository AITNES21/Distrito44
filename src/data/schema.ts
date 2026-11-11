/**
 * Datos estructurados Schema.org.
 * Basados en los JSON-LD originales de la portada, con dos correcciones:
 *  - "telephone": el original era "+34-916-471-XXX" (inválido) → se usa el
 *    teléfono visible en la web.
 *  - Se elimina "aggregateRating" (4.9 / 1632 reseñas): no hay reseñas
 *    verificables publicadas y Google no admite valoraciones autoatribuidas
 *    en negocios locales (riesgo de acción manual).
 * Ver docs/AUDITORIA.md.
 */
import { site, contact } from './site';

const address = {
  '@type': 'PostalAddress',
  streetAddress: contact.address.street,
  addressLocality: contact.address.locality,
  addressRegion: contact.address.region,
  postalCode: contact.address.postalCode,
  addressCountry: contact.address.country,
};

const telephone = contact.phone.replace(/\s+/g, '-').replace(/^\+34-/, '+34-');

export const realEstateAgent = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  '@id': `${site.url}/#organization`,
  name: site.name,
  image: `${site.url}/img/logo2.webp`,
  logo: `${site.url}/img/logo2.webp`,
  url: site.url,
  telephone,
  email: contact.email,
  priceRange: '€€',
  address,
  geo: { '@type': 'GeoCoordinates', latitude: contact.geo.lat, longitude: contact.geo.lng },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '19:00',
    },
  ],
  sameAs: ['https://www.idealista.com/pro/distrito-44'],
  areaServed: { '@type': 'City', name: 'Madrid' },
  slogan: site.tagline,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicios Inmobiliarios',
    itemListElement: [
      ['Venta de Viviendas', 'Asesoría profesional en venta de pisos y casas en Madrid'],
      ['Alquiler de Inmuebles', 'Gestión de alquileres de propiedades en Madrid'],
      ['Tasación de Viviendas', 'Valoración profesional gratuita de inmuebles'],
      ['Home Staging', 'Preparación de viviendas para venta'],
    ].map(([name, description]) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name, description },
    })),
  },
};

export const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  alternateName: site.alternateName,
  url: site.url,
  logo: `${site.url}/img/logo2.webp`,
  foundingDate: '2013',
  slogan: site.tagline,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone,
    contactType: 'customer service',
    areaServed: 'ES',
    availableLanguage: ['Spanish'],
  },
  address,
};

export const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: site.name,
  url: `${site.url}/`,
  inLanguage: 'es-ES',
};

export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: new URL(item.path, site.url).href,
    })),
  };
}
