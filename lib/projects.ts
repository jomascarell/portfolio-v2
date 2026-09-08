/* Placeholder content module — Phase 8 replaces it with the real case studies.
   It exists this early only because app/projects/[slug]/page.tsx needs the
   slugs at build time for generateStaticParams.

   Slugs are carried over from the retired build, where they were explicitly
   marked as working names rather than final copy. Renaming one changes a
   public URL, so that decision belongs to Phase 8, not here. */

export type Project = {
  slug: string
  title: string
}

export const projects: Project[] = [
  { slug: 'tfm', title: 'TFM' },
  { slug: 'joies-laia', title: 'Joies Laia' },
  { slug: 'biblioteca', title: 'Biblioteca' },
  { slug: 'okisam', title: 'Okisam' },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
