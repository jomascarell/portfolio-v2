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
 * THIS COMPONENT BECOMES THE DECK IN PHASE 8. They are not two things: the
 * Animations page frame "Project list — the deck" is the spec for this
 * component at runtime, where it steps one project at a time instead of
 * standing still. Four static rows is what Figma draws and what ships now; the
 * stepping, the wrap-around and the five rendered copies land in Phase 8 on
 * top of exactly this markup. Anything added here should survive that. */

type ProjectListProps = {
  className?: string
}

export default function ProjectList({ className }: ProjectListProps) {
  return (
    <ul className={[styles.list, className].filter(Boolean).join(' ')}>
      {projects.map((project) => (
        <li key={project.slug}>
          <ProjectListRow project={project} />
        </li>
      ))}
    </ul>
  )
}
