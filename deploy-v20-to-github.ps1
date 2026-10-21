param(
  [string]$GitRepo = "$env:USERPROFILE\OneDrive\Desktop\JYC-Website-GIT",
  [string]$ReleaseDir = "$env:USERPROFILE\OneDrive\Desktop\JYC-Website-V20.0.0-COMPLETE-FINAL"
)
$ErrorActionPreference='Stop'
if(!(Test-Path $GitRepo)){ throw "Git repo not found: $GitRepo" }
if(!(Test-Path (Join-Path $ReleaseDir 'package.json'))){ throw "Release source not found: $ReleaseDir" }
Set-Location $GitRepo
$before=(git status --porcelain)
if($before){ Write-Host "Existing working-tree changes detected. Review them before continuing:" -ForegroundColor Yellow; git status; throw "Refusing to overwrite a dirty Git working tree." }
robocopy $ReleaseDir $GitRepo /E /XD node_modules dist .git /XF .env .env.local .env.production .env.development | Out-Host
if($LASTEXITCODE -gt 7){ throw "Robocopy failed with exit code $LASTEXITCODE" }
Set-Location $GitRepo
npm ci
npm run qa
npm run build
npm run qa:browser
git diff --check
git status --short
Write-Host "If the checks above look correct, press Enter to commit/push V20.0.0." -ForegroundColor Cyan
Read-Host
if((git status --porcelain) -eq ''){ throw "No Git changes detected." }
git add -A
git commit -m "Release V20.0.0 complete JYC platform"
git pull --rebase origin main
git push origin main
git log -1 --oneline
git status
