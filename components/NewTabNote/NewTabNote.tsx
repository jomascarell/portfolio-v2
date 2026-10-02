import type { Locale } from '@/lib/i18n/config'
import { MESSAGES } from '@/lib/i18n/messages'
import { getI18n } from '@/lib/i18n/server'

/* Read after every link that opens a new tab. In the page's language, unless
   `lang` says otherwise: case studies and photos stay in English inside a
   translated page, and a note in Catalan in the middle of English text would be
   read with the wrong voice. */
export default async function NewTabNote({ lang }: { lang?: Locale }) {
  const text = lang ? MESSAGES[lang].common.newTab : (await getI18n()).t.common.newTab
  return <span className="visually-hidden"> {text}</span>
}
