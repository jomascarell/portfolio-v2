/* The four projects.
 *
 * Content given directly on 2026-09-11, and it settles what Figma could not:
 * the file's ProjectList draws a fourth row called "Personal Library" that
 * was invented copy to fill the drawing, and there is no project behind it.
 * So the four here are the four, and `biblioteca` is gone.
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
 * 1. SLUGS ARE PUBLIC URLS AND TWO NO LONGER MATCH THEIR NAMES. `tfm` was a
 *    working name from the retired build and the project is now "Emotional UX
 *    in e-commerce"; `joies-laia` is close but not exact. Nothing is deployed,
 *    so changing them costs nothing today and costs a redirect later.
 *
 * 2. No `summary` field. The detail page will want one, but there is no copy
 *    for it yet and an empty field on four records is not a content module,
 *    it is a promise. It lands when the case studies do. */

export type Project = {
  slug: string
  /* The descriptive line above the name. */
  category: string
  title: string
  /* Rendered as a two-digit stamp — 2026 draws as ".26", 2024 as ".24". */
  year: number
}

export const projects: Project[] = [
  {
    slug: 'tfm',
    category: 'Testing emotional design',
    title: 'Emotional UX in e-commerce',
    year: 2026,
  },
  {
    slug: 'joies-laia',
    category: 'A brand and store, built pro bono',
    title: 'Joies Laia',
    year: 2026,
  },
  {
    slug: 'okisam',
    category: 'Confidential client work, real growth',
    title: 'Okisam',
    year: 2026,
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
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
