import Link from 'next/link'
import styles from './NavLink.module.css'

/* One nav pill. Figma: NavLink, State = default | hover (545:123).
 *
 * Two states, not three. `State=active` was deleted from the file on
 * 2026-09-09 and the reasoning is worth keeping next to the code, because the
 * obvious instinct is to add it back: Nav's landing state renders on the
 * footer state ONLY, where the current page is `/` and none of Projects,
 * About or Photos is current — so an active pill had no reachable consumer
 * anywhere in the design. The accent-thumb pattern it was copied from is the
 * reference site's deck PAGINATION, not its navigation. Interior screens carry
 * the Breadcrumb instead, and the breadcrumb's current-section label is where
 * "you are here" lives — with aria-current on it, not here.
 *
 * The focus ring is invented: the Figma component defines no focus state, as
 * none of the twelve do. It follows the precedent Phase 5 set on SocialIcons —
 * :focus-visible outside the (hover: hover) query, the hover rule inside it —
 * and is on the drift table for you to either draw or declare code-owned. */

type NavLinkProps = {
  href: string
  label: string
  className?: string
}

export default function NavLink({ href, label, className }: NavLinkProps) {
  return (
    <Link
      className={[styles.pill, className].filter(Boolean).join(' ')}
      href={href}
    >
      <span className={styles.label}>{label}</span>
    </Link>
  )
}
