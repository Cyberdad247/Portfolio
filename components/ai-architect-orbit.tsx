"use client";

import Image from "next/image";
import React, { useEffect, useRef } from "react";

const ORBIT_WORDS: Array<{ text: string; color: "purple" | "gold" }> = [
	{ text: "VISION", color: "purple" },
	{ text: "MINDS", color: "gold" },
	{ text: "DIRECT", color: "purple" },
	{ text: "LIGHT", color: "gold" },
	{ text: "DISCOVER", color: "purple" },
	{ text: "SIGNAL", color: "gold" },
	{ text: "SIMULATE", color: "purple" },
	{ text: "PIVOT", color: "gold" },
	{ text: "KINETIC", color: "purple" },
	{ text: "RISE", color: "gold" },
	{ text: "PIPELINE", color: "purple" },
	{ text: "SILVER", color: "gold" },
	{ text: "DIVINE", color: "purple" },
	{ text: "VITAL", color: "gold" },
	{ text: "CIRCUIT", color: "purple" },
	{ text: "WIZARD", color: "gold" },
	{ text: "LIMITLESS", color: "purple" },
	{ text: "TITAN", color: "gold" },
	{ text: "WIRE", color: "purple" },
	{ text: "FIRE", color: "gold" },
	{ text: "SILICON", color: "purple" },
	{ text: "MIRROR", color: "gold" },
	{ text: "RIGOR", color: "purple" },
	{ text: "TIME", color: "gold" },
];

export interface AIArchitectOrbitProps {
	className?: string;
	title?: string;
	subtitle?: string;
	showHeadings?: boolean;
}

