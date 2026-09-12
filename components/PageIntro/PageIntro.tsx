import type { ReactNode } from 'react'
import IntroCard from '@/components/IntroCard/IntroCard'
import styles from './PageIntro.module.css'

/* The intro panel: a nav slot above the IntroCard.
 * Figma: PageIntro, Layout = row | stack (556:3103).
 *
 * Figma's two variants pair NavLinks row with IntroCard lg, and NavLinks stack
 * with IntroCard sm. Only half of that survives as a prop here, and the reason
 * is worth stating: the card's breakpoint is not a choice a screen makes, it
 * is three drawings of one card and it lives in media queries. What is left —
 * which nav goes in the slot, and in which layout — is genuinely per-screen.
 *
 * So the nav is a SLOT rather than a NavLinks the component builds itself.
 * The design puts NavLinks here on the landing and its footer state and the
 * Breadcrumb on projects and about, and a component that hard-coded NavLinks
 * would make the other half of the site impossible. It is a prop and not
 * `children` because the card is the other child and the two are not
 * interchangeable.
 *
 * The panel stays page-owned rather than moving into the root layout, and this
 * is the phase where that becomes concrete: a layout cannot vary its nav slot
 * per route without parallel routes, and it would still have to suppress
 * itself on the two screens that have no panel at all — project-detail and
 * photos carry no PageIntro. */

type PageIntroProps = {
  /* NavLinks on the landing, Breadcrumb everywhere else. */
  nav: ReactNode
  type?: 'intro' | 'about'
  className?: string
}

export default function PageIntro({
  nav,
  type = 'intro',
  className,
}: PageIntroProps) {
  return (
    <div className={[styles.panel, className].filter(Boolean).join(' ')}>
      {nav}
      <IntroCard type={type} className={styles.card} />
    </div>
  )
}
