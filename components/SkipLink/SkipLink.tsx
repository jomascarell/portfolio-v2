import { getI18n } from '@/lib/i18n/server'
import styles from './SkipLink.module.css'
import { SKIP_TARGET_ID } from './target'

/* Skip link. First focusable thing in the document, visually hidden until it
   takes focus.
 *
 * It exists because the shell is persistent: the nav and the intro panel are
 * the same nodes on every route, so a keyboard user would otherwise tab
 * through the same chrome again on arrival at each page. This is the way past
 * it.
 *
 * Not `display: none` and not `visibility: hidden` — both remove an element
 * from the focus order, which would make a skip link that can never be
 * reached. It is clipped instead, and unclips on :focus-visible. */

export { SKIP_TARGET_ID }

export default async function SkipLink() {
  const { t } = await getI18n()
  return (
    <a className={styles.skipLink} href={`#${SKIP_TARGET_ID}`}>
      {t.common.skipToContent}
    </a>
  )
}
