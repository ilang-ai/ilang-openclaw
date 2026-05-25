# I-Lang Skills for OpenClaw / Hermes / Any AI Agent

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/Platform-8%2B%20AIs%20Tested-brightgreen)](#compatible-platforms)
[![Skills](https://img.shields.io/badge/Skills-5%20Published-blue)](#skills)
[![Protocol](https://img.shields.io/badge/I--Lang-v3.0%20%7C%2088%20Verbs-purple)](https://ilang.ai)
[![Install](https://img.shields.io/badge/Install-Zero%20Dependencies-orange)](#quick-start)

> **I-Lang is not a human language simplified for AI. It is the native language of AI.**
>
> 88 verbs. Zero install. Zero ambiguity. Say it once, get it right.

---

## What is I-Lang

A communication protocol for humans and AI. Like HTTP standardized the web, I-Lang standardizes how you talk to AI and how AI agents talk to each other.

**No CLI. No API key. No brew. No npm.** Copy a text block, paste into any AI, instant upgrade. Every skill is instruction-only with zero dependencies.

---

## Skills

### freemoney `v1.1.1` -- Free Money (Class Action Tracker)

Track 60+ open US class action settlements. Get notified of new claims. Filter no-proof cases. Chinese interface, real-time data from api.ilang.ai.

```
"有什么新案子？"  "哪些不需要凭证？"  "怎么申请Google那个？"
```

Data sources: OpenClassActions + TopClassActions + ClaimDepot, updated daily.

[**Install on ClawHub**](https://clawhub.ai/adsorgcn/freemoney) | [**Details**](./freemoney/SKILL.md)

---

### everything-is-ok `v1.0.2` -- Make Any AI Better

One skill to rule them all. Structured execution, complete answers, finished deliverables.

```
[SUM|sty=bullets,ton=pro,fmt=md]=>[OUT]
```

[**Install on ClawHub**](https://clawhub.ai/adsorgcn/everything-is-ok)

---

### no-prompt `v1.0.0` -- End of Prompt Engineering

Stop learning prompt techniques. Tell AI what you want in plain language. AI writes the perfect I-Lang instruction for you.

```
Old way:    Human learns prompt engineering -> writes prompt -> sends to AI
No Prompt:  Human says what they want -> AI writes I-Lang -> copy to any AI
```

[**Install on ClawHub**](https://clawhub.ai/adsorgcn/no-prompt)

---

### less-token `v1.0.2` -- Compress Prompts

Compress verbose prompts into one-line I-Lang instructions. 40-65% fewer tokens, same result.

```
Before: "Please summarize the key findings in professional bullet points"
After:  [SUM|key=findings,sty=bullets,ton=pro]=>[OUT]
```

[**Install on ClawHub**](https://clawhub.ai/adsorgcn/less-token)

---

### ilang-compress `v2.3.1` -- Original Compression

The original I-Lang compression skill. Translate any natural language prompt into I-Lang syntax.

[**Install on ClawHub**](https://clawhub.ai/adsorgcn/ilang-compress)

---

## Quick Start

```
Step 1: Pick a skill above
Step 2: Copy the protocol text from its skill page
Step 3: Paste into any AI conversation
Step 4: Done.
```

Works inside OpenClaw, Hermes, YouMind, and outside -- any AI, any platform.

---

## Distribution

| Platform | Link |
|----------|------|
| ClawHub | [clawhub.ai/adsorgcn](https://clawhub.ai/adsorgcn) |
| Hermes (agentskills.io) | `hermes skills install` |
| YouMind | [youmind.com](https://youmind.com) |
| GitHub | This repo -- clone and use directly |

---

## How It's Different

```
Traditional Skills:
  brew install -> config API key -> restart agent -> use
  Single platform. Dependencies. Setup time.

I-Lang Skills:
  copy text -> paste into AI -> use
  Every platform. Zero deps. 30 seconds.
```

---

## Security

All skills pass ClawHub security scan with **Benign -- High Confidence**:

- Instruction-only -- no code, no scripts, no binaries
- Zero credentials -- no API keys, no env vars, no tokens
- Zero network access -- no URLs fetched, no external calls
- Text-to-text protocol -- converts natural language to structured syntax

---

## Compatible Platforms

| Platform | Tested | Platform | Tested |
|----------|--------|----------|--------|
| ChatGPT / GPT-4o | Yes | Kimi | Yes |
| Claude | Yes | DeepSeek | Yes |
| Gemini | Yes | Qwen | Yes |
| OpenClaw | Yes | Hermes | Yes |

---

## Ecosystem

| Resource | Link |
|----------|------|
| Protocol & Dictionary | [ilang.ai](https://ilang.ai) -- 88 verbs, 13 symbol aliases |
| Spec & Source | [ilang-ai/ilang-spec](https://github.com/ilang-ai/ilang-spec) |
| AI See | [i.ilang.ai](https://i.ilang.ai) -- Give AI eyes to see any URL |
| AutoCode | [ilang-ai/autocode](https://github.com/ilang-ai/autocode) -- 38+ skills for Claude Code / Cursor |
| Imprint | [ilang-ai/Imprint](https://github.com/ilang-ai/Imprint) -- AI personality persistence |
| Research | [ORCID 0009-0004-4540-8082](https://orcid.org/0009-0004-4540-8082) |
| Book | Amazon ASIN B0CZY6V3GM |

---

## License

MIT -- Free to use, modify, share, and build on.

**I-Lang Research / iLang Inc. / Canada / 2026**
