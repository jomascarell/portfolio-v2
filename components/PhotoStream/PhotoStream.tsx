import Image from 'next/image'
import type { Photo } from '@/lib/photos'
import styles from './PhotoStream.module.css'

/* One collection's photos. Figma: "stream" (879:2429 and its siblings) — a
 * single full-width column at each photo's own natural ratio, not the
 * retired build's Pinterest-style multicolumn masonry. That masonry was
 * never in Figma either (its own comment said so); this design draws one
 * column and kyusuf.com, the reference for the IA decision, does the same —
 * no cropping, natural aspect ratio throughout.
 *
 * CAPTIONS are a later, deliberate reversal of that same IA decision's
 * original "no captions" call (see the Photo type in lib/photos.ts) —
 * per-photo, optional, so a caption-less photo renders exactly as before. */
export default function PhotoStream({ photos }: { photos: Photo[] }) {
  return (
    <ul className={styles.stream}>
      {photos.map((photo) => (
        <li key={photo.id}>
          <figure className={styles.figure}>
            {photo.src ? (
              <Image
                className={styles.image}
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 639px) 100vw, (max-width: 767px) 428px, (max-width: 1023px) 434px, 986px"
              />
            ) : (
              <div
                className={`${styles.image} ${styles.placeholder}`}
                style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
                aria-hidden="true"
              />
            )}
            {photo.caption ? (
              <figcaption className={styles.caption}>
                {photo.caption}
              </figcaption>
            ) : null}
          </figure>
        </li>
      ))}
    </ul>
  )
}
