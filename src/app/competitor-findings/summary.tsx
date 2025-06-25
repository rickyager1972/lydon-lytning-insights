'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function CompetitorSummary() {
  const params = useSearchParams()
  const [summary, setSummary] = useState<string | null>(null)

  useEffect(() => {
    const raw = params.get('summary')
    if (raw) {
      const decoded = decodeURIComponent(raw).replace(/\\n/g, '\n')
      setSummary(decoded)
    }
  }, [params])

  return (
    <div>
      {summary ? (
        <div className="border rounded-lg p-4 bg-white shadow-sm whitespace-pre-wrap text-gray-800">
          {summary.split('\n').map((line, idx) => {
            const match = line.match(/^(-?\s*)([\w\s&]+):\s*(.*)$/)
            if (match) {
              const [, prefix, label, content] = match
              return (
                <p key={idx}>
                  {prefix}<strong>{label}:</strong> {content}
                </p>
              )
            }
            return <p key={idx}>{line}</p>
          })}
        </div>
      ) : (
        <p className="text-red-500">No summary data found. Please return to the home form.</p>
      )}
    </div>
  )
}
