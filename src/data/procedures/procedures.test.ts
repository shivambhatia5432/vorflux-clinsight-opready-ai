import { describe, it, expect } from 'vitest'
import { ALL_PROCEDURES } from './index'

// NOTE: Task 1 spec lists 16 procedures across 8 category files
// (4 diagnostic + 3 restorative + 2 endo + 2 oral surgery +
//  1 perio + 2 prostho + 1 pediatric + 1 implant = 16).
// The spec's "15" summary appears to miscount; the detailed per-file
// procedure lists are authoritative.
const EXPECTED_COUNT = 16
const FINAL_VOICE_LINE = 'All items confirmed. Tray setup is complete.'

describe('ALL_PROCEDURES', () => {
  it(`contains exactly ${EXPECTED_COUNT} procedures`, () => {
    expect(ALL_PROCEDURES.length).toBe(EXPECTED_COUNT)
  })

  it('has unique procedure ids', () => {
    const ids = ALL_PROCEDURES.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every procedure has required fields populated', () => {
    for (const p of ALL_PROCEDURES) {
      expect(p.id, `id for ${p.name}`).toBeTruthy()
      expect(p.name, `name for ${p.id}`).toBeTruthy()
      expect(p.cdtCode, `cdtCode for ${p.id}`).toBeTruthy()
      expect(p.category, `category for ${p.id}`).toBeTruthy()
      expect(p.instruments.length, `instruments for ${p.id}`).toBeGreaterThan(0)
      expect(p.voiceScript.length, `voiceScript for ${p.id}`).toBeGreaterThan(0)
      expect(p.clinicalNotes.length, `clinicalNotes for ${p.id}`).toBeGreaterThanOrEqual(3)
      expect(p.docTemplate, `docTemplate for ${p.id}`).toBeTruthy()
    }
  })

  it('every voiceScript ends with the confirmation phrase', () => {
    for (const p of ALL_PROCEDURES) {
      const last = p.voiceScript[p.voiceScript.length - 1]
      expect(last, `final voice line for ${p.id}`).toBe(FINAL_VOICE_LINE)
    }
  })

  it('every instrument has a non-empty id, name, and valid critical flag', () => {
    for (const p of ALL_PROCEDURES) {
      for (const inst of p.instruments) {
        expect(inst.id, `instrument id in ${p.id}`).toBeTruthy()
        expect(inst.name, `instrument name in ${p.id}`).toBeTruthy()
        expect(typeof inst.critical).toBe('boolean')
      }
    }
  })
})
