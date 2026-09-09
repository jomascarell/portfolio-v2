/* Copy and links that appear in more than one place, written once.
 *
 * The rule this file exists to enforce: the tagline and the two status lines
 * are byte-identical everywhere they appear in Figma — landing, landing-footer,
 * projects, about. What varies between those screens is composition, never
 * wording. So the words live here and the screens differ by which components
 * they assemble, not by retyping.
 *
 * Each social entry is an object rather than a bare URL on purpose, carried
 * over from the retired build along with the reason: `handle` is what a label
 * shows, and it has to travel attached to the URL it describes. Two parallel
 * maps — one of links, one of names — can drift, and then the label announces
 * one account while the link opens another. */

export const siteConfig = {
  contactEmail: 'jmjvilallonga@gmail.com',

  /* Shown in the footer's meta row. Deliberately a hand-edited constant and
     not `new Date()`: a build-time date changes on every deploy, which would
     make the footer differ between two builds of identical source and turn
     every rebuild into a diff. Bump it when something ships. */
  changelog: '2026-09-08',

  /* The language control is a switcher (EN / CAT / CAST) in the design and has
     no states defined yet, so it renders as a static label for now. */
  language: 'EN',

  credits: 'Built with NextJS, Claude, Figma.',

  footerIntro:
    'Feel free to contact me, and send an e-mail to the following address.',

  social: {
    github: {
      href: 'https://github.com/jomascarell',
      handle: '@jomascarell',
    },
    linkedin: {
      href: 'https://www.linkedin.com/in/joanmascarelljuan/',
      handle: '@joanmascarelljuan',
    },
    instagram: {
      href: 'https://www.instagram.com/joanmascarelll/',
      handle: '@joanmascarelll',
    },
    /* No @ — this is a document, not an account, which is also why the handle
       is written by hand instead of being derived from the URL.
       TODO: the href is still the placeholder inherited from the retired
       build. It must be a real URL before launch. */
    cv: {
      href: 'https://read.cv/TODO',
      handle: 'CV',
    },
  },
} as const
