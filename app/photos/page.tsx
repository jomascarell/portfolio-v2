import type { Metadata } from 'next'

/* Photos. Phase 6 builds the gallery; the retired PhotoGallery is on the
   "adapt" list, and its multicolumn masonry is one of the reasons this build
   uses CSS Modules rather than utilities.

   Photos are grouped by year, and the year doubles as the anchor id and the
   sidebar label. lib/photos.ts arrives in Phase 8 with the real images. */

export const metadata: Metadata = {
  title: 'Photos — Joan Mascarell',
}

export default function PhotosPage() {
  return (
    <main>
      <h1>Photos</h1>
    </main>
  )
}
