import Link from 'next/link'
import { IoMdArrowUp } from 'react-icons/io'
import { localizeHref } from '@/lib/i18n/config'
import { getI18n } from '@/lib/i18n/server'
import styles from './not-found.module.css'

/* The 404. Reached by notFound() from an unknown project slug, and by any URL
   that matches no route: app/[lang]/[...missing] sends those here, so the page
   keeps the shell, the nav and the visitor's language instead of Next's bare
   default (which is what every 404 showed until 2026-10-03).

   No Figma frame: designed in code for the launch (2026-10-03). It is built
   from the case header's parts — eyebrow, heading/h2 title, body standfirst —
   in the same content column, so it reads as part of the site rather than an
   error screen. Two ways out, the start and the project list; the nav above
   carries the rest. The links take the case page's link UI and CaseEndNav's
   arrow. */

function WayOut({ href, label }: { href: string; label: string }) {
  return (
    <Link className={styles.link} href={href}>
      {label}
      <span className={styles.arrow} aria-hidden="true">
        <IoMdArrowUp />
      </span>
    </Link>
  )
}

export default async function NotFound() {
  const { locale, t } = await getI18n()
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>{t.notFound.eyebrow}</p>
        <h1 className={styles.title}>{t.notFound.title}</h1>
        <p className={styles.body}>{t.notFound.body}</p>
        <div className={styles.links}>
          <WayOut href={localizeHref(locale, '/')} label={t.notFound.home} />
          <WayOut href={localizeHref(locale, '/projects')} label={t.notFound.projects} />
        </div>
      </div>
    </div>
  )
}
