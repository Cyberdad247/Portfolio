param(
	[string]$SupabaseMode = "cli",
	[string]$PostgresConnection = "",
	[switch]$SkipSql,
	[switch]$SkipFrontend,
	[switch]$SkipApi
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$sqlFiles = @(
	"infra\sql\001_auth_tenancy.sql",
	"infra\sql\002_profile_trigger.sql",
	"infra\sql\003_rls_helpers.sql",
	"infra\sql\004_rls_policies.sql",
	"infra\sql\005_seed_example.sql"
)

function Write-Step {
	param([string]$Message)
	Write-Host ""
	Write-Host "==> $Message" -ForegroundColor Cyan
}

function Invoke-SqlFile {
	param([string]$SqlPath)

	$absolutePath = Join-Path $repoRoot $SqlPath
	if (-not (Test-Path $absolutePath)) {
		throw "SQL file not found: $absolutePath"
	}

	switch ($SupabaseMode) {
		"cli" {
			$sql = Get-Content -Raw $absolutePath
			$sql | npx supabase@latest db query
		}
		"psql" {
			if (-not $PostgresConnection) {
				throw "PostgresConnection is required when SupabaseMode=psql."
			}

			& psql $PostgresConnection -f $absolutePath
			if ($LASTEXITCODE -ne 0) {
				throw "psql failed for $SqlPath"
			}
		}
		default {
			throw "Unsupported SupabaseMode: $SupabaseMode. Use 'cli' or 'psql'."
		}
	}
}

if (-not $SkipSql) {
	Write-Step "Applying Supabase SQL migrations"
	foreach ($sqlFile in $sqlFiles) {
		Write-Host "Running $sqlFile"
		Invoke-SqlFile -SqlPath $sqlFile
	}
}

if (-not $SkipFrontend) {
	Write-Step "Starting Next.js frontend"
	Start-Process powershell -ArgumentList @(
		"-NoExit",
		"-Command",
		"Set-Location '$repoRoot'; cmd /c npm run dev"
	) | Out-Null
}

if (-not $SkipApi) {
	Write-Step "Starting FastAPI backend"
	Start-Process powershell -ArgumentList @(
		"-NoExit",
		"-Command",
		"Set-Location '$repoRoot'; `$env:PYTHONPATH='.;api'; python -m uvicorn api.app.main:app --reload --host 127.0.0.1 --port 8001"
	) | Out-Null
}

Write-Step "Local test URLs"
Write-Host "Login:      http://localhost:3000/login"
Write-Host "Dashboard:  http://localhost:3000/dashboard"
Write-Host "Admin:      http://localhost:3000/admin"
Write-Host "API root:   http://127.0.0.1:8001/"

Write-Step "Example API calls"
Write-Host @"
Create workflow run:
curl -X POST http://127.0.0.1:8001/api/v1/objectives/pitch `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" `
  -H "Content-Type: application/json" `
  -d "{\"objective\":\"Launch Q2 growth push\",\"mode\":\"PITCH\",\"org_id\":\"YOUR_ORG_UUID\",\"context\":{}}"

Fetch workflow status:
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" `
  http://127.0.0.1:8001/api/v1/objectives/status/YOUR_WORKFLOW_RUN_ID
"@

Write-Step "Usage examples"
Write-Host @"
CLI mode:
.\scripts\start-supabase-auth-stack.ps1

psql mode:
.\scripts\start-supabase-auth-stack.ps1 -SupabaseMode psql -PostgresConnection "postgresql://postgres:PASSWORD@HOST:5432/postgres"

Start services only:
.\scripts\start-supabase-auth-stack.ps1 -SkipSql
"@
