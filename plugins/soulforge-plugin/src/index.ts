/**
 * SoulForge — 灵魂打印机 v2.1
 *
 * v2.1: distill_search 真正调用搜索，自动采集+蒸馏一条龙
 *
 * © 2026 iLang Inc., Canada. MIT License.
 */

import { homedir } from "os";
import { writeFileSync, copyFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

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
  T:分析此人的开头习惯

::GENE{vocabulary|fingerprint:____,____,____|never:____,____}
  fingerprint：高频特征词/口头禅
  never：从不使用的表达

::GENE{rhythm|avg_para_lines:____|pattern:____}

::GENE{question|freq:____|style:____}

::GENE{ending|style:____}

::GENE{tone|style:____}

::GENE{audience|profile:____}

只输出I-Lang GENE格式内容。`;
}

function buildSearchPrompt(name: string): string {
  return `你的任务：为蒸馏「${name}」的写作风格采集语料。

请搜索并整理以下内容：
1. 此人的公开文章、博客、长文、著作片段（至少搜索5次不同关键词）
2. 此人的社交媒体发言、演讲金句
3. 此人的访谈、对话、问答记录

搜索策略：
- 先搜"${name} 文章"、"${name} 演讲"、"${name} 语录"
- 再搜"${name} 访谈"、"${name} 观点"
- 如果是英文人物，用英文名搜索
- 每次搜索后提取正文内容，不要只取标题

输出要求：
把所有搜索到的文本内容合并输出，越多越好，至少5000字。
只输出原文内容，不要你的分析和评论。
用"---"分隔不同来源的内容。`;
}

function resolveSoulPath(api: any): string {
  try {
    if (api?.runtime?.agent?.resolveAgentWorkspaceDir) {
      const workspaceDir = api.runtime.agent.resolveAgentWorkspaceDir(api.config);
      return join(workspaceDir, "SOUL.md");
    }
  } catch { /* fallback */ }
  const workspacePath = join(homedir(), ".openclaw", "workspace", "SOUL.md");
  if (existsSync(join(homedir(), ".openclaw", "workspace"))) {
    return workspacePath;
  }
  return join(homedir(), ".openclaw", "SOUL.md");
}

function backupAndWrite(soulPath: string, content: string): { success: boolean; backedUp: boolean; backupPath: string } {
  try {
    const dir = join(soulPath, "..");
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
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
  } catch {
    return { success: false, backedUp: false, backupPath: "" };
  }
}

function textResult(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

async function callLLM(api: any, prompt: string, useTools: boolean = false): Promise<string> {
  // 带工具调用的版本（用于搜索采集）
  if (useTools && api?.runtime?.agent?.runEmbeddedAgent) {
    try {
      const result = await api.runtime.agent.runEmbeddedAgent({
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        tools: ["webSearch", "web_search", "WebSearch"],
        maxTurns: 10,
      });
      return result?.content || result?.text || extractTextFromResult(result);
    } catch { /* fallback */ }
  }

  // 不带工具的版本（用于蒸馏分析）
  if (api?.runtime?.agent?.runEmbeddedAgent) {
    try {
      const result = await api.runtime.agent.runEmbeddedAgent({
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });
      return result?.content || result?.text || extractTextFromResult(result);
    } catch { /* fallback */ }
  }

  if (api?.llm?.complete) {
    try {
      const result = await api.llm.complete({
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });
      return result?.content || result?.text || "";
    } catch { /* fallback */ }
  }

  return "";
}

function extractTextFromResult(result: any): string {
  if (!result) return "";
  if (typeof result === "string") return result;
  if (result.content && Array.isArray(result.content)) {
    return result.content
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("\n");
  }
  return "";
}

export default function register(api: any) {
  const samplingSize = api?.pluginConfig?.samplingSize || SAMPLING_DEFAULT;

  // ========== 语料模式：用户粘贴文本 ==========
  api.registerTool({
    name: "soulforge_distill_corpus",
    description: "语料模式蒸馏：用户粘贴文本，蒸馏写作风格。展示预览，用户确认后写入SOUL.md（自动备份）。语料通过用户配置的模型提供商进行分析。",
    parameters: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "用户粘贴的文本内容。",
        },
        source: {
          type: "string",
          description: "语料来源描述（文件名或人名）",
        },
        confirmed: {
          type: "boolean",
          description: "用户是否已确认写入。首次false展示预览，确认后true执行写入。",
        },
      },
      required: ["text", "source"],
    },
    execute: async (_toolCallId: string, params: { text: string; source: string; confirmed?: boolean }) => {
      const { text, source, confirmed } = params;

      if (!text || text.trim().length < 500) {
        return textResult("语料太短（不足500字），无法蒸馏出可靠的写作风格。请提供更多内容。");
      }

      const cacheKey = `corpus_${source}`;

      if (!confirmed) {
        const sampled = sampleCorpus(text, samplingSize);
        const prompt = buildDistillPrompt(sampled, source);
        const soulContent = await callLLM(api, prompt);

        if (!soulContent.includes("::ILANG::v4.0")) {
          return textResult("蒸馏失败：输出格式不符合预期。请重试。");
        }

        previewCache.set(cacheKey, soulContent);
        const soulPath = resolveSoulPath(api);

        return textResult(`【数据说明】语料将通过你配置的中转站发送给AI模型分析。处理方式取决于模型提供商的隐私政策。

【蒸馏预览】从「${source}」提取的写作风格：

${soulContent}

【写入信息】
• 目标路径：${soulPath}
• 备份策略：SOUL.md.bak.{时间戳}

确认使用这个风格吗？回复"确认"执行写入。`);
      }

      const cachedContent = previewCache.get(cacheKey);
      if (!cachedContent) {
        return textResult("未找到预览内容，请重新运行蒸馏。");
      }

      const soulPath = resolveSoulPath(api);
      const { success, backedUp, backupPath } = backupAndWrite(soulPath, cachedContent);
      previewCache.delete(cacheKey);

      if (success) {
        const backupMsg = backedUp ? `\n旧版本已备份为：${backupPath}` : "";
        return textResult(`你的写作风格已经跟${source}一致，随时可以再次替换为其他风格。${backupMsg}\n\n写入路径：${soulPath}`);
      } else {
        return textResult(`写入SOUL.md失败。以下是人设卡，请手动保存到 ${soulPath}：\n\n${cachedContent}`);
      }
    },
  });

  // ========== 搜索模式：输入人名，自动采集+蒸馏 ==========
  api.registerTool({
    name: "soulforge_distill_search",
    description: "搜索模式蒸馏：输入人名，自动搜索采集此人的公开文章和发言，然后蒸馏写作风格。展示预览，用户确认后写入SOUL.md。",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "要蒸馏的人物名称",
        },
        confirmed: {
          type: "boolean",
          description: "用户是否已确认写入。首次false执行搜索+蒸馏+预览，确认后true执行写入。",
        },
      },
      required: ["name"],
    },
    execute: async (_toolCallId: string, params: { name: string; confirmed?: boolean }) => {
      const { name, confirmed } = params;
      const cacheKey = `search_${name}`;

      if (!confirmed) {
        // 第一阶段：搜索采集
        const searchPrompt = buildSearchPrompt(name);
        const corpus = await callLLM(api, searchPrompt, true);

        if (!corpus || corpus.trim().length < 500) {
          return textResult(`搜索「${name}」的公开资料不足（不到500字）。

可能的原因：
• 此人公开文章较少
• 搜索工具未返回足够内容
• 人名拼写有误

建议：手动收集此人的文章/语录，然后用 soulforge_distill_corpus 蒸馏。`);
        }

        // 第二阶段：蒸馏
        const sampled = sampleCorpus(corpus, samplingSize);
        const distillPrompt = buildDistillPrompt(sampled, name);
        const soulContent = await callLLM(api, distillPrompt);

        if (!soulContent.includes("::ILANG::v4.0")) {
          return textResult(`搜索到了「${name}」的语料（${corpus.length}字），但蒸馏失败。请重试。`);
        }

        previewCache.set(cacheKey, soulContent);
        const soulPath = resolveSoulPath(api);

        return textResult(`【数据说明】已通过搜索采集「${name}」的公开文章和发言（${corpus.length}字），并通过你配置的模型进行风格分析。

【蒸馏预览】从「${name}」公开资料提取的写作风格：

${soulContent}

【写入信息】
• 目标路径：${soulPath}
• 备份策略：SOUL.md.bak.{时间戳}

确认使用这个风格吗？回复"确认"执行写入。`);
      }

      // 确认写入
      const cachedContent = previewCache.get(cacheKey);
      if (!cachedContent) {
        return textResult("未找到预览内容，请重新运行蒸馏。");
      }

      const soulPath = resolveSoulPath(api);
      const { success, backedUp, backupPath } = backupAndWrite(soulPath, cachedContent);
      previewCache.delete(cacheKey);

      if (success) {
        const backupMsg = backedUp ? `\n旧版本已备份为：${backupPath}` : "";
        return textResult(`你的写作风格已经跟${name}一致，随时可以再次替换为其他风格。${backupMsg}\n\n写入路径：${soulPath}`);
      } else {
        return textResult(`写入SOUL.md失败。以下是人设卡，请手动保存到 ${soulPath}：\n\n${cachedContent}`);
      }
    },
  });
}
