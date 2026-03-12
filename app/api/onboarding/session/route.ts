import { NextResponse } from "next/server";
import { getActiveMembership } from "@/lib/auth/get-active-membership";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type OnboardingSessionPayload = {
	currentPhase: 1 | 2 | 3;
	status: "draft" | "completed";
	formData: Record<string, string>;
	transcriptLog: Array<{
		transcript: string;
		phase: 1 | 2 | 3;
		capturedFields: string[];
		capturedValues: Record<string, string>;
		createdAt: string;
	}>;
};

async function requireOnboardingContext() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return {
			error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
		};
	}

	const membership = await getActiveMembership(user.id);
	const organizationId =
		membership?.organization_id ||
		(
			membership?.organizations as {
				id?: string;
			} | null
		)?.id;

	if (!organizationId) {
		return {
			error: NextResponse.json(
				{ error: "No active organization membership found" },
				{ status: 403 },
			),
		};
	}

	return { supabase, user, organizationId };
}

export async function GET() {
	const context = await requireOnboardingContext();
	if ("error" in context) {
		return context.error;
	}

	const { supabase, user, organizationId } = context;
	const { data, error } = await supabase
		.from("onboarding_sessions")
		.select(
			"id,organization_id,user_id,status,current_phase,form_data,transcript_log,source,created_at,updated_at",
		)
		.eq("organization_id", organizationId)
		.eq("user_id", user.id)
		.maybeSingle();

	if (error) {
		return NextResponse.json(
			{ error: "Unable to load onboarding session" },
			{ status: 500 },
		);
	}

	return NextResponse.json({
		session: data,
		organizationId,
	});
}

export async function POST(request: Request) {
	const context = await requireOnboardingContext();
	if ("error" in context) {
		return context.error;
	}

	const { supabase, user, organizationId } = context;
	const body = (await request.json()) as Partial<OnboardingSessionPayload>;

	if (
		!body.currentPhase ||
		!body.formData ||
		!body.status ||
		!body.transcriptLog
	) {
		return NextResponse.json(
			{ error: "Missing onboarding session payload" },
			{ status: 400 },
		);
	}

	const { data, error } = await supabase
		.from("onboarding_sessions")
		.upsert(
			{
				organization_id: organizationId,
				user_id: user.id,
				status: body.status,
				current_phase: body.currentPhase,
				form_data: body.formData,
				transcript_log: body.transcriptLog,
				source: "receptionist_web",
			},
			{
				onConflict: "organization_id,user_id",
			},
		)
		.select(
			"id,organization_id,user_id,status,current_phase,form_data,transcript_log,source,created_at,updated_at",
		)
		.single();

	if (error) {
		return NextResponse.json(
			{ error: "Unable to save onboarding session" },
			{ status: 500 },
		);
	}

	return NextResponse.json({
		session: data,
		organizationId,
	});
}
