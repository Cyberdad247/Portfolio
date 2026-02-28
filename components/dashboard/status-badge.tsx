import type { JSX } from "react";

export type StatusType = "active" | "processing" | "idle";

const colorMap = {
	active: {
		bg: "bg-purple-500/20",
		text: "text-purple-400",
		dot: "bg-purple-500",
	},
	processing: {
		bg: "bg-yellow-500/20",
		text: "text-yellow-400",
		dot: "bg-yellow-500",
	},
	idle: {
		bg: "bg-zinc-500/20",
		text: "text-zinc-400",
		dot: "bg-zinc-500",
	},
};

export function StatusBadge({ status }: { status: StatusType }): JSX.Element {
	const theme = colorMap[status];
	return (
		<div
			className={`flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium ${theme.bg} ${theme.text}`}
		>
			<span className="relative flex h-2 w-2">
				{status !== "idle" && (
					<span
						className={`absolute inline-flex h-full w-full animate-ping rounded-full ${theme.dot} opacity-75`}
					/>
				)}
				<span
					className={`relative inline-flex h-2 w-2 rounded-full ${theme.dot}`}
				/>
			</span>
			<span className="uppercase">{status}</span>
		</div>
	);
}
