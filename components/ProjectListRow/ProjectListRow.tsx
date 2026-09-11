import Link from 'next/link'
import type { Project } from '@/lib/projects'
import styles from './ProjectListRow.module.css'

/* One row of the project list: category, name, year stamp.
 * Figma: ProjectListRow, State = default | hover (543:111).
 *
 * The state is a colour change and only a colour change: default sits back on
 * color/text/subtle and hover brings the whole row — all three lines at once —
 * to color/text/primary. There is no background, no border and no movement.
 * The component's own description records that before it existed the four rows
 * were loose frames with the fill overridden by hand on each one, which is
 * what the State axis is here to stop.
 *
 * Not carried over: the drawn frame has a 35px corner radius and no fill, so
 * it rounds nothing. 35 is not on the radius scale either (4 / 8 / 16). An
 * inert declaration in a stylesheet reads as an intention, so it is recorded
 * here instead of copied.
 *
 * The whole row is the link, which is what the Animations page specifies:
 * "Click or tap → Opens the project. Navigates to project-detail. The
 * breadcrumb takes over from there."
 *
 * PHASE 7 WILL PROBABLY CHANGE THE MARKUP HERE, and it should. The name is
 * visually a heading and this renders it as a span, because heading hierarchy
 * is settled once across all six screens rather than per component — the usual
 * shape is <h2><Link>…</Link></h2> per row, which moves the link inside.
 *
 * PHASE 8 OWNS THE OTHER OPEN QUESTION: the deck has no position indicator.
 * If an accent state belongs anywhere in this system it belongs on this row —
 * a `current` state — because these rows are named projects rather than the
 * faceless cards the reference paginates. Not built on a guess. */

const STATES = {
  default: styles.default,
  hover: styles.hover,
} as const

type ProjectListRowProps = {
  project: Project
  /* Forces the hover colours on. For the gallery and for Phase 8, which will
     need to light a row that the pointer is not over. Leave it unset in real
     use — :hover and :focus-visible do the work. */
  state?: keyof typeof STATES
  className?: string
}

export default function ProjectListRow({
  project,
  state = 'default',
  className,
}: ProjectListRowProps) {
  return (
    <Link
      className={[styles.row, STATES[state], className]
        .filter(Boolean)
        .join(' ')}
      href={`/projects/${project.slug}`}
    >
      <span className={styles.text}>
        <span className={styles.category}>{project.category}</span>
        <span className={styles.title}>{project.title}</span>
      </span>
      {/* The stamp is the last two digits behind a full stop — 2026 draws as
          ".26", which is a decision the design makes and not a shortening this
          component invents. <time> so the machine-readable year survives the
          abbreviation; the visible text stays exactly what Figma draws. */}
      <time className={styles.year} dateTime={String(project.year)}>
        .{String(project.year).slice(-2)}
      </time>
    </Link>
  )
}
