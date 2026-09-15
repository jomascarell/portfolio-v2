/* Turns on the types for React's <ViewTransition>, which the App Router can use
   but @types/react does not expose by default.

   It is NOT an experimental opt-in in the usual sense, and the naming is
   misleading enough to be worth a note. The `react` package at the top of
   node_modules is 19.2.8 and genuinely has no ViewTransition export — checking
   it from Node says so. But App Router code is not given that copy: Next
   resolves `react` to its own vendored build, and
   node_modules/next/dist/compiled/react/cjs/react.production.js exports both
   `ViewTransition` and `addTransitionType`. The runtime is there; only the
   types were missing, and @types/react ships them in canary.d.ts behind this
   reference rather than in its main entry.

   So this file does not change what runs. It stops tsc from failing on an
   import that the bundler resolves perfectly well, which is the kind of
   mismatch that otherwise gets "fixed" with an `any`. */

/// <reference types="react/canary" />
