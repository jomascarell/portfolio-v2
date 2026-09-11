import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProject, projects } from '@/lib/projects'

/* Project detail. PHASE 7 builds the template, PHASE 9 fills it with the real
   case studies. Like /photos it carries no PageIntro — it is content plus its
   own scroll-spy rail plus a standalone Breadcrumb, which is the second of the
   two screen families.

   dynamicParams = false: generateStaticParams enumerates every project, so a
   slug outside that list is a 404 rather than an on-demand render. It keeps the
   route fully static — and it is also incompatible with cacheComponents, which
   is one more reason that flag stays off (Phase 2 decision). */

export const dynamicParams = false

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata(
  props: PageProps<'/projects/[slug]'>,
): Promise<Metadata> {
  const { slug } = await props.params
  const project = getProject(slug)

  return { title: `${project?.title ?? 'Project'} — Joan Mascarell` }
}

export default async function ProjectDetailPage(
  props: PageProps<'/projects/[slug]'>,
) {
  // params is a Promise in Next 16 — it has to be awaited, not destructured.
  const { slug } = await props.params
  const project = getProject(slug)

  if (!project) notFound()

  return (
    <>
      <h1>{project.title}</h1>
    </>
  )
}
