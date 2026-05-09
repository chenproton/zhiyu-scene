$extractScript = "mkdir -p test && cd test"
$remoteScript = @'
if ! command -v pnpm &> /dev/null; then
    echo test
fi
'@
Write-Host "Script executed successfully"
