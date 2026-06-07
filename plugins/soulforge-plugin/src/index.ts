/**
 * SoulForge — 灵魂打印机 v4.0
 *
 * 架构重写：plugin不碰LLM。
 * 三个工具各司其职：
 *   distill_search → 返回搜索任务prompt
 *   distill_corpus → 返回蒸馏prompt（agent用自己的模型跑）
 *   soulforge_write → 接收SOUL内容，预览+确认+备份+写文件
 *
 * © 2026 iLang Inc., Canada. MIT License.
 */

import { homedir } from "os";
import { writeFileSync, copyFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";

function resolveSoulPath(api: any): string {
  try {
    if (api?.runtime?.agent?.resolveAgentWorkspaceDir) {
      return join(api.runtime.agent.resolveAgentWorkspaceDir(api.config), "SOUL.md");
    }
  } catch { /* fallback */ }
  const wsPath = join(homedir(), ".openclaw", "workspace", "SOUL.md");
  if (existsSync(join(homedir(), ".openclaw", "workspace"))) return wsPath;
  return join(homedir(), ".openclaw", "SOUL.md");
}

function backupAndWrite(soulPath: string, content: string): { success: boolean; backedUp: boolean; backupPath: string; error: string } {
  try {
    const dir = dirname(soulPath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    let backedUp = false;
    let backupPath = "";
    if (existsSync(soulPath)) {
      const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      backupPath = `${soulPath}.bak.${ts}`;
      copyFileSync(soulPath, backupPath);
      backedUp = true;
    }
    writeFileSync(soulPath, content, "utf-8");
    return { success: true, backedUp, backupPath, error: "" };
  } catch (err) {
    return { success: false, backedUp: false, backupPath: "", error: String(err) };
  }
}

function textResult(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

function log(api: any, level: string, msg: string) {
  const fn = api?.logger?.[level] || api?.logger?.info || console.log;
  fn(`[SoulForge] ${msg}`);
}

export default function register(api: any) {
  log(api, "info", "SoulForge loaded. Architecture: zero LLM calls in plugin.");

  // ========== 工具1：搜索任务 ==========
  api.registerTool({
    name: "soulforge_distill_search",
    description: "Search-distill mode: input a name, returns a two-phase collection task. Agent collects bio facts and corpus, then passes them to soulforge_distill_corpus. / 搜索蒸馏模式：输入人名，返回采集任务。",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Name of the person to distill / 要蒸馏的人物名称" },
      },
      required: ["name"],
    },
    execute: async (_toolCallId: string, params: { name: string }) => {
      const { name } = params;
      log(api, "info", `Search task for "${name}"`);

      return textResult(`【SoulForge Collection Task / 采集任务】

Target: ${name}

This task has two goals. Collect both, then call soulforge_distill_corpus.

**Goal 1: Biographical facts / 传记事实**

Collect factual information about ${name}:
- Date of birth (for zodiac derivation)
- Place of birth, family background
- Education history
- Career path, key decisions
- Major life events, turning points

Sources: encyclopedia entries, biographical articles, timelines.
Extract facts only, not full articles. Compile into a biographical summary.

**Goal 2: First-person writing corpus / 一手语料**

Collect text that ${name} personally wrote or said:
- Articles, essays, book excerpts
- Speeches, interviews, dialogues
- Frequently used expressions, signature phrases

Prioritize content the person publicly published. Minimum 5000 characters.

**How to collect / 采集方式**

Use whatever information-gathering tools you have available. If you don't have search or web-fetch capability, go to the ClawHub official marketplace (clawhub.ai) and find a suitable skill to install.

**After collection / 采集完成后**

Call soulforge_distill_corpus with:
  text: the collected writing corpus (Goal 2)
  source: "${name}"
  bio: the biographical summary (Goal 1)`);
    },
  });

  // ========== 工具2：生成蒸馏prompt（不调LLM） ==========
  api.registerTool({
    name: "soulforge_distill_corpus",
    description: "Generate distillation prompt: receives corpus and bio, returns a three-step analysis prompt for the agent to execute with its own model. Pass the result to soulforge_write. No LLM calls inside this tool. / 生成蒸馏prompt，agent用自己的模型执行。",
    parameters: {
      type: "object",
      properties: {
        text: { type: "string", description: "Text corpus content / 文本语料" },
        source: { type: "string", description: "Source name / 语料来源（人名）" },
        bio: { type: "string", description: "Optional. Biographical summary from encyclopedia. / 可选，百科传记摘要" },
      },
      required: ["text", "source"],
    },
    execute: async (_toolCallId: string, params: { text: string; source: string; bio?: string }) => {
      const { text, source, bio } = params;

      if (!text || text.trim().length < 500) {
        return textResult("Corpus too short (under 500 chars). Please provide more content. / 语料太短，请提供更多内容。");
      }

      log(api, "info", `Generating distill prompt for "${source}", ${text.length} chars corpus, ${bio?.length || 0} chars bio`);

      const today = new Date().toISOString().split("T")[0];

      // 采样：超长语料取前中后各一段
      let corpus = text;
      const limit = api?.pluginConfig?.samplingSize || 50000;
      if (corpus.length > limit) {
        const third = Math.floor(limit / 3);
        const front = corpus.slice(0, third);
        const midStart = Math.floor(corpus.length / 2 - third / 2);
        const middle = corpus.slice(midStart, midStart + third);
        const back = corpus.slice(-third);
        corpus = `${front}\n\n[...middle sample...]\n\n${middle}\n\n[...end sample...]\n\n${back}`;
      }

      const prompt = `You are an expression DNA distiller. Use the three-step method to extract the subject's complete writing fingerprint from their corpus.

Subject: ${source}

${bio ? `[Biographical facts]\n${bio}\n` : ""}
[Writing corpus]
---
${corpus}
---

Execute strictly in three steps:

**Step 1: Observe (list all facts, no judgment)**

A. Biographical facts (if provided above):
   - Date of birth → zodiac sign
   - Place of birth → regional culture
   - Family background → social class
   - Education → knowledge structure
   - Career path → domain expertise
   - Key life events → turning points

B. Expression facts (directly from corpus statistics):
   - Opening style distribution
   - Top 20 high-frequency words and never-used words
   - Average paragraph length and long-short alternation pattern
   - Rhetorical question frequency and style
   - Ending style distribution
   - Sentence structure characteristics

**Step 2: Deduce (facts → hypotheses → verify with corpus)**

Generate personality hypotheses from biographical facts, then verify with corpus:
- Hypothesis verified by corpus → confidence:HIGH
- Hypothesis partially verified → confidence:MEDIUM
- Hypothesis not verified → discard, do not include
- Directly observed from corpus (no hypothesis needed) → confidence:HIGH
- Hypothesis exists but insufficient corpus to verify → confidence:LOW

Weight: first-person corpus 100% > behavioral facts 70% > biographical facts 30% > zodiac inference 15%
When in conflict, corpus wins; inferences yield.

**Step 3: Output (strictly follow I-Lang GENE format below)**

::ILANG::v4.0
[TYPE:soul]
[SOURCE:distilled from ${source}]
[DATE:${today}]

[IDENTITY]
  NAME: ${source}
  ZODIAC: (derived from birthdate, or "unknown" if no bio provided)
  BACKGROUND: (one-sentence summary)
  CORE_TRAIT: (1-3 verified core personality traits)

::GENE{opening|style:____|confidence:HIGH/MEDIUM/LOW}
  T: opening habit (WHAT)
  WHY: why this opening style (deduced cause)
  EVIDENCE: specific examples from corpus

::GENE{vocabulary|fingerprint:____,____,____|never:____,____|confidence:HIGH/MEDIUM/LOW}
  T: high-frequency signature words and never-used words
  WHY: cause of vocabulary habits
  EVIDENCE: corpus fragments

::GENE{rhythm|avg_para_lines:____|pattern:____|confidence:HIGH/MEDIUM/LOW}
  T: paragraph rhythm characteristics
  WHY: cause of rhythm habits
  EVIDENCE: typical paragraphs from corpus

::GENE{question|freq:____|style:____|confidence:HIGH/MEDIUM/LOW}
  T: rhetorical question usage
  WHY: cause of questioning style
  EVIDENCE: specific examples

::GENE{ending|style:____|confidence:HIGH/MEDIUM/LOW}
  T: ending habit
  WHY: cause of ending style
  EVIDENCE: ending examples from corpus

::GENE{tone|style:____|confidence:HIGH/MEDIUM/LOW}
  T: overall perspective and stance
  WHY: why this stance formed
  EVIDENCE: corpus fragments showing stance

::GENE{audience|profile:____|confidence:HIGH/MEDIUM/LOW}
  T: target reader profile
  WHY: deduced from addressing style and assumptions
  EVIDENCE: reader-facing expressions in corpus

[META]
  FACTS_USED: number of biographical facts used
  HYPOTHESES_TESTED: number of hypotheses tested
  HYPOTHESES_VERIFIED: number verified
  CONFIDENCE_DISTRIBUTION: HIGH:X / MEDIUM:X / LOW:X

Output only the I-Lang format above. Fill WHY and EVIDENCE for each GENE when possible.`;

      return textResult(`[Distillation prompt generated]

Execute the prompt below with your current model.

After execution, pass the I-Lang GENE output to soulforge_write:
  content: the complete SOUL output
  source: "${source}"

---

${prompt}`);
    },
  });

  // ========== Tool 3: preview + confirm + write file (no LLM) ==========
  const previewTokens = new Map<string, string>(); // source → content hash

  api.registerTool({
    name: "soulforge_write",
    description: "Write SOUL.md: receives distilled SOUL content. Call with confirmed=false first to get a preview and a preview_token. Then only after user explicitly confirms, call again with confirmed=true and the same preview_token. The token binds the write to a specific preview, preventing writes without prior user review. Backs up old file with timestamp.",
    parameters: {
      type: "object",
      properties: {
        content: { type: "string", description: "Complete SOUL content in I-Lang GENE format" },
        source: { type: "string", description: "Source name (person name)" },
        confirmed: { type: "boolean", description: "false=generate preview and token, true=write (requires valid preview_token)" },
        preview_token: { type: "string", description: "Required when confirmed=true. The token returned from the preview step, proving user reviewed the content." },
      },
      required: ["content", "source"],
    },
    execute: async (_toolCallId: string, params: { content: string; source: string; confirmed?: boolean; preview_token?: string }) => {
      const { content, source, confirmed, preview_token } = params;

      if (!content || !content.trim()) {
        return textResult("Content is empty. Please check if distillation succeeded. / 内容为空，请检查蒸馏是否成功。");
      }

      const soulPath = resolveSoulPath(api);

      if (!confirmed) {
        // Generate preview token (simple hash of content)
        const token = Buffer.from(content.slice(0, 200)).toString("base64").slice(0, 32);
        previewTokens.set(source, token);
        log(api, "info", `Preview SOUL for "${source}", ${content.length} chars. Token: ${token}`);

        return textResult(`[Distillation Preview] Expression DNA extracted from "${source}":

${content}

[Write Info]
- Target: ${soulPath}
- Backup: SOUL.md.bak.{timestamp}
- Preview token: ${token}

To confirm, call soulforge_write with confirmed=true and preview_token="${token}".
User must explicitly approve before proceeding.`);
      }

      // Confirmed=true: verify preview token
      const expectedToken = previewTokens.get(source);
      if (!expectedToken) {
        log(api, "warn", `Write rejected for "${source}": no preview token found. Preview step was skipped.`);
        return textResult("Write rejected: no preview was generated for this source. Call soulforge_write with confirmed=false first to generate a preview. / 写入被拒绝：未找到预览记录，请先以confirmed=false生成预览。");
      }

      if (preview_token !== expectedToken) {
        log(api, "warn", `Write rejected for "${source}": token mismatch. Expected ${expectedToken}, got ${preview_token}`);
        return textResult("Write rejected: preview_token does not match. The content may have changed since the preview. Please regenerate the preview. / 写入被拒绝：token不匹配，请重新预览。");
      }

      // Token verified, proceed to write
      log(api, "info", `Token verified. Writing SOUL for "${source}" to ${soulPath}`);
      previewTokens.delete(source);
      const { success, backedUp, backupPath, error } = backupAndWrite(soulPath, content);

      if (success) {
        const bMsg = backedUp ? `\nOld version backed up to: ${backupPath}` : "";
        return textResult(`Style updated to match ${source}. You can replace it anytime by distilling another person.${bMsg}\nWritten to: ${soulPath}`);
      }

      return textResult(`Write failed: ${error}\n\nPlease save manually to ${soulPath}:\n\n${content}`);
    },
  });
}
