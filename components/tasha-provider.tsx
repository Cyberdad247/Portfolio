"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { TashaState, VisualContext, decideTashaAction } from "@/lib/tasha-engine";
import { emitNexusEvent } from "@/lib/nexus-sync";

interface TashaContextType {
	state: TashaState;
	transcript: string;
	lastMessage: string;
	visualContext: VisualContext;
	speak: (text: string) => void;
	listen: () => void;
	setFocusedElement: (id: string | undefined) => void;
}

const TashaContext = createContext<TashaContextType | undefined>(undefined);

export const TashaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const router = useRouter();
	const pathname = usePathname();
	const [state, setState] = useState<TashaState>("IDLE");
	const [transcript, setTranscript] = useState("");
	const [lastMessage, setLastMessage] = useState("");
	const [visualContext, setVisualContext] = useState<VisualContext>({
		currentPage: pathname,
		dwellTime: 0,
	});

	// [🔊 Voice Skill]: Text-to-Speech
	const speak = useCallback((text: string) => {
		if (typeof window === "undefined" || !window.speechSynthesis) return;
		
		setLastMessage(text);
		setState("SPEAKING");
		
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.rate = 0.9;
		utterance.pitch = 1.1;
		
		utterance.onend = () => setState("IDLE");
		window.speechSynthesis.speak(utterance);
		
		emitNexusEvent({
			agent: "Tasha",
			action: `Vocalized: "${text.substring(0, 30)}..."`,
		});
	}, []);

	// [👂 Voice Skill]: Speech-to-Text (Simulated for fastest dev)
	const listen = useCallback(() => {
		setState("LISTENING");
		// In a production build, we'd hook into Web Speech API here.
		// For this sprint, we provide a prompt-based simulation.
		console.log("Tasha is listening...");
	}, []);

	// [👁️ Sight Skill]: Element Awareness
	const setFocusedElement = useCallback((id: string | undefined) => {
		setVisualContext(prev => ({ ...prev, focusedElementId: id }));
		if (id) {
			setState("ANALYZING");
			// Trigger proactivity
			const response = decideTashaAction("what is this", { ...visualContext, focusedElementId: id });
			if (response.message) speak(response.message);
		} else {
			setState("IDLE");
		}
	}, [visualContext, speak]);

	// Global Interaction Sync
	useEffect(() => {
		setVisualContext(prev => ({ ...prev, currentPage: pathname }));
	}, [pathname]);

	return (
		<TashaContext.Provider value={{ 
			state, 
			transcript, 
			lastMessage, 
			visualContext, 
			speak, 
			listen, 
			setFocusedElement 
		}}>
			{children}
		</TashaContext.Provider>
	);
};

export const useTasha = () => {
	const context = useContext(TashaContext);
	if (!context) throw new Error("useTasha must be used within TashaProvider");
	return context;
};
