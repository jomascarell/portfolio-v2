/* Emotional UX in e-commerce — the case study content.
 *
 * Source: the Figma page `proj-emotional` (1402:1574), transcribed off the
 * 1450 frame on 2026-09-30. The copy is the user's and is reproduced verbatim
 * except for typography: straight quotes and apostrophes became curly ones,
 * matching Embassaments, and the backticks the frame draws around
 * useOptimistic (markdown left in the text) were dropped.
 *
 * WHAT THE FRAMES DO DIFFERENTLY FROM EMBASSAMENTS, all decided 2026-09-30:
 *
 * - No cover in the frames. One was added later from the user's media
 *   table (see `cover` below).
 * - The rail has ten entries for eleven sections plus the intro: Test and
 *   Next are drawn outside it, and the eyebrow "Design decision" is
 *   "Design decisions" in the rail. Figma is followed on all three.
 * - System's first paragraph in the frame (1402:1610) is Embassaments copy
 *   left over from the template it was built on — Procreate sketches, the
 *   ACA "drop" visual. Dropped by the user's decision; the Figma frame still
 *   carries it.
 *
 * MEDIA, added 2026-09-30 from the user's `media-proj-emotional/` folder:
 * the hero (Hero.png), Norman's levels, the checkout flow and the product
 * card's states. Captions written 2026-09-30 from the thesis
 * (master-thesis.md): Figure 13, Table 9, section 4.5.4.4. The states diagram is the user's later `product-card` export (the
 * first, `states-product-card`, was outdated), and ships as the PNG, not the
 * SVG: the SVG is 241 KB of outlined text and reads no better at the same
 * size. Norman and the checkout flow were re-exported with larger type.
 *
 * The Repository link has no href in the Figma file; the URL is the one the
 * thesis cites on its cover page. */

import normanImage from '@/public/case-studies/emotional-ux/norman-diagram-desktop.png'
import normanPhone from '@/public/case-studies/emotional-ux/norman-diagram-phone.png'
import checkoutImage from '@/public/case-studies/emotional-ux/checkout-flow-desktop.png'
import checkoutPhone from '@/public/case-studies/emotional-ux/checkout-flow-phone.png'
import statesImage from '@/public/case-studies/emotional-ux/product-card-states-desktop.png'
import statesPhone from '@/public/case-studies/emotional-ux/product-card-states-phone.png'
import drawerBefore from '@/public/case-studies/emotional-ux/drawer-before-footer.png'
import drawerAfter from '@/public/case-studies/emotional-ux/drawer-after-footer.png'
import type { CaseStudy } from './types'

