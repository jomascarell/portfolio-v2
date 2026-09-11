import type { Metadata } from 'next'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import PanelLayout from '@/components/PanelLayout/PanelLayout'
import ProjectList from '@/components/ProjectList/ProjectList'
import styles from './projects.module.css'

/* The project list. Figma: projects / 1448 (482:1878) and its three siblings.
 *
 * Panel on the left, list on the right, on the shared page grid. The split is
 * 6 + 6 of twelve at lg and 4 + 4 of four stacked below 768 — both the
 * PanelLayout defaults — but 5 + 3 of eight at md, which is this screen's own
 * and is set below.
 *
 * PHASE 8 turns the list into the stepped deck. It replaces what ProjectList
 * renders, not where it sits: this screen keeps its grid cell either way,
 * which is the point of building the layout before the behaviour.
 *
 * Deck position deliberately stays out of the URL. Reading searchParams would
 * opt this route into dynamic rendering, and giving each card its own URL later
 * is a routing change we can still make — going the other way is not. */

export const metadata: Metadata = {
  title: 'Projects — Joan Mascarell',
}

export default function ProjectsPage() {
  return (
    <PanelLayout
      className={styles.screen}
      nav={<Breadcrumb label="Projects" />}
    >
      <ProjectList />
    </PanelLayout>
  )
}
