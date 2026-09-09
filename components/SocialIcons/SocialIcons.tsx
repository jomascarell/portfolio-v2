import { SiGithub, SiInstagram } from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa'
import { BsFileEarmarkText } from 'react-icons/bs'
import { siteConfig } from '@/lib/site-config'
import styles from './SocialIcons.module.css'

/* Row of social links. Figma: SocialIcons, Size = lg | md | sm mapping to
   size/icon/lg|md|sm. The footer instance uses md (24px).
 *
 * These are the only icons in the project that come from a library. The rule
 * settled with the user: brand marks come from react-icons (Simple Icons keeps
 * them correct through rebrands, and they are tedious and error-prone to
 * hand-author); everything that is not a brand mark stays inline SVG.
 *
 * The fourth icon is the exception that proves it. The retired build used
 * react-icons' read.cv brand mark here, but Figma names this slot
 * `icon-document` and draws a generic document — the CV is a file, not an
 * account on a service. A document glyph is therefore correct and the brand
 * mark was not.
 *
 * The hover handle is carried over from the retired build's contact page at
 * the user's explicit request. Worth knowing when reading this against the
 * design: Figma's SocialIcons has a Size axis only and defines NO hover state,
 * while MailLink and NavLink in the same file both define one. So this
 * behaviour is ahead of the design rather than derived from it — if the two
 * are ever reconciled, this is the side that was written first. */

const SIZES = {
  lg: styles.lg,
  md: styles.md,
  sm: styles.sm,
} as const

type SocialIconsProps = {
  size?: keyof typeof SIZES
  className?: string
}

const LINKS = [
  { key: 'github', label: 'GitHub', Icon: SiGithub },
  { key: 'linkedin', label: 'LinkedIn', Icon: FaLinkedin },
  { key: 'instagram', label: 'Instagram', Icon: SiInstagram },
  { key: 'cv', label: 'CV', Icon: BsFileEarmarkText },
] as const

export default function SocialIcons({
  size = 'md',
  className,
}: SocialIconsProps) {
  return (
    <ul
      className={[styles.row, SIZES[size], className].filter(Boolean).join(' ')}
    >
      {LINKS.map(({ key, label, Icon }) => (
        <li key={key}>
          {/* aria-label carries the accessible name; react-icons marks its own
              <svg> aria-hidden, so the label is the only name this link has.
              The handle is aria-hidden on purpose — without it a screen reader
              announces the same network twice, once from the label and once
              from the visible text. */}
          <a
            className={styles.link}
            href={siteConfig.social[key].href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
          >
            <span className={styles.handle} aria-hidden="true">
              {siteConfig.social[key].handle}
            </span>
            <Icon className={styles.glyph} />
          </a>
        </li>
      ))}
    </ul>
  )
}
