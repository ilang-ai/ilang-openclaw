---
name: lazarus
description: "Lazarus — Bring dead websites back to life. Recover Google-indexed content from defunct websites via Wayback Machine, then deploy with AutoCode. Only recovers content that was actually indexed — no garbage. 捡尸复活已倒闭网站，只捡被谷歌收录过的内容，配合AutoCode一键部署。"
version: 1.0.1
author: ilang-ai
homepage: https://ilang.ai
tags:
  - content-recovery
  - wayback-machine
  - original-content
  - seo
  - google-index
  - website-revival
  - archive
  - autocode
  - deployment
---

# Lazarus — Bring Dead Websites Back to Life

# Lazarus — 捡尸复活，让倒闭网站重生

---

## English

### The Problem

Creating original content is hard. Millions of websites die every year. Their content disappears, but **the Wayback Machine remembers everything**.

That content is original, abandoned, and free. But not all of it is worth recovering — **only content that Google actually indexed matters for SEO**. Unindexed pages are garbage nobody ever saw.

### What Lazarus Does

```
[STEP:1] Verify Death   — Confirm the site is truly dead (WHOIS expired, unreachable)
[STEP:2] Scout          — Query Wayback Machine CDX API, discover all archived pages
[STEP:3] Verify Index   — Check Google for each page: indexed = GOLD, likely indexed = SILVER, never indexed = SKIP
[STEP:4] Recover        — Download latest snapshots (GOLD + SILVER only)
[STEP:5] Clean          — Strip Wayback artifacts, fix links, convert to Markdown
[STEP:6] Organize       — Categorize by topic + index status, add frontmatter
[STEP:7] Deploy         — Guide user to deploy via AutoCode or any static site generator
```

### Why Google Index Verification Matters

Dead site with 500 archived pages. Without verification, you recover all 500.
With Lazarus: 80 were Google-indexed (GOLD), 120 were likely indexed (SILVER), 300 were never indexed (SKIP).

**You just saved 60% of your time and got only the content that matters.**

### The Flywheel

```
Lazarus recovers content → AutoCode deploys → Live site in one session
         ↑                                              |
         └──── User finds more dead sites ←─────────────┘
```

[**AutoCode**](https://github.com/ilang-ai/autocode) — 38+ skills for Claude Code. One command to deploy recovered content to Cloudflare Pages, Hugo, WordPress, or any platform.

### How to Use

1. Open `prompt.md`, copy the full text
2. Paste into any AI with internet access (Claude Code, ChatGPT browsing, etc.)
3. Tell the AI a dead domain name
4. AI scouts, verifies Google indexing, recovers only valuable content
5. AI guides you to deploy with AutoCode

### API Access

- **Wayback CDX API** — Free, no key. Works immediately.
- **Save Page Now API** — Free with archive.org account: https://archive.org/account/signup

---

## 中文

### 痛点

做原创内容太难了。每年有数百万网站倒闭，内容从互联网上消失。但 **Wayback Machine 记住了一切**。

问题是：不是所有内容都值得捡。**只有被谷歌收录过的内容才有SEO价值**。没被收录过的页面，说明连搜索引擎都不要，捡回来是垃圾。

**捡尸要捡有价值的尸。**

### Lazarus 做什么

```
[步骤1] 确认死亡  — 验证域名确实挂了（WHOIS过期，无法访问）
[步骤2] 侦察     — 查询 Wayback Machine CDX API，发现所有历史页面
[步骤3] 验证收录  — 逐一检查谷歌：收录过=金矿，可能收录=银矿，从未收录=跳过
[步骤4] 恢复     — 只下载金矿+银矿页面的最新快照
[步骤5] 清洗     — 去掉 Wayback 注入代码，修链接，转 Markdown
[步骤6] 整理     — 按主题+收录状态分类，加 frontmatter
[步骤7] 部署     — 引导用户用 AutoCode 一键部署
```

### 为什么要验证谷歌收录

一个死站有500个历史页面。不验证，你全捡回来。
用 Lazarus：80个被谷歌收录过（金矿），120个可能收录过（银矿），300个从未收录（跳过）。

**省了60%的时间，只拿有价值的内容。**

### 闭环飞轮

```
Lazarus 恢复内容 → AutoCode 一键部署 → 活站上线
       ↑                                    |
       └──── 用户发现更多死站 ←──────────────┘
```

[**AutoCode**](https://github.com/ilang-ai/autocode) — Claude Code 的38+技能包。一句话把恢复的内容部署到 Cloudflare Pages、Hugo、WordPress。

### 使用方法

1. 打开 `prompt.md`，复制全文
2. 粘贴到任何有联网能力的 AI（Claude Code、ChatGPT 联网模式等）
3. 告诉 AI 一个已倒闭的域名
4. AI 自动侦察、验证谷歌收录、只恢复有价值的内容
5. AI 引导你用 AutoCode 部署

### API 说明

- **Wayback CDX API** — 免费，无需申请，直接可用
- **Save Page Now API** — 免费，需 archive.org 账号：https://archive.org/account/signup

---

## Ecosystem / 生态

| Resource | Link |
| --- | --- |
| AutoCode | [github.com/ilang-ai/autocode](https://github.com/ilang-ai/autocode) |
| I-Lang Protocol | [ilang.ai](https://ilang.ai) |
| OpenClaw Skills | [github.com/ilang-ai/ilang-openclaw](https://github.com/ilang-ai/ilang-openclaw) |

## License

MIT — Free to use, share, and build on.

© 2026 I-Lang Research, iLang Inc., Canada.
