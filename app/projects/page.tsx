import type { Metadata } from 'next'
import { projects } from '@/lib/projects'

/* The project list — "the deck". Phase 7 turns this into the stacked, wheel-
   stepped card set; it is the highest-risk component in the build and the only
   place with real input handling (wheel, touch, keyboard, looping).

   Deck position deliberately stays out of the URL. Reading searchParams would
   opt this route into dynamic rendering, and giving each card its own URL later
   is a routing change we can still make — going the other way is not. */

export const metadata: Metadata = {
  title: 'Projects — Joan Mascarell',
}

export default function ProjectsPage() {
  return (
    <main>
      <h1>Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.slug}>{project.title}</li>
        ))}
      </ul>
    </main>
  )
}
