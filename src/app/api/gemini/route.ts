// src/app/api/gemini/route.ts
import { NextResponse } from "next/server";
import { queryGemini } from "../../../utils/gemini"; // Correct path to gemini.ts

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Call the Gemini API using the function from gemini.ts
    const geminiResponse = await queryGemini(prompt);

    return NextResponse.json({ success: true, response: geminiResponse });
  } catch (error) {
    console.error("Error in Gemini API route:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch itinerary" },
      { status: 500 }
    );
  }
}