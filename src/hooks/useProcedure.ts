import { ALL_PROCEDURES } from '../data/procedures'
import type { Procedure } from '../data/types'

export function useProcedure(id: string): Procedure | undefined {
  return ALL_PROCEDURES.find(p => p.id === id)
}
