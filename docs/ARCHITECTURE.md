# Tasha System Architecture // Zero-Burn Lattice

## Stack Overview

| Layer | Component | Role |
|---|---|---|
| Voice I/O | PersonaPlex + Web Speech API | Full-duplex audio, barge-in support |
| Neural Core | CLIProxyAPI (LiteLLM) | Free inference gateway on localhost:8080 |
| LLM Cascade | Ollama (Qwen 3.5) -> Mistral -> Gemini | Zero-cost with cloud fallback |
| Orchestrator | Mastra (TypeScript) | Workflow state machine + tool calling |
| Router | Nanobot-Custom Pattern | Multi-model routing + anti-hallucination |
| Database | SpacetimeDB + Supabase | In-memory speed + cloud persistence |
| Memory | NotebookLM MCP | Long-term company context retrieval |
| Back-Office | Agency-Agents | Post-call lead processing swarm |
| Calendar | Google Calendar MCP | Real calendar event creation |
| Email | Gmail MCP | Confirmation email dispatch |

## Data Flow Diagram

```mermaid
graph TD
    classDef user fill:#1e1e1e,stroke:#f1c40f,stroke-width:2px,color:#fff;
    classDef ethereal fill:#8e44ad,stroke:#fff,stroke-width:2px,color:#fff;
    classDef logic fill:#2980b9,stroke:#fff,stroke-width:2px,color:#fff;
    classDef memory fill:#16a085,stroke:#fff,stroke-width:2px,color:#fff;
    classDef kinetic fill:#27ae60,stroke:#fff,stroke-width:2px,color:#fff;
    classDef error fill:#c0392b,stroke:#fff,stroke-width:2px,color:#fff;

    User((Client Voice)):::user <-->|Full-Duplex Audio| PersonaPlex[PersonaPlex: Tasha Voice Node]:::ethereal

    PersonaPlex --> |Text/Intent Handoff| Mastra[Mastra: TS Workflow Orchestrator]:::logic

    subgraph "The Neural Core - Zero-Burn"
        Mastra <--> Router[Nanobot Router]:::logic
        Router <--> CLIProxy[CLIProxyAPI: LiteLLM on :8080]:::logic
        CLIProxy --> Ollama[Ollama: Qwen 3.5 Local]:::logic
        CLIProxy -.-> |Fallback 1| Mistral[Mistral API]:::logic
        CLIProxy -.-> |Fallback 2| Gemini[Gemini API]:::logic
    end

    subgraph "Kinetic Hands and Memory"
        Mastra --> |1. Save Lead| SpacetimeDB[(SpacetimeDB)]:::kinetic
        Mastra --> |1b. Persist| Supabase[(Supabase)]:::kinetic
        Mastra --> |2. Book Call| GCal[Google Calendar MCP]:::kinetic
        Mastra --> |2b. Confirm| Gmail[Gmail MCP]:::kinetic
        Mastra <--> |3. Context| NotebookLM[NotebookLM MCP]:::memory
    end

    subgraph "Self-Healing Loop"
        SpacetimeDB --> ValidateDB{Schema Valid?}
        ValidateDB -->|No| Lint[Sir Justicar: Auto-Fix]:::error
        Lint --> SpacetimeDB
        GCal --> ValidateAPI{API 200?}
        ValidateAPI -->|No| Fallback[Human Agent Routing]:::error
    end

    subgraph "Post-Call Back-Office"
        Supabase --> AgencyAgents[Agency-Agents Swarm]:::kinetic
        AgencyAgents --> Assets[Generate Marketing Assets]:::kinetic
    end
```

## LLM Cascade (Zero-Cost Priority)

```
Request -> CLIProxyAPI (:8080)
  |-> Ollama/Qwen 3.5 4B (local, free, ~200ms)
  |-> Mistral Small (cloud, free tier)
  |-> Gemini 2.0 Flash (cloud, free tier)
```

## Key Endpoints

| Endpoint | Purpose |
|---|---|
| `localhost:8080/v1/chat/completions` | CLIProxyAPI (LiteLLM) |
| `localhost:11434/v1` | Ollama direct |
| `/api/tasha/chat` | Tasha orchestrator |
| `/api/ai/proxy` | Client-side LLM proxy |
| `/api/receptionist/lead` | Lead capture |
| `/api/receptionist/schedule` | Scheduling queue |

## Starting the Stack

```bash
# 1. Start CLIProxyAPI (Ollama + LiteLLM)
./infra/litellm/start.sh    # or start.bat on Windows

# 2. Start Next.js
npm run dev

# 3. Visit /onboarding to talk to Tasha
```
