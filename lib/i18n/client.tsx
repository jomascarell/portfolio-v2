'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { DEFAULT_LOCALE, type Locale } from './config'
import { MESSAGES, type Messages } from './messages'

/* The current language for Client Components (nav, project list, footer
 * pieces). The root layout knows it from the route and provides it here;
 * root params cannot be read from client code. */
const LocaleContext = createContext<Locale>(DEFAULT_LOCALE)

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

export function useI18n(): { locale: Locale; t: Messages } {
  const locale = useContext(LocaleContext)
  return { locale, t: MESSAGES[locale] }
}
