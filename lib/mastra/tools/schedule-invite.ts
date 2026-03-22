// lib/mastra/tools/schedule-invite.ts

type ScheduleResult = {
	success: boolean;
	message: string;
	error?: string;
};

export async function scheduleGmailInvite(
	email: string,
	datetime: string,
	leadName: string,
): Promise<ScheduleResult> {
	try {
		const result = await fetch("/api/receptionist/schedule", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email_address: email,
				datetime,
			}),
		});

		if (!result.ok) {
			throw new Error(`Schedule API error: ${result.status}`);
		}

		const data = await result.json();

		console.log(
			`[SCHEDULE] Invite dispatched: ${leadName} (${email}) at ${datetime}`,
		);

		return {
			success: true,
			message:
				data.message || `Calendar invite sent to ${email} for ${datetime}`,
		};
	} catch (error) {
		const errMsg = error instanceof Error ? error.message : String(error);
		console.error("[SCHEDULE] Failed:", errMsg);
		return {
			success: false,
			message: "Failed to dispatch calendar invite",
			error: errMsg,
		};
	}
}
