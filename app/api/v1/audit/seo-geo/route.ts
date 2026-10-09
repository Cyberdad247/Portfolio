import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const RATE_HEADERS = {
	"X-RateLimit-Limit": "10",
	"X-RateLimit-Window": "60s",
	"Cache-Control": "no-store",
};


export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => ({}));
	const { target_url, deep_scan = false, _debug } = body as {
		target_url?: string;
		deep_scan?: boolean;
		_debug?: boolean;
	};

	if (_debug) {
		const k = process.env.GEMINI_API_KEY ?? "";
		return NextResponse.json({ key_len: k.length, key_prefix: k.slice(0, 8), key_suffix: k.slice(-4) }, { headers: RATE_HEADERS });
	}

	if (!target_url) {
		return NextResponse.json(
			{ error: "target_url required" },
			{ status: 400, headers: RATE_HEADERS },
		);
	}

	try {
		const model = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "").getGenerativeModel({ model: "gemini-2.5-flash" });

		const prompt = `You are Lady Apis, the Intelligence Scout of Invisioned Marketing's Agentic OS.
Analyze this URL for SEO and Generative Engine Optimization (GEO) signals: ${target_url}
${deep_scan ? "Perform a deep scan including competitive positioning and AI citation probability." : "Perform a standard scan."}

Respond ONLY with a valid JSON object — no markdown, no explanation:
{
  "seo_score": <integer 0-100>,
  "geo_score": <integer 0-100>,
  "citation_probability": <integer 0-100>,
  "top_gaps": ["gap 1", "gap 2", "gap 3"],
  "quick_wins": ["win 1", "win 2"],
  "ai_visibility": "<low|medium|high>",
  "brand_sentiment": "<negative|neutral|positive>",
  "summary": "<one sentence strategic insight>"
}`;

		const result = await model.generateContent(prompt);
		const text = result.response.text().replace(/```json|```/g, "").trim();
		const audit = JSON.parse(text);

		return NextResponse.json(
			{
				status: "complete",
				target: target_url,
				engine: "Lady Apis // Gemini 2.5 Flash",
				deep_scan,
				...audit,
			},
			{ headers: RATE_HEADERS },
		);
	} catch (err) {
		const msg = err instanceof Error ? err.message : "Unknown error";
		return NextResponse.json(
			{ error: "Audit pipeline failure", detail: msg },
			{ status: 500, headers: RATE_HEADERS },
		);
	}
}
