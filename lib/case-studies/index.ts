import { embassaments } from './embassaments'
import { emotionalUx } from './emotional-ux'
import type { CaseStudy } from './types'

export * from './types'

/* Keyed by slug so the page can look one up, and so the projects that have
   no case study yet resolve to `undefined` rather than to a half-empty
   record. They keep the stub until their copy exists. */
export const caseStudies: Record<string, CaseStudy> = {
  [embassaments.slug]: embassaments,
  [emotionalUx.slug]: emotionalUx,
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies[slug]
}
