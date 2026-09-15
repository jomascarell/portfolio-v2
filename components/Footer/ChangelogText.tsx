'use client'

import { useContext, useEffect, useRef, useState } from 'react'
import { RevealStateContext } from '@/components/FooterReveal/FooterReveal'
import { formatChangelogDate, latestChangelogEntry } from '@/lib/changelog'

/* calebwu.ca plays this exact line — "Changelog: March 01 2026" — through a
 * character-scramble reveal, timed to the same state that slides its panel
 * in. Read from its bundle (the extension was not connected; no live page),
 * chunk 2a750630a12536d6.js: every character starts at opacity 0 holding its
 * real value, then in turn — staggered 35ms by index — flips to opacity 1
 * showing a random glyph from A-Za-z0-9 for --duration-base (240ms, an exact
 * match), then locks to the real character. Ported verbatim: same charset,
 * same two numbers, same "always render the real character, animate opacity"
 * technique (so layout never reflows and no textContent is ever swapped for
 * a screen reader). The 35ms stagger has no token of its own — it is a
 * stepped rAF constant, not a CSS transition duration, so it stays a literal
 * here the way the deck's exponential-smoothing k=9 does.
 *
 * Fires on RevealStateContext rather than on mount or on scroll: our
 * FooterReveal state already IS the same kind of event calebwu.ca's own
 * reveal flag gates its panel transform on, so reusing it is the honest port
 * instead of inventing a second observer for the same moment.
 *
 * ONE DELIBERATE DEVIATION: calebwu.ca's default (pre-reveal) cell state is
 * all-invisible, because his panel is off-screen until revealed regardless —
 * the text being blank underneath costs nothing. Ours can be reached without
 * ever revealing (FooterReveal's `static` state keeps the footer in normal
 * flow, always visible, when the page doesn't fit its "secret bar" model), so
 * the resting state here is the finished text, fully opaque — the exact
 * FooterReveal precedent one file up applied to this one. */

const SCRAMBLE_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const STAGGER_MS = 35
const HOLD_MS = 240 // --duration-base

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
}

type Cell = { char: string; visible: boolean }

/* The resting appearance: real characters, fully opaque — identical to what
   the old plain <p> rendered. This is what SSR sends and what a no-JS visitor
   keeps forever, matching FooterReveal's own rule one component up ("an
   opacity: 0 ... would have made a JS failure invisible content"). The
   scramble is decoration this component adds on TOP of that baseline when it
   gets to run, never a replacement for it. */
function settledCells(text: string): Cell[] {
  return text.split('').map((char) => ({ char, visible: true }))
}

export default function ChangelogText({ className }: { className?: string }) {
  const latest = latestChangelogEntry()
  const text = latest
    ? `Changelog: ${formatChangelogDate(latest.date)}`
    : 'Changelog'

  const revealed = useContext(RevealStateContext) === 'revealed'
  const [cells, setCells] = useState(() => settledCells(text))
  const frameRef = useRef<number | null>(null)
  const scrambleRef = useRef<string[] | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)

    /* Not revealed: just drop the in-progress scramble refs so the next
       reveal starts clean. No setCells here — `cells` is already settled
       whenever nothing is mid-animation, so there is nothing to correct, and
       reaching for setState in an unconditional effect branch is exactly what
       react-hooks/set-state-in-effect calls out as the "you don't need an
       effect" shape. */
    if (!revealed) {
      scrambleRef.current = null
      startRef.current = null
      return
    }

    /* Unlike the transform/opacity transitions elsewhere, this is driven by
       rAF + setState, not CSS — the site-wide `transition-duration: 0.01ms`
       reduced-motion rule has nothing to attach to, so it is checked here
       directly. Reduced motion skips the animation: `cells` is already the
       finished string, so there is nothing to do but leave it alone. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    scrambleRef.current ??= text.split('').map(randomChar)
    startRef.current ??= performance.now()
    const scramble = scrambleRef.current
    const start = startRef.current
    const total = (text.length - 1) * STAGGER_MS + HOLD_MS

    const tick = (now: number) => {
      const elapsed = now - start
      setCells(
        text.split('').map((char, index) => {
          const delay = STAGGER_MS * index
          if (elapsed >= delay + HOLD_MS) return { char, visible: true }
          if (elapsed >= delay) return { char: scramble[index], visible: true }
          return { char, visible: false }
        }),
      )
      if (elapsed < total) frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [revealed, text])

  return (
    <p className={className} aria-label={text}>
      {cells.map(({ char, visible }, index) => (
        <span key={index} aria-hidden="true" style={{ opacity: visible ? 1 : 0 }}>
          {char}
        </span>
      ))}
    </p>
  )
}
