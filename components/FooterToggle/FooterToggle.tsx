'use client'

import { useSyncExternalStore } from 'react'
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
 * landing's other branch. The stylesheet does the showing and hiding; this file
 * only needs the state for aria-expanded. */

const subscribe = (onChange: () => void) => {
  window.addEventListener(FOOTER_CHANGE_EVENT, onChange)
  return () => window.removeEventListener(FOOTER_CHANGE_EVENT, onChange)
}
const getState = () => document.documentElement.dataset.footer ?? null
const getServerState = () => null

export default function FooterToggle({ className }: { className?: string }) {
  const state = useSyncExternalStore(subscribe, getState, getServerState)

  return (
    <button
      type="button"
      className={[styles.toggle, className].filter(Boolean).join(' ')}
      data-footer-toggle=""
      aria-controls={FOOTER_ID}
      aria-expanded={state === 'revealed'}
      onClick={toggleFooter}
    >
      footer
    </button>
  )
}
