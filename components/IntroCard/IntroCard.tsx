import Wordmark from '@/components/Wordmark/Wordmark'
import { siteConfig } from '@/lib/site-config'
import styles from './IntroCard.module.css'

/* The intro block's card. Figma: IntroCard, Breakpoint = lg | md | sm ×
 * Type = intro | about (482:1157).
 *
 * The two axes are different kinds of thing and are built differently.
 * `Type` is a prop — it says what the card is for, and a screen knows that.
 * `Breakpoint` is not a prop: it is three drawings of one card at three
 * widths, so it is media queries, and the only component in this phase that
 * needs them.
 *
 * WHERE those media queries break is a third thing, and it IS a screen's to
 * say — corrected 2026-09-12, audit item L. The file draws three different
 * ladders through the same three drawings, and the landing reaches md at 640
 * where the panel screens are still on sm. `ladder` picks between the two; the
 * stylesheet carries the measurements and the reason a container query cannot
 * do this job.
 *
 * Type=about is the wordmark alone. Figma expresses that two ways in the same
 * component set — md and sm delete the tagline and the status block, lg keeps
 * them and switches them off — and the result is identical, so this renders
 * neither. The bio sits beside the card on that screen and says all of it.
 *
 * THE CARD PAINTS NOTHING. No fill, no shadow, at every variant and on every
 * screen instance — checked on landing, projects and about rather than
 * assumed. It carries radius/lg, which with no fill draws nothing at all. So
 * "card" here is a name for a composition, not for a surface, and the radius
 * is not carried over. That is consistent with the system's own rule: the page
 * ground is white, color/surface/raised resolves to the same white, and
 * elevation is meant to be carried by shadow — of which this has none.
 *
 * NOT BUILT, DELIBERATELY: the "New" badge beside the status line. It exists
 * in the file, styled in color/blue/50 on color/blue/400, and it is hidden in
 * all six variants and on every screen. A component nobody has switched on is
 * not a deliverable; if it should ship it needs a content flag to drive it,
 * which is a Phase 9 decision. */

const TYPES = {
  intro: styles.intro,
  about: styles.about,
} as const

type IntroCardProps = {
  type?: keyof typeof TYPES
  /* Which breakpoint ladder the card climbs. `panel` is every screen that
     seats it in a cell beside content — /projects, /about, the gallery — and
     `full` is the landing, whose card is the whole screen from 640 up and
     takes the md drawing there. */
  ladder?: 'panel' | 'full'
  className?: string
}

export default function IntroCard({
  type = 'intro',
  ladder = 'panel',
  className,
}: IntroCardProps) {
  return (
    <div
      className={[
        styles.card,
        TYPES[type],
        ladder === 'full' && styles.full,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {type === 'intro' && (
        <p className={styles.tagline}>{siteConfig.tagline}</p>
      )}

      {/* No `size` prop on purpose. The card switches the mark from sm to lg
          at 768, which is a fact about the card's layout and not about the
          mark, so the size is set in this component's stylesheet — where the
          breakpoint that decides it already lives. */}
      <Wordmark className={styles.wordmark} />

      {type === 'intro' && (
        <div className={styles.status}>
          <p className={styles.current}>{siteConfig.status.current}</p>
          <p className={styles.previous}>
            {siteConfig.status.previous}
            {/* rel="noopener noreferrer" written out rather than relying on the
                default target="_blank" implies — the same call AboutBio makes,
                for the same reason. */}
            <a
              className={styles.handle}
              href={siteConfig.status.previousHandle.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {siteConfig.status.previousHandle.handle}
            </a>
          </p>
        </div>
      )}
    </div>
  )
}
