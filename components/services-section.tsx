"use client";

import { motion } from "framer-motion";
import {
	Activity,
	BarChart3,
	BrainCircuit,
	FileText,
	Layout,
	ListChecks,
	Mail,
	Megaphone,
	MessageSquareMore,
	PenTool,
	RefreshCw,
	Search,
	Share2,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";

const services = [
	{
		icon: BrainCircuit,
		title: "AI Strategy",
		description: "Custom AI solutions tailored to your marketing needs",
	},
	{
		icon: BarChart3,
		title: "Data Analytics",
		description: "Advanced analytics to drive informed decisions",
	},
	{
		icon: TrendingUp,
		title: "Growth Marketing",
		description: "AI-powered strategies for rapid, sustainable growth",
	},
	{
		icon: MessageSquareMore,
		title: "AI Chatbots",
		description: "Intelligent conversation automation for better engagement",
	},
	{
		icon: Activity,
		title: "Website Analysis",
		description:
			"Analyze performance and SEO using Google Analytics and Search Console",
	},
	{
		icon: Share2,
		title: "Social Media Management",
		description:
			"Setup and manage social accounts with tools like Hootsuite and Buffer",
	},
	{
		icon: Mail,
		title: "Email Marketing",
		description: "Create targeted email campaigns to engage your audience",
	},
	{
		icon: PenTool,
		title: "Content Creation",
		description: "Boost online presence with articles, videos, and graphics",
	},
	{
		icon: Search,
		title: "SEO Optimization",
		description:
			"Improve search rankings with keyword research and link building",
	},
	{
		icon: Layout,
		title: "Landing Pages",
		description: "Create high-converting landing pages for your campaigns",
	},
	{
		icon: ListChecks,
		title: "Email List Building",
		description: "Collect and utilize email addresses for targeted marketing",
	},
	{
		icon: FileText,
		title: "Website Copywriting",
		description: "Create compelling and effective website content",
	},
	{
		icon: RefreshCw,
		title: "Website Redesign",
		description: "Improve user experience and engagement with redesigns",
	},
	{
		icon: Megaphone,
		title: "Social Media Ads",
		description: "Promote products/services to targeted social media audiences",
	},
];

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.06, delayChildren: 0.1 },
	},
};

const cardVariants = {
	hidden: { y: 30, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: { type: "spring" as const, stiffness: 80 },
	},
};

import { NeuralCard } from "@/components/ui/neural-interface";
import { tokens } from "@/lib/utils";

// ... (previous imports and services constant)

export default function ServicesSection() {
	return (
		<section
			id="services"
			className="relative px-4 py-32 md:px-8 overflow-hidden"
		>
			<div className="relative z-10 mx-auto max-w-7xl">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={tokens.animation.spring}
					className="mb-24 text-center"
				>
					<h2 className="text-balance text-4xl font-extrabold tracking-tight text-white md:text-7xl">
						Lattice-Scale <span className="text-primary italic">Intelligence</span>
					</h2>
					<p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-500 font-mono uppercase tracking-widest">
						Agentic Solutions // v700.core.services
					</p>
				</motion.div>

				{/* Services Grid */}
				<motion.div
					variants={tokens.animation.stagger(0.04)}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-80px" }}
					className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
				>
					{services.map((service) => (
						<NeuralCard
							key={service.title}
							className="p-8 h-full flex flex-col"
						>
							<div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-primary border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-500">
								<service.icon className="h-7 w-7" />
							</div>
							<h3 className="text-xl font-bold text-white tracking-tight">
								{service.title}
							</h3>
							<p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-500 group-hover:text-zinc-300 transition-colors">
								{service.description}
							</p>
							<div className="mt-6 pt-6 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
								<span className="text-[10px] font-mono text-primary uppercase tracking-[0.2em]">Deploy Node →</span>
							</div>
						</NeuralCard>
					))}
				</motion.div>

				{/* CTA to Tiered Services */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.4 }}
					className="mt-24 flex justify-center"
				>
					<Link
						href="/services"
						className="group relative inline-flex items-center gap-4 rounded-full bg-white text-black px-10 py-5 text-sm font-bold uppercase tracking-tighter hover:bg-primary transition-all duration-500"
					>
						EXPLORE AGENTIC OS TIERS
						<div className="absolute -inset-1 rounded-full bg-primary/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
						<span className="group-hover:translate-x-1 transition-transform">→</span>
					</Link>
				</motion.div>
			</div>
		</section>
	);
}
