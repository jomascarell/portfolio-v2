'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './FooterReveal.module.css'

/* The footer reveal. Third and last of the client islands Phase 2 planned
 * (ProjectDeck, Wordmark, this one).
 *
 * Figma, Animations page, "Footer reveal" -> Proposed for this site: the footer
 * is hidden at translateY(100%) and animates to translateY(0) over
 * duration/reveal on ease/entrance "when the user reaches the end of the page",
 * and leaves the same way in reverse.
 *
 * WHAT WE DEVIATE FROM, AND WHY. The design says "fixed at the bottom", copied
 * from calebwu.ca where it is the only option: that site does not scroll at all
 * (scrollHeight === innerHeight, body overflow: clip), so a footer can only
 * arrive by being fixed and slid in over a page that never moves. Ours scroll —
 * the design's own opening line is "Our pages scroll, so the footer should not
 * be a secret". Once the page scrolls, the footer can live in normal flow at the
 * end of the document and reserve its own space, and then `fixed` buys nothing
 * while costing two things: it would either cover the last of the content, or
 * need a spacer of matching height kept in sync with the footer forever. The
 * reference can afford to cover content because its footer is, in its own words,
 * "a reward, not a navigation surface". Ours holds the mail link and the social
 * row, so covering content is the wrong trade. Decision taken with the user at
 * the Phase 5 gate; the motion is identical, only the positioning differs.
 *
 * THE LANDING IS EXEMPT, and this falls out rather than being special-cased.
 * The intro sequence lists the footer as step 6, "already present on
 * landing-footer — no reveal", and the two drawn screens agree: landing
 * (1448x608) and landing-footer (1448x780) hold identical, unmoved content and
 * differ only by the footer's 172px. So if the sentinel is already on screen the
 * first time we look, this page cannot hide its own footer — that is the landing
 * — and we disconnect and never touch it. No route list, no viewport maths, and
 * it stays right if a page's length changes.
 *
 * PROGRESSIVE ENHANCEMENT. The hidden state is applied by this component after
 * mount, never by default CSS. Without JavaScript, or if the observer throws,
 * the footer renders exactly as it did before this file existed: visible, in
 * flow, at the end of the document. An `opacity: 0` default would have made a
 * JS failure invisible content.
 *
 * WHY A SEPARATE SENTINEL rather than observing the footer itself: an
 * IntersectionObserver measures the *transformed* box. Watching the element we
 * also translate feeds the reveal back into its own trigger — hiding it moves it
 * out of view, which is the condition for keeping it hidden — and the boundary
 * flickers. The sentinel is never transformed, so the trigger is stable. */

type RevealState = 'static' | 'hidden' | 'revealed'

export default function FooterReveal({
  children,
}: {
  children: React.ReactNode
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<RevealState>('static')

  useEffect(() => {
    const root = rootRef.current
    const sentinel = sentinelRef.current
    if (!root || !sentinel) return

    /* Only the first callback decides whether this page reveals at all. Every
       later one just steers it. */
    let settled = false

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1]
        if (!entry) return

        if (!settled) {
          settled = true
          if (entry.isIntersecting) {
            observer.disconnect()
            return
          }
        }

        setState(entry.isIntersecting ? 'revealed' : 'hidden')
      },
      { threshold: 0 },
    )

    observer.observe(sentinel)

    /* "The footer stays in the DOM and in the tab order. Reaching it by keyboard
       reveals it. The animation is decoration on top." It is clipped rather than
       hidden, so it is always tabbable, and focusing a link inside it normally
       scrolls it into view — which moves the sentinel and would reveal it
       anyway. This covers the frame before that scroll lands, so a keyboard user
       never focuses something they cannot see.

       `focusin` rather than a React onFocus prop: it is the native bubbling
       focus event (plain `focus` does not bubble), so one listener on the
       wrapper catches focus landing on any link inside. It also keeps the
       wrapper a plain container in the markup — a handler on a div reads as an
       interactive element to jsx-a11y, and it would be right to say so. */
    const onFocusIn = () =>
      setState((current) => (current === 'hidden' ? 'revealed' : current))

    root.addEventListener('focusin', onFocusIn)

    return () => {
      observer.disconnect()
      root.removeEventListener('focusin', onFocusIn)
    }
  }, [])

  return (
    <div ref={rootRef} className={styles.reveal} data-state={state}>
      {/* Absolutely positioned so it costs no layout: a 1px element in flow
          would push the footer down by 1px. Not zero-height — a zero-area box
          is unreliable to observe. */}
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />
      <div className={styles.slide}>{children}</div>
    </div>
  )
}
