import GestationChamber from "@/components/wizard-lab/gestation-chamber";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Wizard Lab | Ambassador Gestation Chamber",
	description: "Create and customize your AI marketing knights in the sovereign gestation chamber.",
};

export default function WizardLabPage() {
	return (
		<main className="min-h-screen bg-zinc-950 px-6 py-24">
			<div className="mx-auto max-w-4xl">
				<div className="mb-12 space-y-4">
					<h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl">
						The Wizard Lab
					</h1>
					<p className="text-lg text-zinc-400">
						Welcome to the sovereign gestation chamber. Here, we forge client-specific intelligence nodes to drive hyper-growth.
					</p>
				</div>
				
				<GestationChamber />
				
				<div className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8">
					<h3 className="text-xl font-bold text-white mb-4 italic">// THE SOVEREIGN CODE</h3>
					<p className="text-zinc-500 leading-relaxed italic">
						"An agent is not born; it is compiled. The gestation process ensures that every knight is anchored to the brand's core truth while remaining kinetically flexible for the 2026 generative landscape."
					</p>
				</div>
			</div>
		</main>
	);
}
