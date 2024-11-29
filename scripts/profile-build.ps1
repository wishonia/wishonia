# Create output directory if it doesn't exist
New-Item -ItemType Directory -Force -Path .\build-profiles

# Get timestamp for unique profile names
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

# Set memory limit through NODE_OPTIONS
$env:NODE_OPTIONS="--max-old-space-size=4096"

# Create a log file for the build output
$logFile = ".\build-profiles\build_log_$timestamp.txt"

# Run next build with profiling enabled
Write-Host "Starting build with profiling..."

# Create a script to take heap snapshots during build
$heapSnapshotScript = @'
const heapdump = require('heapdump');
const { spawn } = require('child_process');
const path = require('path');

// Take initial heap snapshot
heapdump.writeSnapshot(path.join('build-profiles', `heap_${process.pid}_start.heapsnapshot`));

// Start the build process
const build = spawn('node', ['node_modules/next/dist/bin/next', 'build'], {
    stdio: ['inherit', 'pipe', 'pipe']
});

let output = '';
build.stdout.on('data', (data) => {
    const chunk = data.toString();
    output += chunk;
    process.stdout.write(chunk);
    
    // Take heap snapshot when certain memory-intensive operations are detected
    if (chunk.includes('Creating an optimized production build') ||
        chunk.includes('Collecting page data') ||
        chunk.includes('Generating static pages')) {
        heapdump.writeSnapshot(path.join('build-profiles', `heap_${process.pid}_${Date.now()}.heapsnapshot`));
    }
});

build.stderr.on('data', (data) => {
    process.stderr.write(data);
});

build.on('close', (code) => {
    // Take final heap snapshot
    heapdump.writeSnapshot(path.join('build-profiles', `heap_${process.pid}_end.heapsnapshot`));
    process.exit(code);
});
'@

# Save the script to a temporary file
$tempScriptPath = ".\build-profiles\build-script.js"
$heapSnapshotScript | Out-File -FilePath $tempScriptPath -Encoding UTF8

# Run the build script
Write-Host "Running build with heap profiling..."
node $tempScriptPath 2>&1 | Tee-Object -FilePath $logFile

# Clean up the temporary script
Remove-Item $tempScriptPath

Write-Host "`nBuild profile completed. Check ./build-profiles directory for results."
Write-Host "Key files to check:"
Write-Host "- build_log_$timestamp.txt for build output"
Write-Host "- heap_*.heapsnapshot files for memory analysis at different build stages"
Write-Host ""
Write-Host "To analyze heap snapshots:"
Write-Host "1. Open Chrome DevTools"
Write-Host "2. Go to Memory tab"
Write-Host "3. Click 'Load' and select each .heapsnapshot file"
Write-Host "4. Compare snapshots to identify memory growth" 