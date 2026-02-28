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

export default function ServicesSection() {
	return (
		<section
			id="services"
			className="relative bg-background px-4 py-24 md:px-8"
		>
			<div className="pointer-events-none absolute right-[10%] top-[20%] z-0 h-[30vw] w-[30vw] rounded-full bg-primary/5 blur-[120px]" />

			<div className="relative z-10 mx-auto max-w-7xl">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.6 }}
					className="mb-16 text-center"
				>
					<h2 className="text-balance text-3xl font-bold text-foreground md:text-5xl">
						Our Services
					</h2>
				</motion.div>

				{/* Services Grid */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-80px" }}
					className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
				>
					{services.map((service) => (
						<motion.div
							key={service.title}
							variants={cardVariants}
							whileHover={{ y: -4, transition: { duration: 0.2 } }}
							className="group flex flex-col rounded-2xl border border-border bg-card p-6 backdrop-blur-sm transition-colors hover:border-primary/30 hover:bg-muted/30"
						>
							<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
								<service.icon className="h-6 w-6" />
							</div>
							<h3 className="text-lg font-bold text-foreground">
								{service.title}
							</h3>
							<p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
								{service.description}
							</p>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
