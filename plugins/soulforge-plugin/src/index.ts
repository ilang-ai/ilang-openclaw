/**
 * SoulForge — 灵魂打印机 v2.4
 *
 * v2.4: 修 runEmbeddedAgent 完整参数签名（龙虾工厂实测反馈）
 *
 * © 2026 iLang Inc., Canada. MIT License.
 */

import { randomUUID } from "crypto";
import { homedir } from "os";
import { writeFileSync, copyFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";

const SAMPLING_DEFAULT = 50000;
const previewCache = new Map<string, string>();

function sampleCorpus(text: string, limit: number): string {
  if (text.length <= limit) return text;
  const third = Math.floor(limit / 3);
  const front = text.slice(0, third);
  const midStart = Math.floor(text.length / 2 - third / 2);
  const middle = text.slice(midStart, midStart + third);
  const back = text.slice(-third);
  return `${front}\n\n[...中段采样...]\n\n${middle}\n\n[...后段采样...]\n\n${back}`;
}

function buildDistillPrompt(corpus: string, source: string): string {
  const today = new Date().toISOString().split("T")[0];
  return `你是一台表达指纹蒸馏机。以下是来自"${source}"的写作语料。
请分析这些文字，提取7个维度的写作特征。

语料：
---
${corpus}
---

请严格按以下I-Lang GENE格式输出，不要输出任何其他内容：

::ILANG::v4.0
[TYPE:soul]
[SOURCE:蒸馏自${source}]
[DATE:${today}]

::GENE{opening|style:____}
  T:此人的开头习惯

::GENE{vocabulary|fingerprint:____,____,____|never:____,____}

::GENE{rhythm|avg_para_lines:____|pattern:____}

::GENE{question|freq:____|style:____}

::GENE{ending|style:____}

::GENE{tone|style:____}

::GENE{audience|profile:____}

只输出I-Lang GENE格式内容。`;
}

function resolveSoulPath(api: any): string {
  try {
    if (api?.runtime?.agent?.resolveAgentWorkspaceDir) {
      return join(api.runtime.agent.resolveAgentWorkspaceDir(api.config), "SOUL.md");
    }
  } catch (err) {
    log(api, "warn", "resolveAgentWorkspaceDir failed", err);
  }
  const wsPath = join(homedir(), ".openclaw", "workspace", "SOUL.md");
  if (existsSync(join(homedir(), ".openclaw", "workspace"))) return wsPath;
  return join(homedir(), ".openclaw", "SOUL.md");
}

function backupAndWrite(api: any, soulPath: string, content: string): { success: boolean; backedUp: boolean; backupPath: string } {
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
    return { success: true, backedUp, backupPath };
  } catch (err) {
    log(api, "error", "backupAndWrite failed", err);
    return { success: false, backedUp: false, backupPath: "" };
  }
}

