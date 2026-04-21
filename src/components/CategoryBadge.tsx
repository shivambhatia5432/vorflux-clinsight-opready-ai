import {
  DEFAULT_CATEGORY_COLOR,
  INSTRUMENT_CATEGORY_VAR_MAP,
  PROCEDURE_CATEGORY_VAR_MAP,
} from '../data/categoryColors'
import type { InstrumentCategory, ProcedureCategory } from '../data/types'

export type BadgeCategory = InstrumentCategory | ProcedureCategory

export interface CategoryBadgeProps {
  category: BadgeCategory
  className?: string
}

export function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
  const backgroundColor =
    INSTRUMENT_CATEGORY_VAR_MAP[category as InstrumentCategory] ??
    PROCEDURE_CATEGORY_VAR_MAP[category as ProcedureCategory] ??
    DEFAULT_CATEGORY_COLOR
  return (
    <span
      className={`inline-block shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold text-white ${className}`}
      style={{ backgroundColor }}
    >
      {category}
    </span>
  )
}
