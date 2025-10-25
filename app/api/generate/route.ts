import { NextResponse } from "next/server"

// Helper functions to get subject-specific resources
function getSubjectDocumentation(subject: string): string {
  const subjectLower = subject.toLowerCase()

  if (subjectLower.includes('react') || subjectLower.includes('javascript') || subjectLower.includes('js')) {
    return 'https://react.dev/learn'
  } else if (subjectLower.includes('python')) {
    return 'https://docs.python.org/3/tutorial/'
  } else if (subjectLower.includes('java')) {
    return 'https://docs.oracle.com/javase/tutorial/'
  } else if (subjectLower.includes('node') || subjectLower.includes('nodejs')) {
    return 'https://nodejs.org/docs/'
  } else if (subjectLower.includes('typescript') || subjectLower.includes('ts')) {
    return 'https://www.typescriptlang.org/docs/'
  } else if (subjectLower.includes('html')) {
    return 'https://developer.mozilla.org/en-US/docs/Web/HTML'
  } else if (subjectLower.includes('css')) {
    return 'https://developer.mozilla.org/en-US/docs/Web/CSS'
  } else if (subjectLower.includes('sql') || subjectLower.includes('database')) {
    return 'https://www.w3schools.com/sql/'
  } else if (subjectLower.includes('git')) {
    return 'https://git-scm.com/doc'
  } else if (subjectLower.includes('docker')) {
    return 'https://docs.docker.com/'
  } else if (subjectLower.includes('aws') || subjectLower.includes('cloud')) {
    return 'https://docs.aws.amazon.com/'
  } else {
    return 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
  }
}

function getSubjectExercises(subject: string): string {
  const subjectLower = subject.toLowerCase()

  if (subjectLower.includes('javascript') || subjectLower.includes('js') || subjectLower.includes('react') || subjectLower.includes('node')) {
    return 'https://leetcode.com/problemset/all/'
  } else if (subjectLower.includes('python')) {
    return 'https://www.hackerrank.com/domains/python'
  } else if (subjectLower.includes('java')) {
    return 'https://www.hackerrank.com/domains/java'
  } else if (subjectLower.includes('sql') || subjectLower.includes('database')) {
    return 'https://www.hackerrank.com/domains/sql'
  } else if (subjectLower.includes('algorithm') || subjectLower.includes('data structure')) {
    return 'https://leetcode.com/problemset/all/'
  } else if (subjectLower.includes('html') || subjectLower.includes('css') || subjectLower.includes('web')) {
    return 'https://www.freecodecamp.org/'
  } else if (subjectLower.includes('machine learning') || subjectLower.includes('ml') || subjectLower.includes('ai')) {
    return 'https://www.kaggle.com/learn'
  } else {
    return 'https://leetcode.com/problemset/all/'
  }
}

