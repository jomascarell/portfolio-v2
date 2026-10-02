/* WHEN THE PANEL MORPHS, decided in one place (2026-10-02).
 *
 * The landing's panel pairs with the projects panel and the photos rail
 * (`page-intro`), and the pair used to morph on every navigation between them.
 * Arriving at the landing, that broke: the landing replays its entrance on
 * every arrival (globals.css, THE GATE), so its panel starts invisible and
 * tilted, and the morph flew the old panel into that. Projects -> Home and
 * Photos -> Home glitched; About -> Home, which has no panel to pair, was
 * smooth, and is the behaviour every arrival at Home now copies.
 *
 * So the morph is opt-in per navigation. Only links that LEAVE the landing tag
 * their navigation FROM_HOME (Nav's landing labels), and the pair morphs only
 * under that tag. Every other navigation, including the browser's back and
 * forward buttons, which carry no tag, falls back to the page fade. */
export const FROM_HOME = 'from-home'

export const PANEL_SHARE = { [FROM_HOME]: 'morph', default: 'none' }
