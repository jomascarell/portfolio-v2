import type { NextConfig } from 'next'

/* `turbopack.root` is pinned to this repo on purpose. Turbopack infers the
   project root by walking up for a lockfile, and there is a stray
   package-lock.json sitting in the home directory above this one — without the
   pin it walks out of the repo and warns on every build.

   No `cacheComponents`: every route here is static, so partial prerendering and
   `use cache` lifetimes have nothing to do. It is also incompatible with the
   `dynamicParams = false` used on the project detail route.

   No `reactCompiler`: stable in 16, but it moves builds onto Babel, and a
   four-route static site has no re-render problem to solve. */

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
