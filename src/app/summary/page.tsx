import { Suspense } from 'react'
import SummaryResults from './summary'

export default function SummaryPage() {
  return (
    <main className="p-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your AI-Generated Strategy</h1>
      <Suspense fallback={<p>Loading insights...</p>}>
        <SummaryResults />
      </Suspense>
    </main>
  )
}
