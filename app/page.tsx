import NavLinks from '@/components/NavLinks/NavLinks'
import PageIntro from '@/components/PageIntro/PageIntro'
import styles from './landing.module.css'

/* Landing. Figma: landing / 1448 (482:1754) and its three siblings, plus the
 * landing-footer state of each.
 *
 * The only screen with pills instead of a breadcrumb, and the only one in the
 * panel family with no content beside the panel — so it does not use
 * PanelLayout. It is the panel placed on the page grid, which at this width is
 * genuinely all there is to say.
 *
 * LANDING-FOOTER IS NOT A SECOND SCREEN. Figma draws it as one, and it is the
 * only state drawing in the file, but the footer is shell-level: the root
 * layout renders it on every route and FooterReveal decides when it arrives.
 * Both frames therefore resolve to this file. What the landing-footer frames
 * are good for is the one thing nothing else shows — the spacing between the
 * end of the content and the top of the footer, which is 48px at 1448.
 *
 * The panel is 8 of the 12 columns at lg, centred on the grid with two empty
 * columns either side; all 8 at md; and at 412 it goes edge to edge, which is
 * the one place a screen cancels the shell's inset rather than sitting inside
 * it. See the stylesheet. */

export default function LandingPage() {
  return (
    <div className={styles.landing}>
      <PageIntro className={styles.panel} nav={<NavLinks layout="row" />} />
    </div>
  )
}
