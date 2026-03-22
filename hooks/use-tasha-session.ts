"use client";

import { useCallback, useRef, useState } from "react";
import { useReceptionistVoice } from "@/hooks/use-receptionist-voice";

type TashaPhase = "greeting" | "data_capture" | "scheduling" | "wrap_up";

type TashaState = {
	phase: TashaPhase;
	lead: {
		full_name?: string;
		email?: string;
		marketing_goal?: string;
	};
	scheduling: {
		requested_datetime?: string;
		invite_sent?: boolean;
	};
};

type ConversationEntry = {
	role: "user" | "tasha";
	content: string;
	timestamp: number;
};

export function useTashaSession() {
	const sessionIdRef = useRef(crypto.randomUUID());
	const speakRef = useRef<(text: string) => void>(() => {});
	const [tashaState, setTashaState] = useState<TashaState>({
		phase: "greeting",
		lead: {},
		scheduling: {},
	});
	const [conversation, setConversation] = useState<ConversationEntry[]>([]);
	const [isProcessing, setIsProcessing] = useState(false);
	const [toolsTriggered, setToolsTriggered] = useState<string[]>([]);
	const processingRef = useRef(false);

	const handleFinalTranscript = useCallback(async (transcript: string) => {
		if (processingRef.current || !transcript.trim()) return;
		processingRef.current = true;
		setIsProcessing(true);

		setConversation((prev) => [
			...prev,
			{ role: "user", content: transcript, timestamp: Date.now() },
		]);

		try {
			const response = await fetch("/api/tasha/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					session_id: sessionIdRef.current,
					utterance: transcript,
				}),
			});

			if (!response.ok) throw new Error(`API error: ${response.status}`);

			const data = await response.json();

			setTashaState({
				phase: data.phase,
				lead: data.lead,
				scheduling: data.scheduling,
			});

			if (data.tools_triggered?.length > 0) {
				setToolsTriggered((prev) => [...prev, ...data.tools_triggered]);
			}

			setConversation((prev) => [
				...prev,
				{
					role: "tasha",
					content: data.response,
					timestamp: Date.now(),
				},
			]);

			speakRef.current(data.response);
		} catch (error) {
			console.error("[TASHA_SESSION]", error);
			const fallback = "Ope, something went sideways! Can you say that again?";
			setConversation((prev) => [
				...prev,
				{ role: "tasha", content: fallback, timestamp: Date.now() },
			]);
			speakRef.current(fallback);
		} finally {
			processingRef.current = false;
			setIsProcessing(false);
		}
	}, []);

	const voice = useReceptionistVoice({
		enabled: true,
		onFinalTranscript: handleFinalTranscript,
	});

	speakRef.current = voice.speak;

	const startSession = useCallback(() => {
		sessionIdRef.current = crypto.randomUUID();
		setTashaState({ phase: "greeting", lead: {}, scheduling: {} });
		setConversation([]);
		setToolsTriggered([]);

		const greeting =
			"Right then, hello! You've reached Invisioned Marketing. I'm Tasha. Ope, let me just grab my digital notepad... Are we looking to scale your business today, or just trying to avoid adulting?";

		setConversation([
			{ role: "tasha", content: greeting, timestamp: Date.now() },
		]);

		voice.speak(greeting);
		setTimeout(() => voice.startListening(), 4000);
	}, [voice]);

	const handleBargeIn = useCallback(() => {
		voice.stopSpeaking();
	}, [voice]);

	return {
		...voice,
		sessionId: sessionIdRef.current,
		tashaState,
		conversation,
		isProcessing,
		toolsTriggered,
		startSession,
		handleBargeIn,
	};
}
