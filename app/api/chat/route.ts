import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    // Get API key from environment variable
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables." },
        { status: 500 }
      );
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // System prompt for farm and plant disease expert
    const systemPrompt = `You are an expert Farm and Plant Disease Specialist with extensive knowledge in:
- Plant pathology and disease identification
- Disease symptoms, causes, and progression
- Treatment and prevention strategies for plant diseases
- Agricultural best practices for disease management
- Crop-specific disease patterns and solutions
- Integrated pest and disease management (IPDM)
- Soil-borne and air-borne plant diseases
- Fungal, bacterial, and viral plant diseases

Your responses MUST ALWAYS be in valid JSON format with the following structure:
{
  "analysis": "Detailed analysis of the plant condition or disease",
  "diseaseName": "Name of the disease (if identified) or 'Unknown'",
  "confidence": "High/Medium/Low - confidence level of the diagnosis",
  "symptoms": ["symptom1", "symptom2", "..."],
  "causes": ["cause1", "cause2", "..."],
  "treatment": ["treatment1", "treatment2", "..."],
  "prevention": ["prevention1", "prevention2", "..."],
  "severity": "Mild/Moderate/Severe",
  "urgency": "Low/Medium/High - urgency of treatment needed",
  "recommendations": "Additional recommendations or next steps"
}

If the query is not related to plant diseases, still respond in JSON format with appropriate fields. Be thorough, professional, and provide actionable advice based on scientific knowledge.`;

    // Build conversation messages array
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: systemPrompt,
      },
    ];

    // Add conversation history
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach((msg: { sender: string; text: string }) => {
        messages.push({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        });
      });
    }

    // Add current user message
    messages.push({
      role: "user",
      content: message,
    });

    // Generate response with JSON mode
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const responseContent = completion.choices[0]?.message?.content || "";

    // Parse the JSON response to validate it
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(responseContent);
    } catch (parseError) {
      // If parsing fails, wrap the response in a JSON structure
      jsonResponse = {
        analysis: responseContent,
        diseaseName: "Unknown",
        confidence: "Low",
        symptoms: [],
        causes: [],
        treatment: [],
        prevention: [],
        severity: "Unknown",
        urgency: "Low",
        recommendations: "Please provide more details for accurate diagnosis.",
      };
    }

    return NextResponse.json({ 
      message: responseContent,
      jsonData: jsonResponse 
    });
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { 
        error: error.message || "Failed to get response from Plant Disease Expert. Please try again." 
      },
      { status: 500 }
    );
  }
}

