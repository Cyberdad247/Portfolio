param(
	[string]$Email = "vizion711@gmail.com",
	[string]$FullName = "VaShawn Head",
	[string]$OrganizationName = "VaShawn Head",
	[string]$OrganizationSlug = "vashawn-head",
	[string]$Plan = "starter",
	[string]$Role = "client_admin",
	[switch]$SetDefaultMembership = $true
)

$ErrorActionPreference = "Stop"

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

function Get-SupabaseHeaders {
	param([string]$ServiceRoleKey)

	return @{
		"apikey" = $ServiceRoleKey
		"Authorization" = "Bearer $ServiceRoleKey"
		"Content-Type" = "application/json"
	}
}

function Invoke-SupabaseGet {
	param(
		[string]$Url,
		[hashtable]$Headers
	)

	return Invoke-RestMethod -Method Get -Uri $Url -Headers $Headers
}

function Invoke-SupabasePost {
	param(
		[string]$Url,
		[hashtable]$Headers,
		[object]$Body
	)

	$postHeaders = @{} + $Headers
	$postHeaders["Prefer"] = "return=representation,resolution=merge-duplicates"
	return Invoke-RestMethod -Method Post -Uri $Url -Headers $postHeaders -Body ($Body | ConvertTo-Json -Depth 10)
}

function Invoke-SupabaseUpsert {
	param(
		[string]$Url,
		[hashtable]$Headers,
		[object]$Body,
		[string]$OnConflict
	)

	$separator = "?"
	if ($Url.Contains("?")) {
		$separator = "&"
	}

	$upsertUrl = "$Url${separator}on_conflict=$([uri]::EscapeDataString($OnConflict))"
	return Invoke-SupabasePost -Url $upsertUrl -Headers $Headers -Body $Body
}

if (-not (Test-Path $apiEnvPath)) {
	throw "api/.env was not found at $apiEnvPath"
}

$supabaseUrl = Get-EnvValue -FilePath $apiEnvPath -Name "SUPABASE_URL"
$serviceRoleKey = Get-EnvValue -FilePath $apiEnvPath -Name "SUPABASE_SERVICE_ROLE_KEY"

if ($supabaseUrl -like "*YOUR_PROJECT_REF*" -or $serviceRoleKey -like "*REPLACE_WITH*") {
	throw "api/.env still contains placeholder Supabase values."
}

$restBase = "$($supabaseUrl.TrimEnd('/'))/rest/v1"
$headers = Get-SupabaseHeaders -ServiceRoleKey $serviceRoleKey

Write-Step "Looking up profile for $Email"
$encodedEmail = [uri]::EscapeDataString("eq.$Email")
$profileUrl = "$restBase/profiles?select=id,email,full_name&email=$encodedEmail&limit=1"
$profiles = Invoke-SupabaseGet -Url $profileUrl -Headers $headers

if (-not $profiles -or $profiles.Count -eq 0) {
	throw "No profile found for $Email. Sign in once through Supabase first so the profile trigger creates the row."
}

$profile = $profiles[0]
$userId = $profile.id

Write-Step "Ensuring organization exists"
$encodedSlug = [uri]::EscapeDataString("eq.$OrganizationSlug")
$organizationUrl = "$restBase/organizations?select=id,name,slug&slug=$encodedSlug&limit=1"
$organizations = Invoke-SupabaseGet -Url $organizationUrl -Headers $headers

if ($organizations -and $organizations.Count -gt 0) {
	$organization = $organizations[0]
	Write-Host "Using existing organization: $($organization.name) [$($organization.id)]"
} else {
	$newOrganization = Invoke-SupabasePost -Url "$restBase/organizations" -Headers $headers -Body @(
		@{
			name = $OrganizationName
			slug = $OrganizationSlug
			plan = $Plan
		}
	)
	$organization = $newOrganization[0]
	Write-Host "Created organization: $($organization.name) [$($organization.id)]"
}

$organizationId = $organization.id

Write-Step "Ensuring organization settings exist"
[void](Invoke-SupabaseUpsert -Url "$restBase/organization_settings" -Headers $headers -OnConflict "organization_id" -Body @(
	@{
		organization_id = $organizationId
		brand_name = $OrganizationName
		voice = "Strategic, direct, premium"
		primary_offer = "Invisioned Marketing OS"
		target_channels = @("website", "search", "social")
	}
))

Write-Step "Upserting organization membership"
[void](Invoke-SupabaseUpsert -Url "$restBase/organization_members" -Headers $headers -OnConflict "organization_id,user_id" -Body @(
	@{
		organization_id = $organizationId
		user_id = $userId
		role = $Role
		is_default = [bool]$SetDefaultMembership
	}
))

Write-Step "Updating profile display name if needed"
$patchHeaders = @{} + $headers
$patchHeaders["Prefer"] = "return=representation"
$profileUpdateUrl = "$restBase/profiles?id=$([uri]::EscapeDataString("eq.$userId"))"
[void](Invoke-RestMethod -Method Patch -Uri $profileUpdateUrl -Headers $patchHeaders -Body (@{
	full_name = $FullName
} | ConvertTo-Json))

Write-Step "Done"
Write-Host "User:         $Email"
Write-Host "User ID:      $userId"
Write-Host "Organization: $OrganizationName"
Write-Host "Org ID:       $organizationId"
Write-Host "Role:         $Role"
Write-Host "Default:      $([bool]$SetDefaultMembership)"

Write-Host ""
Write-Host "Next:"
Write-Host "1. Sign in at http://localhost:3000/login"
Write-Host "2. Open http://localhost:3000/dashboard"
Write-Host "3. If you need internal admin access, promote the profile system_role separately in Supabase."
