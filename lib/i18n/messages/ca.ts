import { OKISAM, STRAVA } from './en'
import type { Messages } from './types'

export const ca: Messages = {
  nav: {
    projects: 'Projectes',
    about: 'Sobre mi',
    home: 'Joan',
    mainLabel: 'Principal',
    breadcrumbLabel: 'Ruta de navegació',
    fallbackProject: 'Projecte',
  },
  intro: {
    tagline: 'Convertint dissenys en interfícies que resisteixen el pas del temps',
    statusCurrent: 'Actualment treballe en projectes en solitari',
    statusPrevious: 'Experiència prèvia, pràctiques a ',
  },
  projects: {
    'emotional-ux': { category: 'Provant disseny emocional', title: "UX Emocional a l'e-commerce" },
    'joies-laia': { category: 'Brànding i comerç electrònic desenvolupats pro bono.', title: 'Joies Laia' },
    embassaments: {
      category: 'Convertint dades sobre la sequera persistent en un panell de control públic.',
      title: 'Embassaments',
    },
  },
  about: {
    bio: [
      [['Molt de gust, soc Joan'], [{ em: 'Dissenyador' }, ', que es dedica a crear interfícies per a la web.']],
      [['Graduat de màster, especialitzat en disseny frontend, amb una formació de grau en disseny digital.']],
      [
        [
          'Fa poc vaig realitzar les pràctiques del màster a ',
          OKISAM,
          ', una agència de disseny orientada a solucions digitals, on vaig desenvolupar des de zero el meu primer design system CSS basat en components.',
        ],
      ],
      [['Fora del disseny, pots trobar-me a ', STRAVA, " o al cim d'alguna muntanya perduda."]],
    ],
    contactIntro: "Si vols posar-te en contacte amb mi, pots escriure'm a la següent adreça electrònica.",
    mailLabel: 'Correu:',
  },
  footer: {
    changelogLabel: 'Registre de canvis',
    credits: 'Desenvolupat amb NextJS, Claude, Figma.',
    languageLabel: 'Idioma',
  },
  caseEnd: {
    label: 'Més projectes',
    previous: 'Anterior',
    next: 'Següent',
    allWork: 'Tots els projectes',
  },
  placeholder: {
    note: 'Aquest projecte encara s’està construint i necessita una mica més de temps.',
  },
  notFound: {
    eyebrow: 'Error 404',
    title: 'Pàgina no trobada',
    body: 'Aquesta pàgina no existeix, o s’ha mogut.',
    home: 'Torna a l’inici',
    projects: 'Mira tots els projectes',
    metaTitle: 'Pàgina no trobada — Joan Mascarell',
  },
  common: {
    skipToContent: 'Salta al contingut',
    newTab: "(s'obre en una pestanya nova)",
  },
  meta: {
    title: 'Joan Mascarell',
    description:
      "Joan Mascarell — Dissenyador que també construeix el que dissenya. Casos d'estudi sobre sistemes de disseny, UX emocional en e-commerce i front-end.",
    projectsTitle: 'Projectes — Joan Mascarell',
    aboutTitle: 'Sobre mi — Joan Mascarell',
  },
}
