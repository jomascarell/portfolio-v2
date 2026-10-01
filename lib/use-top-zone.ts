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

export function useTopZone(): TopZone {
  const [zone, setZone] = useState<TopZone>({ measured: false, atTop: true, scrollingDown: false })

  useEffect(() => {
    let reference = window.scrollY
    let frame = 0

    const read = () => {
      frame = 0
      const y = window.scrollY
      const delta = y - reference
      const crossed = Math.abs(delta) > DEAD_BAND_PX
      if (crossed) reference = y

      setZone((previous) => {
        const next = {
          measured: true,
          atTop: y < TOP_ZONE_PX,
          scrollingDown: crossed ? delta > 0 : previous.scrollingDown,
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

    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      window.removeEventListener('scroll', schedule)
      cancelAnimationFrame(frame)
    }
  }, [])

  return zone
}
