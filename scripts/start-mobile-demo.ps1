param([string]$AllowedEmail)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$cloudflared = (Get-Command cloudflared -ErrorAction SilentlyContinue).Source
if (-not $cloudflared) { $cloudflared = 'C:\Program Files (x86)\cloudflared\cloudflared.exe' }
if (-not (Test-Path -LiteralPath $cloudflared)) { throw '未安装 cloudflared。请先安装 Cloudflare cloudflared。' }
if (-not (Test-Path -LiteralPath (Join-Path $projectRoot '.secrets\admin-password.txt'))) { throw '管理员密码尚未更换，禁止开放手机链接。' }
if (-not (Test-Path -LiteralPath (Join-Path $projectRoot 'packages\desktop\renderer\public\duncan-pro-source.zip'))) { throw '对应源码压缩包尚未生成，禁止开放手机链接。' }
$envFile = Join-Path $projectRoot '.env.local'
if (-not (Test-Path -LiteralPath $envFile) -or -not ([System.IO.File]::ReadAllText($envFile) -match '(?m)^LLM_API_KEY=sk-\S+')) { throw 'DeepSeek 密钥尚未配置，禁止开放手机链接。' }
$health = Invoke-RestMethod -Uri 'http://127.0.0.1:8081/api/health' -TimeoutSec 10
if ($health.status -ne 'ok' -or -not $health.db_ready) { throw 'Duncan pro 本机服务未就绪。' }
$defaultBody = @{email='admin@bidmaster.pro';password='admin123'} | ConvertTo-Json -Compress
try {
    Invoke-RestMethod -Uri 'http://127.0.0.1:8081/api/auth/login' -Method Post -ContentType 'application/json' -Body $defaultBody -TimeoutSec 10 | Out-Null
    throw '默认管理员密码仍然有效，禁止开放手机链接。'
} catch {
    if ($_.Exception.Response.StatusCode -ne 401) { throw }
}
if ([string]::IsNullOrWhiteSpace($AllowedEmail)) {
    $AllowedEmail = Read-Host '输入能收到验证码的邮箱（仅这个邮箱可访问）'
}
if ([string]::IsNullOrWhiteSpace($AllowedEmail) -or $AllowedEmail -notmatch '^[^@\s,]+@[^@\s,]+\.[^@\s,]+$') { throw '邮箱格式不正确，未启动临时链接。' }
Write-Host '临时链接启动中。请复制稍后显示的 https://...trycloudflare.com 地址。关闭此窗口后链接失效。'
& $cloudflared tunnel --url http://127.0.0.1:8081 --allowed-mail $AllowedEmail
if ($LASTEXITCODE -ne 0) { throw '临时链接启动失败，请查看上方错误。' }
