'use client'

import { useEffect, useState } from 'react'
import styles from './CollectionNav.module.css'

export type CollectionNavItem = {
  id: string
  label: string
}

/* The photos page's scroll-spy rail. Figma: collection-nav (879:2473) — a
 * single fixed component, not a variant set: the current/inactive look is a
 * manual per-instance text override there, so it is a prop here, not
 * something read off a component state.
 *
 * VISIBLE FROM 768 UP ONLY — decided 2026-09-15, matching the project's
 * "no mobile index for now" call. 640 does not get a smaller version of this;
 * it drops the rail entirely, same as 412. See CollectionNav.module.css.
 *
 * Mechanics ported from the retired build's SectionNav (git show
 * 08d3ea7:components/SectionNav.tsx), which served both photos-by-year there
 * and will serve project-detail's own section rail later — the logic doesn't
 * care what a label means. Recomputed from actual element positions rather
 * than trusted from IntersectionObserver entries, so the result doesn't
 * depend on which sections happened to cross the threshold on a given tick:
 * current = the last section whose top has already passed under the sticky
 * rail's own offset, or the first section if none has yet. */
export default function CollectionNav({
  items,
  label,
  className,
}: {
  items: CollectionNavItem[]
  label: string
  className?: string
}) {
  const [currentId, setCurrentId] = useState(items[0]?.id ?? '')

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null)

    if (sections.length === 0) return

    const railOffset =
      Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--nav-height',
        ),
      ) || 0

    const syncCurrent = () => {
      let current = sections[0]
      for (const section of sections) {
        if (section.getBoundingClientRect().top - railOffset <= 1) {
          current = section
        }
      }
      setCurrentId(current.id)
    }

    const observer = new IntersectionObserver(syncCurrent, {
      rootMargin: `-${railOffset}px 0px 0px 0px`,
      threshold: [0, 1],
    })
    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [items])

  return (
    <nav
      className={[styles.nav, className].filter(Boolean).join(' ')}
      aria-label={label}
    >
      <ul className={styles.list}>
        {items.map((item) => {
          const isCurrent = item.id === currentId
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={isCurrent ? styles.current : styles.item}
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
