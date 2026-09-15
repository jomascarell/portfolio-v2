import Image from 'next/image'
import type { Photo } from '@/lib/photos'
import styles from './PhotoStream.module.css'

/* One collection's photos. Figma: "stream" (879:2429 and its siblings) — a
 * single full-width column at each photo's own natural ratio, not the
 * retired build's Pinterest-style multicolumn masonry. That masonry was
 * never in Figma either (its own comment said so); this design draws one
 * column and kyusuf.com, the reference for the IA decision, does the same —
 * no captions, no cropping, natural aspect ratio throughout. */
export default function PhotoStream({ photos }: { photos: Photo[] }) {
  return (
    <ul className={styles.stream}>
      {photos.map((photo) => (
        <li key={photo.id}>
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
        </li>
      ))}
    </ul>
  )
}
