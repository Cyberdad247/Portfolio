"use client";

import { useEffect, useRef, useState } from "react";

type SpeechRecognitionAlternative = {
	transcript: string;
	confidence: number;
};

type SpeechRecognitionResult = {
	isFinal: boolean;
	length: number;
	[index: number]: SpeechRecognitionAlternative;
};

type SpeechRecognitionResultList = {
	length: number;
	[index: number]: SpeechRecognitionResult;
};

type SpeechRecognitionEvent = Event & {
	resultIndex: number;
	results: SpeechRecognitionResultList;
};

type SpeechRecognitionErrorEvent = Event & {
	error: string;
	message: string;
};

type SpeechRecognitionLike = EventTarget & {
	continuous: boolean;
	interimResults: boolean;
	lang: string;
	start: () => void;
	stop: () => void;
	abort: () => void;
	onstart: ((event: Event) => void) | null;
	onend: ((event: Event) => void) | null;
	onresult: ((event: SpeechRecognitionEvent) => void) | null;
	onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type UseReceptionistVoiceOptions = {
	enabled?: boolean;
	onFinalTranscript?: (transcript: string) => void;
};

export function useReceptionistVoice({
	enabled = true,
	onFinalTranscript,
}: UseReceptionistVoiceOptions) {
	const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
	const voicesLoadedRef = useRef(false);
	const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] =
		useState(false);
	const [isSpeechSynthesisSupported, setIsSpeechSynthesisSupported] =
		useState(false);
	const [isListening, setIsListening] = useState(false);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [interimTranscript, setInterimTranscript] = useState("");
	const [transcriptHistory, setTranscriptHistory] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (typeof window === "undefined" || !enabled) {
			return;
		}

		const browserWindow = window as Window & {
			SpeechRecognition?: SpeechRecognitionConstructor;
			webkitSpeechRecognition?: SpeechRecognitionConstructor;
		};
		const speechRecognition =
			browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;

		setIsSpeechRecognitionSupported(Boolean(speechRecognition));
		setIsSpeechSynthesisSupported(
			typeof window.speechSynthesis !== "undefined",
		);

		if (!speechRecognition) {
			return;
		}

		const recognition = new speechRecognition();
		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.lang = "en-US";

		recognition.onstart = () => {
			setError(null);
			setIsListening(true);
		};

		recognition.onend = () => {
			setIsListening(false);
			setInterimTranscript("");
		};

		recognition.onerror = (event) => {
			setIsListening(false);
			if (event.error !== "aborted") {
				setError(event.message || event.error || "Voice recognition failed.");
			}
		};

		recognition.onresult = (event) => {
			let interim = "";
			const finalParts: string[] = [];

			for (
				let index = event.resultIndex;
				index < event.results.length;
				index++
			) {
				const result = event.results[index];
				const text = result[0]?.transcript?.trim();
				if (!text) {
					continue;
				}

				if (result.isFinal) {
					finalParts.push(text);
				} else {
					interim += `${text} `;
				}
			}

			setInterimTranscript(interim.trim());

			if (finalParts.length > 0) {
				const finalTranscript = finalParts.join(" ").trim();
				setTranscriptHistory((previous) => [...previous, finalTranscript]);
				onFinalTranscript?.(finalTranscript);
			}
		};

		recognitionRef.current = recognition;

		return () => {
			recognition.abort();
			recognitionRef.current = null;
		};
	}, [enabled, onFinalTranscript]);

	useEffect(() => {
		if (typeof window === "undefined" || !enabled || voicesLoadedRef.current) {
			return;
		}

		if (window.speechSynthesis) {
			window.speechSynthesis.getVoices();
			voicesLoadedRef.current = true;
		}
	}, [enabled]);

	const startListening = () => {
		if (!recognitionRef.current) {
			setError("Speech recognition is not available in this browser.");
			return;
		}

		setError(null);
		recognitionRef.current.start();
	};

	const stopListening = () => {
		recognitionRef.current?.stop();
	};

	const clearTranscriptHistory = () => {
		setTranscriptHistory([]);
		setInterimTranscript("");
	};

	const speak = (text: string) => {
		if (typeof window === "undefined" || !window.speechSynthesis) {
			return;
		}

		window.speechSynthesis.cancel();

		const utterance = new SpeechSynthesisUtterance(text);
		const preferredVoice = window.speechSynthesis
			.getVoices()
			.find((voice) => /female|samantha|aria|zira|ava|jenny/i.test(voice.name));

		if (preferredVoice) {
			utterance.voice = preferredVoice;
		}

		utterance.rate = 1;
		utterance.pitch = 1.05;
		utterance.onstart = () => setIsSpeaking(true);
		utterance.onend = () => setIsSpeaking(false);
		utterance.onerror = () => setIsSpeaking(false);

		window.speechSynthesis.speak(utterance);
	};

	const stopSpeaking = () => {
		if (typeof window !== "undefined" && window.speechSynthesis) {
			window.speechSynthesis.cancel();
			setIsSpeaking(false);
		}
	};

	return {
		isSpeechRecognitionSupported,
		isSpeechSynthesisSupported,
		isListening,
		isSpeaking,
		interimTranscript,
		transcriptHistory,
		error,
		startListening,
		stopListening,
		clearTranscriptHistory,
		speak,
		stopSpeaking,
	};
}
