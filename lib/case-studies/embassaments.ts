/* Embassaments — the case study content.
 *
 * Source: `~/Downloads/embassaments-case-study-revised.md`, the revised copy
 * doc, transcribed 2026-09-23. The copy is authored prose and is reproduced
 * verbatim; where the doc speaks to us rather than to the reader (the
 * `[MEDIA: …]` markers, the parenthetical notes on how to set a quote) that
 * instruction became structure here, not text.
 *
 * The content model lives in ./types.ts.
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

import statusImage from '@/public/case-studies/embassaments/status.png'
import sketchImage from '@/public/case-studies/embassaments/process-sketch.png'
import dashboardStill from '@/public/case-studies/embassaments/dashboard-still.png'
import acaDrop from '@/public/case-studies/embassaments/aca-drop.png'
import type { CaseStudy } from './types'

export const embassaments: CaseStudy = {
  slug: 'embassaments',
  title: 'Embassaments (Reservoirs)',
  standfirst:
    'Catalonia was deep in drought, and I couldn’t get a straight answer. So I built the tool I wished existed — a live, public dashboard tracking every internal-basin reservoir in the territory.',
  liveUrl: 'https://tfgdissenydigital.observablehq.cloud/embassaments-cat/',
  liveLabel: 'View the live dashboard',
  /* The project icon, the same file the project list uses (2026-10-01). Inset
     to a centred 48px box, 8px clear on every side like Emotional UX's
     arches; the Figma export ran edge to edge and read as cramped beside it. */
  logo: '/case-studies/embassaments/icon.svg',
  cover: {
    slot: 'Cover image — full width, directly below the standfirst, above the metadata bar.',
    caption: null,
    /* A 39s tour of the dashboard, replacing the still of its landing page
       on 2026-09-30. WebM first (VP9, 1.2 MB); the MP4 for Safari is
       re-encoded from the 2.7 MB source at x264 CRF 30, veryslow,
       faststart (0.96 MB) — small text stays legible. The poster is the
       first frame, which is that same landing page. Phones get 720-wide
       encodes of the same source (0.43 / 0.38 MB), 2026-10-01. */
    video: {
      webm: '/case-studies/embassaments/cover-loop.webm',
      mp4: '/case-studies/embassaments/cover-loop.mp4',
      phone: {
        webm: '/case-studies/embassaments/cover-loop-phone.webm',
        mp4: '/case-studies/embassaments/cover-loop-phone.mp4',
      },
      poster: '/case-studies/embassaments/cover-loop-poster.jpg',
      name: 'the dashboard tour',
      width: 1200,
      height: 676,
      label:
        'A tour of the dashboard: its landing page, headed “Estat dels Embassaments a Catalunya” — the state of Catalonia’s reservoirs — then the current-status, search, monitor and seasonal-trends views.',
    },
  },
  meta: [
    { label: 'Role', value: 'Research, design, and development — solo' },
    { label: 'Tools', value: 'D3.js · Observable Framework' },
    { label: 'Timeframe', value: 'Mar–Aug 2024' },
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
          text: 'Sketches in Procreate → build in D3.js, published through Observable Framework.',
        },
        {
          /* Was a three-up strip (sketch, wireframe, shipped chart); cut to the
             sketch alone by the user's decision, 2026-09-25. Its caption,
             "Same view, three stages.", described the strip, so it went with
             it; the sketch got its own caption on 2026-09-28. */
          kind: 'media',
          slot: 'Procreate sketch',
          caption: 'First bash of sketches.',
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
          /* The hiring review's "strongest decision has no picture" (audit
             2026-10-01), added 2026-10-06. The user's zoomed-in capture of
             the ACA page (ShareX brave_Sd7N3Hmknh.png, 2026-10-07, 530x441,
             already cropped to the drop and its labels; replaced a 1x crop
             upscaled 2x that read soft). Its white made transparent by
             colour-to-alpha against white (exact on white, so the glass and
             shadows survive) to sit in the grey frame. Shown alone: a before/after pair
             with the stacked bar was built and cut by the user, because the
             bar already appears in the current-status view and the cover. */
          kind: 'media',
          slot: 'The ACA drop the design moved away from',
          caption:
            'The ACA’s drop, the visual the first sketches mirrored. How full it looks depends on its area, which the eye doesn’t read linearly.',
          image: {
            src: acaDrop,
            alt: 'The Agència Catalana de l’Aigua’s drop: a glossy circle filled about three quarters with blue, labelled “Reserves totals 100%” at the top and “Reserves actuals conques internes 74.94%” beside the water line.',
          },
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
            phone: {
              webm: '/case-studies/embassaments/search-tool-loop-phone.webm',
              mp4: '/case-studies/embassaments/search-tool-loop-phone.mp4',
            },
            poster: '/case-studies/embassaments/search-tool-loop-poster.jpg',
            name: 'the search tool clip',
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
          text: 'The “correct” path was rebuilding every chart natively inside Framework’s own structure — reorganizing the data, the code, and the inputs of each visualization from scratch, which demanded time and depth across several languages I was still learning.',
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
      label: 'The data',
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
            'Live. Each reservoir’s monthly reserve level, where the April–June peak repeats every year.',
          dashboard: {
            /* Unpinned, so an edit to the published notebook (the English
               translation, for one) shows up here with no rebuild. It
               redirects to old.observablehq.com, where Observable now serves
               classic notebooks. */
            embedUrl:
              'https://observablehq.com/embed/@jmj11/tendencies-estacionals?cells=TendenciesEstacionals',
            title: 'Live dashboard: monthly reserve level of each reservoir',
            /* Captured from the embed above at its 640px minimum, 2x, on
               2026-10-01. It is a snapshot: the live view keeps changing. */
            still: {
              src: dashboardStill,
              alt: 'The seasonal-trends heatmap: nine reservoirs by month, January to December, coloured by reserve level from 0 to 100%. Foix stays near full all year; Riudecanyes runs lowest in September and October; most reservoirs are fullest between April and June.',
            },
            href: 'https://tfgdissenydigital.observablehq.cloud/embassaments-cat/',
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
