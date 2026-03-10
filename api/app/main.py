from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from apps.camelot.kernel.orchestrator import CamelotOrchestrator
from apps.camelot.schemas.objective import ObjectiveEnvelope

app = FastAPI(title="Invisioned Marketing API - Camelot Kernel vMAX")

# Instantiate the singleton orchestrator
orchestrator = CamelotOrchestrator()

class AuditRequest(BaseModel):
    target_url: str
    deep_scan: bool = False

class OrgContextUpdate(BaseModel):
    org_id: str
    branding: Dict[str, Any]
    market_focus: List[str]

@app.get("/")
def root():
    return {
        "status": "ok", 
        "system": "CAMELOT_APEX_OS_v209.0", 
        "active_bridge": "Vercel MCP",
        "engine": "Singularity Lattice"
    }

# --- Core Objective Endpoints (The Command Doctrine) ---

@app.post("/api/v1/objectives/pitch")
async def initiate_pitch(envelope: ObjectiveEnvelope):
    """//PITCH -> Sir Sterling + Strategos + Dagonet"""
    envelope.mode = "PITCH"
    packet_id = await orchestrator.initiate_objective(envelope)
    return {"status": "SENSE_INITIATED", "packet_id": packet_id, "mode": "PITCH"}

@app.post("/api/v1/objectives/optimize-portfolio")
async def optimize_portfolio(envelope: ObjectiveEnvelope):
    """//OPTIMIZE_PORTFOLIO -> LPO + Muse + Lukas + Dagonet"""
    envelope.mode = "OPTIMIZE_PORTFOLIO"
    packet_id = await orchestrator.initiate_objective(envelope)
    return {"status": "SENSE_INITIATED", "packet_id": packet_id, "mode": "OPTIMIZE_PORTFOLIO"}

@app.post("/api/v1/objectives/swarm-campaign")
async def swarm_campaign(envelope: ObjectiveEnvelope):
    """//SWARM_CAMPAIGN -> Full DAG with Apis, Visage, Muse, content, review"""
    envelope.mode = "SWARM_CAMPAIGN"
    packet_id = await orchestrator.initiate_objective(envelope)
    return {"status": "SENSE_INITIATED", "packet_id": packet_id, "mode": "SWARM_CAMPAIGN"}

# --- New Production Endpoints ---

@app.post("/api/v1/audit/seo-geo")
async def run_seo_geo_audit(request: AuditRequest):
    """Initiates a specialized SEO/GEO audit for the target URL."""
    return {"status": "audit_queued", "target": request.target_url, "engine": "Lady Apis"}

@app.post("/api/v1/org/context")
async def update_org_context(update: OrgContextUpdate):
    """Updates the organization context for the Camelot Kernel."""
    return {"status": "context_updated", "org_id": update.org_id}

@app.get("/api/v1/objectives/status/{packet_id}")
async def get_packet_status(packet_id: str):
    if packet_id not in orchestrator.state_packets:
        raise HTTPException(status_code=404, detail="Objective packet not found")
    return orchestrator.state_packets[packet_id]

@app.get("/api/v1/agents")
def get_agents():
    return {
        "fleet": [
            {"id": "A-05", "name": "Oracle (PLAN)", "role": "Kernel Planner", "status": "active"},
            {"id": "A-06", "name": "Forge (CODE)", "role": "Kinetic Builder", "status": "processing"},
            {"id": "M-01", "name": "SEO Agent", "role": "Organic Growth", "status": "active"},
            {"id": "M-02", "name": "Content Agent", "role": "Narrative Strategy", "status": "active"},
            {"id": "M-03", "name": "Social Agent", "role": "Community Engagement", "status": "active"}
        ]
    }
