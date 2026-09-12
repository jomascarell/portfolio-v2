/* Content module for /about.
 *
 * The bio is the one the retired build shipped. Figma's AboutBio component
 * (492:2172) draws the same prose, but the RETIRED BUILD is the better source
 * and the user pointed at it deliberately: a drawing shows that a word is
 * underlined, it does not show where the underline goes. `git show
 * 08d3ea7:components/Reverso.tsx` in ~/dev/portfolio has both destinations and,
 * in its own commentary, the reasoning behind the third one.
 *
 * Phase 9 replaces the prose; the two hrefs below should survive it.
 *
 * THE THREE MARKED WORDS ARE NOT THREE OF A KIND — this is what reading the
 * old code settled, and what the drawing alone could not:
 *
 *   Okisam   a link, https://okisam.com/
 *   Strava   a link, https://www.strava.com/athletes/125006587
 *   Designer NOT a link. An <em>. It carries emphasis, and the design gives
 *            emphasis a plain underline in the text's own ink rather than
 *            italics — which is exactly why it reads as underlined-but-not-
 *            accent-coloured in the drawing while the other two are accent.
 *
 * Reverso.tsx also records that the underline CHANGED between designs: on the
 * old landing "Designer" had a wavy accent underline, and the card design
 * replaced it with a solid one in the body ink. Worth knowing because that
 * file's own CSS does not do what its comment says — the shorthand
 * `text-decoration: var(--color-accent) wavy underline` sets the colour, and
 * the `text-decoration-style: solid` on the next line overrides only the style,
 * so v1 shipped a solid ACCENT underline. The comment is right and the code was
 * wrong; the drawing agrees with the comment, so that is what is built here.
 *
 * Paragraphs are arrays of LINES, and lines are arrays of SEGMENTS. The first
 * paragraph is the only one with two lines. See AboutBio.tsx for what that
 * structure does, and the open question about it below.
 *
 * OPEN — DO NOT SILENTLY "FIX" THE FIRST PARAGRAPH. The retired build is
 * explicit that "Hi, I'm Joan." and "Designer, crafting UI for the web." are
 * ONE paragraph joined by a <br>, "which is what they always were in the
 * design". The v2 Figma text node disagrees: it measures 360px tall, which is
 * twelve 30px line boxes, and twelve only works if there is a blank line
 * between them — eleven is what a <br> gives. That node also has a stray
 * leading space on the second line, so the likeliest reading is a stray return
 * typed next to it rather than a change of intent. It is drawn one way and
 * documented the other, and it is the user's to settle. The <br> stays until
 * then, because that is the side with a stated reason.
 *
 * Apostrophes are straight, exactly as both sources have them. Typographic ones
 * would read better, but that is a copy change and copy belongs to Phase 9. */

export type BioSegment =
  /* Plain text. */
  | string
  /* Emphasis. Underlined in body ink, never italic — see above. */
  | { em: string }
  /* An outbound link. Every one of these opens in a new tab, which is the
     retired build's behaviour and the right default for a link that leaves a
     portfolio mid-read. */
  | { text: string; href: string }

/* Segments that render on one visual line. */
export type BioLine = BioSegment[]

/* Lines separated by <br />; paragraphs separated by a full empty line. */
export type BioParagraph = BioLine[]

export const bio: BioParagraph[] = [
  [["Hi, I'm Joan."], [{ em: 'Designer' }, ', crafting UI for the web.']],
  [
    [
      "Master's grad, specializing in frontend design, building on a bachelor's in digital design.",
    ],
  ],
  [
    [
      /* The retired build writes this as `at&nbsp;` with the anchor on the next
         source line. That is a JSX formatting artifact — the non-breaking space
         is there so the significant space survives the line break in the file —
         not a typographic decision, so it is an ordinary space here. */
      'I recently interned at ',
      { text: 'Okisam', href: 'https://okisam.com/' },
      ', a solution-driven design agency, developing my first component-based CSS design system from scratch.',
    ],
  ],
  [
    [
      'Outside of design, you can find me on ',
      { text: 'Strava', href: 'https://www.strava.com/athletes/125006587' },
      ', or on the peak of some random mountain.',
    ],
  ],
]
