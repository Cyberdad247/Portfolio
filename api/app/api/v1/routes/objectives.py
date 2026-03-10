from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from apps.camelot.kernel.orchestrator import CamelotOrchestrator
from apps.camelot.schemas.objective import ObjectiveEnvelope

from app.core.auth import AuthenticatedUser, verify_supabase_token
from app.core.permissions import assert_org_access
from app.core.roles import CLIENT_ADMIN_ROLES, CLIENT_MEMBER_ROLES
from app.schemas.requests import OrgContextUpdate, ReviewDecisionCreate
from app.services.agent_runs import AgentRunService
from app.services.review_decisions import ReviewDecisionService
from app.services.workflow_runs import WorkflowRunService

router = APIRouter(prefix="/api/v1", tags=["objectives"])

workflow_run_service = WorkflowRunService()
agent_run_service = AgentRunService()
review_decision_service = ReviewDecisionService()


async def _persist_packet_created(packet_id: str, packet) -> None:
    await workflow_run_service.sync_packet(packet_id, packet, event="workflow_created")
    await agent_run_service.record_event(packet_id, packet, event="workflow_created")


async def _persist_packet_updated(packet_id: str, packet, event: str) -> None:
    await workflow_run_service.sync_packet(packet_id, packet, event=event)
    await agent_run_service.record_event(packet_id, packet, event=event)


orchestrator = CamelotOrchestrator(
    on_packet_created=lambda packet_id, packet: _persist_packet_created(packet_id, packet),
    on_packet_updated=lambda packet_id, packet, event: _persist_packet_updated(
        packet_id, packet, event
    ),
)


async def _start_workflow(
    workflow_name: str,
    envelope: ObjectiveEnvelope,
    user: AuthenticatedUser,
) -> dict[str, str]:
    await assert_org_access(
        user=user,
        org_id=envelope.org_id,
        allowed_roles=CLIENT_MEMBER_ROLES,
    )
    envelope.mode = workflow_name

    workflow_run = await workflow_run_service.create_for_objective(
        workflow_name=workflow_name,
        objective=envelope.objective,
        org_id=envelope.org_id,
        created_by=user.id,
    )
    packet_id = await orchestrator.initiate_objective(
        envelope,
        packet_id=workflow_run["id"],
    )

    return {
        "status": "SENSE_INITIATED",
        "packet_id": packet_id,
        "workflow_run_id": workflow_run["id"],
        "mode": workflow_name,
    }


@router.post("/objectives/pitch")
async def initiate_pitch(
    envelope: ObjectiveEnvelope,
    user: AuthenticatedUser = Depends(verify_supabase_token),
) -> dict[str, str]:
    return await _start_workflow("PITCH", envelope, user)


@router.post("/objectives/optimize-portfolio")
async def optimize_portfolio(
    envelope: ObjectiveEnvelope,
    user: AuthenticatedUser = Depends(verify_supabase_token),
) -> dict[str, str]:
    return await _start_workflow("OPTIMIZE_PORTFOLIO", envelope, user)


@router.post("/objectives/swarm-campaign")
async def swarm_campaign(
    envelope: ObjectiveEnvelope,
    user: AuthenticatedUser = Depends(verify_supabase_token),
) -> dict[str, str]:
    return await _start_workflow("SWARM_CAMPAIGN", envelope, user)


@router.post("/org/context")
async def update_org_context(
    update: OrgContextUpdate,
    user: AuthenticatedUser = Depends(verify_supabase_token),
) -> dict[str, str]:
    await assert_org_access(
        user=user,
        org_id=update.org_id,
        allowed_roles=CLIENT_ADMIN_ROLES,
    )
    return {"status": "context_updated", "org_id": update.org_id}


@router.get("/objectives/status/{packet_id}")
async def get_packet_status(
    packet_id: str,
    user: AuthenticatedUser = Depends(verify_supabase_token),
) -> dict:
    workflow_run = await workflow_run_service.get_run(packet_id)
    if workflow_run:
        await assert_org_access(
            user=user,
            org_id=workflow_run["organization_id"],
            allowed_roles=CLIENT_MEMBER_ROLES,
        )
        in_memory_packet = orchestrator.state_packets.get(packet_id)
        if in_memory_packet:
            return {
                "id": workflow_run["id"],
                "state": in_memory_packet.state.value,
                "workflow_name": workflow_run["workflow_name"],
                "objective": workflow_run["objective"],
                "organization_id": workflow_run["organization_id"],
                "metadata": workflow_run["metadata"],
                "agent_runs": await agent_run_service.list_for_workflow(packet_id),
                "review_decisions": await review_decision_service.list_for_workflow(packet_id),
                "packet": in_memory_packet.model_dump(),
            }

        return {
            **workflow_run,
            "agent_runs": await agent_run_service.list_for_workflow(packet_id),
            "review_decisions": await review_decision_service.list_for_workflow(packet_id),
        }

    raise HTTPException(status_code=404, detail="Objective packet not found")


@router.get("/organizations/{org_id}/workflow-runs")
async def list_workflow_runs(
    org_id: str,
    user: AuthenticatedUser = Depends(verify_supabase_token),
) -> dict[str, list[dict]]:
    await assert_org_access(
        user=user,
        org_id=org_id,
        allowed_roles=CLIENT_MEMBER_ROLES,
    )
    return {"workflow_runs": await workflow_run_service.list_for_org(org_id)}


@router.get("/objectives/{workflow_run_id}/agent-runs")
async def list_agent_runs(
    workflow_run_id: str,
    user: AuthenticatedUser = Depends(verify_supabase_token),
) -> dict[str, list[dict]]:
    workflow_run = await workflow_run_service.get_run(workflow_run_id)
    if not workflow_run:
        raise HTTPException(status_code=404, detail="Workflow run not found")

    await assert_org_access(
        user=user,
        org_id=workflow_run["organization_id"],
        allowed_roles=CLIENT_MEMBER_ROLES,
    )
    return {"agent_runs": await agent_run_service.list_for_workflow(workflow_run_id)}


@router.get("/objectives/{workflow_run_id}/review-decisions")
async def list_review_decisions(
    workflow_run_id: str,
    user: AuthenticatedUser = Depends(verify_supabase_token),
) -> dict[str, list[dict]]:
    workflow_run = await workflow_run_service.get_run(workflow_run_id)
    if not workflow_run:
        raise HTTPException(status_code=404, detail="Workflow run not found")

    await assert_org_access(
        user=user,
        org_id=workflow_run["organization_id"],
        allowed_roles=CLIENT_MEMBER_ROLES,
    )
    return {
        "review_decisions": await review_decision_service.list_for_workflow(
            workflow_run_id
        )
    }


@router.post("/review-decisions")
async def create_review_decision(
    payload: ReviewDecisionCreate,
    user: AuthenticatedUser = Depends(verify_supabase_token),
) -> dict:
    workflow_run = await workflow_run_service.get_run(payload.workflow_run_id)
    if not workflow_run:
        raise HTTPException(status_code=404, detail="Workflow run not found")

    if workflow_run["organization_id"] != payload.organization_id:
        raise HTTPException(status_code=400, detail="Organization mismatch")

    await assert_org_access(
        user=user,
        org_id=payload.organization_id,
        allowed_roles=CLIENT_ADMIN_ROLES,
    )

    review_decision = await review_decision_service.create(
        workflow_run_id=payload.workflow_run_id,
        organization_id=payload.organization_id,
        reviewer_id=user.id,
        decision=payload.decision,
        notes=payload.notes,
    )
    return review_decision
