export interface ToastProps {
  message: string
  visible: boolean
}

export function Toast({ message, visible }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-hidden={visible ? undefined : 'true'}
      className={`fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-[#383838] bg-[#242424] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(0,0,0,0.6)] transition-all duration-200 lg:bottom-6 ${
        visible ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-2'
      }`}
    >
      {message}
    </div>
  )
}
