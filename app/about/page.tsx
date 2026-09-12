import type { Metadata } from 'next'
import AboutBio from '@/components/AboutBio/AboutBio'
import PanelLayout from '@/components/PanelLayout/PanelLayout'

/* About. Figma: phase 7, about / 1448 (793:2047) and its five siblings.
 *
 * The same composition as /projects with a different state — the landing with
 * the bio open beside the panel — and the same correction applies: it keeps its
 * URL and stops being a separate page only in the visual sense.
 *
 * The panel reduces to the wordmark here. The tagline and the status lines are
 * not hidden, they are not rendered: the bio beside it says all of that in
 * prose, and repeating it would be the panel arguing with the page. IntroCard
 * owns that decision and PanelLayout names the type; this file names neither.
 *
 * STILL TO COME IN PHASE 8 — the contact block. Phase 7 replaces AboutBio with
 * AboutBio+Contact (791:1876), which adds the intro line, the social row and
 * the mail address beneath the prose. They move here from the Footer, which is
 * what makes the simplified footer fit in 10vh. The user confirmed MailLink is
 * reused for the address rather than following the drawing's plain text, so it
 * keeps the hover state it already has.
 *
 * PHASE 9 replaces the bio copy. It is real prose rather than lorem because the
 * retired build had real prose — see lib/about.ts, which also records why
 * "Designer" is an <em> and not a third link. */

export const metadata: Metadata = {
  title: 'About — Joan Mascarell',
}

export default function AboutPage() {
  return (
    <PanelLayout state="about">
      <AboutBio />
    </PanelLayout>
  )
}
