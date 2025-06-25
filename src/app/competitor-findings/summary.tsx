'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function CompetitorSummary() {
  const params = useSearchParams()
  const [sections, setSections] = useState<string[]>([])

  useEffect(() => {
    const raw = params.get('summary')
    if (!raw) return

    const decoded = decodeURIComponent(raw).replace(/\\n/g, '\n')

    // Split each competitor block on "Competitor:" or "Brand:"
    const blocks = decoded.split(/\n(?=Competitor:|Brand:)/).filter(Boolean)

    setSections(blocks)
  }, [params])

  return (
    <div className="space-y-6">
      {sections.length === 0 ? (
        <p className="text-red-500">No competitor summary found.</p>
      ) : (
        sections.map((block, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white shadow-sm text-gray-800">
            {block.split('\n').map((line, i) => {
              const match = line.match(/^(-?\s*)([\w\s&]+):\s*(.*)$/)
              if (match) {
                const [, prefix, label, content] = match
                return (
                  <p key={i}>
                    {prefix}<strong>{label}:</strong> {content}
                  </p>
                )
              }
              return <p key={i}>{line}</p>
            })}
          </div>
        ))
      )}
    </div>
  )
}
