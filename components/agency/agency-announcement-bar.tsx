"use client";

import { motion } from "framer-motion";
import { ArrowRight, Phone, Sparkles, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { defaultAgencyConfig } from "@/config/agency-storefront.config";

interface AnnouncementBarProps {
	config?: typeof defaultAgencyConfig.announcement;
}

export default function AgencyAnnouncementBar({ config }: AnnouncementBarProps) {
	const [visible, setVisible] = useState(true);
	const barConfig = config || defaultAgencyConfig.announcement;

	if (!visible || !barConfig.enabled) return null;

	return (
		<motion.aside
			aria-label="Agency Announcement"
			initial={{ height: 0, opacity: 0 }}
			animate={{ height: "auto", opacity: 1 }}
			exit={{ height: 0, opacity: 0 }}
			className="relative z-50 w-full overflow-hidden border-b border-[#c9a23f]/30 bg-linear-to-r from-[#090712] via-[#1a0e2e] to-[#090712] text-xs text-white"
		>
			<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
				{/* Center Content */}
				<div className="flex flex-1 items-center justify-center gap-2.5 text-center">
					<span className="inline-flex items-center gap-1 rounded-full border border-[#c9a23f]/40 bg-[#c9a23f]/15 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-[#c9a23f]">
						<Sparkles className="h-2.5 w-2.5" />
						{barConfig.badge}
					</span>
					<span className="text-[11px] font-medium tracking-tight text-slate-200 sm:text-xs">
						{barConfig.text}
					</span>
					{barConfig.linkText && barConfig.linkUrl && (
						<Link
							href={barConfig.linkUrl}
							className="inline-flex items-center gap-1 text-[11px] font-bold text-[#c9a23f] underline decoration-[#c9a23f]/40 underline-offset-4 hover:text-white transition-colors"
						>
							<span>{barConfig.linkText}</span>
							<ArrowRight className="h-3 w-3" />
						</Link>
					)}
				</div>

				{/* Dismiss Button */}
				<button
					type="button"
					onClick={() => setVisible(false)}
					className="ml-3 rounded-md p-1 text-slate-400 hover:text-white transition-colors"
					aria-label="Dismiss announcement"
				>
					<X className="h-3.5 w-3.5" />
				</button>
			</div>
		</motion.aside>
	);
}
