from __future__ import annotations

from typing import Any
from uuid import uuid4

from apps.camelot.schemas.objective import StatePacket

from app.repositories.workflow_runs import WorkflowRunRepository


class WorkflowRunService:
    def __init__(
        self,
        repository: WorkflowRunRepository | None = None,
    ) -> None:
        self.repository = repository or WorkflowRunRepository()

    async def create_for_objective(
        self,
        workflow_name: str,
        objective: str,
        org_id: str,
        created_by: str,
        review_required: bool = True,
    ) -> dict[str, Any]:
        workflow_run_id = str(uuid4())
        payload = {
            "id": workflow_run_id,
            "organization_id": org_id,
            "created_by": created_by,
            "workflow_name": workflow_name,
            "objective": objective,
            "state": "sense",
            "review_required": review_required,
            "metadata": {
                "source": "camelot_api",
                "history": [
                    {
                        "state": "sense",
                        "event": "workflow_created",
                    }
                ],
            },
        }
        return await self.repository.create(payload)

    async def sync_packet(
        self,
        workflow_run_id: str,
        packet: StatePacket,
        event: str,
    ) -> dict[str, Any] | None:
        persisted_run = await self.repository.get_by_id(workflow_run_id)
        metadata = dict(persisted_run.get("metadata") or {}) if persisted_run else {}
        history = list(metadata.get("history") or [])
        history.append(
            {
                "state": packet.state.value,
                "event": event,
                "flags": list(packet.flags),
            }
        )

        metadata.update(
            {
                "history": history,
                "findings": packet.findings,
                "tasks": packet.tasks,
                "outputs": packet.outputs,
                "mode": packet.envelope.mode,
                "target_url": packet.envelope.target_url,
            }
        )

        return await self.repository.update(
            workflow_run_id,
            {
                "state": packet.state.value,
                "metadata": metadata,
            },
        )

    async def get_run(
        self,
        workflow_run_id: str,
    ) -> dict[str, Any] | None:
        return await self.repository.get_by_id(workflow_run_id)

    async def list_for_org(
        self,
        org_id: str,
    ) -> list[dict[str, Any]]:
        return await self.repository.list_for_org(org_id)
