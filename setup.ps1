param(
    [switch]$Docker,
    [switch]$VerifyOnly,
    [switch]$Dev
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if ($Docker) {
    Write-Host "[Mobile Setup] Building Docker image 'nephroguard-mobile' ..."
    docker build -t nephroguard-mobile .
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

    docker rm -f nephroguard-mobile-bedside 2>$null | Out-Null
    Write-Host "[Mobile Setup] Starting container on http://localhost:5173 ..."
    docker run -d --rm --name nephroguard-mobile-bedside -p 5173:80 nephroguard-mobile
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

    Write-Host "[Mobile Setup] Running cleanly at http://localhost:5173 (stop with: docker stop nephroguard-mobile-bedside)"
    exit 0
}

Write-Host "[Mobile Setup] Installing dependencies via npm ci ..."
npm ci
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "[Mobile Setup] Running TypeScript check + Vite production build ..."
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

if ($VerifyOnly) {
    Write-Host "[Mobile Setup] Verification complete (dist/ built cleanly)."
    exit 0
}

if ($Dev) {
    Write-Host "[Mobile Setup] Starting Vite dev server on http://localhost:5173 ..."
    npm run dev
} else {
    Write-Host "[Mobile Setup] Starting production preview server on http://localhost:5173 ..."
    npm run preview -- --host
}
