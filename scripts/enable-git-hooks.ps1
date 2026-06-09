# PowerShell helper to enable repository-local Git hooks
$repo = Get-Location
Write-Host "Setting core.hooksPath to .githooks in repo: $repo"
git config core.hooksPath .githooks
Write-Host "Done. You can now push normally. The pre-push hook will block pushes when unresolved merges or conflict markers exist."
Write-Host "If you use WSL or Git Bash on Windows, ensure the hook has executable permissions there: 'chmod +x .githooks/pre-push'"