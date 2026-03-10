from __future__ import annotations

from typing import Any

from app.repositories.review_decisions import ReviewDecisionRepository


class ReviewDecisionService:
    def __init__(
        self,
        repository: ReviewDecisionRepository | None = None,
    ) -> None:
        self.repository = repository or ReviewDecisionRepository()

    async def create(
        self,
        workflow_run_id: str,
        organization_id: str,
        reviewer_id: str,
        decision: str,
        notes: str | None = None,
    ) -> dict[str, Any]:
        return await self.repository.create(
            {
                "workflow_run_id": workflow_run_id,
                "organization_id": organization_id,
                "reviewer_id": reviewer_id,
                "decision": decision,
                "notes": notes,
            }
        )

    async def list_for_workflow(
        self,
        workflow_run_id: str,
    ) -> list[dict[str, Any]]:
        return await self.repository.list_for_workflow(workflow_run_id)
