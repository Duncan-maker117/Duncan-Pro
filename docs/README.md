# 在线 Demo

本目录是 GitHub Pages 的发布源，入口为 `https://duncan-maker117.github.io/Duncan-Pro/`。它复用本地平台的 React 界面，通过独立的静态数据适配器展示公开样例，不连接真实后台。

- `index.html`：跳转到新版在线 Demo。
- `platform/`：由构建脚本生成的发布文件，包含前端、头像和报告节选；不要直接编辑生成文件。
- `sample-report.html`：公开招标文件的精简样例报告，是报告内容的维护入口。
- `classic.html`、`app.js`、`styles.css` 和 `assets/`：此前的精简演示，保留供对照与回退。
- `../packages/desktop/renderer/src/services/staticDemo.ts`：样例项目、解读结果和静态接口行为。

在项目根目录运行 `scripts/构建在线演示.ps1`，生成 `platform/` 后将修改提交到 `main`，GitHub Pages 会从 `docs/` 更新。构建时只复制头像与样例报告，不复制本地源码压缩包、密钥或上传文件。

在线版可浏览本地平台的主要页面，查看公开样例解读、切换投标模板和检查选项、下载样例报告。它没有真实上传、AI 生成、自动审核、实时采集或服务器数据保存。真实业务代码在 `packages/desktop/renderer/` 与 `services/`；不要把示意数据描述为实时处理结果。

样例来自无锡公共资源交易中心公开的招标文件提前公示稿，仅供展示；来源见 `samples/来源.txt`。样例报告是部分节选，关键结论应回查原文。
