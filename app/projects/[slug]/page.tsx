import type { Metadata } from 'next'
import Image, { getImageProps } from 'next/image'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'
import { IoMdArrowUp } from 'react-icons/io'
import SeverityBars from '@/components/Charts/SeverityBars'
import SlopeChart from '@/components/Charts/SlopeChart'
import CollectionNav from '@/components/CollectionNav/CollectionNav'
import ComponentCarousel from '@/components/ComponentCarousel/ComponentCarousel'
import LiveDashboard from '@/components/LiveDashboard/LiveDashboard'
import MediaVideo from '@/components/MediaVideo/MediaVideo'
import {
  CASE_INTRO_ID,
  caseNavItems,
  getCaseStudy,
  type CaseBlock,
  type CaseImage,
  type CaseStudy,
  type RichText,
} from '@/lib/case-studies'
import { getProject, projects } from '@/lib/projects'
import styles from './page.module.css'

/* Project detail — the case-study template.
 *
 * Figma: `proj-embassaments` (1147:687), and `proj-emotional` (1402:1574) for
 * what the second case study added — rich text, lists, the component
 * carousel, before -> after stats and the callout section. Every value in
 * page.module.css was
 * read off the file, node by node, across ALL SIX breakpoint frames — 344,
 * 640, 768, 1024, 1280, 1448 — not sampled from the widest one. Anything not
 * from the file says so in the comment beside it.
 *
 * THE FILE'S STRUCTURE. `content` holds an `article-header` and then seven
 * sibling frames all named `goal`, one per section. Inside a `goal`: a
 * `<X> Container` (eyebrow + heading), a `<X> Explanation` (prose), then
 * component instances. Sections are 48px apart, everything inside one is 24px
 * apart, at every width.
 *
 * THE RAIL IS THE PHOTOS COMPONENT. CollectionNav gained a `section` variant
 * rather than project-detail gaining a second scroll-spy. Its Figma
 * counterpart (SectionNav 1152:2792) is a different component, but the
 * behaviour is identical and two copies would be two places to drift. Visible
 * from 1024 up, which is where the frames instance it; 768 and below carry no
 * rail, and nothing replaces it.
 *
 * HEADING LEVELS ARE SET HERE, NOT BY THE FIGMA STYLE NAMES. The page's own
 * top-level type is `heading/h2`, the eyebrow is `heading/h5`, the section
 * head is `heading/h3`. Mapping style name to tag would emit h2 -> h5 -> h3
 * and skip levels. The case title is the `h1`, section headings are `h2`, and
 * the eyebrow is a paragraph. This changes no pixel.
 *
 * dynamicParams = false: generateStaticParams enumerates every project, so a
 * slug outside that list is a 404 rather than an on-demand render. It keeps the
 * route fully static — and it is also incompatible with cacheComponents, which
 * is one more reason that flag stays off (Phase 2 decision). */

export const dynamicParams = false

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata(
  props: PageProps<'/projects/[slug]'>,
): Promise<Metadata> {
  const { slug } = await props.params
  const project = getProject(slug)

  return { title: `${project?.title ?? 'Project'} — Joan Mascarell` }
}

/* Plain runs render as text; `b` and `i` runs as <strong> and <em>, which is
   what the bold and italic in the frames mean rather than just how they look. */
function RichTextView({ text }: { text: RichText }) {
  if (typeof text === 'string') return text
  return text.map((run, index) =>
    typeof run === 'string' ? (
      <Fragment key={index}>{run}</Fragment>
    ) : 'b' in run ? (
      <strong key={index}>{run.b}</strong>
    ) : (
      <em key={index}>{run.i}</em>
    ),
  )
}

const MEDIA_SIZES = '(max-width: 1023px) calc(100vw - 112px), 830px'

/* A figure with a `phone` drawing renders as <picture>, the art-direction
   pattern from next/image's getImageProps docs. Each <source> carries its own
   file's width and height, so the box takes the right ratio at either width
   before the image arrives — the <img>'s attributes alone would hold the
   phone ratio at 1448 until load. */
function MediaImage({ image, className }: { image: CaseImage; className: string }) {
  if (!image.phone)
    return (
      <Image className={className} src={image.src} alt={image.alt} sizes={MEDIA_SIZES} />
    )
  const common = { alt: image.alt, sizes: MEDIA_SIZES }
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, src: image.src })
  const {
    props: { srcSet: phone, ...rest },
  } = getImageProps({ ...common, src: image.phone })
  return (
    <picture>
      <source
        media="(min-width: 640px)"
        srcSet={desktop}
        sizes={MEDIA_SIZES}
        width={image.src.width}
        height={image.src.height}
      />
      <source
        srcSet={phone}
        sizes={MEDIA_SIZES}
        width={image.phone.width}
        height={image.phone.height}
      />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt arrives in rest, from getImageProps */}
      <img {...rest} className={className} />
    </picture>
  )
}

