import type { Metadata } from 'next'
import { projects } from '@/lib/projects'

/* The project list — "the deck". ProjectList and ProjectListRow exist as
   components since Phase 6 and render as a static stack; Phase 7 places them
   on this screen, and PHASE 8 is what turns the list into the wheel-stepped
   card set. That last step is the highest-risk work in the build and the only
   place with real input handling (wheel, touch, keyboard, looping).

   Deck position deliberately stays out of the URL. Reading searchParams would
   opt this route into dynamic rendering, and giving each card its own URL later
   is a routing change we can still make — going the other way is not. */

export const metadata: Metadata = {
  title: 'Projects — Joan Mascarell',
}

export default function ProjectsPage() {
  return (
    <>
      <h1>Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.slug}>{project.title}</li>
        ))}
      </ul>
    </>
  )
}
