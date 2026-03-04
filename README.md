# I-Lang Compress

An AI-native prompt compression protocol created by a Chinese developer.

Compress natural language prompts into dense structured instructions that any AI understands natively. 40-65% token savings, zero training needed.

## Why I-Lang

Token is money. Every prompt you send to GPT/Claude/Gemini, you pay by token. I-Lang compresses your instructions into a fraction of the original size — AI reads it just as well, you pay less.

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

## Links

- Homepage: https://ilang.ai
- Dictionary: https://github.com/ilang-ai/ilang-dict

## Author

Built by ilang-ai from China. I-Lang is open source under MIT license.

I-Lang v2.0