export async function POST(req: Request) {
  try {
    const { time, subject, subTopic } = await req.json()

    if (!subject) {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY environment variable. Please add it to your .env.local file." },
        { status: 500 }
      )
    }

    // Enhanced prompt for structured study roadmap with subject-specific resources
    const prompt = `Create a detailed study roadmap for "${subject}"${subTopic ? ` - Topic: ${subTopic}` : ''} with ${time} minutes available.

Return a JSON object with this exact structure:
{
  "studyPlan": "# Study Roadmap: ${subject}${subTopic ? ` - ${subTopic}` : ''}\n\n## Quick Prerequisites\n- Basic knowledge needed\n- Required background\n\n## Minute-by-Minute Roadmap\n| Time | Duration | Activity | Task | Resource | Key Takeaways |\n|------|----------|----------|------|----------|---------------|\n| 0-5min | 5 min | Watch | Introduction video | [YouTube link] | Main concepts |\n| 5-10min | 5 min | Practice | Hands-on exercise | [Practice link] | Apply learning |\n| 10-15min | 5 min | Review | Summarize notes | - | Key points |\n\n## Step-by-Step Guidance\n1. **Step 1**: [Detailed instruction]\n2. **Step 2**: [Detailed instruction]\n3. **Step 3**: [Detailed instruction]\n\n## Practice Exercises\n- Exercise 1: [Description]\n- Exercise 2: [Description]\n\n## Key Points to Remember\n- Important concept 1\n- Important concept 2\n- Important concept 3\n\n## Next Steps\n1. Review your notes\n2. Practice more exercises\n3. Test your understanding",
  "resources": {
    "video": "[Specific YouTube video URL for ${subject}${subTopic ? ` ${subTopic}` : ''}]",
    "documentation": "[Official documentation URL for ${subject}]",
    "exercises": "[Practice platform URL for ${subject}]"
  },
  "subject": "${subject}",
  "time": "${time}",
  "subTopic": "${subTopic || ''}",
  "format": "markdown"
}

CRITICAL REQUIREMENTS:
- For "video": Provide a REAL, SPECIFIC YouTube video URL that teaches ${subject}${subTopic ? ` specifically about ${subTopic}` : ''}
- For "documentation": Provide the OFFICIAL documentation URL for ${subject} (e.g., React docs for React, Python docs for Python, etc.)
- For "exercises": Provide a REAL practice platform URL that has ${subject} exercises
- Make sure ALL URLs are real, working, and directly relevant to ${subject}${subTopic ? ` and ${subTopic}` : ''}
- Create a detailed minute-by-minute breakdown with specific timestamps
- Include step-by-step guidance for each phase
- Focus on practical, actionable tasks`

    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.6,
            topK: 40,
            topP: 0.9,
            maxOutputTokens: 1000,
            candidateCount: 1
          }
        }),
      }
    )

    if (!res.ok) {
      let details: any = undefined
      try { details = await res.json() } catch { }
      console.error("Gemini API error:", details)
      const message = details?.error?.message || "Failed to generate plan. The API key may be invalid, the model may be unavailable, or you may be rate limited."
      return NextResponse.json({ error: message, details }, { status: 500 })
    }

    const data = await res.json()
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""

    console.log('Gemini response:', text)

    // Try to parse as JSON first
    let payload: any
    try {
      payload = JSON.parse(text)
    } catch {
      // If not JSON, create a structured study roadmap
      const timeInt = parseInt(time)
      const introTime = Math.floor(timeInt * 0.3)
      const practiceTime = Math.floor(timeInt * 0.5)
      const reviewTime = timeInt - introTime - practiceTime

      payload = {
        studyPlan: `# Study Roadmap: ${subject}${subTopic ? ` - ${subTopic}` : ''}\n\n## Quick Prerequisites\n- Basic understanding of ${subject}\n- Willingness to learn and practice\n\n## Minute-by-Minute Roadmap\n| Time | Duration | Activity | Task | Resource | Key Takeaways |\n|------|----------|----------|------|----------|---------------|\n| 0-${introTime}min | ${introTime} min | Learn | Introduction to ${subject} | [YouTube: ${subject} tutorial] | Core concepts |\n| ${introTime}-${introTime + practiceTime}min | ${practiceTime} min | Practice | Hands-on exercises | [Practice platform] | Apply knowledge |\n| ${introTime + practiceTime}-${time}min | ${reviewTime} min | Review | Summarize and test | [Quiz/Test] | Retention check |\n\n## Step-by-Step Guidance\n1. **Phase 1 (0-${introTime}min)**: Watch introduction video and take notes\n2. **Phase 2 (${introTime}-${introTime + practiceTime}min)**: Complete hands-on exercises\n3. **Phase 3 (${introTime + practiceTime}-${time}min)**: Review notes and test understanding\n\n## Practice Exercises\n- Exercise 1: Basic ${subject} concepts\n- Exercise 2: Intermediate ${subject} problems\n- Exercise 3: Advanced ${subject} challenges\n\n## Key Points to Remember\n- Focus on understanding, not memorization\n- Practice regularly for better retention\n- Ask questions when stuck\n\n## Next Steps\n1. Review your notes after each session\n2. Practice daily for 15-30 minutes\n3. Join study groups or forums for ${subject}`,
        resources: {
          video: "https://www.youtube.com/results?search_query=" + encodeURIComponent(subject + (subTopic ? ' ' + subTopic : '') + ' tutorial'),
          documentation: getSubjectDocumentation(subject),
          exercises: getSubjectExercises(subject)
        },
        subject,
        time,
        subTopic: subTopic || "",
        format: "markdown"
      }
    }

    return NextResponse.json(payload)
  } catch (error) {
    console.error('Error in generate route:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
