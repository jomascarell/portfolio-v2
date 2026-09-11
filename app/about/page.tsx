import type { Metadata } from 'next'

/* About. New in v2 — the retired build never had this route, so there was no
   component or copy to salvage for it. AboutBio and lib/about.ts both arrived
   in Phase 6, carrying the bio transcribed from the Figma component; PHASE 7
   composes the screen and PHASE 9 replaces that copy with the final version.

   Contact was cut, so the email and social handles land here and in the
   footer rather than on a page of their own. */

export const metadata: Metadata = {
  title: 'About — Joan Mascarell',
}

export default function AboutPage() {
  return (
    <>
      <h1>About</h1>
    </>
  )
}
