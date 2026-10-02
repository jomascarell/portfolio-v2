import Link from 'next/link'

/* Reached by notFound() from an unknown project slug, and by any URL that does
   not match a route. It already sits inside the persistent shell, which the
   root layout has given every route since Phase 5 — what it does not have is a
   design, because the Figma file has no 404 screen. That gets invented and
   shown to you in PHASE 13, at QA. Until then it just has to say what happened
   and offer a way out. */

export default function NotFound() {
  return (
    <>
      <h1>Page not found</h1>
      <p>That page does not exist.</p>
      <Link href="/">Back to the start</Link>
    </>
  )
}
