import type { Procedure } from '../types'
import { diagnosticProcedures } from './diagnostic'
import { restorativeProcedures } from './restorative'
import { endodonticsProcedures } from './endodontics'
import { oralSurgeryProcedures } from './oral-surgery'
import { periodonticsProcedures } from './periodontics'
import { prosthodonticsProcedures } from './prosthodontics'
import { pediatricProcedures } from './pediatric'
import { implantsProcedures } from './implants'

export const ALL_PROCEDURES: Procedure[] = [
  ...diagnosticProcedures,
  ...restorativeProcedures,
  ...endodonticsProcedures,
  ...oralSurgeryProcedures,
  ...periodonticsProcedures,
  ...prosthodonticsProcedures,
  ...pediatricProcedures,
  ...implantsProcedures,
]
