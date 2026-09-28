'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './CollectionNav.module.css'

export type CollectionNavItem = {
  id: string
  label: string
}

/* The scroll-spy rail. Serves TWO screens, which is why it takes a variant:
 *
 *   variant="collection"  /photos       Figma: collection-nav (879:2473)
 *   variant="section"     project-detail Figma: SectionNav (1152:2792)
 *
 * Both are a sticky in-page index whose current entry is computed from scroll
 * position, so the mechanics are shared and only the type and the breakpoint
 * differ. The project-detail rail was NOT built as a second component — its
 * Figma counterpart is composed of SectionNavItem instances, but the behaviour
 * is identical and a second copy of this logic would be a second place for the
 * scroll-spy to drift.
 *
 * The two differ in exactly three ways, all in CSS: collection appears at 768
 * and section at 1024; collection's type is body/base 16/26.2 and section's is
 * ui/nav-label 16/24 with 0.24px tracking; and collection's current entry
 * changes weight and line-height while section's changes COLOUR ONLY.
 *
 * THE COLOUR ASSIGNMENT IS INVERTED IN BOTH, ON PURPOSE: inactive entries are
 * color/text/accent and the CURRENT entry is color/text/primary. Both Figma
 * components document this as deliberate. It is not a slip to "fix".
 *
 * Current = the last section whose top has already passed under the rail's own
 * offset, or the first section if none has. Recomputed from element positions
 * rather than trusted from IntersectionObserver entries, so the result does not
 * depend on which sections happened to cross the threshold on a given tick. */
export default function CollectionNav({
  items,
  label,
  className,
  variant = 'collection',
}: {
  items: CollectionNavItem[]
  label: string
  className?: string
  variant?: 'collection' | 'section'
}) {
  const [currentId, setCurrentId] = useState(items[0]?.id ?? '')
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null)

    if (sections.length === 0) return

    /* THE OFFSET IS MEASURED OFF THE RAIL ITSELF, not read from a token.
       This used to read --nav-height (64) while the stylesheet stuck the rail
       at --nav-clearance-gap (180), so a section was marked current 116px
       before it reached the rail. Reading the token here would only move the
       bug: --nav-clearance-gap is a calc(), and getComputedStyle returns it
       unresolved on the custom property, so parseFloat yields NaN.

       Measuring the element cannot disagree with the CSS that positions it,
       whatever either side changes to later. */
    const railTop = () => navRef.current?.getBoundingClientRect().top ?? 0

    const syncCurrent = () => {
      const offset = railTop()
      let current = sections[0]
      for (const section of sections) {
        if (section.getBoundingClientRect().top - offset <= 1) {
          current = section
        }
      }
      setCurrentId(current.id)
    }

    syncCurrent()

    /* A 1px BAND ON THE RAIL'S TOP EDGE, threshold 0. Any section crossing the
       line toggles isIntersecting, however tall it is. The old root ran from
       the rail to the viewport bottom at thresholds [0, 1]: a section taller
       than that never reaches ratio 1, so its top passing the rail fired
       nothing, and the rail showed the previous entry through all of Design
       decisions and Findings (24 of 103 scroll steps wrong at 1448x900,
       measured 2026-09-28; 0 with the band). The band depends on the viewport
       height, so it is rebuilt on resize. */
    let observer: IntersectionObserver | undefined
    const observe = () => {
      observer?.disconnect()
      const top = Math.max(0, Math.round(railTop()))
      const bottom = Math.max(0, window.innerHeight - top - 1)
      observer = new IntersectionObserver(syncCurrent, {
        rootMargin: `-${top}px 0px -${bottom}px 0px`,
        threshold: 0,
      })
      sections.forEach((section) => observer?.observe(section))
      syncCurrent()
    }

    observe()
    window.addEventListener('resize', observe)

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', observe)
    }
  }, [items])

  return (
    <nav
      ref={navRef}
      className={[
        styles.nav,
        variant === 'section' ? styles.sectionVariant : null,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={label}
    >
      <ul className={styles.list}>
        {items.map((item) => {
          const isCurrent = item.id === currentId
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                /* COMPOSED, not swapped. Swapping the classes meant `.item`
                   carried the colour transition and `.current` carried none,
                   so the marker animated on the way out and snapped on the way
                   in. Composing gives both directions the same transition. */
                className={[styles.item, isCurrent ? styles.current : null]
                  .filter(Boolean)
                  .join(' ')}
                /* "location" rather than "page" or a bare boolean — every
                   entry links within the same page, so the ARIA value that
                   actually matches is the one for a same-page position. */
                aria-current={isCurrent ? 'location' : undefined}
              >
                {item.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
