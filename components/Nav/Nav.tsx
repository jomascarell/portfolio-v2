'use client'

import { type CSSProperties, type ReactNode, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RiHomeLine } from 'react-icons/ri'
import { getProject } from '@/lib/projects'
import { siteConfig } from '@/lib/site-config'
import styles from './Nav.module.css'

/* THE SITE NAV, MOUNTED ONCE. Figma: Nav (829:233), State = landing | projects
 * | about | photos | project-detail.
 *
 * REBUILT 2026-09-15 ONTO A SLOT MODEL, replacing the two-generation morph that
 * shipped earlier the same day. That version concatenated [...outgoing,
 * ...incoming] as siblings and gave every item a fresh React key on each
 * navigation. Reading calebwu.ca's own shipped nav chunk
 * (a72feb244e36bc09.js) showed the reference does something structurally
 * different, and four behaviours we wanted fall out of that difference rather
 * than being separately implementable:
 *
 *   1. A FIXED ARRAY OF SLOTS, paired old-to-new by index. Because a slot
 *      persists across the navigation, a slot whose content did not change
 *      can be DETECTED (same key both sides) and simply held still. The
 *      generation model could not express that — every node was new, so the
 *      breadcrumb's home group re-animated on every interior-to-interior
 *      move even though it never changes. That was the single biggest reason
 *      our morph read as busier than his.
 *   2. A VERTICAL ROLL, NOT A FADE. Each slot clips two stacked copies: the
 *      outgoing one rides up and out (0% -> -100%), the incoming one rides up
 *      into place from below (100% -> 0%), while the slot's own width
 *      transitions horizontally underneath them. The old build faded opacity
 *      instead, which is a different motion entirely.
 *   3. A NEGATIVE MARGIN CANCELS THE GAP. A slot that collapses to zero width
 *      still leaves the flex `gap` behind as dead space, so a collapsed slot
 *      also pulls `-1 * --nav-gap`. Without this the pill can never tighten
 *      fully — it was carrying 16px of nothing per removed item.
 *   4. ENABLE AND FLIP ARE SEPARATE TICKS. Transitions are switched on at
 *      80ms and the new widths are only committed at 130ms. The old build did
 *      both in one synchronous block, so the two style writes coalesced into a
 *      single recalc — the classic "transition fires from the wrong origin, or
 *      not at all" trap, and whether a given engine lets you get away with it
 *      is exactly the kind of thing that differs between Gecko and Blink. That
 *      is the most likely cause of the Firefox breakage reported against the
 *      old build; the container `overflow: hidden` added while diagnosing it
 *      was treating the symptom.
 *
 * MEASUREMENT IS CONTINUOUS, NOT ONE-SHOT. Every slot carries two absolutely
 * positioned, `visibility: hidden` copies of its own old and new content,
 * measured with scrollWidth. They are always in the DOM, so a width is always
 * available and the morph never depends on catching a transient layout at
 * exactly the right instant — which is what the old getBoundingClientRect call
 * at the moment of navigation was doing.
 *
 * WHAT WE DO THAT THE REFERENCE DOES NOT: widths are only written as inline
 * pixels once a measurement exists. Before that the slot is `width: auto` and
 * shrink-wraps its in-flow copy, so the server-rendered markup and the
 * pre-hydration paint are both correct. The reference ships `width: 0` until
 * its first rAF lands and accepts the flash; we have real SSR to protect. */

const SECTION_LABEL = {
  projects: 'Projects',
  about: 'About',
  photos: 'Photos',
} as const

type SectionState = keyof typeof SECTION_LABEL
export type NavState = 'landing' | SectionState | 'project-detail'

/* THE HOUSE IS react-icons, AT THE USER'S REQUEST (2026-09-15) — a deliberate
   exception to "react-icons is for brand marks only", because the user
   replaced Figma's placeholder home glyph with a specific icon and asked the
   code to follow from a library rather than a redrawn path. `RiHomeLine` is
   their own pick, an outline house rather than a match for Flaticon's filled
   original. The caret stays hand-drawn. */

function CaretIcon() {
  return (
    <svg className={styles.caret} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9.00001 15.3896V8.61043C8.99925 8.48989 9.03752 8.37186 9.10994 8.27141C9.18236 8.17095 9.28565 8.09262 9.40664 8.04639C9.52763 8.00017 9.66085 7.98815 9.78929 8.01186C9.91774 8.03557 10.0356 8.09394 10.1279 8.17953L13.8082 11.5721C13.931 11.6858 14 11.8397 14 12C14 12.1603 13.931 12.3142 13.8082 12.4279L10.1279 15.8205C10.0356 15.9061 9.91774 15.9644 9.78929 15.9881C9.66085 16.0119 9.52763 15.9998 9.40664 15.9536C9.28565 15.9074 9.18236 15.829 9.10994 15.7286C9.03752 15.6281 8.99925 15.5101 9.00001 15.3896Z" />
    </svg>
  )
}

