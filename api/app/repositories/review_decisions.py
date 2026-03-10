from __future__ import annotations

from typing import Any

from app.core.supabase_admin import SupabaseAdminClient


class ReviewDecisionRepository:
    def __init__(self, admin_client: SupabaseAdminClient | None = None) -> None:
        self.admin_client = admin_client or SupabaseAdminClient()

    async def create(
        self,
        payload: dict[str, Any],
    ) -> dict[str, Any]:
        return await self.admin_client.insert_one("review_decisions", payload)

    async def list_for_workflow(
        self,
        workflow_run_id: str,
    ) -> list[dict[str, Any]]:
        return await self.admin_client.fetch_many(
            "review_decisions",
            params={
                "select": "id,workflow_run_id,organization_id,reviewer_id,decision,notes,created_at",
                "workflow_run_id": f"eq.{workflow_run_id}",
                "order": "created_at.asc",
            },
        )
