import { useState } from 'react'
import { ProcedureSelector } from './components/ProcedureSelector'
import { TrayView } from './components/TrayView'

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (selectedId) {
    return (
      <TrayView
        procedureId={selectedId}
        onBack={() => setSelectedId(null)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#191919]">
      <ProcedureSelector onSelect={setSelectedId} />
    </div>
  )
}
