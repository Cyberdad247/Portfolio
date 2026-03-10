from __future__ import annotations

from typing import Any

from app.core.supabase_admin import SupabaseAdminClient


class AgentRunRepository:
    def __init__(self, admin_client: SupabaseAdminClient | None = None) -> None:
        self.admin_client = admin_client or SupabaseAdminClient()

    async def create(
        self,
        payload: dict[str, Any],
    ) -> dict[str, Any]:
        return await self.admin_client.insert_one("agent_runs", payload)

    async def list_for_workflow(
        self,
        workflow_run_id: str,
    ) -> list[dict[str, Any]]:
        return await self.admin_client.fetch_many(
            "agent_runs",
            params={
                "select": "id,workflow_run_id,organization_id,agent_name,status,summary,payload,created_at",
                "workflow_run_id": f"eq.{workflow_run_id}",
                "order": "created_at.asc",
            },
        )
