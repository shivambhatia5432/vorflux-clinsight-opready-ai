import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TrayView } from './TrayView'
import { ALL_PROCEDURES } from '../data/procedures'

/*
 * Smoke coverage for the Typeform-inspired restyle. These tests don't
 * assert exact class strings (too brittle for visual tweaks) — they
 * cover the behavioral regressions the restyle is most likely to
 * introduce:
 *
 *   1. Tab switching renders the expected panel.
 *   2. The active tab is marked with aria-selected and is `position:
 *      relative` so its underline indicator sits under the button
 *      rather than the whole tab bar.
 *   3. The "Not found" fallback still renders on an unknown id.
 */

// Speech synthesis is unavailable in jsdom; stub `supported=false` by
// making sure `window.speechSynthesis` is undefined for these tests.
// jsdom also doesn't implement `Element.scrollIntoView`, which the
// VoiceCallout visual tracker calls in an effect — provide a noop so the
// TrayChecklist + hidden VoiceCallout split view can mount.
beforeEach(() => {
  delete (globalThis as { speechSynthesis?: unknown }).speechSynthesis
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {}
  }
})

const FIRST_PROCEDURE = ALL_PROCEDURES[0]

describe('TrayView', () => {
  it('renders the header with the procedure name and CDT code', () => {
    render(<TrayView procedureId={FIRST_PROCEDURE.id} onBack={() => {}} />)
    expect(
      screen.getByRole('heading', { level: 1, name: FIRST_PROCEDURE.name }),
    ).toBeInTheDocument()
    // CDT code appears in both the sticky header and the (hidden on this
    // tab) docs panel, so allow multiple matches.
    expect(screen.getAllByText(FIRST_PROCEDURE.cdtCode).length).toBeGreaterThan(0)
  })

  it('starts on the Checklist tab with aria-selected=true', () => {
    render(<TrayView procedureId={FIRST_PROCEDURE.id} onBack={() => {}} />)
    const tablist = screen.getByRole('tablist', { name: /tray view sections/i })
    const checklistTab = within(tablist).getByRole('tab', { name: /checklist/i })
    const voiceTab = within(tablist).getByRole('tab', { name: /voice/i })
    const docsTab = within(tablist).getByRole('tab', { name: /docs/i })

    expect(checklistTab).toHaveAttribute('aria-selected', 'true')
    expect(voiceTab).toHaveAttribute('aria-selected', 'false')
    expect(docsTab).toHaveAttribute('aria-selected', 'false')
  })

  it('each tab button is `position: relative` so the active underline anchors to the button, not the nav', () => {
    // Regression guard for the dead <style> tag that previously promoted
    // the <nav> to `position: relative`, causing the mobile indicator to
    // span the entire tab bar.
    render(<TrayView procedureId={FIRST_PROCEDURE.id} onBack={() => {}} />)
    const tablist = screen.getByRole('tablist', { name: /tray view sections/i })
    for (const tab of within(tablist).getAllByRole('tab')) {
      expect(tab.className).toMatch(/\brelative\b/)
    }
  })

  it('switching to the Docs tab reveals the documentation template heading', () => {
    render(<TrayView procedureId={FIRST_PROCEDURE.id} onBack={() => {}} />)
    const docsTab = screen.getByRole('tab', { name: /docs/i })
    fireEvent.click(docsTab)

    expect(docsTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText(/documentation template/i)).toBeInTheDocument()
  })

  it('switching to the Voice tab renders the voice callout region', () => {
    render(<TrayView procedureId={FIRST_PROCEDURE.id} onBack={() => {}} />)
    const voiceTab = screen.getByRole('tab', { name: /voice/i })
    fireEvent.click(voiceTab)

    expect(voiceTab).toHaveAttribute('aria-selected', 'true')
    // Without speech-synthesis support, the VoiceCallout falls back to
    // manual mode, which shows a "Voice callout is not available" note.
    // The desktop split view on the Checklist tab also mounts a
    // VoiceCallout in a `hidden lg:block` container, so allow multiple.
    expect(
      screen.getAllByText(/voice callout is not available/i).length,
    ).toBeGreaterThan(0)
  })

  it('invokes onBack when the back button is clicked', () => {
    const onBack = vi.fn()
    render(<TrayView procedureId={FIRST_PROCEDURE.id} onBack={onBack} />)
    fireEvent.click(screen.getByRole('button', { name: /back to procedures/i }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })

  it('falls back to a "not found" message for an unknown procedure id', () => {
    render(<TrayView procedureId="does-not-exist" onBack={() => {}} />)
    expect(screen.getByText(/procedure not found/i)).toBeInTheDocument()
  })
})
