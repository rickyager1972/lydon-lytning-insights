import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      brand,
      description,
      competitors,
      productFocus,
      objectives,
      targetAudience,
      preferredChannels,
      durationValue,
      durationUnit,
      budget
    } = body

    const prompt = `
You are a digital media planner. Your job is to recommend the most effective advertising channels and budget allocation based on campaign objectives, brand positioning, audience behavior, and competitor strategy.

Here is the context:
- Brand: ${brand}
- Description: ${description}
- Product Focus: ${productFocus}
- Objectives: ${objectives}
- Target Audience Hint: ${targetAudience}
- Competitor Domains: ${competitors}
- User Preferences:
  - Preferred Channels: ${preferredChannels.join(', ')}
  - Suggested Campaign Duration: ${durationValue} ${durationUnit}
  - Campaign Budget: $${budget}

Return a recommended media plan that includes:
Media Plan:
- Recommended Distribution Channels:
- Duration:
- Budget Allocation by Channel:
- Justification (if different from user preferences):

Respond using this exact structure. Be concise and professional. If your plan differs from user suggestions, explain why.
`

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })

    const plan = response.choices[0].message?.content || 'No media plan returned.'

    return NextResponse.json({ plan })
  } catch (error: unknown) {
    console.error('Error generating media plan:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
