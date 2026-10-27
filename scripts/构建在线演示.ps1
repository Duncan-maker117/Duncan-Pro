$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$desktopPath = Join-Path $projectRoot 'packages/desktop'
$outputPath = Join-Path $projectRoot 'docs/platform'
$previousDemoFlag = $env:VITE_STATIC_DEMO
try {
    Push-Location -LiteralPath $desktopPath
    if (-not (Test-Path -LiteralPath (Join-Path $desktopPath 'node_modules'))) {
        npm ci --ignore-scripts --no-audit --no-fund
        if ($LASTEXITCODE -ne 0) { throw '前端依赖安装失败。' }
    }
    $env:VITE_STATIC_DEMO = 'true'
    npm run build
    if ($LASTEXITCODE -ne 0) { throw '在线演示构建失败。' }
    Copy-Item -LiteralPath (Join-Path $desktopPath 'renderer/public/duncan-avatar.jpg') -Destination (Join-Path $outputPath 'duncan-avatar.jpg')
    Copy-Item -LiteralPath (Join-Path $projectRoot 'docs/sample-report.html') -Destination (Join-Path $outputPath 'sample-report.html')
    Write-Output '在线演示构建完成，输出目录：docs/platform。'
} finally {
    Pop-Location
    $env:VITE_STATIC_DEMO = $previousDemoFlag
}
