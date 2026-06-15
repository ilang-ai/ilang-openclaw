# I-Lang OpenClaw — Skills + Plugins

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Skills](https://img.shields.io/badge/Skills-10%20Published-blue)](#skills)
[![Plugins](https://img.shields.io/badge/Plugins-2%20Published-blue)](#plugins)
[![Protocol](https://img.shields.io/badge/I--Lang-v4.0-purple)](https://ilang.ai)

> **Skills** = instruction-only text, paste into any AI, zero dependencies.
>
> **Plugins** = code that runs inside OpenClaw, registers tools + hooks.

---

## Repo Structure

```
ilang-openclaw/
├── skills/              ← Text-only skills (SKILL.md + prompt.md)
│   ├── freemoney/       ← 白拿钱 — US class action settlement tracker
│   ├── DeAI/            ← Remove AI fingerprint from text (4 languages)
│   ├── WeChat-Awesome/  ← 微信公众号写作助手（纯中文）
│   ├── lazarus/         ← Bring dead websites back to life
│   ├── everything-is-ok/← Universal prompt compression
│   ├── no-prompt/       ← AI writes prompts for you
│   ├── less-token/      ← Compress prompts, save tokens
│   ├── ilang-compress/  ← Original I-Lang compression engine
│   ├── Niche-Awesome/  ← 出海选品调研：不知道做什么？3小时帮你找到方向
│   ├── SEO-Awesome/    ← 出海SEO自动化：Google API一手数据+PSEO批量页面+GA4自动复盘
├── plugins/             ← Code plugins for OpenClaw runtime
│   └── freemoney-plugin/← 白拿钱 native OpenClaw integration
│   └── soulforge-plugin/← 灵魂打印机：蒸馏写作风格 → soul.md
└── .github/workflows/   ← Auto-publish on push to main
```

---

## Skills

### DeAI `v1.1.3` -- Make AI Drafts Sound Like You / 去AI味引擎

Three-layer DeAI: clean filler phrases, mark positions for authentic voice, restructure for natural rhythm. Supports Chinese, English, Japanese, Korean.

[**Install on ClawHub**](https://clawhub.ai/adsorgcn/DeAI) | [**Details**](./skills/DeAI/SKILL.md)

---

### Niche-Awesome `v1.0.0` -- 解决新手AI做产品，不知道做什么的痛点

90%的独立开发者第一步就走错了：先写代码，做完才发现没人要。Niche-Awesome是一套完整的6步调研流程（趋势验证→竞品差评挖掘→用户画像→市场规模→定价策略→竞争定位），3小时带你从"不知道做什么"到一份完整的BRD调研文档。AI引导你搜，你动手搜，AI帮你分析。中英双语。

Complete 6-step niche product research: from "I don't know what to build" to a full BRD in 3 hours. AI guides, you search, AI analyzes. Zero research experience needed.

[**Install on ClawHub**](https://clawhub.ai/adsorgcn/Niche-Awesome) | [**Details**](./skills/Niche-Awesome/SKILL.md)

### SEO-Awesome `v1.0.0` — 出海SEO自动化：一手数据驱动，零第三方工具费

不教你"怎么做SEO"，教你"怎么搭一个自己会跑的SEO系统"。Google API全家桶拿一手数据（Keyword Planner/Search Console/Places/Trends，全免费），PSEO批量页面生成（API数据+LLM组装+模板渲染+Cron自动发布），GA4 Data API自动化复盘（每天自动拉数据，AI按数据调整生成策略）。变现affiliate优先，AdSense兜底。零代码，零第三方工具费。哥飞授权612篇实战文章作为方法论补充，核心框架iLang团队原创。

[**Install on ClawHub**](https://clawhub.ai/adsorgcn/SEO-Awesome) | [**Details**](./skills/SEO-Awesome/SKILL.md)

---

### WeChat-Awesome `v1.0.0` -- 微信公众号写作助手

素材→爆文结构重组→MD文件→封面图I-Lang提示词。内置品牌脱敏、平台合规、自查清单。纯中文。

[**Install on ClawHub**](https://clawhub.ai/adsorgcn/WeChat-Awesome) | [**Details**](./skills/WeChat-Awesome/SKILL.md)

---

### freemoney `v1.3.0` -- 白拿钱 (Free Money)

Track open class action settlements in US, Canada, UK, Australia. Filter no-proof cases. Chinese interface.

[**Install on ClawHub**](https://clawhub.ai/adsorgcn/freemoney) | [**Details**](./skills/freemoney/SKILL.md)

---

### lazarus `v1.0.2` -- Bring Dead Websites Back to Life

Recover Google-indexed content from defunct websites via Wayback Machine. Pairs with AutoCode for one-click deployment.

[**Install on ClawHub**](https://clawhub.ai/adsorgcn/lazarus) | [**Details**](./skills/lazarus/SKILL.md)

---

### everything-is-ok `v1.0.4` -- Universal Prompt Compression

[**Install on ClawHub**](https://clawhub.ai/adsorgcn/everything-is-ok) | [**Details**](./skills/everything-is-ok/SKILL.md)

---

### no-prompt `v1.0.2` -- AI Writes Prompts For You

[**Install on ClawHub**](https://clawhub.ai/adsorgcn/no-prompt) | [**Details**](./skills/no-prompt/SKILL.md)

---

### less-token `v1.0.4` -- Compress Prompts

[**Install on ClawHub**](https://clawhub.ai/adsorgcn/less-token) | [**Details**](./skills/less-token/SKILL.md)

---

### ilang-compress `v2.3.2` -- Original Compression Engine

[**Install on ClawHub**](https://clawhub.ai/adsorgcn/ilang-compress) | [**Details**](./skills/ilang-compress/SKILL.md)

---

## Plugins

### freemoney-plugin `v1.0.0` -- 白拿钱 Native Integration

Same data as the skill, but runs as real code inside OpenClaw:

- **4 tools**: query_claims, query_no_proof, query_new, query_stats
- **1 hook**: daily_push — auto-notify new settlements at 9am
- **Network**: GET-only to api.ilang.ai, no user data uploaded

```bash
openclaw plugins install clawhub:@adsorgcn/freemoney-plugin
```

[**Details**](./plugins/freemoney-plugin/)

---

### soulforge-plugin `v1.0.0` -- 灵魂打印机

输入人名或语料，蒸馏写作风格，自动覆盖soul.md：

- **2 tools**: distill_search（搜索模式）, distill_corpus（语料模式）
- **输出**: I-Lang GENE格式soul.md，自动写入~/.openclaw/soul.md
- **用户体验**: "蒸馏XXX" → "你的写作风格已经跟XXX一致，随时可以再次替换为其他风格。"

```bash
openclaw plugins install clawhub:@adsorgcn/soulforge-plugin
```

[**Details**](./plugins/soulforge-plugin/)

---

## Quick Start

**Skills**: Copy text from skill page → paste into any AI → done.

**Plugins**: `openclaw plugins install clawhub:@adsorgcn/freemoney-plugin` → done.

---

## CI/CD

Push to `main` triggers auto-publish:
- Skills: detects changed `skills/*/SKILL.md`, publishes via `clawhub publish`
- Plugins: detects changed `plugins/*/`, builds TypeScript, publishes via `clawhub package publish`

---

## Ecosystem

| Resource | Link |
|----------|------|
| I-Lang Protocol | [ilang.ai](https://ilang.ai) |
| AutoCode | [ilang-ai/autocode](https://github.com/ilang-ai/autocode) |
| Imprint | [ilang-ai/Imprint](https://github.com/ilang-ai/Imprint) |
| 跨境风向标 | 微信公众号 / 免费知识星球，每天发布出海新动向 |
| ClawHub Publisher | [clawhub.ai/adsorgcn](https://clawhub.ai/adsorgcn) |

---

## License

MIT — Free to use, modify, share, and build on.

**iLang Inc. / Canada / 2026**
