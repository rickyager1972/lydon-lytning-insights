'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function CompetitorFindingsPage() {
  const params = useSearchParams()
  const [summary, setSummary] = useState<string | null>(null)

  useEffect(() => {
    const raw = params.get('summary')
    if (raw) {
      try {
        setSummary(decodeURIComponent(raw))
      } catch (err) {
        setSummary("Could not decode summary.")
      }
    }
  }, [params])

  return (
    <main className="p-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Competitor Strategy Summary</h1>
      {summary ? (
        <div className="p-6 border rounded bg-gray-50 whitespace-pre-wrap shadow-sm text-gray-800">
          {summary}
        </div>
      ) : (
        <p>No summary found. Please go back and analyze a competitor first.</p>
      )}
    </main>
  )
}