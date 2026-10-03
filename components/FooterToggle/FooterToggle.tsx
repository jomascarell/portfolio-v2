'use client'

import { useRef, useSyncExternalStore, type MouseEvent } from 'react'
import {
  FOOTER_CHANGE_EVENT,
  FOOTER_ID,
  toggleFooter,
} from '@/components/FooterReveal/FooterReveal'
import styles from './FooterToggle.module.css'

/* The footer button for touch devices. Figma: FooterDisplayButton (1088:6305)
 * in landing / button-footer for touch devices (1509:1957), added 2026-10-02.
 *
 * Touch has no wheel, so on a phone or tablet where the landing fits the screen
 * the hidden footer had no way in. This button is that way in, and it is the
 * whole touch mechanic: no swipe detection, which is the code it saves.
 *
 * It reads the bar's state from <html data-footer> (see FooterReveal) rather
 * than from props, because it sits in the intro card and the bar sits in the
 * landing's other branch. The stylesheet does the showing and hiding.
 *
 * WHAT A TAP DOES DEPENDS ON THE STATE (2026-10-03). `hidden`: opens the bar.
 * `static`: the landing is taller than the screen, so the footer is already in
 * flow at the end of the page, and the tap scrolls to it. That case is an
 * iPad Air in landscape with Safari's tab bar showing, where the button used
 * to vanish. `revealed`: the button is faded out and ignores taps (see the
 * stylesheet); a tap outside the bar closes it. */

const subscribe = (onChange: () => void) => {
  window.addEventListener(FOOTER_CHANGE_EVENT, onChange)
  return () => window.removeEventListener(FOOTER_CHANGE_EVENT, onChange)
}
const getState = () => document.documentElement.dataset.footer ?? null
const getServerState = () => null

function scrollToFooter() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document
    .getElementById(FOOTER_ID)
    ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'end' })
}

export default function FooterToggle({ className }: { className?: string }) {
  const state = useSyncExternalStore(subscribe, getState, getServerState)

  /* A tap where the faded button sits closes the bar on pointerdown, which
     makes the button tappable again before that same tap's click arrives —
     and the click would land on it and open the bar straight back. So a
     pointer click counts only if its press started on the button. Keyboard
     activation has no press (detail 0) and always counts. */
  const pressed = useRef(false)
  const onClick = (event: MouseEvent) => {
    const fromPress = pressed.current
    pressed.current = false
    if (event.detail !== 0 && !fromPress) return
    if (state === 'static') scrollToFooter()
    else toggleFooter()
  }

  return (
    <button
      type="button"
      className={[styles.toggle, className].filter(Boolean).join(' ')}
      data-footer-toggle=""
      aria-controls={FOOTER_ID}
      aria-expanded={state === 'static' ? undefined : state === 'revealed'}
      onPointerDown={() => {
        pressed.current = true
      }}
      onClick={onClick}
    >
      footer
    </button>
  )
}
