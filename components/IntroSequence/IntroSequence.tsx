'use client'

import { useLayoutEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/* Marks the document once the landing entrance has finished, and — 2026-09-17
 * — RE-OPENS it every time the route becomes "/" again, so the sequence
 * replays on a return to the landing the same way calebwu.ca's does. Verified
 * live against the reference: navigating his /RevisionDojo back to "/" via
 * the breadcrumb restarts his entrance (document.getAnimations() showed the
 * same elements freshly running, currentTime ~100ms into a 450-700ms effect,
 * not the finished state a one-shot gate would leave them in). Ours was a
 * one-shot gate; this is the fix, asked for explicitly rather than inferred.
 *
 * It exists at all because the sequence lives on elements that DO remount:
 * every route renders its own PageIntro, so the panel, wordmark, tagline and
 * status would each replay their entrance on a client-side navigation, on top
 * of the view-transition morph already animating the same panel. That is
 * still true for /projects, the other route PageIntro mounts on — arriving
 * there must still suppress the sequence, only "/" re-opens it. Nav needs no
 * such mark — it is mounted once in the root layout and applies its own mount
 * class on the first route only; arriving back at "/" already replays Nav's
 * own entrance in its own form, the FLIP roll morph that runs on every route
 * change. Layering the mount stagger on top of that roll would be two motions
 * animating the same items at once, so Nav is deliberately left alone here.
 *
 * mountedRef distinguishes the first-ever run (cold load, any route) from a
 * later run caused by an actual pathname change. Only the first run keeps the
 * old unconditional behaviour — schedule "done" once, regardless of route —
 * so a cold load straight to /projects still plays the sequence there exactly
 * as it always has. Every run after that is a real navigation: away from "/"
 * closes the door immediately, back to "/" reopens it and restarts the timer.
 *
 * Still the permissive way round on every run. The attribute SUPPRESSES
 * motion rather than enabling it, so if this component never runs — JS
 * disabled, a failed hydration, an effect that never fires — the page is
 * fully visible and the worst that happens is the sequence playing (or
 * replaying) once more than intended. Gating the other way would mean a page
 * that never appears.
 *
 * 1400ms is the sequence's own length plus a margin. The last beat is the
 * tagline and status, which wait out the wordmark's 700ms settle and then take
 * 450ms, finishing at 1150ms. The number does not need to be exact, only later
 * than the end — it is when the door closes, not part of the choreography.
 * Kept here rather than read from CSS because a getComputedStyle round trip to
 * discover a constant we already know would be work for its own sake. It does
 * need revisiting if --intro-settle changes, which is the one thing that can
 * push the end past this.
 *
 * useLayoutEffect, not useEffect: the door has to close (or reopen) before the
 * browser paints the new route's frame, or a client-side nav away from "/"
 * could show one frame of an entrance it is about to suppress. Matches the
 * synchronous-before-paint pattern Nav.tsx already uses for its own
 * navigation-timed state. */
const SEQUENCE_END_MS = 1400

export default function IntroSequence() {
  const pathname = usePathname()
  const mountedRef = useRef(false)

  useLayoutEffect(() => {
    const firstRun = !mountedRef.current
    mountedRef.current = true

    if (!firstRun) {
      if (pathname !== '/') {
        document.documentElement.dataset.intro = 'done'
        return
      }
      delete document.documentElement.dataset.intro
    }

    const id = window.setTimeout(() => {
      document.documentElement.dataset.intro = 'done'
    }, SEQUENCE_END_MS)

    return () => window.clearTimeout(id)
  }, [pathname])

  return null
}
