# Distrito 44 — Auditoría y migración a Astro

> Rama de trabajo: `claude/festive-bohr-satcvi`. **Nada se ha publicado en producción.**
> La web original se conserva íntegra en [`legacy/`](../legacy) como referencia.

## 0. Alcance y método

- La web en vivo (`distrito-44.com`) **no era accesible desde el entorno de desarrollo** (el dominio no resolvía).
  La auditoría se ha hecho sobre el **código fuente del repositorio**, que es exactamente lo que publica
  GitHub Pages (fichero `CNAME` → `distrito-44.com`).
- Por indicación expresa del cliente, **los textos y la información se han mantenido tal cual**. Las incoherencias
  detectadas no se han corregido: se documentan en la sección 6 para que se decidan.
- Única excepción pedida por el cliente: se elimina la sección **«Nuestro Equipo»** de Quiénes Somos
  (tres perfiles sin foto); la única persona que aparece es el propietario, con su fotografía original.

---

## 1. Auditoría de la web original

### 1.1 Tecnología

| Elemento | Estado original |
|---|---|
| Stack | HTML estático + `comun.css` + `comun.js`, servido por GitHub Pages desde la raíz de `main` |
| CSS | `comun.css` compartido + un bloque `<style>` grande en cada página (≈ 40–60 % del HTML) |
| JS | `comun.js` (menú, scroll, animaciones, validación) + scripts inline por página |
| Tipografías | Google Fonts: Poppins (300–700), Inter (300–600), Montserrat (500–700) → 3 familias externas |
| Iconos | Font Awesome 6.4 completo desde cdnjs (~100 KB CSS + fuentes) para ~40 iconos |
| Imágenes | WebP/AVIF ya comprimidos, pero sin `srcset`; la portada usaba la foto como `background-image` CSS (no priorizable) |
| Formulario | Formspree (`https://formspree.io/f/xqebkblj`) vía `fetch` |
| Datos estructurados | `RealEstateAgent` + `Organization` (JSON-LD) solo en portada |

### 1.2 Páginas y URLs (inventario SEO)

| URL | Title | H1 | Indexable |
|---|---|---|---|
| `/` (`/index.html`) | Distrito 44 \| Inmobiliaria en Madrid - Venta y Alquiler de Pisos | DISTRITO 44 (+ « - Inmobiliaria en Madrid» oculto) | Sí |
| `/quienes-somos.html` | Quiénes Somos \| Distrito 44 - Inmobiliaria con 12 Años de Experiencia en Madrid | Conoce a Distrito 44 | Sí |
| `/nuestros-servicios.html` | Servicios Inmobiliarios Madrid \| Asesoría, Tasación y Venta - Distrito 44 | Nuestros Servicios | Sí |
| `/nuestro-metodo.html` | Nuestro Método de Venta \| Proceso Profesional Inmobiliario - Distrito 44 | Nuestros Servicios ⚠️ | Sí |
| `/galeria.html` | Galería de Propiedades \| Pisos en Venta y Alquiler Madrid - Distrito 44 | Galería de Propiedades | Sí |
| `/contacto.html` | Contacto \| Valoración Gratuita de Vivienda en Madrid - Distrito 44 | Contacta con Nosotros | Sí |
| `/departamento-juridico.html` | Departamento Jurídico \| Asesoría Legal Inmobiliaria - Distrito 44 | Departamento Jurídico | Sí |
| `/aviso-legal.html` | Aviso Legal \| Política de Privacidad - Distrito 44 | Aviso Legal y Políticas | `noindex, follow` |

Otros recursos indexables o verificables: `/robots.txt`, `/sitemap.xml`, `/googleacec88370f3d9fc6.html`
(verificación de Search Console), `/favicon.ico`, `/img/*` (imágenes, también usadas como `og:image`).

Enlace externo principal: **Idealista** (`https://www.idealista.com/pro/distrito-44/venta-viviendas`, botón «Nuestras propiedades»).

### 1.3 Identidad visual

| Rasgo | Detalle extraído |
|---|---|
| Paleta | Azul `#4A90E2`, azul oscuro `#2E5C8A`, melocotón `#FFB88C`, melocotón suave `#FFD4B3`, verdes `#7FB685` `#A8D5BA` `#5A8C61` `#E8F5E9` (legal), grises `#F5F7FA` `#E8ECEF`, texto `#4A5568`, títulos `#2D3748`. Trazo del logotipo: `#517DA3` (muestreado de `logo2.webp`). |
| Tipografía | Poppins (títulos), Inter (texto), Montserrat (menú en mayúsculas) |
| Logotipo | Casa de trazo fino dentro de un círculo, azul acero; wordmark «Distrito» azul + «44» melocotón |
| Líneas y fondos | Patrones de **líneas diagonales tipo origami** (decenas de `linear-gradient` superpuestos), puntos y hexágonos sutiles; en el Dpto. Jurídico, **tallos de bambú** de trazo fino y hexágonos verdes |
| Fotografía | Paisajes naturales (Santorini, bosque de bambú, terrazas de cultivo), retrato del propietario y 19 fotos de tipologías de vivienda |
| Tema por sección | Azul/melocotón para la parte inmobiliaria; **verde** para Dpto. Jurídico y Aviso Legal |

