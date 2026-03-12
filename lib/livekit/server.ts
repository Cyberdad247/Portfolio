import { AccessToken } from "livekit-server-sdk";

function requireEnv(
	name: "LIVEKIT_API_KEY" | "LIVEKIT_API_SECRET" | "LIVEKIT_URL",
) {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required LiveKit environment variable: ${name}`);
	}
	return value;
}

export function getLiveKitConfig() {
	return {
		apiKey: requireEnv("LIVEKIT_API_KEY"),
		apiSecret: requireEnv("LIVEKIT_API_SECRET"),
		url: requireEnv("LIVEKIT_URL"),
	};
}

export async function createReceptionistToken({
	roomName,
	identity,
	name,
	metadata,
}: {
	roomName: string;
	identity: string;
	name: string;
	metadata?: Record<string, string>;
}) {
	const { apiKey, apiSecret, url } = getLiveKitConfig();

	const token = new AccessToken(apiKey, apiSecret, {
		identity,
		name,
		ttl: "1h",
		metadata: metadata ? JSON.stringify(metadata) : undefined,
	});

	token.addGrant({
		roomJoin: true,
		room: roomName,
		canPublish: true,
		canSubscribe: true,
		canPublishData: true,
	});

	return {
		token: await token.toJwt(),
		url,
		roomName,
		identity,
	};
}
