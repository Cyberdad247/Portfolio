from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class OrgContextUpdate(BaseModel):
    org_id: str
    branding: dict[str, Any]
    market_focus: list[str]


class ReviewDecisionCreate(BaseModel):
    workflow_run_id: str
    organization_id: str
    decision: str = Field(pattern="^(approved|rejected|changes_requested)$")
    notes: str | None = None
