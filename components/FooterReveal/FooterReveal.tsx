'use client'

import { createContext, useEffect, useRef, useState } from 'react'
import { SKIP_TARGET_ID } from '@/components/SkipLink/SkipLink'
import styles from './FooterReveal.module.css'

/* The footer reveal. Third and last of the client islands Phase 2 planned
 * (ProjectDeck, Wordmark, this one).
 *
 * REWRITTEN 2026-09-11 against the reference's actual source rather than its
 * observed behaviour. What changed, and why it had to:
 *
 * Phase 5 built this as an IntersectionObserver on a sentinel — reveal the
 * footer when the user reaches the end of the page — from Figma's "Proposed for
 * this site", which also said the landing is exempt because "there the footer is
 * simply present and needs no reveal at all". Both halves turned out to be
 * wrong, and the file's own drawings are what say so: the Footer appears on 6 of
 * the 36 frames on the Design page and all 6 are landing-footer. It is drawn on
 * no interior screen at any width. So the footer is not an every-page element
 * revealed at the end of a scroll; it is the landing's, and landing-footer is
 * the landing with it OPEN.
 *
 * The consequence for this file is total. On a landing that is exactly one
 * screen there is no "end of the page" to reach — the sentinel was on screen at
 * first observation every time, which tripped the exemption branch and left the
 * footer permanently visible. The observer could not have worked here; it was
 * answering a question this page cannot ask. It is gone, and so is the sentinel
 * that existed only to feed it.
 *
 * WHAT THE REFERENCE ACTUALLY DOES. calebwu.ca binds one non-passive `wheel`
 * listener on window, calls preventDefault() unconditionally, and dispatches on
 * guards in this order: a modal swallows everything; an unfinished intro
 * swallows everything; if the footer is open, ANY wheel closes it but only after
 * a 900ms grace; then — if the cursor's clientX falls inside one of two empty
 * side gutters — deltaY > 0 opens it; otherwise the wheel steps the card deck.
 *
 * We take the mechanic and drop the gutter gate. That gate exists because his
 * centre column is a deck that owns the wheel, so the footer had to be given
 * somewhere else to live; ours has no deck on this route (it lands on /projects
 * in Phase 8) and the gate's only other effect is to make the footer
 * undiscoverable, which is the one property the design explicitly rejects in its
 * first line: "Our pages scroll, so the footer should not be a secret."
 *
 * The 900ms grace is kept verbatim. Without it the same gesture that opens the
 * bar closes it again on its own inertia — a trackpad flick delivers wheel
 * events for far longer than the 500ms the bar takes to arrive.
 *
 * WHY WE STILL DO NOT COPY `height: 10vh`. It is marked `observed` in the Figma
 * frame — read off the reference, not chosen for us. His bar holds one line of
 * copy and a reset button. Ours holds the mail link, a social row, a language
 * control, changelog and credits; 10vh of a 700px phone is 70px. The height
 * stays the footer's own content height.
 *
 * PROGRESSIVE ENHANCEMENT, UNCHANGED AND NOW LOAD-BEARING. `static` is the
 * server-rendered state and the stylesheet gives it no positioning at all, so
 * without JavaScript the footer is an ordinary block in flow at the end of the
 * landing — exactly what it was before this file existed. Only once this
 * component has taken over does the bar leave the flow and become the fixed
 * overlay the mechanic needs. An `opacity: 0` or a default `translateY(100%)`
 * would have made a JS failure invisible content.
 *
 * THE SCROLL GUARD is ours and the reference has no equivalent, because his
 * page is guaranteed one screen forever and ours is only incidentally one.
 * Taking the wheel with preventDefault() on a page that genuinely needs to
 * scroll traps the user. So every path asks one question first — does the
 * landing's own content overflow the fold? — and if it does, we hand the wheel
 * back and return the footer to flow, where scrolling reaches it normally. The
 * measurement is loop-free because it is always taken with the footer already
 * out of flow in the two active states, and with it in flow in `static`; both
 * are stable fixed points rather than a condition that flips itself. */

type RevealState = 'static' | 'hidden' | 'revealed'

/* Exposed so a descendant that is not this component's own children prop
   (e.g. a small client leaf rendered inside the server-rendered Footer) can
   read the same state without prop-threading through a Server Component.
   Default 'static' matches the pre-mount value below. */
export const RevealStateContext = createContext<RevealState>('static')

/* calebwu.ca's own value. Any wheel closes the bar, but not within this window
   of it opening. */
const CLOSE_GRACE_MS = 900

