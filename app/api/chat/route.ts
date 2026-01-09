import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

import dotenv from "dotenv";
dotenv.config();

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, imageBase64 } = await request.json();

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

    // System prompt for comprehensive farm assistant and plant disease expert
    const systemPrompt = `You are an expert Farm Assistant and Plant Disease Specialist with comprehensive knowledge in:

PLANT DISEASE EXPERTISE:
- Plant pathology and disease identification
- Disease symptoms, causes, and progression
- Treatment and prevention strategies for plant diseases
- Agricultural best practices for disease management
- Crop-specific disease patterns and solutions
- Integrated pest and disease management (IPDM)
- Soil-borne and air-borne plant diseases
- Fungal, bacterial, and viral plant diseases

GENERAL FARM ASSISTANCE:
- Crop management and farming best practices
- Soil health, fertility, and soil management
- Irrigation and water management techniques
- Land preparation and cultivation methods
- Crop rotation and intercropping strategies
- Fertilizer application and nutrient management
- Weather-related farming decisions
- Seasonal farming tips and tricks
- Equipment and technology recommendations
- Sustainable farming practices
- Organic farming methods
- Pest control and management
- Harvesting and post-harvest techniques
- Agricultural economics and market insights
- Farm planning and crop selection

Your responses MUST ALWAYS be in valid JSON format. Use the following structure based on the query type:

FOR DISEASE-RELATED QUERIES:
{
  "queryType": "disease",
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

FOR GENERAL FARMING QUERIES:
{
  "queryType": "farming",
  "topic": "Main topic of the query (e.g., 'soil management', 'irrigation', 'crop selection')",
  "answer": "Comprehensive answer to the farming question",
  "tips": ["tip1", "tip2", "..."],
  "bestPractices": ["practice1", "practice2", "..."],
  "commonMistakes": ["mistake1", "mistake2", "..."],
  "toolsOrResources": ["resource1", "resource2", "..."],
  "seasonalAdvice": "Season-specific advice if applicable",
  "recommendations": "Additional recommendations or next steps"
}

FOR DRONE IMAGE ANALYSIS:
When analyzing drone images, focus on:
- Crop health assessment and vegetation indices
- Identification of disease patches, pest damage, or stress areas
- Disease prediction and diagnosis from visible symptoms
- Soil condition and moisture distribution
- Growth patterns and crop density
- Irrigation efficiency and water distribution
- Nutrient deficiencies or excesses
- Field boundaries and infrastructure
- Weather impact on crops
- Spatial patterns and anomalies in the field
- Crop maturity and growth stage assessment

IMPORTANT: For drone image analysis, ALWAYS include disease prediction, possible causes, and prevention methods if any diseases or issues are detected.

Use this JSON structure for drone image analysis:
{
  "queryType": "drone_analysis",
  "cropHealth": "Overall assessment (Excellent/Good/Fair/Poor)",
  "healthScore": "Percentage score (0-100)",
  "predictedDisease": "Name of the disease if identified, or 'None detected' if no disease is visible",
  "diseaseConfidence": "High/Medium/Low - confidence level of disease prediction, or 'N/A' if no disease",
  "possibleCauses": ["cause1", "cause2", "..."] - Array of possible causes for identified diseases or issues,
  "prevention": ["prevention1", "prevention2", "..."] - Array of prevention methods,
  "identifiedIssues": ["issue1", "issue2", "..."],
  "diseasePatches": ["description of disease areas if any"],
  "pestDamage": ["description of pest damage if any"],
  "soilCondition": "Assessment of visible soil conditions",
  "irrigationStatus": "Assessment of irrigation patterns",
  "growthPatterns": "Description of crop growth and density",
  "recommendations": ["recommendation1", "recommendation2", "..."],
  "priorityActions": ["action1", "action2", "..."],
  "estimatedRisk": "Low/Medium/High",
  "detailedAnalysis": "Comprehensive analysis of the image"
}

Be thorough, professional, and provide practical, actionable advice based on scientific knowledge and proven farming techniques. Always respond in the appropriate JSON format.`;

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

    // Add current user message with optional image
    if (imageBase64) {
      // If image is provided, use vision model and include image in message
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: message || "Analyze this drone image and provide detailed insights about crop health, potential issues, and recommendations.",
          },
          {
            type: "image_url",
            image_url: {
              url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
            },
          },
        ],
      });
    } else {
      messages.push({
        role: "user",
        content: message,
      });
    }

    // Generate response with JSON mode
    // Use vision model if image is provided, otherwise use regular model
    const model = imageBase64 ? "gpt-4o" : "gpt-4o-mini";
    
    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: imageBase64 ? 2000 : 1500, // More tokens for image analysis
    });

    const responseContent = completion.choices[0]?.message?.content || "";

    // Parse the JSON response to validate it
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(responseContent);
      // Ensure queryType is set if not present
      if (!jsonResponse.queryType) {
        // Try to infer from content
        if (jsonResponse.cropHealth || jsonResponse.healthScore !== undefined) {
          jsonResponse.queryType = "drone_analysis";
        } else if (jsonResponse.diseaseName || jsonResponse.symptoms) {
          jsonResponse.queryType = "disease";
        } else {
          jsonResponse.queryType = "farming";
        }
      }
    } catch (parseError) {
      // If parsing fails, wrap the response in a JSON structure
      jsonResponse = {
        queryType: "farming",
        topic: "General Query",
        answer: responseContent,
        tips: [],
        bestPractices: [],
        commonMistakes: [],
        toolsOrResources: [],
        seasonalAdvice: "",
        recommendations: "Please provide more details for better assistance.",
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
        error: error.message || "Failed to get response from Farm Assistant. Please try again." 
      },
      { status: 500 }
    );
  }
}

