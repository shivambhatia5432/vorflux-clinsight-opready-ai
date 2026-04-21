import { useState } from 'react'
import { useChecklist } from '../hooks/useChecklist'
import { useDocTemplate } from '../hooks/useDocTemplate'
import { useProcedure } from '../hooks/useProcedure'
import { TrayChecklist } from './TrayChecklist'
import { VoiceCallout } from './VoiceCallout'
import { DocTemplate } from './DocTemplate'

export interface TrayViewProps {
  procedureId: string
  onBack: () => void
}

type TabKey = 'checklist' | 'voice' | 'docs'

const TABS: readonly { key: TabKey; label: string; icon: string }[] = [
  { key: 'checklist', label: 'Checklist', icon: '✓' },
  { key: 'voice', label: 'Voice', icon: '◉' },
  { key: 'docs', label: 'Docs', icon: '≡' },
]

export function TrayView({ procedureId, onBack }: TrayViewProps) {
  const procedure = useProcedure(procedureId)
  const [activeTab, setActiveTab] = useState<TabKey>('checklist')

  // State for tabs is lifted here so it persists across tab switches. The
  // TrayChecklist and DocTemplate panels are conditionally rendered below
  // and would otherwise lose their internal state on unmount.
  const checklist = useChecklist(procedure?.instruments ?? [])
  const docTemplate = useDocTemplate(procedure?.docTemplate ?? '')

  if (!procedure) {
    return (
      <div className="min-h-screen bg-[#191919] p-6">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to procedures"
          className="min-h-[48px] text-[#0445AF] hover:text-white transition-colors"
        >
          ← Back
        </button>
        <p className="mt-4 text-[#a0a0a0]">Procedure not found.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#191919]">
      {/* Sticky top header */}
      <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-[#2e2e2e] bg-[#191919]/95 px-4 py-3 backdrop-blur-sm">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to procedures"
          className="flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-[#a0a0a0] transition-colors hover:text-white"
        >
          <span className="text-base">←</span>
          <span className="hidden sm:inline">Back</span>
        </button>
        <div className="flex min-w-0 flex-1 items-baseline gap-2">
          <h1 className="truncate text-base font-bold text-white lg:text-lg">
            {procedure.name}
          </h1>
          <span className="shrink-0 rounded-md bg-[#2e2e2e] px-2 py-0.5 text-xs font-medium text-[#a0a0a0]">
            {procedure.cdtCode}
          </span>
        </div>
      </header>

      {/* Tab bar: fixed bottom on mobile, static below header on desktop.
          Uses z-30 so it stays on top of the TrayChecklist clinical notes
          drawer (z-10) on small screens. */}
      <nav
        role="tablist"
        aria-label="Tray view sections"
        className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-[#2e2e2e] bg-[#191919]/95 backdrop-blur-sm lg:static lg:bottom-auto lg:border-b lg:border-t-0"
      >
        {TABS.map(tab => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.key)}
              className={`flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 px-3 text-xs font-semibold transition-all duration-200 lg:flex-row lg:gap-2 lg:text-sm ${
                isActive
                  ? 'text-white'
                  : 'text-[#666666] hover:text-[#a0a0a0]'
              }`}
            >
              <span className={`text-base lg:text-sm ${isActive ? 'text-[#0445AF]' : ''}`}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0445AF] lg:hidden" />
              )}
            </button>
          )
        })}
        {/* Active indicator line for desktop */}
        <style>{`
          nav[role="tablist"] { position: relative; }
        `}</style>
      </nav>

      {/* Content area.
          TrayChecklist and DocTemplate are kept mounted (via `hidden`) so
          checklist progress and doc edits survive tab switches. VoiceCallout
          is unmounted on leave so speech synthesis is cancelled cleanly. */}
      <main className="flex-1 pb-20 lg:pb-0">
        <div
          role="tabpanel"
          className={activeTab === 'checklist' ? 'block lg:grid lg:grid-cols-2 lg:gap-0' : 'hidden'}
        >
          <TrayChecklist procedure={procedure} checklist={checklist} />
          <div className="hidden lg:block">
            <VoiceCallout procedure={procedure} />
          </div>
        </div>
        {activeTab === 'voice' && (
          <div role="tabpanel" className="px-4 py-5">
            <VoiceCallout procedure={procedure} />
          </div>
        )}
        <div
          role="tabpanel"
          className={`${activeTab === 'docs' ? 'block' : 'hidden'} px-4 py-5`}
        >
          <DocTemplate procedure={procedure} docTemplate={docTemplate} />
        </div>
      </main>
    </div>
  )
}
