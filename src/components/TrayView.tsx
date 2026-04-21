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

const TABS: readonly { key: TabKey; label: string }[] = [
  { key: 'checklist', label: '✓ Checklist' },
  { key: 'voice', label: '🔊 Voice' },
  { key: 'docs', label: '📋 Docs' },
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
      <div className="min-h-screen bg-white p-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to procedures"
          className="min-h-[48px] text-blue-600 hover:underline"
        >
          ← Back
        </button>
        <p className="mt-4 text-gray-700">Procedure not found.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Sticky top header */}
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to procedures"
          className="min-h-[48px] shrink-0 text-blue-600 hover:underline"
        >
          ← Back
        </button>
        <div className="flex min-w-0 flex-1 items-baseline justify-end gap-2">
          <h1 className="truncate text-base font-semibold text-gray-900 lg:text-lg">
            {procedure.name}
          </h1>
          <span className="shrink-0 text-sm text-gray-500">
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
        className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-gray-200 bg-white lg:static lg:bottom-auto lg:border-b"
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
              className={`flex min-h-[48px] flex-1 items-center justify-center border-t-2 bg-white px-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </nav>

      {/* Content area.
          TrayChecklist and DocTemplate are kept mounted (via `hidden`) so
          checklist progress and doc edits survive tab switches. VoiceCallout
          is unmounted on leave so speech synthesis is cancelled cleanly. */}
      <main className="flex-1 pb-20 lg:pb-0">
        <div
          role="tabpanel"
          className={activeTab === 'checklist' ? 'block lg:grid lg:grid-cols-2 lg:gap-4' : 'hidden'}
        >
          <TrayChecklist procedure={procedure} checklist={checklist} />
          <div className="hidden lg:block">
            <VoiceCallout procedure={procedure} />
          </div>
        </div>
        {activeTab === 'voice' && (
          <div role="tabpanel" className="px-4 py-3">
            <VoiceCallout procedure={procedure} />
          </div>
        )}
        <div
          role="tabpanel"
          className={`${activeTab === 'docs' ? 'block' : 'hidden'} px-4 py-3`}
        >
          <DocTemplate procedure={procedure} docTemplate={docTemplate} />
        </div>
      </main>
    </div>
  )
}
