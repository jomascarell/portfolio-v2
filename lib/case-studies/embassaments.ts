/* Embassaments — the case study content.
 *
 * Source: `~/Downloads/embassaments-case-study-revised.md`, the revised copy
 * doc, transcribed 2026-09-23. The copy is authored prose and is reproduced
 * verbatim; where the doc speaks to us rather than to the reader (the
 * `[MEDIA: …]` markers, the parenthetical notes on how to set a quote) that
 * instruction became structure here, not text.
 *
 * WHY A TYPED FILE AND NOT MDX. The rest of the site keeps content in typed
 * `lib/*.ts` records — photos, projects, about, changelog — and pages map over
 * them. A case study is longer but not different in kind, and the typed route
 * keeps the section list, the nav labels and the anchor ids derived from ONE
 * array instead of drifting between a document and a rail. `SectionNav` will
 * read `sections` directly when it lands.
 *
 * THE BLOCK KINDS ARE DELIBERATELY FEW. `prose | quote | media | table |
 * stats` is everything the revised copy actually contains. Each one renders as
 * plain semantic HTML today; each one is the seam where a real component lands
 * later — `media` becomes MediaFigure/MediaVideo/LiveDashboard, `table`
 * becomes ReferenceTable and ChartComparisonTable, `stats` becomes
 * StatCardGrid. Adding a kind is cheap; a kind nothing uses is not.
 *
 * TWO CONTENT ITEMS ARE STILL OPEN, both from the copy doc itself:
 *
 * 1. "spring 2024" STAYS GENERIC, by the user's own decision — the thesis may
 *    pin an exact month and that check is deferred, not forgotten. See
 *    [[embassaments-predev-audit-progress]]. The figure must stay dated in
 *    some form: the dashboard is live, so today's numbers are different.
 *
 * The other warning in the copy doc — five charts or eight — is CLOSED. Five
 * is final, it is what Figma shipped, and the chart table below has five rows.
 */

import type { StaticImageData } from 'next/image'
import type { MediaVideoSource } from '@/components/MediaVideo/MediaVideo'
import coverImage from '@/public/case-studies/embassaments/cover.png'
import statusImage from '@/public/case-studies/embassaments/status.png'
import sketchImage from '@/public/case-studies/embassaments/process-sketch.png'

export type CaseImage = { src: StaticImageData; alt: string }

export type CaseBlock =
  | { kind: 'prose'; text: string }
  /* The copy doc marks exactly one of these and asks for it to be set as a
     real pull quote rather than grey body text. It is the best sentence in the
     document; it gets `blockquote`, not a styled paragraph. */
  | { kind: 'quote'; text: string }
  /* A slot, not an asset. `slot` is the copy doc's own placement instruction,
     kept so whoever fills it knows what belongs there; `caption` is real
     reader-facing copy where the doc supplies one. The cover deliberately has
     no caption — the doc calls it the hero.

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
  | { kind: 'stats'; items: { value: string; label: string }[] }

export type CaseSection = {
  /* The anchor id, the nav target and the eyebrow all derive from one record.
     calebwu.ca lets its rail labels disagree with its anchor ids and ships a
     duplicate `id="research"`; deriving them here is what makes that
     impossible rather than merely unlikely. */
  id: string
  /* Doubles as the SectionNav entry and the eyebrow above the heading. */
  label: string
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
  /* Read off DashboardLink (1144:611) in the Figma file, which carries the
     real href. The copy doc asked for the URL to be supplied at build time and
     warned that "embassaments-cat" reads like a slug — hence the separate
     label, which is what actually shows. */
  liveUrl: string | null
  liveLabel: string
  /* ProjectLogo's glyph. Decorative — the page renders it aria-hidden. */
  logo: string
  /* The hero. `image.alt` stays empty while the cover only restates the
     title; give it alt text if a cover ever shows something the copy doesn't. */
  cover: { slot: string; caption: string | null; image: CaseImage }
  meta: { label: string; value: string }[]
  sections: CaseSection[]
}

