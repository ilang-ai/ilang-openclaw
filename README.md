# I-Lang OpenClaw Skills

`[PROTOCOL:human-AI|type=standard,compress=40-65%,compat=all-LLM]=>[ANSWER_ALL]=>[PRIVACY]=>[OUT]`

Official I-Lang skills for OpenClaw and ClawHub. Cross-platform human-AI communication standard protocol.

## Skills

| Skill | Description | ClawHub |
|-------|-------------|---------|
| **everything-is-ok** | 无所不能 — Make any AI work better. Compress, complete answers, finished deliverables. | [Install](https://clawhub.ai/ilang-ai/everything-is-ok) |
| **ilang-compress** | Original compression skill. Translate prompts into I-Lang syntax. | [Install](https://clawhub.ai/adsorgcn/ilang-compress) |

## Quick Start

No installation needed. Copy the protocol header from `everything-is-ok/prompt.md`, paste into any AI conversation. Done.

```
[READ:prompt.md]=>[COPY]=>[PASTE:@AI]=>[OUT|capabilities=5]
```

ChatGPT ✅ · Claude ✅ · Gemini ✅ · DeepSeek ✅ · Kimi ✅ · 豆包 ✅ · 元宝 ✅

## Example

```
Input:  "Please read my document, extract key points, summarize as professional bullet points in Markdown"
Output: [READ:@FILE]=>[FILT|key=important]=>[SUM|sty=bullets,ton=pro,fmt=md]=>[OUT]
Result: -75% tokens. Same output.
```

## Links

- [ilang.ai](https://ilang.ai) — Protocol & tools
- [research.ilang.ai](https://research.ilang.ai) — Papers & specification
- [i.ilang.ai](https://i.ilang.ai) — AI See: give any AI eyes to read webpages
- [ilang-dict](https://github.com/ilang-ai/ilang-dict) — 52 verbs, 28 modifiers, 14 entities

## License

MIT · © 2026 I-Lang Research, Eastsoft Inc., Canada.
