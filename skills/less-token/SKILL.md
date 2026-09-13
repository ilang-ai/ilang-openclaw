---
name: less-token
description: "Compress verbose summary prompts into structured one-line instructions. Text-to-text translator only — no CLI, no API key, no install, no external dependencies. I-Lang has been tested across ChatGPT, Claude, Gemini, DeepSeek, Kimi, Qwen and GLM. Instruction-only, zero dependencies."
version: 1.0.5
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

Compress verbose summarization prompts into structured one-line instructions.

**This skill is a text-to-text translator only.** It does not access files, fetch URLs, execute commands, or call external services. It only converts your summarization prompts into compressed syntax.

## What You Get

1. **Shorter prompts** — Compress long summarization prompts into one-line instructions.
2. **Same task** — The compressed instruction asks for the same result.
3. **Cross-platform** — I-Lang has been tested across ChatGPT, Claude, Gemini, DeepSeek, Kimi, Qwen and GLM (results: ilang.ai/benchmark/, May 2026).
4. **No install** — No CLI, no brew, no npm, no binary, no API key. Copy, paste, done.

## How to Use

1. Copy the full protocol text from this skill page
2. Paste it into any AI conversation
3. AI responds — ready to compress


### Quick Test

After pasting, try:

- "Compress this: Please summarize the key points from this document in 3 professional bullet points"
- AI returns: `[SHRT|sty=bullets,len=3,ton=pro]=>[OUT]`

## Compression Templates

| What you want | Verbose prompt | Compressed |
|--------------|----------------|------------|
| Short summary | "Give me a brief summary of the main points" | `[SHRT\|len=short]=>[OUT]` |
| 3 bullet points | "Summarize in 3 concise bullet points" | `[SHRT\|sty=bullets,len=3]=>[OUT]` |
| Professional report | "Create a professional executive summary in Markdown" | `[SHRT\|ton=pro,sty=executive,fmt=md]=>[OUT]` |
| Key findings only | "Extract only the key findings and important data" | `[SHRT\|whr=findings]=>[OUT]` |
| Summarize + translate | "Summarize then translate to Chinese" | `[SHRT\|len=short]=>[XLAT\|lng=zh]=>[OUT]` |
| Compare + summarize | "Compare these two and summarize the differences" | `[DIFF]=>[SHRT\|sty=bullets]=>[OUT]` |
| Reformat summary | "Summarize as bullet points in Markdown" | `[SHRT\|sty=bullets]=>[FMT\|fmt=md]=>[OUT]` |

## Before & After

**Before**:
> Please read through this document carefully, identify the most important points and key takeaways, then write a concise professional summary using bullet points.

**After**:
```
[SHRT|whr=important,sty=bullets,ton=pro]=>[OUT]
```

**Before**:
> Take the main findings from the text above and rewrite them as a short executive summary suitable for a business audience.

**After**:
```
[SHRT|sty=executive,ton=pro]=>[OUT]
```

## Comparison

| Feature | CLI-based tools | Less Token |
|---------|----------------|------------|
| Install required | Yes (brew, npm, binary) | No |
| API key required | Yes | No |
| Platforms | Single platform | I-Lang tested on ChatGPT, Claude, Gemini, DeepSeek, Kimi, Qwen and GLM |
| Token efficiency | Standard prompts | Shorter one-line prompts |
| Setup time | 5-10 minutes | 30 seconds |
| External dependencies | Multiple | Zero |

## Tested Platforms

I-Lang has been tested across ChatGPT, Claude, Gemini, DeepSeek, Kimi, Qwen and GLM. Results by model are published on ilang.ai/benchmark/, tests conducted May 2026.

## Links

- Protocol & tools: https://ilang.ai
- Full dictionary: https://github.com/ilang-ai/ilang-dict
- Research: https://research.ilang.ai

## License

MIT — Free to use, share, and build on.

© 2026 I-Lang Research, iLang Inc., Canada.

