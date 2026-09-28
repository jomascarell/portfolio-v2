import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'
import CollectionNav from '@/components/CollectionNav/CollectionNav'
import LiveDashboard from '@/components/LiveDashboard/LiveDashboard'
import MediaVideo from '@/components/MediaVideo/MediaVideo'
import {
  CASE_INTRO_ID,
  caseNavItems,
  getCaseStudy,
  type CaseBlock,
  type CaseStudy,
} from '@/lib/case-studies/embassaments'
import { getProject, projects } from '@/lib/projects'
import styles from './page.module.css'

/* Project detail — the case-study template.
 *
 * Figma: `proj-embassaments` (1147:687). Every value in page.module.css was
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

function CaseBlockView({ block }: { block: CaseBlock }) {
  switch (block.kind) {
    case 'prose':
      return <p className={styles.prose}>{block.text}</p>

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
            className={styles.figure}
            embedUrl={block.dashboard.embedUrl}
            title={block.dashboard.title}
            caption={block.caption}
          />
        )
      return (
        <figure className={styles.figure}>
          {block.image ? (
            <Image
              className={styles.mediaImage}
              src={block.image.src}
              alt={block.image.alt}
              sizes="(max-width: 1023px) calc(100vw - 112px), 1108px"
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
    case 'stats':
      return (
        <dl className={styles.stats}>
          {block.items.map((item) => (
            <div key={item.label} className={styles.stat}>
              <dt className={styles.statLabel}>{item.label}</dt>
              <dd className={styles.statValue}>{item.value}</dd>
            </div>
          ))}
        </dl>
      )
  }
}

function CaseStudyArticle({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className={styles.article}>
      {/* SectionNav (1152:2792), built from the photos rail. Eight entries
          from one source, so a label can never drift from its anchor. */}
      <CollectionNav
        items={caseNavItems(caseStudy)}
        label="Sections"
        variant="section"
        className={styles.rail}
      />

      <article className={styles.content}>
        {/* article-header (1147:699). The intro is a nav target but not a
            section — it carries the h1, which is why there are eight nav
            entries and seven sections. */}
        <header id={CASE_INTRO_ID} className={styles.header}>
          {/* ProjectLogo (1144:676) — Size=default at every width, including
              344. Its description says it is decorative and must be
              aria-hidden rather than carry alt text repeating the heading. */}
          <div className={styles.logo} aria-hidden="true">
            <img
              src={caseStudy.logo}
              alt=""
              width={64}
              height={64}
            />
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
                    <img
                      src="/case-studies/arrow-small-up.svg"
                      alt=""
                      width={16}
                      height={16}
                    />
                  </span>
                </a>
              ) : null}
            </div>

            {/* MediaFigure (1176:1164) — the cover, Caption=No. */}
            <figure className={styles.cover}>
              <Image
                src={caseStudy.cover.image.src}
                alt={caseStudy.cover.image.alt}
                sizes="(max-width: 1023px) calc(100vw - 112px), 1108px"
                priority
              />
            </figure>

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
            className={styles.section}
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
