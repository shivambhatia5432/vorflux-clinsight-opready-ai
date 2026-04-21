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
      {/* Main column: sticky header + instrument list */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-baseline justify-between gap-2">
            <h1 className="text-lg font-semibold text-gray-900">
              {procedure.name}
            </h1>
            <span className="text-sm text-gray-500">{procedure.cdtCode}</span>
          </div>

          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200"
          >
            <div
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-1 text-sm text-gray-600">
            {checkedCount} of {totalCount} items
          </p>

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={checkAll}
              className="min-h-[48px] flex-1 rounded-lg border border-blue-600 bg-blue-600 px-4 text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
            >
              Check All
            </button>
            <button
              type="button"
              onClick={reset}
              className="min-h-[48px] flex-1 rounded-lg border border-gray-300 bg-white px-4 text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
            >
              Reset
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-3 pb-24 lg:pb-6">
          {Array.from(groups.entries()).map(([category, items]) => {
            const isCollapsed = collapsedCategories.has(category)
            return (
              <section
                key={category}
                className="mb-4 overflow-hidden rounded-lg border border-gray-200"
              >
                <button
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className="flex min-h-[48px] w-full items-center justify-between gap-3 px-4 py-2 text-left text-white"
                  style={{ backgroundColor: INSTRUMENT_CATEGORY_VAR_MAP[category] }}
                  aria-expanded={!isCollapsed}
                >
                  <span className="flex items-center gap-2 font-semibold">
                    <span>{category}</span>
                    <span className="inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">
                      {items.length}
                    </span>
                  </span>
                  <span aria-hidden="true" className="text-sm">
                    {isCollapsed ? '▶' : '▼'}
                  </span>
                </button>

                {!isCollapsed && (
                  <ul className="divide-y divide-gray-100 bg-white">
                    {items.map(instrument => {
                      const isChecked = checked.has(instrument.id)
                      return (
                        <li key={instrument.id}>
                          <label
                            className={`flex min-h-[48px] w-full cursor-pointer items-center gap-3 px-4 py-2 transition-opacity ${
                              isChecked ? 'opacity-60' : ''
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggle(instrument.id)}
                              className="h-5 w-5 accent-blue-600"
                            />
                            <span
                              className={`flex-1 text-base text-gray-900 ${
                                isChecked ? 'line-through' : ''
                              }`}
                            >
                              {instrument.name}
                            </span>
                            {instrument.critical && (
                              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
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
      <aside className="fixed bottom-12 left-0 right-0 z-10 border-t border-gray-200 bg-white shadow-lg lg:static lg:bottom-auto lg:z-auto lg:w-64 lg:shrink-0 lg:border-l lg:border-t-0 lg:shadow-none">
        <button
          type="button"
          onClick={() => setNotesExpanded(prev => !prev)}
          className="flex min-h-[48px] w-full items-center justify-between gap-3 px-4 py-2 text-left font-semibold text-gray-900 lg:cursor-default lg:border-b lg:border-gray-200"
          aria-expanded={notesExpanded}
        >
          <span>Clinical Notes</span>
          <span aria-hidden="true" className="text-sm lg:hidden">
            {notesExpanded ? '▼' : '▶'}
          </span>
        </button>

        <div
          className={`${notesExpanded ? 'block' : 'hidden'} lg:block max-h-64 overflow-y-auto border-t border-gray-100 px-4 py-3 lg:max-h-none lg:border-t-0`}
        >
          {procedure.clinicalNotes.length === 0 ? (
            <p className="text-sm text-gray-500">No clinical notes.</p>
          ) : (
            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
              {/* Notes are unique strings per procedure, so note content is a stable key. */}
              {procedure.clinicalNotes.map(note => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  )
}
