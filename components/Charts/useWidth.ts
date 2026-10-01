'use client'

import { useEffect, useState, type RefObject } from 'react'

/* The chart's own rendered width, so the SVG is laid out in real pixels —
   text stays 12-14px at every width instead of scaling with a viewBox.
   `fallback` is what the server renders with; the viewBox scales that frame
   to the container until the observer reports the real width. */
export function useWidth(
  ref: RefObject<HTMLElement | null>,
  fallback: number,
): number {
  const [width, setWidth] = useState(fallback)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.round(entry.contentRect.width))
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])

  return width
}
