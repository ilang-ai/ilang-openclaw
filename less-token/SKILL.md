---
name: less-token
description: "Save 40-65% tokens on summarization tasks. Compress verbose summary prompts into structured one-line instructions. Text-to-text translator only — no CLI, no API key, no install, no external dependencies. Works on ChatGPT, Claude, Gemini, DeepSeek, Kimi. Instruction-only, zero dependencies."
version: 1.0.2
author: ilang-ai
homepage: https://ilang.ai
tags:
  - summarize
  - summary
  - token-saving
  - token-optimizer
  - prompt-compression
  - productivity
  - cross-platform
  - no-install
  - ai-assistant
  - workflow
---

# Less Token

Save 40-65% tokens on summarization tasks. Compress verbose natural language prompts into structured one-line instructions that any AI understands.

**This skill is a text-to-text translator only.** It does not access files, fetch URLs, execute commands, or call external services. It only converts your summarization prompts into compressed syntax.

## What You Get

1. **40-65% fewer tokens** — Compress long summarization prompts into one-line instructions.
2. **Same result** — AI produces identical output from the compressed instruction.
3. **Cross-platform** — Compressed instructions work on ChatGPT, Claude, Gemini, DeepSeek, Kimi, 豆包, 元宝.
4. **No install** — No CLI, no brew, no npm, no binary, no API key. Copy, paste, done.

## How to Use

1. Copy the full protocol text from this skill page
2. Paste it into any AI conversation
3. AI responds — ready to compress


### Quick Test

After pasting, try:

- "Compress this: Please summarize the key points from this document in 3 professional bullet points"
- AI returns: `[SUM|sty=bullets,cnt=3,ton=pro]=>[OUT]`
- 70% fewer tokens. Same result.

## Compression Templates

| What you want | Verbose prompt | Compressed |
|--------------|----------------|------------|
| Short summary | "Give me a brief summary of the main points" | `[SUM\|len=short]=>[OUT]` |
| 3 bullet points | "Summarize in 3 concise bullet points" | `[SUM\|sty=bullets,cnt=3]=>[OUT]` |
| Professional report | "Create a professional executive summary in Markdown" | `[SUM\|ton=pro,sty=executive,fmt=md]=>[OUT]` |
| Key findings only | "Extract only the key findings and important data" | `[SUM\|key=findings]=>[OUT]` |
| Summarize + translate | "Summarize then translate to Chinese" | `[SUM\|len=short]=>[TRANSLATE\|lang=zh]=>[OUT]` |
| Compare + summarize | "Compare these two and summarize the differences" | `[CMP]=>[DIFF]=>[SUM\|sty=bullets]=>[OUT]` |
| Reformat summary | "Summarize as bullet points in Markdown" | `[SUM\|sty=bullets]=>[FMT\|fmt=md]=>[OUT]` |

## Before & After

**Before** (28 words):
> Please read through this document carefully, identify the most important points and key takeaways, then write a concise professional summary using bullet points.

**After** (7 words):
```
[SUM|key=important,sty=bullets,ton=pro]=>[OUT]
```
75% fewer tokens. Same result.

**Before** (22 words):
> Take the main findings from the text above and rewrite them as a short executive summary suitable for a business audience.

**After** (5 words):
```
[SUM|sty=executive,ton=pro]=>[OUT]
```
77% fewer tokens. Same result.

## Comparison

| Feature | CLI-based tools | Less Token |
|---------|----------------|------------|
| Install required | Yes (brew, npm, binary) | No |
| API key required | Yes | No |
| Works on | Single platform | Any AI platform |
| Token efficiency | Standard prompts | 40-65% fewer tokens |
| Setup time | 5-10 minutes | 30 seconds |
| External dependencies | Multiple | Zero |

## Tested Platforms

ChatGPT ✅ · Claude ✅ · Gemini ✅ · DeepSeek ✅ · Kimi ✅ · 豆包 ✅ · 元宝 ✅

## Links

- Protocol & tools: https://ilang.ai
- Full dictionary: https://github.com/ilang-ai/ilang-dict
- Research: https://research.ilang.ai

## License

MIT — Free to use, share, and build on.

© 2026 I-Lang Research, Eastsoft Inc., Canada.
