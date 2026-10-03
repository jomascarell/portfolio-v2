'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './NotFoundMark.module.css'

/* The 404, playable. Figma: NotFound (1553:2792) and its glyphs, the "404"
 * component (1553:2693), 2026-10-03.
 *
 * THE MOTION IS THE WORDMARK'S. Each glyph tilts in 3D on its own delay, with
 * the numbers Wordmark.module.css breathes at: rotateX = sin(t), rotateY =
 * 1.15 cos(t), a 5100ms period, each glyph 290ms behind the one before it,
 * under perspective(420px). The glyphs are drawn in the same face (Tilt Warp),
 * so the 404 reads as the mark's sibling.
 *
 * THE SLIDER IS THE PLAY. It sets the tilt amplitude, 0 (flat) to 40deg — the
 * cap the tuned prototype (claude.ai/artifact/2YA13R9fmdm5StRTJdb8Za) put
 * under Tilt Warp's own ±45, so a glyph never turns past readable. It starts
 * at 31deg, where the Figma knob sits (78% along the track in every variant).
 * This reading of the slider is ours, not written in the file: the design
 * draws a slider and no label for it.
 *
 * WHY requestAnimationFrame AND NOT THE WORDMARK'S KEYFRAMES. The amplitude
 * changes while the loop runs, and the Wordmark's notes record that driving
 * keyframes through an animated custom property does not work here. A frame
 * loop reads the slider's current value every frame instead. It is a client
 * island already, because of the slider, so this costs no extra boundary.
 *
 * REDUCED MOTION: no loop. The glyphs hold one pose (the loop's 12.5% stop,
 * where both axes lean) and the slider still sets how far, so the page stays
 * playable without anything moving by itself. */

const PERIOD = 5100
const LEAD = 290
const MAX_TILT = 40
const START_TILT = 31

/* Paths from the Figma component, in reading order, in its own
   207.68 x 90.624 box. */
const GLYPHS = [
  'M0 72.32C0 68.992 0 65.6213 0 62.208C0 58.7093 0 55.296 0 51.968C4.26667 43.6907 8.576 35.328 12.928 26.88C17.28 18.432 21.5467 10.0693 25.728 1.79199C31.1893 1.79199 36.6507 1.79199 42.112 1.79199C47.6587 1.79199 53.1627 1.79199 58.624 1.79199C58.624 10.0693 58.624 18.432 58.624 26.88C58.624 35.328 58.624 43.6907 58.624 51.968C60.5867 51.968 62.592 51.968 64.64 51.968C66.7733 51.968 68.8213 51.968 70.784 51.968C70.784 55.296 70.784 58.7093 70.784 62.208C70.784 65.6213 70.784 68.992 70.784 72.32C68.8213 72.32 66.7733 72.32 64.64 72.32C62.592 72.32 60.5867 72.32 58.624 72.32C58.624 75.0507 58.624 77.824 58.624 80.64C58.624 83.3707 58.624 86.1013 58.624 88.832C55.04 88.832 51.3707 88.832 47.616 88.832C43.9467 88.832 40.32 88.832 36.736 88.832C36.736 86.1013 36.736 83.3707 36.736 80.64C36.736 77.824 36.736 75.0507 36.736 72.32C30.6773 72.32 24.5333 72.32 18.304 72.32C12.16 72.32 6.05867 72.32 0 72.32ZM23.04 51.968C25.2587 51.968 27.52 51.968 29.824 51.968C32.2133 51.968 34.5173 51.968 36.736 51.968C36.736 47.1893 36.736 42.3253 36.736 37.376C36.736 32.4267 36.736 27.5627 36.736 22.784C34.5173 27.5627 32.2133 32.4267 29.824 37.376C27.52 42.3253 25.2587 47.1893 23.04 51.968Z',
  'M102.529 90.624C96.8968 90.624 91.7341 89.5147 87.0408 87.296C82.3474 84.992 78.2941 81.792 74.8808 77.696C71.5528 73.6 68.9501 68.7787 67.0728 63.232C65.2808 57.6853 64.3848 51.6693 64.3848 45.184C64.3848 38.6987 65.2808 32.7253 67.0728 27.264C68.9501 21.7173 71.5528 16.9387 74.8808 12.928C78.2941 8.832 82.3474 5.67466 87.0408 3.45599C91.7341 1.152 96.8968 0 102.529 0C108.161 0 113.281 1.152 117.889 3.45599C122.582 5.67466 126.635 8.832 130.049 12.928C133.462 16.9387 136.065 21.7173 137.857 27.264C139.734 32.7253 140.673 38.6987 140.673 45.184C140.673 51.6693 139.734 57.6853 137.857 63.232C136.065 68.7787 133.462 73.6 130.049 77.696C126.635 81.792 122.582 84.992 117.889 87.296C113.281 89.5147 108.161 90.624 102.529 90.624ZM102.529 69.504C105.942 69.504 108.801 68.5227 111.105 66.56C113.494 64.512 115.329 61.6533 116.609 57.984C117.889 54.3147 118.529 50.048 118.529 45.184C118.529 40.32 117.889 36.096 116.609 32.512C115.329 28.8427 113.494 26.0267 111.105 24.064C108.801 22.1013 105.942 21.12 102.529 21.12C99.2008 21.12 96.3421 22.1013 93.9528 24.064C91.5634 26.0267 89.7288 28.8 88.4488 32.384C87.1688 35.968 86.5288 40.2347 86.5288 45.184C86.5288 50.048 87.1688 54.3147 88.4488 57.984C89.7288 61.6533 91.5634 64.512 93.9528 66.56C96.3421 68.5227 99.2008 69.504 102.529 69.504Z',
  'M136.895 72.32C136.895 68.992 136.895 65.6213 136.895 62.208C136.895 58.7093 136.895 55.296 136.895 51.968C141.161 43.6907 145.471 35.328 149.823 26.88C154.175 18.432 158.441 10.0693 162.623 1.79199C168.084 1.79199 173.545 1.79199 179.007 1.79199C184.553 1.79199 190.057 1.79199 195.519 1.79199C195.519 10.0693 195.519 18.432 195.519 26.88C195.519 35.328 195.519 43.6907 195.519 51.968C197.481 51.968 199.487 51.968 201.535 51.968C203.668 51.968 205.716 51.968 207.679 51.968C207.679 55.296 207.679 58.7093 207.679 62.208C207.679 65.6213 207.679 68.992 207.679 72.32C205.716 72.32 203.668 72.32 201.535 72.32C199.487 72.32 197.481 72.32 195.519 72.32C195.519 75.0507 195.519 77.824 195.519 80.64C195.519 83.3707 195.519 86.1013 195.519 88.832C191.935 88.832 188.265 88.832 184.511 88.832C180.841 88.832 177.215 88.832 173.631 88.832C173.631 86.1013 173.631 83.3707 173.631 80.64C173.631 77.824 173.631 75.0507 173.631 72.32C167.572 72.32 161.428 72.32 155.199 72.32C149.055 72.32 142.953 72.32 136.895 72.32ZM159.935 51.968C162.153 51.968 164.415 51.968 166.719 51.968C169.108 51.968 171.412 51.968 173.631 51.968C173.631 47.1893 173.631 42.3253 173.631 37.376C173.631 32.4267 173.631 27.5627 173.631 22.784C171.412 27.5627 169.108 32.4267 166.719 37.376C164.415 42.3253 162.153 47.1893 159.935 51.968Z',
]

