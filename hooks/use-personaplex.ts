"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type PersonaPlexState = {
	/** Whether livekit-client is available and LiveKit URL is configured */
	isSupported: boolean;
	/** Whether currently connected to a LiveKit room */
	isConnected: boolean;
	/** Whether the local microphone is active */
	isListening: boolean;
	/** Whether remote AI audio is currently playing */
	isSpeaking: boolean;
	/** Current audio level (0-1) for waveform visualization */
	audioLevel: number;
	/** Current error message, if any */
	error: string | null;
	/** Interim transcript from speech recognition (empty for WebRTC mode) */
	interimTranscript: string;
	/** History of finalized transcripts (managed externally for WebRTC mode) */
	transcriptHistory: string[];
};

type PersonaPlexActions = {
	/** Connect to a PersonaPlex room */
	connect: (sessionId?: string) => Promise<void>;
	/** Disconnect from the current room */
	disconnect: () => Promise<void>;
	/** Start publishing microphone audio */
	startListening: () => void;
	/** Stop publishing microphone audio */
	stopListening: () => void;
	/** Clear transcript history */
	clearTranscriptHistory: () => void;
	/**
	 * Speak text (no-op in PersonaPlex mode — AI voice comes via WebRTC).
	 * Provided for interface compatibility with use-receptionist-voice.
	 */
	speak: (text: string) => void;
	/** Stop AI audio playback */
	stopSpeaking: () => void;
};

type UsePersonaPlexOptions = {
	enabled?: boolean;
	onFinalTranscript?: (transcript: string) => void;
	onBargeIn?: () => void;
};

type UsePersonaPlexReturn = PersonaPlexState &
	PersonaPlexActions & {
		/** Alias for isSupported — matches use-receptionist-voice interface */
		isSpeechRecognitionSupported: boolean;
		/** Always true when connected (AI voice comes via WebRTC) */
		isSpeechSynthesisSupported: boolean;
	};

type PersonaPlexClientModule = {
	PersonaPlexClient: new (options: {
		onRemoteAudioSubscribed?: () => void;
		onRemoteAudioUnsubscribed?: () => void;
		onAudioLevelChange?: (level: number) => void;
		onBargeIn?: () => void;
		onConnectionStateChange?: (connected: boolean) => void;
		onError?: (error: Error) => void;
		bargeInThreshold?: number;
	}) => {
		connect: (url: string, token: string) => Promise<void>;
		disconnect: () => Promise<void>;
		dispose: () => Promise<void>;
		startListening: () => Promise<void>;
		stopListening: () => Promise<void>;
		isConnected: boolean;
		isListening: boolean;
		isSpeaking: boolean;
		audioLevel: number;
	};
};

type PersonaPlexTokenResponse = {
	token: string;
	url: string;
	roomName: string;
	identity: string;
	error?: string;
};

