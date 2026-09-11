import type { Metadata } from 'next'

/* Photos. PHASE 7 builds the gallery; the retired PhotoGallery is on the
   "adapt" list, and its multicolumn masonry is one of the reasons this build
   uses CSS Modules rather than utilities. Nothing in Phase 6 touched this
   screen: along with project-detail it is one of the two that carry no
   PageIntro at all, so none of the twelve components lands here except the
   Breadcrumb.

   Photos are grouped by year, and the year doubles as the anchor id and the
   sidebar label. lib/photos.ts arrives in PHASE 9 with the real images. */

export const metadata: Metadata = {
  title: 'Photos — Joan Mascarell',
}

export default function PhotosPage() {
  return (
    <>
      <h1>Photos</h1>
    </>
  )
}
