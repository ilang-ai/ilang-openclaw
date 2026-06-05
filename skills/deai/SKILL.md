---
name: deai
version: 1.0.0
description: "deAI — Remove AI fingerprint from any text. Three-layer methodology: subtract fingerprint words, mark positions for human voice, restructure for natural rhythm. Supports Chinese, English, Japanese, Korean. Pairs with detect.ilang.cn for verification. 去AI味引擎：减法删指纹词、加法标注口语位置、反问替换陈述。"
author: ilang-ai
homepage: https://ilang.ai
tags:
  - deai
  - ai-detection
  - content
  - writing
  - fingerprint
  - humanize
  - multilingual
  - cross-platform
---

# deAI — Remove the AI from Your Text

# deAI — 去AI味引擎

---

## English

### The Problem

AI-generated text has a fingerprint. Not just the words it uses too much ("Furthermore", "值得注意的是"), but the words it NEVER uses. Real humans write with slang, imperfection, uneven rhythm, rhetorical questions. AI writes clean. **Too clean IS the fingerprint.**

Every AI detector exploits this. Every reader senses it.

### Three-Layer Methodology

```
[Layer 1] SUBTRACT   — Delete fingerprint words. 21 Chinese + 15 English + Japanese + Korean lists built in.
[Layer 2] ADD MARKERS — Mark positions where YOUR human voice should go. AI never inserts slang for you (AI-inserted slang has AI flavor).
[Layer 3] RESTRUCTURE — Rhetorical questions replace statements. Sentence rhythm varies. Opinions lead, evidence follows. Numbers replace adjectives.
```

### What makes this different

Other "humanizer" tools paraphrase — they rewrite AI text with a thesaurus. The output still reads like AI with different words.

deAI doesn't rewrite. It strips, restructures, and marks. The final human touch comes from YOU — because only you can add YOUR voice. That's why it passes detectors: the voice is real.

### Supported Languages

| Language | Fingerprint words | Colloquial markers | Platform rules |
|----------|------------------|-------------------|----------------|
| Chinese 中文 | 21 words | 说白了/搞毛/讲真/离谱 | WeChat, X |
| English | 15 words | tbh/ngl/fwiw/lowkey | HN, Reddit, X |
| Japanese 日本語 | 10 words | ぶっちゃけ/マジで/ヤバい | — |
| Korean 한국어 | 8 words | 솔직히/진짜/대박 | — |

### Platform Optimization

Tell deAI your target platform and it applies platform-specific rules:

| Platform | Tone | Ending style | Brand rules |
|----------|------|-------------|-------------|
| WeChat 微信 | Blogger "I" | Rhetorical Q + comment prompt | Claude→A社, OpenAI→O社 |
| X/Twitter | Journalist observer | Verdict, escalate to systemic | Full names OK |
| Hacker News | Developer essay | Quiet understatement | Full names OK |
| Reddit | Casual conversation | One line close | Full names OK |

### Detect + deAI = Attack & Defense Pair

| Tool | Role |
|------|------|
| [detect.ilang.cn](https://detect.ilang.cn) | Diagnose — score how AI your text looks |
| deAI (this skill) | Treat — strip the AI fingerprint |

Run detect → score too high → run deAI → run detect again → score drops. Closed loop.

### How to Use

1. Open `prompt.md`, copy the full text
2. Paste into any AI (Claude, ChatGPT, Gemini, DeepSeek, etc.)
3. Paste your AI-generated text and say: "deAI this" or "去AI味"
4. Optionally specify platform: "deAI this for WeChat" or "去AI味，目标微信"
5. Review the output: [💬] markers show where to add your own expressions
6. Add your voice at the markers, done

### How to Auto-Apply

To make deAI run on every content output automatically:

**Claude Code / Cursor:** Add to your `.claude` or `.cursorrules`:
```
All content output must pass through deAI before delivery.
Apply: subtract fingerprints → vary rhythm → add [💬] markers → platform-adapt.
```

**OpenClaw:** Install this skill. Set trigger: any content generation task auto-chains deAI as final step.

**Manual workflow:** Generate content with any AI → paste into a deAI session → review markers → publish.

---

## 中文

### 痛点

AI生成的文字有指纹。不只是它用太多的词（"值得注意的是"、"Furthermore"），更是它**永远不用**的词。真人写东西带情绪、带俚语、带粗糙、带反问。AI写得太干净了。**太干净本身就是最大的指纹。**

所有AI检测器都在利用这一点。所有读者都能感觉到。

### 三层方法论

```
[第一层] 减法     — 删掉指纹词。内置21个中文+15个英文+日文+韩文指纹词表。
[第二层] 加法标注  — 标注应该加入人味的位置。AI不替你加俚语（AI加的俚语本身就有AI味）。
[第三层] 结构重塑  — 反问替换陈述、句子节奏变化、观点前置、数字替换形容词。
```

### 跟别的"去AI味"工具有什么不同

其他工具是改写——用同义词替换AI文字。改完还是AI味，只是换了个词。

deAI不改写。它剥离、重组、标注。最后的人味由**你自己加**——因为只有你能加你自己的声音。这就是为什么能过检测器：因为声音是真的。

### 检测 + 去AI味 = 攻防一体

| 工具 | 作用 |
|------|------|
| [detect.ilang.cn](https://detect.ilang.cn) | 诊断——打分看AI味有多重 |
| deAI（本技能）| 治疗——去掉AI指纹 |

跑detect → 分太高 → 跑deAI → 再跑detect → 分降了。闭环。

### 使用方法

1. 打开 `prompt.md`，复制全文
2. 粘贴到任何AI（Claude、ChatGPT、Gemini、DeepSeek等）
3. 粘贴你的AI生成文字，说："去AI味"
4. 可选指定平台："去AI味，目标微信"
5. 查看输出：[💬] 标记了应该加口语的位置
6. 在标记处加入你自己的表达，完成

### 自动化

让deAI在每次内容产出时自动运行：

**Claude Code / Cursor：** 在 `.claude` 或 `.cursorrules` 中加入：
```
所有内容输出交付前必须经过deAI处理。
执行：删指纹词 → 调节奏 → 加[💬]标注 → 平台适配。
```

**OpenClaw：** 安装本技能，设置触发：任何内容生成任务自动串联deAI作为最后一步。

**手动流程：** 用任何AI生成内容 → 粘贴到deAI会话 → 审查标注 → 发布。

---

## 日本語

### deAIとは

AI生成テキストからAIの指紋を除去するツールです。3層のプロセス：指紋ワードの削除、人間らしい表現位置のマーキング、文章構造の再構築。

`prompt.md` をAIに貼り付け、AI生成テキストを入力し、「deAIして」と伝えてください。

---

## 한국어

### deAI란

AI가 생성한 텍스트에서 AI의 흔적을 제거하는 도구입니다. 3단계 프로세스: 지문 단어 삭제, 사람다운 표현 위치 마킹, 문장 구조 재구성.

`prompt.md`를 AI에 붙여넣고, AI 생성 텍스트를 입력한 후 "deAI 해줘"라고 말하세요.

---

## Ecosystem / 生态

| Resource | Link |
|----------|------|
| detect.ilang.cn (AI detection) | [detect.ilang.cn](https://detect.ilang.cn) |
| AutoCode | [ilang-ai/autocode](https://github.com/ilang-ai/autocode) |
| I-Lang Protocol | [ilang.ai](https://ilang.ai) |
| OpenClaw Skills | [ilang-ai/ilang-openclaw](https://github.com/ilang-ai/ilang-openclaw) |

## License

MIT — Free to use, share, and build on.

© 2026 iLang Inc., Canada.
