import { NextResponse } from "next/server";
import { createReceptionistToken } from "@/lib/livekit/server";

export const runtime = "nodejs";

type PersonaPlexRequest = {
	sessionId?: string;
	name?: string;
	metadata?: Record<string, string>;
};

const SESSION_ID_PATTERN = /^[a-zA-Z0-9_-]{1,128}$/;

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as PersonaPlexRequest;

		// Validate session ID
		const sessionId = body.sessionId;
		if (!sessionId) {
			return NextResponse.json(
				{ error: "sessionId is required" },
				{ status: 400 },
			);
		}

		if (!SESSION_ID_PATTERN.test(sessionId)) {
			return NextResponse.json(
				{
					error:
						"Invalid sessionId. Must be 1-128 characters, alphanumeric, hyphens, or underscores.",
				},
				{ status: 400 },
			);
		}

		const roomName = `tasha-${sessionId}`;
		const identity = `guest-${sessionId}`;
		const name = body.name || "PersonaPlex Guest";

		const tokenData = await createReceptionistToken({
			roomName,
			identity,
			name,
			metadata: {
				...body.metadata,
				personaplex: "true",
				sessionId,
			},
		});

		return NextResponse.json({
			token: tokenData.token,
			url: tokenData.url,
			roomName: tokenData.roomName,
			identity: tokenData.identity,
		});
	} catch (error) {
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Unable to create PersonaPlex token",
			},
			{ status: 500 },
		);
	}
}
