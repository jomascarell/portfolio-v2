import type { Metadata } from 'next'
import AboutBio from '@/components/AboutBio/AboutBio'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import PanelLayout from '@/components/PanelLayout/PanelLayout'

/* About. Figma: about / 1448 (492:2009) and its three siblings.
 *
 * The same panel-plus-content grid as /projects, and it takes PanelLayout's
 * defaults at every tier — 6 + 6 of twelve, 4 + 4 of eight, stacked below 768
 * — so there is no stylesheet for this screen at all. That is the shape to
 * keep: a page that needs no CSS of its own is a page whose layout is entirely
 * in the layout component, which is where the next screen will look for it.
 *
 * The panel reduces to the wordmark here (type="about"). The tagline and the
 * status lines are not hidden, they are not rendered — the bio beside it says
 * all of that in prose, and repeating it would be the panel arguing with the
 * page. IntroCard owns that decision; this only names the type.
 *
 * PHASE 9 replaces the bio copy. It is real prose rather than lorem because
 * Figma's AboutBio already had real prose — see lib/about.ts. */

export const metadata: Metadata = {
  title: 'About — Joan Mascarell',
}

export default function AboutPage() {
  return (
    <PanelLayout nav={<Breadcrumb label="About" />} type="about">
      <AboutBio />
    </PanelLayout>
  )
}
