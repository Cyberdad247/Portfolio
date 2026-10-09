/**
 * TASHA COGNITIVE REGISTRY (L5 Agentic Layer)
 * Defines the Persona attributes, traits, and decision logic for the Interaction Manager.
 */

export type TashaState = "IDLE" | "LISTENING" | "PROCESSING" | "SPEAKING" | "ANALYZING";

export interface VisualContext {
	currentPage: string;
	focusedElementId?: string;
	dwellTime: number;
}

export interface TashaTraits {
	efficiency: number; // 0-1
	proactivity: number; // 0-1
	tone: "professional" | "ethereal" | "technical";
}

export const TASHA_CONFIG: TashaTraits = {
	efficiency: 0.95,
	proactivity: 0.8,
	tone: "ethereal",
};

/**
 * BDI Intent Router
 * Maps Visual/Voice input to Site Actions.
 */
export const decideTashaAction = (
	input: string,
	context: VisualContext,
): { message: string; action?: string } => {
	const text = input.toLowerCase();

	// Intent: Navigation
	if (text.includes("go to") || text.includes("show me")) {
		if (text.includes("saas") || text.includes("software")) {
			return { message: "Redirecting to SaaS Intelligence Archives.", action: "/intelligence/saas" };
		}
		if (text.includes("stack") || text.includes("methodology")) {
			return { message: "Accessing the Sovereign Stack blueprint.", action: "/methodology" };
		}
	}

	// Intent: Sight-Based Contextual Help
	if (context.focusedElementId === "kinetic-layer" && text.includes("what is this")) {
		return { message: "The Kinetic Layer handles binary execution and high-speed processing." };
	}

	if (context.focusedElementId === "mission-statement") {
		return { message: "Our mission is to bridge the gap between AI efficiency and human strategic vision. We call this the Kinetic Union." };
	}

	if (context.focusedElementId === "service-launch") {
		return { message: "The Launch tier is designed for rapid market entry. Our agents focus on establishing your initial lead velocity." };
	}

	if (context.focusedElementId === "service-scale") {
		return { message: "Scale is where the Nexus shines. We deploy multi-agent swarms to optimize your CPL and expand your reach." };
	}

	if (context.focusedElementId === "service-enterprise") {
		return { message: "Enterprise requires custom sovereign protocols. We provide dedicated compute and deep semantic memory integration." };
	}

	if (context.focusedElementId?.startsWith("case-study-")) {
		return { message: "This report details a successful deployment of our Agentic Growth OS. Our results are verified by the UKG ledger." };
	}

	if (context.focusedElementId === "hero-cta") {
		return { message: "Ready to initiate? I'll guide you through our autonomous reconnaissance phase." };
	}

	if (context.focusedElementId === "contact-form") {
		return { message: "Brief our agents on your requirements. We'll synchronize a strategic response within 24 hours." };
	}

	if (context.focusedElementId === "comparison-table") {
		return { message: "Traditional agencies focus on retainers. We focus on Agentic velocity. The difference is in the OS." };
	}

	if (context.focusedElementId === "case-study-metrics") {
		return { message: "These metrics are real-time extractions from our agent logs. They represent verified growth outcomes." };
	}

	// Default Reactive Logic
	if (text.includes("hello") || text.includes("hi")) {
		return { message: "Nexus L7 Interface active. I am Tasha. How shall we proceed?" };
	}

	return { message: "Intention logged. Scanning for optimal path." };
};
