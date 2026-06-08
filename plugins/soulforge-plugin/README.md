# SoulForge — Expression DNA Distiller

Analyzes writing style and extracts expression DNA using a three-step method (observe facts → deduce traits → verify with corpus). User reviews preview and confirms before any file write.

## Install

```bash
openclaw plugins install clawhub:@adsorgcn/soulforge-plugin
```

## Post-install configuration

Add the plugin to your tool allowlist in `~/.openclaw/openclaw.json`:

```json
{
  "tools": {
    "alsoAllow": ["@adsorgcn/soulforge-plugin"]
  }
}
```

## Three tools

**soulforge_distill_search** — Input a person's name. Returns a structured collection task for the agent to gather biographical facts and writing corpus.

**soulforge_distill_corpus** — Input collected corpus text (and optional bio). Returns a three-step distillation prompt for the agent to execute with its own model.

**soulforge_write** — Receives the distilled SOUL content. Shows a preview with a token. Only writes to SOUL.md after user confirms with the matching token. Backs up old file with timestamp.

## Workflow

```
soulforge_distill_search("person name")
  → agent collects bio facts + writing corpus
  → agent calls soulforge_distill_corpus(text, source, bio)
  → agent gets distillation prompt, executes it with its own model
  → agent calls soulforge_write(content, source, confirmed=false)
  → user reviews preview
  → user confirms
  → agent calls soulforge_write(content, source, confirmed=true, preview_token)
  → SOUL.md updated (old version backed up)
```

## What it extracts

7 dimensions of writing fingerprint, each with WHAT + WHY + EVIDENCE + CONFIDENCE:

- **opening** — how they start (data-first? story? question?)
- **vocabulary** — signature words, never-used words
- **rhythm** — paragraph length, alternation pattern
- **question** — rhetorical question frequency and style
- **ending** — how they close (callback? punchline? question?)
- **tone** — overall perspective and stance
- **audience** — target reader profile

## Three-step method

1. **Observe**: extract biographical facts (birthday → zodiac, education, career) + corpus statistics (word frequency, paragraph length, question rate)
2. **Deduce**: generate personality hypotheses from bio facts → verify each with corpus → assign confidence (HIGH/MEDIUM/LOW)
3. **Output**: each GENE includes WHAT + WHY + EVIDENCE + CONFIDENCE

Weight: corpus 100% > behavioral facts 70% > biographical facts 30% > zodiac 15%. Corpus always wins in conflicts.

## Corpus sources

- Exported articles from any public account (txt format)
- Personal writing, notes, social media posts
- Public articles, speeches, interview transcripts

Minimum 500 characters to distill. 5000+ characters recommended.

## Output format

I-Lang GENE format, written to the agent workspace SOUL.md:

```
::ILANG::v4.0
[TYPE:soul]
[SOURCE:distilled from person_name]

[IDENTITY]
  NAME: person_name
  ZODIAC: derived from birthdate
  CORE_TRAIT: verified core traits

::GENE{opening|style:data-first|confidence:HIGH}
  T: opening habit
  WHY: deduced cause
  EVIDENCE: corpus examples
```

## Data and privacy

- Corpus is sent to the AI model you configured (via your relay/provider) for analysis. Data handling depends on your model provider's policy.
- Preview is shown before any write. Write requires explicit user confirmation with a matching preview token.
- Old SOUL.md is backed up with timestamp before overwrite.
- SOUL.md is a local file; no external service dependency after distillation.
- If corpus contains sensitive information, consider redacting before use.

## Related tools

| Tool | Purpose |
|------|---------|
| [SoulForge (this plugin)](https://clawhub.ai/plugins/@adsorgcn/soulforge-plugin) | Extract writing DNA |
| [WeChat-Awesome](https://clawhub.ai/adsorgcn/WeChat-Awesome) | Write articles using the extracted style |
| [DeAI](https://clawhub.ai/adsorgcn/DeAI) | Remove AI fingerprint from text |

## License

MIT — © 2026 iLang Inc., Canada
