import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { time, subject, subTopic } = await req.json()

    if (!subject) {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 })
    }

    const prompt = `You are a productivity coach for FocusFactory. Create a detailed, actionable focus plan for someone who wants to study/work on: "${subject}"${subTopic ? ` (specifically: ${subTopic})` : ''} for ${time} minutes.

Structure your response with:

1. TIME BREAKDOWN: Break down the ${time} minutes into focused time blocks with specific tasks for each block. Use actual time intervals based on the total time.

2. RECOMMENDED RESOURCES: List 4-5 high-quality resources (documentation, tutorials, articles, videos) they should use. Be specific with names.

3. EXECUTION STEPS: Provide 5-7 actionable steps they should follow, in order, to make the most of this session.

4. SUCCESS TIPS: Give 2-3 brief tips for staying focused and getting the most out of this session.

Make it motivating, specific, and practical. No fluff - just actionable guidance.`

    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyBFTTIWrSm4CMy1YjmRlDv82YutJPYuftI'

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    )

    if (!res.ok) {
      const error = await res.json()
      console.error("Gemini API error:", error)
      return NextResponse.json({
        error: "Failed to generate plan. The API key may be invalid or rate limited."
      }, { status: 500 })
    }

    const data = await res.json()
    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No output generated. Please try again."

    return NextResponse.json({
      output,
      subject,
      time,
      subTopic
    })
  } catch (error) {
    console.error("Error in generate route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
