/**
 * Shared button class strings for the Typeform-inspired dark theme.
 *
 * These are intentionally plain string constants (not a `<Button>` component)
 * so they compose naturally with extra layout classes (`flex-1`, `px-4`, etc.)
 * at each call site without prop plumbing.
 */

/** Primary accent action (e.g. "Start Callout", "Copy to Clipboard"). */
export const btnPrimary =
  'min-h-[48px] rounded-xl bg-[#0445AF] px-6 text-sm font-bold text-white transition-all hover:bg-[#0356d4] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30'

/** Secondary neutral action (e.g. "Pause", "Reset Template"). */
export const btnSecondary =
  'min-h-[48px] rounded-xl border border-[#383838] bg-[#242424] px-6 text-sm font-bold text-[#c8c8c8] transition-all hover:border-[#4a4a4a] hover:bg-[#2e2e2e] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-30'

/** Destructive / stop action. */
export const btnDanger =
  'min-h-[48px] rounded-xl border border-red-900/50 bg-red-950/30 px-6 text-sm font-bold text-red-300 transition-all hover:bg-red-900/40 active:scale-95'
