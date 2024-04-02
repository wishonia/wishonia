$processes = Get-Process -Name "node" -ErrorAction SilentlyContinue
$processes | Write-Output
$processes | Stop-Process -Force
Write-Host "Node processes killed!"