/* Content module for /about.
 *
 * The bio is transcribed from the Figma AboutBio component (492:2172), which
 * is the only place it exists — there was no /about route in the retired
 * build and no content module behind it. Phase 9 replaces this with final
 * copy; it is real prose rather than lorem because Figma already had real
 * prose, and laying out a paragraph against lorem hides exactly the wrapping
 * problems this block has.
 *
 * Paragraphs are arrays of LINES, not single strings, because the drawn text
 * distinguishes the two: a hard break inside the first paragraph puts
 * "Designer, crafting UI for the web." on its own line with no blank line
 * before it, while the other paragraphs are separated by a full empty line.
 * One <p> per paragraph and <br /> between lines reproduces both, and lets
 * the paragraph gap be a style rule rather than a character in the copy.
 *
 * Two fidelity notes. Figma's second line begins with a leading space
 * (" Designer, crafting…"); it is a typo in the text node rather than spacing
 * — HTML would collapse it anyway — so it is dropped. And the apostrophes are
 * straight, exactly as the file has them; typographic ones would read better
 * but that is a copy change, and copy belongs to Phase 9. */

export const bio: string[][] = [
  ["Hi, I'm Joan.", 'Designer, crafting UI for the web.'],
  [
    "Master's grad, specializing in frontend design, building on a bachelor's in digital design.",
  ],
  [
    'I recently interned at Okisam, a solution-driven design agency, developing my first component-based CSS design system from scratch.',
  ],
  [
    'Outside of design, you can find me on Strava, or on the peak of some random mountain.',
  ],
]
