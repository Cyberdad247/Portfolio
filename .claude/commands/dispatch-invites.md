# /dispatch-invites — Tasha Calendar + Gmail Dispatcher

Dispatch all pending scheduling requests from Tasha via Google Calendar and Gmail.

## Workflow

1. **Read pending invites** from Supabase `tasha_scheduling_queue` where `status = 'pending'`.
   - Use: `fetch` against the Supabase REST API with the service role key from `.env.local`
   - Endpoint: `GET /rest/v1/tasha_scheduling_queue?status=eq.pending`

2. **For each pending invite**, do the following:

   a. **Create Google Calendar event** using `mcp__claude_ai_Google_Calendar__gcal_create_event`:
      - Calendar: `primary` (vizion711@gmail.com)
      - Summary: `"Invisioned Strategy Call — {lead_name}"`
      - Description: `"Marketing Goal: {marketing_goal}\n\nBooked via Tasha Prime, Invisioned Marketing's AI receptionist."`
      - Attendees: `[{email: lead_email}, {email: "vizion711@gmail.com", organizer: true}]`
      - Start/End: Parse `requested_datetime` into proper RFC3339. If only a day name (e.g. "Monday"), calculate the next occurrence. Default duration: 30 minutes.
      - TimeZone: `America/New_York`
      - Add Google Meet: yes (conferenceData with hangoutsMeet)
      - Send updates: `all`

   b. **Send Gmail confirmation** using `mcp__claude_ai_Gmail__gmail_create_draft` then tell the user to review or auto-send:
      - To: `{lead_email}`
      - Subject: `"Your Strategy Call with Invisioned Marketing is Confirmed!"`
      - Content type: `text/html`
      - Body (HTML):
        ```
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">You're All Set, {lead_name}! 🎯</h2>
          <p>Right then! Your strategy call with Invisioned Marketing has been booked.</p>
          <div style="background: #f4f4f5; padding: 16px; border-radius: 12px; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>When:</strong> {requested_datetime}</p>
            <p style="margin: 4px 0;"><strong>Goal:</strong> {marketing_goal}</p>
            <p style="margin: 4px 0;"><strong>Meet Link:</strong> Check your calendar invite</p>
          </div>
          <p>Cheers,<br/><strong>Tasha</strong> — Omni-Receptionist, Invisioned Marketing</p>
        </div>
        ```

   c. **Update Supabase** record to `status = 'dispatched'` with `gcal_event_id` and `gmail_draft_id`.

3. **Report** the results: how many dispatched, any failures.
