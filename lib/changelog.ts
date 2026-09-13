export type ChangelogEntry = {
  version: string
  /** ISO date (YYYY-MM-DD). Parsed and formatted in UTC. */
  date: string
  summary: string
}

/* Ported from the retired build's lib/changelog.ts (git show 08d3ea7).
   That file's own comment said the point of keeping the full list, when the
   footer only ever shows the latest date, is so a /changelog page could exist
   later without redoing the data — no such page was built there either, and
   none exists here yet. Entries below are v2's real merges, not placeholder
   copy: dates are this repo's phase merge-commit dates, summaries describe
   what a visitor would notice, not the internal phase mechanics. */
export const changelog: ChangelogEntry[] = [
  {
    version: 'v1.2',
    date: '2026-09-11',
    summary: 'Added navigation, the project list and the about page.',
  },
  {
    version: 'v1.1',
    date: '2026-09-09',
    summary: 'Added the persistent footer.',
  },
  {
    version: 'v1.0',
    date: '2026-09-08',
    summary: 'First landing page.',
  },
]

/**
 * The most recent entry. Sorts by date rather than trusting array order, so
 * appending an entry anywhere in the list can't leave the footer showing a
 * stale one.
 */
export function latestChangelogEntry(): ChangelogEntry | undefined {
  return changelog.reduce<ChangelogEntry | undefined>(
    (latest, entry) =>
      latest === undefined || entry.date > latest.date ? entry : latest,
    undefined,
  )
}

/**
 * "2026-03-01" -> "March 01 2026". No comma, matching the design.
 *
 * The UTC timeZone is not optional: without it the date is constructed at
 * UTC midnight and formatted in the local zone, so any negative offset would
 * show the previous day.
 */
export function formatChangelogDate(isoDate: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  }).formatToParts(new Date(`${isoDate}T00:00:00Z`))

  const valueOf = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ''

  return `${valueOf('month')} ${valueOf('day')} ${valueOf('year')}`
}
