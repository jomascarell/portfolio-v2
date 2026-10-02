import { NextResponse, type NextRequest } from 'next/server'
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n/config'

/* ENGLISH KEEPS ITS URLS (2026-10-02). Every page lives under app/[lang], but
 * English is served without a prefix: /projects shows /en/projects behind the
 * scenes (a rewrite, so the address bar does not change). /ca/... and /es/...
 * pass through untouched. /en/... is redirected to the unprefixed URL, so each
 * English page has exactly one address. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const first = pathname.split('/')[1]

  if (first === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(DEFAULT_LOCALE.length + 1) || '/'
    return NextResponse.redirect(url, 308)
  }
  if (isLocale(first)) return

  const url = request.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  /* Pages only: not Next's own files, and not anything with a file extension
     (the favicon, /case-studies/* media, fonts). */
  matcher: ['/((?!_next|.*\\..*).*)'],
}
