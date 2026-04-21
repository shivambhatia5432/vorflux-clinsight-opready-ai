import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useVoiceCallout } from './useVoiceCallout'

interface MockUtterance {
  text: string
  rate: number
  onend: (() => void) | null
}

class MockSpeechSynthesisUtterance implements MockUtterance {
  text: string
  rate = 1
  onend: (() => void) | null = null
  constructor(text: string) {
    this.text = text
  }
}

const mockSpeechSynthesis = {
  speak: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  cancel: vi.fn(),
}

const SCRIPT = ['Step one', 'Step two', 'All items confirmed. Tray setup is complete.']

describe('useVoiceCallout', () => {
  beforeEach(() => {
    mockSpeechSynthesis.speak.mockClear()
    mockSpeechSynthesis.pause.mockClear()
    mockSpeechSynthesis.resume.mockClear()
    mockSpeechSynthesis.cancel.mockClear()
    vi.stubGlobal('speechSynthesis', mockSpeechSynthesis)
    vi.stubGlobal('SpeechSynthesisUtterance', MockSpeechSynthesisUtterance)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('sets supported to true when speechSynthesis is in window', () => {
    const { result } = renderHook(() => useVoiceCallout(SCRIPT))
    expect(result.current.supported).toBe(true)
  })

  it('sets supported to false when speechSynthesis is NOT in window', () => {
    vi.stubGlobal('speechSynthesis', undefined)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).speechSynthesis

    const { result } = renderHook(() => useVoiceCallout(SCRIPT))
    expect(result.current.supported).toBe(false)
  })

  it('start() calls speechSynthesis.speak with the first script item', () => {
    const { result } = renderHook(() => useVoiceCallout(SCRIPT))

    act(() => {
      result.current.start()
    })

    expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(1)
    const utterance = mockSpeechSynthesis.speak.mock.calls[0][0] as MockUtterance
    expect(utterance.text).toBe(SCRIPT[0])
    expect(result.current.status).toBe('playing')
    expect(result.current.currentIndex).toBe(0)
  })

  it('pause() calls speechSynthesis.pause() and sets status to paused', () => {
    const { result } = renderHook(() => useVoiceCallout(SCRIPT))

    act(() => {
      result.current.start()
    })
    act(() => {
      result.current.pause()
    })

    expect(mockSpeechSynthesis.pause).toHaveBeenCalledTimes(1)
    expect(result.current.status).toBe('paused')
  })

  it('resume() calls speechSynthesis.resume() and sets status to playing', () => {
    const { result } = renderHook(() => useVoiceCallout(SCRIPT))

    act(() => {
      result.current.start()
    })
    act(() => {
      result.current.pause()
    })
    act(() => {
      result.current.resume()
    })

    expect(mockSpeechSynthesis.resume).toHaveBeenCalledTimes(1)
    expect(result.current.status).toBe('playing')
  })

  it('stop() calls speechSynthesis.cancel() and resets currentIndex to 0', () => {
    const { result, unmount } = renderHook(() => useVoiceCallout(SCRIPT))

    act(() => {
      result.current.start()
    })
    act(() => {
      result.current.stop()
    })

    // Exactly one cancel from stop(); unmount cleanup will add another.
    expect(mockSpeechSynthesis.cancel).toHaveBeenCalledTimes(1)
    expect(result.current.status).toBe('idle')
    expect(result.current.currentIndex).toBe(0)

    unmount()
    expect(mockSpeechSynthesis.cancel).toHaveBeenCalledTimes(2)
  })

  it('start() does not call speechSynthesis.speak when not supported', () => {
    vi.stubGlobal('speechSynthesis', undefined)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).speechSynthesis

    const { result } = renderHook(() => useVoiceCallout(SCRIPT))

    act(() => {
      result.current.start()
    })

    expect(mockSpeechSynthesis.speak).not.toHaveBeenCalled()
  })

  it('stop() during the inter-item pause prevents the next utterance', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useVoiceCallout(SCRIPT))

    act(() => {
      result.current.start()
    })
    expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(1)

    // Simulate the first utterance ending: this schedules a setTimeout to
    // start the next one after INTER_ITEM_PAUSE_MS.
    const firstUtterance = mockSpeechSynthesis.speak.mock.calls[0][0] as MockUtterance
    act(() => {
      firstUtterance.onend?.()
    })

    // User presses Stop during the 600 ms gap.
    act(() => {
      result.current.stop()
    })

    // Advancing time should NOT trigger another speak().
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(1)
  })

  it('pause() during the inter-item pause prevents the next utterance', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useVoiceCallout(SCRIPT))

    act(() => {
      result.current.start()
    })
    const firstUtterance = mockSpeechSynthesis.speak.mock.calls[0][0] as MockUtterance
    act(() => {
      firstUtterance.onend?.()
    })

    act(() => {
      result.current.pause()
    })

    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(1)
    expect(result.current.status).toBe('paused')
  })

  it('unmount during the inter-item pause cancels the pending next utterance', () => {
    vi.useFakeTimers()
    const { result, unmount } = renderHook(() => useVoiceCallout(SCRIPT))

    act(() => {
      result.current.start()
    })
    const firstUtterance = mockSpeechSynthesis.speak.mock.calls[0][0] as MockUtterance
    act(() => {
      firstUtterance.onend?.()
    })

    unmount()

    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(mockSpeechSynthesis.speak).toHaveBeenCalledTimes(1)
  })
})