function textResult(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

function log(api: any, level: string, msg: string, err?: any) {
  const fn = api?.logger?.[level] || api?.logger?.info || console.log;
  fn(err ? `[SoulForge] ${msg}: ${String(err)}` : `[SoulForge] ${msg}`);
}

/**
 * LLM调用 — 继承当前agent的provider和model
 */
async function callLLM(api: any, prompt: string): Promise<string> {
  // 方案1: runEmbeddedAgent（继承当前agent的模型配置）
  if (api?.runtime?.agent?.runEmbeddedAgent) {
    try {
      const cfg = api.config;
      const runId = randomUUID();
      const agentDir = api.runtime.agent.resolveAgentDir
        ? api.runtime.agent.resolveAgentDir(cfg)
        : join(homedir(), ".openclaw");
      const workspaceDir = api.runtime.agent.resolveAgentWorkspaceDir
        ? api.runtime.agent.resolveAgentWorkspaceDir(cfg)
        : join(homedir(), ".openclaw", "workspace");
      const timeoutMs = api.runtime.agent.resolveAgentTimeoutMs
        ? api.runtime.agent.resolveAgentTimeoutMs(cfg)
        : 120000;

      const sessionsDir = join(agentDir, "sessions");
      if (!existsSync(sessionsDir)) mkdirSync(sessionsDir, { recursive: true });

      // 继承当前agent的默认模型，不让它fallback到openai
      const defaultModel =
        api?.runtime?.agent?.defaults?.model ||
        cfg?.agents?.defaults?.model ||
        cfg?.models?.default ||
        undefined;

      const embeddedParams: any = {
        sessionId: `soulforge:${runId}`,
        runId,
        sessionFile: join(sessionsDir, `soulforge-${runId}.jsonl`),
        workspaceDir,
        prompt,
        timeoutMs,
      };

      // 尝试传model参数（具体字段名取决于SDK版本）
      if (defaultModel) {
        embeddedParams.model = defaultModel;
        // 如果model格式是 "provider/model"，也拆开传
        if (typeof defaultModel === "string" && defaultModel.includes("/")) {
          const [provider, model] = defaultModel.split("/", 2);
          embeddedParams.provider = provider;
          embeddedParams.model = model;
        }
        log(api, "info", `Using model: ${defaultModel}`);
      } else {
        log(api, "warn", "No default model found in agent config, runEmbeddedAgent may use wrong provider");
      }

      const res = await api.runtime.agent.runEmbeddedAgent(embeddedParams);
      const text = extractText(res);
      log(api, "info", `runEmbeddedAgent returned ${text.length} chars`);
      return text;
    } catch (err) {
      log(api, "error", "runEmbeddedAgent failed", err);
    }
  }

  // 方案2: api.llm.complete fallback
  if (api?.llm?.complete) {
    try {
      const res = await api.llm.complete({
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });
      const text = res?.content || res?.text || extractText(res);
      log(api, "info", `llm.complete returned ${text.length} chars`);
      return text;
    } catch (err) {
      log(api, "error", "llm.complete failed", err);
    }
  }

  log(api, "error", "No LLM interface available");
  return "";
}

function extractText(r: any): string {
  if (!r) return "";
  if (typeof r === "string") return r;
  if (r.content && Array.isArray(r.content)) return r.content.filter((b: any) => b.type === "text").map((b: any) => b.text).join("\n");
  return r.text || "";
}

export default function register(api: any) {
  const samplingSize = api?.pluginConfig?.samplingSize || SAMPLING_DEFAULT;

  log(api, "info", `SoulForge loaded. samplingSize=${samplingSize}`);
  log(api, "info", `runEmbeddedAgent: ${!!api?.runtime?.agent?.runEmbeddedAgent}`);
  log(api, "info", `resolveAgentDir: ${!!api?.runtime?.agent?.resolveAgentDir}`);
  log(api, "info", `llm.complete: ${!!api?.llm?.complete}`);

  // ========== 语料模式 ==========
  api.registerTool({
    name: "soulforge_distill_corpus",
    description: "蒸馏写作风格：接收文本语料，提取表达指纹，展示预览，用户确认后写入SOUL.md。",
    parameters: {
      type: "object",
      properties: {
        text: { type: "string", description: "文本语料内容" },
        source: { type: "string", description: "语料来源（文件名或人名）" },
        confirmed: { type: "boolean", description: "false=预览，true=确认写入" },
      },
      required: ["text", "source"],
    },
    execute: async (_toolCallId: string, params: { text: string; source: string; confirmed?: boolean }) => {
      const { text, source, confirmed } = params;

      if (!text || text.trim().length < 500) {
        return textResult("语料太短（不足500字），请提供更多内容。");
      }

      const cacheKey = `corpus_${source}`;

      if (!confirmed) {
        log(api, "info", `Distilling "${source}", ${text.length} chars`);
        const sampled = sampleCorpus(text, samplingSize);
        const soulContent = await callLLM(api, buildDistillPrompt(sampled, source));

        // P1: 区分空输出和格式错
        if (!soulContent.trim()) {
          return textResult("蒸馏失败：LLM没有返回内容。请查看插件日志（搜索 [SoulForge]）确认 runEmbeddedAgent 或 llm.complete 是否可用。");
        }

        if (!soulContent.includes("::ILANG::v4.0")) {
          return textResult(`蒸馏失败：LLM输出格式不符合预期。\n\n原始输出前500字：\n${soulContent.slice(0, 500)}`);
        }

        previewCache.set(cacheKey, soulContent);
        const soulPath = resolveSoulPath(api);

        return textResult(`【数据说明】语料通过你配置的中转站发送给AI模型分析。

【蒸馏预览】从「${source}」提取的写作风格：

${soulContent}

【写入信息】
• 目标：${soulPath}
• 备份：SOUL.md.bak.{时间戳}

确认？回复"确认"写入。`);
      }

      const cached = previewCache.get(cacheKey);
      if (!cached) return textResult("未找到预览内容，请重新蒸馏。");

      const soulPath = resolveSoulPath(api);
      const { success, backedUp, backupPath } = backupAndWrite(api, soulPath, cached);
      previewCache.delete(cacheKey);

      if (success) {
        const bMsg = backedUp ? `\n旧版本备份：${backupPath}` : "";
        return textResult(`你的写作风格已经跟${source}一致，随时可以再次替换为其他风格。${bMsg}\n写入：${soulPath}`);
      }
      return textResult(`写入失败。请手动保存到 ${soulPath}：\n\n${cached}`);
    },
  });

  // ========== 搜索模式：返回结构化任务让agent搜 ==========
  api.registerTool({
    name: "soulforge_distill_search",
    description: "搜索蒸馏模式：输入人名，返回结构化搜索任务。你（agent）执行搜索采集后，把结果传给 soulforge_distill_corpus 完成蒸馏。",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "要蒸馏的人物名称" },
      },
      required: ["name"],
    },
    execute: async (_toolCallId: string, params: { name: string }) => {
      const { name } = params;
      log(api, "info", `Search mode initiated for "${name}"`);

      return textResult(`【SoulForge 搜索蒸馏任务】

目标人物：${name}

请你（agent）按以下顺序采集此人的写作语料：

**第一优先级：百科类（信息最集中）**
第1轮搜索：「${name} 维基百科」—— 用WebFetch读取完整词条
第2轮搜索：「${name} 百度百科」—— 用WebFetch读取完整词条
这两篇通常就能拿到生平、著作列表、核心观点、代表性语录。

**第二优先级：一手语料**
第3轮搜索：「${name} 原文 全文」—— 此人写的文章、书籍片段、演讲原文
第4轮搜索：「${name} 语录 名言」—— 高频表达、口头禅、金句
第5轮搜索：「${name} 访谈 对话」—— 问答、即兴回应

每轮搜索后，用WebFetch读取搜索结果中的文章全文，不要只取标题和摘要。

信息源排除：不使用知乎。百度百科可以用（事实性信息），但不用知乎（二手洗稿多）。

采集完成后，调用 soulforge_distill_corpus：
  text: 全部文本（用---分隔不同来源）
  source: "${name}"
  confirmed: false

目标：至少5000字语料。百科词条通常就有3000-5000字，再加上原文语料就够了。`);
    },
  });
}
