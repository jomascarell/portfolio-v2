import type { CSSProperties } from 'react'
import ProjectListRow from '@/components/ProjectListRow/ProjectListRow'
import { projects } from '@/lib/projects'
import styles from './ProjectList.module.css'

/* The list of projects on /projects. Figma: ProjectList, Breakpoint = base
 * (282:752) — one variant serving all six widths, which the component's own
 * description admits: "md and lg variants still to be built".
 *
 * So there is nothing to read for the other two tiers, and nothing is invented
 * for them either: the rows are fluid and the list is the same stack at every
 * width. If md and lg turn out to differ, the screens are the place to find
 * out — Phase 7 builds those against the design page, where the projects
 * screen does exist at all six canvases.
 *
 * THE STEPPING DECK NEVER HAPPENED, AND THAT IS CORRECT NOW, NOT AN OVERSIGHT.
 * This comment used to say Phase 8 turns the list into an endless, wrapped,
 * index-stepped carousel per the Animations page's "the deck" spec. That spec
 * predates the 12 Sep decision that /projects is a real route rendering a
 * static panel, not a card the user steps through — the carousel concept
 * belonged to the retired MenuOverlay reading, which the phase 7 page
 * superseded. What Phase 7/8 actually built instead is a row-entrance
 * animation on navigation — see .list > li below — which is the part of the
 * old spec that did survive: motion on arrival, not a mechanism for cycling. */

type ProjectListProps = {
  className?: string
}

export default function ProjectList({ className }: ProjectListProps) {
  return (
    <ul className={[styles.list, className].filter(Boolean).join(' ')}>
      {projects.map((project, index) => (
        <li key={project.slug} style={{ '--row-index': index } as CSSProperties}>
          <ProjectListRow project={project} />
        </li>
      ))}
    </ul>
  )
}
