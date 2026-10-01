'use client'

import { useRef, useState } from 'react'
import type { SeverityBarsData } from './types'
import { useWidth } from './useWidth'
import styles from './Charts.module.css'

/* SeverityBars — horizontal bars on a fixed 0-max scale, one row in the
 * accent, a reference line at the mean. Built 2026-09-30 from the user's
 * reference chart (severity-bars.png), restyled onto the design tokens.
 *
 * Marks follow the dataviz spec: bars <= 24px thick (20 here), a 4px round
 * on the data end and square at the baseline, hairline solid gridlines, a
 * value at every bar tip. The reference draws the mean dashed; here it is a
 * solid hairline in text/secondary, since a dashed rule reads as noise.
 *
 * The highlight is the site accent (blue/500), not the reference's orange —
 * the same call as the component carousel. The rest are neutral/300: a
 * de-emphasis grey, 1.83:1 on white, which is why every bar carries its value
 * and a screen-reader table carries all of them.
 *
 * Laid out in real pixels off the measured width. From 520px up the labels
 * sit in a column left of the bars, as drawn; below it each label sits above
 * its bar, so a phone gets the full width for the bars. */

const WIDE = 520

export default function SeverityBars({ data }: { data: SeverityBarsData }) {
  const ref = useRef<HTMLDivElement>(null)
  const width = useWidth(ref, 640)
  const [hover, setHover] = useState<number | null>(null)

  const wide = width >= WIDE
  const top = 28 // room for the mean's label
  const bar = wide ? 20 : 16
  const row = wide ? 38 : 46
  const labelColumn = wide ? 188 : 0
  const x0 = labelColumn
  const x1 = width - (wide ? 16 : 8)
  const scale = (value: number) => x0 + ((x1 - x0) * value) / data.max
  const plotBottom = top + data.rows.length * row
  const height = plotBottom + 56 // ticks + axis title

  const ticks = Array.from({ length: data.max + 1 }, (_, index) => index)
  const barTop = (index: number) =>
    top + index * row + (wide ? (row - bar) / 2 : row - bar - 6)
  const format = (value: number) => (value === 0 ? '0' : value.toFixed(2))

  const hovered = hover === null ? null : data.rows[hover]

  return (
    <div ref={ref} className={styles.chart}>
      <svg
        className={styles.svg}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
        onPointerLeave={() => setHover(null)}
      >
        {/* Gridlines and ticks — hairline, solid, one step off the surface.
            The one at 0 is the baseline, a step darker. */}
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              className={tick === 0 ? styles.baseline : styles.grid}
              x1={scale(tick)}
              x2={scale(tick)}
              y1={top}
              y2={plotBottom}
            />
            <text
              className={styles.tick}
              x={scale(tick)}
              y={plotBottom + 20}
              textAnchor={tick === 0 && !wide ? 'start' : 'middle'}
            >
              {tick}
            </text>
          </g>
        ))}
        <text
          className={styles.axisLabel}
          x={(x0 + x1) / 2}
          y={plotBottom + 46}
          textAnchor="middle"
        >
          {data.axisLabel}
        </text>

        {/* Three passes, so the mean line sits over the bars but under
            every label: bars, then the mean, then the text and hit targets. */}
        {data.rows.map((entry, index) => {
          const length = scale(entry.value) - x0
          if (length <= 0) return null
          const y = barTop(index)
          const radius = Math.min(4, length / 2, bar / 2)
          return (
            <path
              key={entry.label}
              className={`${styles.row} ${
                entry.label === data.highlight ? styles.barAccent : styles.bar
              }`}
              data-dim={hover !== null && hover !== index ? '' : undefined}
              d={`M${x0},${y}h${length - radius}a${radius},${radius} 0 0 1 ${radius},${radius}v${bar - 2 * radius}a${radius},${radius} 0 0 1 -${radius},${radius}h-${length - radius}z`}
            />
          )
        })}

        {/* Wide: one line through the plot. Phone: a segment across each
            bar only, because there the labels sit on the line's path and it
            would run through their letters. */}
        {wide ? (
          <line
            className={styles.reference}
            x1={scale(data.mean)}
            x2={scale(data.mean)}
            y1={top - 6}
            y2={plotBottom}
          />
        ) : (
          data.rows.map((entry, index) => (
            <line
              key={entry.label}
              className={styles.reference}
              x1={scale(data.mean)}
              x2={scale(data.mean)}
              y1={barTop(index) - 3}
              y2={barTop(index) + bar + 3}
            />
          ))
        )}
        <text
          className={styles.referenceLabel}
          x={scale(data.mean) + 6}
          y={top - 12}
        >
          Mean {data.mean.toFixed(2)}
        </text>

        {data.rows.map((entry, index) => {
          const isHighlight = entry.label === data.highlight
          const y = barTop(index)
          const length = Math.max(0, scale(entry.value) - x0)
          return (
            <g
              key={entry.label}
              className={styles.row}
              data-dim={hover !== null && hover !== index ? '' : undefined}
              onPointerEnter={() => setHover(index)}
            >
              {/* The hit target is the whole row, not the painted bar. */}
              <rect
                className={styles.hit}
                x={0}
                y={top + index * row}
                width={width}
                height={row}
              />
              <text
                className={isHighlight ? styles.labelStrong : styles.label}
                x={wide ? x0 - 12 : 0}
                y={wide ? y + bar / 2 : y - 6}
                textAnchor={wide ? 'end' : 'start'}
                dominantBaseline={wide ? 'central' : 'auto'}
              >
                {entry.label}
              </text>
              <text
                className={isHighlight ? styles.valueStrong : styles.value}
                x={x0 + length + 8}
                y={y + bar / 2}
                dominantBaseline="central"
              >
                {format(entry.value)}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Tooltip below the bar's tip: value first, label second. It repeats
          what the tip label already says, so it only ever enhances. */}
      {hovered ? (
        <div
          className={`${styles.tooltip} ${styles.tooltipBelow}`}
          style={{
            left: Math.min(Math.max(scale(hovered.value), 96), width - 96),
            top: barTop(hover as number) + bar + 6,
          }}
          aria-hidden="true"
        >
          <strong>{format(hovered.value)}</strong>
          <span>{hovered.label}</span>
        </div>
      ) : null}

      {/* Clipped by a wrapper: a <table> ignores a 1px box and lays its
          rows out at full width anyway. */}
      <div className={styles.srOnly}>
        <table>
          <caption>{data.label}</caption>
          <thead>
            <tr>
              <th scope="col">Heuristic</th>
              <th scope="col">{data.axisLabel}</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((entry) => (
              <tr key={entry.label}>
                <th scope="row">{entry.label}</th>
                <td>{format(entry.value)}</td>
              </tr>
            ))}
            <tr>
              <th scope="row">Mean</th>
              <td>{data.mean.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
