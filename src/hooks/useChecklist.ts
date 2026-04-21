import { useState, useCallback } from 'react'
import type { Instrument } from '../data/types'

export interface UseChecklistReturn {
  checked: Set<string>
  toggle: (id: string) => void
  checkAll: () => void
  reset: () => void
  /** Completion percentage, 0-100. Returns 0 when instruments is empty. */
  progress: number
}

export function useChecklist(instruments: Instrument[]): UseChecklistReturn {
  const [checked, setChecked] = useState<Set<string>>(() => new Set())

  const toggle = useCallback((id: string) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const checkAll = useCallback(() => {
    setChecked(new Set(instruments.map(i => i.id)))
  }, [instruments])

  const reset = useCallback(() => {
    setChecked(new Set())
  }, [])

  const progress =
    instruments.length === 0
      ? 0
      : Math.round((checked.size / instruments.length) * 100)

  return { checked, toggle, checkAll, reset, progress }
}
