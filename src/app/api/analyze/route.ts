import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body?.competitors) {
      return NextResponse.json({ error: "Missing 'competitors'" }, { status: 400 })
    }

    const prompt = `
You are a strategist analyzing display ads from: ${body.competitors}.
Summarize the key messaging, CTAs, tone, and target audience.
`

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    })

    return NextResponse.json({
      summary: response.choices[0].message?.content || "No summary generated"
    })
  catch (error: unknown) {
  if (error instanceof Error) {
    console.error("Detailed error in /api/analyze:", error.message)
  } else {
    console.error("Unknown error:", JSON.stringify(error))
  }
  return NextResponse.json({ error: "Server error" }, { status: 500 })
}
}