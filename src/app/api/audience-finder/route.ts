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
You are an audience strategy expert.

Based on the following brand and campaign context:
- Brand: ${brand}
- Description: ${description}
- Product/Service Focus: ${productFocus}
- Objectives: ${objectives}
- Competitors: ${competitors}
- Target Audience Hint: ${targetAudience}

Generate 3–5 distinct audience personas. For each persona, include:
- Persona Name
- Age Range
- Interests
- Digital Behavior
- Platform Affinities (e.g., Google, Instagram, LinkedIn)
- Key Messaging Angle
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
