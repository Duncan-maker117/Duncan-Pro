# Duncan pro

面向招投标工作的智能文件解读平台。上传招标文件后，平台会提取文字、整理项目关键信息，并使用配置的大语言模型生成解读结果和可下载报告。

## 当前可用功能

- PDF、DOCX、TXT 招标文件上传与文字提取（当前演示已核验带文字层的 PDF）
- 项目信息、资格要求、评分细则、关键时间和风险提示整理
- DeepSeek 模型解读任务与进度查询
- HTML、Markdown 报告导出
- Docker 一键启动
- 手机浏览器适配

当前版本用于演示和内部试用。扫描版 PDF 的 OCR、自动生成完整投标书、完整合规审核和长期企业生产运维需要后续配置或开发。AI 结果应与原招标文件逐项核对。

## 快速开始

### 环境要求

- Windows 10/11、Docker Desktop 与 Docker Compose（以下脚本按 Windows 编写）
- 可访问模型服务的网络
- DeepSeek API Key（执行 AI 解读时需要，按模型服务商用量计费）

### 启动

1. 下载或克隆本仓库。
2. 运行 `设置DeepSeek密钥.bat`，在本机输入 DeepSeek API Key。密钥保存在 Git 忽略的 `.env.local`，不要提交或公开。
3. 在项目根目录运行：

   ```powershell
   docker compose --env-file .env.local -f docker/docker-compose.duncan.yml up -d --build
   ```

4. 浏览器打开 `http://127.0.0.1:8081`。
5. 管理员邮箱为 `admin@bidmaster.pro`。首次使用运行 `scripts/初始化演示管理员.ps1` 设置本机管理员密码，再双击 `查看演示密码.bat` 查看密码。

停止服务：

```powershell
docker compose --env-file .env.local -f docker/docker-compose.duncan.yml down
```

这个命令会保留数据卷。不要使用 `down -v`，除非你明确要删除本地项目数据。

## 手机演示

启动 Docker 后，运行根目录的 `启动手机演示.bat`，脚本会生成一个临时 `trycloudflare.com` 地址。手机和电脑都需要联网，电脑、Docker 和脚本窗口需要保持运行。临时地址每次启动都会变化，仅适合短时间演示。

## 项目结构

- `packages/desktop/renderer/`：网页界面
- `services/`：FastAPI 后端与业务接口
- `services/interpret/`：文件解析、解读任务和报告导出
- `docker/`：演示版 Docker 编排和镜像配置
- `duncan-docs/`：部署、结构、变更和验收记录
- `scripts/`：密钥、管理员密码和手机演示脚本

## 源码与许可证

仓库采用 GNU Affero General Public License v3.0，完整条款见根目录 [`LICENSE`](LICENSE)。网页登录页和侧栏提供对应源码下载入口。公开部署修改版服务时，应向网络用户提供当前运行版本的对应源码。

## 数据与隐私

API Key、管理员密码、上传文件、数据库数据和运行日志不属于公开源码。公开部署前请更换所有默认数据库密码，限制网络访问，并根据实际业务补充备份、账号管理和数据隔离措施。
