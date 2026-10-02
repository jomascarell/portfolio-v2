import { notFound } from 'next/navigation'
import { lang } from 'next/root-params'
import { isLocale, type Locale } from './config'
import { MESSAGES, type Messages } from './messages'

/* The current language and its strings, for Server Components. The language is
 * the [lang] root segment, read without prop drilling (next/root-params, as the
 * Next.js i18n guide recommends). An unknown language is a 404. */
export async function getI18n(): Promise<{ locale: Locale; t: Messages }> {
  const locale = await lang()
  if (!isLocale(locale)) notFound()
  return { locale, t: MESSAGES[locale] }
}
