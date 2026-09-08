import Link from 'next/link'

/* Reached by notFound() from an unknown project slug, and by any URL that does
   not match a route. Phase 6 gives it the shell treatment; for now it just has
   to say what happened and offer a way out. */

export default function NotFound() {
  return (
    <main>
      <h1>Page not found</h1>
      <p>That page does not exist.</p>
      <Link href="/">Back to the start</Link>
    </main>
  )
}
