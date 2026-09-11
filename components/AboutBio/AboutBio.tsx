import { bio } from '@/lib/about'
import styles from './AboutBio.module.css'

/* The biography block on /about. Figma: AboutBio (492:2172), a standalone
 * component with no variant axis — the only one of the twelve that has none.
 *
 * It reads from lib/about.ts rather than holding its own copy, for the same
 * reason the intro copy sits in site-config: this is the only place the bio
 * appears today, but a content module is where Phase 9 will go looking, and a
 * component with a paragraph baked into it is a component nobody edits.
 *
 * No heading. The drawn frame has none, and inventing an <h2> here would put
 * a heading in the document that the design does not have — the page's
 * heading structure is Phase 7's to settle, and it settles it once for all
 * six screens rather than per component. */

type AboutBioProps = {
  className?: string
}

export default function AboutBio({ className }: AboutBioProps) {
  return (
    <div className={[styles.bio, className].filter(Boolean).join(' ')}>
      {bio.map((paragraph) => (
        <p key={paragraph[0]}>
          {paragraph.map((line, index) => (
            <span key={line}>
              {index > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      ))}
    </div>
  )
}
