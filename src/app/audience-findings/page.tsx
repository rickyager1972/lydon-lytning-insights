import { Suspense } from 'react'
import AudienceResults from './summary'

export default function AudienceFindingsPage() {
  return (
    <main className="p-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Audience Persona Findings</h1>
      <Suspense fallback={<p>Loading audience data...</p>}>
        <AudienceResults />
      </Suspense>
    </main>
  )
}
