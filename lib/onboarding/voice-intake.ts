import type { OnboardingData, PhaseType } from "@/components/onboarding/types";

type ExtractionResult = {
	updates: Partial<OnboardingData>;
	summary: string[];
};

const INDUSTRY_OPTIONS = [
	"Technology",
	"E-commerce",
	"Healthcare",
	"Finance",
	"Education",
	"Professional Services",
	"Other",
] as const;

const BUDGET_OPTIONS = [
	"Less than $1,000",
	"$1,000 - $5,000",
	"$5,000 - $10,000",
	"$10,000 - $25,000",
	"$25,000+",
	"Not sure",
] as const;

const CHANNEL_OPTIONS = [
	"Social Media",
	"Email Marketing",
	"SEO",
	"PPC",
	"Content Marketing",
	"Multi-channel",
] as const;

const TIMELINE_OPTIONS = [
	"Immediately",
	"Within 1 week",
	"Within 1 month",
	"Just exploring",
	"Flexible",
] as const;

function normalizeWhitespace(input: string) {
	return input.replace(/\s+/g, " ").trim();
}

function titleCase(input: string) {
	return input
		.split(" ")
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
		.join(" ");
}

function extractPattern(input: string, patterns: RegExp[]) {
	for (const pattern of patterns) {
		const match = pattern.exec(input);
		if (match?.[1]) {
			return normalizeWhitespace(match[1]);
		}
	}

	return "";
}

function matchOption(input: string, options: readonly string[]) {
	const lowered = input.toLowerCase();
	return options.find((option) => lowered.includes(option.toLowerCase())) ?? "";
}