export function usePersonaPlex({
	enabled = true,
	onFinalTranscript,
	onBargeIn,
}: UsePersonaPlexOptions = {}): UsePersonaPlexReturn {
	const clientRef = useRef<
		PersonaPlexClientModule["PersonaPlexClient"] extends new (
			...args: infer _A
		) => infer R
			? R
			: never
	>(null as never);
	const [isSupported, setIsSupported] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [isListening, setIsListening] = useState(false);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [audioLevel, setAudioLevel] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [transcriptHistory, setTranscriptHistory] = useState<string[]>([]);
	const mountedRef = useRef(true);

	// Store callbacks in refs to avoid re-creating the client on every render
	const onFinalTranscriptRef = useRef(onFinalTranscript);
	onFinalTranscriptRef.current = onFinalTranscript;
	const onBargeInRef = useRef(onBargeIn);
	onBargeInRef.current = onBargeIn;

	// Check support on mount
	useEffect(() => {
		if (!enabled) return;

		let cancelled = false;

		async function checkSupport() {
			try {
				// Check if LiveKit URL is configured by probing the env
				const hasLiveKitUrl = Boolean(process.env.NEXT_PUBLIC_LIVEKIT_URL);

				// Try to dynamically import livekit-client
				let clientAvailable = false;
				try {
					await import("livekit-client");
					clientAvailable = true;
				} catch {
					clientAvailable = false;
				}

				if (!cancelled) {
					setIsSupported(hasLiveKitUrl && clientAvailable);
				}
			} catch {
				if (!cancelled) {
					setIsSupported(false);
				}
			}
		}

		checkSupport();

		return () => {
			cancelled = true;
		};
	}, [enabled]);

	const connect = useCallback(async (sessionId?: string) => {
		setError(null);

		try {
			// Dynamically import the PersonaPlex client
			const { PersonaPlexClient } = (await import(
				"@/lib/livekit/personaplex"
			)) as unknown as PersonaPlexClientModule;

			const client = new PersonaPlexClient({
				onRemoteAudioSubscribed: () => {
					if (mountedRef.current) setIsSpeaking(true);
				},
				onRemoteAudioUnsubscribed: () => {
					if (mountedRef.current) setIsSpeaking(false);
				},
				onAudioLevelChange: (level: number) => {
					if (mountedRef.current) setAudioLevel(level);
				},
				onBargeIn: () => {
					onBargeInRef.current?.();
				},
				onConnectionStateChange: (connected: boolean) => {
					if (mountedRef.current) {
						setIsConnected(connected);
						if (!connected) {
							setIsListening(false);
							setIsSpeaking(false);
							setAudioLevel(0);
						}
					}
				},
				onError: (err: Error) => {
					if (mountedRef.current) setError(err.message);
				},
			});

			// Fetch token from the PersonaPlex endpoint
			const effectiveSessionId = sessionId || crypto.randomUUID();
			const response = await fetch("/api/livekit/personaplex", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ sessionId: effectiveSessionId }),
			});

			if (!response.ok) {
				throw new Error(
					`Failed to get PersonaPlex token: ${response.statusText}`,
				);
			}

			const data = (await response.json()) as PersonaPlexTokenResponse;
			if (data.error) {
				throw new Error(data.error);
			}

			await client.connect(data.url, data.token);
			clientRef.current = client;

			if (mountedRef.current) {
				setIsConnected(true);
			}
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed to connect to PersonaPlex";
			if (mountedRef.current) {
				setError(message);
				setIsConnected(false);
			}
		}
	}, []);

	const disconnect = useCallback(async () => {
		if (clientRef.current) {
			await clientRef.current.disconnect();
			clientRef.current = null as never;
		}
		if (mountedRef.current) {
			setIsConnected(false);
			setIsListening(false);
			setIsSpeaking(false);
			setAudioLevel(0);
		}
	}, []);

	const startListening = useCallback(() => {
		if (!clientRef.current) {
			setError("Not connected to PersonaPlex");
			return;
		}

		clientRef.current
			.startListening()
			.then(() => {
				if (mountedRef.current) setIsListening(true);
			})
			.catch((err: unknown) => {
				const message =
					err instanceof Error ? err.message : "Failed to start listening";
				if (mountedRef.current) setError(message);
			});
	}, []);

	const stopListening = useCallback(() => {
		if (!clientRef.current) return;

		clientRef.current
			.stopListening()
			.then(() => {
				if (mountedRef.current) setIsListening(false);
			})
			.catch((err: unknown) => {
				const message =
					err instanceof Error ? err.message : "Failed to stop listening";
				if (mountedRef.current) setError(message);
			});
	}, []);

	const clearTranscriptHistory = useCallback(() => {
		setTranscriptHistory([]);
	}, []);

	// No-op speak — in PersonaPlex mode, AI voice comes through the WebRTC audio track
	const speak = useCallback((_text: string) => {
		// Intentional no-op for interface compatibility
	}, []);

	const stopSpeaking = useCallback(() => {
		// In PersonaPlex mode, we can't directly stop the remote audio track,
		// but we can mute the audio element via the client
		setIsSpeaking(false);
	}, []);

	// Auto-cleanup on unmount
	useEffect(() => {
		mountedRef.current = true;

		return () => {
			mountedRef.current = false;
			if (clientRef.current) {
				clientRef.current.dispose().catch(() => {});
				clientRef.current = null as never;
			}
		};
	}, []);

	return {
		isSupported,
		isConnected,
		isListening,
		isSpeaking,
		audioLevel,
		error,
		interimTranscript: "",
		transcriptHistory,
		isSpeechRecognitionSupported: isSupported,
		isSpeechSynthesisSupported: isConnected,
		connect,
		disconnect,
		startListening,
		stopListening,
		clearTranscriptHistory,
		speak,
		stopSpeaking,
	};
}
