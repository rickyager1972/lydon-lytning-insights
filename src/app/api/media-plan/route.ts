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
You are a digital media planner creating a campaign strategy for a brand.

Context:
- Brand: ${brand}
- Description: ${description}
- Product Focus: ${productFocus}
- Objectives: ${objectives}
- Competitor Domains: ${competitors}
- Target Audience Hint: ${targetAudience}
- Campaign Budget: $${budget}
- User Preferences:
  - Preferred Channels: ${preferredChannels.join(', ')}
  - Suggested Duration: ${durationValue} ${durationUnit}

Your task:
1. Recommend an optimized set of distribution channels based on the target audience, product, and competitor activity — not just user preferences.
2. Allocate the campaign budget across these channels effectively.
3. Flag any platforms where the user’s preferred spend is too low to perform well.
4. Suggest reallocations where needed.
5. Always explain your reasoning if diverging from the user's preferences.

Minimum Recommended Spend Guidelines:
- Google Display Network: $300+
- Facebook / Instagram: $300+
- LinkedIn: $1,000+
- Twitter / X: $500+
- TikTok: $500+
- YouTube: $500+

Format your response exactly as follows:

Media Plan:
- Recommended Channels:
- Campaign Duration:
- Budget Allocation by Channel:
- Notes & Rationale (explain any platform adjustments or exclusions):
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
