import type { ReactNode } from 'react'
import PageIntro from '@/components/PageIntro/PageIntro'
import styles from './PanelLayout.module.css'

/* The panel-plus-content screens: /projects and /about.
 *
 * There are two screen families in this design and this is the first of them.
 * Landing, landing-footer, projects and about carry an intro panel beside
 * their content; project-detail and photos carry no PageIntro at all and are
 * built separately. Landing is in the family but not in this component — it
 * has no content cell, so it is a panel placed on the page grid and nothing
 * else, which is less code than configuring this one to render half of itself.
 *
 * THE PAGE GRID LIVES HERE, and it is the same grid every screen in the design
 * is drawn on: 12 columns from 1024, 8 from 768, 4 below it, with a 16px
 * gutter and a 48px row gap. The horizontal inset is NOT here — the shell
 * already applies --container-inset to the one <main>, which is the same 64/32
 * the Figma frames carry as their grid offset.
 *
 * The span split is per screen and is set in each page's own stylesheet
 * through two custom properties, because the two screens genuinely differ and
 * only at one tier: both are 6 + 6 of 12 at lg, but projects is 5 + 3 of 8 at
 * md while about is 4 + 4. Putting the numbers in the page rather than behind a
 * prop name means the file you open to ask "how wide is the list on tablet"
 * is the file that answers. */

type PanelLayoutProps = {
  /* NavLinks on the landing, Breadcrumb everywhere else — passed through to
     PageIntro, which owns the slot. */
  nav: ReactNode
  type?: 'intro' | 'about'
  children: ReactNode
  className?: string
}

export default function PanelLayout({
  nav,
  type = 'intro',
  children,
  className,
}: PanelLayoutProps) {
  return (
    <div className={[styles.grid, className].filter(Boolean).join(' ')}>
      <PageIntro className={styles.panel} nav={nav} type={type} />
      <div className={styles.content}>{children}</div>
    </div>
  )
}
