import type { Config } from 'tailwindcss'

/*
 * Minimal Tailwind config.
 *
 * Earlier iterations of this theme defined a semantic palette here
 * (`surface`, `accent`, `ink`, …). In practice the components settled on
 * inline hex literals (`bg-[#191919]`, `text-[#a0a0a0]`, etc.), so the
 * semantic tokens were removed to avoid drift between declared tokens and
 * what the UI actually uses. If we decide to migrate to semantic tokens in
 * a future pass, reintroduce them here and update the components in the
 * same change.
 *
 * The only extension kept is `fontFamily.sans` so Tailwind's preflight
 * applies Inter to `html` / `body` via its default `font-sans` stack.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
