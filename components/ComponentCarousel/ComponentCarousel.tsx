import CarouselTrack from './CarouselTrack'
import styles from './ComponentCarousel.module.css'

/* ComponentCarousel — one slide per component of a case study's system: a
 * coded sketch of where the component sits in the page, its name, its
 * Norman level, and a checklist of pros (check) and trade-offs (minus).
 *
 * Built 2026-09-30 for Emotional UX, where it replaces the ChartSystem table.
 * The four slides were drawn by the user as PNG exports (`01 · Trust Bar` to
 * `04 · Checkout Trust Layer`) modelled on calebwu.ca/RevisionDojo's
 * carousel; the geometry here is measured off those exports, and the
 * mechanism off his page — see CarouselTrack.
 *
 * TWO KINDS OF SKETCH. The coded one (Sketch, below) and the user's own
 * drawing (`image`), shown in the same frame with the same fade. Their first
 * 900 x 549 SVGs were reverted in favour of the coded ones; the 304 x 171
 * re-exports, drawn at display size, are being tried in their place. With
 * no `image`, a slide falls back to the coded sketch.
 *
 * TWO DELIBERATE DEPARTURES FROM THE EXPORTS, both the user's decisions:
 * the highlight and the progress marker take the site accent (blue) rather
 * than the exports' orange, and the levels are spelled the UK way
 * ("behavioural"), matching the prose around them.
 *
 * The slides render here, on the server; only the scroll tracking and the
 * progress buttons are client code. */

export type ComponentSketch =
  'trust-bar' | 'product-card' | 'cart-drawer' | 'checkout'

export type ComponentSlide = {
  title: string
  /* Norman level(s), e.g. "Visceral + behavioural". Set uppercase by CSS. */
  level: string
  sketch: ComponentSketch
  /* The user's own drawing of the same sketch, 304 x 171 — re-exported at
     the size it is shown, so its 1px lines stay whole. The latest export
     (2026-09-30) draws the highlight edge solid, not dashed. When set it
     replaces the coded one inside the same frame — same width, same fade,
     same title overlap. Being tried 2026-09-30; delete the four `image`
     lines in the data to go back to the coded sketches. */
  image?: string
  points: { text: string; pro: boolean }[]
}

export default function ComponentCarousel({
  label,
  slides,
}: {
  label: string
  slides: ComponentSlide[]
}) {
  return (
    <CarouselTrack label={label} titles={slides.map((slide) => slide.title)}>
      {slides.map((slide, index) => (
        <div
          key={slide.title}
          className={styles.slide}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${slides.length}: ${slide.title}`}
        >
          <div className={styles.slideContent}>
            {slide.image ? (
              <div className={styles.sketch} aria-hidden="true">
                <div className={`${styles.window} ${styles.drawn}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- a
                      vector; next/image would proxy it, not resize it. */}
                  <img src={slide.image} alt="" width={304} height={171} />
                </div>
              </div>
            ) : (
              <Sketch kind={slide.sketch} />
            )}
            <div className={styles.heading}>
              <h3 className={styles.title}>{slide.title}</h3>
              <p className={styles.level}>{slide.level}</p>
            </div>
            <ul className={styles.points}>
              {slide.points.map((point) => (
                <li key={point.text} className={styles.point}>
                  <Mark pro={point.pro} />
                  {point.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </CarouselTrack>
  )
}

/* The check and minus boxes. They carry meaning — pro or trade-off — so
   they are named for a screen reader rather than hidden. */
function Mark({ pro }: { pro: boolean }) {
  return (
    <span
      className={pro ? styles.check : styles.minus}
      role="img"
      aria-label={pro ? 'Pro:' : 'Trade-off:'}
    >
      <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">
        {pro ? <path d="M5 9.5 7.75 12.25 13 6.75" /> : <path d="M5.5 9h7" />}
      </svg>
    </span>
  )
}

/* A mini browser window, drawn on a 270 x 152 grid (the exports' 1x size)
   and scaled with its container. Every shape is a positioned span; the
   highlighted region is the component the slide is about. Decorative, since
   the slide's title already says what it points at. */
function Sketch({ kind }: { kind: ComponentSketch }) {
  return (
    <div className={styles.sketch} aria-hidden="true">
      <div className={styles.window}>
        <span className={styles.chrome}>
          <span className={styles.light} />
          <span className={styles.light} />
          <span className={styles.light} />
        </span>
        <span className={styles.logo} />
        {kind === 'trust-bar' || kind === 'product-card' ? (
          <>
            <span className={styles.navItem} data-i="0" />
            <span className={styles.navItem} data-i="1" />
            <span className={styles.navItem} data-i="2" />
          </>
        ) : null}
        <div className={styles.layout} data-kind={kind}>
          {kind === 'trust-bar' ? (
            <>
              <span className={styles.highlight}>
                <span className={styles.bar} />
                <span className={styles.bar} />
                <span className={styles.bar} />
              </span>
              <span className={styles.tile} />
              <span className={styles.tile} />
              <span className={styles.tile} />
            </>
          ) : kind === 'product-card' ? (
            <>
              <span className={styles.card}>
                <span className={styles.tile} />
                <span className={styles.line} />
                <span className={styles.line} />
              </span>
              <span className={`${styles.card} ${styles.highlight}`}>
                <span className={styles.tile} />
                <span className={styles.bar} />
                <span className={styles.bar} />
                <span className={styles.button} />
              </span>
              <span className={styles.card}>
                <span className={styles.tile} />
                <span className={styles.line} />
                <span className={styles.line} />
              </span>
            </>
          ) : kind === 'cart-drawer' ? (
            <>
              <span className={styles.tile} />
              <span className={styles.tile} />
              <span className={styles.highlight}>
                <span className={styles.bar} />
                <span className={styles.item}>
                  <span className={styles.thumb} />
                  <span className={styles.bar} />
                </span>
                <span className={styles.item}>
                  <span className={styles.thumb} />
                  <span className={styles.bar} />
                </span>
                <span className={styles.button} />
              </span>
            </>
          ) : (
            <span className={styles.highlight}>
              <span className={styles.steps}>
                <span className={styles.bar} />
                <span className={styles.bar} />
                <span className={styles.bar} />
              </span>
              <span className={styles.payment}>
                <svg viewBox="0 0 10 10" width="10" height="10">
                  <rect x="2" y="4.5" width="6" height="4.5" rx="1" />
                  <path d="M3.5 4.5V3.25a1.5 1.5 0 0 1 3 0V4.5" />
                </svg>
              </span>
              <span className={styles.summary}>
                <span className={styles.bar} />
                <span className={styles.bar} />
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
