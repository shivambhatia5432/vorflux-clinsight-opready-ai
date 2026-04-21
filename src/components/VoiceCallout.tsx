import { useEffect, useRef, useState } from 'react'
import type { Procedure } from '../data/types'
import { useVoiceCallout } from '../hooks/useVoiceCallout'

interface VoiceCalloutProps {
  procedure: Procedure
}

export function VoiceCallout({ procedure }: VoiceCalloutProps) {
  const script = procedure.voiceScript
  const {
    supported,
    status,
    currentIndex,
    speechRate,
    setSpeechRate,
    start,
    pause,
    resume,
    stop,
  } = useVoiceCallout(script)

  // Manual mode state (used only when speech synthesis is not supported)
  const [manualIndex, setManualIndex] = useState(0)

  const activeIndex = supported ? currentIndex : manualIndex
  const currentItemRef = useRef<HTMLLIElement | null>(null)

  useEffect(() => {
    if (currentItemRef.current) {
      currentItemRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [activeIndex])

  if (!supported) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-yellow-900/40 bg-yellow-950/30 p-4 text-sm text-yellow-400">
          Voice callout is not available in this browser. Use the visual tracker below to step
          through items manually.
        </div>

        <div className="rounded-2xl border border-[#2e2e2e] bg-[#242424] p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#666666]">
            Item {manualIndex + 1} of {script.length}
          </p>
          <p className="mb-5 text-lg font-bold text-white">
            {script[manualIndex]}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setManualIndex(i => Math.max(0, i - 1))}
              disabled={manualIndex === 0}
              className="min-h-[48px] flex-1 rounded-xl border border-[#383838] bg-[#2e2e2e] text-sm font-semibold text-[#a0a0a0] transition-all hover:border-[#4a4a4a] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              ← Previous
            </button>
            <button
              type="button"
              onClick={() => setManualIndex(i => Math.min(script.length - 1, i + 1))}
              disabled={manualIndex >= script.length - 1}
              className="min-h-[48px] flex-1 rounded-xl bg-[#0445AF] text-sm font-semibold text-white transition-all hover:bg-[#0356d4] disabled:cursor-not-allowed disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        </div>

        <ScriptList
          script={script}
          activeIndex={manualIndex}
          currentItemRef={currentItemRef}
        />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Status + controls */}
      <div className="rounded-2xl border border-[#2e2e2e] bg-[#242424] p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#666666]">
          {status === 'done'
            ? 'Complete'
            : status === 'idle'
              ? 'Ready'
              : `Item ${Math.min(currentIndex + 1, script.length)} of ${script.length}`}
        </p>

        <div className="flex flex-wrap gap-2">
          {(status === 'idle' || status === 'done') && (
            <button
              type="button"
              onClick={start}
              className="min-h-[48px] rounded-xl bg-[#0445AF] px-6 text-sm font-bold text-white transition-all hover:bg-[#0356d4] active:scale-95"
            >
              ▶ Start Callout
            </button>
          )}
          {status === 'playing' && (
            <>
              <button
                type="button"
                onClick={pause}
                className="min-h-[48px] rounded-xl border border-[#383838] bg-[#2e2e2e] px-6 text-sm font-bold text-[#a0a0a0] transition-all hover:text-white active:scale-95"
              >
                ⏸ Pause
              </button>
              <button
                type="button"
                onClick={stop}
                className="min-h-[48px] rounded-xl border border-red-900/50 bg-red-950/30 px-6 text-sm font-bold text-red-400 transition-all hover:bg-red-900/40 active:scale-95"
              >
                ⏹ Stop
              </button>
            </>
          )}
          {status === 'paused' && (
            <>
              <button
                type="button"
                onClick={resume}
                className="min-h-[48px] rounded-xl bg-[#0445AF] px-6 text-sm font-bold text-white transition-all hover:bg-[#0356d4] active:scale-95"
              >
                ▶ Resume
              </button>
              <button
                type="button"
                onClick={stop}
                className="min-h-[48px] rounded-xl border border-red-900/50 bg-red-950/30 px-6 text-sm font-bold text-red-400 transition-all hover:bg-red-900/40 active:scale-95"
              >
                ⏹ Stop
              </button>
            </>
          )}
        </div>

        {/* Speech rate */}
        <div className="mt-5 flex items-center gap-4">
          <label htmlFor="speech-rate" className="shrink-0 text-xs font-semibold text-[#666666]">
            Speed
          </label>
          <input
            id="speech-rate"
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={speechRate}
            onChange={e => setSpeechRate(parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="w-10 shrink-0 text-right text-xs font-bold text-[#a0a0a0]">
            {speechRate.toFixed(1)}×
          </span>
        </div>
      </div>

      {/* Visual tracker */}
      <ScriptList
        script={script}
        activeIndex={currentIndex}
        currentItemRef={currentItemRef}
      />

      {/* Completion banner */}
      {status === 'done' && (
        <div className="rounded-2xl border border-green-900/40 bg-green-950/30 p-4 text-sm font-semibold text-green-400">
          ✓ All items confirmed. Tray setup is complete.
        </div>
      )}
    </div>
  )
}

interface ScriptListProps {
  script: string[]
  activeIndex: number
  currentItemRef: React.RefObject<HTMLLIElement>
}

function ScriptList({ script, activeIndex, currentItemRef }: ScriptListProps) {
  return (
    <ul className="max-h-80 overflow-y-auto rounded-2xl border border-[#2e2e2e] bg-[#242424]">
      {script.map((item, idx) => {
        const isCurrent = idx === activeIndex
        const isCompleted = idx < activeIndex

        return (
          <li
            key={idx}
            ref={isCurrent ? currentItemRef : undefined}
            className={`flex items-start gap-3 border-l-2 px-4 py-3 text-sm transition-colors ${
              isCurrent
                ? 'border-[#0445AF] bg-[#0445AF]/10 font-bold text-white'
                : isCompleted
                  ? 'border-transparent text-[#4a4a4a]'
                  : 'border-transparent text-[#666666]'
            }`}
          >
            <span className="mt-0.5 shrink-0 text-xs">
              {isCompleted ? (
                <span className="text-green-500">✓</span>
              ) : isCurrent ? (
                <span className="text-[#0445AF]">▶</span>
              ) : (
                <span className="text-[#383838]">○</span>
              )}
            </span>
            <span className={isCompleted ? 'line-through' : ''}>{item}</span>
          </li>
        )
      })}
    </ul>
  )
}
