import CarouselTrack from './CarouselTrack'
import styles from './ComponentCarousel.module.css'

/* ComponentCarousel — one slide per component of a case study's system: the
 * user's drawing of where the component sits in the page, its name and its
 * Norman level. The pros / trade-offs checklist the exports drew was
 * removed 2026-10-05, by the user: it was the part that read most like a
 * copy of Caleb's carousel.
 *
 * Built 2026-09-30 for Emotional UX, where it replaces the ChartSystem table.
 * The four slides were drawn by the user as PNG exports (`01 · Trust Bar` to
 * `04 · Checkout Trust Layer`) modelled on calebwu.ca/RevisionDojo's
 * carousel; the geometry here is measured off those exports, and the
 * mechanism off his page — see CarouselTrack.
 *
 * THE SKETCHES ARE THE USER'S SVGs (`image`). A coded version (positioned
 * spans on a 270 x 152 grid) came first and served as the fallback until
 * 2026-10-05, when it was stripped out as dead code; it's in git history
 * before that date if it's ever wanted back.
 *
 * TWO DELIBERATE DEPARTURES FROM THE EXPORTS, both the user's decisions:
 * the highlight and the progress marker take the site accent (blue) rather
 * than the exports' orange, and the levels are spelled the UK way
 * ("behavioural"), matching the prose around them.
 *
 * The slides render here, on the server; only the scroll tracking and the
 * progress buttons are client code. */

export type ComponentSlide = {
  title: string
  /* Norman level(s), e.g. "Visceral + behavioural". Set uppercase by CSS. */
  level: string
  /* The user's drawing, 304 x 171 (16:9), in public/. Decorative: the
     slide's title already says what it points at. */
  image: string
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
            <div className={styles.sketch} aria-hidden="true">
              <div className={styles.window}>
                {/* eslint-disable-next-line @next/next/no-img-element -- a
                    vector; next/image would proxy it, not resize it. */}
                <img src={slide.image} alt="" width={304} height={171} />
              </div>
            </div>
            <div className={styles.heading}>
              <h3 className={styles.title}>{slide.title}</h3>
              <p className={styles.level}>{slide.level}</p>
            </div>
          </div>
        </div>
      ))}
    </CarouselTrack>
  )
}
