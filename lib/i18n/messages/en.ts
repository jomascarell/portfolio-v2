import type { Messages } from './types'

export const OKISAM = { text: 'Okisam', href: 'https://okisam.com/' }
export const STRAVA = { text: 'Strava', href: 'https://www.strava.com/athletes/125006587' }

export const en: Messages = {
  nav: {
    projects: 'Projects',
    about: 'About',
    home: 'Joan',
    mainLabel: 'Main',
    breadcrumbLabel: 'Breadcrumb',
    fallbackProject: 'Project',
  },
  intro: {
    tagline: 'Translating design into interfaces that hold up.',
    statusCurrent: 'Currently working in solo projects',
    statusPrevious: 'Previously interned ',
  },
  projects: {
    'emotional-ux': { category: 'Testing emotional design', title: 'Emotional UX in e-commerce' },
    'joies-laia': { category: 'A brand and store, built pro bono', title: 'Joies Laia' },
    embassaments: { category: 'Turning drought data into a public dashboard', title: 'Embassaments' },
  },
  about: {
    bio: [
      [["Hi, I'm Joan."], [{ em: 'Designer' }, ', crafting UI for the web.']],
      [["Master's grad, specializing in frontend design, building on a bachelor's in digital design."]],
      [
        [
          'I recently interned at ',
          OKISAM,
          ', a solution-driven design agency, developing my first component-based CSS design system from scratch.',
        ],
      ],
      [['Outside of design, you can find me on ', STRAVA, ', or on the peak of some random mountain.']],
    ],
    contactIntro: 'Feel free to contact me, and send an e-mail to the following address.',
    mailLabel: 'Mail:',
  },
  footer: {
    changelogLabel: 'Changelog',
    credits: 'Built with NextJS, Claude, Figma.',
    languageLabel: 'Language',
  },
  caseEnd: {
    label: 'More projects',
    previous: 'Previous',
    next: 'Next',
    allWork: 'All work',
  },
  placeholder: {
    note: 'This project is currently being built and needs some more time.',
  },
  notFound: {
    lost: 'Are you lost?',
    lostAside: 'Aren’t we all lost a little bit?',
    tiltLabel: 'Tilt the 404',
    home: 'Back to the start',
    projects: 'See all projects',
    metaTitle: 'Page not found — Joan Mascarell',
  },
  common: {
    skipToContent: 'Skip to content',
    newTab: '(opens in a new tab)',
  },
  meta: {
    title: 'Joan Mascarell',
    description:
      'Joan Mascarell — Designer who also builds what he designs. Case studies on design systems, emotional UX in e-commerce, and front-end work.',
    projectsTitle: 'Projects — Joan Mascarell',
    aboutTitle: 'About — Joan Mascarell',
  },
}
