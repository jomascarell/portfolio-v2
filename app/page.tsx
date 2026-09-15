import Footer from '@/components/Footer/Footer'
import FooterReveal from '@/components/FooterReveal/FooterReveal'
import PanelLayout from '@/components/PanelLayout/PanelLayout'

/* The landing — which, since 2026-09-12, is also the closed state of the two
 * screens beside it. Figma: phase 7, landing / 1448 (793:2039) and its five
 * siblings, plus the landing-footer state of each.
 *
 * There is almost nothing here now, and that is the change. This page used to
 * own a grid, a panel and a stylesheet of its own; all three moved into
 * PanelLayout when projects and about stopped being separate pages. What is
 * left is the one thing genuinely true of this route and no other: it carries
 * the footer.
 *
 * LANDING-FOOTER IS THE LANDING WITH THE FOOTER OPEN. The census settles it —
 * the Footer appears on 6 of the 36 frames on the Design page and all 6 are
 * landing-footer, none on projects, about, photos or project-detail at any
 * width. The user confirmed the behavioural half on 2026-09-12: the interaction
 * exists only here, and only while the landing is in its default closed state.
 * It does not open over Projects or About.
 *
 * <Footer /> is passed as children, not imported by FooterReveal. A Server
 * Component handed to a Client Component as a prop is not part of that
 * component's module graph — it is rendered on the server and passed in as
 * output. So the footer, and react-icons with it, stay out of the client bundle
 * exactly as Phase 5 verified; the island ships only the gesture. */

export default function LandingPage() {
  return (
    <>
      <PanelLayout state="landing" />
      <FooterReveal>
        <Footer />
      </FooterReveal>
    </>
  )
}