function CaseBlockView({ block }: { block: CaseBlock }) {
  switch (block.kind) {
    case 'prose':
      return (
        <p className={styles.prose}>
          <RichTextView text={block.text} />
        </p>
      )

    /* Charts are figures: the SVG, then an optional caption. */
    case 'chart':
      return (
        <figure className={styles.figure}>
          {block.chart.type === 'bars' ? (
            <SeverityBars data={block.chart} />
          ) : (
            <SlopeChart data={block.chart} />
          )}
          {block.caption ? (
            <figcaption className={styles.caption}>{block.caption}</figcaption>
          ) : null}
        </figure>
      )

    case 'carousel':
      return <ComponentCarousel label={block.label} slides={block.slides} />

    /* The bulleted lists in Emotional UX's System, Test and Next. Body type,
       so it takes the same 1024 step and the same 640 measure as prose. */
    case 'list':
      return (
        <ul className={styles.list}>
          {block.items.map((item, index) => (
            <li key={index}>
              <RichTextView text={item} />
            </li>
          ))}
        </ul>
      )

    /* 1152:3587 — rule-bounded: 2px color/border/strong on the leading edge
       and 16px of padding, identical at every width. The text is body, so it
       steps 16/26.2 -> 18/30 at 1024 like all the other body copy. */
    case 'quote':
      return (
        <blockquote className={styles.quote}>
          <p>{block.text}</p>
        </blockquote>
      )

    /* An image sits in the cover's MediaFigure frame — 360 tall,
       object-contain on surface/subtle — so any aspect ratio fits one box. */
    case 'media':
      if (block.dashboard)
        return (
          <LiveDashboard
            embedUrl={block.dashboard.embedUrl}
            title={block.dashboard.title}
            caption={block.caption}
          />
        )
      return (
        <figure className={`${styles.figure} ${styles.media}`}>
          {block.image ? (
            <MediaImage
              image={block.image}
              className={
                block.inset
                  ? `${styles.mediaImage} ${styles.mediaInset}`
                  : styles.mediaImage
              }
            />
          ) : block.video ? (
            <MediaVideo video={block.video} />
          ) : (
            <div className={styles.mediaSlot} role="presentation">
              {block.slot}
            </div>
          )}
          {block.caption ? (
            <figcaption className={styles.caption}>{block.caption}</figcaption>
          ) : null}
        </figure>
      )

    /* BOTH TABLES ARE A DESCRIPTION LIST, NOT A <table>, and that is a
       deliberate reading of the design rather than a shortcut.
       Figma builds both as a GRID that collapses to ONE column below 640 —
       name on its own row, consequence beneath it. A <table> cannot do that
       without `display: block`, which strips the table semantics out of the
       accessibility tree at exactly the width where it matters most. Both are
       term-then-description pairs, so <dl> is both the honest markup and the
       one that reproduces the drawn layout at every width.

       ReferenceTable (1144:537) has NO header row and sets its term SemiBold.
       ChartComparisonTable (1144:566) has a header row in ui/label-strong from
       640 up and sets its term Regular. They are different components. */
    case 'table': {
      const isChart = block.variant === 'chart'
      return (
        <div className={isChart ? styles.chartTable : styles.referenceTable}>
          {block.columns ? (
            /* The pairs below are already self-describing to a screen reader,
               so the visible column headings are decorative here. */
            <div className={styles.tableHeader} aria-hidden="true">
              <span>{block.columns[0]}</span>
              <span>{block.columns[1]}</span>
            </div>
          ) : null}
          <dl
            className={styles.tableGrid}
            aria-label={
              isChart
                ? 'Charts, and why each one was chosen'
                : 'Sources, and what changed in the work because of each one'
            }
          >
            {block.rows.map(([name, consequence]) => (
              <Fragment key={name}>
                <dt className={styles.tableTerm}>{name}</dt>
                <dd className={styles.tableValue}>{consequence}</dd>
              </Fragment>
            ))}
          </dl>
        </div>
      )
    }

    /* StatCardGrid (1144:304). The figure is color/blue/950 — the only type on
       the page that leaves the neutral ramp. One column below 640, 2x2 to
       1279, four across from 1280. */
    /* A `from` value makes a before -> after pair (1417:1778): the old figure
       in blue/950 at 60%, the AiOutlineArrowRight glyph, then the new one.
       The arrow's alt is "to", so the pair reads "72s to 36s". The caption
       under the grid (1420:1828) is the shared figure caption. */
    case 'stats': {
      const grid = (
        <dl className={styles.stats}>
          {block.items.map((item) => (
            <div key={item.label} className={styles.stat}>
              <dt className={styles.statLabel}>{item.label}</dt>
              <dd className={styles.statValue}>
                {item.from ? (
                  <>
                    <span className={styles.statFrom}>{item.from}</span>
                    <img
                      className={styles.statArrow}
                      src="/case-studies/arrow.svg"
                      alt="to"
                      width={16}
                      height={16}
                    />
                  </>
                ) : null}
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      )
      if (!block.caption) return grid
      return (
        <figure className={styles.figure}>
          {grid}
          <figcaption className={styles.caption}>{block.caption}</figcaption>
        </figure>
      )
    }
  }
}

function CaseStudyArticle({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className={styles.article}>
      {/* SectionNav (1152:2792), built from the photos rail. Its entries come
          from one source, so a label can never drift from its anchor. */}
      <CollectionNav
        items={caseNavItems(caseStudy)}
        label="Sections"
        variant="section"
        className={styles.rail}
      />

      <article className={styles.content}>
        {/* article-header (1147:699). The intro is a nav target but not a
            section — it carries the h1, which is why the rail has one entry
            more than the sections it points at. */}
        <header id={CASE_INTRO_ID} className={styles.header}>
          {/* ProjectLogo (1144:676) — Size=default at every width, including
              344. Its description says it is decorative and must be
              aria-hidden rather than carry alt text repeating the heading. */}
          <div className={styles.logo} aria-hidden="true">
            <img src={caseStudy.logo} alt="" width={64} height={64} />
          </div>

          <div className={styles.headerRow}>
            <div className={styles.titleBlock}>
              <h1 className={styles.title}>{caseStudy.title}</h1>
              <p className={styles.standfirst}>{caseStudy.standfirst}</p>

              {/* DashboardLink (1144:611). The href is real and lives in the
                  file. The VISUAL treatment deliberately does NOT follow the
                  frame, on instruction: the frame draws a permanently
                  underlined link, and this project's established link UI —
                  MailLink, and both rails — is inherited colour, no underline,
                  accent on hover, with a 2px accent focus ring outside any
                  (hover: hover) query. That ring is what DashboardLink's own
                  description asks for anyway. */}
              {caseStudy.liveUrl ? (
                <a
                  className={styles.liveLink}
                  href={caseStudy.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {caseStudy.liveLabel}
                  <span className={styles.liveLinkArrow} aria-hidden="true">
                    <IoMdArrowUp />
                  </span>
                </a>
              ) : null}
            </div>

            {/* MediaFigure (1176:1164) — the cover, Caption=No. Emotional UX
                draws none. */}
            {caseStudy.cover ? (
              <figure className={styles.cover}>
                {caseStudy.cover.video ? (
                  <MediaVideo video={caseStudy.cover.video} />
                ) : caseStudy.cover.image ? (
                  <Image
                    src={caseStudy.cover.image.src}
                    alt={caseStudy.cover.image.alt}
                    sizes="(max-width: 1023px) calc(100vw - 112px), 939px"
                    priority
                  />
                ) : null}
              </figure>
            ) : null}

            {/* CaseMetaRow (1143:277). A fixed schema of four, not a repeater:
                stacked below 640, 2x2 to 1279, four across from 1280. */}
            <dl className={styles.meta}>
              {caseStudy.meta.map((entry) => (
                <div key={entry.label} className={styles.metaEntry}>
                  <dt className={styles.metaLabel}>{entry.label}</dt>
                  <dd className={styles.metaValue}>{entry.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        {caseStudy.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className={
              section.tone === 'callout'
                ? `${styles.section} ${styles.callout}`
                : styles.section
            }
            aria-labelledby={`${section.id}-heading`}
          >
            {/* `<X> Container` — eyebrow over heading, 8px apart. The eyebrow
                is hidden from the accessibility tree: the section is already
                named by its h2, and "Problem, Problem heading" is noise. */}
            <div className={styles.sectionHeader}>
              <p className={styles.eyebrow} aria-hidden="true">
                {section.label}
              </p>
              <h2
                id={`${section.id}-heading`}
                className={styles.sectionHeading}
              >
                {section.heading}
              </h2>
            </div>

            {section.blocks.map((block, index) => (
              <CaseBlockView key={index} block={block} />
            ))}
          </section>
        ))}
      </article>
    </div>
  )
}

export default async function ProjectDetailPage(
  props: PageProps<'/projects/[slug]'>,
) {
  // params is a Promise in Next 16 — it has to be awaited, not destructured.
  const { slug } = await props.params
  const project = getProject(slug)

  if (!project) notFound()

  const caseStudy = getCaseStudy(slug)

  /* Three of the four projects have no case-study copy yet, so they keep the
     stub rather than rendering an article of empty sections. */
  if (!caseStudy) {
    return <h1>{project.title}</h1>
  }

  return <CaseStudyArticle caseStudy={caseStudy} />
}
