/* Placeholder content module — Phase 9 replaces it with the real case studies.
   It exists this early only because app/projects/[slug]/page.tsx needs the
   slugs at build time for generateStaticParams.

   Slugs are carried over from the retired build, where they were explicitly
   marked as working names rather than final copy. Renaming one changes a
   public URL, so that decision belongs to Phase 9, not here.

   Phase 6 added `category`, `year` and `summary`, because ProjectListRow draws
   all three and a row cannot be built against a title alone. The values come
   from the four rows Figma draws in ProjectList, which are real names rather
   than the lorem the retired build carried.

   TWO THINGS TO SETTLE IN PHASE 9, both content and neither blocking:

   1. FIGMA AND THIS FILE DISAGREE ABOUT WHICH FOUR PROJECTS THESE ARE. Figma
      draws Personal Library, Hedonic Design, Laia, Data Water — and no Okisam.
      This file has tfm, joies-laia, biblioteca, okisam. Three map cleanly
      (tfm is the master thesis, so Hedonic Design; joies-laia is Laia;
      biblioteca is Personal Library). Okisam is the fourth here and is not
      drawn at all, which is why it is also the only one with no category in
      the design — there was no row to write one on.

   2. THE FOURTH SUMMARY IS UNASSIGNED. "Turning drought data into a public
      dashboard" describes Figma's Data Water row (the Three.js one), not a
      personal library, so it is not attached to `biblioteca` on a guess. If
      the four projects are in fact Data Water rather than Personal Library,
      this slug is the one that changes — and it changes a URL, which is
      exactly the kind of decision Phase 9 owns. */

export type Project = {
  slug: string
  /* The small line above the name: what kind of project it was. */
  category: string
  title: string
  /* Rendered as a two-digit stamp — 2026 draws as ".26". */
  year: number
  /* One line, for the project list and the top of the detail page. */
  summary: string
}

export const projects: Project[] = [
  {
    slug: 'tfm',
    category: 'Master Thesis',
    title: 'Hedonic Design',
    year: 2026,
    summary: 'Testing emotional design in online shopping.',
  },
  {
    slug: 'joies-laia',
    category: 'Branding and Development',
    title: 'Laia',
    year: 2026,
    summary: 'A brand and store, built pro bono.',
  },
  {
    slug: 'biblioteca',
    category: 'API project',
    title: 'Personal Library',
    year: 2026,
    /* TODO(Phase 9): see note 2 above. */
    summary: '',
  },
  {
    /* "Design System" is proposed, not drawn — Okisam has no row in Figma and
       therefore no category. It names the deliverable the way "Three.js" names
       the tech and "Branding and Development" names the disciplines, and it is
       the one true thing about the work that does not identify the client:
       the bio on /about already says a component-based CSS design system was
       built there from scratch. */
    slug: 'okisam',
    category: 'Design System',
    title: 'Okisam',
    year: 2026,
    summary: 'Confidential client work, real growth.',
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
