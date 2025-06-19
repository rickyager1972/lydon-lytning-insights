import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log("Received formData:", body)

    if (!body || !body.competitors) {
      return NextResponse.json({ error: "Missing input" }, { status: 400 })
    }

    const prompt = `
You are a strategist analyzing ads from competitors: ${body.competitors}.
Give a summary of typical value propositions, CTAs, and audience focus.
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    })

    const output = completion.choices[0].message?.content || "No response from model."

    return NextResponse.json({ summary: output })
  } catch (error: any) {
    console.error("Error in /api/analyze:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}