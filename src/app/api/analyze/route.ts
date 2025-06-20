export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log("✅ Received body:", body)

    if (!body?.competitors) {
      console.log("❌ Missing 'competitors'")
      return NextResponse.json({ error: "Missing 'competitors'" }, { status: 400 })
    }

    const prompt = `
You are a strategist analyzing display ads from: ${body.competitors}.
Summarize the key messaging, CTAs, tone, and target audience.
    `.trim()

    console.log("🧠 Prompt to OpenAI:", prompt)

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    })

    console.log("✅ OpenAI response:", JSON.stringify(response))

    const summary = response.choices?.[0]?.message?.content || "No summary generated"
    return NextResponse.json({ summary })

  } catch (error: unknown) {
    console.error("🔥 Caught Error in /api/analyze")

    if (error instanceof Error) {
      console.error("Detailed message:", error.message)
      console.error("Full stack:", error.stack)
    } else {
      console.error("Non-standard error:", JSON.stringify(error))
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}