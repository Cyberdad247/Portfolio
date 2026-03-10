import type { JSX } from "react";
import { cn } from "@/lib/utils";

interface AmbientGlowProps {
	color?: string;
	position?:
		| "top-left"
		| "top-right"
		| "bottom-left"
		| "bottom-right"
		| "center";
	className?: string;
}

export function AmbientGlow({
	color = "bg-primary",
	position = "top-left",
	className,
}: AmbientGlowProps): JSX.Element {
	const positionClasses = {
		"top-left": "left-[-10%] top-[-10%]",
		"top-right": "right-[-10%] top-[-10%]",
		"bottom-left": "left-[-10%] bottom-[-10%]",
		"bottom-right": "right-[-10%] bottom-[-10%]",
		center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
	};

	return (
		<div
			className={cn(
				"pointer-events-none absolute z-0 h-[50vw] w-[50vw] rounded-full blur-[150px] opacity-20",
				color,
				positionClasses[position],
				className,
			)}
		/>
	);
}
