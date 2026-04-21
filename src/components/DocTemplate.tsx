import { useEffect, useRef, type ChangeEvent } from 'react'
import type { Procedure } from '../data/types'
import type { UseDocTemplateReturn } from '../hooks/useDocTemplate'
import { Toast } from './Toast'

export interface DocTemplateProps {
  procedure: Procedure
  /**
   * Doc-template state owned by the parent so textarea edits survive tab
   * switches. Create it with `useDocTemplate(procedure.docTemplate)` above.
   */
  docTemplate: UseDocTemplateReturn
}

export function DocTemplate({ procedure, docTemplate }: DocTemplateProps) {
  const { text, setText, reset, copyToClipboard, copied, copyError } = docTemplate
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const resizeTextarea = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  // React fires onChange synchronously with the value update, so resizing in
  // this effect (on every `text` change) is sufficient; no onInput needed.
  useEffect(() => {
    if (textareaRef.current) {
      resizeTextarea(textareaRef.current)
    }
  }, [text])

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-gray-900">{procedure.name}</h2>
        <span className="inline-block rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
          {procedure.cdtCode}
        </span>
      </div>
      <p className="text-sm text-gray-500">Clinical Documentation Template</p>

      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        aria-label="Clinical documentation template"
        placeholder="Template will appear here..."
        className="w-full min-h-[300px] rounded border border-gray-300 p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        // 16px prevents iOS Safari from auto-zooming on focus; Tailwind's
        // text-sm (14px) would trigger the zoom behavior.
        style={{ fontSize: '16px' }}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            void copyToClipboard()
          }}
          className="min-h-[48px] rounded bg-blue-600 px-4 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Copy to Clipboard
        </button>
        <button
          type="button"
          onClick={reset}
          className="min-h-[48px] px-4 rounded border border-gray-300 bg-white font-medium text-gray-700 hover:bg-gray-50"
        >
          Reset Template
        </button>
      </div>

      {copyError && (
        <p className="text-sm text-red-600" role="alert">
          {copyError}
        </p>
      )}

      <p className="text-xs text-gray-500">
        Fill in ___ fields and select from option1/option2 choices before copying.
      </p>

      <Toast message="Copied to clipboard!" visible={copied} />
    </div>
  )
}
