use spacetimedb::{spacetimedb, ReducerContext, Table, Timestamp};

#[spacetimedb(table)]
pub struct Lead {
    #[primarykey]
    #[autoinc]
    pub id: u64,
    pub session_id: String,
    pub full_name: String,
    pub email: String,
    pub marketing_goal: String,
    pub source: String,
    pub created_at: Timestamp,
}

#[spacetimedb(table)]
pub struct SchedulingRequest {
    #[primarykey]
    #[autoinc]
    pub id: u64,
    pub lead_id: u64,
    pub requested_datetime: String,
    pub invite_sent: bool,
    pub created_at: Timestamp,
}

#[spacetimedb(table)]
pub struct TashaSession {
    #[primarykey]
    pub session_id: String,
    pub phase: String,
    pub barge_in_count: u32,
    pub transcript_log: String,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}

#[spacetimedb(reducer)]
pub fn insert_lead(
    ctx: &ReducerContext,
    session_id: String,
    full_name: String,
    email: String,
    marketing_goal: String,
) {
    let lead = Lead {
        id: 0,
        session_id,
        full_name,
        email,
        marketing_goal,
        source: "voice_receptionist_tasha".to_string(),
        created_at: Timestamp::now(),
    };
    ctx.db.lead().insert(lead);
    log::info!("[TASHA] Lead captured: {} ({})", lead.full_name, lead.email);
}

#[spacetimedb(reducer)]
pub fn schedule_appointment(
    ctx: &ReducerContext,
    lead_id: u64,
    requested_datetime: String,
) {
    let request = SchedulingRequest {
        id: 0,
        lead_id,
        requested_datetime: requested_datetime.clone(),
        invite_sent: false,
        created_at: Timestamp::now(),
    };
    ctx.db.scheduling_request().insert(request);
    log::info!("[TASHA] Scheduling request for lead {} at {}", lead_id, requested_datetime);
}

#[spacetimedb(reducer)]
pub fn start_session(ctx: &ReducerContext, session_id: String) {
    let now = Timestamp::now();
    let session = TashaSession {
        session_id: session_id.clone(),
        phase: "greeting".to_string(),
        barge_in_count: 0,
        transcript_log: String::new(),
        created_at: now,
        updated_at: now,
    };
    ctx.db.tasha_session().insert(session);
    log::info!("[TASHA] Session started: {}", session_id);
}

#[spacetimedb(reducer)]
pub fn update_session_phase(
    ctx: &ReducerContext,
    session_id: String,
    new_phase: String,
    transcript_append: String,
) {
    if let Some(mut session) = ctx.db.tasha_session().session_id().find(&session_id) {
        session.phase = new_phase;
        session.transcript_log = format!("{}\n{}", session.transcript_log, transcript_append);
        session.updated_at = Timestamp::now();
        ctx.db.tasha_session().session_id().update(session);
    }
}

#[spacetimedb(reducer)]
pub fn record_barge_in(ctx: &ReducerContext, session_id: String) {
    if let Some(mut session) = ctx.db.tasha_session().session_id().find(&session_id) {
        session.barge_in_count += 1;
        session.updated_at = Timestamp::now();
        ctx.db.tasha_session().session_id().update(session);
        log::info!("[TASHA] Barge-in detected in session {}", session_id);
    }
}
