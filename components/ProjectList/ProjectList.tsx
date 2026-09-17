'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import ProjectListRow from '@/components/ProjectListRow/ProjectListRow'
import { projects } from '@/lib/projects'
import styles from './ProjectList.module.css'

/* The list of projects on /projects. Figma: ProjectList, Breakpoint = base
 * (282:752) — one variant serving all six widths; nothing here is invented
 * for md/lg, the rows are fluid and the list is the same stack at every
 * width.
 *
 * THE STEPPING DECK IS BACK — REVERSING THE 2026-09-12 DECISION THAT RETIRED
 * IT, at the user's explicit request after reviewing it against the retired
 * build's actual carousel (~/dev/portfolio, components/MenuOverlay.tsx) and
 * confirming that mechanism, unabridged, is what was wanted, not an
 * approximation of it. What follows is a faithful port of that carousel's
 * behaviour — the infinite loop, the physics-eased one-gesture-one-project
 * stepping, wheel/touch/keyboard/focus handling, all of it — onto THIS
 * project's own row component (ProjectListRow) rather than the retired
 * build's bespoke card markup. Only the mechanism moved; a row's visual
 * design did not, and neither did its content (category/title/year).
 *
 * WHAT DID NOT COME WITH IT, DELIBERATELY. The retired build's list lived
 * inside a full-screen menu overlay, so disabling native scroll cost it
 * nothing — that overlay was never reachable without JS in the first place.
 * This list is real content on a real static route, reachable the instant
 * the HTML arrives, so the container stays a plain, natively-scrollable
 * list (ProjectList.module.css's default `.list` rule) until this component
 * mounts, and only then switches into the custom-driven mode via
 * `data-carousel="active"`. A visitor without JS, or whose JS fails, still
 * reaches every project by scrolling normally — nothing about the retired
 * build's own version had to consider that, because it never had to run
 * without JS to begin with.
 *
 * THE "CURRENT" ROW is ProjectListRow's own anticipated position indicator
 * (its header comment: "a current state... not built on a guess") — driven
 * here by scroll position instead of the pointer, matching the retired
 * build's `.isActive` exactly, including removing :hover as a separate
 * effect (see ProjectListRow.module.css) — the retired build's own comment
 * on that removal is the reason to keep it removed here, not just
 * precedent: a mouse resting on a project the scroll is carrying past would
 * fight the scroll-driven state for the same row.
 *
 * WHEEL AND TOUCH ARE PAGE-WIDE, NOT LIST-SCOPED — the retired build attaches
 * both to `.overlay`, its full-screen backdrop, not to `.projectList`
 * itself, so the whole visible menu drives the carousel, not just the
 * exact box the rows sit in. This is ported the same way, onto `window`
 * rather than the list: scrolling with the cursor anywhere on this page
 * steps the carousel, matching "I can scroll through the project list from
 * anywhere on the page" as reported against the real retired build.
 * Keyboard and focus stay list-scoped, because that IS the retired build's
 * own scope for those two (`list.addEventListener('keydown'/'focusin', ...)`
 * there too) — arrow keys only steer the carousel once focus has actually
 * landed inside it. */

const LOOP_COPIES = 7
const REAL_COPY = Math.floor(LOOP_COPIES / 2)
const REAL_START = projects.length * REAL_COPY

/* One wheel notch is ~100px in Chrome, ~120 in Firefox; 30 is low enough
   that the FIRST notch of any gesture already crosses it. */
const WHEEL_STEP_THRESHOLD = 30
/* No wheel events for this long and the gesture is considered over. Mouse
   notches arrive isolated (each one its own gesture, stepping instantly);
   a trackpad sends a continuous stream every 8-16ms. */
const WHEEL_GESTURE_GAP_MS = 100
/* One gesture advances ONE project. If it is still going after this long,
   the user has not let go and it advances again. */
const SUSTAINED_STEP_MS = 500
/* ...but only if it is genuinely still being pushed. Trackpad inertia decays
   well below a gesture's peak within a couple of tenths of a second, so
   requiring this fraction of the peak tells "still dragging" apart from
   "decelerating" without depending on event timing. */
const SUSTAINED_RATIO = 0.5
/* Minimum drag for a swipe to count as a step. Below this it is a tap, and
   the link underneath has to still receive its click. */
