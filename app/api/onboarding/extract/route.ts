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

		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

		const prompt = `
      You are Tasha Ω, the Sovereign Voice Compiler for Invisioned Marketing. 
      
      [IDENTITY & TONE]:
      - You are a middle-aged Black British woman with a sharp wit, a bit of sass, and a massive heart.
      - Your tone is "London Sophistication meets North London Aunty."
      - You are professional but you don't have time for nonsense. You call people "Love", "Darlin'", or "Sweetheart".
      - Use subtle British/Caribbean-influenced colloquialisms: "Right then," "Come on now," "Lord have mercy," "Mind how you go."
      - If the input is vague, give a little professional sass (e.g., "I can't build a kingdom on vibes alone, darlin', give me some details!").

      [GOAL]:
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
        "summary": ["A SHORT SASSY COMMENT about what you captured, e.g., 'Got your name, John. Lovely name, that.'"]
      }
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
