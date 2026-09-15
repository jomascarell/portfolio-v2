import MailLink from '@/components/MailLink/MailLink'
import SocialIcons from '@/components/SocialIcons/SocialIcons'
import { siteConfig } from '@/lib/site-config'
import styles from './ContactBio.module.css'

/* The contact block under the bio. Figma: contact-bio (791:1813), as composed
 * inside AboutBio+Contact (791:1876).
 *
 * THIS IS WHERE THE FOOTER'S CONTACT SURFACE WENT. The mail link and the
 * social row used to live in the footer; phase 7 moves both here, under the
 * prose, and that move is what lets the footer be 10vh — it is not a smaller
 * footer, it is a footer that stopped carrying this.
 *
 * The address is MailLink rather than the plain text the drawing shows. The
 * user chose that deliberately when it was raised: the component already has a
 * designed hover state and a real `mailto:`, and following the drawing
 * literally would have shipped an email address nobody can click in order to
 * match a rectangle. MailLink renders exactly the string Figma draws — the
 * label "Mail: " and the address — so the only thing gained is that it works.
 *
 * SocialIcons is Size=md, which is the 24px icons and the 18px gap the drawing
 * uses. Same instance the footer had, unchanged, so the hover handle ported in
 * Phase 5 comes with it.
 *
 * The intro line is siteConfig.contactIntro, which is the string that used to
 * be called footerIntro. Renamed rather than duplicated: the words did not
 * change, only the place they belong. */

export default function ContactBio({ className }: { className?: string }) {
  return (
    <div className={[styles.contact, className].filter(Boolean).join(' ')}>
      <p className={styles.intro}>{siteConfig.contactIntro}</p>
      <SocialIcons className={styles.social} size="md" />
      <MailLink className={styles.mail} size="md" />
    </div>
  )
}
