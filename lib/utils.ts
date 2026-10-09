import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * SOVEREIGN NEURALISM DESIGN TOKENS
 * These tokens govern the v700 visual identity.
 */
export const tokens = {
	colors: {
		obsidian: "#09090B",
		void: "#000000",
		lattice: "#27272A",
		chrome: "#FAFAFA",
		primary: "#A855F7", // Amethyst Neural Glow
		secondary: "#FDE047", // Solar Intelligence
		accent: "#22C55E", // Kinetic Success
	},
	glass: {
		base: "bg-white/5 backdrop-blur-md border border-white/10",
		hover: "hover:bg-white/10 hover:border-white/20 transition-all duration-300",
		premium: "bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl border border-white/20 shadow-2xl",
	},
	animation: {
		spring: {
			type: "spring" as const,
			stiffness: 100,
			damping: 20,
		},
		stagger: (delay = 0.1) => ({
			visible: {
				transition: {
					staggerChildren: delay,
				},
			},
		}),
	},
};
