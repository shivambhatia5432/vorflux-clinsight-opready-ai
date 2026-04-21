import type { InstrumentCategory, ProcedureCategory } from './types'

/**
 * CSS-variable background color for every instrument category.
 * Keep in sync with the `--color-*` custom properties in `src/index.css`.
 */
export const INSTRUMENT_CATEGORY_VAR_MAP: Record<InstrumentCategory, string> = {
  Exam: 'var(--color-exam)',
  Anesthesia: 'var(--color-anesthesia)',
  Handpiece: 'var(--color-handpiece)',
  Bur: 'var(--color-bur)',
  Scaling: 'var(--color-scaling)',
  Matrix: 'var(--color-matrix)',
  Bonding: 'var(--color-bonding)',
  Restorative: 'var(--color-restorative)',
  Surgical: 'var(--color-surgical)',
  Impression: 'var(--color-impression)',
  Endo: 'var(--color-endo)',
  Implant: 'var(--color-implant)',
  Supply: 'var(--color-supply)',
}

/**
 * CSS-variable background color for every procedure-level category.
 * Keep in sync with the `--color-proc-*` custom properties in `src/index.css`.
 */
export const PROCEDURE_CATEGORY_VAR_MAP: Record<ProcedureCategory, string> = {
  Diagnostic: 'var(--color-proc-diagnostic)',
  Restorative: 'var(--color-proc-restorative)',
  Endodontics: 'var(--color-proc-endodontics)',
  'Oral Surgery': 'var(--color-proc-oral-surgery)',
  Periodontics: 'var(--color-proc-periodontics)',
  Prosthodontics: 'var(--color-proc-prosthodontics)',
  Pediatric: 'var(--color-proc-pediatric)',
  Implants: 'var(--color-proc-implants)',
}

/** Fallback used when a category is somehow unmapped. */
export const DEFAULT_CATEGORY_COLOR = '#6b7280'
