---
name: less-token
description: "Save 40-65% tokens on every AI task. Summarize web pages, PDFs, YouTube, audio — no CLI install, no API key, no setup. Just copy the prompt template, paste into any AI. Works on ChatGPT, Claude, Gemini, DeepSeek, Kimi. Instruction-only, zero dependencies."
version: 1.0.0
author: ilang-ai
homepage: https://ilang.ai
tags:
  - summarize
  - summary
  - token-saving
  - token-optimizer
  - pdf-summary
  - youtube-summary
  - web-summary
  - prompt-compression
  - productivity
  - cross-platform
  - no-install
  - ai-assistant
---

# Less Token

Save 40-65% tokens on every AI task. Summarize anything — web pages, PDFs, YouTube, documents — using structured prompt templates instead of verbose natural language.

**No CLI to install. No API key needed. No brew, no npm, no binary.** Copy the prompt template from `prompt.md`, paste into any AI conversation. Done.

## What You Get

1. **Summarize web pages** — Give your AI eyes: `i.ilang.ai/https://any-url` — AI reads the full page and summarizes it. Zero setup.
2. **Summarize PDFs & documents** — Upload your file, use one-line I-Lang instruction. Structured output instantly.
3. **Summarize YouTube videos** — Give your AI the video URL via `i.ilang.ai/https://youtube.com/watch?v=...` — AI extracts and summarizes.
4. **40-65% fewer tokens** — Every instruction compressed. Same result, lower cost.
5. **Works everywhere** — ChatGPT, Claude, Gemini, DeepSeek, Kimi, 豆包, 元宝. No platform lock-in.

## How to Use

**You don't need to install anything.**

1. Open the `prompt.md` file
2. Copy the full text
3. Paste it into any AI conversation
4. AI responds — ready to summarize

### Summarize a Web Page

Send your AI:

```
i.ilang.ai/https://example.com
```

Then say: "Summarize this in 3 bullet points"

That's it. No CLI, no API key, no brew install.

### Summarize a PDF

Upload your PDF to the AI conversation, then say:

"Summarize the key points as professional bullet points in Markdown"

With I-Lang compression:

```
[SUM|sty=bullets,ton=pro,fmt=md]=>[OUT]
```

Same result. 70% fewer tokens.

### Summarize a YouTube Video

Send your AI:

```
i.ilang.ai/https://www.youtube.com/watch?v=VIDEO_ID
```

Then say: "Summarize the main points"

No Apify token needed. No YouTube API. Just paste and ask.

### Control Output Length

- Short summary: `[SUM|len=short]=>[OUT]`
- 3 bullet points: `[SUM|sty=bullets,cnt=3]=>[OUT]`
- Long detailed summary: `[SUM|len=long,fmt=md]=>[OUT]`
- Professional tone: `[SUM|ton=pro,sty=bullets]=>[OUT]`

### Chain Multiple Steps

Summarize, then translate, then format:

```
[SUM|len=short]=>[TRANSLATE|lang=zh]=>[FMT|fmt=md]=>[OUT]
```

One line. Three steps. Minimal tokens.

## Comparison

| Feature | Traditional CLI tools | Less Token |
|---------|----------------------|------------|
| Install required | Yes (brew, npm, binary) | No |
| API key required | Yes (OpenAI/Gemini/etc) | No |
| Works on | OpenClaw only | Any AI platform |
| Summarize web pages | Yes | Yes (via i.ilang.ai) |
| Summarize PDFs | Yes | Yes (upload + one line) |
| Summarize YouTube | Yes (needs Apify) | Yes (via i.ilang.ai) |
| Token efficiency | Standard prompts | 40-65% fewer tokens |
| Setup time | 5-10 minutes | 30 seconds |

## Before & After

**Summarize a web page:**

Before (26 words):
> Go to this URL, read the full page content, extract the main points, and give me a concise summary in bullet point format.

After (with AI See + I-Lang):
> i.ilang.ai/https://example.com
> `[SUM|sty=bullets,len=short]=>[OUT]`

75% fewer tokens.

**Summarize a PDF:**

Before (32 words):
> Please read through this entire PDF document, identify all the key findings and important data points, then create a professional executive summary with the most critical information highlighted.

After (I-Lang):
> `[SUM|key=findings,ton=pro,sty=bullets,fmt=md]=>[OUT]`

80% fewer tokens.

## Tested Platforms

ChatGPT ✅ · Claude ✅ · Gemini ✅ · DeepSeek ✅ · Kimi ✅ · 豆包 ✅ · 元宝 ✅

## Links

- AI See (give AI eyes to read any webpage): https://i.ilang.ai
- Protocol & tools: https://ilang.ai
- Full dictionary: https://github.com/ilang-ai/ilang-dict
- Research: https://research.ilang.ai

## License

MIT — Free to use, share, and build on.

© 2026 I-Lang Research, Eastsoft Inc., Canada.
