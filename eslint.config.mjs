import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import jsxA11y from 'eslint-plugin-jsx-a11y'

/* Accessibility is a build-time gate in this project, not a Phase 11 cleanup:
   the deck's tab order, `inert`, focus states and reduced-motion are all
   cheaper to get right as each component is written than to retrofit. The
   strict jsx-a11y preset is here so the linter enforces that from day one. */

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Rules only, not the whole preset: eslint-config-next already registers the
  // jsx-a11y plugin, and spreading the preset on top redefines it and errors.
  { name: 'jsx-a11y/strict-rules', rules: jsxA11y.flatConfigs.strict.rules },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig
