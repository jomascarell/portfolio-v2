import type { BioParagraph } from '@/lib/about'

/* Every translatable string on the site, in one shape. English is the source;
 * Catalan and Spanish come from the user's translation file
 * (portfolio-translations.md, 2026-10-02). Case studies and photos are not
 * here: they stay in English by decision. */
export type Messages = {
  nav: {
    projects: string
    about: string
    photos: string
    /* The breadcrumb's home link. A name, the same in every language. */
    home: string
    /* Accessible names of the two nav states. */
    mainLabel: string
    breadcrumbLabel: string
    /* Shown if a project page has no short name. */
    fallbackProject: string
  }
  intro: {
    tagline: string
    statusCurrent: string
    /* Followed by the @Okisam link, so it ends with its own space. */
    statusPrevious: string
  }
  /* Per project slug. Titles that are names (Joies Laia, Embassaments) stay. */
  projects: Record<string, { category: string; title: string }>
  about: {
    bio: BioParagraph[]
    contactIntro: string
    mailLabel: string
  }
  footer: {
    /* The code adds ": " and the date. */
    changelogLabel: string
    credits: string
    languageLabel: string
  }
  common: {
    skipToContent: string
    /* Read after every link that opens a new tab. */
    newTab: string
  }
  meta: {
    title: string
    description: string
    projectsTitle: string
    aboutTitle: string
  }
}
