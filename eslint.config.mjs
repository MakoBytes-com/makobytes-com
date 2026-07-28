// Flat ESLint config.
//
// Next 16 removed `next lint`, so this repo's "lint" script had been silently
// broken since the upgrade — it was passing "lint" to next as a DIRECTORY name
// and dying with "Invalid project directory provided, no such directory:
// .../makobytes.com/lint". Nobody saw it because no CI ever ran lint here.
// ESLint now runs directly through the CLI against this config.
//
// eslint-config-next 16 exports real flat configs (arrays), so they are
// imported directly — do NOT reach for FlatCompat/@eslint/eslintrc here. The
// compat path both throws on this config ("Converting circular structure to
// JSON") and drags in an extra vulnerable minimatch@3 copy.

import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescriptConfig from "eslint-config-next/typescript";

const config = [
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts", "public/**"],
  },
  ...coreWebVitals,
  ...typescriptConfig,

  {
    // `// setup required`, `// admin access` and friends are a deliberate
    // visual idiom on this site — the `mono-tag` class renders them as
    // code-comment-styled labels. jsx-no-comment-textnodes exists to catch a
    // developer who MEANT to write a JS comment and accidentally shipped it as
    // page text; here the page text is the point. Turned off site-wide rather
    // than sprinkled as nine inline disables that would each need this same
    // paragraph to make sense.
    rules: {
      "react/jsx-no-comment-textnodes": "off",
    },
  },

  {
    // Tailwind's config is consumed as CommonJS; require() is how its own docs
    // load plugins. An ESM import here would break the config loader.
    files: ["tailwind.config.ts", "tailwind.config.js", "postcss.config.*"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  {
    // The desktop shell reads window.matchMedia, sessionStorage and
    // window.innerWidth to decide whether to play the boot animation and to
    // clamp windows onto small screens. None of those exist during SSR, so the
    // reads MUST happen in an effect, and acting on what they return means
    // setting state there. This is the correct shape, not a cascade bug.
    files: ["components/os/**"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default config;
