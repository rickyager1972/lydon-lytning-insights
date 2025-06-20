'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function CompetitorSummary() {
  const params = useSearchParams()
  const [summary, setSummary] = useState<string | null>(null)

  useEffect(() => {
    const raw = params.get('summary')
    if (raw) {
      try {
        setSummary(decodeURIComponent(raw))
      } catch {
        setSummary("Could not decode the summary text.")
      }
    }
  }, [params])

  if (!summary) {
    return <p className="text-gray-600">No summary found. Please return to the main form and try again.</p>
  }

  return (
    <div className="p-6 border rounded bg-gray-50 shadow-sm whitespace-pre-wrap text-gray-800">
      {summary}
    </div>
  )
}