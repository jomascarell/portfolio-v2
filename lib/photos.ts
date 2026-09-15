export type Photo = {
  id: string
  /* Path inside /public. No real photos yet — until one exists, PhotoStream
     paints a correctly-proportioned hole instead of a broken <img>. Add the
     real width/height alongside the real src; they are not interchangeable
     with a placeholder's numbers, which only fix a ratio. */
  src?: string
  alt: string
  width: number
  height: number
}

export type PhotoCollection = {
  slug: string
  title: string
  description: string
  photos: Photo[]
}

export function collectionAnchorId(slug: string) {
  return `collection-${slug}`
}

/* Ratios are Figma's own (measured off the phase 9 page, xl canvas), not
   invented: 1.69, 2.00 for Ongoing; 1.69, 1.50 for Girona; 2.00, 1.69 for
   Iceland; 0.90 (portrait) for Portraits. The pixel dimensions below hit
   those ratios exactly — they are placeholders, but not arbitrary ones. */
function placeholders(slug: string, ratios: [number, number][]): Photo[] {
  return ratios.map(([width, height], index) => ({
    id: `${slug}-${index + 1}`,
    alt: '',
    width,
    height,
  }))
}

/* Four collections, in the order the phase 9 page draws them and
   collection-nav lists them. "Ongoing" is the standing exception — always
   open, for photos that don't belong to a named story yet — everything else
   is a trip, a season, or a thread that keeps going, decided per set rather
   than from a fixed axis like year. See [[photos-page-ia-decision]]. */
export const photoCollections: PhotoCollection[] = [
  {
    slug: 'ongoing',
    title: 'Ongoing',
    description: "Whatever doesn't belong to a story yet.",
    photos: placeholders('ongoing', [
      [1600, 947],
      [1600, 800],
    ]),
  },
  {
    slug: 'altea-summer',
    title: 'Altea, estiu 2026',
    description: 'A weekend that turned into a small project.',
    photos: placeholders('altea-summer', [
      [1600, 947],
      [1500, 1000],
    ]),
  },
  {
    slug: 'amsterdam',
    title: 'A few days visiting Amsterdam',
    description: 'The trip that finally used the wide-angle.',
    photos: placeholders('amsterdam', [
      [1600, 800],
      [1600, 947],
    ]),
  },
]