export const emotionalUx: CaseStudy = {
  slug: 'emotional-ux',
  title: 'Emotional UX in e-commerce',
  standfirst:
    'I took a production e-commerce template, audited what it leaves out, designed a small component system to put it back, and tested it against a live store built on the same template. Usability didn’t move. Trust and purchase intent did, and every participant preferred the redesigned store. The gap between those two results is the point of this project.',
  liveUrl: 'https://github.com/jomascarell/yournextstore',
  liveLabel: 'Repository',
  /* The project icon, Norman's three levels as nested arches, the same file
     the project list uses (user, 2026-10-01). It replaced the Next.js mark,
     which stood for the stack rather than the project. */
  logo: '/case-studies/emotional-ux/icon.svg',
  /* Absent from the Figma frames; added by the user's media table. Since
     2026-10-04 the whole purchase flow in one take (user's choice), recorded
     headless off the live deploy (yournextstore-4ilm.vercel.app) in a
     720x720 desktop window at @2x, scaled to 960, with a drawn cursor: home
     hero, "Comprar ahora", the catalog scrolled to the rings, hover, Add on
     Estrella, size 12, the drawer. Fades through white at the loop's seam.
     Square, so phones see the interface at about half size (342 of 720)
     where the old 16:9 full-page tour drew it at a quarter. One file at
     every width: VP9 0.61 MB, x264 0.68 MB. It replaces the 20s tour, which
     also passed the footer's trust bar; this one shows the drawer's trust
     row instead. The poster is the drawer open over the grid, because
     readers under reduced motion only ever see the poster. */
  cover: {
    slot: 'Hero — the redesigned store.',
    caption: null,
    video: {
      webm: '/case-studies/emotional-ux/cover-flow.webm',
      mp4: '/case-studies/emotional-ux/cover-flow.mp4',
      poster: '/case-studies/emotional-ux/cover-flow-poster.jpg',
      start: 12,
      name: 'the store tour',
      width: 960,
      height: 960,
      label:
        'The redesigned store, from home page to cart: the hero, “Formas, texturas y plata”, then “Comprar ahora” into the catalog, scrolled down to the Sardines earrings and the Estrella ring. Hovering each card swaps its photo; adding Estrella opens a size dialog, size 12 is chosen, and the cart drawer opens with the ring, “Te faltan $5.00 para conseguir el envío gratis”, and secure payment, 30-day returns and 24/48h delivery above the pay button.',
    },
  },
  meta: [
    { label: 'Role', value: 'Research, design & front-end — solo' },
    {
      label: 'Tools',
      value:
        'Next.js 16 · React 19 · TypeScript · Tailwind v4 · shadcn/UI · Stripe',
    },
    { label: 'Timeframe', value: 'Apr–Jul 2026' },
    { label: 'Context', value: 'Master’s thesis (UNIR)' },
  ],
  sections: [
    {
      id: 'premise',
      label: 'Premise',
      heading: 'Templates optimise everything they can measure',
      blocks: [
        {
          kind: 'prose',
          text: 'Component-based templates are a real achievement: reusable, fast, maintainable. Your Next Store, the open-source Next.js template I worked on, loads almost instantly thanks to server components, static caching and a CDN.',
        },
        {
          kind: 'prose',
          text: 'But a template optimises what it can measure. Load time, bundle size and task completion all have a number. Whether a first-time visitor believes the shop will actually ship their order doesn’t. So it goes unbuilt, in this template and in every store that ships on top of it unchanged.',
        },
        {
          /* Pull quote (2026-10-05, user): the section's closing line, moved
             out of the prose rather than repeated. */
          kind: 'quote',
          text: 'That isn’t a styling problem. In e-commerce, trust is what turns a visit into a payment.',
        },
      ],
    },
    {
      id: 'audit',
      label: 'Audit',
      heading: 'A healthy score with a hole in it',
      blocks: [
        {
          kind: 'prose',
          text: 'I ran a heuristic evaluation across Nielsen’s ten heuristics and mapped each finding to Norman’s three levels of emotional design: visceral (first impression), behavioural (ease of use) and reflective (trust and meaning).',
        },
        {
          kind: 'prose',
          text: [
            'The global severity came out at ',
            { b: '1.03 out of 4' },
            ': a template that works. The average hid the problem. Help & Documentation scored ',
            { b: '2.75' },
            '. There was no shipping or returns policy, no visible contact and no legal pages. Almost every serious issue sat on the reflective level.',
          ],
        },
        {
          /* From the user's reference chart (severity-bars.png). The ten
             values average 1.025, which is the 1.03 the prose quotes. */
          kind: 'chart',
          chart: {
            type: 'bars',
            label: 'Mean severity of the audit findings per Nielsen heuristic',
            axisLabel: 'Mean severity (0 = no issue, 4 = catastrophic)',
            max: 4,
            mean: 1.03,
            highlight: 'Help & documentation',
            rows: [
              { label: 'Help & documentation', value: 2.75 },
              { label: 'Error prevention', value: 1.75 },
              { label: 'User control & freedom', value: 1.5 },
              { label: 'Visibility of status', value: 1.25 },
              { label: 'Flexibility & efficiency', value: 1.25 },
              { label: 'Consistency & standards', value: 1 },
              { label: 'Error recovery', value: 0.5 },
              { label: 'Recognition vs recall', value: 0.25 },
              { label: 'Match with real world', value: 0 },
              { label: 'Aesthetic & minimalist', value: 0 },
            ],
          },
        },
        {
          kind: 'prose',
          text: [
            'The template answered “',
            { i: 'how do I buy this' },
            '?” perfectly. It had no answer to “',
            { i: 'should I buy this here?' },
            '”',
          ],
        },
      ],
    },
    {
      id: 'reframe',
      label: 'The reframe',
      heading: 'Emotional design isn’t decoration',
      blocks: [
        {
          kind: 'prose',
          text: '“Emotional” usually gets read as delight: animation, warmth, personality. The audit pointed somewhere less decorative. What was missing was the reflective layer, the signals a stranger uses to decide whether a small shop is real.',
        },
        {
          kind: 'media',
          slot: 'Norman’s three levels as a simple diagram',
          caption:
            'Norman’s three levels. Every severity-3 finding in the audit sat on the reflective one: no returns policy, no visible contact, thin checkout validation.',
          inset: true,
          image: {
            src: normanImage,
            phone: normanPhone,
            alt: 'Diagram: designer, product, user. The user’s response splits into Norman’s three levels — visceral (perceptually induced), behavioural (expectation induced) and reflective (intellectually induced) reactions.',
          },
        },
        {
          kind: 'prose',
          text: 'So I designed for the moments where that decision happens, not for charm.',
        },
      ],
    },
    {
      id: 'system',
      label: 'System',
      heading: 'Four components, zero new dependencies',
      blocks: [
        {
          /* Replaces the ChartSystem table, by the user's decision
             (2026-09-30). Copy transcribed from their four slide exports,
             "Behavioral" normalised to UK spelling. The pro / trade-off
             checklist was removed 2026-10-05 (user: it read as a copy of
             Caleb's carousel); each slide is now sketch, title and level. The table's "Gap it
             answers" column is deliberately not carried over. */
          kind: 'carousel',
          label: 'The four components',
          slides: [
            {
              title: 'Trust Bar',
              level: 'Reflective',
              image: '/case-studies/emotional-ux/components/trust-bar.svg',
            },
            {
              title: 'Emotional Product Card',
              level: 'Visceral + behavioural',
              image: '/case-studies/emotional-ux/components/product-card.svg',
            },
            {
              title: 'Cart Drawer',
              level: 'Behavioural + reflective',
              image: '/case-studies/emotional-ux/components/cart-drawer.svg',
            },
            {
              title: 'Checkout Trust Layer',
              level: 'Reflective + behavioural',
              image: '/case-studies/emotional-ux/components/checkout.svg',
            },
          ],
        },
        {
          kind: 'prose',
          text: 'One constraint shaped everything: no libraries beyond the template’s own stack. If emotional design needs extra weight to exist, it’s the first thing to get cut. Every component extends existing shadcn/Radix primitives instead.',
        },
        {
          kind: 'list',
          items: [
            [
              { b: 'Trust bar' },
              ': a Server Component. It’s visible on every page and ships zero JavaScript to the browser.',
            ],
            [
              { b: 'Product card' },
              ': split into a server shell and a small client island, so a grid of thirty products ships one copy of the interaction logic, not thirty.',
            ],
            [
              { b: 'Cart drawer' },
              ': built on React 19’s useOptimistic. Quantities update before the network responds and roll back automatically if the request fails. Removing an item, whether by the bin icon or by going below one, always asks first.',
            ],
          ],
        },
        /* The media plan's "drawer before/after" (2026-10-01): the user's two
           exports, both one item below the free-shipping threshold so the
           states match, and at one scale (the before was scaled up to 1014
           wide to match the after's 1018). The unlocked state used to be
           told in this caption; since 2026-10-04 the drawer loop below shows
           it. Since the same day both are CROPPED TO THE FOOTER (user's
           choice), the part that changed beside the checkout button, as
           -footer.png files: same widths, so the shared scale holds. The
           whole-drawer exports stay on disk, unreferenced. */
        {
          kind: 'pair',
          caption:
            'The drawer’s footer, before and after: payment, returns and delivery now sit beside checkout.',
          items: [
            {
              label: 'Before · YNS template',
              image: {
                src: drawerBefore,
                alt: 'The template’s cart drawer footer: a discount-code field with an Apply button, the subtotal of $61.50, “Shipping calculated at checkout”, a Checkout button and “Continue Shopping”.',
              },
            },
            {
              label: 'After · prototype component drawer',
              image: {
                src: drawerAfter,
                alt: 'The redesigned cart drawer footer: subtotal and shipping, an estimated total of 48,00€ with VAT included, then secure payment (SSL · Stripe), 30-day returns and 24/48h delivery above a “Checkout 48,00€” button and “Continue shopping”.',
              },
            },
          ],
        },
        /* The built drawer in motion (2026-10-04): recorded headless off the
           live deploy (yournextstore-4ilm.vercel.app) at 390 wide, @2x, and
           cropped to the top 388 square (4px off the left
           edge drops the drawer's border). Roba ($40) leaves $10 to the $50
           threshold; + makes it two and the bar fills. Ends on the close
           so the loop's jump back reads as the drawer closing. Caption is
           a draft. */
        {
          kind: 'media',
          slot: 'Video loop, muted, looping — the cart drawer crossing the free-shipping threshold',
          caption:
            'The drawer as built. One item leaves $10 to free shipping; a second fills the bar and turns it green.',
          video: {
            webm: '/case-studies/emotional-ux/drawer-loop.webm',
            mp4: '/case-studies/emotional-ux/drawer-loop.mp4',
            poster: '/case-studies/emotional-ux/drawer-loop-poster.jpg',
            start: 3.7,
            name: 'the cart drawer clip',
            width: 776,
            height: 776,
            label:
              'On a phone, “Añadir a la cesta” adds the $40 Roba pin. The cart drawer opens: “Te faltan $10.00 para conseguir el envío gratis” above a progress bar at four fifths. Pressing plus makes it two, the bar fills, and the message turns green: “¡Enhorabuena! Tienes envío gratuito.”',
          },
        },
      ],
    },
    {
      id: 'design-decision',
      label: 'Design decision',
      navLabel: 'Design decisions',
      heading: 'Trading an inline size picker for a dialog',
      blocks: [
        {
          kind: 'prose',
          text: 'The prototype showed sizes directly on hover. Once built, it crowded the overlay and fought the link wrapping the card. I replaced it with a dialog that confirms automatically once every option is chosen. It’s one tap for single-attribute products, and it’s properly accessible.',
        },
        {
          kind: 'media',
          slot: 'Product card, three states',
          caption:
            'The card’s states as designed. Products without sizes go straight to the cart.',
          /* No `inset`: the 2026-10-06 re-export carries its own
             surface/subtle ground, so it sits in the grey frame like the
             screenshots instead of a grey box floating on white. */
          image: {
            src: statesImage,
            phone: statesPhone,
            alt: 'State diagram of the product card as designed, before the size picker became a dialog. At rest it shows the main image with name, price and category. Hover darkens the image and shows an Add to cart button. Clicking Add on a product with variants replaces the button with a size selector (S, M, L, XL) and a link to the product. Mouse leave returns from hover to rest; clicking outside returns from the selector.',
          },
        },
        /* The card in motion (2026-10-04): recorded headless off the live
           deploy at a 720x720 desktop window (@2x, scaled to 960), with a
           drawn cursor since headless draws none. Hover Sardines and
           Estrella, Add on Estrella (a ring, so sizes), pick 12, the drawer
           opens, both close, the cursor returns to where it started.
           Caption is a draft. */
        {
          kind: 'media',
          slot: 'Video loop, muted, looping — the product card from hover to size dialog',
          caption:
            'The card as built. Hover swaps the image; Add on a ring opens the size dialog, and picking a size adds it.',
          video: {
            webm: '/case-studies/emotional-ux/card-loop.webm',
            mp4: '/case-studies/emotional-ux/card-loop.mp4',
            poster: '/case-studies/emotional-ux/card-loop-poster.jpg',
            start: 1.3,
            name: 'the product card clip',
            width: 960,
            height: 960,
            label:
              'Two product cards, the Sardines earrings and the Estrella ring. Hovering each swaps its photo and shows a cart button. Clicking the button on Estrella opens a dialog listing sizes 10, 12, 14 and 16; choosing 12 adds the ring and opens the cart drawer, which reads “Te faltan $5.00 para conseguir el envío gratis”.',
          },
        },
      ],
    },
    {
      id: 'wall',
      label: 'Wall',
      heading: 'The most anxious moment is the one the store doesn’t own',
      blocks: [
        {
          kind: 'prose',
          text: 'The fourth component never shipped as designed. Payment is fully delegated to Stripe’s hosted checkout, and the store’s code can’t touch that page.',
        },
        {
          kind: 'prose',
          text: 'That turned out to be the most revealing finding of the build. The moment with the most at stake, handing over card details, happens on the one surface the store has given away. I moved the trust signals into the cart footer, the last surface the store controls before the handoff.',
        },
        {
          kind: 'media',
          slot: 'Flow diagram: store, cart footer, Stripe',
          caption:
            'The purchase flow. The store owns every step up to the cart; Stripe owns the card details.',
          inset: true,
          image: {
            src: checkoutImage,
            phone: checkoutPhone,
            alt: 'Flow diagram: product page (add to cart), cart drawer (review items), cart footer (checkout button), then Stripe’s hosted checkout — the one step drawn in a different colour. Stripe returns to a success page and confirms the order by webhook.',
          },
        },
        {
          kind: 'prose',
          text: 'Emotional design can walk someone up to the payment step. It can’t go through it. Every delegated surface (payments, auth, embedded widgets) is a place where nobody is designing for trust.',
        },
      ],
    },
    {
      id: 'test',
      label: 'Test',
      navLabel: null,
      heading: 'Same template, real competitor, same people',
      blocks: [
        {
          /* Names the stores once, so the Joies Laia branding in the cover and
             loops isn't read as a test on a client's live shop. The user's
             account, 2026-10-06: the components came first and were built on
             a Next.js template they meant to reuse; Joies Laia joined as a
             client who needed to go digital and build the brand. */
          kind: 'prose',
          text: 'The redesign wears Joies Laia’s brand. I built the system on a template I meant to reuse after the thesis, and Joies Laia, a jewellery brand that needed to go digital, became its first client.',
        },
        {
          kind: 'prose',
          text: 'To isolate the system, I compared it against sinesilk.com, a live store built on the same template, rather than against the bare demo.',
        },
        {
          kind: 'list',
          items: [
            '6 participants, within-subjects, with the order counterbalanced (three saw each store first)',
            '4 tasks per store, each targeting one component',
            'SUS, a hedonic questionnaire (emotional response, perceived trust, purchase intent) and a closing interview',
          ],
        },
      ],
    },
    {
      id: 'findings',
      label: 'Findings',
      heading: 'What the metrics saw, and what they missed',
      blocks: [
        {
          kind: 'stats',
          items: [
            { from: '72s', value: '36s', label: 'Time to manage the cart' },
            {
              from: '30s',
              value: '18s',
              label: 'Time to find returns and payment info',
            },
            { value: '+0.58', label: 'Perceived trust, on a 7-point scale' },
            { value: '6/6', label: 'Participants who preferred the redesign' },
          ],
          caption:
            'With six participants, read these as a direction, not proof. Usability scores were identical: 82.9 vs 83.3.',
        },
      ],
    },
    {
      id: 'reading-it-honestly',
      label: 'Reading it honestly',
      heading: 'The loudest signal was the order',
      blocks: [
        {
          kind: 'prose',
          text: [
            'None of the differences reached statistical significance; with six people, they couldn’t. And one effect dwarfed everything else. Whichever store participants saw second scored about ',
            { b: '24 SUS points higher' },
            ', for all six of them. The difference between versions was under one point.',
          ],
        },
        {
          /* The thesis's Figure 18 (order-effect.png), in English. All
             twelve scores checked 2026-09-30 against the raw SUS table in
             the thesis's Annex E, and the means against Table 24. "A"/"B"
             is the store each participant saw first, as the figure marks
             it: A is the control (the live store, sinesilk.com), B the
             redesign. */
          kind: 'chart',
          chart: {
            type: 'slope',
            label:
              'Order effect on the SUS score: each participant’s first evaluation against their second',
            axisLabel: 'SUS score (0–100)',
            domain: [50, 100],
            step: 10,
            columns: ['1st store evaluated', '2nd store evaluated'],
            columnsShort: ['1st store', '2nd store'],
            series: [
              { label: 'P4 · A', detail: 'saw the live store first', from: 97.5, to: 100 },
              { label: 'P2 · B', detail: 'saw the redesign first', from: 82.5, to: 95 },
              { label: 'P3 · B', detail: 'saw the redesign first', from: 70, to: 95 },
              { label: 'P6 · A', detail: 'saw the live store first', from: 65, to: 90 },
              { label: 'P1 · B', detail: 'saw the redesign first', from: 57.5, to: 90 },
              { label: 'P5 · A', detail: 'saw the live store first', from: 55, to: 100 },
            ],
            mean: { from: 71.25, to: 95 },
          },
        },
        {
          kind: 'prose',
          text: 'Counterbalancing cancels that out in the averages, but it also means the usability comparison says little on its own. What survives is directional and consistent across three independent sources: the trust scores, the unanimous preference and what people remembered.',
        },
        {
          kind: 'prose',
          text: 'There’s also one failure worth owning. One participant removed an item from the cart and believed the task was done when it wasn’t. The confirmation dialog still isn’t clear enough.',
        },
      ],
    },
    {
      id: 'what-it-means',
      label: 'What it means',
      heading: 'Measure only efficiency, and you’ll only build efficiency',
      blocks: [
        {
          kind: 'prose',
          text: 'This study didn’t prove that emotional design sells more. It showed something more uncomfortable: the standard instrument rated both stores as equivalent, and every participant chose the same one.',
        },
        {
          kind: 'prose',
          text: 'What made the difference lived on the reflective level. That’s trust, and it’s exactly the dimension a usability score, a performance audit or a component library doesn’t register.',
        },
        {
          kind: 'prose',
          text: 'That’s the blind spot. It isn’t that teams don’t care how people feel. It’s that the tools we use to decide whether something is done can’t see it.',
        },
        {
          /* Pull quote (2026-10-05, user), split out of the paragraph above.
             Its old closing sentence ("…trust is what stands between a
             visit and a payment") was dropped: it repeated Premise's quote. */
          kind: 'quote',
          text: 'If nobody measures trust, nobody owns it.',
        },
      ],
    },
    {
      id: 'next',
      label: 'Next',
      navLabel: null,
      tone: 'callout',
      heading: 'What I’d change',
      blocks: [
        {
          kind: 'list',
          items: [
            [
              { b: 'Remove the order effect' },
              '. Replicate with a larger, pre-registered sample, or switch to a between-subjects design.',
            ],
            [
              { b: 'Measure behaviour, not intent' },
              '. Track completed checkouts instead of self-reported willingness to buy.',
            ],
            [
              { b: 'Take the checkout back' },
              '. Replace the Stripe redirect with embedded Stripe Elements, so the fourth component can finally be built and tested where it belongs.',
            ],
          ],
        },
      ],
    },
  ],
  contact: {
    title: 'Want more details?',
    text: 'Reach out for the full study.',
    label: 'Get in touch',
  },
}
