'use client'

import { useState } from 'react'

export default function Home() {
  const [formData, setFormData] = useState({
    brand: '',
    description: '',
    competitors: '',
    productFocus: '',
    objectives: '',
    targetAudience: '',
    preferredChannels: [] as string[],
    durationValue: '',
    durationUnit: 'weeks',
    budget: ''
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target

    if (type === 'checkbox') {
      const updatedChannels = checked
        ? [...formData.preferredChannels, value]
        : formData.preferredChannels.filter((v) => v !== value)
      setFormData({ ...formData, preferredChannels: updatedChannels })
    } else {
      setFormData({ ...formData, [name]: value })
    }
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

      const res3 = await fetch('/api/media-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const mediaData = await res3.json()

      const queryParams = new URLSearchParams({
        summary: encodeURIComponent(summaryData.summary),
        audience: encodeURIComponent(JSON.stringify(audienceData.personas || [])),
        mediaPlan: encodeURIComponent(mediaData.plan || '')
      })

      window.location.href = `/summary?${queryParams.toString()}`
    } catch (err) {
      alert('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const channels = [
    'Google Display Network',
    'Facebook / Instagram',
    'LinkedIn',
    'Twitter / X',
    'YouTube',
    'TikTok',
    'Programmatic DSP',
    'Reddit'
  ]

  return (
    <main className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Lytning AI Strategy Input</h1>

      <input name="brand" placeholder="Brand Name" onChange={handleChange} className="block border p-2 w-full mb-3" />
      <textarea name="description" placeholder="Brand Description" onChange={handleChange} className="block border p-2 w-full mb-3" />
      <textarea name="competitors" placeholder="Competitor Domains (comma-separated)" onChange={handleChange} className="block border p-2 w-full mb-3" />
      <input name="productFocus" placeholder="Product or Service Focus" onChange={handleChange} className="block border p-2 w-full mb-3" />
      <input name="objectives" placeholder="Campaign Objectives" onChange={handleChange} className="block border p-2 w-full mb-3" />
      <input name="targetAudience" placeholder="Target Audience (Optional)" onChange={handleChange} className="block border p-2 w-full mb-6" />

      <label className="font-semibold block mb-2">Preferred Distribution Channels</label>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {channels.map((channel) => (
          <label key={channel} className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="preferredChannels"
              value={channel}
              checked={formData.preferredChannels.includes(channel)}
              onChange={handleChange}
            />
            <span className="text-sm">{channel}</span>
          </label>
        ))}
      </div>

      <label className="font-semibold block mb-2">Campaign Duration</label>
      <div className="flex space-x-2 mb-4">
        <input
          type="number"
          name="durationValue"
          placeholder="e.g. 6"
          onChange={handleChange}
          className="border p-2 w-2/3"
        />
        <select name="durationUnit" value={formData.durationUnit} onChange={handleChange} className="border p-2 w-1/3">
          <option value="weeks">Weeks</option>
          <option value="months">Months</option>
        </select>
      </div>

      <input
        name="budget"
        placeholder="Campaign Budget (USD)"
        onChange={handleChange}
        className="block border p-2 w-full mb-6"
      />

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
