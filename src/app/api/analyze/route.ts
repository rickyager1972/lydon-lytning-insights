import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { competitors } = body

  const compList = competitors.split(',').map((c: string) => c.trim())

  const fakeAds = [
    "Save on programmatic media today!",
    "White-labeled DSP services for agencies",
    "Maximize your ad spend with AI optimization"
  ]

  const prompt = `
You are a strategist analyzing ads from competitors: ${compList.join(', ')}.

Here are sample ads:
${fakeAds.join('\n')}

Summarize:
- Common messaging themes
- Typical CTAs
- Audience targeting cues
  `

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }]
  })

  return NextResponse.json({ summary: response.choices[0].message.content })
}