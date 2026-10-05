import { BsSend } from 'react-icons/bs'
import { siteConfig } from '@/lib/site-config'
import styles from './ContactCard.module.css'

/* The card that closes a case study: a question, a line, and a mail button.
 * Figma: ContactCard (1582:1184), Breakpoint = md | sm, named 2026-10-05.
 * sm (stacked, centred) below 640, md (text left, button right) from 640 —
 * the user's breakpoint. The card is ~528 wide at 640 and the row needs ~440.
 *
 * THE BUTTON, Figma button-get-in-touch (1582:1318), Breakpoint = md | sm x
 * State = default | hover, named 2026-10-05: a label pill and a 48px icon
 * tile side by side, both neutral/1000 with radius/lg corners, so they read
 * as two pieces with a notch between. Hover joins them: the inner corners
 * go square and both lift to neutral/950. No pressed state (a step-out on
 * press was tried and dropped, 2026-10-05). Label Tilt Warp -1px, 18 md / 16 sm;
 * the icon is Bootstrap `send` at 16px.
 *
 * Tilt Warp is loaded with preload: false (see the [lang] layout), so a
 * desktop visitor now downloads it on a page with this card. Accepted.
 *
 * An aside, labelled, because it's about the author rather than the study.
 * The copy comes from the case study's data, since it names "the study". */

export default function ContactCard({
  title,
  text,
  label,
}: {
  title: string
  text: string
  label: string
}) {
  return (
    <aside className={styles.card} aria-label="Contact">
      <div className={styles.text}>
        <p className={styles.title}>{title}</p>
        <p className={styles.subtitle}>{text}</p>
      </div>
      <a className={styles.button} href={`mailto:${siteConfig.contactEmail}`}>
        <span className={styles.pill}>
          <span className={styles.label}>{label}</span>
        </span>
        <span className={styles.tile} aria-hidden="true">
          <BsSend className={styles.icon} />
        </span>
      </a>
    </aside>
  )
}
