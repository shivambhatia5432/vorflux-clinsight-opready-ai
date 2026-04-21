import { ALL_PROCEDURES } from '../data/procedures'
import { groupBy } from '../utils/groupBy'
import { CategoryBadge } from './CategoryBadge'

export interface ProcedureSelectorProps {
  onSelect: (id: string) => void
}

export function ProcedureSelector({ onSelect }: ProcedureSelectorProps) {
  const groups = groupBy(ALL_PROCEDURES, (procedure) => procedure.category)

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900">Clinical Tray Setup Agent</h1>
        <p className="text-sm text-gray-500">Select a procedure to begin</p>
      </header>

      <main className="px-4 py-4">
        {Array.from(groups.entries()).map(([category, procedures]) => (
          <section key={category} className="mb-6">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-700">
              {category}
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {procedures.map(procedure => (
                <button
                  key={procedure.id}
                  type="button"
                  onClick={() => onSelect(procedure.id)}
                  className="flex min-h-[48px] w-full flex-col items-start gap-1 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
                >
                  <div className="flex w-full items-start justify-between gap-2">
                    <span className="font-medium text-gray-900">{procedure.name}</span>
                    <CategoryBadge category={procedure.category} />
                  </div>
                  <span className="text-sm text-gray-500">{procedure.cdtCode}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}
