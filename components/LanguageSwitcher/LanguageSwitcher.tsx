'use client'

import { useState } from 'react'
import { siteConfig } from '@/lib/site-config'
import styles from './LanguageSwitcher.module.css'

/* The footer's language control. Figma: language (786:409), Property 1 =
 * English | catalan | spanish.
 *
 * IT SELECTS BUT IT DOES NOT TRANSLATE, and that is the instruction rather
 * than an unfinished edge. The user asked for the component and its three
 * visual states built now, with state management, and left the actual
 * switching until there is translated content to switch to. So this tracks a
 * selection and paints it; nothing downstream reads it yet.
 *
 * It replaces a static string. `siteConfig.language` used to be the literal
 * 'EN' with a comment explaining that the design defined no states — the
 * design defines three now, so the comment's own condition expired.
 *
 * WHAT IT DELIBERATELY DOES NOT CLAIM. There is no `lang` attribute change and
 * no `hreflang`, because neither would be true: the page is still English
 * whichever option is lit. `aria-pressed` describes the selection honestly
 * without asserting that the document language changed. When the copy exists,
 * this grows a real consumer and the document's lang goes with it — that is
 * the point at which it stops being a widget and starts being navigation.
 *
 * THE THREE LABELS ARE NOT THE THREE CODES. Figma draws EN / CAT / ES, and the
 * Footer's own description in the file still says CAST for the third. The
 * drawing wins because it is what a visitor reads; the codes underneath are
 * BCP 47 (`en`, `ca`, `es`) so that the eventual `lang` attribute is valid
 * without a second mapping table. The mismatch between the drawing and the
 * description is on the list to settle in Figma.
 *
 * A client component, and the smallest one in the project. The Footer around
 * it stays a Server Component — this is the only island inside it, so
 * react-icons and the rest of the footer's content never reach the browser. */

/* siteConfig is `as const`, so the initial value alone would pin the state to
   the literal 'en' and reject the other two — tsc catches it, which is the
   whole reason the config is frozen. Widening to the union of what the array
   actually offers keeps that strictness pointed the right way: adding a fourth
   language to the config extends this type for free, and a code that is not in
   the array is still a compile error. */
type LanguageCode = (typeof siteConfig.languages)[number]['code']

export default function LanguageSwitcher({
  className,
}: {
  className?: string
}) {
  const [selected, setSelected] = useState<LanguageCode>(
    siteConfig.defaultLanguage
  )

  return (
    /* A group rather than a radiogroup: radios imply a form control that
       submits something, and this submits nothing. The accessible name is on
       the group so each button only has to carry its own label. */
    <div
      className={[styles.switcher, className].filter(Boolean).join(' ')}
      role="group"
      aria-label="Language"
    >
      {siteConfig.languages.map((language) => (
        <button
          key={language.code}
          type="button"
          className={styles.option}
          aria-pressed={language.code === selected}
          onClick={() => setSelected(language.code)}
        >
          {language.label}
        </button>
      ))}
    </div>
  )
}
