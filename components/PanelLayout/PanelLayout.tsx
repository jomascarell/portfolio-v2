import { ViewTransition, type ReactNode } from 'react'
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
 * HOW THE PANEL MOVES. Each route renders its own panel, and the panel is
 * wrapped in <ViewTransition> under a stable name. The browser snapshots the
 * old and new positions across the navigation and animates between them, so
 * the panel slides from centre to left without any of the three routes
 * owning a "from" and a "to". This is the documented shared-element morph,
 * and it is why the panel does NOT have to be hoisted into a layout and kept
 * mounted: a named pair morphs across separate route trees.
 *
 * THE NAV IS NOT HERE ANY MORE — retired 2026-09-15, reversing the call this
 * comment used to make. It used to say the ViewTransition crossfade gave
 * Caleb's RESULT "without the measurement rig or the staging timers" — true,
 * but it was the wrong trade: a crossfade of two bitmaps is not what he
 * actually built, it is an approximation of it, and the approximation is
 * what got reopened. Nav is now mounted once in the root layout, reads the
 * route itself, and runs the real measured width morph — see
 * components/Nav/Nav.tsx. This file has nothing nav-related left to render.
 *
 * ABOUT LOSES ITS PANEL TOO, ALSO 2026-09-15 — a direct instruction from the
 * designer relayed by the user, not a Figma change: "no longer want the
 * Joan wordmark [on About], it is irrelevant." There is no updated frame for
 * this; the screenshot the user shared (bio alone, centred, no wordmark) is
 * the only spec that exists for it. About is no longer really a member of
 * this "panel family" at all — it has no panel any more, same as photos and
 * project-detail — but it still shares this component's grid, min-block-size
 * budget and fixed-page-size handling rather than moving to its own
 * stylesheet, since none of that was ever about the panel specifically. */

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
  const hasPanel = state !== 'about'

  /* `share="morph"` and `default="none"` travel together. The share prop puts
     the pair in a class the stylesheet can target; default="none" stops these
     named elements from running a crossfade on every unrelated transition.
     Setting default="none" WITHOUT an explicit share silently stops the morph
     altogether, which is a quiet enough failure to be worth naming here.

     About no longer renders this pair at all. Navigating in from a route
     that still has one (landing, projects) leaves that outgoing panel with
     no partner to morph into — the browser's default is to fade it out on
     its own, which reads fine here: the wordmark is meant to stop existing
     on this screen, not to arrive somewhere else on it. */
  return (
    <div className={[styles.grid, STATES[state], className].filter(Boolean).join(' ')}>
      {hasPanel && (
        <ViewTransition name="page-intro" share="morph" default="none">
          <PageIntro className={styles.panel} type="intro" />
        </ViewTransition>
      )}

      {children ? <div className={styles.content}>{children}</div> : null}
    </div>
  )
}
