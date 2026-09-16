import IntroCard from '@/components/IntroCard/IntroCard'
import styles from './PageIntro.module.css'

/* The intro panel. Figma: PageIntro (556:3103).
 *
 * NO NAV SLOT HERE ANY MORE — retired 2026-09-15 alongside the persistent-Nav
 * rewrite (see components/Nav/Nav.tsx and the Reference page). This used to
 * hold a `nav: ReactNode` prop because Nav was page-owned: each route decided
 * which state to render and handed it down through here. Nav is now mounted
 * once in the root layout and reads the route itself, so there is nothing
 * left for this component to receive or place — it is IntroCard's own panel
 * and nothing else.
 *
 * That also settles the question the previous version of this comment raised
 * and left open: "a layout cannot vary its nav slot per route... and it would
 * still have to suppress itself on the two screens that have no panel at
 * all." It doesn't have to, because Nav no longer lives in the panel at all —
 * project-detail and photos get the same persistent Nav as everywhere else,
 * from the layout, same as they get the persistent footer-less shell. */

type PageIntroProps = {
  type?: 'intro' | 'about'
  className?: string
}

export default function PageIntro({ type = 'intro', className }: PageIntroProps) {
  /* The panel has no entrance of its own — see the note in app/globals.css on
     what the 2026-09-16 restructure retired and why. The beats are the nav and
     the wordmark together, then the text. */
  return (
    <div className={[styles.panel, className].filter(Boolean).join(' ')}>
      <IntroCard type={type} className={styles.card} />
    </div>
  )
}
