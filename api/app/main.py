from fastapi import FastAPI
from dotenv import load_dotenv
import os

# Explicitly load from the directory where this script is or relative to CWD
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

from app.api.v1.routes.agents import router as agents_router
from app.api.v1.routes.audit import router as audit_router
from app.api.v1.routes.objectives import router as objectives_router

app = FastAPI(title="Invisioned Marketing API - Camelot Kernel vMAX")


@app.get("/")
def root() -> dict[str, str]:
    return {
        "status": "ok",
        "system": "CAMELOT_APEX_OS_v209.0",
        "active_bridge": "Vercel MCP",
        "engine": "Singularity Lattice",
    }


app.include_router(objectives_router)
app.include_router(audit_router)
app.include_router(agents_router)
