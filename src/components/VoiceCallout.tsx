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
        <div className="rounded border-l-4 border-yellow-400 bg-yellow-50 p-4 text-yellow-800">
          Voice callout is not available in this browser. Use the visual tracker below to step
          through items manually.
        </div>

        <div className="rounded border border-gray-200 bg-white p-4">
          <p className="mb-2 text-sm text-gray-600">
            Item {manualIndex + 1} of {script.length}
          </p>
          <p className="mb-4 rounded bg-blue-50 p-3 text-lg font-semibold text-blue-900">
            {script[manualIndex]}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setManualIndex(i => Math.max(0, i - 1))}
              disabled={manualIndex === 0}
              className="min-h-[48px] rounded bg-gray-200 px-6 font-medium text-gray-800 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ← Previous
            </button>
            <button
              type="button"
              onClick={() => setManualIndex(i => Math.min(script.length - 1, i + 1))}
              disabled={manualIndex >= script.length - 1}
              className="min-h-[48px] rounded bg-blue-600 px-6 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {(status === 'idle' || status === 'done') && (
          <button
            type="button"
            onClick={start}
            className="min-h-[48px] rounded bg-blue-600 px-4 font-medium text-white hover:bg-blue-700"
          >
            ▶ Start Callout
          </button>
        )}
        {status === 'playing' && (
          <>
            <button
              type="button"
              onClick={pause}
              className="min-h-[48px] rounded bg-yellow-500 px-4 font-medium text-white hover:bg-yellow-600"
            >
              ⏸ Pause
            </button>
            <button
              type="button"
              onClick={stop}
              className="min-h-[48px] rounded bg-red-600 px-4 font-medium text-white hover:bg-red-700"
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
              className="min-h-[48px] rounded bg-green-600 px-4 font-medium text-white hover:bg-green-700"
            >
              ▶ Resume
            </button>
            <button
              type="button"
              onClick={stop}
              className="min-h-[48px] rounded bg-red-600 px-4 font-medium text-white hover:bg-red-700"
            >
              ⏹ Stop
            </button>
          </>
        )}
      </div>

      {/* Speech rate slider */}
      <div className="flex items-center gap-3">
        <label htmlFor="speech-rate" className="text-sm font-medium text-gray-700">
          Speed: {speechRate.toFixed(1)}x
        </label>
        <input
          id="speech-rate"
          type="range"
          min="0.5"
          max="1.5"
          step="0.1"
          value={speechRate}
          onChange={e => setSpeechRate(parseFloat(e.target.value))}
          className="flex-1 max-w-xs"
        />
      </div>

      {/* Progress label */}
      <p className="text-sm font-medium text-gray-700">
        {status === 'done'
          ? 'Complete!'
          : `Item ${Math.min(currentIndex + 1, script.length)} of ${script.length}`}
      </p>

      {/* Visual tracker */}
      <ScriptList
        script={script}
        activeIndex={currentIndex}
        currentItemRef={currentItemRef}
      />

      {/* Completion banner */}
      {status === 'done' && (
        <div className="rounded border-l-4 border-green-500 bg-green-50 p-4 font-medium text-green-800">
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
    <ul className="max-h-80 overflow-y-auto rounded border border-gray-200 bg-white">
      {script.map((item, idx) => {
        const isCurrent = idx === activeIndex
        const isCompleted = idx < activeIndex
        const isPending = idx > activeIndex

        let className = 'px-4 py-2 border-l-4 '
        if (isCurrent) {
          className += 'bg-blue-50 border-blue-500 font-bold text-blue-900'
        } else if (isCompleted) {
          className += 'border-transparent text-gray-500'
        } else {
          className += 'border-transparent text-gray-700 opacity-70'
        }

        return (
          <li
            key={idx}
            ref={isCurrent ? currentItemRef : undefined}
            className={className}
          >
            {isCompleted && <span className="mr-2">✓</span>}
            {isPending && <span className="mr-2 text-gray-400">•</span>}
            {item}
          </li>
        )
      })}
    </ul>
  )
}
