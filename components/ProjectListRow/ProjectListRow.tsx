'use client'

import Link from 'next/link'
import { localizeHref } from '@/lib/i18n/config'
import { useI18n } from '@/lib/i18n/client'
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
 * PHASE 10 ANSWERS THE OPEN QUESTION ABOVE. `current` exists now: the deck's
 * position indicator, ported from the retired build's MenuOverlay carousel
 * (which called the same idea `.isActive`) and driven by ProjectList's own
 * scroll-position tracking rather than the pointer — see ProjectList.tsx.
 * The colour change is identical to `hover`'s; the scale is new, matching
 * the retired build's `transform: scale(1.04)` on its active card.
 *
 * :hover ITSELF IS GONE, also ported from the retired build rather than
 * kept — its own comment on removing it is why: a mouse resting on a row
 * the carousel scrolls past would light that row up and fight `current` for
 * the same visual state. `hover` survives only as a forced state (below),
 * for the gallery's standalone specimen, which never runs the carousel.
 *
 * NO PROJECT ICON. One was added 2026-10-01 from the Figma drafts 1500:1361
 * and 1502:1376 (a 64px CSS mask of the project's SVG, left of the text) and
 * removed 2026-10-03 at the user's request. project.icon stays in
 * lib/projects.ts for the Joies Laia placeholder's header. The text block
 * and the year keep the drafts' 8px (space/sm). */

const STATES = {
  default: styles.default,
  hover: styles.hover,
  current: styles.current,
} as const

type ProjectListRowProps = {
  project: Project
  /* Forces the hover colours on (the gallery's standalone specimen only —
     there is no real :hover to fall back to, see the note above), or lights
     the row as the carousel's current project. Leave it unset for a plain,
     unlit row. */
  state?: keyof typeof STATES
  /* -1 for the carousel's off-screen loop clones, so they never enter tab
     order — see ProjectList.tsx. Unset for a real, reachable row. */
  tabIndex?: number
  className?: string
}

export default function ProjectListRow({
  project,
  state = 'default',
  tabIndex,
  className,
}: ProjectListRowProps) {
  /* The list's text is translated; the case page it opens stays in English. */
  const { locale, t } = useI18n()
  const text = t.projects[project.slug] ?? { category: project.category, title: project.title }
  return (
    <Link
      className={[styles.row, STATES[state], className]
        .filter(Boolean)
        .join(' ')}
      href={localizeHref(locale, `/projects/${project.slug}`)}
      tabIndex={tabIndex}
    >
      <span className={styles.body}>
        <span className={styles.text}>
          <span className={styles.category}>{text.category}</span>
          <span className={styles.title}>{text.title}</span>
        </span>
        {/* The stamp is the last two digits behind a full stop — 2026 draws as
          ".26", which is a decision the design makes and not a shortening this
          component invents. <time> so the machine-readable year survives the
          abbreviation; the visible text stays exactly what Figma draws. */}
        <time className={styles.year} dateTime={String(project.year)}>
          .{String(project.year).slice(-2)}
        </time>
      </span>
    </Link>
  )
}