### 1.4 Problemas técnicos detectados

| # | Problema | Impacto |
|---|---|---|
| T1 | `comun.js` enlazaba un **segundo manejador** al formulario: mostraba «¡Mensaje enviado!» y vaciaba el formulario **al instante, sin esperar la respuesta de Formspree** (éxito aparente aunque el envío fallara), y con datos inválidos lanzaba un error JS (buscaba `#nombre-error`, que no existía) | Funcional / confianza |
| T2 | La parte final de `comun.css` está en **UTF-16** (mezcla de codificaciones): esos estilos eran ilegibles para el navegador | Estilos rotos |
| T3 | **Pantalla de carga** en portada que tapaba el contenido hasta 0,5 s *después* del evento `load` | LCP muy alto |
| T4 | Imagen principal como `background-image` CSS, sin `srcset` ni prioridad | LCP |
| T5 | Font Awesome completo + 3 familias de Google Fonts (bloqueantes) | Peso, peticiones externas |
| T6 | Animaciones CSS infinitas de fondos (`background-position` cada 20–40 s) en varias secciones | CPU/batería, INP |
| T7 | `og:url` y `og:image` de la portada apuntaban a `distrito44.com` (**sin guion**, otro dominio) | Compartición social |
| T8 | `sitemap.xml` declaraba la imagen `img/ft1.png`, que **no existe** (es `.webp`) | Sitemap con errores |
| T9 | `sitemap.xml` incluía `/aviso-legal.html`, que tiene `noindex` | Señales contradictorias |
| T10 | JSON-LD con teléfono `+34-916-471-XXX` (inválido) y `aggregateRating` 4.9 / **1632 reseñas** no publicadas (las 1632 son «clientes satisfechos») | Datos estructurados no válidos / riesgo de acción manual |
| T11 | Imágenes del equipo apuntaban a `images/team/member*.jpg` (**no existen**) | Imágenes rotas |
| T12 | Iconos de redes sociales con `href="#"` | Enlaces muertos |
| T13 | Pie de página distinto en cada página (datos de contacto diferentes) | Coherencia |
| T14 | Contraste insuficiente: texto blanco sobre melocotón (1,7:1), sobre verde `#7FB685` (2,3:1); azul `#4A90E2` como texto (3,3:1) | Accesibilidad (WCAG AA) |
| T15 | Menú móvil sin `aria-expanded`/`aria-controls`; lightbox sin gestión de foco ni etiquetas en botones | Accesibilidad |
| T16 | Galería: título y descripción solo visibles al pasar el ratón (invisibles en táctil) | UX móvil |

---

## 2. Qué se conserva, qué se mejora y qué se sustituye

| Conservar | Mejorar | Sustituir |
|---|---|---|
| Todas las URLs (`.html`) | Composición: de bloques centrados + tarjetas con sombra a maquetación editorial asimétrica | Pantalla de carga |
| Todos los textos, títulos SEO y metadescripciones | Líneas de fondo: reconstruidas en **SVG** (nítidas, ~1 KB) en lugar de decenas de gradientes | Font Awesome → iconos Lucide incrustados (solo los usados) |
| Paleta original completa (como variables CSS) | Contraste: se añaden tonos derivados **más oscuros de la misma paleta** solo para texto | Google Fonts → mismas fuentes auto-alojadas |
| Poppins + Inter | Imágenes: AVIF + WebP responsive con `srcset`, prioridad en la imagen principal | Montserrat → Poppins (se unifica: 2 familias en vez de 3) |
| Fotografías originales | Formulario: validación accesible, sin éxitos simulados, honeypot anti-spam | Hexágonos y degradados del jurídico → bambú SVG |
| Tema verde jurídico y bambú | Menú, galería y visor accesibles por teclado | `comun.js` / `comun.css` |
| Integración Formspree e Idealista | Datos estructurados válidos + migas de pan | |

---

## 3. Arquitectura

