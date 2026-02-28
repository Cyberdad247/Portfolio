# Invisioned Portfolio

**Intelligent Marketing & Strategic Design // 2026**

---

## Technical Stack

- **Framework**: Next.js 15 (Turbopack)
- **Styling**: Tailwind CSS 4, Framer Motion
- **Quality**: Biome (Linting/Formatting), TypeScript (Strict)
- **CI/CD**: GitHub Actions, Vercel Production

## Key Features

- **Lady Reception Onboarding**: Conversational AI-style business onboarding flow.
- **Agentic Dashboard**: Real-time project visualization and tracking.
- **Vibe Engine**: Integrated brand aesthetic management.

## Deployment Strategy

- Every push to `main` triggers:
  1. `typecheck` (tsc)
  2. `lint:strict` (biome)
  3. `build` (next)
- Successful runs deploy instantly to **<https://invisionedmarketing.vercel.app>**
