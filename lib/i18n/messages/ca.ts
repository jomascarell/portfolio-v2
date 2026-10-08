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
    tagline: 'Transformant dissenys en interfícies mantenibles',
    statusCurrent: 'Cercant rols junior / graduate, Barcelona o en remot',
    statusPrevious: 'Experiència prèvia, pràctiques a ',
  },
  projects: {
    'emotional-ux': { category: 'Posant a prova el disseny emocional', title: "UX emocional a l'e-commerce" },
    'joies-laia': { category: 'Brànding i e-commerce desenvolupats pro bono', title: 'Joies Laia' },
    embassaments: {
      category: 'Convertint dades sobre la sequera persistent en un panell de control públic.',
      title: 'Embassaments',
    },
  },
  about: {
    bio: [
      [['Molt de gust, soc Joan'], [{ em: 'Design Engineer' }, ', interessat en construir interfícies per a la web.']],
      [['Màster en desenvolupament frontend, amb un grau en disseny digital.']],
      [
        [
          'Fa poc vaig estar fent pràctiques a ',
          OKISAM,
          ', una agència de disseny orientada a solucions digitals, on vaig desenvolupar des de zero el meu primer design system CSS basat en components.',
        ],
      ],
      [['Més enllà del disseny, pots trobar-me a ', STRAVA, " o al cim d'alguna muntanya perduda."]],
    ],
    contactIntro: 'Em vols contactar? Escriu-me a la següent adreça electrònica.',
    mailLabel: 'Correu:',
  },
  footer: {
    changelogLabel: 'Changelog',
    credits: 'Desenvolupat amb NextJS, Claude, Figma.',
    languageLabel: 'Idioma',
    languageNote: 'Els projectes no estan traduïts',
  },
  caseEnd: {
    label: 'Més projectes',
    previous: 'Anterior',
    next: 'Següent',
    allWork: 'Tots els projectes',
  },
  placeholder: {
    note: 'Aquest projecte necessita un poc més de temps.',
  },
  notFound: {
    lost: 'T’has perdut?',
    lostAside: 'No estem tots una mica perduts?',
    tiltLabel: 'Inclina el 404',
    home: 'Torna a l’inici',
    projects: 'Ves-hi als projectes',
    metaTitle: 'Pàgina no trobada — Joan Mascarell',
  },
  common: {
    skipToContent: 'Salta al contingut',
    newTab: "(s'obre en una pestanya nova)",
  },
  meta: {
    title: 'Joan Mascarell — Design Engineer',
    description: 'El portfoli creatiu de Joan Mascarell, design engineer que estudia i construeix interfícies web.',
    projectsTitle: 'Projectes — Joan Mascarell',
    aboutTitle: 'Sobre mi — Joan Mascarell',
    projectsDescription:
      'Casos d’estudi: avaluació del disseny emocional en l’e-commerce, un dashboard públic de dades de sequera i una marca i botiga pro bono.',
    aboutDescription:
      'Design engineer amb màster en desenvolupament frontend. Obert a rols junior i programes graduate a Barcelona i arreu d’Europa.',
  },
}
