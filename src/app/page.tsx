'use client'

import { useState } from 'react'

export default function Home() {
  const [formData, setFormData] = useState({
    brand: '',
    description: '',
    competitors: '',
    productFocus: '',
    objectives: '',
    targetAudience: ''
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res1 = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const summaryData = await res1.json()

      const res2 = await fetch('/api/audience-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const audienceData = await res2.json()

      const queryParams = new URLSearchParams({
        summary: encodeURIComponent(summaryData.summary),
        audience: encodeURIComponent(JSON.stringify(audienceData.personas || []))
      })

      window.location.href = `/summary?${queryParams.toString()}`
    } catch (err) {
      alert('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Lytning AI Strategy Input</h1>

      <input name="brand" placeholder="Brand Name" onChange={handleChange} className="block border p-2 w-full mb-3" />
      <textarea name="description" placeholder="Brand Description" onChange={handleChange} className="block border p-2 w-full mb-3" />
      <textarea name="competitors" placeholder="Competitor Domains (comma-separated)" onChange={handleChange} className="block border p-2 w-full mb-3" />
      <input name="productFocus" placeholder="Product or Service Focus" onChange={handleChange} className="block border p-2 w-full mb-3" />
      <input name="objectives" placeholder="Campaign Objectives" onChange={handleChange} className="block border p-2 w-full mb-3" />
      <input name="targetAudience" placeholder="Target Audience (Optional)" onChange={handleChange} className="block border p-2 w-full mb-3" />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`mt-4 px-4 py-2 text-white rounded ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {loading ? 'Generating...' : 'Generate Findings'}
      </button>

      {loading && (
        <p className="mt-4 text-sm text-gray-600">Generating AI insights. Please wait...</p>
      )}
    </main>
  )
}
