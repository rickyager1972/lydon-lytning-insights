'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

type Persona = {
  name: string
  ageRange: string
  interests: string
  behavior: string
  platforms: string
  message: string
}

export default function SummaryResults() {
  const params = useSearchParams()
  const [summaryBlocks, setSummaryBlocks] = useState<string[]>([])
  const [personas, setPersonas] = useState<Persona[]>([])

  useEffect(() => {
    const rawSummary = params.get('summary')
    const rawAudience = params.get('audience')

    if (rawSummary) {
      const decoded = decodeURIComponent(rawSummary).replace(/\\n/g, '\n')

      // Match start of each competitor block using known keywords
      const blocks = decoded.split(/\n(?=Competitor:|Brand:|\d+\.\s?Competitor)/).filter(Boolean)

      setSummaryBlocks(blocks)
    }

    if (rawAudience) {
      try {
        const decoded = decodeURIComponent(rawAudience).replace(/\\n/g, '\n')
        const blocks = decoded.split(/\n(?=\d+\. Persona Name:)/).filter(Boolean)

        const parsed: Persona[] = blocks.map((block) => {
          const get = (label: string) => {
            const match = block.match(new RegExp(`${label}:\\s*(.+)`, 'i'))
            return match?.[1]?.trim() || ''
          }

          return {
            name: get('Persona Name'),
            ageRange: get('Age Range'),
            interests: get('Interests'),
            behavior: get('Digital Behavior'),
            platforms: get('Platform Affinities'),
            message: get('Key Messaging Angle')
          }
        })

        setPersonas(parsed)
      } catch {
        setPersonas([])
      }
    }
  }, [params])

  return (
    <>
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-3">🔍 Competitor Strategy Summary</h2>
        {summaryBlocks.length > 0 ? (
          <div className="space-y-6">
            {summaryBlocks.map((block, i) => (
              <div key={i} className="border rounded-lg p-4 bg-white shadow-sm text-gray-800">
                {block.split('\n').map((line, idx) => {
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
            ))}
          </div>
        ) : (
          <p className="text-red-500">No summary available.</p>
        )}
        <a
          href={`/competitor-findings?summary=${encodeURIComponent(summaryBlocks.join('\n\n'))}`}
          className="inline-block mt-3 text-blue-600 underline"
        >
          View Full Competitor Insights →
        </a>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-3">🎯 Audience Persona Findings</h2>
        {personas.length === 0 ? (
          <p>No audience data found.</p>
        ) : (
          <div className="space-y-6">
            {personas.map((p, i) => (
              <div key={i} className="border rounded-lg p-4 bg-white shadow-sm">
                <h3 className="text-lg font-semibold mb-2">{p.name || `Persona ${i + 1}`}</h3>
                <p><strong>Age Range:</strong> {p.ageRange}</p>
                <p><strong>Interests:</strong> {p.interests}</p>
                <p><strong>Digital Behavior:</strong> {p.behavior}</p>
                <p><strong>Platform Affinities:</strong> {p.platforms}</p>
                <p><strong>Messaging Angle:</strong> {p.message}</p>
              </div>
            ))}
          </div>
        )}
        <a
          href={`/audience-findings?audience=${encodeURIComponent(JSON.stringify(personas))}`}
          className="inline-block mt-3 text-blue-600 underline"
        >
          View Full Audience Findings →
        </a>
      </div>
    </>
  )
}
