import { ViewTransition, type ReactNode } from 'react'
import Nav from '@/components/Nav/Nav'
import PageIntro from '@/components/PageIntro/PageIntro'
import styles from './PanelLayout.module.css'

/* The panel family — landing, projects and about — as ONE component with three
 * states, rather than three screens that happen to look related.
 *
 * REWRITTEN 2026-09-12, and the reason is a correction from the user rather
 * than a refactor. Projects and About are not separate pages: they are the
 * landing with a second column open. The phase 7 page shows it in the geometry
 * — at 1448 the landing's panel is 874.7 wide and centred, on projects the
 * SAME panel is 763.3 pinned to x=64 with the list beside it, and on about it
 * shrinks again to 540.7 with the bio beside it. One object in three positions.
 *
 * The previous build had this as two things: app/landing.module.css owned a
 * grid for the landing, and this component owned a different grid for the two
 * "panel screens". That split is what made them read as separate pages, and
 * merging the grids is most of what this change is.
 *
 * THEY ARE STILL REAL ROUTES WITH REAL URLS. The user was explicit: keep the
 * addresses, share the layout, animate between them. So /projects and /about
 * stay addressable, deep-linkable and back-button-correct, and what changes is
 * that they render the same composition rather than a different one.
 *
 * HOW THE PANEL MOVES. Each route renders its own panel, and both the panel and
 * the nav are wrapped in <ViewTransition> under stable names. The browser
 * snapshots the old and new positions across the navigation and animates
 * between them, so the panel slides from centre to left without any of the
 * three routes owning a "from" and a "to". This is the documented shared-element
 * morph, and it is why the panel does NOT have to be hoisted into a layout and
 * kept mounted: a named pair morphs across separate route trees.
 *
 * That also settles the nav morph the cheap way. The Figma spec describes
 * Caleb's technique — measure both labels' scrollWidth, animate width with a
 * per-item delay — because he has no view transitions to lean on. We want his
 * RESULT, which the user confirmed, and a named ViewTransition gives it without
 * the measurement rig or the staging timers.
 *
 * The nav is now ONE component in five states rather than two components
 * swapped by route — NavLinks and Breadcrumb were merged into `Nav` to match
 * the Figma set, so this file hands it a state and stops there. It used to
 * choose between two imports on the page's behalf; there is nothing left to
 * choose. PanelLayout's own state names are Nav's state names on purpose, so
 * the mapping is an identity rather than a lookup that can drift. */

type PanelState = 'landing' | 'projects' | 'about'

const STATES: Record<PanelState, string> = {
  landing: styles.landing,
  projects: styles.projects,
  about: styles.about,
}

type PanelLayoutProps = {
  state: PanelState
  /* Absent on the landing, which is the whole of what makes it the landing:
     the panel with no second cell beside it. */
  children?: ReactNode
  className?: string
}

export default function PanelLayout({
  state,
  children,
  className,
}: PanelLayoutProps) {
  const isLanding = state === 'landing'

  /* `share="morph"` and `default="none"` travel together. The share prop puts
     the pair in a class the stylesheet can target; default="none" stops these
     named elements from running a crossfade on every unrelated transition.
     Setting default="none" WITHOUT an explicit share silently stops the morph
     altogether, which is a quiet enough failure to be worth naming here. */
  const nav = (
    <ViewTransition name="site-nav" share="morph" default="none">
      <Nav state={state} />
    </ViewTransition>
  )

  return (
    <div className={[styles.grid, STATES[state], className].filter(Boolean).join(' ')}>
      <ViewTransition name="page-intro" share="morph" default="none">
        <PageIntro
          className={styles.panel}
          nav={nav}
          type={isLanding ? 'intro' : state === 'about' ? 'about' : 'intro'}
          ladder={isLanding ? 'full' : 'panel'}
        />
      </ViewTransition>

      {children ? <div className={styles.content}>{children}</div> : null}
    </div>
  )
}
