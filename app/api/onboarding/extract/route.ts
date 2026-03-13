import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "edge";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
	try {
		const { transcript, currentPhase, currentData } = await request.json();

		if (!transcript) {
			return NextResponse.json({ updates: {}, summary: [] });
		}

		const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

		const prompt = `
      You are Anya Ω, the Sovereign Compiler. 
      Analyze the following transcript from an onboarding session.
      
      Current Phase: ${currentPhase}
      Current Data: ${JSON.stringify(currentData)}
      Transcript: "${transcript}"
      
      Your goal is to extract structured onboarding information. 
      Only update fields that are clearly mentioned. Do not overwrite existing data unless explicitly corrected.
      
      Respond ONLY with a JSON object in this format:
      {
        "updates": {
          "name": "string",
          "email": "string",
          "phone": "string",
          "website": "string",
          "company": "string",
          "industry": "string",
          "goals": "string",
          "targetAudience": "string",
          "currentChallenges": "string",
          "budgetRange": "string",
          "preferredChannels": "string",
          "timeline": "string"
        },
        "summary": ["string describing each major update, e.g., 'name: John'"]
      }
      
      For Phase 1: Focus on personal/company identity.
      For Phase 2: Focus on goals, audience, challenges, budget, and channels.
      For Phase 3: Focus on timeline and additional notes.
    `;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();
		
		const cleanedText = text.replace(/```json|```/g, "").trim();
		const extraction = JSON.parse(cleanedText);

		return NextResponse.json(extraction);
	} catch (error) {
		console.error("Voice Extraction Failure (Gemini 2.0):", error);
		return NextResponse.json({ updates: {}, summary: ["System error in AI extraction"] }, { status: 500 });
	}
}
