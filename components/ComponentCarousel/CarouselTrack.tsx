'use client'

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import styles from './ComponentCarousel.module.css'

/* The scroller and its progress buttons — the only client code in the
 * carousel.
 *
 * THE MECHANISM IS calebwu.ca/RevisionDojo's, measured 2026-09-30: a native
 * horizontal scroller with mandatory scroll snap, slides 80% wide and snapped
 * to centre, and under it a row of short pills with ONE marker that slides
 * to the current one. No slider library — trackpad, touch and the scrollbar
 * all work because it is a real scroll container.
 *
 * TWO THINGS HIS DOES NOT DO AND THIS DOES: the scroller takes focus, so the
 * arrow keys move it (his cannot be reached from the keyboard), and a
 * button's scroll is instant under prefers-reduced-motion.
 *
 * The current slide is the one whose centre is nearest the scroller's
 * centre, read on scroll once per frame. That handles the two ends, where
 * the first and last slides snap to the edge rather than the centre. */
export default function CarouselTrack({
  label,
  titles,
  children,
}: {
  label: string
  titles: string[]
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const track = ref.current
    if (!track) return

    let frame = 0
    const sync = () => {
      frame = 0
      const middle = track.scrollLeft + track.clientWidth / 2
      let nearest = 0
      let distance = Infinity
      Array.from(track.children).forEach((slide, index) => {
        const element = slide as HTMLElement
        const gap = Math.abs(
          element.offsetLeft + element.offsetWidth / 2 - middle,
        )
        if (gap < distance) {
          distance = gap
          nearest = index
        }
      })
      setCurrent(nearest)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sync)
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    sync()
    return () => {
      track.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  function show(index: number) {
    const track = ref.current
    const slide = track?.children[index] as HTMLElement | undefined
    if (!track || !slide) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollTo({
      left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2,
      behavior: reduce ? 'auto' : 'smooth',
    })
  }

  return (
    <div className={styles.carousel}>
      <div
        ref={ref}
        className={styles.track}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        /* A scroll container must take focus or the keyboard cannot scroll
           it (axe: scrollable-region-focusable). The rule below does not
           know a scrolling region is operable. */
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      >
        {children}
      </div>

      <div
        className={styles.progress}
        role="group"
        aria-label={`${label}: choose a slide`}
        style={{ '--current': current } as CSSProperties}
      >
        {titles.map((title, index) => (
          <button
            key={title}
            type="button"
            className={styles.pip}
            aria-label={title}
            aria-current={index === current ? 'true' : undefined}
            onClick={() => show(index)}
          />
        ))}
        <span className={styles.marker} aria-hidden="true" />
      </div>
    </div>
  )
}
