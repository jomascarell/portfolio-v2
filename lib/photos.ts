export type Photo = {
  id: string
  /* Path inside /public. No real photos yet — until one exists, PhotoStream
     paints a correctly-proportioned hole instead of a broken <img>. Add the
     real width/height alongside the real src; they are not interchangeable
     with a placeholder's numbers, which only fix a ratio. */
  src?: string
  alt: string
  /* Optional per-photo caption, shown under the image. A deliberate reversal
     of the Phase 9 IA decision ("no captions under photos" — see
     [[photos-page-ia-decision]]), made 2026-09-16 at the user's request.
     Omit it on photos that don't need one; PhotoStream renders nothing when
     absent, so mixing captioned and uncaptioned photos in one stream is
     fine. */
  caption?: string
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

/* Four collections, in the order the phase 9 page draws them and
   collection-nav lists them. "Ongoing" is the standing exception — always
   open, for photos that don't belong to a named story yet — everything else
   is a trip, a season, or a thread that keeps going, decided per set rather
   than from a fixed axis like year. See [[photos-page-ia-decision]]. */
export const photoCollections: PhotoCollection[] = [
  {
    slug: 'ongoing',
    title: 'Ongoing',
    description: "Fotos que m'agraden però no tenen on anar.",
    photos: [
      // {
      //   id: 'ongoing-1',
      //   src: '/photos/ongoing/FSCN0769.JPG',
      //   alt: '',
      //   width: 4320,
      //   height: 3240,
      // },
    ],
  },
  {
    slug: 'altea-summer',
    title: 'Altea, estiu 2026',
    description: '',
    photos: [
      {
        id: 'altea-summer-1',
        src: '/photos/altea-summer/DSCN0969.JPG',
        caption: 'no sabiem que el pàdel surf era tan divertit',
        alt: '',
        width: 4320,
        height: 3240,
      },
      {
        id: 'altea-summer-2',
        src: '/photos/altea-summer/DSCN0970.JPG',
        alt: '',
        width: 4320,
        height: 3240,
      },
    ],
  },
  {
    slug: 'amsterdam',
    title: 'Amsterdam, setembre 2025',
    description: '',
    photos: [
      {
        id: 'amsterdam-1',
        src: '/photos/amsterdam/DSCN0948.JPG',
        alt: '',
        width: 4320,
        height: 3240,
      },
      {
        id: 'amsterdam-2',
        src: '/photos/amsterdam/DSCN0949.JPG',
        alt: '',
        width: 4320,
        height: 3240,
      },
      {
        id: 'amsterdam-3',
        src: '/photos/amsterdam/DSCN0956.JPG',
        alt: '',
        width: 4320,
        height: 3240,
      },
      {
        id: 'amsterdam-4',
        src: '/photos/amsterdam/DSCN0964.JPG',
        alt: 'joan',
        width: 4320,
        height: 3240,
      },
    ],
  },
]
