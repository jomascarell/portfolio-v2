import type { Metadata } from 'next'
import { ViewTransition } from 'react'
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
 * thread that keeps going.
 *
 * TWO SHARED-ELEMENT NAMES, MATCHING THE PANEL FAMILY'S OWN — decided
 * 2026-09-15, after studying calebwu.ca's case pages (documented on the
 * Reference page, "The motion dance"). `site-nav` is what every other route
 * already wraps its Nav in (see PanelLayout.tsx); without it here, arriving
 * at /photos from /projects would hard-swap the breadcrumb pill while every
 * other pair of routes morphs it — an inconsistency this page shipped with
 * and nobody had caught.
 *
 * `page-intro` is new here by decision, not by precedent: CollectionNav takes
 * the name the panel-family's PageIntro carries, so navigating from a panel
 * screen morphs the outgoing panel into the incoming rail as one reshaping
 * object — narrowing from card-width to rail-width — rather than the panel
 * vanishing and the rail fading in on its own. The two names are independent
 * regions (as they already are inside PanelLayout, where `site-nav` nests
 * inside `page-intro`), so pairing CollectionNav with `page-intro` costs
 * nothing structurally even though photos lays Nav and the rail out as
 * siblings rather than nesting one inside the other. */

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
        <ViewTransition name="site-nav" share="morph" default="none">
          <Nav state="photos" />
        </ViewTransition>
      </div>

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
