'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function AudienceResults() {
  const params = useSearchParams()
  const [audience, setAudience] = useState<string | null>(null)

  useEffect(() => {
    const raw = params.get('audience')
    if (raw) {
      try {
        setAudience(decodeURIComponent(raw))
      } catch {
        setAudience("Could not decode audience data.")
      }
    }
  }, [params])

  return (
    <>
      {audience ? (
        <div className="p-6 border rounded bg-gray-50 shadow-sm whitespace-pre-wrap text-gray-800">
          {audience}
        </div>
      ) : (
        <p className="text-red-500">No audience data found. Please return to the home form.</p>
      )}
    </>
  )
}
