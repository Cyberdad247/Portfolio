/**
 * UKG Logger (L4 Semantic Layer)
 * Logs critical agentic events to the Universal Knowledge Glyph.
 * For now, this persists to localStorage to simulate UKG persistence.
 */

export interface UKGEntry {
    timestamp: string;
    type: "ONBOARDING" | "STRATEGY" | "AUDIT" | "KINETIC_STRIKE";
    payload: Record<string, unknown>;
    agentId?: string;
}

export const logToUKG = (entry: Omit<UKGEntry, "timestamp">) => {
    const fullEntry: UKGEntry = {
        ...entry,
        timestamp: new Date().toISOString(),
    };

    console.log(`[L4 SEMANTIC]: Logging to UKG - ${entry.type}`, fullEntry);

    try {
        const existingLog = localStorage.getItem("UKG_MEMORY_SIM");
        const logs: UKGEntry[] = existingLog ? JSON.parse(existingLog) : [];
        logs.push(fullEntry);
        // Keep last 100 entries
        const trimmedLogs = logs.slice(-100);
        localStorage.setItem("UKG_MEMORY_SIM", JSON.stringify(trimmedLogs));
    } catch (e) {
        console.error("Failed to sync with UKG Semantic Layer:", e);
    }
};
