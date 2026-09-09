import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
import Footer from '@/components/Footer/Footer'
import FooterReveal from '@/components/FooterReveal/FooterReveal'
import SkipLink, { SKIP_TARGET_ID } from '@/components/SkipLink/SkipLink'
import shell from './layout.module.css'
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

   Phase 5 added the persistent frame, the skip-link target, <Footer /> and the
   footer reveal. See layout.module.css for why the frame lives in the layout,
   and components/FooterReveal for how the reveal is triggered and why it sits
   in normal flow rather than fixed as the design's wording suggests. */

export const metadata: Metadata = {
  // The retired build shipped "Jan Mascarell" here for months. It is Joan.
  title: 'Joan Mascarell',
  description: 'Portfolio of Joan Mascarell — design and front-end work.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={figtree.variable}>
      <body>
        <div className={shell.shell}>
          <SkipLink />
          {/* The layout owns the document's ONE <main>, so pages must not
              render their own — they return a fragment. Every route did render
              its own until this was caught: the scaffold in Phase 2 gave each
              page a <main> before Phase 5 put one in the shell, which left two
              nested in the built HTML. That is invalid (main may not descend
              from main) and it costs exactly what the skip link is for — "jump
              to main" stops being a single unambiguous destination. jsx-a11y
              cannot see it because neither file is wrong on its own.

              tabIndex={-1} so the skip link can actually move focus here;
              without it the jump changes the URL and leaves focus behind. */}
          <main className={shell.content} id={SKIP_TARGET_ID} tabIndex={-1}>
            {children}
          </main>
          {/* <Footer /> is passed as children, not imported by FooterReveal.
              A Server Component handed to a Client Component as a prop is not
              part of that component's module graph — it is rendered on the
              server and passed in as output. So the footer, and react-icons
              with it, stay out of the client bundle exactly as Phase 5
              verified; the island ships only the observer. */}
          <FooterReveal>
            <Footer />
          </FooterReveal>
        </div>
      </body>
    </html>
  )
}
