/* " (opens in a new tab)", for screen readers only. Every link that sets
 * target="_blank" carries one (2026-10-01 audit): sighted readers get the
 * arrow or the context, a screen reader got nothing before the tab switched
 * under it. Links named by aria-label put the same words in the label
 * instead (SocialIcons), since aria-label replaces this text. */
export default function NewTabNote() {
  return <span className="visually-hidden"> (opens in a new tab)</span>
}