export default function AIArchitectOrbit({
	className = "",
	title = "THE A.I. ARCHITECT",
	subtitle = "LIVING TYPOGRAPHIC ORBIT · AUTONOMOUS INTELLIGENCE CORE",
	showHeadings = true,
}: AIArchitectOrbitProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const words = Array.from(
			container.querySelectorAll<HTMLElement>(".word"),
		);
		if (!words.length) return;

		const reducedMotion =
			typeof window !== "undefined" &&
			window.matchMedia("(prefers-reduced-motion: reduce)").matches;

		let timeoutId: NodeJS.Timeout | null = null;
		let intervalId: NodeJS.Timeout | null = null;
		let isDestroyed = false;

		// Randomize the orbit while keeping the logo at the center.
		function arrangeOrbit() {
			const shuffled = [...words].sort(() => Math.random() - 0.5);
			const step = (Math.PI * 2) / shuffled.length;
			const mobile = window.innerWidth <= 600;

			shuffled.forEach((word, index) => {
				const angle = index * step + (Math.random() - 0.5) * 0.4;
				const radiusX = mobile ? 34 : 36;
				const radiusY = mobile ? 34 : 35;

				const x = 50 + Math.cos(angle) * radiusX;
				const y = 50 + Math.sin(angle) * radiusY;

				word.style.left = `${x}%`;
				word.style.top = `${y}%`;
			});
		}

		function flashRandomWord() {
			if (isDestroyed) return;
			const word = words[Math.floor(Math.random() * words.length)];
			if (!word) return;

			word.classList.remove("fade", "active");

			// Restart the transition cleanly.
			void word.offsetWidth;
			word.classList.add("active");

			const duration = 450 + Math.random() * 1100;

			const fadeTimer = setTimeout(() => {
				if (isDestroyed) return;
				word.classList.remove("active");
				word.classList.add("fade");

				const removeFadeTimer = setTimeout(() => {
					if (!isDestroyed) word.classList.remove("fade");
				}, 400);
			}, duration);

			// Unpredictable intervals create a natural, continuous loop.
			timeoutId = setTimeout(flashRandomWord, 180 + Math.random() * 650);
		}

		arrangeOrbit();

		if (!reducedMotion) {
			flashRandomWord();
			// Reorganize the vocabulary periodically.
			intervalId = setInterval(arrangeOrbit, 6500);
		} else {
			words.forEach((word) => {
				word.style.opacity = "1";
			});
		}

		const handleResize = () => arrangeOrbit();
		window.addEventListener("resize", handleResize);

		return () => {
			isDestroyed = true;
			if (timeoutId) clearTimeout(timeoutId);
			if (intervalId) clearInterval(intervalId);
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<section
			className={`relative w-full bg-white text-slate-900 py-12 md:py-20 px-4 flex flex-col items-center justify-center overflow-hidden selection:bg-[#792cff]/20 selection:text-[#792cff] ${className}`}
			style={{ backgroundColor: "#ffffff" }}
		>
			<style jsx global>{`
				/* Living typographic orbit styles */
				.ai-orbit-stage {
					position: relative;
					width: 100%;
					max-width: 960px;
					height: 580px;
					margin: 0 auto;
					display: flex;
					align-items: center;
					justify-content: center;
					background: #ffffff;
					overflow: hidden;
				}

				.word {
					position: absolute;
					z-index: 1;
					left: 50%;
					top: 50%;
					transform: translate(-50%, -50%) scale(0.7);
					white-space: nowrap;
					font-weight: 900;
					text-transform: uppercase;
					letter-spacing: 0.06em;
					opacity: 0;
					pointer-events: none;
					transition:
						opacity 0.35s ease,
						transform 0.45s ease,
						text-shadow 0.35s ease;
					will-change: opacity, transform;
					font-size: clamp(14px, 2.2vw, 22px);
				}

				.purple {
					color: #792cff;
				}

				.gold {
					color: #c9a23f;
				}

				.word.active {
					opacity: 1;
					transform: translate(-50%, -50%) scale(1);
					text-shadow: 0 0 14px currentColor;
				}

				.word.fade {
					opacity: 0.12;
					transform: translate(-50%, -50%) scale(0.85);
				}

				.brand {
					position: relative;
					z-index: 3;
					text-align: center;
				}

				.logo-frame {
					position: relative;
					z-index: 3;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
				}

				/* Keep the orbit clear of the central logo */
				@media (max-width: 600px) {
					.ai-orbit-stage {
						height: 440px;
					}
					.word {
						font-size: clamp(10px, 2.8vw, 15px);
						letter-spacing: 0;
					}
				}
			`}</style>

			{showHeadings && (
				<div className="text-center z-10 mb-6 max-w-xl">
					<span className="inline-block text-[11px] font-extrabold tracking-[0.22em] text-[#c9a23f] uppercase mb-2">
						{subtitle}
					</span>
					<h2 className="text-3xl md:text-5xl font-black tracking-tight text-neutral-900 uppercase">
						{title}
					</h2>
					<p className="text-xs md:text-sm text-neutral-500 mt-2 font-medium">
						Ideas orbiting an intelligence engine. Every word anchored by the second-letter &apos;I&apos;.
					</p>
				</div>
			)}

			{/* Orbit Stage with pure white background */}
			<div ref={containerRef} className="ai-orbit-stage" aria-label="A.I. Architect Living Typographic Orbit">
				{/* Orbit Words */}
				{ORBIT_WORDS.map((w, idx) => (
					<span
						key={`${w.text}-${idx}`}
						className={`word ${w.color}`}
						data-word={w.text}
					>
						{w.text}
					</span>
				))}

				{/* Fixed Centerpiece: The Central "I" Intelligence Engine */}
				<div className="brand">
					<div className="logo-frame group cursor-pointer transition-transform duration-500 hover:scale-105">
						<div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(121,44,255,0.18),0_0_0_1px_rgba(201,162,63,0.3)] bg-white p-2">
							<Image
								src="/images/ai-architect-i.png"
								alt="A.I. Architect Central Intelligence I"
								fill
								sizes="(max-width: 768px) 224px, 256px"
								className="object-cover rounded-2xl"
								priority
							/>
						</div>
						<div className="mt-3 text-center">
							<span className="block text-[11px] font-extrabold tracking-[0.25em] text-[#792cff] uppercase">
								INVISIONED · AI CORE
							</span>
							<span className="block text-[9px] font-bold tracking-[0.18em] text-[#c9a23f] uppercase mt-0.5">
								ORBITAL HARMONIC MATRIX
							</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
