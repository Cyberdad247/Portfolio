from __future__ import annotations

from fastapi import APIRouter

router = APIRouter(prefix="/api/v1", tags=["agents"])


@router.get("/agents")
def get_agents() -> dict[str, list[dict[str, str]]]:
    return {
        "fleet": [
            {"id": "A-05", "name": "Oracle (PLAN)", "role": "Kernel Planner", "status": "active"},
            {"id": "A-06", "name": "Forge (CODE)", "role": "Kinetic Builder", "status": "processing"},
            {"id": "M-01", "name": "SEO Agent", "role": "Organic Growth", "status": "active"},
            {"id": "M-02", "name": "Content Agent", "role": "Narrative Strategy", "status": "active"},
            {"id": "M-03", "name": "Social Agent", "role": "Community Engagement", "status": "active"},
        ]
    }
