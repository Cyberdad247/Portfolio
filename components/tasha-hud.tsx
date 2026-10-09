"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mic, Eye, Loader2, Volume2 } from "lucide-react";
import { useTasha } from "./tasha-provider";
import { type JSX } from "react";

export function TashaHUD(): JSX.Element {
	const { state, lastMessage, listen } = useTasha();

	const stateColors = {
		IDLE: "from-zinc-500 to-zinc-800",
		LISTENING: "from-rose-500 to-rose-700",
		PROCESSING: "from-violet-500 to-indigo-600",
		SPEAKING: "from-emerald-400 to-teal-600",
		ANALYZING: "from-amber-400 to-orange-600",
	};

	const stateIcons = {
		IDLE: <Eye className="w-5 h-5" />,
		LISTENING: <Mic className="w-5 h-5 animate-pulse" />,
		PROCESSING: <Loader2 className="w-5 h-5 animate-spin" />,
		SPEAKING: <Volume2 className="w-5 h-5" />,
		ANALYZING: <Eye className="w-5 h-5 animate-bounce" />,
	};

	return (
		<div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
			<AnimatePresence>
				{state === "SPEAKING" && lastMessage && (
					<motion.div
						initial={{ opacity: 0, y: 20, scale: 0.9 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						className="max-w-xs bg-card/80 backdrop-blur-xl border border-border p-4 rounded-2xl shadow-2xl text-sm leading-relaxed"
					>
						<span className="text-primary font-mono font-bold block mb-1">TASHA //</span>
						{lastMessage}
					</motion.div>
				)}
			</AnimatePresence>

			<motion.button
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				onClick={listen}
				className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${stateColors[state]} flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/20 group`}
			>
				{/* Ambient Ring */}
				<div className={`absolute inset-0 rounded-full border-2 border-white/10 ${state !== "IDLE" ? "animate-ping opacity-20" : ""}`} />
				
				<div className="relative z-10 text-white">
					{stateIcons[state]}
				</div>

				{/* Interaction Tooltip */}
				<div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/50 backdrop-blur-md text-[10px] uppercase tracking-tighter px-3 py-1 rounded-full border border-white/10 pointer-events-none">
					{state === "IDLE" ? "Click to Initiate Link" : state}
				</div>
			</motion.button>
		</div>
	);
}
