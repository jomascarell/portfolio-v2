import MailLink from '@/components/MailLink/MailLink'
import SocialIcons from '@/components/SocialIcons/SocialIcons'
import { siteConfig } from '@/lib/site-config'
import styles from './Footer.module.css'

/* Site footer. Figma: Footer, one variant per breakpoint (lg | md | sm); xl
   reuses lg.
 *
 * Twelve-column grid, two rows. Row 1 is the contact band — intro copy, the
 * address, the social row. Row 2 is the meta row — changelog, language,
 * credits. The column spans come straight from the Figma component and are the
 * only place this layout is described.
 *
 * NOT the reveal. The design also has a "landing-footer" screen showing this
 * footer slid up over the landing, and the reference's mechanic is recorded
 * (fixed, bottom 0, hidden at translateY(100%), 500ms). It is deliberately not
 * implemented yet: the *trigger* was never established — wheel, wheel-up,
 * bottom hover, drag, arrow keys and touch swipe were all tried against the
 * reference and none of them fire it. Shipping a fixed, translated-off-screen
 * footer with no working trigger would ship a footer nobody can reach, so this
 * renders in normal flow until the trigger is decided. */

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.intro}>{siteConfig.footerIntro}</p>

      <MailLink className={styles.mail} size="md" />

      <SocialIcons className={styles.social} size="md" />

      <p className={styles.changelog}>Changelog: {siteConfig.changelog}</p>

      {/* A switcher in the design (EN / CAT / CAST) with no states defined, so
          it is a label until those states exist. Marked here rather than in a
          tracker because this is where someone will look. */}
      <p className={styles.language}>{siteConfig.language}</p>

      <p className={styles.credits}>{siteConfig.credits}</p>
    </footer>
  )
}
