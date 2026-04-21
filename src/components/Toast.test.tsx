import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Toast } from './Toast'

describe('Toast', () => {
  it('renders the message text', () => {
    render(<Toast message="Copied to clipboard!" visible={true} />)
    expect(screen.getByText('Copied to clipboard!')).toBeInTheDocument()
  })

  it('has role="status" and aria-live="polite" for screen readers', () => {
    render(<Toast message="Hello" visible={true} />)
    const toast = screen.getByRole('status')
    expect(toast).toHaveAttribute('aria-live', 'polite')
  })

  it('is visible (opacity-100, no aria-hidden) when visible=true', () => {
    render(<Toast message="Visible!" visible={true} />)
    const toast = screen.getByRole('status')
    expect(toast.className).toContain('opacity-100')
    expect(toast.className).not.toContain('opacity-0')
    expect(toast).not.toHaveAttribute('aria-hidden', 'true')
  })

  it('is hidden (opacity-0, aria-hidden, pointer-events-none) when visible=false', () => {
    render(<Toast message="Hidden" visible={false} />)
    // aria-hidden removes it from the accessibility tree, so we need `hidden: true`.
    const toast = screen.getByRole('status', { hidden: true })
    expect(toast.className).toContain('opacity-0')
    expect(toast.className).toContain('pointer-events-none')
    expect(toast).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies fixed positioning and mobile-first tab bar clearance', () => {
    render(<Toast message="positioned" visible={true} />)
    const toast = screen.getByRole('status')
    expect(toast.className).toContain('fixed')
    expect(toast.className).toContain('bottom-20')
    expect(toast.className).toContain('lg:bottom-6')
    expect(toast.className).toContain('z-50')
  })

  it('uses a transition so the show/hide animates', () => {
    render(<Toast message="animated" visible={true} />)
    const toast = screen.getByRole('status')
    expect(toast.className).toMatch(/transition-(all|opacity)/)
    expect(toast.className).toContain('duration-200')
  })
})
