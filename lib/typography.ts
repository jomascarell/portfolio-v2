/* Keeps a hyphenated word on one line ("e-commerce" was breaking after "e-" in
 * the /projects row on iPad and the case h1 on iPhone).
 *
 * A word joiner (U+2060) goes after each hyphen that sits between two letters.
 * It is zero-width and forbids the break the hyphen would otherwise allow.
 * The non-breaking hyphen (U+2011) would be the obvious choice, but Figtree
 * has no glyph for it: Chromium and WebKit draw it from the fallback font
 * (Segoe UI here), a slightly different dash. The joiner keeps Figtree's own
 * hyphen. Measured 2026-10-06 in Chromium, Firefox and WebKit.
 *
 * Display text only. Titles also feed <title> and the og tags, which should
 * stay plain, so call this where a title is rendered, not in the data. */
export function keepHyphens(text: string): string {
  return text.replace(/(\p{L})-(?=\p{L})/gu, '$1-⁠')
}
