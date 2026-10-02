'use client'

import { usePathname } from 'next/navigation'
import { ViewTransition } from 'react'

/* What starts the page fade (globals.css, ::view-transition-*(root)).
 *
 * React only runs a view transition when a <ViewTransition> boundary enters,
 * exits or updates. This one is empty and keyed by the path, so it exits and
 * enters on EVERY navigation. app/template.tsx alone was not enough: a
 * template remounts only when the top-level segment changes, so /projects to
 * /projects/<slug> never faded. Its own group is hidden in globals.css. */
export default function RouteTransition() {
  const pathname = usePathname()
  /* OUT OF FLOW, OR IT MOVES THE PAGE. In flow, this empty span was harmless at
     rest but took a whole line while the browser captured it (a named element
     is laid out as its own box), so every snapshot recorded the page 30px
     lower than it really is. The panel morph then slid to that wrong spot and
     jumped 30px when the transition ended: the glitch in the user's Firefox
     recording, 2026-10-02, measured in Chromium and Firefox alike. Fixed,
     1px and invisible, it can never take part in layout. */
  return (
    <ViewTransition key={pathname} enter="page-route" exit="page-route" default="none">
      <span
        aria-hidden="true"
        style={{
          position: 'fixed',
          insetBlockStart: 0,
          insetInlineStart: 0,
          inlineSize: 1,
          blockSize: 1,
          pointerEvents: 'none',
        }}
      />
    </ViewTransition>
  )
}
