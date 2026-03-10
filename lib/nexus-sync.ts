/**
 * Nexus Sync (L5 Agentic Layer)
 * Orchestrates event broadcasting between autonomous components.
 */

export interface NexusEvent {
	id: string;
	agent: string;
	action: string;
	time: string;
}

export const emitNexusEvent = (event: Omit<NexusEvent, "id" | "time">) => {
	const newEvent: NexusEvent = {
		...event,
		id: Math.random().toString(36).substr(2, 9),
		time: new Date().toLocaleTimeString(),
	};

	try {
		const existingEvents = localStorage.getItem("NEXUS_DASHBOARD_EVENTS");
		const events: NexusEvent[] = existingEvents
			? JSON.parse(existingEvents)
			: [];
		events.unshift(newEvent); // Add to beginning
		// Keep last 10 events
		const trimmedEvents = events.slice(0, 10);
		localStorage.setItem(
			"NEXUS_DASHBOARD_EVENTS",
			JSON.stringify(trimmedEvents),
		);

		// Dispatch custom event for same-page listeners
		window.dispatchEvent(
			new CustomEvent("nexus-dashboard-sync", { detail: newEvent }),
		);
	} catch (e) {
		console.error("Nexus Event Broadcast Failure:", e);
	}
};
