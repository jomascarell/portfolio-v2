/* The projects, three since 2026-10-01: Okisam was taken off the list
 * before the first merge to main (confidential client work, no case study to
 * show). The internship itself still appears on /about and in the intro.
 *
 * Content given directly on 2026-09-11, and it settles what Figma could not:
 * the file's ProjectList draws a fourth row called "Personal Library" that
 * was invented copy to fill the drawing, and there is no project behind it.
 * So the list holds only real projects, and `biblioteca` is gone.
 *
 * A row is `category | name | year`, in that order down the row, and the
 * category is the descriptive line rather than a discipline tag — "Testing
 * emotional design" above "Emotional UX in e-commerce". Figma's drawn
 * placeholders used short tags ("API project", "Three.js") and these do the
 * job differently, which is worth knowing before anyone shortens them back.
 *
 * The year renders as a two-digit stamp, so 2024 draws as ".24" — the first
 * project on this list that is not 2026, and the first real test that the
 * stamp is derived rather than typed.
 *
 * TWO THINGS STILL FOR PHASE 9, neither blocking:
 *
 * 1. SLUGS ARE PUBLIC URLS. `tfm`, a working name from the retired build, was
 *    renamed `emotional-ux` on 2026-09-30 when its case study landed.
 *    `joies-laia` is close to its name but not exact. Nothing is deployed, so
 *    changing it costs nothing today and costs a redirect later.
 *
 * 2. No `summary` field. The detail page will want one, but there is no copy
 *    for it yet and an empty field on four records is not a content module,
 *    it is a promise. It lands when the case studies do. */

export type Project = {
  slug: string
  /* The descriptive line above the name. */
  category: string
  title: string
  /* The Nav pill's label on the project's own page, when the title is too
     long for it. Falls back to `title`. */
  navLabel?: string
  /* Rendered as a two-digit stamp — 2026 draws as ".26", 2024 as ".24". */
  year: number
  /* The page's meta description and og:description (2026-10-01). Without
     one the page keeps the site-wide description from the root layout. */
  description?: string
  /* The project's 64x64 icon, a path under /public. Each draws inside a
     centred 48px box (8px clear all round). Emotional UX comes from the Figma
     ProjectListRow draft 1500:1362 (2026-10-01); Embassaments (0.6px
     stroke) and Joies Laia (a filled script mark) are the user's own exports
     of 2026-10-02. The case header's `logo` uses the same files.
     Not shown in the project list (removed 2026-10-03, user). */
  icon?: string
  /* The placeholder page's cover, in place of the icon (2026-10-04, Figma
     Frame 88, 1569:1664): a blurred photo (no scrim since 2026-10-05) with the brand's
     logo centred on it. Paths under /public. Only read while the project
     has no case study. */
  cover?: { photo: string; logo: string }
  /* A 1200x630 share card for og:image and twitter:image, a path under
     /public. Exported by the user 2026-10-07; without one the page uses the
     site card (lib/share-metadata). */
  shareImage?: { src: string; alt: string }
}

export const projects: Project[] = [
  {
    slug: 'emotional-ux',
    category: 'Testing emotional design',
    title: 'Emotional UX in e-commerce',
    navLabel: 'Emotional UX',
    year: 2026,
    description:
      "I redesigned an e-commerce template for trust: usability scores didn't move, but trust did, and every participant preferred it.",
    icon: '/case-studies/emotional-ux/icon.svg',
    shareImage: {
      src: '/case-studies/emotional-ux/share.png',
      alt: "The redesigned store's checkout flow: product page, cart drawer, cart footer and Stripe's hosted checkout, ending in a webhook that confirms the order and the success page.",
    },
  },
  {
    slug: 'joies-laia',
    category: 'A brand and store, built pro bono',
    title: 'Joies Laia',
    year: 2026,
    icon: '/case-studies/joies-laia/icon.svg',
    /* A JPG, unlike the other two: the photo ran to 774 KB as PNG. The
       export's blurred edges were transparent; they are filled with the
       photo itself, enlarged, rather than with white. */
    shareImage: {
      src: '/case-studies/joies-laia/share.jpg',
      alt: "The Laia script logo over a blurred photo of a woman wearing the brand's rings and a key pendant.",
    },
    cover: {
      photo: '/case-studies/joies-laia/cover.jpg',
      /* The PNG that the original logo.svg only wrapped as base64 (313 KB,
         served as-is and lazy). As a PNG, next/image resizes it to WebP and
         it can load with the photo instead of popping in after it. */
      logo: '/case-studies/joies-laia/logo.png',
    },
  },
  {
    /* Spelled "Embssaments" when given, which has no vowel between the b and
       the s — read as the Catalan embassaments, reservoirs, which is what a
       drought-data dashboard would be about. Corrected here; say if the
       project's real name is spelled another way. */
    slug: 'embassaments',
    category: 'Turning drought data into a public dashboard',
    title: 'Embassaments',
    year: 2024,
    description: 'Turning drought data into a public dashboard',
    icon: '/case-studies/embassaments/icon.svg',
    shareImage: {
      src: '/case-studies/embassaments/share.png',
      alt: 'An early hand-drawn sketch for the dashboard: nine reservoirs, their total capacity, absolute level and stored volume, and the first chart ideas.',
    },
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
