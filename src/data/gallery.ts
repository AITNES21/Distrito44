import type { ImageMetadata } from 'astro';
import gl1 from '../assets/img/gl1.webp';
import gl2 from '../assets/img/gl2.webp';
import gl3 from '../assets/img/gl3.avif';
import gl4 from '../assets/img/gl4.avif';
import gl5 from '../assets/img/gl5.avif';
import gl6 from '../assets/img/gl6.webp';
import gl7 from '../assets/img/gl7.webp';
import gl8 from '../assets/img/gl8.webp';
import gl9 from '../assets/img/gl9.webp';
import gl10 from '../assets/img/gl10.webp';
import gl11 from '../assets/img/gl11.webp';
import gl12 from '../assets/img/gl12.webp';
import gl13 from '../assets/img/gl13.webp';
import gl14 from '../assets/img/gl14.webp';
import gl15 from '../assets/img/gl15.webp';
import gl16 from '../assets/img/gl16.webp';
import gl17 from '../assets/img/gl17.webp';
import gl18 from '../assets/img/gl18.webp';
import gl19 from '../assets/img/gl19.webp';

export interface GalleryItem {
  src: ImageMetadata;
  title: string;
  info: string;
}

/** Tipos de propiedades que gestionamos — mismos textos y orden que el original. */
export const gallery: GalleryItem[] = [
  { src: gl1, title: 'Bajo', info: 'Planta baja con acceso directo desde la calle' },
  { src: gl2, title: 'Ático', info: 'Última planta con terraza y vistas panorámicas' },
  { src: gl3, title: 'Casa Rural', info: 'Vivienda tradicional en entorno natural' },
  { src: gl4, title: 'Dúplex', info: 'Vivienda en dos plantas conectadas internamente' },
  { src: gl5, title: 'Chalet con Piscina', info: 'Vivienda unifamiliar con jardín y piscina privada' },
  { src: gl6, title: 'Estudio', info: 'Espacio compacto y funcional ideal para una persona' },
  { src: gl7, title: 'Loft', info: 'Espacio diáfano con techos altos y estilo moderno' },
  { src: gl8, title: 'Piso', info: 'Vivienda en edificio de varias plantas' },
  { src: gl9, title: 'Apartamento', info: 'Vivienda de tamaño medio con distribución eficiente' },
  { src: gl10, title: 'Chalet Adosado', info: 'Vivienda unifamiliar compartiendo paredes laterales' },
  { src: gl11, title: 'Chalet Pareado', info: 'Vivienda unifamiliar compartiendo una pared medianera' },
  { src: gl12, title: 'Chalet Independiente', info: 'Vivienda unifamiliar exenta rodeada de jardín' },
  { src: gl13, title: 'Villa', info: 'Residencia de lujo con amplios espacios y jardines' },
  { src: gl14, title: 'Finca', info: 'Propiedad rústica con terreno extenso' },
  { src: gl15, title: 'Masía', info: 'Construcción rural tradicional catalana' },
  { src: gl16, title: 'Bungalow', info: 'Vivienda de una planta con terraza o jardín' },
  { src: gl17, title: 'Local Comercial', info: 'Espacio para actividades comerciales a pie de calle' },
  { src: gl18, title: 'Nave Industrial', info: 'Espacio amplio para actividades industriales y logísticas' },
  { src: gl19, title: 'Plaza de Garaje', info: 'Espacio de aparcamiento cubierto y seguro' },
];
