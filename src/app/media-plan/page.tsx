import { Suspense } from 'react'
import MediaPlanPage from './summary'

export default function MediaPlanRoute() {
  return (
    <main className="p-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Budget + Media Plan</h1>
      <Suspense fallback={<p>Loading media plan data...</p>}>
        <MediaPlanPage />
      </Suspense>
    </main>
  )
}
