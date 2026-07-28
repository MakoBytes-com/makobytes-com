// Tailwind 4 ships its own PostCSS plugin and handles vendor prefixing
// internally, so `tailwindcss` as a plugin and a separate `autoprefixer` are
// both gone. Leaving either in place is the usual v4 upgrade failure — the
// build succeeds and emits no utility CSS at all.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
