# portfolio-v2

Joan Mascarell's portfolio. Next.js 16 (App Router), React 19, TypeScript strict, CSS Modules.

The Figma file is the source of truth for design; this repo is the build of it.

## Running it

```bash
npm run dev      # http://localhost:3000
npm run build    # production build — every route is prerendered
npm run lint
```

## How it is arranged

Decisions that are easy to reverse are not documented here; decisions that are
not, are.

- **Everything is static.** All content lives in typed modules under `lib/`, so
  no route needs a request to render. `cacheComponents` is off, nothing reads
  `searchParams`, and there is no `loading.tsx`.
- **Real routes, with a shell that survives them.** The root layout owns the
  persistent chrome and does not re-render on navigation. Continuity between
  pages comes from React's `<ViewTransition>`, not from a client-side router.
- **Three client components, and no more:** `ProjectDeck`, `JoanMark`,
  `FooterReveal`. Everything else is a Server Component that ships no JS.
- **Styles are scoped.** `app/globals.css` holds the reset, the token import
  and the view-transition keyframes. Everything else is a `.module.css` sitting
  next to its component.
- **`app/tokens.css` is generated** from the Figma variables. Never hand-edit it.

## Before writing any code

Read `AGENTS.md`. This version of Next has breaking changes against most
published examples — `params` is a Promise, `PageProps`/`LayoutProps` are
generated globals, `middleware` is now `proxy` — and the authoritative docs are
installed locally at `node_modules/next/dist/docs/`.

## Routes

| Route              | Screen           |
| ------------------ | ---------------- |
| `/`                | landing          |
| `/projects`        | the project deck |
| `/projects/[slug]` | project detail   |
| `/about`           | about            |
| `/photos`          | photos           |

There is no `/contact` — contact was cut in the design; the email and social
links live in the footer and on the about page.
