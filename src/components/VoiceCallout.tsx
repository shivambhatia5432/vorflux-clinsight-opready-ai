import { useEffect, useRef, useState } from 'react'
import type { Procedure } from '../data/types'
import { useVoiceCallout } from '../hooks/useVoiceCallout'
import { btnDanger, btnPrimary, btnSecondary } from './ui/buttonStyles'

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
        <div className="rounded-2xl border border-yellow-900/40 bg-yellow-950/30 p-4 text-sm text-yellow-300">
          Voice callout is not available in this browser. Use the visual tracker below to step
          through items manually.
        </div>

        <div className="rounded-2xl border border-[#2e2e2e] bg-[#242424] p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#a0a0a0]">
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
              className={`${btnSecondary} flex-1 px-4`}
            >
              ← Previous
            </button>
            <button
              type="button"
              onClick={() => setManualIndex(i => Math.min(script.length - 1, i + 1))}
              disabled={manualIndex >= script.length - 1}
              className={`${btnPrimary} flex-1 px-4`}
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

  const statusLabel =
    status === 'done'
      ? 'Complete'
      : status === 'idle'
        ? 'Ready'
        : `Item ${Math.min(currentIndex + 1, script.length)} of ${script.length}`

  return (
    <div className="space-y-5">
      {/* Status + controls */}
      <div className="rounded-2xl border border-[#2e2e2e] bg-[#242424] p-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#a0a0a0]">
          {statusLabel}
        </p>

        <div className="flex flex-wrap gap-2">
          {(status === 'idle' || status === 'done') && (
            <button type="button" onClick={start} className={btnPrimary}>
              ▶ Start Callout
            </button>
          )}
          {status === 'playing' && (
            <>
              <button type="button" onClick={pause} className={btnSecondary}>
                ⏸ Pause
              </button>
              <button type="button" onClick={stop} className={btnDanger}>
                ⏹ Stop
              </button>
            </>
          )}
          {status === 'paused' && (
            <>
              <button type="button" onClick={resume} className={btnPrimary}>
                ▶ Resume
              </button>
              <button type="button" onClick={stop} className={btnDanger}>
                ⏹ Stop
              </button>
            </>
          )}
        </div>

        {/* Speech rate */}
        <div className="mt-5 flex items-center gap-4">
          <label htmlFor="speech-rate" className="shrink-0 text-xs font-semibold text-[#a0a0a0]">
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
          <span className="w-10 shrink-0 text-right text-xs font-bold text-white">
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
        <div className="rounded-2xl border border-green-900/40 bg-green-950/30 p-4 text-sm font-semibold text-green-300">
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

        const glyph = isCompleted
          ? { char: '✓', cls: 'text-green-400' }
          : isCurrent
            ? { char: '▶', cls: 'text-[#4f8df7]' }
            : { char: '○', cls: 'text-[#a0a0a0]' }

        return (
          <li
            key={idx}
            ref={isCurrent ? currentItemRef : undefined}
            className={`flex items-start gap-3 border-l-2 px-4 py-3 text-sm transition-colors ${
              isCurrent
                ? 'border-[#4f8df7] bg-[#0445AF]/10 font-bold text-white'
                : isCompleted
                  ? 'border-transparent text-[#8a8a8a]'
                  : 'border-transparent text-[#a0a0a0]'
            }`}
          >
            <span className={`mt-0.5 shrink-0 text-xs ${glyph.cls}`}>{glyph.char}</span>
            <span className={isCompleted ? 'line-through' : ''}>{item}</span>
          </li>
        )
      })}
    </ul>
  )
}
