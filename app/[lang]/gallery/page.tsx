import type { Metadata } from 'next'
import AboutBio from '@/components/AboutBio/AboutBio'
import ContactBio from '@/components/ContactBio/ContactBio'
import IntroCard from '@/components/IntroCard/IntroCard'
import MailLink from '@/components/MailLink/MailLink'
import NavLink from '@/components/NavLink/NavLink'
import { NavPreview } from '@/components/Nav/Nav'
import PageIntro from '@/components/PageIntro/PageIntro'
import ProjectList from '@/components/ProjectList/ProjectList'
import ProjectListRow from '@/components/ProjectListRow/ProjectListRow'
import SocialIcons from '@/components/SocialIcons/SocialIcons'
import Wordmark from '@/components/Wordmark/Wordmark'
import { projects } from '@/lib/projects'
import styles from './gallery.module.css'

/* The component gallery: every component this build has, in every state it
 * has, on one page. It is the thing Gate 06 is reviewed against.
 *
 * It is a real route rather than a tool, because a real route is rendered by
 * the real build, inside the real shell, with the real stylesheet order. A
 * component that only looks right in a viewer is a component that has not
 * been proven.
 *
 * noindex: it is for us, not for search. Whether it ships to production at all
 * is a Phase 12 decision — it costs one static page and it is the fastest way
 * to see a regression, so the default is to keep it.
 *
 * TWO THINGS THIS PAGE CANNOT SHOW BY ITSELF, both by design:
 *
 * 1. Hover states. NavLink, Nav's breadcrumb home link and MailLink change on
 *    :hover, and none of them takes a prop to force it — hover the element and
 *    the real rule fires, which is better evidence than a duplicate class that
 *    could drift from it. ProjectListRow is the exception: it has a `state`
 *    prop because Phase 8 needs to light a row the pointer is not over, and
 *    since the prop exists the gallery uses it.
 *
 * 2. Breakpoints. IntroCard is the only component here with breakpoint rules,
 *    and since the phase 7 rewrite there is ONE ladder rather than three: the
 *    type and the wordmark step at 640, the box opens at 1024, the same on
 *    every screen. Type=about is the exception in one place only, taking the
 *    wide box at 640 and giving it back at 768, which the drawing does
 *    deliberately. Resize the window; everything else here is fluid or takes a
 *    prop. */

export const metadata: Metadata = {
  title: 'Component gallery',
  robots: { index: false, follow: false },
}

function Section({
  title,
  node,
  note,
  children,
}: {
  title: string
  node: string
  note?: string
  children: React.ReactNode
}) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>
        {title} <span className={styles.node}>{node}</span>
      </h2>
      {note ? <p className={styles.note}>{note}</p> : null}
      <div className={styles.specimens}>{children}</div>
    </section>
  )
}

function Specimen({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className={styles.specimen}>
      <p className={styles.label}>{label}</p>
      <div className={styles.stage}>{children}</div>
    </div>
  )
}

