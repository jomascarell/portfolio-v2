import Link from 'next/link'
import { IoMdArrowUp } from 'react-icons/io'
import { localizeHref } from '@/lib/i18n/config'
import { getI18n } from '@/lib/i18n/server'
import { projects } from '@/lib/projects'
import styles from './CaseEndNav.module.css'

/* The end of a case page: a way back and a way on.
 * Figma: CaseEndNav (1522:2184), Breakpoint = lg | md | sm x
 * Position = first | middle | last, named 2026-10-02.
 *
 * POSITION COMES FROM THE ORDER IN lib/projects.ts, not from a prop, so adding
 * or reordering a project can never leave a stale link. The first case has no
 * previous case, so its left side goes back to Projects ("All work"). The last
 * case mirrors it on the right: the user chose an end over wrapping round to
 * the first case (2026-10-02), because with three cases the wrap mostly lands
 * a reader back on the one they started with.
 *
 * FULL CONTENT WIDTH, not the article's 8-column measure: the 1449 frame spans
 * all 12 columns, and the user confirmed it. The component's own inline
 * padding (0 / 32 / 64) is on top of the shell's container inset.
 *
 * THE TEXT IS TRANSLATED, unlike the case study above it. It is navigation
 * chrome, like the project list, which shows the same category and title in
 * the page's language. That is also why it renders outside the article's
 * lang="en" wrapper. */

type Side = {
  href: string
  label: string
  category?: string
  title: string
}

function EndLink({ side, direction }: { side: Side; direction: 'previous' | 'next' }) {
  const arrow = (
    <span className={styles.arrow} aria-hidden="true">
      <IoMdArrowUp />
    </span>
  )
  return (
    <Link className={`${styles.link} ${styles[direction]}`} href={side.href}>
      {/* fi-ss-arrow-small-up in the file, turned to point along the label.
          IoMdArrowUp is the case page's existing arrow (the live link's). */}
      <span className={styles.eyebrow}>
        {direction === 'previous' ? arrow : null}
        <span className={styles.label}>{side.label}</span>
        {direction === 'next' ? arrow : null}
      </span>
      <span className={styles.text}>
        {side.category ? <span className={styles.category}>{side.category}</span> : null}
        <span className={styles.title}>{side.title}</span>
      </span>
    </Link>
  )
}

export default async function CaseEndNav({ slug }: { slug: string }) {
  const { locale, t } = await getI18n()
  const index = projects.findIndex((project) => project.slug === slug)
  if (index === -1) return null

  const allWork: Side = {
    href: localizeHref(locale, '/projects'),
    label: t.nav.projects,
    title: t.caseEnd.allWork,
  }
  const sideFor = (at: number, label: string): Side => {
    const project = projects[at]
    const text = t.projects[project.slug] ?? { category: project.category, title: project.title }
    return {
      href: localizeHref(locale, `/projects/${project.slug}`),
      label,
      category: text.category,
      title: text.title,
    }
  }

  const previous = index > 0 ? sideFor(index - 1, t.caseEnd.previous) : allWork
  const next = index < projects.length - 1 ? sideFor(index + 1, t.caseEnd.next) : allWork

  return (
    <nav className={styles.nav} aria-label={t.caseEnd.label}>
      <EndLink side={previous} direction="previous" />
      <EndLink side={next} direction="next" />
    </nav>
  )
}
