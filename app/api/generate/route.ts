import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { time, subject, subTopic } = await req.json()
    
    if (!subject) {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 })
    }

    const prompt = `You are a world-class Learning Experience Designer + Curriculum Engineer creating a study plan for a student. 
    
    Create a structured, minute-by-minute study plan for:
    - Subject: ${subject}
    - Topic: ${subTopic || 'General'}
    - Total Time: ${time} minutes
    
    Your output MUST follow this exact markdown template:
    
    # Subject: ${subject} — Topic: ${subTopic || 'General'} — Total time: ${time} minutes
    
    ## Quick prerequisites (1–3 bullets)
    - [List only the most critical prerequisites]
    
    ## Minute-by-minute roadmap
    | Time window | Duration | Activity type | Task (very specific) | Resource (link + precise offset) | Things to write down | 3 focus prompts |
    |-------------|----------|---------------|----------------------|----------------------------------|---------------------|-----------------|
    | 00:00–XX:XX | X min    | [Watch/Read/Practice] | [Specific task] | [Direct URL + timestamp] | [Key points] | [3 questions] |
    
    ## Micro-practice (exact steps + expected answer format)
    1. [Specific task]  
       Expected answer pattern: [Clear format]
    
    ## "Topics to watch out for" (3 bullets)
    - [Common pitfall/misconception]
    
    ## 3-step Follow-up plan
    1. [Next step]
    2. [Medium-term step]
    3. [Long-term step]
    
    ## Resources (as JSON object):
    {
      "study_plan": "[The full markdown content above]",
      "resources": {
        "video": "[YouTube URL]",
        "documentation": "[Documentation URL]",
        "exercises": "[Exercises URL]"
      }
    }`
    
    // Using the latest Gemini 2.5 Flash model
    const apiKey = 'AIzaSyBFTTIWrSm4CMy1YjmRlDv82YutJPYuftI';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    console.log('Sending request to Gemini API...');
    
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const responseData = await response.json();
    
    console.log('API Response status:', response.status);
    console.log('API Response data:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      console.error('API Error:', responseData);
      return NextResponse.json(
        { 
          error: 'Failed to generate plan',
          details: responseData?.error?.message || 'Unknown error occurred'
        },
        { status: response.status || 500 }
      );
    }

    const responseText = responseData.candidates?.[0]?.content?.parts?.[0]?.text || 'No output generated';
    
    // Try to extract JSON from the response
    let parsedResponse;
    try {
      // First try to find a JSON block in the response
      const jsonMatch = responseText.match(/```(?:json)?\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : responseText;
      parsedResponse = JSON.parse(jsonString);
      
      // If we have a study_plan in the response, use that as the main content
      if (parsedResponse.study_plan) {
        return NextResponse.json({
          studyPlan: parsedResponse.study_plan,
          resources: {
            video: parsedResponse.resources?.video || "",
            documentation: parsedResponse.resources?.documentation || "",
            exercises: parsedResponse.resources?.exercises || ""
          },
          subject,
          time,
          subTopic,
          format: 'markdown' // Indicate that the response is in markdown format
        });
      }
      
      // If no study_plan but has resources, use the full response as study plan
      if (parsedResponse.resources) {
        return NextResponse.json({
          studyPlan: responseText, // Fallback to full response
          resources: parsedResponse.resources,
          subject,
          time,
          subTopic,
          format: 'markdown'
        });
      }
    } catch (e) {
      console.error('Error parsing JSON response:', e);
    }
    
    // Fallback: treat the whole response as markdown
    return NextResponse.json({
      studyPlan: responseText,
      resources: {
        video: "",
        documentation: "",
        exercises: ""
      },
      subject,
      time,
      subTopic,
      format: 'markdown'
    });
    
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
