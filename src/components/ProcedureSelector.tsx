import { ALL_PROCEDURES } from '../data/procedures'
import { groupBy } from '../utils/groupBy'
import { CategoryBadge } from './CategoryBadge'

export interface ProcedureSelectorProps {
  onSelect: (id: string) => void
}

export function ProcedureSelector({ onSelect }: ProcedureSelectorProps) {
  const groups = groupBy(ALL_PROCEDURES, (procedure) => procedure.category)

  return (
    <div className="min-h-screen bg-[#191919]">
      {/* Hero header */}
      <header className="px-6 pt-12 pb-8 md:px-10 md:pt-16">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#0445AF]">
          Clinical Tray Setup Agent
        </p>
        <h1 className="text-3xl font-extrabold leading-tight text-white md:text-4xl">
          Which procedure are<br className="hidden sm:block" /> you setting up?
        </h1>
        <p className="mt-3 text-base text-[#a0a0a0]">
          Select a procedure to load the instrument checklist, voice callout, and documentation template.
        </p>
      </header>

      <main className="px-4 pb-16 md:px-10">
        {Array.from(groups.entries()).map(([category, procedures]) => (
          <section key={category} className="mb-8">
            <div className="mb-3 flex items-center gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#666666]">
                {category}
              </h2>
              <div className="h-px flex-1 bg-[#2e2e2e]" />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {procedures.map(procedure => (
                <button
                  key={procedure.id}
                  type="button"
                  onClick={() => onSelect(procedure.id)}
                  className="group flex min-h-[64px] w-full flex-col items-start gap-1.5 rounded-2xl border border-[#2e2e2e] bg-[#242424] p-4 text-left transition-all duration-200 hover:border-[#0445AF]/50 hover:bg-[#2a2a2a] hover:shadow-[0_4px_24px_rgba(0,0,0,0.5)] active:scale-[0.99]"
                >
                  <div className="flex w-full items-start justify-between gap-3">
                    <span className="text-base font-semibold text-white group-hover:text-white">
                      {procedure.name}
                    </span>
                    <CategoryBadge category={procedure.category} />
                  </div>
                  <span className="text-sm font-medium text-[#666666]">
                    {procedure.cdtCode}
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}
