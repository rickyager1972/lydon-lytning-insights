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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target

    if (type === 'checkbox') {
      const newChannels = checked
        ? [...formData.preferredChannels, value]
        : formData.preferredChannels.filter((v) => v !== value)
      setFormData({ ...formData, preferredChannels: newChannels })
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
      <input name="productFocus" placeholder="Product or Service Focus" onChange={handleChange} className="block border p-2 w-full m
