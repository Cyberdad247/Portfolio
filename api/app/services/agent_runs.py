from __future__ import annotations

from typing import Any

from apps.camelot.schemas.objective import StatePacket

from app.repositories.agent_runs import AgentRunRepository

AGENT_NAME_BY_EVENT = {
    "workflow_created": "CamelotOrchestrator",
    "sense_completed": "Anya_Refined",
    "think_completed": "Strategos",
    "triage_completed": "Swarm",
    "merge_completed": "Lukas_Edge",
    "workflow_blocked": "CamelotOrchestrator",
}


class AgentRunService:
    def __init__(
        self,
        repository: AgentRunRepository | None = None,
    ) -> None:
        self.repository = repository or AgentRunRepository()

    async def record_event(
        self,
        workflow_run_id: str,
        packet: StatePacket,
        event: str,
    ) -> dict[str, Any]:
        return await self.repository.create(
            {
                "workflow_run_id": workflow_run_id,
                "organization_id": packet.envelope.org_id,
                "agent_name": AGENT_NAME_BY_EVENT.get(event, "CamelotOrchestrator"),
                "status": packet.state.value,
                "summary": event,
                "payload": {
                    "objective": packet.envelope.objective,
                    "mode": packet.envelope.mode,
                    "findings": packet.findings,
                    "tasks": packet.tasks,
                    "outputs": packet.outputs,
                    "flags": packet.flags,
                },
            }
        )

    async def list_for_workflow(
        self,
        workflow_run_id: str,
    ) -> list[dict[str, Any]]:
        return await self.repository.list_for_workflow(workflow_run_id)
