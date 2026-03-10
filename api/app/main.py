from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from apps.camelot.kernel.orchestrator import CamelotOrchestrator
from apps.camelot.schemas.objective import ObjectiveEnvelope

app = FastAPI(title="Invisioned Marketing API - Camelot Kernel v1.0")

# Instantiate the singleton orchestrator
orchestrator = CamelotOrchestrator()

@app.get("/")
def root():
    return {"status": "ok", "system": "CAMELOT_APEX_OS_v209.0", "active_bridge": "Vercel MCP"}

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

@app.get("/api/v1/objectives/status/{packet_id}")
async def get_packet_status(packet_id: str):
    if packet_id not in orchestrator.state_packets:
        raise HTTPException(status_code=404, detail="Objective packet not found")
    return orchestrator.state_packets[packet_id]

@app.get("/api/v1/agents")
def get_agents():
    return {
        "fleet": [
            {"id": "A-05", "name": "Oracle (PLAN)", "role": "Kernel Planner"},
            {"id": "A-06", "name": "Forge (CODE)", "role": "Kinetic Builder"},
            {"id": "M-01", "name": "SEO Agent", "role": "Organic Growth"},
            {"id": "M-02", "name": "Content Agent", "role": "Narrative Strategy"},
            {"id": "M-03", "name": "Social Agent", "role": "Community Engagement"}
        ]
    }
