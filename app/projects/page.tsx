import type { Metadata } from 'next'
import PanelLayout from '@/components/PanelLayout/PanelLayout'
import ProjectList from '@/components/ProjectList/ProjectList'

/* The project list. Figma: phase 7, projects / 1448 (793:2044) and its five
 * siblings.
 *
 * NOT A SEPARATE PAGE, despite having a URL of its own. It is the landing with
 * the list open beside the panel, and it renders the same PanelLayout the
 * landing does — only the state differs. The panel does not remount across the
 * navigation; it morphs from the centre of the screen to the left, and the list
 * arrives in the cell it vacates.
 *
 * The URL stays real and addressable. The user was explicit that these keep
 * their own routes: deep links, the back button and the breadcrumb all depend
 * on it, and "not a separate page" describes the composition, not the address.
 *
 * The grid, the spans and the breadcrumb all live in PanelLayout now. This file
 * had a stylesheet of its own until 2026-09-12; everything in it was a
 * statement about where the panel and the list sit, which is exactly what the
 * layout component is for.
 *
 * PHASE 8 turns the list into the stepped deck and gives its rows the entrance
 * the user chose — every row flying in independently from the right, rather
 * than one container moving into place. It replaces what ProjectList renders,
 * not where it sits.
 *
 * Deck position deliberately stays out of the URL. Reading searchParams would
 * opt this route into dynamic rendering, and giving each card its own URL later
 * is a routing change we can still make — going the other way is not. */

export const metadata: Metadata = {
  title: 'Projects — Joan Mascarell',
}

export default function ProjectsPage() {
  return (
    <PanelLayout state="projects">
      <ProjectList />
    </PanelLayout>
  )
}