type NavProps = {
  className?: string
} & (
  | { state: 'landing'; label?: never }
  | { state: SectionState; label?: string }
  | { state: 'project-detail'; label: string }
)

/* `key` is what makes a slot holdable: two items with the same key on both
   sides of a navigation are the same item, so the slot does not animate. The
   home group's key is a constant for exactly that reason — it is identical on
   every interior route and must never re-roll. The section label's key carries
   its text, so /projects -> /about does roll. */
type Item = { key: string; node: ReactNode }

function buildItems(state: NavState, label?: string): Item[] {
  if (state === 'landing') {
    return siteConfig.nav.map((item) => ({
      key: `link:${item.href}`,
      node: (
        <Link className={styles.landingLabel} href={item.href}>
          {item.label}
        </Link>
      ),
    }))
  }

  const current = label ?? SECTION_LABEL[state as SectionState]

  return [
    {
      key: 'home',
      node: (
        <span className={styles.crumb}>
          <Link className={styles.home} href="/">
            <RiHomeLine className={styles.houseIcon} aria-hidden="true" />
            <span>Joan</span>
          </Link>
          <CaretIcon />
        </span>
      ),
    },
    {
      key: `label:${current}`,
      node: (
        <span className={styles.current} aria-current="page">
          {current}
        </span>
      ),
    },
  ]
}

function modeFor(state: NavState) {
  return state === 'landing' ? 'landing' : 'interior'
}

function ariaLabelFor(state: NavState) {
  return state === 'landing' ? 'Main' : 'Breadcrumb'
}

/* Route -> Nav state. /projects/<slug> takes the project's own title, which
   lib/projects.ts answers synchronously: the catalogue is static and
   dynamicParams is false (Phase 2), so a bad slug 404s before Nav renders. */
function stateFromPathname(pathname: string): { state: NavState; label?: string } {
  if (pathname === '/projects') return { state: 'projects' }
  if (pathname === '/about') return { state: 'about' }
  if (pathname === '/photos') return { state: 'photos' }
  if (pathname.startsWith('/projects/')) {
    const slug = pathname.slice('/projects/'.length).split('/')[0]
    return { state: 'project-detail', label: getProject(slug)?.title ?? 'Project' }
  }
  return { state: 'landing' }
}

/* Straight off the reference's own staged timers. The 700ms duration, the
   100ms-per-slot stagger and cubic-bezier(0.62, 0.61, 0.02, 1) were already
   correct in the previous build — what was missing is that ENABLE and FLIP are
   two separate ticks 50ms apart, so the browser is guaranteed to have
   committed "transitions are on, widths are at their old values" before the
   new values arrive. COMMIT is FLIP + DURATION: the moment the first slot
   finishes. Later slots are still settling behind their stagger, but their
   content has already reached its final width by then, so swapping the
   outgoing copy out underneath them is invisible. */
const ENABLE_MS = 80
const FLIP_MS = 130
const STAGGER_MS = 100
const DURATION_MS = 700
const COMMIT_MS = FLIP_MS + DURATION_MS

type Pair = { old: Item | null; new: Item | null }
type Width = { old: number; new: number }

function pairSlots(previous: Item[], next: Item[]): Pair[] {
  const count = Math.max(previous.length, next.length)
  return Array.from({ length: count }, (_, index) => ({
    old: previous[index] ?? null,
    new: next[index] ?? null,
  }))
}

function isHeld(pair: Pair) {
  return !!pair.old && !!pair.new && pair.old.key === pair.new.key
}

/* The reference's own width table, kept in its shape rather than collapsed,
   because each row is a genuinely different case:
     held        -> whatever it already is; never animates
     both empty  -> 0
     appearing   -> 0 until the flip, then its measured width
     leaving     -> its measured width until the flip, then 0
     swapping    -> old width until the flip, then new width */
function widthFor(pair: Pair, measured: Width | undefined, flipped: boolean) {
  const width = measured ?? { old: 0, new: 0 }
  if (isHeld(pair)) return width.new || width.old
  if (!pair.old && !pair.new) return 0
  if (!pair.old) return flipped ? width.new : 0
  if (!pair.new) return flipped ? 0 : width.old
  return flipped ? width.new : width.old
}

