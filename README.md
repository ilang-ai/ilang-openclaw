# I-Lang OpenClaw — Skills + Plugins

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Skills](https://img.shields.io/badge/Skills-7%20Published-blue)](#skills)
[![Plugins](https://img.shields.io/badge/Plugins-1%20Published-blue)](#plugins)
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
│   ├── deai/            ← Remove AI fingerprint from text (4 languages)
│   ├── lazarus/         ← Bring dead websites back to life
│   ├── everything-is-ok/← Universal prompt compression
│   ├── no-prompt/       ← AI writes prompts for you
│   ├── less-token/      ← Compress prompts, save tokens
│   └── ilang-compress/  ← Original I-Lang compression engine
├── plugins/             ← Code plugins for OpenClaw runtime
│   └── freemoney-plugin/← 白拿钱 native OpenClaw integration
└── .github/workflows/   ← Auto-publish on push to main
```

---

## Skills

### deai `v1.0.0` -- Remove AI Fingerprint / 去AI味引擎

Three-layer deAI: subtract fingerprint words, mark positions for human voice, restructure for natural rhythm. Supports Chinese, English, Japanese, Korean. Pairs with detect.ilang.cn for verification.

[**Install on ClawHub**](https://clawhub.ai/adsorgcn/deai) | [**Details**](./skills/deai/SKILL.md)

---

### freemoney `v1.3.0` -- 白拿钱 (Free Money)

Track 60+ open US class action settlements. Filter no-proof cases. Chinese interface.

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
| ClawHub Publisher | [clawhub.ai/adsorgcn](https://clawhub.ai/adsorgcn) |

---

## License

MIT — Free to use, modify, share, and build on.

**iLang Inc. / Canada / 2026**
