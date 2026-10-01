/* Chart data, kept in the case-study records like every other block. */

/* Horizontal bars on a fixed scale, one bar highlighted, with a reference
   line at the mean. Emotional UX's heuristic-severity chart. */
export type SeverityBarsData = {
  type: 'bars'
  /* The chart's accessible name, and the screen-reader table's caption. */
  label: string
  axisLabel: string
  max: number
  mean: number
  /* The row drawn in the accent. */
  highlight: string
  rows: { label: string; value: number }[]
}

/* A slope chart: each series from a first to a second measurement, plus the
   mean drawn in the accent. Emotional UX's order-effect chart. */
export type SlopeChartData = {
  type: 'slope'
  label: string
  axisLabel: string
  domain: [number, number]
  step: number
  columns: [string, string]
  /* The same, short enough to sit side by side below 520px. */
  columnsShort: [string, string]
  series: { label: string; detail: string; from: number; to: number }[]
  mean: { from: number; to: number }
}

export type ChartData = SeverityBarsData | SlopeChartData
