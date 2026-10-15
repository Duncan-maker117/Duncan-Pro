# Duncan pro：招标文件解读操作说明

Duncan pro 提供招标文件上传、解读任务和报告下载。许可证见根目录 [`LICENSE`](LICENSE)。

## 已实现的演示流程

浏览器登录 → 新建项目 → 上传带文字层的 PDF → 本机提取文字与章节 → DeepSeek 对 15 个维度解读 → 查看项目、资格、评分、时间、风险等信息 → 下载可在手机离线打开的 HTML 报告或 Markdown 报告。AI 任务由后台执行，网页可轮询进度。分析失败会显示失败，部分失败会列出缺失内容。

扫描版 PDF 暂无 OCR；模型分析可能遗漏或误读，报告应与原文件核对。自动投标书、完整合规审核、企业生产运维不属于这次演示的已验收范围。

## 本机启动

1. 启动 Docker Desktop。
2. 双击根目录的 `设置DeepSeek密钥.bat`，在本机输入 DeepSeek API Key。密钥只保存在 Git 忽略的 `.env.local`，不得发送到聊天或提交 Git。
3. 在项目根目录运行 `docker compose --env-file .env.local -f docker/docker-compose.duncan.yml up -d --build`。
4. 打开 `http://127.0.0.1:8081`。管理员邮箱仍是 `admin@bidmaster.pro`；本演示的随机密码只保存在本机 `.secrets/admin-password.txt`，双击 `查看演示密码.bat` 可查看。首次启动后运行 `scripts/初始化演示管理员.ps1` 生成并替换默认密码。

关闭：`docker compose --env-file .env.local -f docker/docker-compose.duncan.yml down`。此命令保留 Docker 数据卷；不要加 `-v`。

公开手机演示请参阅 [部署记录](duncan-docs/部署.md)。

## 对应源码

登录页和侧栏提供 `/duncan-pro-source.zip` 下载入口。压缩包由已提交的改版源码生成，包括 `LICENSE` 和部署脚本，不包含 `.env.local`、管理员密码、上传文件或数据库数据。每次修改后须重新生成压缩包并重建网页镜像。
