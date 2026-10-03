import { notFound } from 'next/navigation'

/* Every URL that matches no other route lands here and becomes the site's own
   404 (app/[lang]/not-found.tsx), inside the shell and in the visitor's
   language. Without it, an unmatched URL never reaches [lang]/not-found: the
   root layout sits under the dynamic [lang] segment, so Next served its bare
   default 404 instead (live until 2026-10-03). The alternative,
   global-not-found, is experimental and renders outside the layout, so it
   would lose the nav and the language.

   dynamicParams = true, because the root layout's `false` reaches this route
   too, and a path no one can enumerate would then never render at all. */
export const dynamicParams = true

export default function Missing() {
  notFound()
}
