param()
$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$secretDir = Join-Path $projectRoot '.secrets'
$secretFile = Join-Path $secretDir 'admin-password.txt'
if (Test-Path -LiteralPath $secretFile) { throw "管理员密码文件已存在，停止覆盖：$secretFile" }
New-Item -ItemType Directory -Path $secretDir -Force | Out-Null
$bytes = New-Object byte[] 24
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$password = [Convert]::ToBase64String($bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_')
$code = @'
import asyncio
import bcrypt
import sys
from sqlalchemy import select
from services.database import async_session
from services.models import User

async def main():
    password = sys.stdin.readline().strip()
    async with async_session()() as db:
        user = (await db.execute(select(User).where(User.email == 'admin@bidmaster.pro'))).scalar_one_or_none()
        if user is None:
            raise RuntimeError('管理员账户不存在')
        user.password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        await db.commit()
    print('管理员密码已更换')

asyncio.run(main())
'@
$password | docker exec -i duncanpro-api-1 python -c $code
if ($LASTEXITCODE -ne 0) { throw '更换管理员密码失败，未保存密码文件。' }
[System.IO.File]::WriteAllText($secretFile, "$password`n", [System.Text.UTF8Encoding]::new($false))
$password = $null
Write-Host "新密码仅保存在本机：$secretFile"
