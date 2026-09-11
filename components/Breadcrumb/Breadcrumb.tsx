import Link from 'next/link'
import styles from './Breadcrumb.module.css'

/* The trail back to home. Figma: Breadcrumb, Section = about | projects |
 * photos | project-detail (542:975).
 *
 * The four variants are identical except for one string, so the prop is that
 * string rather than a section enum: `Section=project-detail` already proves
 * the point, since its label is "Project name" — a placeholder for content the
 * component cannot know. An enum would have to carry an escape hatch for that
 * one case, which is a longer way of writing `label`.
 *
 * It appears on every screen except the landing and its footer state, which
 * carry NavLinks instead. That division is the nav model, and this component
 * is the half of it that answers "where am I": the current-section label here
 * is where the active state lives, which is why NavLink no longer has one.
 *
 * ONE DELIBERATE STRUCTURAL DEVIATION. Figma nests the caret inside the
 * home-link frame, alongside the house icon and the word "Joan". Only the
 * home-link half is interactive, so shipping that nesting would put the
 * separator inside the anchor — enlarging the click target past the word it
 * links and adding a glyph to the link's accessible name. The caret is a
 * sibling here, aria-hidden, and the spacing is reproduced exactly: 8px from
 * the link, 16px to the label, which is what Figma's 8px inner gap and 16px
 * pill gap add up to. */

type BreadcrumbProps = {
  /* The current page. "Projects", "About", "Photos", or a project's title. */
  label: string
  className?: string
}

/* Both icons are inline SVG rather than an icon-library import, per the
   architecture decision: react-icons is in the project for brand marks only,
   because those have to stay accurate through a rebrand. Everything else is
   the file's own drawing, and these two are exported from it.

   The house is two paths, not the three Figma exports — the door is drawn
   twice in the component, identical `d` and identical fill. The duplicate is
   dropped; nothing changes visually. The export's clipPath is dropped too: the
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

export default function Breadcrumb({ label, className }: BreadcrumbProps) {
  return (
    <nav
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-label="Breadcrumb"
    >
      <ol className={styles.pill}>
        <li className={styles.crumb}>
          <Link className={styles.home} href="/">
            <HomeIcon />
            <span>Joan</span>
          </Link>
          <CaretIcon />
        </li>
        <li>
          {/* The current page is not a link — that is the whole convention —
              so aria-current sits on this label and on nothing else in the
              site. */}
          <span className={styles.current} aria-current="page">
            {label}
          </span>
        </li>
      </ol>
    </nav>
  )
}
