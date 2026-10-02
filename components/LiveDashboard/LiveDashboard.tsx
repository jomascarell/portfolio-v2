import Image from 'next/image'
import { IoMdArrowUp } from 'react-icons/io'
import NewTabNote from '@/components/NewTabNote/NewTabNote'
import type { CaseImage } from '@/lib/case-studies'
import styles from './LiveDashboard.module.css'

/* LiveDashboard — the published notebook's own embed, in an iframe, loaded
 * with the page.
 *
 * TWO REVERSALS OF THE FIGMA COMPONENT (1227:2), both the user's (2026-09-25):
 * it is an iframe rather than the Observable runtime rendering into our DOM,
 * and it loads directly rather than behind a poster and a click-to-load
 * button, so the poster, loading and error states do not exist here. The
 * embed is unpinned, so a republished notebook shows up with no rebuild.
 *
 * WHAT IT COSTS, measured when the switch was made: ~940 KB of Observable's
 * code plus ~900 KB of data, Observable's own type and footer, and Google
 * Analytics, Tag Manager, DoubleClick and Sentry inside the frame. With the
 * click gone, `loading="lazy"` is what keeps that off readers who never
 * scroll to Findings — the browser fetches the frame only as it nears the
 * viewport, which a reader does not see as a step.
 *
 * PHONES GET A STILL (2026-10-01 audit, the user's choice). The embed needs
 * 640px, so below 640 it sat in a ~300px window that scrolled sideways and
 * readers panned inside a chart. With `still` and `href` set, phones see a
 * capture with a link out to the live dashboard under it, and the iframe is
 * display:none there, which also keeps a lazy frame from loading at all. The
 * image sits outside the link so the link's name stays its own words, not
 * the capture's long alt. */
export default function LiveDashboard({
  embedUrl,
  title,
  still,
  href,
  caption,
}: {
  embedUrl: string
  /* The iframe's accessible name. */
  title: string
  still?: CaseImage
  href?: string
  caption: string | null
}) {
  const phoneStill = still && href
  return (
    <figure className={styles.root}>
      <div className={phoneStill ? `${styles.media} ${styles.wideOnly}` : styles.media}>
        <iframe
          className={styles.frame}
          src={embedUrl}
          title={title}
          loading="lazy"
        />
      </div>
      {phoneStill ? (
        <div className={styles.still}>
          <Image
            className={styles.stillImage}
            src={still.src}
            alt={still.alt}
            sizes="(max-width: 639px) calc(100vw - 112px), 1px"
          />
          {/* Matches the page's "View the live dashboard" link: underlined,
              ink, the same 35deg arrow. */}
          <a
            className={styles.stillLink}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open the live dashboard
            <span className={styles.stillArrow} aria-hidden="true">
              <IoMdArrowUp />
            </span>
            <NewTabNote lang="en" />
          </a>
        </div>
      ) : null}
      {caption ? (
        <figcaption className={styles.caption}>{caption}</figcaption>
      ) : null}
    </figure>
  )
}
