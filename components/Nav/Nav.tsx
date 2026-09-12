import Link from 'next/link'
import NavLink from '@/components/NavLink/NavLink'
import { siteConfig } from '@/lib/site-config'
import styles from './Nav.module.css'

/* The site nav, in five states. Figma: Nav (829:233), State = landing |
 * projects | about | photos | project-detail x Layout = row | stack.
 *
 * ONE COMPONENT, NOT TWO. `NavLinks` and `Breadcrumb` were merged into this
 * set in Figma on 2026-09-12 and no longer exist there; this is the code half
 * of that change. They were two components because they looked like two
 * things — a row of pills and a trail — but they are one thing in two states:
 * the same slot, the same 64/32 band, the same radius, mounted once and
 * animated between. Keeping them apart is what made the morph impossible to
 * express, because there was no single element for the browser to pair.
 *
 * WHY THE MERGE IS NOT A REGRESSION, which matters because the file has been
 * here before. `NavLinks`' own description recorded that it "was half of the
 * old nav-v2 set, which mixed this component with Breadcrumb on a single
 * axis" — these two were deliberately SPLIT APART once. The fault in nav-v2
 * was the single conflated axis, not the merge: State and Layout are genuinely
 * independent, so a two-axis set is a different object from the one that was
 * broken up. That reasoning lives in the Nav set's own description in Figma so
 * it cannot be re-litigated from muscle memory, and it is repeated here for
 * the same reason.
 *
 * THE GROUND HANDS OFF, and that is the whole visual trick. On the landing
 * each pill carries color/surface/subtle and the container is transparent;
 * inside, the container takes the fill and the items go transparent. That is
 * what makes three pills read as merging into one, and it falls out of the two
 * states' existing styles rather than being staged — NavLink paints itself,
 * `.pill` paints the container.
 *
 * The outer band is identical in both states — space/3xl above, space/xl below
 * — which is the measurement that made this cheap. Both inner containers are
 * already radius/lg too. Caleb has to animate radius and padding and a wrapper
 * offset; we animate position and width and nothing else.
 *
 * LAYOUT IS REAL BUT NARROW. Only the landing has a drawn stack — landing / 412
 * — and projects, about, photos and project-detail keep the row pill at every
 * width. Figma carries the four interior x stack variants anyway to complete
 * the matrix, and calls them intentional duplicates. Here that means `layout`
 * changes nothing on the interior states, and `row` is itself responsive: it
 * stacks below 640 on its own, because there is no frame in the file that
 * keeps the landing's pills in a row at 412.
 *
 * project-detail takes the project's own title, which is why `label` is
 * required on that state and defaulted on the others. */

const SECTION_LABEL = {
  projects: 'Projects',
  about: 'About',
  photos: 'Photos',
} as const

type SectionState = keyof typeof SECTION_LABEL

type NavProps = {
  layout?: 'row' | 'stack'
  className?: string
} & (
  | { state: 'landing'; label?: never }
  | { state: SectionState; label?: string }
  /* No default is possible — the label is the project's title, which this
     component cannot know. TypeScript makes that a compile error rather than a
     placeholder that ships. */
  | { state: 'project-detail'; label: string }
)

/* Both icons are inline SVG rather than an icon-library import, per the
   architecture decision: react-icons is in the project for brand marks only,
   because those have to stay accurate through a rebrand. Everything else is
   the file's own drawing, and these two are exported from it.

   The house is two paths, not the three Figma exports — the door is drawn
   twice in the export, identical `d` and identical fill, so the duplicate is
   dropped and nothing changes visually. The export's clipPath goes too: the
   outer path is exactly 16 x 16, so it clips nothing. */

function HomeIcon() {
  return (
    <svg className={styles.houseIcon} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M11.3333 11.9948V15.9948H14C15.1046 15.9948 16 15.0994 16 13.9948V7.91414C16.0002 7.5678 15.8656 7.23499 15.6247 6.98614L9.95934 0.861455C8.95972 -0.220108 7.27259 -0.286514 6.19103 0.713111C6.13966 0.760611 6.09016 0.81008 6.04269 0.861455L0.387344 6.98414C0.139156 7.23402 -0.0000937027 7.57196 0 7.92414V13.9948C0 15.0994 0.895437 15.9948 2 15.9948H4.66666V11.9948C4.67912 10.1769 6.14684 8.69242 7.91894 8.64967C9.75031 8.60549 11.3194 10.1153 11.3333 11.9948Z" />
      <path d="M8 9.99451C6.89544 9.99451 6 10.8899 6 11.9945V15.9945H10V11.9945C10 10.8899 9.10456 9.99451 8 9.99451Z" />
    </svg>
  )
}

function CaretIcon() {
  return (
    <svg className={styles.caret} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9.00001 15.3896V8.61043C8.99925 8.48989 9.03752 8.37186 9.10994 8.27141C9.18236 8.17095 9.28565 8.09262 9.40664 8.04639C9.52763 8.00017 9.66085 7.98815 9.78929 8.01186C9.91774 8.03557 10.0356 8.09394 10.1279 8.17953L13.8082 11.5721C13.931 11.6858 14 11.8397 14 12C14 12.1603 13.931 12.3142 13.8082 12.4279L10.1279 15.8205C10.0356 15.9061 9.91774 15.9644 9.78929 15.9881C9.66085 16.0119 9.52763 15.9998 9.40664 15.9536C9.28565 15.9074 9.18236 15.829 9.10994 15.7286C9.03752 15.6281 8.99925 15.5101 9.00001 15.3896Z" />
    </svg>
  )
}

export default function Nav({
  state,
  label,
  layout = 'row',
  className,
}: NavProps) {
  const root = [styles.root, className].filter(Boolean).join(' ')

  /* The landing: three pills, no current page. NavLink has two states and not
     three for exactly this reason — on `/` none of Projects, About or Photos
     is current, so an active pill had no reachable consumer anywhere in the
     design. "You are here" lives on the breadcrumb's label below, with
     aria-current on it and on nothing else in the site. */
  if (state === 'landing') {
    return (
      <nav className={root} aria-label="Main">
        <ul
          className={[
            styles.links,
            layout === 'stack' ? styles.stack : styles.row,
          ].join(' ')}
        >
          {siteConfig.nav.map((item) => (
            <li key={item.href}>
              <NavLink href={item.href} label={item.label} />
            </li>
          ))}
        </ul>
      </nav>
    )
  }

  const current = label ?? SECTION_LABEL[state as SectionState]

  /* ONE DELIBERATE STRUCTURAL DEVIATION, carried over from Breadcrumb. Figma
     nests the caret inside the home-link frame, alongside the house icon and
     the word "Joan". Only the home-link half is interactive, so shipping that
     nesting would put the separator inside the anchor — enlarging the click
     target past the word it links and adding a glyph to the link's accessible
     name. The caret is a sibling here, aria-hidden, and the spacing is
     reproduced exactly: 8px from the link, 16px to the label, which is what
     Figma's 8px inner gap and 16px pill gap add up to. */
  return (
    <nav className={root} aria-label="Breadcrumb">
      <ol className={styles.pill}>
        <li className={styles.crumb}>
          <Link className={styles.home} href="/">
            <HomeIcon />
            <span>Joan</span>
          </Link>
          <CaretIcon />
        </li>
        <li>
          <span className={styles.current} aria-current="page">
            {current}
          </span>
        </li>
      </ol>
    </nav>
  )
}
