'use client'

import { useEffect } from 'react'

/* Marks the document once the landing entrance has finished, so it runs on a
 * page load and never again.
 *
 * It exists because the sequence lives on elements that DO remount: every
 * route renders its own PageIntro, so the panel, wordmark, tagline and status
 * would each replay their entrance on a client-side navigation, on top of the
 * view-transition morph already animating the same panel. Nav needs no such
 * mark — it is mounted once in the root layout and applies its own mount class
 * on the first route only.
 *
 * Deliberately the permissive way round. The attribute SUPPRESSES motion
 * rather than enabling it, so if this component never runs — JS disabled, a
 * failed hydration, an effect that never fires — the page is fully visible and
 * the worst that happens is a second run of the sequence. Gating the other way
 * would mean a page that never appears.
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
 * No cleanup-on-unmount subtlety to worry about: this sits in the root layout
 * and never unmounts. The clearTimeout is for Strict Mode's double-invoked
 * effect in development, which would otherwise leave a stray timer. */
const SEQUENCE_END_MS = 1400

export default function IntroSequence() {
  useEffect(() => {
    const id = window.setTimeout(() => {
      document.documentElement.dataset.intro = 'done'
    }, SEQUENCE_END_MS)

    return () => window.clearTimeout(id)
  }, [])

  return null
}
