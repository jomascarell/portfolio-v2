import { siteConfig } from '@/lib/site-config'
import styles from './MailLink.module.css'

/* Figma: MailLink, Size = md | sm, State = default | hover (hover takes the
   address to color/text/accent).
 *
 * The "Mail:" prefix is a visible label, not part of the address, so it sits
 * outside the <a>. Putting it inside would make the link's accessible name
 * "Mail: jmjvilallonga@gmail.com", which reads wrong in a screen reader's link
 * list — the link is the address.
 *
 * The component was renamed on the way over: in the retired build it was named
 * after its own content, which put a personal email address in a component
 * name. */

const SIZES = {
  md: styles.md,
  sm: styles.sm,
} as const

type MailLinkProps = {
  size?: keyof typeof SIZES
  className?: string
}

export default function MailLink({ size = 'md', className }: MailLinkProps) {
  return (
    <p
      className={[styles.root, SIZES[size], className]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={styles.label}>Mail: </span>
      <a className={styles.link} href={`mailto:${siteConfig.contactEmail}`}>
        {siteConfig.contactEmail}
      </a>
    </p>
  )
}