/* The intro is a nav target but not a section: it is the article header, and
   it carries the h1 rather than an h2 of its own. Eight nav entries, seven
   `sections` — the difference is this constant, not an off-by-one. */
export const CASE_INTRO_ID = 'intro'

export const embassaments: CaseStudy = {
  slug: 'embassaments',
  title: 'Catalonia was deep in drought, and I couldn’t get a straight answer.',
  standfirst:
    'So I built the tool I wished existed — a live, public dashboard tracking every internal-basin reservoir in Catalonia.',
  liveUrl: 'https://tfgdissenydigital.observablehq.cloud/embassaments-cat/',
  liveLabel: 'View the live dashboard',
  logo: '/case-studies/embassaments/icon-embassament.svg',
  cover: {
    slot: 'Cover image — full width, directly below the standfirst, above the metadata bar.',
    caption: null,
    image: { src: coverImage, alt: '' },
  },
  meta: [
    { label: 'Role', value: 'Research, design, and development — solo' },
    { label: 'Tools', value: 'D3.js · Observable Framework' },
    { label: 'Timeframe', value: '2024' },
    { label: 'Context', value: 'Bachelor’s thesis' },
  ],
  sections: [
    {
      id: 'problem',
      label: 'Problem',
      heading:
        'Checking a reservoir’s water level shouldn’t take four browser tabs',
      blocks: [
        {
          kind: 'prose',
          text: 'The ACA — Catalonia’s water agency — gives you one number and a shrug. To actually understand what’s happening — how a reservoir compares to last year, whether a storm moved the needle, which basins are quietly running dry — you had to dig through multiple agencies, cross-reference PDFs, and stitch it together yourself.',
        },
        {
          kind: 'quote',
          text: 'I’d been doing exactly that, out of my own concern about the drought. At some point I stopped treating it as a research problem and started treating it as a design problem: the data existed and was reliable, it just had no home.',
        },
      ],
    },
    {
      id: 'solution',
      label: 'Solution',
      heading: 'One dashboard, one number to hold onto',
      blocks: [
        {
          kind: 'prose',
          text: 'I built a live, publicly accessible dashboard covering all nine of Catalonia’s internal-basin reservoirs, refreshed daily from the region’s official open data API — over 20 years of history per site.',
        },
        {
          kind: 'prose',
          text: 'Everything anchors to one deliberately simple KPI: percentage of reservoir capacity filled. The audience for this had to be genuinely public — not water engineers, just anyone worried about the drought. That constraint shaped every decision downstream: no jargon, no assumed expertise, one number simple enough to hold in your head while everything else builds around it.',
        },
        {
          kind: 'media',
          slot: 'Current-status screenshot',
          caption:
            'The current-status view. Every reservoir reduced to one number: percentage of capacity filled.',
          image: {
            src: statusImage,
            alt: 'The current-status view: a map of Catalonia with each reservoir as a circle coloured by how full it is, beside a bar of total stored volume against capacity.',
          },
        },
        {
          kind: 'prose',
          text: 'The shipped product is a real, five-section app, not a single infographic: a home that frames the problem in plain language and explains how the water system works, a live current-status view, a historical search tool, a near-real-time monitor, and a seasonal-trends breakdown.',
        },
      ],
    },
    {
      id: 'research',
      label: 'Research',
      heading: 'Standing on a few shoulders before drawing a single chart',
      blocks: [
        {
          kind: 'prose',
          text: 'None of that was obvious at the start. Before drawing anything, I went looking for what already existed — not to copy it, but to understand it and find the actual gap.',
        },
        {
          kind: 'table',
          variant: 'reference',
          /* ReferenceTable draws no header row. The copy doc's column names
             are kept out of the render and live only as the `th` scope pair
             below, which is why this is null rather than a string pair. */
          columns: null,
          rows: [
            [
              'Card, Mackinlay & Shneiderman',
              'Their multivariate-analysis principle is why the bubble map encodes two variables at once (capacity and % filled) instead of one.',
            ],
            [
              'Edward Tufte',
              'His principles of comparison and integrated evidence shaped how the dashboard combines text, chart, and data into one readable narrative instead of a chart wall.',
            ],
            [
              'Nathan Yau',
              /* Frames quote the KPI name; the copy doc does not. Frames win. */
              'His emphasis on data accessible to non-experts is why the KPI is “percentage filled” in plain language, built for a general audience rather than water engineers.',
            ],
            [
              'Ed Hawkins — Warming Stripes',
              'Proof a single disciplined visual idea can carry public weight.',
            ],
            [
              'Climática',
              'Tracked the same reservoirs but reported the numbers without surfacing seasonal patterns or short-term shifts. The gap this project filled: tools that help people understand the situation, not just monitor it.',
            ],
          ],
        },
      ],
    },
    {
      id: 'design-decisions',
      label: 'Design decisions',
      heading: 'From sketches to five live visualizations',
      blocks: [
        {
          kind: 'prose',
          text: 'Sketches in Procreate → wireframes in Figma → build in D3.js, published through Observable Framework.',
        },
        {
          /* Was a three-up strip (sketch, wireframe, shipped chart); cut to the
             sketch alone by the user's decision, 2026-09-25. Its caption,
             "Same view, three stages.", described the strip, so it went with
             it — new copy is owed. */
          kind: 'media',
          slot: 'Procreate sketch',
          caption: null,
          image: {
            src: sketchImage,
            alt: 'Hand-drawn Procreate sketch planning the views: a capacity bar, each reservoir’s share of stored volume, a line chart over time, a column chart per reservoir, a heatmap and a bubble map.',
          },
        },
        {
          kind: 'prose',
          text: 'The first instinct was to mirror the ACA tool’s “drop” visual — reservoirs shown as filled circles. It was dropped: human perception of area isn’t linear, so a circle at 25% capacity can visually read as more or less full than it actually is.',
        },
        {
          kind: 'prose',
          text: 'A stacked bar chart replaced it — bar length maps directly to value, with no perceptual distortion — and it answers a sharper question: within the current total stored volume, what share does each reservoir hold.',
        },
        {
          kind: 'table',
          variant: 'chart',
          columns: ['Chart', 'Why'],
          rows: [
            [
              'Bubble map',
              'Shows geographic spread at a glance; encodes two variables at once',
            ],
            [
              'Stacked bar chart',
              'Makes part-to-whole obvious; easy to compare totals across basins',
            ],
            [
              'Column chart',
              'Best for comparing exact magnitudes; familiar, fast to scan',
            ],
            [
              'Line chart',
              'Shows trend and rate of change clearly; handles 20+ years of history well',
            ],
            [
              'Heatmap',
              'Reveals seasonal patterns instantly; scales well to many reservoirs at once',
            ],
          ],
        },
        {
          /* Muted and looping. The copy asked for a visible "muted" label
             (ScrimLabel in Figma); the user dropped it, 2026-09-25 — the clip
             has no audio track to hunt for. */
          kind: 'media',
          slot: 'Video loop, muted, looping — the search tool in use',
          caption:
            'The historical search tool. Twenty years of daily records, queried by reservoir and date range.',
          /* 12s, not the copy doc's ~6s — the user's call, 2026-09-25. WebM
             first (445 KB); the MP4 (1.3 MB) is for Safari. */
          video: {
            webm: '/case-studies/embassaments/search-tool-loop.webm',
            mp4: '/case-studies/embassaments/search-tool-loop.mp4',
            poster: '/case-studies/embassaments/search-tool-loop-poster.jpg',
            width: 1200,
            height: 676,
          },
        },
        {
          kind: 'prose',
          text: 'Choosing the charts was the easy half. Getting them all onto one page was where the project actually bent.',
        },
      ],
    },
    {
      id: 'trade-off',
      label: 'Trade-off',
      heading: 'The iframe trade-off',
      blocks: [
        {
          kind: 'prose',
          text: 'The “correct” path was rebuilding every chart natively inside Framework’s own structure — reorganizing the data, the code, and the inputs of each visualization from scratch, which demanded time and depth across several languages I didn’t have a strong base in.',
        },
        {
          kind: 'prose',
          text: 'Iframes let each notebook export directly instead, at a real cost: proprietary wrapper code with visible watermarks, and every iframe behaving as a closed module — so updating several on the same page means redoing the same work more than once.',
        },
        {
          kind: 'prose',
          text: 'What it bought back was time: the dashboard shipped and stayed live instead of stalling mid-migration.',
        },
      ],
    },
    {
      id: 'findings',
      label: 'Findings',
      heading: 'What the data found',
      blocks: [
        {
          kind: 'prose',
          text: 'In spring 2024, several reservoirs — including Sau, Susqueda and Darnius-Boadella — were running at under 30% of capacity, a clear warning sign at the time. Storage levels consistently peak between April and June each year.',
        },
        {
          kind: 'stats',
          items: [
            { value: '9', label: 'Reservoirs tracked daily' },
            { value: '20+', label: 'Years of history per site' },
            /* These three strings follow the FRAMES, not the copy doc, which
               writes "Spring 2024:", an en-dash "Apr–Jun" and "Seasonal peak".
               StatCardGrid's own description makes the label carry the date
               deliberately, so the frames are the considered version. */
            {
              value: '<30%',
              label: 'Spring 2024 — Sau, Susqueda, Darnius-Boadella',
            },
            { value: 'Apr-Jun', label: 'Seasonal peak window, every year' },
          ],
        },
        {
          /* The notebook's own embed, loaded with the page — see LiveDashboard
             for why an iframe, and why no click. The copy doc's caption,
             "Loaded on click — for the reasons two sections up.", went with
             the click. This one follows the other two captions' shape. */
          kind: 'media',
          slot: 'Live dashboard embed',
          caption:
            'The seasonal-trends view, live. Each reservoir’s monthly reserve level, where the April–June peak repeats every year.',
          dashboard: {
            /* Unpinned, so an edit to the published notebook (the English
               translation, for one) shows up here with no rebuild. It
               redirects to old.observablehq.com, where Observable now serves
               classic notebooks. */
            embedUrl:
              'https://observablehq.com/embed/@jmj11/tendencies-estacionals?cells=TendenciesEstacionals',
            title: 'Live dashboard: monthly reserve level of each reservoir',
          },
        },
      ],
    },
    {
      id: 'reflection',
      label: 'Reflection',
      heading: 'A “simple” idea can still demand a real engineering process.',
      blocks: [
        {
          kind: 'prose',
          text: 'I expected to make some static charts. I ended up owning research, information architecture, visual design, and a full JavaScript/D3.js build — alone — and had to keep re-scoping as the real complexity revealed itself.',
        },
        {
          kind: 'prose',
          text: 'Built for the thesis and never promoted beyond it, so there’s no traffic to report. But it’s still live, still refreshing daily, and anyone who wants to check a reservoir today can.',
        },
        {
          kind: 'prose',
          text: 'What I carried forward: the decisions that mattered most weren’t design decisions or engineering decisions. They were the places where the two collided — an area-based visual that looked better and read worse, a native rebuild that was correct and would never have shipped. Choosing well there takes both sides of the table, and that’s the work I want more of.',
        },
      ],
    },
  ],
}

/* Keyed by slug so the page can look one up, and so the three projects that
   have no case study yet resolve to `undefined` rather than to a half-empty
   record. They keep the stub until their copy exists. */
export const caseStudies: Record<string, CaseStudy> = {
  embassaments,
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies[slug]
}

/* The rail's eight entries, from the same array the page renders. SectionNav's
   description notes that a rail label does not have to equal the heading it
   points at — "what matters is that one source decides both" — and this is
   that source. The intro is the entry with no section of its own. */
export const CASE_INTRO_LABEL = 'Intro'

export function caseNavItems(
  caseStudy: CaseStudy,
): { id: string; label: string }[] {
  return [
    { id: CASE_INTRO_ID, label: CASE_INTRO_LABEL },
    ...caseStudy.sections.map((section) => ({
      id: section.id,
      label: section.label,
    })),
  ]
}
