param(
	[string]$Email = "vizion711@gmail.com",
	[string]$SystemRole = "super_admin"
)

$ErrorActionPreference = "Stop"

if ($SystemRole -notin @("super_admin", "operator", "client_admin", "client_member")) {
	throw "Unsupported system role: $SystemRole"
}

$repoRoot = Split-Path -Parent $PSScriptRoot
$apiEnvPath = Join-Path $repoRoot "api\.env"

function Write-Step {
	param([string]$Message)
	Write-Host ""
	Write-Host "==> $Message" -ForegroundColor Cyan
}

function Get-EnvValue {
	param(
		[string]$FilePath,
		[string]$Name
	)

	$line = Get-Content $FilePath | Where-Object { $_ -match "^${Name}=" } | Select-Object -First 1
	if (-not $line) {
		throw "Missing $Name in $FilePath"
	}

	$value = $line.Substring($Name.Length + 1).Trim()
	return $value.Trim('"')
}

if (-not (Test-Path $apiEnvPath)) {
	throw "api/.env was not found at $apiEnvPath"
}

$supabaseUrl = Get-EnvValue -FilePath $apiEnvPath -Name "SUPABASE_URL"
$serviceRoleKey = Get-EnvValue -FilePath $apiEnvPath -Name "SUPABASE_SERVICE_ROLE_KEY"

if ($supabaseUrl -like "*YOUR_PROJECT_REF*" -or $serviceRoleKey -like "*REPLACE_WITH*") {
	throw "api/.env still contains placeholder Supabase values."
}

$headers = @{
	"apikey" = $serviceRoleKey
	"Authorization" = "Bearer $serviceRoleKey"
	"Content-Type" = "application/json"
	"Prefer" = "return=representation"
}

$restBase = "$($supabaseUrl.TrimEnd('/'))/rest/v1"

Write-Step "Looking up profile for $Email"
$profileUrl = "$restBase/profiles?select=id,email,system_role&email=$([uri]::EscapeDataString("eq.$Email"))&limit=1"
$profiles = Invoke-RestMethod -Method Get -Uri $profileUrl -Headers $headers

if (-not $profiles -or $profiles.Count -eq 0) {
	throw "No profile found for $Email"
}

$profile = $profiles[0]
$profileId = $profile.id

Write-Step "Promoting profile"
$patchUrl = "$restBase/profiles?id=$([uri]::EscapeDataString("eq.$profileId"))"
$updated = Invoke-RestMethod -Method Patch -Uri $patchUrl -Headers $headers -Body (@{
	system_role = $SystemRole
} | ConvertTo-Json)

$result = $updated[0]

Write-Step "Done"
Write-Host "Email:       $($result.email)"
Write-Host "Profile ID:  $($result.id)"
Write-Host "System role: $($result.system_role)"
Write-Host ""
Write-Host "You can now test internal access at http://localhost:3000/admin"
