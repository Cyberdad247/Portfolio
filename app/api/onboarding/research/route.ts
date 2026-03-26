import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "edge";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
	const { url: supabaseUrl, anonKey } = getSupabaseEnv();
	const cookieStore = await cookies();

	const supabase = createServerClient(supabaseUrl, anonKey, {
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll() {},
		},
	});

	try {
		const { url } = await request.json();

		if (!url) {
			return NextResponse.json({ error: "URL is required" }, { status: 400 });
		}

		// 1. Log Initiation to UKG (L4 Semantic)
		await supabase.from("ukg_events").insert({
			type: "AUDIT",
			payload: { action: `Initiated Intelligence Scout for: ${url}` },
			agent_id: "A-01",
		});

		// 2. Perform Kinetic Research (Gemini 2.0 Flash Implementation)
		console.log(`[L3 NEURAL]: Researching ${url} with Gemini...`);
		
		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

		const prompt = `
      You are Merlin Ω, the Neural Kernel of the Invisioned Portfolio. 
      Analyze this URL: ${url}
      Your goal is to synthesize a high-fidelity marketing report for a potential client onboarding.
      
      Respond ONLY with a JSON object in the following format:
      {
        "company": "Company Name",
        "industry": "Specific Industry",
        "goals": "A one-sentence ambitious strategic goal (Growth OS focused)",
        "insights": ["Insight 1", "Insight 2", "Insight 3"]
      }
      
      Ensure insights are professional, cutting-edge (AI/Agentic focused), and specific to the implied business type from the URL.
    `;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();
		
		// Parse the JSON from the markdown-wrapped or raw string
		const cleanedText = text.replace(/```json|```/g, "").trim();
		const researchData = JSON.parse(cleanedText);

		// 3. Log Completion to UKG
		await supabase.from("ukg_events").insert({
			type: "STRATEGY",
			payload: { 
				action: `Intelligence Scout finalized Gemini synthesis for ${researchData.company.toUpperCase()}.`,
				insights: researchData.insights
			},
			agent_id: "A-02",
		});

		return NextResponse.json(researchData);
	} catch (error) {
		console.error("Intelligence Scout Failure (Gemini Pipeline):", error);
		return NextResponse.json({ error: "Research failed" }, { status: 500 });
	}
}
