import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDocTemplate } from './useDocTemplate'

const INITIAL = 'Patient ___ treated today. Option: option1/option2.'

describe('useDocTemplate', () => {
  let mockClipboard: { writeText: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    mockClipboard = { writeText: vi.fn().mockResolvedValue(undefined) }
    vi.stubGlobal('navigator', { clipboard: mockClipboard })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('initializes text to the provided template', () => {
    const { result } = renderHook(() => useDocTemplate(INITIAL))
    expect(result.current.text).toBe(INITIAL)
    expect(result.current.copied).toBe(false)
    expect(result.current.copyError).toBeNull()
  })

  it('setText updates the text', () => {
    const { result } = renderHook(() => useDocTemplate(INITIAL))
    act(() => {
      result.current.setText('updated text')
    })
    expect(result.current.text).toBe('updated text')
  })

  it('reset() restores the original template after edits', () => {
    const { result } = renderHook(() => useDocTemplate(INITIAL))
    act(() => {
      result.current.setText('edited')
    })
    expect(result.current.text).toBe('edited')
    act(() => {
      result.current.reset()
    })
    expect(result.current.text).toBe(INITIAL)
  })

  it('copyToClipboard() calls navigator.clipboard.writeText with current text', async () => {
    const { result } = renderHook(() => useDocTemplate(INITIAL))
    act(() => {
      result.current.setText('new content')
    })
    await act(async () => {
      await result.current.copyToClipboard()
    })
    expect(mockClipboard.writeText).toHaveBeenCalledTimes(1)
    expect(mockClipboard.writeText).toHaveBeenCalledWith('new content')
  })

  it('copied becomes true after a successful copy', async () => {
    const { result } = renderHook(() => useDocTemplate(INITIAL))
    await act(async () => {
      await result.current.copyToClipboard()
    })
    expect(result.current.copied).toBe(true)
    expect(result.current.copyError).toBeNull()
  })

  it('copied becomes false after 2 seconds', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useDocTemplate(INITIAL))
    await act(async () => {
      await result.current.copyToClipboard()
    })
    expect(result.current.copied).toBe(true)
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(result.current.copied).toBe(false)
  })

  it('copyError is set when clipboard write fails', async () => {
    mockClipboard.writeText.mockRejectedValueOnce(new Error('denied'))
    const { result } = renderHook(() => useDocTemplate(INITIAL))
    await act(async () => {
      await result.current.copyToClipboard()
    })
    expect(result.current.copyError).toBe('Failed to copy. Please copy manually.')
    expect(result.current.copied).toBe(false)
  })
})
