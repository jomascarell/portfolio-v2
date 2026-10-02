import { OKISAM, STRAVA } from './en'
import type { Messages } from './types'

export const es: Messages = {
  nav: {
    projects: 'Proyectos',
    about: 'Sobre mí',
    photos: 'Fotos',
    home: 'Joan',
    mainLabel: 'Principal',
    breadcrumbLabel: 'Ruta de navegación',
    fallbackProject: 'Proyecto',
  },
  intro: {
    tagline: 'Convirtiendo diseños en interfaces que resisten el paso del tiempo',
    statusCurrent: 'Actualmente trabajo en proyectos en solitario',
    statusPrevious: 'Experiencia previa, prácticas en ',
  },
  projects: {
    'emotional-ux': { category: 'Probando diseño emocional', title: 'UX Emocional en e-commerce' },
    'joies-laia': { category: 'Branding y e-commerce desarrollados pro bono.', title: 'Joies Laia' },
    embassaments: {
      category: 'Convirtiendo datos sobre la sequía persistente en un panel de control público',
      title: 'Embassaments',
    },
  },
  about: {
    bio: [
      [['Hola, soy Joan'], [{ em: 'Diseñador' }, ', que se dedica a crear interfaces para la web.']],
      [['Graduado de máster, especializado en diseño frontend, con una formación de grado en diseño digital.']],
      [
        [
          'Hace poco realicé las prácticas del máster en ',
          OKISAM,
          ', una agencia de diseño orientada a soluciones digitales, donde desarrollé desde cero mi primer design system CSS basado en componentes.',
        ],
      ],
      [['Fuera del diseño, puedes encontrarme en ', STRAVA, ' o en la cima de alguna montaña perdida.']],
    ],
    contactIntro: 'Si quieres ponerte en contacto conmigo, puedes escribirme al siguiente correo electrónico.',
    mailLabel: 'Correo:',
  },
  footer: {
    changelogLabel: 'Registro de cambios',
    credits: 'Creado con NextJS, Claude, Figma.',
    languageLabel: 'Idioma',
  },
  common: {
    skipToContent: 'Saltar al contenido',
    newTab: '(se abre en una pestaña nueva)',
  },
  meta: {
    title: 'Joan Mascarell',
    description:
      'Joan Mascarell — Diseñador que también construye lo que diseña. Casos de estudio sobre sistemas de diseño, UX emocional en e-commerce y front-end.',
    projectsTitle: 'Proyectos — Joan Mascarell',
    aboutTitle: 'Sobre mí — Joan Mascarell',
  },
}