export function extractOnboardingFromTranscript(
	transcript: string,
	currentPhase: PhaseType,
	currentData: OnboardingData,
): ExtractionResult {
	const normalizedTranscript = normalizeWhitespace(transcript);
	const loweredTranscript = normalizedTranscript.toLowerCase();
	const updates: Partial<OnboardingData> = {};
	const summary: string[] = [];

	if (currentPhase === 1) {
		const name =
			extractPattern(normalizedTranscript, [
				/\bmy name is ([a-z ,.'-]+)/i,
				/\bi am ([a-z ,.'-]+)/i,
				/\bthis is ([a-z ,.'-]+)/i,
			]) || currentData.name;

		const emailMatch = normalizedTranscript.match(
			/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
		);
		const phoneMatch = normalizedTranscript.match(/(\+?\d[\d\s().-]{7,}\d)/);
		const websiteMatch = normalizedTranscript.match(
			/\b((?:https?:\/\/)?(?:www\.)?[a-z0-9-]+\.[a-z]{2,}(?:\/[^\s]*)?)\b/i,
		);
		const company =
			extractPattern(normalizedTranscript, [
				/\bcompany(?: name)? is ([a-z0-9 &.,'-]+)/i,
				/\bbusiness(?: name)? is ([a-z0-9 &.,'-]+)/i,
				/\bi work at ([a-z0-9 &.,'-]+)/i,
			]) || currentData.company;
		const industry = matchOption(normalizedTranscript, INDUSTRY_OPTIONS);

		if (name && !currentData.name) {
			updates.name = titleCase(name.replace(/\bfrom .*/, "").trim());
			summary.push(`name: ${updates.name}`);
		}
		if (emailMatch && !currentData.email) {
			updates.email = emailMatch[0].toLowerCase();
			summary.push(`email: ${updates.email}`);
		}
		if (phoneMatch && !currentData.phone) {
			updates.phone = normalizeWhitespace(phoneMatch[1]);
			summary.push(`phone: ${updates.phone}`);
		}
		if (websiteMatch && !currentData.website) {
			const website = websiteMatch[1].startsWith("http")
				? websiteMatch[1]
				: `https://${websiteMatch[1]}`;
			updates.website = website;
			summary.push(`website: ${updates.website}`);
		}
		if (company && !currentData.company) {
			updates.company = titleCase(company);
			summary.push(`company: ${updates.company}`);
		}
		if (industry && !currentData.industry) {
			updates.industry = industry;
			summary.push(`industry: ${updates.industry}`);
		}
	}

	if (currentPhase === 2) {
		const goalCue = extractPattern(normalizedTranscript, [
			/\b(?:our|my) goals? (?:are|is) ([^.]+)/i,
			/\b(?:we|i) want to ([^.]+)/i,
			/\bprimary marketing goals? (?:are|is) ([^.]+)/i,
		]);
		const audienceCue = extractPattern(normalizedTranscript, [
			/\btarget audience (?:is|are) ([^.]+)/i,
			/\bour audience is ([^.]+)/i,
			/\bwe serve ([^.]+)/i,
		]);
		const challengeCue = extractPattern(normalizedTranscript, [
			/\b(?:biggest|main|current) challenges? (?:are|is) ([^.]+)/i,
			/\bwe struggle with ([^.]+)/i,
		]);

		const budget = (() => {
			if (loweredTranscript.includes("not sure")) return "Not sure";
			if (/\b(?:25|30|40|50|100)[ ,]?\d{0,3}\+?\b/.test(loweredTranscript)) {
				return "$25,000+";
			}
			if (
				loweredTranscript.includes("10,000") ||
				loweredTranscript.includes("15000") ||
				loweredTranscript.includes("20000")
			) {
				return "$10,000 - $25,000";
			}
			if (
				loweredTranscript.includes("5,000") ||
				loweredTranscript.includes("7000") ||
				loweredTranscript.includes("8000")
			) {
				return "$5,000 - $10,000";
			}
			if (
				loweredTranscript.includes("1,000") ||
				loweredTranscript.includes("2000") ||
				loweredTranscript.includes("3000")
			) {
				return "$1,000 - $5,000";
			}
			if (loweredTranscript.includes("less than 1000")) {
				return "Less than $1,000";
			}
			return matchOption(normalizedTranscript, BUDGET_OPTIONS);
		})();

		const channel = (() => {
			if (loweredTranscript.includes("multi channel")) return "Multi-channel";
			if (
				loweredTranscript.includes("social") ||
				loweredTranscript.includes("instagram") ||
				loweredTranscript.includes("facebook") ||
				loweredTranscript.includes("linkedin") ||
				loweredTranscript.includes("tiktok")
			) {
				return "Social Media";
			}
			if (loweredTranscript.includes("email")) return "Email Marketing";
			if (
				loweredTranscript.includes("seo") ||
				loweredTranscript.includes("search engine")
			) {
				return "SEO";
			}
			if (
				loweredTranscript.includes("ppc") ||
				loweredTranscript.includes("google ads")
			) {
				return "PPC";
			}
			if (loweredTranscript.includes("content")) return "Content Marketing";
			return matchOption(normalizedTranscript, CHANNEL_OPTIONS);
		})();

		if (goalCue && !currentData.goals) {
			updates.goals = goalCue;
			summary.push("goals");
		}
		if (audienceCue && !currentData.targetAudience) {
			updates.targetAudience = audienceCue;
			summary.push("target audience");
		}
		if (challengeCue && !currentData.currentChallenges) {
			updates.currentChallenges = challengeCue;
			summary.push("current challenges");
		}
		if (budget && !currentData.budgetRange) {
			updates.budgetRange = budget;
			summary.push(`budget: ${budget}`);
		}
		if (channel && !currentData.preferredChannels) {
			updates.preferredChannels = channel;
			summary.push(`channel: ${channel}`);
		}

		if (summary.length === 0) {
			if (!currentData.goals) {
				updates.goals = normalizedTranscript;
				summary.push("goals");
			} else if (!currentData.targetAudience) {
				updates.targetAudience = normalizedTranscript;
				summary.push("target audience");
			} else if (!currentData.currentChallenges) {
				updates.currentChallenges = normalizedTranscript;
				summary.push("current challenges");
			}
		}
	}

	if (currentPhase === 3) {
		const timeline = (() => {
			if (
				loweredTranscript.includes("immediately") ||
				loweredTranscript.includes("asap")
			) {
				return "Immediately";
			}
			if (
				loweredTranscript.includes("one week") ||
				loweredTranscript.includes("1 week") ||
				loweredTranscript.includes("next week")
			) {
				return "Within 1 week";
			}
			if (
				loweredTranscript.includes("one month") ||
				loweredTranscript.includes("1 month") ||
				loweredTranscript.includes("this month")
			) {
				return "Within 1 month";
			}
			if (loweredTranscript.includes("exploring")) return "Just exploring";
			if (loweredTranscript.includes("flexible")) return "Flexible";
			return matchOption(normalizedTranscript, TIMELINE_OPTIONS);
		})();

		if (timeline && !currentData.timeline) {
			updates.timeline = timeline;
			summary.push(`timeline: ${timeline}`);
		}

		if (!currentData.additionalNotes) {
			updates.additionalNotes = normalizedTranscript;
			summary.push("additional notes");
		}
	}

	return { updates, summary };
}
