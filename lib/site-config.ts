/* Copy and links that appear in more than one place, written once.
 *
 * The visible WORDS moved to the dictionaries on 2026-10-02 (lib/i18n/messages,
 * one per language): the tagline, the status lines, the credits and the contact
 * line. They are still written once, now once per language. What stays here is
 * what does not translate: addresses, handles and the language list.
 *
 * Each social entry is an object rather than a bare URL on purpose, carried
 * over from the retired build along with the reason: `handle` is what a label
 * shows, and it has to travel attached to the URL it describes. Two parallel
 * maps — one of links, one of names — can drift, and then the label announces
 * one account while the link opens another. */

/* The absolute origin for metadata URLs (og:image, og:url), read by the root
   layout's metadataBase. The custom domain since 2026-10-02 (bought on
   Vercel; www redirects to it); before that, portfolio-v2-drab-gamma.vercel.app.
   NEXT_PUBLIC_SITE_URL overrides it, for a preview that should point at
   itself. Not VERCEL_URL: that is each deployment's own hash URL, and a
   shared link should always resolve to production. */
export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://joanmascarell.dev')

export const siteConfig = {
  contactEmail: 'hello@joanmascarell.dev',

  /* The footer's language control. It had no states in the design and shipped
     as the static string 'EN'; Figma gained a three-variant `language` set
     (786:409) on the phase 7 page, so it is a real control now.

     Labels are the drawing's — EN / CAT / ES. The Footer's own description in
     Figma still says CAST for the third one; the drawing wins because it is
     what a visitor reads, and the disagreement is on the list to settle there.

     Codes are BCP 47 so that the eventual `lang` attribute is valid without a
     second mapping table. Nothing reads them yet: the switcher selects and
     paints, and translation waits for translated copy. */
  languages: [
    { code: 'en', label: 'EN' },
    { code: 'ca', label: 'CAT' },
    { code: 'es', label: 'ES' },
  ],
  defaultLanguage: 'en',

  /* The second status line is one sentence with two colours: the handle takes
     color/text/accent and the rest is secondary. The words before it are in the
     dictionaries (intro.statusPrevious); the handle is a name and stays here.

     The handle carries its href for the same reason the social entries do: the
     label and the URL it describes have to travel together. The design draws it
     accent-coloured with no underline and says nothing about a destination —
     this one comes from the retired build, and it is the URL AboutBio links the
     same word to, so the two screens agree rather than one of them being inert.
     IntroCard renders it looking exactly as drawn. */
  status: {
    previousHandle: {
      href: 'https://okisam.com/',
      handle: '@Okisam',
    },
  },

  /* The three top-level destinations, in the drawn order. They render as
     NavLinks on the landing and its footer state and NOWHERE else: every
     interior screen carries the Breadcrumb instead. That is the nav model,
     not an omission — see components/NavLinks. */
  nav: [
    /* Labels come from the dictionaries (lib/i18n/messages, `nav`). */
    { href: '/projects', key: 'projects' },
    { href: '/about', key: 'about' },
    /* Photos was the third, removed for now by the user (2026-10-03). The
       page, lib/photos.ts, PhotoStream and the images are in git history
       before that date. */
  ],

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
       One PDF per language in /public/cv, added 2026-10-02 (they replace the
       read.cv placeholder from the retired build). SocialIcons picks the one
       for the page's language. The files keep the user's own names so a
       download saves under them; Catalan is _CAT, as the user names it. */
    cv: {
      href: {
        en: '/cv/CV_JoanMascarell_EN.pdf',
        ca: '/cv/CV_JoanMascarell_CAT.pdf',
        es: '/cv/CV_JoanMascarell_ES.pdf',
      },
      handle: 'CV',
    },
  },
} as const
