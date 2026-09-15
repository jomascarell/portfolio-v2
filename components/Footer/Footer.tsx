import ChangelogText from '@/components/Footer/ChangelogText'
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher'
import { siteConfig } from '@/lib/site-config'
import styles from './Footer.module.css'

/* The footer. Figma: Footer, Breakpoint = lg | md | sm (236:2725), redrawn on
 * the phase 7 page.
 *
 * REBUILT 2026-09-12, and it is a different component rather than a tidier
 * one. It used to hold six things — an intro line, the mail link, the social
 * row, the changelog, the language control and the credits — across three
 * grids of 12 x 2, 8 x 3 and 4 x 5. It now holds three, and the user's reason
 * is the honest one: the old version "becomes messy across different screen
 * sizes and would require a large number of media queries to make it fully
 * responsive". Six items that each need their own cell at three tiers is
 * eighteen placements; three items is nine, and two of those are the same.
 *
 * THE MAIL LINK AND THE SOCIAL ROW DID NOT DIE, THEY MOVED. Both are part of
 * AboutBio+Contact (791:1876) now, under the bio, which is where someone
 * looking for a way to contact you would go first anyway. That move is what
 * makes 10vh survivable — it is not a smaller footer, it is a footer that
 * stopped carrying the contact surface.
 *
 * WHAT IS LEFT IS METADATA, in the literal sense: when this was last touched,
 * what it was built with, and which language you are reading. None of it is a
 * destination, which is why the bar can be an edge rather than a panel.
 *
 * The language control is the only INTERACTIVE thing in here, but not the
 * only client component any more: ChangelogText (2026-09-13, ported from
 * calebwu.ca's own scramble-reveal) needs the browser for its rAF animation
 * even though it takes no input. Both are leaves — the footer itself stays a
 * Server Component and react-icons, which left with SocialIcons, is still not
 * in its tree at all. */

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* DOM order is changelog, language, credits, and the visual order
          differs from it at two of the three tiers — see the stylesheet. The
          one interactive element sits second in both orders, so the tab
          sequence never disagrees with what the eye follows. That is the
          constraint worth holding if these are ever reordered again. */}
      <ChangelogText className={styles.changelog} />
      <LanguageSwitcher className={styles.language} />
      <p className={styles.credits}>{siteConfig.credits}</p>
    </footer>
  )
}
