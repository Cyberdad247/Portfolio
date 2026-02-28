import { BrainCircuit, Globe, MessageSquare, Search } from "lucide-react";

export const performanceData = [
	{ name: "Mon", tasks: 400, insights: 240 },
	{ name: "Tue", tasks: 300, insights: 139 },
	{ name: "Wed", tasks: 500, insights: 380 },
	{ name: "Thu", tasks: 280, insights: 200 },
	{ name: "Fri", tasks: 590, insights: 430 },
	{ name: "Sat", tasks: 350, insights: 250 },
	{ name: "Sun", tasks: 420, insights: 310 },
];

export const agentStatus = [
	{
		id: "A-01",
		name: "Market Scanner",
		status: "active" as const,
		icon: Globe,
	},
	{
		id: "A-02",
		name: "Competitor Analyst",
		status: "processing" as const,
		icon: Search,
	},
	{
		id: "A-03",
		name: "Sentiment Engine",
		status: "idle" as const,
		icon: MessageSquare,
	},
	{
		id: "A-04",
		name: "Strategy Synthesizer",
		status: "active" as const,
		icon: BrainCircuit,
	},
];

export const liveFeedLog = [
	{
		id: 1,
		agent: "A-01",
		action: 'Scanned 1,500 URLs for keyword "Generative AI Market"',
		time: "10:45:22",
	},
	{
		id: 2,
		agent: "A-02",
		action: "Detected pricing shift in Competitor X quarterly report",
		time: "10:45:15",
	},
	{
		id: 3,
		agent: "A-04",
		action: 'Correlating data points to generate "Q3 Opportunity Brief"',
		time: "10:44:50",
	},
	{
		id: 4,
		agent: "A-01",
		action: "Cross-referencing social signals with news API",
		time: "10:44:10",
	},
];