const SWIPE_STEP_THRESHOLD = 40
/* Exponential smoothing: value += (target - value) * (1 - e^(-k*dt)). No
   fixed duration, so re-triggering mid-ease does not cut anything off — it
   just moves the target and the same tween keeps running. k=9 settles in
   ~400ms. */
const EASE_K = 9

/* How far either side of the centred project the entrance reaches, in rows.

   FIXES THE BUG THE ORIGINAL SCOPING CREATED. The entrance used to be given
   to the real copy and withheld from every clone, on the reasoning that
   clones "mostly sit off-screen" and animating them is work nobody sees.
   That reasoning is right about 25 of the 28 and wrong about the ones that
   matter: the list opens CENTRED on items[REAL_START], so every row visible
   ABOVE the centred project is a clone by definition. They arrived fully
   formed while everything below them flew in — visible as a dead band at the
   top of the list.

   So the window is positional, not identity-based: a row animates if it is
   near the centre, whether or not it is a clone. One full set either side is
   ~830px of rows at the measured ~208px pitch, which clears the top and
   bottom of the list box at every breakpoint while leaving the far clones
   alone — the part of the original reasoning that was sound. */
const ENTRANCE_WINDOW = projects.length

type ProjectListProps = {
  className?: string
}

export default function ProjectList({ className }: ProjectListProps) {
  const listRef = useRef<HTMLUListElement>(null)
  const itemsRef = useRef<(HTMLLIElement | null)[]>([])
  /* Survives a resize (which re-measures everything) so the carousel does
     not snap back to the first project just because the window changed. */
  const indexRef = useRef(0)
  const [activePosition, setActivePosition] = useState(REAL_START)
  const [carouselActive, setCarouselActive] = useState(false)

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const setup = () => {
      const items = itemsRef.current.filter(
        (item): item is HTMLLIElement => item !== null,
      )
      if (items.length < projects.length * LOOP_COPIES) return undefined

      /* Always measured with every copy visible and the list in its normal
         layout — a previous setup may have hidden or centred it, and
         measuring against that would read a stale height or offset. */
      list.style.justifyContent = ''
      for (const item of items) item.style.display = ''

      const top = (el: Element) => el.getBoundingClientRect().top
      const centerOn = (anchor: HTMLElement) =>
        list.scrollTop +
        (top(anchor) - top(list)) -
        (list.clientHeight - anchor.getBoundingClientRect().height) / 2

      /* One full set's height, measured project-to-same-project across the
         seam to the next copy — which includes the seam's own gap, exactly
         the distance that has to move for the wraparound to be invisible. */
      const setHeight = top(items[projects.length]) - top(items[0])
      const pitch = setHeight / projects.length
      if (pitch <= 0) return undefined

      /* Wrapping means moving inside [-setHeight/2, +setHeight/2) around
         the starting point, so it needs half a set of real travel on each
         side. Checked against measured geometry rather than derived by
         hand, so it stays true regardless of copy count, gap or padding at
         any breakpoint. */
      let start = centerOn(items[REAL_START])
      const canLoop =
        start - setHeight / 2 >= 0 &&
        start + setHeight / 2 <= list.scrollHeight - list.clientHeight

      /* No room to loop: the clones are useless, so hide everything but the
         real copy and let the index stop at the ends instead of wrapping.
         Only centre the block when it does NOT overflow — with overflow,
         centring would put the first items out of reach. */
      if (!canLoop) {
        for (let i = 0; i < items.length; i += 1) {
          if (Math.floor(i / projects.length) !== REAL_COPY) {
            items[i].style.display = 'none'
          }
        }
        if (list.scrollHeight <= list.clientHeight) {
          list.style.justifyContent = 'center'
        }
        start = centerOn(items[REAL_START])
      }

      /* The content is periodic, so keeping the offset inside one set-width
         band is enough — crossing the edge jumps a whole set and nothing
         visibly changes, because what is painted there is identical. */
      const band = (value: number) => {
        if (!canLoop) return value
        const half = setHeight / 2
        return ((((value + half) % setHeight) + setHeight) % setHeight) - half
      }

      let index = indexRef.current
      let target = index * pitch
      let value = target
      let rafId = 0
      let lastTime = 0
      let lastActive = -1
      /* The last value written to scrollTop. Used to undo any scroll the
         browser makes on its own — a focused element scrolling into view is
         the only candidate left, since native scroll is otherwise off. */
      let expected = -1

      const paint = () => {
        const offset = band(value)
        const max = list.scrollHeight - list.clientHeight
        expected = Math.min(Math.max(start + offset, 0), max)
        list.scrollTop = expected

        /* Which copy is centred falls out of the offset itself, not from
           measuring every item — exact, and it never forces a layout
           recalculation on every frame. */
        const active = canLoop
          ? REAL_START + Math.round(offset / pitch)
          : REAL_START + index
        if (active === lastActive) return
        lastActive = active
        setActivePosition(active)
      }

      const tick = (now: number) => {
        /* Bounded dt: returning from a backgrounded tab delivers a first
           frame hundreds of ms late, and the tween would otherwise jump. */
        const dt = Math.min((now - lastTime) / 1000, 0.05)
        lastTime = now
        const diff = target - value
        if (Math.abs(diff) < 0.5) {
          value = target
          rafId = 0
          paint()
          return
        }
        value += diff * (1 - Math.exp(-EASE_K * dt))
        paint()
        rafId = requestAnimationFrame(tick)
      }

      const animate = () => {
        if (reduceMotion) {
          value = target
          paint()
          return
        }
        if (rafId) return
        lastTime = performance.now()
        rafId = requestAnimationFrame(tick)
      }

      const goTo = (next: number) => {
        index = canLoop ? next : Math.min(Math.max(next, 0), projects.length - 1)
        indexRef.current = index
        target = index * pitch
        animate()
      }

      const step = (direction: number) => goTo(index + direction)

      let accumulated = 0
      let lastWheelAt = 0
      let gestureStepped = false
      let gesturePeak = 0
      let steppedAt = 0

      /* The wheel moves the carousel no matter where inside it the pointer
         is. Nothing is left to native scroll — that was what used to
         advance ~100px against a pitch of ~208 and made a single notch
         take two or three tries.

         The rule is "one gesture, one project." With a mouse that is
         literal: each notch arrives isolated, opens its own gesture and
         steps instantly. A trackpad sends a burst of ~30 events per push —
         a few ramping up, the peak, then a long decaying tail — and all of
         that is ONE gesture: it steps once and falls quiet. If the burst is
         still alive past SUSTAINED_STEP_MS and still has force behind it
         (not just decaying inertia), the finger is still there and it steps
         again. */
      const onWheel = (event: WheelEvent) => {
        event.preventDefault()
        const now = performance.now()
        const unit =
          event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? list.clientHeight : 1
        const delta = event.deltaY * unit
        const size = Math.abs(delta)

        if (now - lastWheelAt > WHEEL_GESTURE_GAP_MS) {
          gestureStepped = false
          gesturePeak = 0
          accumulated = 0
        }
        lastWheelAt = now
        gesturePeak = Math.max(gesturePeak, size)

        if (gestureStepped) {
          /* Cleared on every event rather than left to grow — otherwise
             inertia would keep accumulating and release all at once once
             the window elapses. */
          accumulated = 0
          if (now - steppedAt < SUSTAINED_STEP_MS) return
          if (size < gesturePeak * SUSTAINED_RATIO) return
          gestureStepped = false
        }

        accumulated += delta
        if (Math.abs(accumulated) < WHEEL_STEP_THRESHOLD) return
        step(Math.sign(accumulated))
        accumulated = 0
        gestureStepped = true
        steppedAt = now
      }

      /* A swipe is a project, the same as a wheel notch. It steps the
         instant the threshold is crossed (not on release), so the response
         lands during the gesture, then ignores the rest of the drag until
         the next touchstart. */
      let touchStartY = 0
      let touchStepped = false
      const onTouchStart = (event: TouchEvent) => {
        touchStartY = event.touches[0].clientY
        touchStepped = false
      }
      const onTouchMove = (event: TouchEvent) => {
        event.preventDefault()
        if (touchStepped) return
        const delta = event.touches[0].clientY - touchStartY
        if (Math.abs(delta) < SWIPE_STEP_THRESHOLD) return
        /* Dragging downward brings the previous project, as in any list. */
        step(delta > 0 ? -1 : 1)
        touchStepped = true
      }

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowDown' || event.key === 'PageDown') {
          event.preventDefault()
          step(1)
        } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
          event.preventDefault()
          step(-1)
        }
      }

      /* Tabbing makes the browser scroll the focused link into view, which
         would desync the index from the position. Rather than fight it,
         this adopts its intent: the carousel goes to the focused project by
         the shortest path. */
      const onFocusIn = (event: FocusEvent) => {
        const li = (event.target as HTMLElement | null)?.closest<HTMLElement>(
          'li[data-position]',
        )
        if (!li?.dataset.position) return
        const position = Number(li.dataset.position)
        const wanted = position - REAL_START
        const current = ((index % projects.length) + projects.length) % projects.length
        let delta = wanted - current
        if (canLoop) {
          if (delta > projects.length / 2) delta -= projects.length
          else if (delta < -projects.length / 2) delta += projects.length
        }
        goTo(index + delta)
      }

      /* Safety net: if anything moves scrollTop on its own (the focus
         scroll-into-view is the only candidate left), this puts it back.
         Our own writes also fire this event, but then the difference is 0. */
      const onScroll = () => {
        if (expected >= 0 && Math.abs(list.scrollTop - expected) > 1) {
          list.scrollTop = expected
        }
      }

      paint()
      /* window, not list — see the header comment above for why wheel and
         touch have to be page-wide to match the retired build's own scope. */
      window.addEventListener('wheel', onWheel, { passive: false })
      window.addEventListener('touchstart', onTouchStart, { passive: true })
      window.addEventListener('touchmove', onTouchMove, { passive: false })
      list.addEventListener('keydown', onKeyDown)
      list.addEventListener('focusin', onFocusIn)
      list.addEventListener('scroll', onScroll, { passive: true })

      return () => {
        window.removeEventListener('wheel', onWheel)
        window.removeEventListener('touchstart', onTouchStart)
        window.removeEventListener('touchmove', onTouchMove)
        list.removeEventListener('keydown', onKeyDown)
        list.removeEventListener('focusin', onFocusIn)
        list.removeEventListener('scroll', onScroll)
        if (rafId) cancelAnimationFrame(rafId)
        list.style.justifyContent = ''
        for (const item of items) item.style.display = ''
      }
    }

    let teardown: (() => void) | undefined
    let cancelled = false

    /* Measured with fonts already loaded: at this list's sizes the metric
       difference between Figtree and its fallback is real pixels, and both
       the set height and "does the loop fit" would come out wrong. next/font
       loads Figtree on every page, so by the time this list mounts the
       promise is already settled in practice. */
    const run = () => {
      if (cancelled) return
      setCarouselActive(true)
      teardown = setup()
    }
    if (document.fonts) document.fonts.ready.then(run)
    else run()

    /* A resize changes both the set height and the container's, so the
       measurements need redoing from scratch. The active project survives
       because it lives in indexRef, not in component state that this
       teardown would otherwise reset. */
    let resizeTimer = 0
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        teardown?.()
        teardown = setup()
      }, 150)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelled = true
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      teardown?.()
    }
  }, [])

  return (
    <ul
      className={[styles.list, className].filter(Boolean).join(' ')}
      ref={listRef}
      data-carousel={carouselActive ? 'active' : undefined}
    >
      {Array.from({ length: LOOP_COPIES }, (_, copy) =>
        projects.map((project, index) => {
          const isClone = copy !== REAL_COPY
          const position = copy * projects.length + index
          /* Counted from the topmost animated row rather than from the
             project's index in its copy, so the stagger runs down the
             screen in the order the eye reads it. Using the project index
             here would make the clone directly above the centred row the
             LAST to arrive despite being the first one seen. */
          const entranceIndex = position - (REAL_START - ENTRANCE_WINDOW)
          const entering =
            entranceIndex >= 0 && entranceIndex <= ENTRANCE_WINDOW * 2
          return (
            <li
              key={`${copy}-${project.slug}`}
              data-position={position}
              aria-hidden={isClone || undefined}
              className={entering ? styles.entrance : undefined}
              style={
                entering
                  ? ({ '--row-index': entranceIndex } as CSSProperties)
                  : undefined
              }
              ref={(node) => {
                itemsRef.current[position] = node
              }}
            >
              <ProjectListRow
                project={project}
                state={position === activePosition ? 'current' : 'default'}
                tabIndex={isClone ? -1 : undefined}
              />
            </li>
          )
        }),
      )}
    </ul>
  )
}
