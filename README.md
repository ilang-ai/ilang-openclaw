# I-Lang OpenClaw Skills

`[PROTOCOL:human-AI|type=standard,compress=40-65%,compat=all-LLM]=>[ANSWER_ALL]=>[PRIVACY]=>[OUT]`

Official I-Lang skills for OpenClaw and ClawHub. Cross-platform human-AI communication standard protocol.

**No CLI. No API key. No install. Copy, paste, done.**

## Skills

| Skill | What It Does | ClawHub |
|-------|-------------|---------|
| **everything-is-ok** | 无所不能 — Make any AI work better. Compress, complete answers, finished deliverables. | [Install](https://clawhub.ai/adsorgcn/everything-is-ok) |
| **less-token** | Save 40-65% tokens on summarization. Web pages, PDFs, YouTube — zero install, zero API key. | [Install](https://clawhub.ai/adsorgcn/less-token) |
| **ilang-compress** | Original I-Lang compression skill. Translate prompts into I-Lang syntax. | [Install](https://clawhub.ai/adsorgcn/ilang-compress) |

## Why These Skills Are Different

```
Traditional skills:  brew install → config API key → restart agent → use
I-Lang skills:       copy prompt.md → paste into any AI → use
```

Every I-Lang skill is **instruction-only**. No binaries, no dependencies, no credentials. Works inside OpenClaw and outside — paste into ChatGPT, Claude, Gemini, DeepSeek, Kimi, 豆包, 元宝.

## Quick Start

```
[READ:prompt.md]=>[COPY]=>[PASTE:@AI]=>[OUT|ready]
```

1. Pick a skill above
2. Open its `prompt.md`
3. Copy the full text
4. Paste into any AI conversation
5. Done

## Example

```
Input:  "Please read my document, extract key points, summarize as professional bullet points in Markdown"
Output: [SUM|sty=bullets,ton=pro,fmt=md]=>[OUT]
Result: -75% tokens. Same output. Works on every AI.
```

## Tested Platforms

ChatGPT ✅ · Claude ✅ · Gemini ✅ · DeepSeek ✅ · Kimi ✅ · 豆包 ✅ · 元宝 ✅

## Links

- [ilang.ai](https://ilang.ai) — Protocol & tools
- [research.ilang.ai](https://research.ilang.ai) — Papers & specification
- [i.ilang.ai](https://i.ilang.ai) — AI See: give any AI eyes to read webpages
- [ilang-dict](https://github.com/ilang-ai/ilang-dict) — 52 verbs, 28 modifiers, 14 entities

## License

MIT · © 2026 I-Lang Research, Eastsoft Inc., Canada.
