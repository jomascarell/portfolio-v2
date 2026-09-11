/* Landing. PageIntro, NavLinks and the wordmark all exist as components since
   Phase 6, and PHASE 7 composes them into this screen — until then the route
   is deliberately a bare heading, which is what you see if you run the dev
   server and wonder where the design went. The components are reviewable now
   at /gallery.

   It is the only screen that carries the pills — everywhere else uses the
   breadcrumb (nav rule, confirmed in the Figma audit).

   The wordmark is a lowercase "joan" of four curved letterforms, not the
   retired build's uppercase modular JOAN. See components/Wordmark. */

export default function LandingPage() {
  return (
    <>
      <h1>Joan Mascarell</h1>
    </>
  )
}
