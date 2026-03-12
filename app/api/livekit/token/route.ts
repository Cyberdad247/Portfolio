import { NextResponse } from "next/server";
import { createReceptionistToken } from "@/lib/livekit/server";

export const runtime = "nodejs";

type LiveKitTokenRequest = {
	roomName?: string;
	identity?: string;
	name?: string;
	metadata?: Record<string, string>;
};

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as LiveKitTokenRequest;
		const roomName = body.roomName?.startsWith("receptionist-")
			? body.roomName
			: `receptionist-${crypto.randomUUID()}`;
		const identity = body.identity || `guest-${crypto.randomUUID()}`;
		const name = body.name || "Receptionist Guest";

		const token = await createReceptionistToken({
			roomName,
			identity,
			name,
			metadata: body.metadata,
		});

		return NextResponse.json(token);
	} catch (error) {
		return NextResponse.json(
			{
				error:
					error instanceof Error
						? error.message
						: "Unable to create LiveKit token",
			},
			{ status: 500 },
		);
	}
}
