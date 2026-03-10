param(
	[string]$SupabaseMode = "cli",
	[string]$PostgresConnection = "",
	[switch]$SkipSql,
	[switch]$SkipFrontend,
	[switch]$SkipApi
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot

function Write-Step {
	param([string]$Message)
	Write-Host ""
	Write-Host "==> $Message" -ForegroundColor Cyan
}

Write-Step "Bootstrapping VaShawn Head as first super admin"

if (-not $SkipSql) {
	Write-Step "Applying SQL migrations"
	& (Join-Path $PSScriptRoot "start-supabase-auth-stack.ps1") `
		-SupabaseMode $SupabaseMode `
		-PostgresConnection $PostgresConnection `
		-SkipFrontend `
		-SkipApi

	if ($LASTEXITCODE -ne 0) {
		throw "Failed while applying SQL migrations."
	}
}

Write-Step "Creating org membership"
	& (Join-Path $PSScriptRoot "create-first-org-member.ps1") `
		-Email "vizion711@gmail.com" `
		-FullName "VaShawn Head" `
		-OrganizationName "VaShawn Head" `
		-OrganizationSlug "vashawn-head" `
		-Role "client_admin"

if ($LASTEXITCODE -ne 0) {
	throw "Failed while creating the first org membership."
}

Write-Step "Promoting profile to super_admin"
& (Join-Path $PSScriptRoot "promote-super-admin.ps1") `
	-Email "vizion711@gmail.com" `
	-SystemRole "super_admin"

if ($LASTEXITCODE -ne 0) {
	throw "Failed while promoting the profile to super_admin."
}

if (-not $SkipFrontend -or -not $SkipApi) {
	Write-Step "Starting local services"
	& (Join-Path $PSScriptRoot "start-supabase-auth-stack.ps1") `
		-SupabaseMode $SupabaseMode `
		-PostgresConnection $PostgresConnection `
		-SkipSql `
		-SkipFrontend:$SkipFrontend `
		-SkipApi:$SkipApi

	if ($LASTEXITCODE -ne 0) {
		throw "Failed while starting local services."
	}
}

Write-Step "Bootstrap complete"
Write-Host "Email:      vizion711@gmail.com"
Write-Host "Full name:  VaShawn Head"
Write-Host "Org slug:   vashawn-head"
Write-Host "System role: super_admin"
Write-Host ""
Write-Host "Next:"
Write-Host "1. Sign in at http://localhost:3000/login"
Write-Host "2. Open http://localhost:3000/dashboard"
Write-Host "3. Open http://localhost:3000/admin"