export default function FooterReveal({
  children,
}: {
  children: React.ReactNode
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<RevealState>('static')

  /* MOTION IS ARMED ONE FRAME AFTER THE FIRST STATE CHANGE, AND THAT IS NOT A
     refinement — without it the bar is wrong on every single page load.
     Mount takes the footer from `static` to `hidden`, and if the transition is
     live for that change the browser animates it: the footer is painted in
     place and then slides away over 500ms, so every visit opens with the thing
     the mechanic exists to keep hidden. Worse, the transition it starts can be
     left running at currentTime 0 — measured in Chrome 152, two CSSTransitions
     (transform and opacity) reported playState "running" and never advanced, so
     the computed value stayed pinned to the START of the transition: opacity 1,
     identity transform. A footer that never hides, from CSS that is correct.
     Forcing `transition: none` and re-applying the same state produced
     translateY(174.6px) and opacity 0 immediately, which is what proved the
     rules were never the problem.

     So the first hide is a jump, and only what happens afterwards is motion.
     See setOpen below for where this is turned on and why it is there rather
     than on a timer. */
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const doc = document.documentElement

    /* The whole guard, in one expression — and the subtraction is the whole
       reason it works.

       THE FIRST VERSION OF THIS WAS `doc.scrollHeight > doc.clientHeight`, AND
       IT WAS A RACE THAT ALWAYS RESOLVED THE SAME WRONG WAY. setState is not
       synchronous, so on mount the measurement ran while the footer was still
       in normal flow at the end of a landing that is already a full viewport
       tall. Its own height was therefore counted, the page "overflowed" by
       exactly the footer, the guard concluded this was a scrolling page and
       handed the wheel straight back — so the bar never left the flow and the
       landing shipped with a permanently visible footer. The guard was
       measuring the thing it was deciding about.

       Subtracting the footer's height whenever it is still in flow makes the
       question independent of which state we happen to be in when we ask it:
       does everything EXCEPT the footer overflow the fold? That has one answer
       at a given viewport, so there is nothing left to race. */
    const contentOverflows = () => {
      const inFlow = getComputedStyle(root).position !== 'fixed'
      const footerHeight = inFlow ? root.offsetHeight : 0
      return doc.scrollHeight - footerHeight > doc.clientHeight
    }

    /* Mirrored in refs, not read from state: the wheel listener is bound once
       and would otherwise close over the first render's values. */
    let isOpen = false
    let openedAt = 0

    const setOpen = (next: boolean) => {
      isOpen = next
      if (next) openedAt = performance.now()

      /* Arming happens HERE, on the first user-driven change, rather than on a
         timer after mount. Two reasons. It is deterministic — an earlier
         version armed inside a double requestAnimationFrame and the callback
         was measured never running in this environment, leaving the bar
         permanently snapping instead of sliding. And it is more honest about
         what the flag means: the mount jump is not motion and must never
         animate, every open and close is, and "the user did something" is
         exactly that line.

         Setting it in the same batch as the state change still animates: the
         spec resolves a transition against the AFTER-change style, so a
         transition that appears in the same commit as the property it governs
         is applied to that change rather than skipped. */
      setArmed(true)
      setState(next ? 'revealed' : 'hidden')
    }

    /* THE BAND. The bar's own measured height, published for the landing to
     * subtract from its budget.
     *
     * Measured rather than tokenised per breakpoint, because it is not a
     * function of width: 227 at 768 against Figma's md variant at 187, because
     * the intro copy rewraps. Any table of per-breakpoint constants would be
     * wrong the first time the footer's copy changed, and wrong silently.
     *
     * This is the same measurement the reserved-space version took; what
     * changed is what it is spent on. As bottom padding it pushed the landing's
     * content up by the height of a bar that is not there, which is the state
     * the page is in almost all the time. As a budget the content simply
     * re-centres in the room that actually exists, and nothing moves on reveal.
     *
     * No feedback loop: while the bar is fixed it contributes nothing to
     * document height, and the landing's budget only ever makes the page
     * shorter, so publishing this can never flip the guard that decides whether
     * to publish it. */
    const publishBand = (active: boolean) => {
      if (!active) {
        doc.style.removeProperty('--footer-band')
        return
      }
      doc.style.setProperty('--footer-band', `${Math.round(root.offsetHeight)}px`)
    }

    const sync = () => {
      if (contentOverflows()) {
        isOpen = false
        setState('static')
        /* In `static` the bar is back in normal flow and takes its own space
           the ordinary way, so there is no band to subtract. */
        publishBand(false)
      } else {
        if (!isOpen) setState('hidden')
        publishBand(true)
      }
    }

    /* The bar's height changes with its own content reflowing, not just with
       the viewport — so watching the element is the only way to keep the band
       honest. */
    const observer = new ResizeObserver(() => {
      if (getComputedStyle(root).position === 'fixed') publishBand(true)
    })
    observer.observe(root)

    /* Synchronous, and it can be: contentOverflows() no longer depends on
       whether the bar has already left the flow, so there is nothing to wait
       for. The frame of delay this used to take was what let the wrong answer
       through. */
    sync()

    const onWheel = (event: WheelEvent) => {
      if (contentOverflows()) {
        /* The wheel means scroll here. Do not preventDefault, and give the
           footer back to the document. */
        sync()
        return
      }

      event.preventDefault()

      if (isOpen) {
        if (performance.now() - openedAt > CLOSE_GRACE_MS) setOpen(false)
        return
      }

      if (event.deltaY > 0) setOpen(true)
    }

    /* `passive: false` or preventDefault() is ignored and logs a violation —
       Chrome treats wheel listeners as passive by default. */
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('resize', sync)

    /* "The footer stays in the DOM and in the tab order. Reaching it by
       keyboard reveals it. The animation is decoration on top." This is the
       only way in that is not a wheel, and it is the one place we are ahead of
       the reference — his footer has no keyboard path at all.

       `focusin` rather than a React onFocus prop: it is the native bubbling
       focus event (plain `focus` does not bubble), so one listener on the
       wrapper catches focus landing on any link inside. It also keeps the
       wrapper a plain container in the markup — a handler on a div reads as an
       interactive element to jsx-a11y, and it would be right to say so. */
    const onFocusIn = () => {
      if (!isOpen && !contentOverflows()) setOpen(true)
    }

    root.addEventListener('focusin', onFocusIn)

    /* LIGHT DISMISS. Until this existed the only way to close the bar was "any
       wheel after the grace", which is discoverable only by trying to scroll —
       and on touch there is no wheel, so there was no dismissal at all. The
       reference has neither; its footer is closed by the same wheel that opens
       everything else, and it has no touch path in or out.
       This is not a modal. Focus is never trapped, the page underneath stays
       live, and nothing is aria-hidden — light dismiss is the convention for a
       non-modal surface, which is exactly what a footer is. There is also no
       backdrop element: the reference has one, but it is pointer-events:none
       and purely visual, and adding a real one here would make the bar modal in
       behaviour while still not being modal in semantics. */
    const closeFromOutside = () => {
      if (!isOpen) return
      /* The same grace the wheel close uses, for the same reason: without it a
         click landing in the same moment as the reveal dismisses it instantly. */
      if (performance.now() - openedAt <= CLOSE_GRACE_MS) return

      /* Focus would otherwise be stranded on an off-screen element. Only when
         it is actually inside the bar — moving it otherwise would steal it from
         whatever the visitor was doing. */
      if (root.contains(document.activeElement)) {
        document.getElementById(SKIP_TARGET_ID)?.focus()
      }

      setOpen(false)
    }

    /* `pointerdown` covers mouse, pen and touch in one listener, and firing on
       press rather than on click means a drag that starts inside the bar and
       releases outside it does not count as an outside click — which is what
       would otherwise throw away a text selection. */
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && root.contains(event.target)) return
      closeFromOutside()
    }

    /* Escape is the keyboard's light dismiss, and without it this whole
       behaviour would be a dismissal only a pointer can reach — on a bar that
       holds the mail link and the social row. */
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeFromOutside()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      observer.disconnect()
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('resize', sync)
      root.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      doc.style.removeProperty('--footer-band')
    }
  }, [])

  /* ONE ELEMENT, NOT TWO. Phase 5 moved an inner `.slide` because the sentinel
     had to sit in an untransformed parent; the sentinel is gone and so is the
     reason. Measured in Chrome 152 before deciding: with the wrapper in place,
     `.reveal`, the <footer> and <main> all honoured a transform while the inner
     div ignored one set inline with !important — its rect stayed identical to
     the footer's at every value, including scale(). Whatever that is, the
     two-element version was the only thing carrying it, and one element does
     the same job with less to explain. */
  return (
    <div
      ref={rootRef}
      className={styles.reveal}
      data-state={state}
      data-armed={armed ? 'true' : undefined}
    >
      <RevealStateContext.Provider value={state}>
        {children}
      </RevealStateContext.Provider>
    </div>
  )
}
