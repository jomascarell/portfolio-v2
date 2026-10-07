import type { Metadata } from 'next'
import { localizeHref, type Locale } from './i18n/config'

/* SHARE CARDS (2026-10-07). One 1200x630 image per page that gets shared,
   exported by the user from Figma: the landing as the site-wide card, one
   per project. Static files under /public, not the opengraph-image file
   convention (see the note in projects/[slug]/page.tsx).

   Next REPLACES a parent's openGraph and twitter objects rather than merging
   them, so a page that sets its own title would drop the layout's image.
   Every page that has metadata of its own builds both objects here instead,
   with the site card as the fallback image. */

export type ShareImage = { src: string; alt: string }

/* The landing card is in English on every locale for now: its words are
   the English tagline and status lines. */
export const siteShareImage: ShareImage = {
  src: '/share.png',
  alt: 'Joan Mascarell’s landing page: the joan wordmark, the tagline “Translating design into interfaces that hold up.” and links to Projects and About.',
}

const OG_LOCALE: Record<Locale, string> = { en: 'en_GB', ca: 'ca_ES', es: 'es_ES' }

export function shareMetadata({
  locale,
  path,
  title,
  description,
  image = siteShareImage,
  type = 'website',
}: {
  locale: Locale
  path: string
  title: string
  description?: string
  image?: ShareImage
  type?: 'website' | 'article'
}): Pick<Metadata, 'openGraph' | 'twitter'> {
  /* Paths are relative; the root layout's metadataBase makes them absolute. */
  const images = [{ url: image.src, width: 1200, height: 630, alt: image.alt }]
  return {
    openGraph: {
      siteName: 'Joan Mascarell',
      title,
      ...(description ? { description } : {}),
      url: localizeHref(locale, path),
      locale: OG_LOCALE[locale],
      type,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      ...(description ? { description } : {}),
      images,
    },
  }
}
