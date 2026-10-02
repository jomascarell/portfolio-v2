/* THE LANGUAGES, AND HOW A URL SAYS WHICH ONE (2026-10-02, the user's choice:
 * the language lives in the URL).
 *
 * English is the default and keeps the URLs it always had: /, /projects,
 * /about. Catalan and Spanish carry a prefix: /ca/projects, /es/about. Every
 * route lives under app/[lang], and proxy.ts serves an unprefixed URL from the
 * English one behind the scenes, so nothing in the address bar changes for
 * English. Safe to import from client and server code alike. */

export const LOCALES = ['en', 'ca', 'es'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale)
}

/* '/projects' in Catalan is '/ca/projects'; in English it stays '/projects'. */
export function localizeHref(locale: Locale, href: string): string {
  if (locale === DEFAULT_LOCALE) return href
  return href === '/' ? `/${locale}` : `/${locale}${href}`
}

/* The other way round: the language a path is in, and the path without its
   prefix. '/ca/projects' -> ca + '/projects'; '/projects' -> en + '/projects'.
   '/en/projects' -> en + '/projects' too: an English page is served from
   /en/... behind the scenes (proxy.ts), and usePathname() can report that
   internal path, so the English prefix has to come off like the others. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const first = pathname.split('/')[1]
  if (isLocale(first)) {
    const rest = pathname.slice(first.length + 1)
    return { locale: first, path: rest === '' ? '/' : rest }
  }
  return { locale: DEFAULT_LOCALE, path: pathname }
}

/* English keeps the format the footer always had ("September 11 2026"). Catalan
   and Spanish use DD/MM/YYYY, the user's call. */
export function formatDate(isoDate: string, locale: Locale): string {
  const date = new Date(`${isoDate}T00:00:00Z`)
  if (locale !== 'en') {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'UTC',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date)
  }
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  }).formatToParts(date)
  const valueOf = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ''
  return `${valueOf('month')} ${valueOf('day')} ${valueOf('year')}`
}
