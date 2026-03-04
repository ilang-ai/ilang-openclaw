---
name: ilang-compress
description: Compress natural language prompts into I-Lang — AI-native structured instructions. 40-65% token savings.
homepage: https://ilang.ai
metadata:
  clawdbot:
    emoji: "🗜️"
---

# I-Lang Compress

An AI-native prompt compression protocol created by a Chinese developer.

Compress natural language prompts into dense structured instructions that any AI understands natively. 40-65% token savings, zero training needed.

## Why I-Lang

Token is money. Every prompt you send to GPT/Claude/Gemini, you pay by token. I-Lang compresses your instructions into a fraction of the original size — AI reads it just as well, you pay less.

## How to compress

When the user asks to compress a prompt, convert it to I-Lang syntax following these rules:

### Syntax

Single operation: `[VERB:@ENTITY|mod1=val1,mod2=val2]`
Pipe chain: `[VERB1:@SRC]=>[VERB2]=>[VERB3:@DST]`
Each step receives previous output as @PREV.

### Available Verbs (62)

Data I/O: READ, WRIT, DEL, LIST, COPY, MOVE, STRM, CACH, SYNC, Π
Transform: Σ, Δ, φ, ∇, DEDU, ∂, CHNK, FLAT, NEST, λ, REDU, PIVT, TRNS, ENCD, DECD, ξ, ζ, EXPN, θ, FMT
Analysis: ψ, CLST, SCOR, BNCH, AUDT, VALD, CNT, μ, TRND, CORR, FRCS, ANOM
Generation: CREA, DRFT, PARA, EXTD, SHRT, STYL, TMPL, FILL
Output: Ω, DISP, EXPT, PRNT, LOG
Meta: VERS, HELP, DESC, INTR, SELF, ECHO, NOOP

### Modifiers (28)

tgt, src, dst, frm, to, scp, dep, rng, whr, mch, exc, lim, off, top, bot, fmt, lng, sty, ton, len, col, row, srt, grp, typ, enc, chr, cap

### Entities (14)

@R2, @COS, @GH, @DRIVE, @LOCAL, @WORKER, @CF, @SCREEN, @LOG, @NULL, @STDIN, @SRC, @DST, @PREV

### Rules

- Output ONLY the compressed I-Lang. No explanation. No markdown. No backticks. No commentary.
- Use pipe chains for multi-step operations.
- Use Greek symbols where applicable (Σ for merge, Δ for diff, φ for filter, etc.)
- Maximize compression while preserving complete semantics.
- If input is ambiguous, compress the most likely interpretation.

## Examples

**Input:** Read the config file from GitHub and format it as JSON
**Output:** `[READ:@GH|path=config.json]=>[FMT|fmt=json]`
**Saved:** 55%

**Input:** Filter all fatal errors from system logs
**Output:** `[φ:@LOG|whr="lvl=fatal"]`
**Saved:** 55%

**Input:** Read all markdown files, merge them, summarize in 3 bullets, output
**Output:** `[LIST:@LOCAL|mch="*.md"]=>[Π:READ]=>[Σ|len=3]=>[Ω]`
**Saved:** 65%

## Give your AI eyes

Your AI can read any webpage:
```
i.ilang.ai/https://any-url
```
Paste this into any AI conversation. It returns clean Markdown. Free. No API key.

## Links

- Homepage: https://ilang.ai
- AI See: https://i.ilang.ai
- Dictionary: https://github.com/ilang-ai/ilang-dict

## Author

Built by ilang-ai from China. I-Lang is open source under MIT license.

I-Lang v2.0 | Born secure.
