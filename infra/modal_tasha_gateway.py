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
        "pyyaml",
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
    # Keep-warm: 0 = cost saver (cold-start ~2-3s), set to 1 for live demos
    min_containers=0,
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
    import yaml
    from fastapi import FastAPI, Request
    from fastapi.responses import JSONResponse
    import litellm
    from litellm import Router

    litellm.set_verbose = False
    litellm.drop_params = True

    # Normalize API key env var names (Modal secrets may use different names)
    if os.environ.get("GOOGLE_API_KEY") and not os.environ.get("GEMINI_API_KEY"):
        os.environ["GEMINI_API_KEY"] = os.environ["GOOGLE_API_KEY"]
    litellm.num_retries = 2
    litellm.request_timeout = 30

    # Load config and build router
    with open("/app/config.yaml") as f:
        config = yaml.safe_load(f)

    model_list = config.get("model_list", [])
    # Strip local-only models (Ollama won't be reachable from Modal)
    # and resolve os.environ/ references to actual env vars
    cloud_models = []
    for m in model_list:
        params = m.get("litellm_params", {})
        if "ollama" in params.get("model", ""):
            continue
        # Resolve os.environ/VAR_NAME to actual env var values
        for key, val in params.items():
            if isinstance(val, str) and val.startswith("os.environ/"):
                env_name = val.split("/", 1)[1]
                params[key] = os.environ.get(env_name, "")
        cloud_models.append(m)

    fallback_cfg = config.get("litellm_settings", {}).get("fallbacks", [])

    router = Router(
        model_list=cloud_models,
        fallbacks=[{"gemini-cloud": ["mistral-small-latest"]}],
        num_retries=2,
        timeout=30,
    )

    gateway = FastAPI(title="Tasha LiteLLM Gateway")
    master_key = os.environ.get("LITELLM_MASTER_KEY", "")

    @gateway.get("/health/liveliness")
    async def health():
        return "I'm alive!"

    @gateway.get("/v1/models")
    async def list_models():
        models = [
            {
                "id": m["model_name"],
                "object": "model",
                "owned_by": "tasha-gateway",
            }
            for m in cloud_models
        ]
        return {"data": models, "object": "list"}

    @gateway.post("/v1/chat/completions")
    async def chat_completions(request: Request):
        # Auth check
        auth = request.headers.get("Authorization", "")
        if master_key and auth != f"Bearer {master_key}":
            return JSONResponse(
                {"error": {"message": "Invalid API key", "type": "auth_error"}},
                status_code=401,
            )

        data = await request.json()
        model = data.pop("model", "gemini-cloud")
        messages = data.pop("messages", [])

        try:
            response = await router.acompletion(
                model=model,
                messages=messages,
                **{k: v for k, v in data.items() if k in (
                    "temperature", "max_tokens", "stream", "top_p",
                )},
            )
            return response.model_dump()
        except Exception as e:
            return JSONResponse(
                {"error": {"message": str(e), "type": "server_error"}},
                status_code=500,
            )

    return gateway


@app.function(
    image=image,
    secrets=[
        modal.Secret.from_name("my-sovereign-secrets"),
        modal.Secret.from_name("tasha-gateway-secrets"),
    ],
    # Uncomment schedule for always-warm mode (adds ~$0.50/day)
    # schedule=modal.Period(minutes=5),
    timeout=30,
)
def health_check():
    """Health check — uncomment schedule above for always-warm mode."""
    print("[TASHA_HEALTH] Gateway heartbeat OK")
