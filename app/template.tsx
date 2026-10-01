import { ViewTransition, type ReactNode } from 'react'

/* THE PAGE FADE, 2026-09-28 — calebwu.ca's route change, copied at the user's
 * ask. His page wrapper fades the old route out and the new one in on every
 * navigation, and does nothing on a refresh (AnimatePresence initial:false).
 *
 * A template, not the layout, because a template remounts on every navigation:
 * that remount is what gives React an exit and an enter to animate. Enter and
 * exit only animate inside a transition, and a cold load or refresh is not
 * one — so the refresh-shows-no-fade half comes for free, as his does.
 *
 * default="none" keeps this wrapper out of every other transition. Named pairs
 * inside it (the panel's `page-intro` morph) are snapshotted separately and
 * keep morphing; this fades everything around them. Timing is in globals.css. */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-fade" exit="page-fade" default="none">
      {children}
    </ViewTransition>
  )
}
