# Second-Brain-Blueprint

[Read in English](README.md)

Second-Brain-Blueprint 是一个可公开发布、可直接 fork / clone 的 AI second brain starter。

它的目标不是公开你的私人第二大脑，而是提供一个安全、清晰、即开即用的起步骨架，让你可以在 Cursor、Codex 或 Claude Code 中直接开始搭建自己的私有实例。

## 这个仓库是什么

这是一个面向知识工作者的第二大脑模板仓。

默认工作方式是：

- 用 Markdown 承载长期记忆层
- 用 agent 承载控制层
- 用可选的 Google 工具承载可复用基础设施
- 保留一个可选 dashboard 作为展示层，而不是最低启动依赖

## 中英文切换

- English: `README.md`
- 中文: `README.zh-CN.md`

目录名、接口名、控制层文件名保持英文。

你自己的笔记内容可以是英文、中文，或者中英混写。

## 第二大脑的本质到底是什么

第二大脑不是：

- 原始文件的堆积
- 聊天记录仓库
- 一次性 RAG 问答壳子
- 先做 dashboard 再补内容的产品

一个真正有用的第二大脑，本质上是一个由 agent 持续维护的 Markdown wiki。

这意味着：

- 原始资料始终有出处
- 笔记会积累，而不是每次重来
- 决策会沉淀成可复用记忆
- 项目会持续反哺 area 和 resource
- 系统价值来自长期维护的复利，而不是一次性整理

## 架构分层

- Raw sources：证据层。包括文档、截图、PDF、录音、导出文件等原始材料。
- Markdown wiki：持久记忆层。这个仓库主要承载笔记、综合、模板和操作规则。
- Cursor / Codex / Claude Code：控制层。agent 负责 ingest、query、restructure、lint、maintenance。
- Google Drive / Google Tasks / NotebookLM：可复用基础设施。很好用，但不是模板成立的前提。

最重要的一条边界是：

- agent 不是知识本体
- wiki 才是知识本体

## 最低启动路径

开始使用这个仓库，不需要先安装 Node，也不需要先跑 dashboard。

1. Clone 或 fork 这个仓库。
2. 用 Cursor、Codex 或 Claude Code 打开。
3. 阅读 `README.md` 或 `README.zh-CN.md`。
4. 打开 `DASHBOARD.md`、`INDEX.md` 和一个 starter area。
5. 执行一条 starter prompt，让 agent 帮你实例化自己的私有版本。

建议从这里开始：

- `00_Inbox/`
- `10_Projects/`
- `20_Areas/Work/`
- `20_Areas/Learning/`
- `20_Areas/Operations/`
- `99_System/Guides/WORKFLOW.md`

## 控制层：Cursor / Codex / Claude Code

这个 starter 用“三套入口、同一内核”的方式组织控制层：

- Cursor：`.cursor/rules/00-core.mdc` 与 `.cursor/rules/10-wiki-maintenance.mdc`
- Codex / 通用 agent：`AGENTS.md`
- Claude Code：`CLAUDE.md`
- 共用规则源：`99_System/Agent-Kernel.md`

Cursor 启动提示词：

```text
Read README.md, PRIVACY.md, AGENTS.md, and 99_System/Agent-Kernel.md.
Treat this repo as a public starter, not as a personal vault.
Instantiate a private working copy for me using the existing framework.
Keep Work / Learning / Operations as the starter areas unless I ask to change them.
Do not add private identity, immigration, finance, or contact-network data to the public template.
Start from DASHBOARD.md and 00_Inbox/, then propose the first safe setup tasks.
```

Codex 启动提示词：

```text
Use this repository as a public-safe second-brain starter.
Read README.md, PRIVACY.md, AGENTS.md, and 99_System/Agent-Kernel.md first.
Set up my private instance on top of this framework layer.
Preserve the Markdown-first workflow and treat agents as the control layer.
Do not write private personal data back into the public template.
Use Work, Learning, and Operations as the default starter areas.
```

Claude Code 启动提示词：

```text
Read README.md, PRIVACY.md, CLAUDE.md, and 99_System/Agent-Kernel.md.
Help me derive a private second-brain instance from this public starter.
Keep the public framework layer clean and generic.
Use Markdown as the durable memory layer and treat the agent as the control layer.
Start with DASHBOARD.md, INDEX.md, and the starter areas, then suggest the smallest useful next setup step.
```

## Google 复用：基础设施与方法论

这里保留 Google 相关文档，是因为它们很适合作为可复用基础设施：

- Google Drive 适合作为 source storage
- Google Tasks 适合作为 next actions 层
- NotebookLM 适合作为 source-grounded review 层

但这个模板并不依赖 Google 才能成立。

你完全可以用下面这些方式启动：

- 本地文件夹
- 纯 Markdown
- 本地截图和导出文件
- 只依赖 agent 的工作流

这里的 Google 是“推荐复用基础设施”，不是“系统本体”。

## 可选 Dashboard

React dashboard 是可选层。

如果你希望有一个可视化状态页、next actions 页、轻量仪式层，它会很有帮助。

但它不是最低启动路径的一部分。

只有在你需要时再运行它：

```bash
cd dashboard
npm install
npm run dev
```

运行要求：

- Node `>=22 <23`
- npm `>=10 <11`

## 隐私边界

这个公开仓库是 framework layer。

你的真实使用应当落在 private instance layer。

Framework layer 包含：

- 目录结构
- 模板
- starter notes
- agent 规则
- 通用示例数据

Instance layer 包含：

- 你的身份信息
- 你的真实项目
- 你的个人文档
- 你的联系人网络
- 你的分数、财务、健康、法律、移民等敏感数据

在从真实工作副本发布内容之前，先阅读 `PRIVACY.md`。

## 这不是什么

- 不是个人隐私公开仓
- 不是 dashboard-first 的 PKM 产品
- 不是只会堆文件、不做维护闭环的资料仓
- 不是绑定某一家 AI 厂商的工作流
- 不是必须依赖 Google 才能成立的系统

## 核心入口文件

- `README.md`
- `README.zh-CN.md`
- `DASHBOARD.md`
- `INDEX.md`
- `PRIVACY.md`
- `AGENTS.md`
- `CLAUDE.md`
- `99_System/Agent-Kernel.md`
- `99_System/Guides/WORKFLOW.md`
- `99_System/Guides/QUICK_REFERENCE.md`

## 复用方式

把这个仓库当作 starter 来用，再在你自己的私有实例中继续生长。

保持 framework layer 可公开。
保持 instance layer 默认私有。
