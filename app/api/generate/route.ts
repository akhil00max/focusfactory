import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { time, subject, subTopic } = await req.json()
    
    if (!subject) {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 })
    }

    const prompt = `Create a study/focus plan for ${subject} - ${subTopic || ''} in ${time} minutes.`

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY || 'AIzaSyBFTTIWrSm4CMy1YjmRlDv82YutJPYuftI'}`,
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
      return NextResponse.json({ error: "Failed to generate plan. Please check your API key." }, { status: 500 })
    }

    const data = await res.json()
    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No output"

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
