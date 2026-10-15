param()
$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$secretDir = Join-Path $projectRoot '.secrets'
$secretFile = Join-Path $secretDir 'admin-password.txt'
$nextFile = Join-Path $secretDir 'admin-password.next.txt'
$backupFile = Join-Path $secretDir 'admin-password.previous.txt'
if (-not (Test-Path -LiteralPath $secretFile)) { throw '找不到现有演示密码文件。' }
if (Test-Path -LiteralPath $nextFile) { throw '已有待处理的密码文件，停止操作。' }

$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$digits = [System.Text.StringBuilder]::new()
$buffer = New-Object byte[] 1
while ($digits.Length -lt 12) {
    $rng.GetBytes($buffer)
    if ($buffer[0] -lt 250) { [void]$digits.Append([char](48 + ($buffer[0] % 10))) }
}
$rng.Dispose()
$newPassword = $digits.ToString()
[System.IO.File]::WriteAllText($nextFile, "$newPassword`n", [System.Text.UTF8Encoding]::new($false))

$code = @'
import asyncio
import bcrypt
import sys
from sqlalchemy import select
from services.database import async_session, close_db
from services.models import User

async def main():
    password = sys.stdin.readline().strip()
    async with async_session()() as db:
        user = (await db.execute(select(User).where(User.email == 'admin@bidmaster.pro'))).scalar_one_or_none()
        if user is None:
            raise RuntimeError('demo administrator missing')
        user.password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        await db.commit()
    await close_db()
    print('demo password updated')

asyncio.run(main())
'@
$newPassword | docker exec -i duncanpro-api-1 python -c $code
if ($LASTEXITCODE -ne 0) { throw "数据库更新失败；新密码暂存在 $nextFile，请勿重复运行。" }
[System.IO.File]::Replace($nextFile, $secretFile, $backupFile)
$newPassword = $null
Write-Host '演示密码已换成随机的 12 位数字。请关闭旧记事本，再双击项目根目录的“查看演示密码.bat”。'