export default function GalleryPage() {
  return (
    <div className={styles.gallery}>
      <h1 className={styles.title}>Component gallery</h1>
      <p className={styles.standfirst}>
        Twelve components, in every state the Figma file defines. Hover the
        links to see their hover states, and resize the window to move IntroCard
        through its three breakpoints.
      </p>

      <Section
        title="Wordmark"
        node="482:1733"
        note="Four curved letterforms, not the retired build's 15-rectangle grid. Size is a height; the width follows the viewBox."
      >
        <Specimen label="Size = lg">
          <Wordmark size="lg" />
        </Specimen>
        <Specimen label="Size = sm">
          <Wordmark size="sm" />
        </Specimen>
      </Section>

      <Section
        title="NavLink"
        node="545:123"
        note="Two states, not three: State = active was deleted from the file and has no consumer under the nav rule. The 8/32 padding is asymmetric on purpose."
      >
        <Specimen label="State = default (hover it for State = hover)">
          <NavLink href="/projects" label="Projects" />
        </Specimen>
      </Section>

      <Section
        title="Nav"
        node="829:233"
        note="One component, five states, mounted once in the root layout and self-routed from usePathname() there — this page shows NavPreview instead, a static, non-animated stand-in that can render six states side by side, which the real singleton never could. Layout=stack was retired 2026-09-15: Nav never stacks at any width now, matching calebwu.ca confirmed down to 275px. Watch the ground hand off: on landing the pills paint and the container does not, and inside it is the other way round."
      >
        <Specimen label="State = landing">
          <NavPreview state="landing" />
        </Specimen>
        <Specimen label="State = projects">
          <NavPreview state="projects" />
        </Specimen>
        <Specimen label="State = about">
          <NavPreview state="about" />
        </Specimen>
        <Specimen label="State = photos">
          <NavPreview state="photos" />
        </Specimen>
        <Specimen label="State = project-detail">
          <NavPreview state="project-detail" label="Emotional UX in e-commerce" />
        </Specimen>
      </Section>

      <Section
        title="IntroCard"
        node="482:1157"
        note="Type is a prop, Breakpoint is media queries — one ladder, thresholds at 640 and 1024. The card paints nothing — no fill and no shadow at any variant."
      >
        <Specimen label="Type = intro">
          <IntroCard type="intro" />
        </Specimen>
        <Specimen label="Type = about (the wordmark alone)">
          <IntroCard type="about" />
        </Specimen>
      </Section>

      <Section
        title="PageIntro"
        node="556:3103"
        note="The panel: IntroCard alone. No nav slot any more — retired 2026-09-15 alongside the persistent-Nav rewrite, since Nav no longer travels with whichever page renders it."
      >
        <Specimen label="Type = intro">
          <PageIntro />
        </Specimen>
        <Specimen label="Type = about">
          <PageIntro type="about" />
        </Specimen>
      </Section>

      <Section
        title="ContactBio"
        node="791:1813"
        note="The footer's old contact surface, moved under the bio. The address is MailLink rather than the drawing's plain text, so it is actually clickable. Narrow the window: the social row wraps to its own line without a breakpoint."
      >
        <Specimen label="Default">
          <ContactBio />
        </Specimen>
      </Section>

      <Section title="AboutBio" node="791:1876" note="Figma's AboutBio+Contact — the prose and ContactBio as one object.">
        <Specimen label="Default">
          <AboutBio />
        </Specimen>
      </Section>

      <Section
        title="ProjectListRow"
        node="543:111"
        note="The state is a colour change and nothing else. The whole row is the link."
      >
        <Specimen label="State = default">
          <ProjectListRow project={projects[0]} />
        </Specimen>
        <Specimen label="State = hover (forced)">
          <ProjectListRow project={projects[1]} state="hover" />
        </Specimen>
      </Section>

      <Section
        title="ProjectList"
        node="282:752"
        note="One variant serves all six widths — md and lg are unbuilt in Figma. This becomes the deck in Phase 8."
      >
        <Specimen label="Breakpoint = base">
          <ProjectList />
        </Specimen>
      </Section>

      <Section
        title="MailLink"
        node="444:1418"
        note="Built in Phase 5. Here so the gallery is the whole set."
      >
        <Specimen label="Size = md">
          <MailLink size="md" />
        </Specimen>
        <Specimen label="Size = sm">
          <MailLink size="sm" />
        </Specimen>
      </Section>

      <Section
        title="SocialIcons"
        node="307:769"
        note="Built in Phase 5. The hover handle is ahead of the design — Figma defines no state for this component."
      >
        <Specimen label="Size = lg">
          <SocialIcons size="lg" />
        </Specimen>
        <Specimen label="Size = md">
          <SocialIcons size="md" />
        </Specimen>
        <Specimen label="Size = sm">
          <SocialIcons size="sm" />
        </Specimen>
      </Section>

      <Section
        title="Footer"
        node="236:2725"
        note="Built in Phase 5 and rendered by the root layout, so it is already at the bottom of this page — including its reveal. Scroll."
      >
        <Specimen label="See below">
          <p className={styles.pointer}>
            Three grids, one per breakpoint, and the reveal animates on the way
            in and out.
          </p>
        </Specimen>
      </Section>
    </div>
  )
}
