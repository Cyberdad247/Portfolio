from enum import Enum
from pydantic import BaseModel, Field
from typing import Any, List, Dict, Optional

class CampaignState(str, Enum):
    SENSE = "sense"
    THINK = "think"
    TRIAGE = "triage"
    MERGE = "merge"
    COMPLETE = "complete"
    BLOCKED = "blocked"

class ObjectiveEnvelope(BaseModel):
    objective: str
    mode: str
    org_id: str
    target_url: Optional[str] = None
    context: Dict[str, Any] = Field(default_factory=dict)

class StatePacket(BaseModel):
    state: CampaignState
    envelope: ObjectiveEnvelope
    findings: Dict[str, Any] = Field(default_factory=dict)
    tasks: List[Dict[str, Any]] = Field(default_factory=list)
    outputs: Dict[str, Any] = Field(default_factory=dict)
    flags: List[str] = Field(default_factory=list)

class AgentTask(BaseModel):
    id: str
    agent_id: str
    command: str
    params: Dict[str, Any] = Field(default_factory=dict)
    status: str = "pending"
    result: Optional[str] = None
