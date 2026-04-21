import { useCallback, useEffect, useRef, useState } from 'react'

export type CalloutStatus = 'idle' | 'playing' | 'paused' | 'done'

/** Milliseconds to pause between consecutive script items. */
const INTER_ITEM_PAUSE_MS = 600

export interface UseVoiceCalloutReturn {
  supported: boolean
  status: CalloutStatus
  currentIndex: number
  speechRate: number
  setSpeechRate: (rate: number) => void
  start: () => void
  pause: () => void
  resume: () => void
  stop: () => void
}

/** Lazy sync check — `supported` cannot change at runtime, so no effect needed. */
function detectSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function useVoiceCallout(script: string[]): UseVoiceCalloutReturn {
  const [supported] = useState<boolean>(detectSupported)
  const [status, setStatus] = useState<CalloutStatus>('idle')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [speechRate, setSpeechRate] = useState(0.9)

  // Refs to avoid stale closures inside speakItem
  const speechRateRef = useRef(speechRate)
  const scriptRef = useRef(script)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  // Pending timeout id for the inter-item pause; must be cancellable on
  // stop()/pause()/unmount to avoid speech continuing after the user aborts.
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    speechRateRef.current = speechRate
  }, [speechRate])

  useEffect(() => {
    scriptRef.current = script
  }, [script])

  const clearPendingPause = useCallback(() => {
    if (pauseTimeoutRef.current !== null) {
      clearTimeout(pauseTimeoutRef.current)
      pauseTimeoutRef.current = null
    }
  }, [])

  // Cleanup on unmount: cancel any in-flight utterance and pending chained call.
  useEffect(() => {
    return () => {
      clearPendingPause()
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [clearPendingPause])

  const speakItem = useCallback(
    (index: number) => {
      const currentScript = scriptRef.current
      if (index >= currentScript.length) {
        setStatus('done')
        return
      }
      const utterance = new SpeechSynthesisUtterance(currentScript[index])
      utterance.rate = speechRateRef.current
      utterance.onend = () => {
        // If the utterance ref no longer points at us, we've been cancelled;
        // bail out instead of scheduling the next item.
        if (utteranceRef.current !== utterance) return
        pauseTimeoutRef.current = setTimeout(() => {
          pauseTimeoutRef.current = null
          setCurrentIndex(index + 1)
          speakItem(index + 1)
        }, INTER_ITEM_PAUSE_MS)
      }
      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    },
    [],
  )

  const start = useCallback(() => {
    // Read length from the ref so this matches exactly what speakItem will see.
    if (!supported || scriptRef.current.length === 0) return
    clearPendingPause()
    setStatus('playing')
    setCurrentIndex(0)
    speakItem(0)
  }, [supported, speakItem, clearPendingPause])

  const pause = useCallback(() => {
    if (!supported) return
    // A chained setTimeout would otherwise fire during the paused state and
    // start the next utterance despite the user pressing Pause.
    clearPendingPause()
    window.speechSynthesis.pause()
    setStatus('paused')
  }, [supported, clearPendingPause])

  const resume = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.resume()
    setStatus('playing')
  }, [supported])

  const stop = useCallback(() => {
    if (!supported) return
    clearPendingPause()
    // Dropping the ref ensures any onend that has already fired but not yet
    // scheduled its setTimeout (and any future onend) becomes a no-op.
    utteranceRef.current = null
    window.speechSynthesis.cancel()
    setStatus('idle')
    setCurrentIndex(0)
  }, [supported, clearPendingPause])

  return {
    supported,
    status,
    currentIndex,
    speechRate,
    setSpeechRate,
    start,
    pause,
    resume,
    stop,
  }
}
