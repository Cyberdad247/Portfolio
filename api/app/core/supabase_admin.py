from __future__ import annotations

from typing import Any

import httpx

from .settings import get_supabase_service_role_key, get_supabase_url


class SupabaseAdminClient:
    def __init__(self) -> None:
        service_role_key = get_supabase_service_role_key()
        self.base_url = f"{get_supabase_url()}/rest/v1"
        self.headers = {
            "apikey": service_role_key,
            "Authorization": f"Bearer {service_role_key}",
        }

    async def fetch_profile_role(self, user_id: str) -> str | None:
        row = await self.fetch_one(
            "profiles",
            params={
                "select": "system_role",
                "id": f"eq.{user_id}",
            },
        )
        if not row:
            return None
        return row.get("system_role")

    async def fetch_membership_role(self, user_id: str, org_id: str) -> str | None:
        row = await self.fetch_one(
            "organization_members",
            params={
                "select": "role",
                "user_id": f"eq.{user_id}",
                "organization_id": f"eq.{org_id}",
            },
        )
        if not row:
            return None
        return row.get("role")

    async def fetch_one(
        self,
        table: str,
        params: dict[str, str],
    ) -> dict[str, Any] | None:
        rows = await self.fetch_many(table=table, params={**params, "limit": "1"})
        if not rows:
            return None
        return rows[0]

    async def fetch_many(
        self,
        table: str,
        params: dict[str, str],
    ) -> list[dict[str, Any]]:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{self.base_url}/{table}",
                headers=self.headers,
                params=params,
            )
            response.raise_for_status()

        payload = response.json()
        if isinstance(payload, list):
            return payload
        return []

    async def insert_one(
        self,
        table: str,
        payload: dict[str, Any],
    ) -> dict[str, Any]:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{self.base_url}/{table}",
                headers={
                    **self.headers,
                    "Prefer": "return=representation",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
            response.raise_for_status()

        rows = response.json()
        if not rows:
            raise RuntimeError(f"Insert into {table} returned no rows")
        return rows[0]

    async def update_one(
        self,
        table: str,
        match: dict[str, str],
        payload: dict[str, Any],
    ) -> dict[str, Any] | None:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.patch(
                f"{self.base_url}/{table}",
                headers={
                    **self.headers,
                    "Prefer": "return=representation",
                    "Content-Type": "application/json",
                },
                params=match,
                json=payload,
            )
            response.raise_for_status()

        rows = response.json()
        if not rows:
            return None
        return rows[0]
