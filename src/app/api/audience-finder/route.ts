import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { brand, description, competitors, productFocus, objectives, targetAudience } = body

const prompt = `
You are an audience strategist creating segments for a digital ad campaign.

Based on the following context:
- Brand: ${brand}
- Description: ${description}
- Product/Service Focus: ${productFocus}
- Objectives: ${objectives}
- Competitors: ${competitors}
- Target Audience Hint: ${targetAudience}

Generate exactly 4 distinct audience personas using the following format:

1. Persona Name: [Name] – [Title or Role]
   - Age Range:
   - Interests:
   - Digital Behavior:
   - Platform Affinities:
   - Key Messaging Angle:

Only return these 4 personas in this structure — no preamble or additional text.
`


    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })

    const text = response.choices[0].message?.content || "No personas returned."

    return NextResponse.json({
      personas: text
    })
  } catch (error: unknown) {
    console.error("Error generating audience personas:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
