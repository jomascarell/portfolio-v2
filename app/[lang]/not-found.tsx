import Link from 'next/link'
import { IoMdArrowUp } from 'react-icons/io'
import NotFoundMark from '@/components/NotFoundMark/NotFoundMark'
import { localizeHref } from '@/lib/i18n/config'
import { getI18n } from '@/lib/i18n/server'
import styles from './not-found.module.css'

/* The 404. Figma: NotFound (1553:2792), Breakpoint lg | md | sm, 2026-10-03.
 *
 * Reached by notFound() from an unknown project slug, and by any URL that
 * matches no route: app/[lang]/[...missing] sends those here, so the page
 * keeps the shell, the nav and the visitor's language instead of Next's bare
 * default (which is what every 404 showed until 2026-10-03).
 *
 * From the top: NotFoundMark (the playable 404 — see the component), the
 * two-tone headline, and two links out pushed to either edge of the
 * headline's width. The headline is the h1; the 404 above it is an image
 * labelled "404".
 *
 * The arrows are the case page's live-link arrow at 35deg, as the file
 * draws them: up and back for the start, up and on for the projects.
 *
 * The title is a React <title>, hoisted into <head>: a not-found file cannot
 * export metadata (only global-not-found can, per the Next docs). */

export default async function NotFound() {
  const { locale, t } = await getI18n()
  return (
    <div className={styles.page}>
      <title>{t.notFound.metaTitle}</title>
      <NotFoundMark tiltLabel={t.notFound.tiltLabel} />
      <div className={styles.message}>
        <h1 className={styles.headline}>
          {t.notFound.lost} <span className={styles.aside}>{t.notFound.lostAside}</span>
        </h1>
        <div className={styles.links}>
          <Link className={`${styles.link} ${styles.back}`} href={localizeHref(locale, '/')}>
            <span className={styles.arrow} aria-hidden="true">
              <IoMdArrowUp />
            </span>
            {t.notFound.home}
          </Link>
          <Link className={`${styles.link} ${styles.on}`} href={localizeHref(locale, '/projects')}>
            {t.notFound.projects}
            <span className={styles.arrow} aria-hidden="true">
              <IoMdArrowUp />
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
