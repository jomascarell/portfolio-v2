import type { ReactNode } from 'react'
import RouteTransition from '@/components/RouteTransition/RouteTransition'

/* THE PAGE FADE, 2026-09-28 — calebwu.ca's route change, copied at the user's
 * ask. His page wrapper fades the old route out and the new one in on every
 * navigation, and does nothing on a refresh (AnimatePresence initial:false).
 *
 * A template, not the layout, because a template remounts on every navigation:
 * that remount is what gives React an exit and an enter to animate. Enter and
 * exit only animate inside a transition, and a cold load or refresh is not
 * one — so the refresh-shows-no-fade half comes for free, as his does.
 *
 * Timing is in globals.css. */
/* THE FADE MOVED TO THE ROOT, 2026-10-02. This wrapper used to BE the faded
 * thing: React snapshotted the whole page as one group and globals.css faded
 * it. On the user's iPhone that worked from the landing to /projects and failed
 * from a case page back to the landing: the case page stayed fully opaque
 * under the landing, then vanished. The difference is height. A case page is
 * thousands of px tall, and a snapshot that size is what Safari appears not to
 * animate; the landing and /projects are one screen each.
 *
 * So the page no longer gets a group of its own. It stays in the ROOT
 * snapshot, which is always viewport-sized, and globals.css fades the root.
 * RouteTransition is what makes React start the transition at all; see it for
 * why it is keyed by path rather than relying on this template's remount. */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      <RouteTransition />
      {children}
    </>
  )
}
