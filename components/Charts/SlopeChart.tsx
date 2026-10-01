'use client'

import { useRef, useState } from 'react'
import type { SlopeChartData } from './types'
import { useWidth } from './useWidth'
import styles from './Charts.module.css'

/* SlopeChart — each series from a first to a second measurement, the mean
 * in the accent over them. Built 2026-09-30 from the user's thesis Figure 18
 * (order-effect.png), translated to English and restyled onto the tokens.
 *
 * Participants are neutral/400 lines with 8px end dots on a 2px surface
 * ring; the mean is blue/500. Labels are selective: each participant is
 * named once, at its first point, and the mean once, at its end, as
 * "Mean 71.25 → 95" — the reference's two separate mean labels collide with
 * P3's at 70 and with the three dots stacked at 95. Every value is in the
 * hover tooltip and in the screen-reader table.
 *
 * The y title sits above the axis rather than rotated beside it. */

export default function SlopeChart({ data }: { data: SlopeChartData }) {
  const ref = useRef<HTMLDivElement>(null)
  const width = useWidth(ref, 640)
  const [hover, setHover] = useState<number | null>(null)

  const narrow = width < 520
  const top = 36
  const plotHeight = narrow ? 260 : 320
  const plotBottom = top + plotHeight
  const height = plotBottom + 40
  const axisWidth = 32
  const xLeft = axisWidth + (narrow ? 56 : 88)
  const xRight = width - (narrow ? 96 : 160)
  const [low, high] = data.domain
  const y = (value: number) =>
    plotBottom - ((value - low) / (high - low)) * plotHeight

  const ticks: number[] = []
  for (let tick = low; tick <= high; tick += data.step) ticks.push(tick)

  const format = (value: number) =>
    Number.isInteger(value)
      ? String(value)
      : value.toFixed((value * 100) % 10 ? 2 : 1)
  const delta = (from: number, to: number) =>
    `${to - from >= 0 ? '+' : '−'}${format(Math.abs(to - from))}`

  const hovered = hover === null ? null : data.series[hover]

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
        <text className={styles.axisLabel} x={0} y={top - 20}>
          {data.axisLabel}
        </text>

        {ticks.map((tick) => (
          <g key={tick}>
            <line
              className={tick === low ? styles.baseline : styles.grid}
              x1={axisWidth}
              x2={width}
              y1={y(tick)}
              y2={y(tick)}
            />
            <text
              className={styles.tick}
              x={axisWidth - 8}
              y={y(tick)}
              textAnchor="end"
              dominantBaseline="central"
            >
              {tick}
            </text>
          </g>
        ))}

        {(narrow ? data.columnsShort : data.columns).map((column, index) => (
          <text
            key={column}
            className={styles.axisLabel}
            x={index === 0 ? xLeft : xRight}
            y={plotBottom + 26}
            textAnchor="middle"
          >
            {column}
          </text>
        ))}

        {data.series.map((series, index) => (
          <g
            key={series.label}
            className={styles.row}
            data-dim={hover !== null && hover !== index ? '' : undefined}
            data-active={hover === index ? '' : undefined}
            onPointerEnter={() => setHover(index)}
          >
            <line
              className={styles.slope}
              x1={xLeft}
              x2={xRight}
              y1={y(series.from)}
              y2={y(series.to)}
            />
            <circle
              className={styles.dot}
              cx={xLeft}
              cy={y(series.from)}
              r={4}
            />
            <circle
              className={styles.dot}
              cx={xRight}
              cy={y(series.to)}
              r={4}
            />
            <text
              className={styles.label}
              x={xLeft - 12}
              y={y(series.from)}
              textAnchor="end"
              dominantBaseline="central"
            >
              {series.label}
            </text>
            {/* A 14px-wide invisible stroke: the line is the hit target, not
                its 2px of paint. */}
            <line
              className={styles.hitLine}
              x1={xLeft}
              x2={xRight}
              y1={y(series.from)}
              y2={y(series.to)}
            />
          </g>
        ))}

        <g className={styles.meanGroup}>
          <line
            className={styles.slopeAccent}
            x1={xLeft}
            x2={xRight}
            y1={y(data.mean.from)}
            y2={y(data.mean.to)}
          />
          <circle
            className={styles.dotAccent}
            cx={xLeft}
            cy={y(data.mean.from)}
            r={5}
          />
          <circle
            className={styles.dotAccent}
            cx={xRight}
            cy={y(data.mean.to)}
            r={5}
          />
          {/* One line where there is room; below 520 "Mean" goes above the
              values so the label stays inside the chart. */}
          <text
            className={styles.valueStrong}
            x={xRight + 14}
            y={y(data.mean.to)}
            dominantBaseline="central"
          >
            {narrow ? (
              <>
                <tspan x={xRight + 14} dy="-0.6em">
                  Mean
                </tspan>
                <tspan x={xRight + 14} dy="1.2em">
                  {format(data.mean.from)} → {format(data.mean.to)}
                </tspan>
              </>
            ) : (
              `Mean ${format(data.mean.from)} → ${format(data.mean.to)}`
            )}
          </text>
        </g>
      </svg>

      {hovered ? (
        <div
          className={styles.tooltip}
          style={{
            left: Math.min(Math.max((xLeft + xRight) / 2, 96), width - 96),
            top: (y(hovered.from) + y(hovered.to)) / 2 - 10,
          }}
          aria-hidden="true"
        >
          <strong>
            {format(hovered.from)} → {format(hovered.to)} (
            {delta(hovered.from, hovered.to)})
          </strong>
          <span>
            {hovered.label} · {hovered.detail}
          </span>
        </div>
      ) : null}

      {/* Clipped by a wrapper: a <table> ignores a 1px box and lays its
          rows out at full width anyway. */}
      <div className={styles.srOnly}>
        <table>
          <caption>{data.label}</caption>
          <thead>
            <tr>
              <th scope="col">Participant</th>
              <th scope="col">{data.columns[0]}</th>
              <th scope="col">{data.columns[1]}</th>
            </tr>
          </thead>
          <tbody>
            {data.series.map((series) => (
              <tr key={series.label}>
                <th scope="row">
                  {series.label}, {series.detail}
                </th>
                <td>{format(series.from)}</td>
                <td>{format(series.to)}</td>
              </tr>
            ))}
            <tr>
              <th scope="row">Mean</th>
              <td>{format(data.mean.from)}</td>
              <td>{format(data.mean.to)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