function pose(tilt: number, phase: number) {
  const rx = Math.sin(phase) * tilt
  const ry = Math.cos(phase) * tilt * 1.15
  return `perspective(420px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
}

export default function NotFoundMark({ tiltLabel }: { tiltLabel: string }) {
  const [tilt, setTilt] = useState(START_TILT)
  const tiltRef = useRef(tilt)
  const glyphRefs = useRef<(SVGPathElement | null)[]>([])

  useEffect(() => {
    tiltRef.current = tilt
  }, [tilt])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const still = () => {
      /* The loop's 12.5% stop: a quarter of the way round, both axes lean. */
      glyphRefs.current.forEach((glyph) => {
        if (glyph) glyph.style.transform = pose(tiltRef.current, Math.PI / 4)
      })
    }

    const tick = (now: number) => {
      glyphRefs.current.forEach((glyph, index) => {
        if (!glyph) return
        /* Reading order leads, as on the Wordmark: the first 4 is furthest
           ahead, so the wave travels left to right. */
        const lead = (GLYPHS.length - 1 - index) * LEAD
        const phase = (((now + lead) % PERIOD) / PERIOD) * Math.PI * 2
        glyph.style.transform = pose(tiltRef.current, phase)
      })
      frame = requestAnimationFrame(tick)
    }

    const start = () => {
      cancelAnimationFrame(frame)
      if (reduce.matches) still()
      else frame = requestAnimationFrame(tick)
    }

    start()
    reduce.addEventListener('change', start)
    return () => {
      cancelAnimationFrame(frame)
      reduce.removeEventListener('change', start)
    }
  }, [])

  /* Under reduced motion there is no loop to pick the new value up, so a
     slider move redraws the held pose itself. */
  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    glyphRefs.current.forEach((glyph) => {
      if (glyph) glyph.style.transform = pose(tilt, Math.PI / 4)
    })
  }, [tilt])

  return (
    <div className={styles.mark}>
      <input
        className={styles.slider}
        type="range"
        min={0}
        max={MAX_TILT}
        step={1}
        value={tilt}
        onChange={(event) => setTilt(Number(event.target.value))}
        aria-label={tiltLabel}
        aria-valuetext={`${tilt}°`}
      />
      <svg
        className={styles.glyphs}
        viewBox="0 0 207.68 90.624"
        role="img"
        aria-label="404"
        focusable="false"
      >
        {GLYPHS.map((d, index) => (
          <path
            key={index}
            d={d}
            ref={(node) => {
              glyphRefs.current[index] = node
            }}
          />
        ))}
      </svg>
    </div>
  )
}
