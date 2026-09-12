import { Fragment } from 'react'
import { bio, type BioSegment } from '@/lib/about'
import styles from './AboutBio.module.css'

/* The biography block on /about. Figma: AboutBio (492:2172), a standalone
 * component with no variant axis — the only one of the twelve that has none.
 *
 * It reads from lib/about.ts rather than holding its own copy, for the same
 * reason the intro copy sits in site-config: this is the only place the bio
 * appears today, but a content module is where Phase 9 will go looking, and a
 * component with a paragraph baked into it is a component nobody edits. The
 * copy carries its own marked words — see that file for why two of them are
 * links and the third deliberately is not.
 *
 * No heading. The drawn frame has none, and inventing an <h2> here would put
 * a heading in the document that the design does not have — the page's
 * heading structure is Phase 7's to settle, and it settles it once for all
 * six screens rather than per component. */

function renderSegment(segment: BioSegment, key: number) {
  if (typeof segment === 'string') {
    return <Fragment key={key}>{segment}</Fragment>
  }

  if ('em' in segment) {
    return <em key={key}>{segment.em}</em>
  }

  /* rel="noopener noreferrer" rather than relying on the browser default:
     target="_blank" implies noopener in every current engine, but writing it
     keeps the guarantee in the source instead of in a version matrix. */
  return (
    <a
      key={key}
      href={segment.href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.link}
    >
      {segment.text}
    </a>
  )
}

type AboutBioProps = {
  className?: string
}

export default function AboutBio({ className }: AboutBioProps) {
  return (
    <div className={[styles.bio, className].filter(Boolean).join(' ')}>
      {bio.map((paragraph, paragraphIndex) => (
        <p key={paragraphIndex}>
          {paragraph.map((line, lineIndex) => (
            <Fragment key={lineIndex}>
              {lineIndex > 0 && <br />}
              {line.map(renderSegment)}
            </Fragment>
          ))}
        </p>
      ))}
    </div>
  )
}
