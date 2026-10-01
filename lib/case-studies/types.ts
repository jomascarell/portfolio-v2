/* The case-study content model, shared by every case study.
 *
 * WHY A TYPED FILE AND NOT MDX. The rest of the site keeps content in typed
 * `lib/*.ts` records — photos, projects, about, changelog — and pages map over
 * them. A case study is longer but not different in kind, and the typed route
 * keeps the section list, the nav labels and the anchor ids derived from ONE
 * array instead of drifting between a document and a rail.
 *
 * THE BLOCK KINDS ARE DELIBERATELY FEW. Each one is everything some case
 * study's copy actually contains, and each renders as plain semantic HTML.
 * Adding a kind is cheap; a kind nothing uses is not.
 *
 * Split out of embassaments.ts on 2026-09-30, when Emotional UX became the
 * second case study and needed bold/italic runs, lists, a component
 * carousel, before -> after stats, an optional cover and rail entries that
 * differ from their sections. */

import type { StaticImageData } from 'next/image'
import type { ChartData } from '@/components/Charts/types'
import type { ComponentSlide } from '@/components/ComponentCarousel/ComponentCarousel'
import type { MediaVideoSource } from '@/components/MediaVideo/MediaVideo'

/* `phone` is a second drawing of the same figure for screens below 640,
   art-directed through <picture>, not a smaller copy. Diagrams need it: at
   412 the image is 284 wide against 779 at 1448, so no single label size
   reads at both (2026-10-01). Desktop frames 780 wide at @2x with 20px
   labels; phone frames 284 wide at @3x with 15px labels. */
export type CaseImage = {
  src: StaticImageData
  phone?: StaticImageData
  alt: string
}

/* Body copy with inline emphasis. A plain string is the common case; an array
   mixes plain runs with `{ b }` (bold) and `{ i }` (italic) ones, which is all
   the Emotional UX frames set inside a paragraph. */
export type RichText = string | (string | { b: string } | { i: string })[]

export type CaseBlock =
  | { kind: 'prose'; text: RichText }
  /* A real pull quote rather than grey body text — `blockquote`, not a styled
     paragraph. */
  | { kind: 'quote'; text: string }
  /* A slot, not an asset. `slot` is the copy doc's own placement instruction,
     kept so whoever fills it knows what belongs there; `caption` is real
     reader-facing copy where the doc supplies one.

     `image` fills the slot, in the cover's own MediaFigure frame. A static
     import, so the intrinsic size comes from the file and cannot drift from a
     typed number. `video` fills it with MediaVideo instead, and `dashboard`
     with LiveDashboard, the notebook's embed.
     With none of them, the slot renders as a placeholder. */
  | {
      kind: 'media'
      slot: string
      caption: string | null
      image?: CaseImage
      /* Marks a diagram on a transparent canvas: it sits on the page's white
         instead of the grey panel. Named for the padding it used to add,
         dropped 2026-10-01. */
      inset?: boolean
      video?: MediaVideoSource
      dashboard?: { embedUrl: string; title: string }
    }
  /* Two different components, not one table with a flag off. ReferenceTable
     has NO header row and sets its first column SemiBold; ChartComparisonTable
     has a header row in ui/label-strong and sets its first column Regular.
     Reading them as one shape is what produced a header row on the reference
     table that the design does not have. */
  | {
      kind: 'table'
      variant: 'reference' | 'chart'
      columns: [string, string] | null
      rows: [string, string][]
    }
  /* One slide per component of the system — ComponentCarousel. Replaced
     Emotional UX's three-column ChartSystem table on 2026-09-30. */
  | { kind: 'carousel'; label: string; slides: ComponentSlide[] }
  | { kind: 'list'; items: RichText[] }
  /* A chart drawn as SVG from the data here — SeverityBars or SlopeChart. */
  | { kind: 'chart'; chart: ChartData; caption?: string }
  /* `from` makes a card a before -> after pair ("72s -> 36s"); without it the
     card is a single figure. `caption` sits under the whole grid. */
  | {
      kind: 'stats'
      items: { value: string; from?: string; label: string }[]
      caption?: string
    }

export type CaseSection = {
  /* The anchor id, the nav target and the eyebrow all derive from one record.
     calebwu.ca lets its rail labels disagree with its anchor ids and ships a
     duplicate `id="research"`; deriving them here is what makes that
     impossible rather than merely unlikely. */
  id: string
  /* The eyebrow above the heading, and the rail entry unless `navLabel`
     says otherwise. */
  label: string
  /* The rail entry when it differs from the eyebrow. `null` keeps the section
     out of the rail entirely — Emotional UX's Test and Next are drawn that
     way. While such a section is on screen, the rail keeps the entry above it
     current. */
  navLabel?: string | null
  /* `callout` — rules above and below and 48px of padding, blue/200. The
     closing "What I'd change" block of Emotional UX. */
  tone?: 'callout'
  heading: string
  blocks: CaseBlock[]
}

export type CaseStudy = {
  slug: string
  /* Renders as the page's `h1`. In Figma this carries `heading/h2` (28px) —
     the style name encodes a document level it does not set, and the mapping
     is fixed in the page component rather than in the Figma file. */
  title: string
  standfirst: string
  /* The header link — a live site or a repository. `null` hides it, which is
     how a case study ships while its URL is still owed. */
  liveUrl: string | null
  liveLabel: string
  /* ProjectLogo's glyph. Decorative — the page renders it aria-hidden. */
  logo: string
  /* The hero, in the cover's MediaFigure frame — an image, or a looping clip
     through MediaVideo. Its alt (or the clip's label) says what it shows, not
     what the title already said. Optional: Emotional UX draws no cover and
     goes straight from the link to the meta row. */
  cover?: {
    slot: string
    caption: string | null
    image?: CaseImage
    video?: MediaVideoSource
  }
  meta: { label: string; value: string }[]
  sections: CaseSection[]
}

/* The intro is a nav target but not a section: it is the article header, and
   it carries the h1 rather than an h2 of its own. */
export const CASE_INTRO_ID = 'intro'
export const CASE_INTRO_LABEL = 'Intro'

/* The rail's entries, from the same array the page renders. SectionNav's
   description notes that a rail label does not have to equal the heading it
   points at — "what matters is that one source decides both" — and this is
   that source. The intro is the entry with no section of its own. */
export function caseNavItems(
  caseStudy: CaseStudy,
): { id: string; label: string }[] {
  return [
    { id: CASE_INTRO_ID, label: CASE_INTRO_LABEL },
    ...caseStudy.sections.flatMap((section) =>
      section.navLabel === null
        ? []
        : [{ id: section.id, label: section.navLabel ?? section.label }],
    ),
  ]
}
