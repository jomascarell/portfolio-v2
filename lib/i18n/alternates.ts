import { DEFAULT_LOCALE, LOCALES, localizeHref } from './config'

/* The same page in every language, for search engines (hreflang). Relative
   paths; the root layout's metadataBase makes them absolute. */
export function languageAlternates(path: string) {
  return {
    languages: {
      ...Object.fromEntries(LOCALES.map((locale) => [locale, localizeHref(locale, path)])),
      'x-default': localizeHref(DEFAULT_LOCALE, path),
    },
  }
}
