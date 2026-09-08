import type { Metadata } from 'next'
import './tokens.css'
import './globals.css'

/* Phase 2 decision: the root layout owns everything that must survive a
   navigation. Layouts do not re-render when the route changes, so the frame,
   the footer and the skip link are persistent for free — that is what lets the
   shell feel continuous over real routes instead of a client-side pseudo-router.

   tokens.css is imported before globals.css so the custom properties are
   declared before anything could read them. It was generated from Figma once
   (Gate 03) rather than by a pipeline, so unlike the original plan it IS
   hand-editable — see its header for how to regenerate.

   Still to come:
   - Phase 4: the typefaces, via next/font.
   - Phase 5: the fixed frame, the skip-link target and <Footer />. */

export const metadata: Metadata = {
  // The retired build shipped "Jan Mascarell" here for months. It is Joan.
  title: 'Joan Mascarell',
  description: 'Portfolio of Joan Mascarell — design and front-end work.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
