export type InstrumentCategory =
  | 'Exam'
  | 'Anesthesia'
  | 'Handpiece'
  | 'Bur'
  | 'Scaling'
  | 'Matrix'
  | 'Bonding'
  | 'Restorative'
  | 'Surgical'
  | 'Impression'
  | 'Endo'
  | 'Implant'
  | 'Supply'

export type ProcedureCategory =
  | 'Diagnostic'
  | 'Restorative'
  | 'Endodontics'
  | 'Oral Surgery'
  | 'Periodontics'
  | 'Prosthodontics'
  | 'Pediatric'
  | 'Implants'

export interface Instrument {
  id: string
  name: string
  category: InstrumentCategory
  critical: boolean
}

export interface Procedure {
  id: string
  name: string
  cdtCode: string
  category: ProcedureCategory
  instruments: Instrument[]
  /** Voice-over steps. Always ends with "All items confirmed. Tray setup is complete." */
  voiceScript: string[]
  clinicalNotes: string[]
  /** ___ = fill-in field, option1/option2 = selection fields */
  docTemplate: string
}
