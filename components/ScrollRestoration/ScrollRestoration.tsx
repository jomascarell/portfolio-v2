'use client'

import { useEffect } from 'react'

/* A REFRESH ALWAYS LANDS AT THE TOP, 2026-09-28 — calebwu.ca sets exactly
 * this (chunk a72feb244e36bc09.js, module 2056), copied at the user's ask.
 *
 * It trades a reader keeping their place on reload for every load starting
 * from the same composed state: the case page's pill lowered, then dropping
 * into place, and the rail waiting for the first scroll (see
 * lib/use-top-zone). A #fragment in the URL still scrolls to its section —
 * that is fragment navigation, not restoration, and this does not touch it.
 *
 * Browser back/forward is also restoration, so it lands at the top too. Same
 * as the reference. Renders nothing. */
export default function ScrollRestoration() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  return null
}
