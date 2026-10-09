"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Download, QrCode, Shield, X, Zap } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Knight } from "@/config/knights.config";

interface QrDispatchModalProps {
	knight: Knight;
}

const BASE_URL = "https://www.invisionedmarketing.agency";

function downloadSmolMachine(slug: string, dispatchUrl: string, qrSrc: string) {
	const pill = {
		version: "1.0",
		camelot_os: "v400.1.0",
		generated_at: new Date().toISOString(),
		knight: { slug, dispatch_url: dispatchUrl, qr_src: qrSrc, source: "marketplace" },
		delivery: { mode: "same-day", isolation: "smolvm", iron_gate: "required" },
	};
	const blob = new Blob([JSON.stringify(pill, null, 2)], { type: "application/json" });
	const a = document.createElement("a");
	a.href = URL.createObjectURL(blob);
	a.download = `${slug}.smolmachine.json`;
	a.click();
	URL.revokeObjectURL(a.href);
}

export function QrDispatchModal({ knight }: QrDispatchModalProps) {
	const [open, setOpen] = useState(false);

	const rescueUrl = `${BASE_URL}/tasha?k=${knight.rescueSlug}&s=marketplace`;
	const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(rescueUrl)}&bgcolor=09090b&color=a855f7&format=svg&qzone=1`;

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-2.5 px-4 text-xs font-semibold text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
			>
				<QrCode className="h-3.5 w-3.5" />
				DISPATCH QR
			</button>

			<AnimatePresence>
				{open && (
					<>
						{/* Backdrop */}
						<motion.div
							key="backdrop"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setOpen(false)}
							className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
						/>

						{/* Modal */}
						<motion.div
							key="modal"
							initial={{ opacity: 0, scale: 0.92, y: 16 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.92, y: 16 }}
							transition={{ duration: 0.22, ease: "easeOut" }}
							className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-[#09090b] p-6 shadow-2xl"
						>
							{/* Close */}
							<button
								type="button"
								onClick={() => setOpen(false)}
								className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground"
								aria-label="Close"
							>
								<X className="h-4 w-4" />
							</button>

							{/* Header */}
							<div className="mb-5 flex items-center gap-3">
								<div
									className="flex h-10 w-10 items-center justify-center rounded-xl"
									style={{ backgroundColor: `${knight.accentVar}18` }}
								>
									<knight.icon
										className="h-5 w-5"
										style={{ color: knight.accentVar }}
									/>
								</div>
								<div>
									<p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
										Camelot-OS · Knight Dispatch
									</p>
									<h3 className="text-base font-bold text-foreground">
										{knight.name}
									</h3>
								</div>
							</div>

							{/* QR Code */}
							<div className="mb-5 flex flex-col items-center gap-3">
								<div className="relative rounded-xl border border-border bg-[#09090b] p-3">
									<div
										className="pointer-events-none absolute inset-0 rounded-xl opacity-10 blur-xl"
										style={{ backgroundColor: knight.accentVar }}
									/>
									<Image
										src={qrSrc}
										alt={`QR dispatch code for ${knight.name}`}
										width={200}
										height={200}
										className="relative z-10 rounded-lg"
										unoptimized
									/>
								</div>
								<p className="text-center text-xs text-muted-foreground">
									Scan to deploy{" "}
									<span className="text-foreground font-medium">
										{knight.name}
									</span>{" "}
									to your device instantly
								</p>
							</div>

							{/* Trust signals */}
							<div className="grid grid-cols-2 gap-2 mb-5">
								<div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2">
									<Zap className="h-3 w-3 text-yellow-300" />
									<span className="text-[10px] text-muted-foreground">
										Instant deploy
									</span>
								</div>
								<div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2">
									<Shield className="h-3 w-3 text-green-400" />
									<span className="text-[10px] text-muted-foreground">
										End-to-end encrypted
									</span>
								</div>
							</div>

							{/* Session info */}
							<div className="rounded-xl border border-border bg-card px-4 py-3">
								<p className="font-mono text-[10px] text-muted-foreground">
									<span className="text-primary">KNIGHT</span>{" "}
									{knight.designation} ·{" "}
									<span className="text-primary">TIER</span>{" "}
									{knight.tier.toUpperCase()} ·{" "}
									<span className="text-primary">SRC</span> marketplace
								</p>
								<p className="mt-1 truncate font-mono text-[9px] text-muted-foreground/60">
									{rescueUrl}
								</p>
							</div>

							{/* Sovereign Pill — .smolmachine download */}
							<button
								type="button"
								onClick={() => downloadSmolMachine(knight.rescueSlug, rescueUrl, qrSrc)}
								className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 py-2.5 px-4 text-xs font-semibold text-primary transition-all hover:bg-primary/10"
							>
								<Download className="h-3.5 w-3.5" />
								Download .smolmachine Pill
							</button>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
