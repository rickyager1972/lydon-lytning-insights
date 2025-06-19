'use client'

import { useState } from 'react'

export default function Home() {
  const [formData, setFormData] = useState({
    brand: '',
    description: '',
    competitors: '',
    productFocus: '',
    objectives: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    const data = await res.json()
    alert(JSON.stringify(data, null, 2)) // Shows the result
  }

  return (
    <main className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Competitor Insights</h1>
      <input name="brand" placeholder="Brand Name" onChange={handleChange} className="block border p-2 w-full mb-3" />
      <textarea name="description" placeholder="Brand Description" onChange={handleChange} className="block border p-2 w-full mb-3" />
      <textarea name="competitors" placeholder="Competitor Websites (comma-separated)" onChange={handleChange} className="block border p-2 w-full mb-3" />
      <input name="productFocus" placeholder="Product Focus" onChange={handleChange} className="block border p-2 w-full mb-3" />
      <input name="objectives" placeholder="Campaign Objectives" onChange={handleChange} className="block border p-2 w-full mb-3" />
      <button onClick={handleSubmit} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Analyze</button>
    </main>
  )
}