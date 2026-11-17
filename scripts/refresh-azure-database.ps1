$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $root ".env"
if (-not (Test-Path $envFile)) { throw ".env is missing." }

function Read-EnvValue([string]$name) {
  $line = Get-Content $envFile | Where-Object { $_ -match "^$([regex]::Escape($name))=" } | Select-Object -First 1
  if (-not $line) { return "" }
  $value = $line.Substring($name.Length + 1).Trim()
  if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
    $value = $value.Substring(1, $value.Length - 2)
  }
  return $value
}

$pgUser = Read-EnvValue "PGUSER"
$pgHost = Read-EnvValue "PGHOST"
$pgPort = Read-EnvValue "PGPORT"
$pgDatabase = Read-EnvValue "PGDATABASE"
if (-not $pgUser) { throw "Set PGUSER in .env to the Microsoft Entra admin for this Postgres server, for example name@tenant.onmicrosoft.com." }
if (-not $pgHost -or -not $pgPort -or -not $pgDatabase) { throw "PGHOST, PGPORT, and PGDATABASE must be set in .env." }

$az = Get-Command az -ErrorAction SilentlyContinue
if (-not $az) { throw "Azure CLI is not installed. Install it, run az login, then run this script again." }

$token = (& az account get-access-token --resource "https://ossrdbms-aad.database.windows.net" --query accessToken --output tsv).Trim()
if (-not $token) { throw "Azure CLI did not return an access token. Run az login, then try again." }

$user = [System.Uri]::EscapeDataString($pgUser)
$password = [System.Uri]::EscapeDataString($token)
$url = "postgresql://${user}:${password}@${pgHost}:${pgPort}/${pgDatabase}?sslmode=require&schema=public"

$updated = foreach ($line in Get-Content $envFile) {
  if ($line -like "DATABASE_URL=*") { "DATABASE_URL=$url" } else { $line }
}
Set-Content -Path $envFile -Value $updated -Encoding utf8
Write-Output "DATABASE_URL now uses $pgHost`:$pgPort/$pgDatabase as $pgUser with SSL. The Entra token expires in about one hour. Run npm run db:azure again after that."
