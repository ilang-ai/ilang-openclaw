---
name: ilang-compress
version: 2.3.4
description: "Compress natural language prompts into I-Lang — AI-native structured instructions. Output is text notation only — review before passing to execution agents."
homepage: https://ilang.ai
metadata:
  clawdbot:
    emoji: "🗜️"
---

# I-Lang Compress

An AI-native prompt compression protocol created by a Chinese developer.

Compress natural language prompts into dense structured instructions. Zero training needed. I-Lang has been tested across ChatGPT, Claude, Gemini, DeepSeek, Kimi, Qwen and GLM (results: ilang.ai/benchmark/, May 2026).

> **Safety note**: I-Lang output is text notation, not executable code. The instruction set includes action verbs (READ, WRIT, DEL, COPY, SYNC) and resource references (@GH, @DRIVE, @LOCAL) that describe operations in compressed form but do not execute by themselves. If you pass compressed output to an agent or tool that interprets these as commands, real actions may be triggered. Always review before feeding to execution environments.

## Why I-Lang

Token is money. Every prompt you send to GPT/Claude/Gemini, you pay by token. I-Lang turns a wordy request into a short structured chain. On ilang.ai/prompt-compression/, a request as people write it goes from 169 to 54 tokens (68%) and a terse rewrite from 58 to 54 tokens (7%), measured with tiktoken cl100k_base.

## How to compress

When the user asks to compress a prompt, convert it to I-Lang syntax following these rules.

### Syntax

Single operation: `[VERB:@ENTITY|mod1=val1,mod2=val2]`
Pipe chain: `[VERB1:@SRC]=>[VERB2]=>[VERB3:@DST]`
Each step receives previous output as @PREV.

### Available Verbs (a subset of the 88)

Data I/O: READ, WRIT, DEL, LIST, COPY, MOVE, STRM, CACH, SYNC, Π
Transform: Σ, Δ, φ, ∇, DEDU, ∂, CHNK, FLAT, NEST, λ, REDU, PIVT, TRNS, ENCD, DECD, ξ, ζ, EXPN, θ, FMT
Analysis: ψ, CLST, SCOR, BNCH, AUDT, VALD, CNT, μ, TRND, CORR, FRCS, ANOM
Generation: CREA, DRFT, PARA, EXPD, SHRT, STYL, TMPL, FILL
Output: Ω, DISP, EXPT, PRNT, LOG
Meta: HELP, DESC, INTR, NOOP

### Modifiers (29 core)

src, dst, path, fmt, lng, sty, ton, len, lim, off, top, bot, srt, grp, whr, mch, exc, dep, rng, typ, enc, cap, pri, col, row, frm, to, scp, op

### Entities (8 core + 6 external)

@R2, @COS, @GH, @DRIVE, @LOCAL, @WORKER, @CF, @SCREEN, @LOG, @NULL, @STDIN, @SRC, @DST, @PREV

### Compression Guidelines

- Output the compressed I-Lang instruction first, then a brief explanation of what each step does.
- Use pipe chains for multi-step operations.
- Use Greek symbols where applicable (Σ for merge, Δ for diff, φ for filter, etc.)
- Maximize compression while preserving complete semantics.
- If input is ambiguous, ask the user for clarification.

## Examples

**Input:** Read the config file from GitHub and format it as JSON
**Output:** `[READ:@GH|path=config.json]=>[FMT|fmt=json]`
**Explanation:** READ fetches from GitHub, FMT converts to JSON format.

**Input:** Filter all fatal errors from system logs
**Output:** `[φ:@LOG|whr="lvl=fatal"]`
**Explanation:** φ (filter) selects only entries matching fatal level.

**Input:** Read all markdown files, merge them, summarize in 3 bullets, output
**Output:** `[LIST:@LOCAL|mch="*.md"]=>[Π:READ]=>[Σ|len=3]=>[Ω]`
**Explanation:** LIST finds files, Π batch-reads, Σ summarizes to 3 items, Ω outputs.

## Links

- Homepage: https://ilang.ai
- Specification: https://ilang.ai/spec/
- Dictionary: https://github.com/ilang-ai/ilang-dict

## Author

Built by iLang Inc. I-Lang is open source under MIT license.

I-Lang v4.0

