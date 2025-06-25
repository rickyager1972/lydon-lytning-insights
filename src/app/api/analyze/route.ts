import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { brand, description, competitors, productFocus, objectives } = body

    const prompt = `
You are an advertising strategist helping summarize key competitor ad tactics.

Based on the following brand context:
- Brand: ${brand}
- Description: ${description}
- Product Focus: ${productFocus}
- Objectives: ${objectives}
- Competitor Websites: ${competitors}

Return a competitor strategy summary using the following format. Create one card per competitor:

Competitor: [Name or Website]
Messaging Themes:
Tone:
Target Audience:
Display Ad Style:
Call to Action Phrases:
Unique Positioning:
---

Each competitor section should use exactly these labeled headings. Be concise but informative.
`

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })

    const summary = response.choices[0].message?.content || 'No summary returned.'

    return NextResponse.json({ summary })
  } catch (error: unknown) {
    console.error('Error generating competitor insights:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
