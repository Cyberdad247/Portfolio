from __future__ import annotations

import os


def require_env(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


def get_supabase_url() -> str:
    return require_env("SUPABASE_URL").rstrip("/")


def get_supabase_service_role_key() -> str:
    return require_env("SUPABASE_SERVICE_ROLE_KEY")


def get_supabase_jwt_secret() -> str:
    return require_env("SUPABASE_JWT_SECRET")
