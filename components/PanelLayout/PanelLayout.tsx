import { ViewTransition, type ReactNode } from 'react'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import NavLinks from '@/components/NavLinks/NavLinks'
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
 * NavLinks on the landing, Breadcrumb inside, decided here rather than passed
 * in. It is the design's own rule and it is not a per-page choice, so a page
 * should not be able to get it wrong. Phase 8 step 3 merges those two
 * components into the single `Nav` set that already exists in Figma; when it
 * does, this is the one place that changes. */

type PanelState = 'landing' | 'projects' | 'about'

const STATES: Record<PanelState, string> = {
  landing: styles.landing,
  projects: styles.projects,
  about: styles.about,
}

/* The breadcrumb's current-section label. The landing has no breadcrumb, so it
   has no entry — that asymmetry is the nav rule, written as a type. */
const SECTION_LABEL: Record<Exclude<PanelState, 'landing'>, string> = {
  projects: 'Projects',
  about: 'About',
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
      {isLanding ? (
        <NavLinks layout="row" />
      ) : (
        <Breadcrumb label={SECTION_LABEL[state]} />
      )}
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
