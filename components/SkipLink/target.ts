/* The id of <main>, the skip link's target. Its own module so client code
   (FooterReveal) can import it without pulling in the server-rendered
   SkipLink, which reads the page's language on the server. */
export const SKIP_TARGET_ID = 'content'
