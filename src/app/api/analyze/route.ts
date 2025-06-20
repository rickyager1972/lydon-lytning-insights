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
You are a strategist analyzing display ads from the following competitors: ${body.competitors}.
Summarize:
- Key messaging themes
- Common calls to action
- Emotional tone or style
- Implied target audience
    `.trim()

    console.log("🧠 Prompt to OpenAI:", prompt)

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
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