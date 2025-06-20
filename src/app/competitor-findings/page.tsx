import { Suspense } from 'react'
import CompetitorSummary from './summary'

export default function CompetitorFindingsPage() {
  return (
    <main className="p-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Competitor Strategy Summary</h1>
      <Suspense fallback={<p>Loading summary...</p>}>
        <CompetitorSummary />
      </Suspense>
    </main>
  )
}