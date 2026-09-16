import type { Metadata } from 'next'
import { ViewTransition } from 'react'
import CollectionNav from '@/components/CollectionNav/CollectionNav'
import PhotoStream from '@/components/PhotoStream/PhotoStream'
import { collectionAnchorId, photoCollections } from '@/lib/photos'
import styles from './page.module.css'

/* Photos. Figma: "9️⃣phase 9" page (872:2099), checked and cleaned
 * 2026-09-15 before this was written — see [[photos-page-ia-decision]].
 *
 * NO PageIntro, same as project-detail: this screen is content plus its own
 * scroll-spy rail, not a panel. None of the panel-family components land
 * here.
 *
 * NO NAV HERE EITHER, any more — retired 2026-09-15 alongside the
 * persistent-Nav rewrite. This page used to render its own
 * `<Nav state="photos" />`, fixed-positioned locally because this is the one
 * route that genuinely scrolls. Nav is now mounted once in the root layout,
 * fixed on every route, and reads `/photos` from the URL itself — see
 * components/Nav/Nav.tsx. That is also why `site-nav` is gone from this file:
 * there is only one Nav element in the whole app now, so there is nothing
 * left for a ViewTransition to pair across a navigation.
 *
 * Collections, not years — the IA decision this page implements. "Ongoing"
 * is the standing exception; everything else is a trip, a season, or a
 * thread that keeps going.
 *
 * `page-intro` IS STILL HERE, unrelated to the nav change above — decided
 * 2026-09-15, after studying calebwu.ca's case pages (documented on the
 * Reference page, "The motion dance"). CollectionNav takes the name the
 * panel-family's PageIntro carries, so navigating from a panel screen morphs
 * the outgoing panel into the incoming rail as one reshaping object —
 * narrowing from card-width to rail-width — rather than the panel vanishing
 * and the rail fading in on its own. */

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
      <div className={styles.grid}>
        <ViewTransition name="page-intro" share="morph" default="none">
          <CollectionNav
            items={navItems}
            label="Collections"
            className={styles.rail}
          />
        </ViewTransition>

        <div className={styles.content}>
          <header className={styles.intro}>
            <h1 className={styles.heading}>Joangram.</h1>
            <p className={styles.body}>
              Bé, no m’agrada en què s’ha convertit Instagram, però la seua idea
              inicial —compartir fotos sense altres pretensions i funcionar
              simplement com un blog amb imatges i peus de foto— és el que vull
              aconseguir amb esta pàgina. Benvinguts😁.
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
