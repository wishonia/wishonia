# Get all processes with the name "node.exe"
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue

# Check if any "node.exe" processes are running
if ($nodeProcesses) {
    foreach ($process in $nodeProcesses) {
        Write-Host "Terminating process $($process.Id): $($process.ProcessName)"
        Stop-Process -Id $process.Id -Force
    }
    Write-Host "All instances of node.exe terminated."
} else {
    Write-Host "No node.exe processes found."
}
