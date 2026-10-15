param()
$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$secret = Read-Host '请在本机输入 DeepSeek API Key（不会显示）' -AsSecureString
$plain = [System.Net.NetworkCredential]::new('', $secret).Password
if ($plain -notmatch '^sk-[^\s]+$') { throw '密钥格式不正确，未保存。' }
$target = Join-Path $projectRoot '.env.local'
$content = "LLM_API_KEY=$plain`nLLM_MODEL=deepseek/deepseek-flash`n"
[System.IO.File]::WriteAllText($target, $content, [System.Text.UTF8Encoding]::new($false))
$plain = $null
Write-Host "密钥已仅保存在本机：$target。请勿将此文件发送给他人。"
