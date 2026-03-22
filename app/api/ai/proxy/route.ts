// app/api/ai/proxy/route.ts
import { NextResponse } from "next/server";

const PROXY_BASE = process.env.CLI_PROXY_URL || "http://localhost:8080/v1";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { stream = false, ...rest } = body;

		const proxyResponse = await fetch(`${PROXY_BASE}/chat/completions`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ stream, ...rest }),
		});

		if (!proxyResponse.ok) {
			const errorText = await proxyResponse.text();
			console.error(
				"[CLIProxyAPI] Upstream error:",
				proxyResponse.status,
				errorText,
			);
			return NextResponse.json(
				{ error: "CLIProxyAPI upstream error", detail: errorText },
				{ status: proxyResponse.status },
			);
		}

		if (stream && proxyResponse.body) {
			return new Response(proxyResponse.body, {
				headers: {
					"Content-Type": "text/event-stream",
					"Cache-Control": "no-cache",
					Connection: "keep-alive",
				},
			});
		}

		const data = await proxyResponse.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("[CLIProxyAPI] Connection failed:", error);
		return NextResponse.json(
			{
				error:
					"CLIProxyAPI is unreachable. Ensure it is running on localhost:8080.",
			},
			{ status: 502 },
		);
	}
}
