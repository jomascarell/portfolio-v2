'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './MediaVideo.module.css'

export type MediaVideoSource = {
  webm: string
  mp4: string
  poster: string
  width: number
  height: number
}

/* MediaVideo (1161:142) — a muted, looping clip on a surface/subtle panel,
 * with ScrimControl (1300:662) nested top-right. The frame's ScrimLabel
 * ("Muted", 1300:663) is deliberately not built — dropped by the user,
 * 2026-09-25.
 *
 * THE CONTROL'S VISIBILITY IS ASYMMETRIC, per ScrimControl's description:
 * while playing it is hover-only, revealed by hovering the PANEL rather than
 * the button; while paused it is pinned visible. The control that restores
 * motion is always discoverable. It is also revealed by keyboard focus, and
 * pinned on devices with no hover, neither of which the static frame can draw.
 *
 * PLAYBACK IS STARTED HERE, NOT BY `autoPlay`. The attribute would start the
 * clip before hydration and before reduced motion could be checked. Under
 * prefers-reduced-motion the clip stays on its poster with the play control
 * pinned. `playing` follows the element's own play/pause events, so a refused
 * autoplay also lands on the pinned play control rather than a lying pause.
 *
 * WCAG 2.2.2: the loop runs longer than five seconds, so a stop control is
 * required. That is why the control exists at all. */
export default function MediaVideo({ video }: { video: MediaVideoSource }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  /* A pause the reader chose. Scrolling the clip back into view never
     overrides it; only the control does. */
  const userPaused = useRef(false)

  /* PLAYS ONLY WHILE ON SCREEN. play() on mount fetched the whole clip with
     the page and kept it running a screen or more away. Now nothing past the
     poster loads (`preload="none"`) until the clip nears the viewport, and it
     pauses again when it leaves. That pause also flips the control to "Play",
     which is harmless: the control is off screen with it. */
  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) element.pause()
        else if (!userPaused.current) element.play().catch(() => {})
      },
      { rootMargin: '200px 0px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  function toggle() {
    const element = ref.current
    if (!element) return
    userPaused.current = !element.paused
    if (element.paused) element.play().catch(() => {})
    else element.pause()
  }

  return (
    <div className={styles.panel} data-playing={playing}>
      <video
        ref={ref}
        className={styles.video}
        width={video.width}
        height={video.height}
        poster={video.poster}
        muted
        loop
        playsInline
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={video.webm} type="video/webm" />
        <source src={video.mp4} type="video/mp4" />
      </video>

      <button
        type="button"
        className={styles.control}
        onClick={toggle}
        aria-label={playing ? 'Pause video' : 'Play video'}
      >
        {playing ? (
          <span className={styles.pause} aria-hidden="true">
            <span />
            <span />
          </span>
        ) : (
          <span className={styles.play} aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
