import { useEffect, useState } from 'react'

/* THE TOP ZONE — the one piece of scroll state the case page's chrome shares.
 *
 * calebwu.ca drives both its pill and its rail from a single boolean (a spacer
 * at the top of the page is still on screen), plus the scroll direction for
 * the pill. That shared source is why the two hand off cleanly: at the top the
 * pill sits low and the rail is hidden; once reading starts the pill tucks and
 * the rail fades in. Measured off his page 2026-09-28 — see Nav and
 * CollectionNav for what each one does with it.
 *
 * 96px is --space-4xl, and his own spacer is 6rem below xl. A plain scroll
 * read rather than his IntersectionObserver on a spacer: there is no spacer
 * element here to observe, and both consumers need the direction anyway,
 * which only a scroll listener can give.
 *
 * DIRECTION CARRIES A 5px DEAD BAND, as his does, so a trackpad's jitter at
 * rest cannot flip it. His resets the reference point every frame, which
 * means a slow scroll (under 5px a frame) never registers a direction at all;
 * this one only moves the reference once the band is crossed, so slow scrolls
 * accumulate until they count.
 *
 * `measured` is false until the first real read. Both consumers need a safe
 * server-rendered default, and the two defaults differ: the pill renders tucked
 * (a mid-page reload must not show it drop and then rise again), the rail
 * renders hidden (a top-of-page load must not flash it before fading it out). */
export const TOP_ZONE_PX = 96
const DEAD_BAND_PX = 5

export type TopZone = { measured: boolean; atTop: boolean; scrollingDown: boolean }

/* A PAGE THAT DOES NOT SCROLL THE WINDOW CAN STILL LEAVE THE TOP (2026-10-02).
 * /projects is a stepping carousel: the window never moves, so this hook would
 * read "at the top, not scrolling" forever and the pill would stay lowered over
 * the list. The list calls this when the reader steps it, which counts as
 * scrolling down. A window event rather than shared state, so the list does
 * not need to know who is listening. */
const LEAVE_EVENT = 'top-zone:leave'

export function leaveTopZone() {
  window.dispatchEvent(new Event(LEAVE_EVENT))
}

/* `resetKey` is the route. Nav is mounted once and outlives every navigation,
 * so without it a direction from the last page (or a leaveTopZone() from
 * /projects) would carry over and keep the next page's pill tucked at its top.
 * A new key starts the reading fresh: no direction, position re-read. */
export function useTopZone(resetKey?: string): TopZone {
  const [zone, setZone] = useState<TopZone>({ measured: false, atTop: true, scrollingDown: false })

  useEffect(() => {
    let reference = window.scrollY
    let frame = 0
    let fresh = true

    const read = () => {
      frame = 0
      const y = window.scrollY
      const delta = y - reference
      const crossed = Math.abs(delta) > DEAD_BAND_PX
      if (crossed) reference = y
      const reset = fresh
      fresh = false

      setZone((previous) => {
        const next = {
          measured: true,
          atTop: y < TOP_ZONE_PX,
          scrollingDown: reset ? false : crossed ? delta > 0 : previous.scrollingDown,
        }
        return previous.measured === next.measured &&
          previous.atTop === next.atTop &&
          previous.scrollingDown === next.scrollingDown
          ? previous
          : next
      })
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }

    const leave = () => {
      cancelAnimationFrame(frame)
      frame = 0
      fresh = false
      setZone({ measured: true, atTop: false, scrollingDown: true })
    }

    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener(LEAVE_EVENT, leave)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener(LEAVE_EVENT, leave)
      cancelAnimationFrame(frame)
    }
  }, [resetKey])

  return zone
}
