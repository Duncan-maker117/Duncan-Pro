# 在线 Demo

本目录是 GitHub Pages 的静态发布源。访问入口：`https://duncan-maker117.github.io/Duncan-Pro/`。

- `index.html`：可点击的工作台、解读样例和界面预览。
- `styles.css`、`app.js`：独立的样式和交互；不调用后台接口。
- `sample-report.html`：根据公开招标文件分析结果整理的精简示例报告，供浏览与下载。
- `assets/`：从 `duncan-docs/images/` 和原前端头像复制的发布资源；原文件是维护入口。

这个 Demo 使用预置样例，不支持文件上传、登录、实时 AI 解读或保存访客数据。正式功能的源码位于 `packages/desktop/renderer/` 与 `services/`。修改真实分析流程时，应在对应模块完成，不要在本目录伪造能力。

发布方式：仓库 Settings → Pages → Deploy from a branch → `main` / `docs`。提交到 `main` 后 GitHub Pages 自动更新；公开访问不依赖本机 Docker。

样例来自无锡公共资源交易中心公开的招标文件提前公示稿，仅供功能展示，不用于真实投标。出处见仓库 `samples/来源.txt`。报告只选取部分项目要点，不表示所有模型结果已逐条人工核验。
