import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseDocTemplateReturn {
  text: string
  setText: (text: string) => void
  reset: () => void
  copyToClipboard: () => Promise<void>
  copied: boolean
  copyError: string | null
}

export function useDocTemplate(initialTemplate: string): UseDocTemplateReturn {
  const [text, setText] = useState<string>(initialTemplate)
  const [copied, setCopied] = useState<boolean>(false)
  const [copyError, setCopyError] = useState<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  const reset = useCallback(() => {
    setText(initialTemplate)
  }, [initialTemplate])

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyError(null)
      setCopied(true)
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setCopied(false)
        timeoutRef.current = null
      }, 2000)
    } catch {
      setCopyError('Failed to copy. Please copy manually.')
    }
  }, [text])

  return {
    text,
    setText,
    reset,
    copyToClipboard,
    copied,
    copyError,
  }
}
