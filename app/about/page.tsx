import type { Metadata } from 'next'

/* About. New in v2 — the retired build never had this route, so there is no
   component or copy to salvage for it. Its content module (lib/about.ts) is
   written in Phase 8.

   Contact was cut, so the email and social handles land here and in the
   footer rather than on a page of their own. */

export const metadata: Metadata = {
  title: 'About — Joan Mascarell',
}

export default function AboutPage() {
  return (
    <main>
      <h1>About</h1>
    </main>
  )
}
