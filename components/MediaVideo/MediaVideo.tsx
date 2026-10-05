'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { BsPlay } from 'react-icons/bs'
import { HiOutlinePause } from 'react-icons/hi2'
import styles from './MediaVideo.module.css'

export type MediaVideoSource = {
  webm: string
  mp4: string
  poster: string
  width: number
  height: number
  /* What the clip shows, for a clip with no caption to say it — the cover.
     Set as the video's accessible name. */
  label?: string
  /* A short name for the play/pause button: "Pause the dashboard tour".
     Without it every clip's button was "Play video", and a page with two
     clips gave a screen reader two identical controls (2026-10-01 audit).
     Falls back to "video". */
  name?: string
  /* A 720-wide encode for screens below 640, where the clip draws 300-530
     CSS px wide (2026-10-01 audit: the covers cost phones the full desktop
     file). Listed first with a `media` query. A browser that ignores `media`
     on a video source (Chrome before 120) takes the first one it can play,
     so it gets the lighter file everywhere: a softer clip, never a broken
     one. */
  phone?: { webm: string; mp4: string }
  /* Seconds into the clip that the poster was taken from. The first play
     starts there (a `#t=` media fragment), so the poster hands over to the
     same frame; every loop after that starts at 0. Without it a poster from
     mid-clip cuts to frame 0 on play, which on the Emotional UX cover was
     drawer -> white -> store hero, read as a flash (2026-10-05). */
  start?: number
}

const PHONE_MEDIA = '(max-width: 639px)'

/* YouTube hides its controls about 3s after a tap; a 12-39s loop wants a
   little less. */
const AUTO_HIDE_MS = 2500

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
 * required. That is why the control exists at all.
 *
 * ON TOUCH SCREENS IT BEHAVES LIKE YOUTUBE'S (user, 2026-10-01). There is no
 * hover to reveal a corner pill, and the pill with its label was too big on
 * a phone. So below `(hover: none)` the control is a round icon-only button
 * in the exact centre of the clip, and taps drive it:
 * - a tap on the centre hits the button, which toggles play/pause even
 *   while it is invisible, and flashes it;
 * - a tap anywhere else on the clip shows the control, or hides it if shown;
 * - a tap outside the clip hides it;
 * - while playing it hides itself AUTO_HIDE_MS after the last tap.
 * While paused it stays visible, as above: a paused clip with no control
 * would read as a still image with no way to start it. */
export default function MediaVideo({ video }: { video: MediaVideoSource }) {
  const at = (src: string) => (video.start ? `${src}#t=${video.start}` : src)
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  /* False until the clip is playing AND has a decoded frame. Until then the
     video is transparent and the frame's own copy of the poster shows, see
     the render. `playing` alone is not enough: Firefox fires it at
     readyState 1, before any frame exists, and painted frame 0 (measured).
     Whichever of these events comes last flips it. */
  const [started, setStarted] = useState(false)
  const markStarted = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const element = event.currentTarget
    if (!element.paused && element.readyState >= element.HAVE_CURRENT_DATA) {
      setStarted(true)
    }
  }
  /* A pause the reader chose. Scrolling the clip back into view never
     overrides it; only the control does. */
  const userPaused = useRef(false)
  /* Touch only: whether the control is showing. On hover devices CSS alone
     decides, and this stays false. */
  const [shown, setShown] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const isTouch = () => window.matchMedia('(hover: none)').matches

  /* Show the control, and hide it again later unless the clip is paused.
     `willPlay` is passed by the button, since the element's own state has
     not flipped yet when it calls this. */
  const reveal = useCallback((willPlay: boolean) => {
    clearTimeout(hideTimer.current)
    setShown(true)
    if (willPlay) {
      hideTimer.current = setTimeout(() => setShown(false), AUTO_HIDE_MS)
    }
  }, [])

  /* A tap outside the clip hides the control. */
  useEffect(() => {
    if (!shown) return
    function onDown(event: PointerEvent) {
      if (!panelRef.current?.contains(event.target as Node)) setShown(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [shown])

  useEffect(() => () => clearTimeout(hideTimer.current), [])

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

  function toggle(event: React.MouseEvent) {
    /* The panel's own tap handler would otherwise hide what this shows. */
    event.stopPropagation()
    const element = ref.current
    if (!element) return
    const willPlay = element.paused
    userPaused.current = !willPlay
    if (willPlay) element.play().catch(() => {})
    else element.pause()
    if (isTouch()) reveal(willPlay)
  }

  /* Touch only: a tap on the clip, off the button, shows or hides the
     control. */
  function onPanelClick() {
    if (!isTouch()) return
    if (shown) {
      clearTimeout(hideTimer.current)
      setShown(false)
    } else {
      reveal(!ref.current?.paused)
    }
  }

  return (
    /* The panel's click only reveals the control on touch screens; it is not
       a control itself. Keyboard and screen-reader users have the real
       button, which is always in the tab order. */
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- touch-only reveal, see above
    <div
      ref={panelRef}
      className={styles.panel}
      data-playing={playing}
      data-shown={shown}
      onClick={onPanelClick}
    >
      {/* THE POSTER, TWICE. Between play() and the first frame at `start`,
          browsers paint what they like: Firefox drops the poster and shows
          the panel's grey, and both engines can show frame 0 for a frame
          before the `#t=` seek lands, which on the Emotional UX cover is pure
          white. So the video stays transparent until it is really playing,
          and this frame, the video's exact box, holds the same poster
          underneath (measured 2026-10-05). */}
      <div
        className={styles.frame}
        style={{ backgroundImage: `url(${video.poster})` }}
      >
        <video
          ref={ref}
          className={styles.video}
          data-started={started}
          width={video.width}
          height={video.height}
          poster={video.poster}
          aria-label={video.label}
          muted
          loop
          playsInline
          preload="none"
          onPlay={() => setPlaying(true)}
          onPlaying={markStarted}
          onLoadedData={markStarted}
          onCanPlay={markStarted}
          onPause={() => setPlaying(false)}
        >
          {video.phone ? (
            <>
              <source
                src={at(video.phone.webm)}
                type="video/webm"
                media={PHONE_MEDIA}
              />
              <source
                src={at(video.phone.mp4)}
                type="video/mp4"
                media={PHONE_MEDIA}
              />
            </>
          ) : null}
          <source src={at(video.webm)} type="video/webm" />
          <source src={at(video.mp4)} type="video/mp4" />
        </video>
      </div>

      <button
        type="button"
        className={styles.control}
        onClick={toggle}
        aria-label={`${playing ? 'Pause' : 'Play'} ${video.name ?? 'video'}`}
      >
        {/* Control (1399:1520): icon + label; icon only on touch screens,
            where the label is hidden by CSS. Default draws Play, Variant2
            Pause — the action the button will take, not the clip's state.
            Both icons are the react-icons the frame names, the same narrow
            exception Nav's home and caret use. The aria-label keeps "video"
            in the name and still contains the visible word (WCAG 2.5.3).
            The pause is Heroicons v2 (react-icons/hi2) — /hi is v1, whose
            HiOutlinePause is a circled glyph the frame does not draw. Its
            1.5 stroke on a 24 grid would be 1px at 16; the frame's is 0.75,
            so 1.125 here. */}
        {playing ? (
          <HiOutlinePause
            className={styles.icon}
            strokeWidth={1.125}
            aria-hidden="true"
          />
        ) : (
          <BsPlay className={styles.icon} aria-hidden="true" />
        )}
        <span className={styles.label}>{playing ? 'Pause' : 'Play'}</span>
      </button>
    </div>
  )
}
