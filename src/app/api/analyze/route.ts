import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log("✅ Received body:", body)

    if (!body?.competitors) {
      console.log("❌ Missing 'competitors' field in request body.")
      return NextResponse.json({ error: "Missing 'competitors'" }, { status: 400 })
    }

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
`.trim()

    console.log("🧠 Prompt to OpenAI:", prompt)

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    })

    console.log("✅ OpenAI response:", JSON.stringify(response))

    const summary = response.choices?.[0]?.message?.content || "No summary generated"
    return NextResponse.json({ summary })

  } catch (error: unknown) {
    console.error("🔥 Caught error in /api/analyze")

    if (error instanceof Error) {
      console.error("Detailed message:", error.message)
      console.error("Full stack:", error.stack)
    } else {
      console.error("Non-standard error object:", JSON.stringify(error))
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}