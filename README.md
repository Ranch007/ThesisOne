# 毕业论文排版工具（ThesisOne）

本科毕业论文在线排版工具，纯客户端 SPA，无需安装 Word 即可完成论文排版。

## 特性

- 纯文本输入，自动识别论文结构（题目、摘要、标题层级、图表、公式、参考文献）
- 社科/理工双学科标题体系，一键切换
- 实时 A4 分页预览，支持 50%-150% 缩放
- 一键导出符合校标的 .docx 文件（兼容 Word 2010+ / WPS 2019+）
- 中西文字体分离（宋体/黑体 + Times New Roman）
- GB/T 7714-2015 参考文献管理（7 种文献类型）
- 格式检测：标题层级、图表编号、引用一致性、字体合规
- 封面/目录/封底完整结构支持
- 多格式导入：.docx / .txt / .md
- PWA 离线支持 + 单文件 HTML 离线版
- 所有数据本地存储，不上传任何服务器

## 开发

```bash
npm install
npm run dev          # 开发服务器（热更新）
npm run build        # 标准构建（含 PWA）
npm run build:single # 单文件 HTML 离线构建
npm test             # 运行测试（90 项）
```

## 技术栈

Vue 3 + TypeScript + Pinia + Vite + docx + mammoth + Vitest

## 贡献者

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/sdfmom"><img src="https://avatars.githubusercontent.com/u/266272543?v=4?s=100" width="100px;" alt="sdfmom"/><br /><sub><b>sdfmom</b></sub></a><br /><a href="#maintenance-sdfmom" title="Maintenance">🚧</a> <a href="https://github.com/Ranch007/ThesisOne/commits?author=sdfmom" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.deepseek.com/"><img src="https://avatars.githubusercontent.com/u/148330874?v=4?s=100" width="100px;" alt="DeepSeek"/><br /><sub><b>DeepSeek</b></sub></a><br /><a href="#infra-deepseek-ai" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://anthropic.com/claude-code"><img src="https://avatars.githubusercontent.com/u/81847?v=4?s=100" width="100px;" alt="Claude"/><br /><sub><b>Claude</b></sub></a><br /><a href="#tool-claude" title="Tools">🔧</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## 许可证

MIT
