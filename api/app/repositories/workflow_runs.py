from __future__ import annotations

from typing import Any

from app.core.supabase_admin import SupabaseAdminClient


class WorkflowRunRepository:
    def __init__(self, admin_client: SupabaseAdminClient | None = None) -> None:
        self.admin_client = admin_client or SupabaseAdminClient()

    async def create(
        self,
        payload: dict[str, Any],
    ) -> dict[str, Any]:
        return await self.admin_client.insert_one("workflow_runs", payload)

    async def update(
        self,
        workflow_run_id: str,
        payload: dict[str, Any],
    ) -> dict[str, Any] | None:
        return await self.admin_client.update_one(
            "workflow_runs",
            match={"id": f"eq.{workflow_run_id}"},
            payload=payload,
        )

    async def get_by_id(
        self,
        workflow_run_id: str,
    ) -> dict[str, Any] | None:
        return await self.admin_client.fetch_one(
            "workflow_runs",
            params={
                "select": "id,organization_id,created_by,workflow_name,objective,state,review_required,metadata,created_at,updated_at",
                "id": f"eq.{workflow_run_id}",
            },
        )

    async def list_for_org(
        self,
        org_id: str,
    ) -> list[dict[str, Any]]:
        return await self.admin_client.fetch_many(
            "workflow_runs",
            params={
                "select": "id,organization_id,created_by,workflow_name,objective,state,review_required,metadata,created_at,updated_at",
                "organization_id": f"eq.{org_id}",
                "order": "created_at.desc",
            },
        )
