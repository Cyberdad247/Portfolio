from __future__ import annotations

import json
import os
import time
from dataclasses import dataclass
from typing import Any

import httpx
import jwt
from fastapi import Header, HTTPException, status
from jwt import algorithms

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")
JWKS_TTL_SECONDS = int(os.getenv("SUPABASE_JWKS_TTL_SECONDS", "3600"))

_jwks_cache: dict[str, Any] = {"expires_at": 0.0, "keys": []}


@dataclass(slots=True)
class AuthenticatedUser:
    id: str
    email: str | None
    raw_token: str
    claims: dict[str, Any]


def _issuer() -> str:
    if not SUPABASE_URL:
        raise RuntimeError("SUPABASE_URL is not configured")
    return f"{SUPABASE_URL}/auth/v1"


async def _get_jwks() -> list[dict[str, Any]]:
    now = time.time()
    if _jwks_cache["keys"] and _jwks_cache["expires_at"] > now:
        return _jwks_cache["keys"]

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(f"{_issuer()}/.well-known/jwks.json")
        response.raise_for_status()
        payload = response.json()

    keys = payload.get("keys", [])
    if not keys:
        raise RuntimeError("Supabase JWKS response did not include any signing keys")

    _jwks_cache["keys"] = keys
    _jwks_cache["expires_at"] = now + JWKS_TTL_SECONDS
    return keys


async def verify_supabase_token(
    authorization: str | None = Header(default=None),
) -> AuthenticatedUser:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
        )

    token = authorization.removeprefix("Bearer ").strip()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
        )

    try:
        if SUPABASE_JWT_SECRET:
            claims = jwt.decode(
                token,
                SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated",
                issuer=_issuer(),
            )
        else:
            jwks = await _get_jwks()
            header = jwt.get_unverified_header(token)
            kid = header.get("kid")
            jwk = next((key for key in jwks if key.get("kid") == kid), None)
            if not jwk:
                raise ValueError("Signing key not found for token")

            signing_key = algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk))
            claims = jwt.decode(
                token,
                signing_key,
                algorithms=["RS256"],
                audience="authenticated",
                issuer=_issuer(),
            )
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        ) from exc

    user_id = claims.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing subject",
        )

    return AuthenticatedUser(
        id=user_id,
        email=claims.get("email"),
        raw_token=token,
        claims=claims,
    )
