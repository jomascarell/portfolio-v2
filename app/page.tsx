import Footer from '@/components/Footer/Footer'
import FooterReveal from '@/components/FooterReveal/FooterReveal'
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
 * LANDING-FOOTER IS THE LANDING WITH THE FOOTER OPEN — corrected 2026-09-11.
 * It was read as "the landing, which happens to have a footer", and that reading
 * put <Footer /> in the root layout for two phases. The census settles it: the
 * Footer appears on 6 of the 36 frames on the Design page and all 6 are
 * landing-footer — none on projects, about, photos or project-detail, at any
 * width. So this is the only route with a footer, and it renders it here.
 *
 * The geometry says the same thing. At every canvas from 640 up, the PageIntro
 * sits at an identical y with an identical height in both frames, and the frame
 * simply grows by the bar plus a 40-48px gap. Content that does not move is
 * what a bar sliding up over a static page looks like when you have to draw it
 * as two static frames.
 *
 * <Footer /> is passed as children, not imported by FooterReveal. A Server
 * Component handed to a Client Component as a prop is not part of that
 * component's module graph — it is rendered on the server and passed in as
 * output. So the footer, and react-icons with it, stay out of the client bundle
 * exactly as Phase 5 verified; the island ships only the gesture.
 *
 * The panel is 8 of the 12 columns at lg, centred on the grid with two empty
 * columns either side; all 8 at md; and at 412 it goes edge to edge, which is
 * the one place a screen cancels the shell's inset rather than sitting inside
 * it. See the stylesheet. */

export default function LandingPage() {
  return (
    <>
      <div className={styles.landing}>
        <PageIntro
          className={styles.panel}
          nav={<NavLinks layout="row" />}
          ladder="full"
        />
      </div>
      <FooterReveal>
        <Footer />
      </FooterReveal>
    </>
  )
}
