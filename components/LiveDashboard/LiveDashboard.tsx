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
 * viewport, which a reader does not see as a step. */
export default function LiveDashboard({
  embedUrl,
  title,
  caption,
}: {
  embedUrl: string
  /* The iframe's accessible name. */
  title: string
  caption: string | null
}) {
  return (
    <figure className={styles.root}>
      <div className={styles.media}>
        <iframe
          className={styles.frame}
          src={embedUrl}
          title={title}
          loading="lazy"
        />
      </div>
      {caption ? (
        <figcaption className={styles.caption}>{caption}</figcaption>
      ) : null}
    </figure>
  )
}
