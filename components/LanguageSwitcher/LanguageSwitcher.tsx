'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { localizeHref, splitLocale } from '@/lib/i18n/config'
import { useI18n } from '@/lib/i18n/client'
import { siteConfig } from '@/lib/site-config'
import styles from './LanguageSwitcher.module.css'

/* EN / CAT / ES. Since 2026-10-02 these are real links, not buttons that only
 * lit up: the language lives in the URL (lib/i18n/config), so each one goes to
 * the same page in that language. The current one keeps the lit style through
 * aria-current, and each link says its own language with hrefLang and lang, so
 * a screen reader reads "Català" with a Catalan voice. */
export default function LanguageSwitcher({ className }: { className?: string }) {
  const pathname = usePathname()
  const { locale, t } = useI18n()
  const { path } = splitLocale(pathname)

  return (
    <nav
      className={[styles.switcher, className].filter(Boolean).join(' ')}
      aria-label={t.footer.languageLabel}
    >
      {siteConfig.languages.map((language) => (
        <Link
          key={language.code}
          className={styles.option}
          href={localizeHref(language.code, path)}
          hrefLang={language.code}
          lang={language.code}
          aria-current={language.code === locale ? 'true' : undefined}
        >
          {language.label}
        </Link>
      ))}
    </nav>
  )
}
