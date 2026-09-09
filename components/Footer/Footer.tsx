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
 * This component knows nothing about the reveal, and should stay that way. It
 * renders the footer; components/FooterReveal wraps it in the root layout and
 * owns when it arrives. Keeping the two apart is what lets this stay a Server
 * Component — see the note at the wrapper in app/layout.tsx.
 *
 * The height is the one number NOT taken from the reference. calebwu.ca's bar
 * is 10vh, but that is an observation of a site whose footer holds a line of
 * copy and a reset control; ours is drawn at its own content height (172px at
 * xl) and holds real links. Let it size to its content. */

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
