import NavLink from '@/components/NavLink/NavLink'
import { siteConfig } from '@/lib/site-config'
import styles from './NavLinks.module.css'

/* The top-level link bar: Projects / About / Photos.
 * Figma: NavLinks, Layout = row | stack (542:974).
 *
 * `Layout` STAYS A PROP, BUT `row` IS RESPONSIVE — corrected 2026-09-11.
 *
 * This comment used to say "row is used at every canvas including 412, so
 * naming the axis after a breakpoint would promise a mapping the component does
 * not make", and concluded there should be no media query in this file. The
 * premise is false. `landing / 412` is Layout=stack — a 97 x 220 vertical block
 * — and it is the only NavLinks below 640 in the entire design, because this
 * component renders on the landing and its footer state and nowhere else. The
 * claim was generalised from `projects / 412` and `about / 412`, which are
 * Layout=row, and those two carry a Breadcrumb rather than this component.
 *
 * So: the prop chooses the layout from 640 up, and below 640 there is only one
 * layout the design ever draws. The media query lives in the stylesheet.
 *
 * It renders on two frames in the whole design, the landing and its footer
 * state, and nowhere else. See NavLink for what that costs the active state.
 *
 * <nav> with a list inside: three sibling destinations are a list, and a
 * screen reader announcing "3 items" before them is the point. aria-label
 * distinguishes it from the Breadcrumb's <nav>, which never appears on the
 * same screen but is still a second landmark of the same type. */

const LAYOUTS = {
  row: styles.row,
  stack: styles.stack,
} as const

type NavLinksProps = {
  layout?: keyof typeof LAYOUTS
  className?: string
}

export default function NavLinks({ layout = 'row', className }: NavLinksProps) {
  return (
    <nav
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-label="Main"
    >
      <ul className={[styles.links, LAYOUTS[layout]].join(' ')}>
        {siteConfig.nav.map((item) => (
          <li key={item.href}>
            <NavLink href={item.href} label={item.label} />
          </li>
        ))}
      </ul>
    </nav>
  )
}
