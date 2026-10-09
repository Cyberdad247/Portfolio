"use client";

import { motion } from "framer-motion";
import { Beaker, Brain, Sparkles, Wand2, Zap } from "lucide-react";
import { useState } from "react";

const knightTypes = [
	{ id: "lpo", name: "Sir Growth (LPO)", role: "Conversion Optimization", icon: Zap },
	{ id: "apis", name: "Lady Apis", role: "Market Research & Foraging", icon: Beaker },
	{ id: "syntax", name: "Sir Syntax", role: "Logic & Code Integrity", icon: Brain },
	{ id: "muse", name: "Lady Muse", role: "UI/UX Design", icon: Sparkles },
];

export default function GestationChamber() {
	const [selectedKnight, setSelectedKnight] = useState<string | null>(null);
	const [isGestating, setIsGestating] = useState(false);
	const [progress, setProgress] = useState(0);

	const handleGestate = () => {
		if (!selectedKnight) return;
		setIsGestating(true);
		setProgress(0);
		const interval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					clearInterval(interval);
					return 100;
				}
				return prev + 5;
			});
		}, 100);
	};

	return (
		<div className="flex flex-col gap-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="flex items-center gap-3 text-3xl font-bold text-white">
						<Wand2 className="h-8 w-8 text-yellow-500" />
						Gestation Chamber
					</h2>
					<p className="text-zinc-400">Initialize a client-specific Knight for your marketing fleet.</p>
				</div>
				<div className="rounded-full bg-zinc-900 px-4 py-1 font-mono text-xs uppercase tracking-widest text-zinc-500 border border-zinc-800">
					Status: Ready for Injection
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				{knightTypes.map((knight) => (
					<button
						key={knight.id}
						onClick={() => setSelectedKnight(knight.id)}
						className={`group relative flex items-center gap-4 rounded-2xl border p-6 text-left transition-all ${
							selectedKnight === knight.id
								? "border-yellow-500 bg-yellow-500/10"
								: "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900"
						}`}
					>
						<div className={`rounded-xl p-3 ${selectedKnight === knight.id ? "bg-yellow-500 text-black" : "bg-zinc-800 text-zinc-400 group-hover:text-white"}`}>
							<knight.icon className="h-6 w-6" />
						</div>
						<div>
							<div className={`font-bold ${selectedKnight === knight.id ? "text-white" : "text-zinc-300"}`}>{knight.name}</div>
							<div className="text-xs text-zinc-500">{knight.role}</div>
						</div>
						{selectedKnight === knight.id && (
							<motion.div layoutId="active" className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
						)}
					</button>
				))}
			</div>

			{selectedKnight && (
				<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<span className="font-mono text-xs uppercase text-zinc-500">Neural Sync Progress</span>
						<span className="font-mono text-xs text-yellow-500">{progress}%</span>
					</div>
					<div className="h-2 w-full overflow-hidden rounded-full bg-zinc-900 border border-zinc-800">
						<motion.div
							className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400"
							initial={{ width: 0 }}
							animate={{ width: `${progress}%` }}
						/>
					</div>

					{!isGestating ? (
						<button
							onClick={handleGestate}
							className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl bg-yellow-500 py-4 text-lg font-bold text-black transition-all hover:bg-yellow-400 active:scale-95"
						>
							<Zap className="h-5 w-5 fill-current" />
							INITIATE GESTATION
						</button>
					) : (
						<div className="mt-4 flex flex-col items-center gap-4 text-center">
							<div className="flex items-center gap-3">
								<div className="h-2 w-2 animate-ping rounded-full bg-yellow-500" />
								<p className="font-mono text-sm text-yellow-500">FORGING SYMBOLIC LATTICE...</p>
							</div>
							{progress === 100 && (
								<motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
									<p className="text-green-500 font-bold">Knight successfully gestated and ready for deployment.</p>
									<button className="mt-4 text-sm text-zinc-400 hover:text-white underline">View Knight Persona Dossier</button>
								</motion.div>
							)}
						</div>
					)}
				</motion.div>
			)}
		</div>
	);
}
