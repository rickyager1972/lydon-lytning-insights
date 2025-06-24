'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SummaryPage() {
  const params = useSearchParams()
  const [summary, setSummary] = useState<string | null>(null)
  const [audience, setAudience] = useState<string | null>(null)

  useEffect(() => {
    const rawSummary = params.get('summary')
    const rawAudience = params.get('audience')

    if (rawSummary) {
      setSummary(decodeURIComponent(rawSummary))
    }

    if (rawAudience) {
      try {
        const decoded = decodeURIComponent(rawAudience)
        setAudience(decoded)
      } catch {
        setAudience("Unable to decode audience personas.")
      }
    }
  }, [params])

  return (
    <main className="p-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your AI-Generated Strategy</h1>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">🔍 Competitor Strategy Summary</h2>
        {summary ? (
          <div className="p-4 bg-gray-50 border rounded whitespace-pre-wrap">{summary}</div>
        ) : (
          <p>No summary available.</p>
        )}
        <a
          href={`/competitor-findings?summary=${encodeURIComponent(summary || '')}`}
          className="inline-block mt-3 text-blue-600 underline"
        >
          View Full Competitor Insights →
        </a>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">🎯 Audience Persona Findings</h2>
        {audience ? (
          <div className="p-4 bg-gray-50 border rounded whitespace-pre-wrap">{audience}</div>
        ) : (
          <p>No audience data available.</p>
        )}
        <a
          href={`/audience-findings?audience=${encodeURIComponent(audience || '')}`}
          className="inline-block mt-3 text-blue-600 underline"
        >
          View Full Audience Findings →
        </a>
      </div>
    </main>
  )
}
