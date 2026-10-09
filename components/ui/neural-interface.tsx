"use client";

import { motion } from "framer-motion";
import { cn, tokens } from "@/lib/utils";

interface NeuralCardProps {
	children: React.ReactNode;
	className?: string;
	variant?: "base" | "premium";
	glowColor?: string;
}

export function NeuralCard({ 
	children, 
	className, 
	variant = "base",
	glowColor = tokens.colors.primary 
}: NeuralCardProps) {
	return (
		<motion.div
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-50px" }}
			variants={{
				hidden: { opacity: 0, y: 20 },
				visible: { 
					opacity: 1, 
					y: 0, 
					transition: tokens.animation.spring 
				}
			}}
			className={cn(
				"relative group overflow-hidden rounded-3xl",
				variant === "base" ? tokens.glass.base : tokens.glass.premium,
				className
			)}
		>
			{/* NEURAL GLOW EFFECT */}
			<div 
				className="absolute -inset-24 z-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none blur-[60px]"
				style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }}
			/>
			
			{/* CONTENT LAYER */}
			<div className="relative z-10">
				{children}
			</div>

			{/* LATTICE LINE BORDER */}
			<div className="absolute inset-0 border border-white/5 group-hover:border-white/10 transition-colors pointer-events-none" />
		</motion.div>
	);
}

export function AmbientGlow() {
	return (
		<div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-black">
			<div className="absolute -top-[20%] -left-[10%] h-[60vw] w-[60vw] rounded-full bg-purple-900/10 blur-[120px] animate-pulse" />
			<div className="absolute -bottom-[20%] -right-[10%] h-[50vw] w-[50vw] rounded-full bg-yellow-900/5 blur-[100px]" />
		</div>
	);
}
