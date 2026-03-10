from __future__ import annotations

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.core.auth import AuthenticatedUser, verify_supabase_token

router = APIRouter(prefix="/api/v1", tags=["audit"])


class AuditRequest(BaseModel):
    target_url: str
    deep_scan: bool = False


@router.post("/audit/seo-geo")
async def run_seo_geo_audit(
    request: AuditRequest,
    user: AuthenticatedUser = Depends(verify_supabase_token),
) -> dict[str, str]:
    return {
        "status": "audit_queued",
        "target": request.target_url,
        "engine": "Lady Apis",
        "requested_by": user.id,
    }
