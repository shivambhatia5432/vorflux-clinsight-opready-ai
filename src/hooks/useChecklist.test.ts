import { describe, it, expect } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useChecklist } from './useChecklist'
import type { Instrument } from '../data/types'

const INSTRUMENTS: Instrument[] = [
  { id: 'a', name: 'Mirror', category: 'Exam', critical: false },
  { id: 'b', name: 'Explorer', category: 'Exam', critical: true },
  { id: 'c', name: 'Probe', category: 'Exam', critical: false },
  { id: 'd', name: 'Cotton Pliers', category: 'Exam', critical: false },
]

describe('useChecklist', () => {
  it('toggle adds an unchecked item', () => {
    const { result } = renderHook(() => useChecklist(INSTRUMENTS))
    expect(result.current.checked.has('a')).toBe(false)

    act(() => {
      result.current.toggle('a')
    })

    expect(result.current.checked.has('a')).toBe(true)
    expect(result.current.checked.size).toBe(1)
  })

  it('toggle removes a checked item', () => {
    const { result } = renderHook(() => useChecklist(INSTRUMENTS))

    act(() => {
      result.current.toggle('b')
    })
    expect(result.current.checked.has('b')).toBe(true)

    act(() => {
      result.current.toggle('b')
    })
    expect(result.current.checked.has('b')).toBe(false)
    expect(result.current.checked.size).toBe(0)
  })

  it('checkAll marks all instruments as checked', () => {
    const { result } = renderHook(() => useChecklist(INSTRUMENTS))

    act(() => {
      result.current.checkAll()
    })

    expect(result.current.checked.size).toBe(INSTRUMENTS.length)
    for (const instrument of INSTRUMENTS) {
      expect(result.current.checked.has(instrument.id)).toBe(true)
    }
  })

  it('reset clears all checked items', () => {
    const { result } = renderHook(() => useChecklist(INSTRUMENTS))

    act(() => {
      result.current.checkAll()
    })
    expect(result.current.checked.size).toBe(INSTRUMENTS.length)

    act(() => {
      result.current.reset()
    })
    expect(result.current.checked.size).toBe(0)
  })

  it('progress returns 0 for empty instruments array', () => {
    const { result } = renderHook(() => useChecklist([]))
    expect(result.current.progress).toBe(0)
  })

  it('progress returns 100 when all items checked', () => {
    const { result } = renderHook(() => useChecklist(INSTRUMENTS))

    act(() => {
      result.current.checkAll()
    })

    expect(result.current.progress).toBe(100)
  })

  it('progress returns correct partial percentage', () => {
    const { result } = renderHook(() => useChecklist(INSTRUMENTS))

    // 1 of 4 = 25%
    act(() => {
      result.current.toggle('a')
    })
    expect(result.current.progress).toBe(25)

    // 2 of 4 = 50%
    act(() => {
      result.current.toggle('b')
    })
    expect(result.current.progress).toBe(50)

    // 3 of 4 = 75%
    act(() => {
      result.current.toggle('c')
    })
    expect(result.current.progress).toBe(75)
  })
})