```
src/
  assets/img/          Fotografías originales (Astro las optimiza a AVIF/WebP)
  components/
    Header.astro       Cabecera + menú móvil accesible
    Navigation.astro   Navegación de escritorio (estado activo por URL)
    Footer.astro       Pie unificado (variante azul y variante verde legal)
    OrganicLines.astro Trazos de marca en SVG: terraces · origami · bamboo · orbit
    PageHero.astro     Cabecera editorial de páginas interiores (+ migas de pan)
    SectionHeading.astro, Button.astro, CtaBand.astro, Icon.astro, Seo.astro
  data/
    site.ts            Datos de empresa, navegación, contacto, URLs (fuente única)
    schema.ts          JSON-LD (RealEstateAgent, Organization, WebSite, BreadcrumbList)
    gallery.ts         Tipologías de la galería
  layouts/MainLayout.astro
  pages/               Una página por URL original + 404 + sitemap.xml
  styles/              variables.css · global.css · animations.css
public/                CNAME, robots.txt, favicon, verificación de Google, /img original
scripts/validate.mjs   Validación SEO/enlaces tras el build
legacy/                Web original (referencia, no se publica)
```

Decisiones:

- **Astro 7, 100 % estático**, sin React ni frameworks de UI: no hay ninguna interacción que los necesite.
  El JS total es mínimo e inline (menú, aparición suave, contador, galería, formulario).
- **Tailwind no se ha usado**: el sistema de diseño es pequeño y muy específico; CSS con variables y estilos
  con ámbito por componente es más legible y no añade dependencia ni paso de build.
- `build.format: 'file'` → Astro genera `quienes-somos.html`, etc. **Las URLs no cambian.**
- Sitemap propio (endpoint `sitemap.xml.ts`) para mantener exactamente la ruta y el formato anteriores.
- Dependencias de producción: `astro`, `@fontsource/poppins`, `@fontsource-variable/inter`. Nada más.

---

## 4. Sistema visual

- **Color**: tokens en `src/styles/variables.css`. Los originales se conservan sin alterar; los derivados
  (`--d44-blue-ink`, `--d44-green-ink`, `--d44-peach-ink`, `--d44-paper`) son mezclas de la propia paleta para
  cumplir AA en texto o dar un fondo de papel cálido.
- **Contraste verificado** (WCAG 2.1): texto 7,2:1 · enlaces 6,6:1 · botón 9,3:1 · verde jurídico 6,3:1 ·
  cifras melocotón sobre azul 5,5:1 · melocotón para texto pequeño 5,3:1.
- **Trazos**: `OrganicLines` genera de forma determinista: *terraces* (curvas paralelas inspiradas en la foto de
  terrazas), *origami* (las diagonales a 30/60/120/150° del patrón original), *bamboo* (los tallos del jurídico)
  y *orbit* (arcos del círculo del logotipo). Se dibujan una sola vez al cargar si el usuario no pide reducir movimiento.
- **Formas**: arcos (del círculo del logo) para enmarcar fotografías; líneas finas de 1 px en lugar de sombras.
- **Ritmo**: cada página alterna fondo papel / blanco / color de marca y combina columnas asimétricas,
  listas numeradas y filetes, evitando la rejilla de tarjetas repetidas.

---

## 5. SEO — estrategia de migración

| Comprobación | Resultado |
|---|---|
| URLs | **Idénticas** (8/8). No se necesitan redirecciones 301. `/index.html` sigue sirviendo la portada (canonical `/`). |
| Title / description / canonical | **Idénticos** al original en las 8 páginas (verificado por `npm run validate`), salvo la meta description de Quiénes Somos, corregida a «desde 2014» con aprobación del cliente. |
| H1 | Uno por página, mismo texto que el original. |
| Open Graph / Twitter | En todas las páginas, con dominio corregido (T7). |
| Imágenes | Las rutas `/img/*.webp` originales siguen existiendo (Google Imágenes, `og:image`); las páginas usan versiones optimizadas. |
| Sitemap | Mismas URLs, `lastmod` automático, imagen corregida (T8), sin páginas `noindex` (T9). |
| robots.txt | Igual que el original. |
| Search Console | Fichero de verificación conservado. |
| Datos estructurados | `RealEstateAgent` + `Organization` + `WebSite` en portada; `BreadcrumbList` en interiores. Corregido teléfono y eliminado `aggregateRating` (T10). |
| Geo-tags | Conservados en portada. |
| 404 | Página 404 propia con enlaces a todas las secciones. |

Tras publicar: enviar de nuevo el sitemap en Search Console y revisar el informe de cobertura a los 7–14 días.

---

## 6. ⚠️ Información incorrecta o contradictoria (requiere decisión)

Se ha mantenido **tal cual**. Todo está centralizado en `src/data/site.ts` (marcado «REVISAR») salvo el
Aviso Legal, que está en `src/pages/aviso-legal.astro`.

