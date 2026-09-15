import type { Metadata } from 'next'
import CollectionNav from '@/components/CollectionNav/CollectionNav'
import Nav from '@/components/Nav/Nav'
import PhotoStream from '@/components/PhotoStream/PhotoStream'
import { collectionAnchorId, photoCollections } from '@/lib/photos'
import styles from './page.module.css'

/* Photos. Figma: "9️⃣phase 9" page (872:2099), checked and cleaned
 * 2026-09-15 before this was written — see [[photos-page-ia-decision]].
 *
 * NO PageIntro, same as project-detail: this screen is content plus its own
 * scroll-spy rail plus a standalone Nav in its breadcrumb state, not a panel.
 * None of the panel-family components land here.
 *
 * Collections, not years — the IA decision this page implements. "Ongoing"
 * is the standing exception; everything else is a trip, a season, or a
 * thread that keeps going. */

export const metadata: Metadata = {
  title: 'Photos — Joan Mascarell',
}

export default function PhotosPage() {
  const navItems = photoCollections.map((collection) => ({
    id: collectionAnchorId(collection.slug),
    label: collection.title,
  }))

  return (
    <>
      <div className={styles.navRow}>
        <Nav state="photos" />
      </div>

      <div className={styles.grid}>
        <CollectionNav
          items={navItems}
          label="Collections"
          className={styles.rail}
        />

        <div className={styles.content}>
          <header className={styles.intro}>
            <h1 className={styles.heading}>Photos.</h1>
            <p className={styles.body}>
              A loose set of photos, kept in whatever grouping actually fits
              them — a trip, a season, a thread that keeps going.
            </p>
          </header>

          {photoCollections.map((collection) => {
            const anchorId = collectionAnchorId(collection.slug)
            return (
              <section
                key={collection.slug}
                id={anchorId}
                className={styles.collection}
                aria-labelledby={`${anchorId}-title`}
              >
                <div className={styles.collectionHeader}>
                  <h2
                    id={`${anchorId}-title`}
                    className={styles.collectionTitle}
                  >
                    {collection.title}
                  </h2>
                  <p className={styles.collectionDescription}>
                    {collection.description}
                  </p>
                </div>
                <PhotoStream photos={collection.photos} />
              </section>
            )
          })}
        </div>
      </div>
    </>
  )
}