/* The whole morph lives in one state object, including both item sets. It
   would be more natural to keep the outgoing set in a ref, but the outgoing
   set has to be captured in the same pass that notices the route changed, and
   reading or writing a ref during render is exactly what react-hooks/refs
   forbids — so the previous items are read back out of state instead. */
type Clones = Map<number, { old: HTMLElement | null; new: HTMLElement | null }>

/* Module-level rather than a useCallback: with the React Compiler on, a
   manually memoized closure over component state is rejected outright
   ("existing memoization could not be preserved"), and there is nothing here
   that needs to close over anything. */
function readWidths(clones: Clones, count: number): Width[] {
  return Array.from({ length: count }, (_, index) => {
    const refs = clones.get(index)
    return {
      old: refs?.old?.scrollWidth ?? 0,
      new: refs?.new?.scrollWidth ?? 0,
    }
  })
}

type Morph = {
  key: string
  items: Item[]
  outgoing: Item[]
  active: boolean
  enabled: boolean
  flipped: boolean
  everMorphed: boolean
}

export default function Nav({ className }: { className?: string }) {
  const pathname = usePathname()
  const { state, label } = stateFromPathname(pathname)
  const mode = modeFor(state)
  const items = buildItems(state, label)
  const routeKey = `${state}:${label ?? ''}`

  const cloneRefs = useRef(new Map<number, { old: HTMLElement | null; new: HTMLElement | null }>())

  const [morph, setMorph] = useState<Morph>(() => ({
    key: routeKey,
    items,
    outgoing: [],
    active: false,
    enabled: false,
    flipped: true,
    everMorphed: false,
  }))
  const [widths, setWidths] = useState<Width[]>([])
  const [measured, setMeasured] = useState(false)

  /* Adjusting state during render rather than in an effect, which is the
     sanctioned pattern for "derive from a prop that just changed": React
     re-runs the render immediately and never commits the in-between, so the
     outgoing set and the reset flags land in the SAME paint as the new route.
     Doing this in an effect would commit one frame showing both item sets at
     their natural widths — a visible double-width flash. */
  const changed = morph.key !== routeKey
  if (changed) {
    setMorph({
      key: routeKey,
      items,
      outgoing: morph.items,
      active: true,
      enabled: false,
      flipped: false,
      everMorphed: true,
    })
  }

  /* Read through locals rather than off `morph` directly, so the pass that
     schedules the update above still renders a coherent frame even though
     React discards it. */
  const outgoing = changed ? morph.items : morph.outgoing
  const active = changed ? true : morph.active
  const enabled = changed ? false : morph.enabled
  const flipped = changed ? false : morph.flipped
  const firstRoute = changed ? false : !morph.everMorphed

  /* At rest a slot is paired with itself, so every slot is "held" and simply
     sits at its measured width. Only during a morph does the pairing straddle
     two different item sets. */
  const pairs = active ? pairSlots(outgoing, items) : pairSlots(items, items)
  const slotCount = pairs.length

  /* Measured on every pairing change and again once Figtree has actually
     swapped in — measuring a label against the fallback metrics bakes in the
     wrong width, and at these sizes the difference is real pixels. Both reads
     are inside a frame callback rather than the effect body: the widths are
     only needed by the flip at 130ms, and a synchronous setState here would
     cascade a render for no gain.

     A SINGLE fonts.ready callback was not enough, confirmed against a real
     cold-cache load: Turbopack ships no metric-matched fallback for Figtree
     (layout.tsx's own note on that tradeoff — webpack gets one via
     `adjustFontFallback`, Turbopack does not), so the crumb's first
     measurement can land against `system-ui`'s width a frame or two before
     the swap actually paints, baking in a too-narrow clip that reads as the
     caret crowding "Joan". A page freshly cached (no swap in flight) never
     hit this. Rather than chase exactly why the fonts.ready-triggered
     remeasure did not always win that race, this adds a fixed-schedule
     safety net that does not depend on the Font Loading API's timing being
     trustworthy — it just bounds how long a wrong width can survive. Cheap
     even when it does nothing: remeasuring settled content just writes back
     the same widths. */
  useLayoutEffect(() => {
    const commit = () => {
      setWidths(readWidths(cloneRefs.current, slotCount))
      setMeasured(true)
    }
    const frames: number[] = []
    const schedule = () => frames.push(requestAnimationFrame(commit))

    schedule()
    document.fonts?.ready?.then(schedule)
    const safetyNet = [500, 1500].map((delay) => setTimeout(schedule, delay))

    return () => {
      frames.forEach(cancelAnimationFrame)
      safetyNet.forEach(clearTimeout)
    }
  }, [slotCount, morph.key, morph.active])

  useLayoutEffect(() => {
    if (!morph.active) return

    /* Under reduced motion the whole staged sequence collapses to "arrive".
       Still routed through a timer rather than called straight from the
       effect body, so this is a setState in a callback and not a cascading
       synchronous render. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const settle = setTimeout(
        () => setMorph((current) => ({ ...current, active: false, enabled: false, flipped: true })),
        0,
      )
      return () => clearTimeout(settle)
    }

    const enable = setTimeout(
      () => setMorph((current) => ({ ...current, enabled: true })),
      ENABLE_MS,
    )
    const flip = setTimeout(
      () => setMorph((current) => ({ ...current, flipped: true })),
      FLIP_MS,
    )
    const commit = setTimeout(
      () => setMorph((current) => ({ ...current, active: false, enabled: false })),
      COMMIT_MS,
    )

    return () => {
      clearTimeout(enable)
      clearTimeout(flip)
      clearTimeout(commit)
    }
  }, [morph.key, morph.active])

  return (
    <nav
      className={[styles.root, styles.fixed, className].filter(Boolean).join(' ')}
      aria-label={ariaLabelFor(state)}
      data-mode={mode}
    >
      <ol className={styles.pill} data-mode={mode}>
        {pairs.map((pair, index) => {
          /* A held slot is already showing its content, so it is "rolled"
             from the start and never plays the roll. */
          const rolled = isHeld(pair) || flipped
          const width = widthFor(pair, widths[index], flipped)
          const delay = enabled ? `${index * STAGGER_MS}ms` : '0ms'

          const style: CSSProperties = {
            transitionDelay: delay,
            ...(measured ? { width: `${width}px` } : null),
            /* Only between slots: a collapsed first slot has no preceding gap
               to cancel. */
            ...(measured && index > 0 && width === 0
              ? { marginLeft: 'calc(-1 * var(--nav-gap))' }
              : null),
          }

          return (
            <li
              key={index}
              className={[styles.slot, firstRoute ? styles.mountSlot : '']
                .filter(Boolean)
                .join(' ')}
              data-enabled={enabled ? '' : undefined}
              style={{ ...style, '--item-index': index } as CSSProperties}
            >
              <span
                className={styles.measure}
                aria-hidden="true"
                inert
                ref={(el) => {
                  const entry = cloneRefs.current.get(index) ?? { old: null, new: null }
                  entry.old = el
                  cloneRefs.current.set(index, entry)
                }}
              >
                {pair.old?.node}
              </span>
              <span
                className={styles.measure}
                aria-hidden="true"
                inert
                ref={(el) => {
                  const entry = cloneRefs.current.get(index) ?? { old: null, new: null }
                  entry.new = el
                  cloneRefs.current.set(index, entry)
                }}
              >
                {pair.new?.node}
              </span>

              {/* The outgoing copy rides up and out. inert as well as
                  aria-hidden because it contains real links — a screen reader
                  or a Tab press must never reach the route we just left. */}
              <span
                className={styles.rollerOut}
                aria-hidden="true"
                inert
                style={{
                  transitionDelay: delay,
                  transform: rolled ? 'translateY(-100%)' : 'translateY(0%)',
                }}
              >
                {pair.old?.node}
              </span>

              {/* The incoming copy is the one in flow, so the slot shrink-wraps
                  to it before any measurement exists. */}
              <span
                className={styles.rollerIn}
                style={{
                  transitionDelay: delay,
                  transform: rolled ? 'translateY(0%)' : 'translateY(100%)',
                }}
              >
                {pair.new?.node}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/* STATIC, NOT ROUTED — for /gallery only. The real Nav is a persistent
   singleton driven by the current route; a style guide legitimately wants six
   states side by side, which the routed component can never do. It shares
   buildItems so markup cannot drift, and renders one settled copy per slot
   with no measurement, no clones and no roll: a specimen is not being
   navigated away from. */
export function NavPreview({ state, label, className }: NavProps) {
  const items = buildItems(state, label)
  const mode = modeFor(state)

  return (
    <nav
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-label={ariaLabelFor(state)}
      data-mode={mode}
    >
      <ol className={styles.pill} data-mode={mode}>
        {items.map((item) => (
          <li key={item.key} className={styles.slot}>
            <span className={styles.rollerIn} style={{ transform: 'translateY(0%)' }}>
              {item.node}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  )
}
