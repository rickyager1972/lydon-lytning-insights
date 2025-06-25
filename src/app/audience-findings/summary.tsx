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

export default function AudienceResults() {
  const params = useSearchParams()
  const [personas, setPersonas] = useState<Persona[]>([])

  useEffect(() => {
    const raw = params.get('audience')
    if (!raw) return

    try {
      const decoded = decodeURIComponent(raw)

      // Case 1: already structured JSON
      const parsed = JSON.parse(decoded)
      if (Array.isArray(parsed) && parsed[0]?.name) {
        setPersonas(parsed)
        return
      }

      // Case 2: fallback to parsing raw GPT text
      const text = decoded.replace(/\\n/g, '\n')
      const blocks = text.split(/\n(?=\d+\. Persona Name:)/).filter(Boolean)

      const gptParsed = blocks.map((block) => {
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

      setPersonas(gptParsed)
    } catch {
      setPersonas([])
    }
  }, [params])

  return (
    <div>
      {personas.length === 0 ? (
        <p className="text-red-500">No audience data found. Please return to the home form.</p>
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
    </div>
  )
}
