---
name: lazarus
description: "Lazarus v2 — Bring dead websites back to life. Keyword-in: hunt candidate dead domains with evidence. Domain-in: recover only pages with heuristic indexing evidence, pass a hard review gate, ship a machine-readable Recovery Bundle. 捡尸复活死站：热词挖坟、启发式收录分层、强制审查闸门、标准化产物包。默认改写素材不复制表达。"
version: 2.0.1
author: ilang-ai
homepage: https://ilang.ai
tags:
  - content-recovery
  - wayback-machine
  - keyword-discovery
  - original-content
  - seo
  - google-index
  - website-revival
  - review-gate
  - archive
  - autocode
  - deployment
---

# Lazarus v2 — Bring Dead Websites Back to Life

# Lazarus v2｜捡尸复活，捡有价值的尸

---

## English

### The Problem

Creating original content is hard. Millions of websites die every year. Their content disappears, but the Wayback Machine remembers a lot of it. Not all of it, and not forever: **Wayback is a sample, incompleteness is normal.**

Not every dead page is worth recovering either. **Only pages with evidence of past indexing matter.** And recovered content may still be protected by copyright even if the site is long gone. v2 treats both facts as hard constraints, not footnotes.

### What's new in v2

**Keyword mode.** v1 required you to already know a dead domain. v2 starts from what you actually have: a keyword. It hunts candidate dead domains behind that keyword (site-intel databases first, search archaeology as fallback), scores them with evidence, and asks you which ones to dig. Nothing gets recovered without your confirmation.

**Executable index grading.** v1 said "verify Google indexing" without saying how. v2 defines the exact allowed methods with query templates and degradation order (user exports → heuristic search with Bing fallback → optional keyed APIs), caps individual queries at 300 URLs, and labels every result honestly: heuristic grading, never "officially confirmed".

**Three output modes.**
- `republish`: full Markdown, full copyright gate, written acknowledgment required before any public deploy
- `rewrite_source` (default): no full text. Per page: the topic, the questions it once answered, verifiable facts with sources, entities. Facts extract; expression rewrites.
- `private_corpus`: full Markdown, bundle marked private, no public deploy notes

**Hardened death verify.** Seven-row matrix instead of "unreachable = dead". Parked pages, unrelated redirects and 403s are handled; uncertain verdicts always come back to you; live sites are never touched.

**Hard review gate.** Secrets found = gate fails = no public deploy, no exceptions. PII scanning cannot be turned off.

**Standard Recovery Bundle.** Machine-readable output (candidates.json with a metrics interface for downstream topic pipelines, graded_urls.jsonl, source notes with frontmatter) that any SSG, CMS or AI pipeline consumes directly. Deploy is decoupled: Lazarus writes deploy-notes.md; works with AutoCode or anything else.

### Pipeline

```
Keyword ─► [0] Discover ─► candidates (you confirm)
Domain ──────────────────► [1] Verify Death ─► [2] CDX Scout ─► [3] Grade Index
            ─► [4] Confirm ─► [5] Recover ─► [6] Clean ─► [7] Review Gate ─► [8] Bundle
```

Gate fails, deploy stops. Verdict uncertain, you get asked. Every claim carries an evidence link.

### How to Use

1. Open `prompt.md`, copy the full text
2. Paste into any AI with internet access (Claude Code, ChatGPT browsing, etc.)
3. Give it a keyword (mode A) or a dead domain (mode B)
4. Confirm candidates and gate questions when asked
5. Collect the Recovery Bundle

### API Access

- **Wayback CDX API** — Free, no key. Works immediately.
- **Save Page Now API** — Free with archive.org account: https://archive.org/account/signup
- Optional: Custom Search JSON API / SerpAPI-class for stronger index grading

> **Legal notice**: Domain expiration does not transfer content ownership. Recovered content may still be protected by copyright, trademark, or other IP rights. Default use is research, rewriting source material, and private knowledge bases. Public republishing requires passing the review gate and your explicit acknowledgment.

---

## 中文

### 痛点

做原创内容太难，每年数百万网站倒闭。Wayback 记住了其中很大一部分，但它是抽样存档，**不完整是常态**，别指望它记住一切。

不是所有尸都值得捡。**只有带收录证据的页面才有价值。** 而且捡回来的内容大概率仍受版权保护，域名过期不等于版权转移。v2 把这两件事当成硬约束，不当成脚注。

**捡尸要捡有价值的尸。**

### v2 改了什么

**热词模式。** v1 要你先知道一个死域名，可多数人手里只有关键词。v2 从关键词出发，优先查站点情报库（按 HTTP 状态和流量趋势直接筛死站），没有情报库就走搜索引擎考古，挖出候选死域带证据打分，列给你挑。你不确认，一个都不动。

**收录判定能落地了。** v1 说要验证谷歌收录，但没说怎么验。v2 写死了允许的方法、查询模板和降级顺序，逐条检索限 300 条，撞验证码降级 Bing，结果统一叫启发式收录分层，绝不冒充官方确认。

**产出分三档。** republish 出全文走全量版权闸门；rewrite_source（默认）不出全文，只出题材、这页当年回答过的问题、可核实事实和实体，事实可提取、表达必重写；private_corpus 出全文但锁私有。

**死亡判定硬化。** 七行判定矩阵替掉「打不开就是死了」。停放页、无关跳转、403 各有处置，拿不准必回来问你，活站绝不碰。

**强制审查闸门。** 扫到密钥直接 fail，禁止公开部署，没有例外。PII 扫描关不掉。

**标准化产物。** Recovery Bundle 全部机器可读，candidates.json 带 metrics 接口给下游选题流程回填，静态站生成器、CMS、AI 流水线都能直接接。部署解耦，只出 deploy-notes.md，兼容 AutoCode 但不绑死。

### 使用方法

1. 打开 `prompt.md`，复制全文
2. 粘贴到任何有联网能力的 AI（Claude Code、ChatGPT 联网模式等）
3. 给它一个关键词（模式 A）或一个死域名（模式 B）
4. 按它的提问确认候选和闸门
5. 收 Recovery Bundle

### API 说明

- **Wayback CDX API** — 免费，无需申请，直接可用
- **Save Page Now API** — 免费，需 archive.org 账号：https://archive.org/account/signup
- 可选增强：Custom Search JSON API / SerpAPI 同类，用于更强的收录判定

> **法律提醒**：域名过期不等于内容所有权转移。恢复的内容可能仍受版权、商标或其他权利保护。本工具默认用于研究、改写素材与私有知识库。公开重新上线必须过审查闸门并由你书面确认，风险自负。

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
