import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
import './tokens.css'
import './globals.css'

/* Phase 4: the typeface. Figtree is the only family in the Figma file — all 14
   text styles and all 362 text nodes on the Design page use it, in four
   weights (Light 300, Regular 400, Medium 500, SemiBold 600).

   Loaded as a variable font, so no `weight` is passed and the whole 300–900
   axis ships in one file. Deliberate: tokens.css defines --font-weight-bold
   through --font-weight-black even though no current style reaches for them,
   and pinning a '300 600' range would let one of those tokens clamp silently
   later instead of just working.

   The CSS-variable method rather than `className` — typography belongs to the
   CSS Modules (Phase 2 decision), so the layout publishes the family as
   --font-figtree on <html> and globals.css sets the body default from it.
   `fallback` goes to the loader rather than being retyped in the stylesheet the
   way the retired build did, so there is one stack and Next controls its order.

   Verified in the built CSS, and worth knowing: under Turbopack these families
   ARE the fallback. Next has precalculated Figtree metrics (ascent 94.32,
   descent 24.82, size-adjust 100.72) and `adjustFontFallback` defaults to true,
   but only the webpack pipeline turns them into an @font-face — building the
   same source both ways gives

     turbopack  font-family: Figtree, system-ui, ...
     webpack    font-family: Figtree, Figtree Fallback, system-ui, ...
                @font-face { font-family: Figtree Fallback; src: local("Arial");
                             ascent-override: 94.32%; ... }

   Turbopack is the default in Next 16 and we build with it, so we ship the
   first line and take slightly more layout shift on a cold load than the
   webpack path would. Not worth switching builders over; revisit if the Phase
   11 audit measures CLS and it shows. */
const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-figtree',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
})

/* Phase 2 decision: the root layout owns everything that must survive a
   navigation. Layouts do not re-render when the route changes, so the frame,
   the footer and the skip link are persistent for free — that is what lets the
   shell feel continuous over real routes instead of a client-side pseudo-router.

   tokens.css is imported before globals.css so the custom properties are
   declared before anything could read them. It was generated from Figma once
   (Gate 03) rather than by a pipeline, so unlike the original plan it IS
   hand-editable — see its header for how to regenerate.

   Still to come:
   - Phase 5: the fixed frame, the skip-link target and <Footer />. */

export const metadata: Metadata = {
  // The retired build shipped "Jan Mascarell" here for months. It is Joan.
  title: 'Joan Mascarell',
  description: 'Portfolio of Joan Mascarell — design and front-end work.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={figtree.variable}>
      <body>{children}</body>
    </html>
  )
}
