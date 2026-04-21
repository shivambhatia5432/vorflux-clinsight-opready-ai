import { useMemo, useState } from 'react'
import { INSTRUMENT_CATEGORY_VAR_MAP } from '../data/categoryColors'
import type { Instrument, InstrumentCategory, Procedure } from '../data/types'
import type { UseChecklistReturn } from '../hooks/useChecklist'
import { groupBy } from '../utils/groupBy'
import { CategoryBadge } from './CategoryBadge'

export interface TrayChecklistProps {
  procedure: Procedure
  /**
   * Checklist state owned by the parent so progress survives tab switches.
   * Create it with `useChecklist(procedure.instruments)` in the parent.
   */
  checklist: UseChecklistReturn
}

function groupInstruments(
  instruments: readonly Instrument[],
): Map<InstrumentCategory, Instrument[]> {
  return groupBy(instruments, (instrument) => instrument.category)
}

export function TrayChecklist({ procedure, checklist }: TrayChecklistProps) {
  const { checked, toggle, checkAll, reset, progress } = checklist

  const groups = useMemo(
    () => groupInstruments(procedure.instruments),
    [procedure.instruments],
  )

  const [collapsedCategories, setCollapsedCategories] = useState<
    Set<InstrumentCategory>
  >(() => new Set())

  const [notesExpanded, setNotesExpanded] = useState(false)

  const toggleCategory = (category: InstrumentCategory) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  const totalCount = procedure.instruments.length
  const checkedCount = checked.size

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Progress header */}
        <div className="sticky top-[57px] z-10 border-b border-[#2e2e2e] bg-[#191919]/95 px-4 py-4 backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-[#a0a0a0]">
              <span className="text-xl font-bold text-white">{checkedCount}</span>
              <span className="mx-1 text-[#666666]">/</span>
              <span className="text-[#666666]">{totalCount} items</span>
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={checkAll}
                className="rounded-lg bg-[#0445AF] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#0356d4] active:scale-95"
              >
                Check All
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded-lg border border-[#383838] bg-[#242424] px-4 py-2 text-sm font-semibold text-[#a0a0a0] transition-all hover:border-[#4a4a4a] hover:text-white active:scale-95"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-1.5 w-full overflow-hidden rounded-full bg-[#2e2e2e]"
          >
            <div
              className="h-full rounded-full bg-[#0445AF] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Instrument list */}
        <main className="flex-1 px-4 py-4 pb-24 lg:pb-8">
          {Array.from(groups.entries()).map(([category, items]) => {
            const isCollapsed = collapsedCategories.has(category)
            return (
              <section
                key={category}
                className="mb-3 overflow-hidden rounded-2xl border border-[#2e2e2e]"
              >
                {/* Category header — saturated bg, white text (all vars pass WCAG AA) */}
                <button
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className="flex min-h-[48px] w-full items-center justify-between gap-3 px-4 py-3 text-left text-white"
                  style={{ backgroundColor: INSTRUMENT_CATEGORY_VAR_MAP[category] }}
                  aria-expanded={!isCollapsed}
                >
                  <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
                    <span>{category}</span>
                    <span className="inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">
                      {items.length}
                    </span>
                  </span>
                  <span aria-hidden="true" className="text-xs opacity-70">
                    {isCollapsed ? '▶' : '▼'}
                  </span>
                </button>

                {!isCollapsed && (
                  <ul className="divide-y divide-[#2e2e2e] bg-[#242424]">
                    {items.map(instrument => {
                      const isChecked = checked.has(instrument.id)
                      return (
                        <li key={instrument.id}>
                          <label
                            className={`flex min-h-[52px] w-full cursor-pointer items-center gap-3 px-4 py-3 transition-all ${
                              isChecked ? 'opacity-40' : 'hover:bg-[#2e2e2e]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggle(instrument.id)}
                              className="h-5 w-5 shrink-0 rounded accent-[#0445AF]"
                            />
                            <span
                              className={`flex-1 text-sm font-medium ${
                                isChecked
                                  ? 'text-[#666666] line-through'
                                  : 'text-white'
                              }`}
                            >
                              {instrument.name}
                            </span>
                            {instrument.critical && (
                              <span className="shrink-0 rounded-full bg-red-900/60 px-2 py-0.5 text-xs font-bold text-red-400">
                                CRITICAL
                              </span>
                            )}
                            <CategoryBadge category={instrument.category} />
                          </label>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>
            )
          })}
        </main>
      </div>

      {/* Clinical notes: bottom accordion on mobile, sidebar on desktop.
          On mobile the drawer sits above the TrayView tab bar (which uses
          bottom-0). We offset by bottom-12 and use z-10 (below the tab bar's
          z-30) so the tab bar stays tappable. */}
      <aside className="fixed bottom-12 left-0 right-0 z-10 border-t border-[#2e2e2e] bg-[#191919]/95 shadow-[0_-4px_24px_rgba(0,0,0,0.5)] backdrop-blur-sm lg:static lg:bottom-auto lg:z-auto lg:w-72 lg:shrink-0 lg:border-l lg:border-t-0 lg:shadow-none">
        <button
          type="button"
          onClick={() => setNotesExpanded(prev => !prev)}
          className="flex min-h-[48px] w-full items-center justify-between gap-3 px-4 py-3 text-left lg:cursor-default lg:border-b lg:border-[#2e2e2e]"
          aria-expanded={notesExpanded}
        >
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#a0a0a0]">
            Clinical Notes
          </span>
          <span aria-hidden="true" className="text-xs text-[#666666] lg:hidden">
            {notesExpanded ? '▼' : '▶'}
          </span>
        </button>

        <div
          className={`${notesExpanded ? 'block' : 'hidden'} lg:block max-h-64 overflow-y-auto border-t border-[#2e2e2e] px-4 py-3 lg:max-h-none lg:border-t-0`}
        >
          {procedure.clinicalNotes.length === 0 ? (
            <p className="text-sm text-[#666666]">No clinical notes.</p>
          ) : (
            <ul className="space-y-2 text-sm text-[#a0a0a0]">
              {/* Notes are unique strings per procedure, so note content is a stable key. */}
              {procedure.clinicalNotes.map(note => (
                <li key={note} className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-[#0445AF]">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  )
}
