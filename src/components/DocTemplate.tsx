import { useEffect, useRef, type ChangeEvent } from 'react'
import type { Procedure } from '../data/types'
import type { UseDocTemplateReturn } from '../hooks/useDocTemplate'
import { Toast } from './Toast'
import { btnPrimary, btnSecondary } from './ui/buttonStyles'

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
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#a0a0a0]">
          Documentation Template
        </p>
        <h2 className="text-xl font-bold text-white">{procedure.name}</h2>
        <span className="mt-1 inline-block rounded-md bg-[#2e2e2e] px-2 py-0.5 text-xs font-medium text-[#a0a0a0]">
          {procedure.cdtCode}
        </span>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        aria-label="Clinical documentation template"
        placeholder="Template will appear here..."
        className="w-full min-h-[300px] resize-none rounded-2xl border border-[#2e2e2e] bg-[#242424] p-4 font-mono text-white transition-colors focus:border-[#4f8df7] focus:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-[#4f8df7]/40"
        // 16px prevents iOS Safari from auto-zooming on focus; Tailwind's
        // text-sm (14px) would trigger the zoom behavior.
        style={{ fontSize: '16px', lineHeight: '1.6' }}
      />

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            void copyToClipboard()
          }}
          className={btnPrimary}
        >
          Copy to Clipboard
        </button>
        <button
          type="button"
          onClick={reset}
          className={btnSecondary}
        >
          Reset Template
        </button>
      </div>

      {copyError && (
        <p className="text-sm text-red-300" role="alert">
          {copyError}
        </p>
      )}

      <p className="text-xs text-[#a0a0a0]">
        Fill in ___ fields and select from option1/option2 choices before copying.
      </p>

      <Toast message="Copied to clipboard!" visible={copied} />
    </div>
  )
}
