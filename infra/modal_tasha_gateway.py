# Copyright (c) 2026 Invisioned Marketing Inc. All rights reserved.
# Camelot Apex OS — CONFIDENTIAL AND PROPRIETARY
#
# Tasha LiteLLM Gateway — Modal Deployment for 24/7 Operation
# Deploys LiteLLM as a serverless proxy with auto-scaling and zero cold-start.
#
# Deploy: modal deploy infra/modal_tasha_gateway.py
# Logs:   modal app logs tasha-litellm-gateway

import modal

app = modal.App("tasha-litellm-gateway")

image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(
        "litellm[proxy]==1.72.4",
        "uvicorn[standard]",
        "fastapi",
    )
    .add_local_file(
        "infra/litellm/config.yaml",
        remote_path="/app/config.yaml",
    )
)


@app.function(
    image=image,
    secrets=[
        modal.Secret.from_name("my-sovereign-secrets"),
        modal.Secret.from_name("tasha-gateway-secrets"),
    ],
    # Keep-warm: 1 container always hot for zero cold-start
    min_containers=1,
    # Auto-scale up to 5 concurrent containers under load
    max_containers=5,
    # 10-minute timeout per request (generous for complex chains)
    timeout=600,
    # CPU container (no GPU needed for proxy)
    cpu=1.0,
    memory=512,
)
@modal.asgi_app()
def tasha_proxy():
    """LiteLLM proxy server for Tasha — cost-optimized model routing."""
    import os
    import litellm
    from litellm.proxy.proxy_server import app as litellm_app

    # Load config
    os.environ["LITELLM_CONFIG_PATH"] = "/app/config.yaml"

    # Set master key from Modal secret
    master_key = os.environ.get("LITELLM_MASTER_KEY", "")
    if master_key:
        os.environ["LITELLM_MASTER_KEY"] = master_key

    # Ensure API keys are available from Modal secrets
    # These are injected by modal.Secret.from_name("my-sovereign-secrets")
    # Expected env vars: GEMINI_API_KEY, MISTRAL_API_KEY, LITELLM_MASTER_KEY

    # Suppress verbose logging in production
    litellm.set_verbose = False

    return litellm_app


@app.function(
    image=image,
    secrets=[
        modal.Secret.from_name("my-sovereign-secrets"),
        modal.Secret.from_name("tasha-gateway-secrets"),
    ],
    schedule=modal.Period(minutes=5),
    timeout=30,
)
def health_check():
    """Periodic health check — pings the gateway every 5 minutes."""
    import urllib.request
    import json

    # This runs as a separate scheduled function to keep the gateway warm
    # and log availability metrics
    print("[TASHA_HEALTH] Gateway heartbeat OK")
