import { OKISAM, STRAVA } from './en'
import type { Messages } from './types'

export const es: Messages = {
  nav: {
    projects: 'Proyectos',
    about: 'Sobre mí',
    home: 'Joan',
    mainLabel: 'Principal',
    breadcrumbLabel: 'Ruta de navegación',
    fallbackProject: 'Proyecto',
  },
  intro: {
    tagline: 'Transformando diseños en interfaces estables',
    statusCurrent: 'En busca de posiciones junior / graduate, Barcelona o remoto',
    statusPrevious: 'Experiencia previa, prácticas en ',
  },
  projects: {
    'emotional-ux': { category: 'Haciendo válido el diseño emocional', title: 'UX emocional en e-commerce' },
    'joies-laia': { category: 'Branding y e-commerce desarrollados pro bono', title: 'Joies Laia' },
    embassaments: {
      category: 'Transformando datos sobre la sequía persistente en un panel de control público',
      title: 'Embassaments',
    },
  },
  about: {
    bio: [
      [['Hola, soy Joan'], [{ em: 'Design Engineer' }, ', interesado en desarrollar interfaces para la web.']],
      [['Máster en desarrollo frontend, con un grado en diseño digital.']],
      [
        [
          'Hace poco estuve de prácticas en ',
          OKISAM,
          ', una agencia de diseño orientada a soluciones digitales, donde desarrollé desde cero mi primer design system CSS basado en componentes.',
        ],
      ],
      [['Más allá del diseño, puedes encontrarme en ', STRAVA, ' o en la cima de alguna montaña perdida.']],
    ],
    contactIntro: 'Sin ataduras, puedes contactarme al siguiente correo electrónico.',
    mailLabel: 'Correo:',
  },
  footer: {
    changelogLabel: 'Changelog',
    credits: 'Desarrollado con NextJS, Claude, Figma.',
    languageLabel: 'Idioma',
    languageNote: 'Los proyectos no están traducidos',
  },
  caseEnd: {
    label: 'Más proyectos',
    previous: 'Anterior',
    next: 'Siguiente',
    allWork: 'Todos los proyectos',
  },
  placeholder: {
    note: 'Este proyecto todavía se está construyendo y necesita algo más de tiempo.',
  },
  notFound: {
    lost: '¿Te has perdido?',
    lostAside: '¿No estamos todos un poco perdidos?',
    tiltLabel: 'Inclina el 404',
    home: 'Vuelve al inicio',
    projects: 'Ver todos los proyectos',
    metaTitle: 'Página no encontrada — Joan Mascarell',
  },
  common: {
    skipToContent: 'Saltar al contenido',
    newTab: '(se abre en una pestaña nueva)',
  },
  meta: {
    title: 'Joan Mascarell — Design Engineer',
    description: 'El portfolio creativo de Joan Mascarell, design engineer que estudia y desarrolla interfaces web.',
    projectsTitle: 'Proyectos — Joan Mascarell',
    aboutTitle: 'Sobre mí — Joan Mascarell',
    projectsDescription:
      'Casos de estudio: evaluación del diseño emocional en e-commerce, un dashboard público de datos de sequía y una marca y tienda pro bono.',
    aboutDescription:
      'Design engineer con máster en desarrollo front-end. Con interés en puestos junior y programas graduate en Barcelona y el resto de Europa.',
  },
}
