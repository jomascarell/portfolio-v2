import NavLink from '@/components/NavLink/NavLink'
import { siteConfig } from '@/lib/site-config'
import styles from './NavLinks.module.css'

/* The top-level link bar: Projects / About / Photos.
 * Figma: NavLinks, Layout = row | stack (542:974).
 *
 * `Layout` is a prop, not a breakpoint, and the component's own description in
 * Figma says why: row is used at every canvas including 412, so naming the
 * axis after a breakpoint would promise a mapping the component does not make.
 * Which layout a screen takes is chosen per instance — which is exactly what a
 * prop is. That is also why there is no media query in this file.
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
