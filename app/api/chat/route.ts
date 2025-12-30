import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    // Get API key from environment variable
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured. Please set GEMINI_API_KEY in your environment variables." },
        { status: 500 }
      );
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Build conversation context
    const systemPrompt = `You are a helpful Farm Assistant AI. You help farmers with:
- Crop management and farming best practices
- Soil health and fertility advice
- Irrigation and water management
- Pest and disease identification
- Weather-related farming decisions
- Equipment and technology recommendations
- General agricultural knowledge

Be friendly, professional, and provide practical, actionable advice. Keep responses concise but informative.`;

    // Build the conversation history
    let conversationText = systemPrompt + "\n\n";
    
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach((msg: { sender: string; text: string }) => {
        if (msg.sender === "user") {
          conversationText += `User: ${msg.text}\n`;
        } else {
          conversationText += `Assistant: ${msg.text}\n`;
        }
      });
    }
    
    conversationText += `User: ${message}\nAssistant:`;

    // Generate response
    const result = await model.generateContent(conversationText);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ message: text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { 
        error: error.message || "Failed to get response from Farm Assistant. Please try again." 
      },
      { status: 500 }
    );
  }
}