| # | Dónde | Problema |
|---|---|---|
| I1 | ~~Contacto (cuerpo)~~ | ✅ **Resuelto**: dirección real Avda. del Cantábrico, 131, 28939 Arroyomolinos (también en el bloque de contacto del Aviso Legal). |
| I2 | Aviso Legal | **Pendiente**: NIF `B-12345678`, domicilio social «Calle Ejemplo 123», Registro Mercantil «Tomo 12345, Folio 678, Hoja M-123456», teléfono `+34 912 345 678` y dominio `www.distrito44.es` parecen datos de **ejemplo**. **La LSSI (art. 10) exige datos reales.** Prioridad alta. |
| I3 | Teléfonos | **Pendiente**: `+34 646 055 532` (general), `+34 696 569 931` (pie del Jurídico), `+34 912 345 678` (Aviso Legal). |
| I4 | ~~Emails~~ | ✅ **Resuelto**: email único `dadiga4444@gmail.com` en toda la web (sustituye a `info@`, `legal@` y `protecciondatos@distrito44.es`). |
| I5 | ~~Fechas~~ | ✅ **Resuelto**: fundación en **2014** (JSON-LD y meta description de Quiénes Somos actualizados; coincide con la línea de tiempo). |
| I6 | ~~Horario~~ | ✅ **Resuelto**: L–V 9:00–19:00, sábado y domingo cerrado, igual en la página de Contacto y en los datos estructurados. |
| I7 | Ubicación | **Pendiente**: Historia/línea de tiempo dicen «oficina en el centro / corazón de Madrid»; la dirección es de Arroyomolinos. |
| I8 | Nuestro Método | Repite el H1 y el subtítulo de Nuestros Servicios («Nuestros Servicios» / «Soluciones integrales…») y el botón «Conoce Nuestro Método» enlaza a la propia página. Recomendado: H1 «Nuestro Método». |
| I9 | Dpto. Jurídico | «Más de 15 años de experiencia» frente a los 12 años de la empresa (puede referirse a los abogados; conviene aclararlo). |
| I10 | ~~Redes sociales~~ | ✅ **Resuelto**: la empresa no tiene redes de momento; se han eliminado los iconos y enlaces (antes apuntaban a `#`). |

### Cambios de texto realizados (mínimos)

- Erratas corregidas en la línea de tiempo: «pasasmos» → «pasamos», «territotio» → «territorio».
- Eliminada la sección «Nuestro Equipo» (por petición del cliente).
- Añadidos imprescindibles por accesibilidad/legalidad: mensajes de error de cada campo del formulario,
  nota de privacidad bajo el formulario con enlace al Aviso Legal, «Saltar al contenido», etiquetas
  accesibles de botones e índice de servicios en Nuestros Servicios (con los mismos títulos).
- Año del copyright dinámico (antes «© 2025» fijo).
- Datos confirmados por el cliente: dirección y email en Contacto, email en Aviso Legal, fundación 2014
  (meta description de Quiénes Somos) y horario L–V 9:00–19:00 en Contacto.
- Pie de página unificado con los datos de la portada (dirección de Arroyomolinos, `+34 646 055 532`,
  `dadiga4444@gmail.com`); en el Dpto. Jurídico se mantiene su teléfono propio.

---

## 7. Validación realizada

| Prueba | Resultado |
|---|---|
| `astro check` (tipos) | 0 errores |
| `astro build` | 9 páginas + sitemap, 0 errores |
| `npm run validate` | 0 errores (URLs, metadatos vs. original, H1, enlaces, imágenes, `alt`, JSON-LD, sitemap) |
| Consola del navegador (9 páginas × escritorio y móvil) | Sin errores |
| Desbordamiento horizontal | Ninguno (1440 px y 390 px) |
| Formulario | Validación, foco al primer error, POST a Formspree con los campos originales, estados de éxito/error de servidor/error de red (respuesta simulada en el test: no se enviaron mensajes reales) y envío sin JavaScript |
| Galería | Apertura, flechas, Escape, retorno de foco, imagen grande |
| Menú móvil | `aria-expanded`, Escape |
| Rendimiento (laboratorio, móvil, CPU ×4) | LCP 0,5–0,7 s · CLS 0 · 87–237 KB por página · sin JS externo |

## 8. Puesta en producción (cuando se apruebe)

1. Revisar la sección 6 y facilitar los datos correctos.
2. GitHub → *Settings → Pages → Source*: **GitHub Actions** (hoy sirve la raíz de `main`; tras fusionar,
   la raíz ya no contiene HTML y la web hay que compilarla).
3. Fusionar la rama en `main`: el workflow `deploy.yml` compila, valida y publica.
4. Search Console: reenviar `sitemap.xml` y supervisar cobertura.
