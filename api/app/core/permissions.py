from __future__ import annotations

import os
from typing import Any

from fastapi import HTTPException, status

from .auth import AuthenticatedUser
from .supabase_admin import SupabaseAdminClient
from .roles import CLIENT_MEMBER_ROLES, INTERNAL_ROLES

SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")


async def assert_org_access(
    user: AuthenticatedUser,
    org_id: str,
    allowed_roles: set[str] | None = None,
) -> dict[str, Any]:
    if not user.id or not org_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Missing org authorization context",
        )

    allowed = allowed_roles or CLIENT_MEMBER_ROLES
    try:
        admin_client = SupabaseAdminClient()
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc

    system_role = await admin_client.fetch_profile_role(user.id)
    if system_role in INTERNAL_ROLES:
        return {"system_role": system_role, "membership_role": system_role}

    membership_role = await admin_client.fetch_membership_role(user.id, org_id)
    if not membership_role:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Organization membership not found",
        )

    if membership_role not in allowed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient role for this organization",
        )

    return {"system_role": system_role, "membership_role": membership_role}
