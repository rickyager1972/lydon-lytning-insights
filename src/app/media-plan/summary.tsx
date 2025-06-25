'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function MediaPlanPage() {
  const params = useSearchParams()
  const [plan, setPlan] = useState<string | null>(null)

  useEffect(() => {
    const raw = params.get('mediaPlan')
    if (raw) {
      setPlan(decodeURIComponent(raw).replace(/\\n/g, '\n'))
    }
  }, [params])

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">💰 Budget + Media Plan</h2>
      {plan ? (
        <div className="border rounded-lg p-4 bg-white shadow-sm whitespace-pre-wrap text-gray-800">
          {plan.split('\n').map((line, idx) => {
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
        <p className="text-red-500">No media plan data found.</p>
      )}
    </div>
  )
}
