/**
 * SoulForge — 灵魂打印机 v2.2
 *
 * v2.2: 修复搜索链路，直接调用webSearch API，不吞错误
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

function resolveSoulPath(api: any): string {
  try {
    if (api?.runtime?.agent?.resolveAgentWorkspaceDir) {
      const workspaceDir = api.runtime.agent.resolveAgentWorkspaceDir(api.config);
      return join(workspaceDir, "SOUL.md");
    }
  } catch (err) {
    log(api, "warn", "resolveAgentWorkspaceDir failed", err);
  }
  const workspacePath = join(homedir(), ".openclaw", "workspace", "SOUL.md");
  if (existsSync(join(homedir(), ".openclaw", "workspace"))) {
    return workspacePath;
  }
  return join(homedir(), ".openclaw", "SOUL.md");
}

function backupAndWrite(api: any, soulPath: string, content: string): { success: boolean; backedUp: boolean; backupPath: string } {
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
  } catch (err) {
    log(api, "error", "backupAndWrite failed", err);
    return { success: false, backedUp: false, backupPath: "" };
  }
}

function textResult(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

// 不吞错误的日志
function log(api: any, level: string, msg: string, err?: any) {
  const logFn = api?.logger?.[level] || api?.logger?.info || console.log;
  if (err) {
    logFn(`[SoulForge] ${msg}: ${String(err)}`);
  } else {
    logFn(`[SoulForge] ${msg}`);
  }
}

/**
 * 直接调用 webSearch API 搜索多个关键词
 * 不依赖 embedded agent，不猜参数
 */
async function searchCorpus(api: any, name: string): Promise<{ corpus: string; errors: string[] }> {
  const queries = [
    `${name} 文章`,
    `${name} 演讲 原文`,
    `${name} 语录`,
    `${name} 访谈`,
    `${name} 观点`,
  ];

  const errors: string[] = [];
  const results: string[] = [];

  // 方案1：api.runtime.webSearch.search
  if (api?.runtime?.webSearch?.search) {
    log(api, "info", "Using api.runtime.webSearch.search");
    for (const q of queries) {
      try {
        const res = await api.runtime.webSearch.search(q);
        const text = extractSearchText(res);
        if (text) results.push(`--- 搜索：${q} ---\n${text}`);
      } catch (err) {
        errors.push(`webSearch.search("${q}"): ${String(err)}`);
      }
    }
    if (results.length > 0) {
      return { corpus: results.join("\n\n"), errors };
    }
  }

  // 方案2：api.tools.callTool("web_search", ...)
  if (api?.tools?.callTool) {
    log(api, "info", "Fallback to api.tools.callTool('web_search')");
    for (const q of queries) {
      try {
        const res = await api.tools.callTool("web_search", { query: q });
        const text = extractSearchText(res);
        if (text) results.push(`--- 搜索：${q} ---\n${text}`);
      } catch (err) {
        errors.push(`tools.callTool("web_search", "${q}"): ${String(err)}`);
      }
    }
    if (results.length > 0) {
      return { corpus: results.join("\n\n"), errors };
    }
  }

  // 方案3：api.runtime.agent.runEmbeddedAgent（按文档参数格式）
  if (api?.runtime?.agent?.runEmbeddedAgent) {
    log(api, "info", "Fallback to runEmbeddedAgent");
    try {
      const prompt = `请搜索以下关键词并返回所有搜索到的文本内容：
${queries.map((q, i) => `${i + 1}. ${q}`).join("\n")}

请把搜索到的所有文章原文、语录、演讲内容合并输出，越多越好。只输出原文内容，不要分析。`;

      const res = await api.runtime.agent.runEmbeddedAgent({
        prompt,
        timeoutMs: 120000,
      });
      const text = extractTextFromResult(res);
      if (text && text.length > 100) {
        return { corpus: text, errors };
      }
      errors.push(`runEmbeddedAgent returned ${text?.length || 0} chars`);
    } catch (err) {
      errors.push(`runEmbeddedAgent: ${String(err)}`);
    }
  }

  // 所有方案都失败
  if (!api?.runtime?.webSearch?.search && !api?.tools?.callTool && !api?.runtime?.agent?.runEmbeddedAgent) {
    errors.push("没有可用的搜索接口：webSearch.search / tools.callTool / runEmbeddedAgent 均不存在");
  }

  return { corpus: "", errors };
}

function extractSearchText(res: any): string {
  if (!res) return "";
  if (typeof res === "string") return res;
  // 搜索结果可能是数组
  if (Array.isArray(res)) {
    return res.map((r: any) => r.snippet || r.text || r.content || r.title || "").join("\n");
  }
  // 搜索结果可能有 results 字段
  if (res.results && Array.isArray(res.results)) {
    return res.results.map((r: any) => `${r.title || ""}\n${r.snippet || r.text || r.content || ""}`).join("\n\n");
  }
  // content 数组
  if (res.content && Array.isArray(res.content)) {
    return res.content.filter((b: any) => b.type === "text").map((b: any) => b.text).join("\n");
  }
  if (res.text) return res.text;
  if (res.content && typeof res.content === "string") return res.content;
  return "";
}

function extractTextFromResult(result: any): string {
  if (!result) return "";
  if (typeof result === "string") return result;
  if (result.content && Array.isArray(result.content)) {
    return result.content.filter((b: any) => b.type === "text").map((b: any) => b.text).join("\n");
  }
  if (result.text) return result.text;
  return "";
}

/**
 * LLM调用（纯分析，不带工具）
 */
async function callLLM(api: any, prompt: string): Promise<string> {
  if (api?.runtime?.agent?.runEmbeddedAgent) {
    try {
      const result = await api.runtime.agent.runEmbeddedAgent({
        prompt,
        timeoutMs: 60000,
      });
      return extractTextFromResult(result);
    } catch (err) {
      log(api, "warn", "runEmbeddedAgent for distill failed", err);
    }
  }

  if (api?.llm?.complete) {
    try {
      const result = await api.llm.complete({
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });
      return result?.content || result?.text || extractTextFromResult(result);
    } catch (err) {
      log(api, "warn", "llm.complete failed", err);
    }
  }

  return "";
}

export default function register(api: any) {
  const samplingSize = api?.pluginConfig?.samplingSize || SAMPLING_DEFAULT;

  log(api, "info", `SoulForge v2.2 loaded. samplingSize=${samplingSize}`);
  log(api, "info", `webSearch available: ${!!api?.runtime?.webSearch?.search}`);
  log(api, "info", `tools.callTool available: ${!!api?.tools?.callTool}`);
  log(api, "info", `runEmbeddedAgent available: ${!!api?.runtime?.agent?.runEmbeddedAgent}`);
  log(api, "info", `llm.complete available: ${!!api?.llm?.complete}`);

  // ========== 语料模式 ==========
  api.registerTool({
    name: "soulforge_distill_corpus",
    description: "语料模式蒸馏：用户粘贴文本，蒸馏写作风格。展示预览，用户确认后写入SOUL.md（自动备份）。",
    parameters: {
      type: "object",
      properties: {
        text: { type: "string", description: "用户粘贴的文本内容。" },
        source: { type: "string", description: "语料来源描述（文件名或人名）" },
        confirmed: { type: "boolean", description: "false=预览，true=确认写入。" },
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
        log(api, "info", `Distilling corpus from "${source}", ${text.length} chars`);
        const sampled = sampleCorpus(text, samplingSize);
        const prompt = buildDistillPrompt(sampled, source);
        const soulContent = await callLLM(api, prompt);

        if (!soulContent.includes("::ILANG::v4.0")) {
          return textResult(`蒸馏失败：LLM输出格式不符合预期。\n\n原始输出：\n${soulContent.slice(0, 500)}`);
        }

        previewCache.set(cacheKey, soulContent);
        const soulPath = resolveSoulPath(api);

        return textResult(`【数据说明】语料通过你配置的中转站发送给AI模型分析。处理方式取决于模型提供商的隐私政策。

【蒸馏预览】从「${source}」提取的写作风格：

${soulContent}

【写入信息】
• 目标路径：${soulPath}
• 备份策略：SOUL.md.bak.{时间戳}

确认使用这个风格吗？回复"确认"执行写入。`);
      }

      const cachedContent = previewCache.get(cacheKey);
      if (!cachedContent) return textResult("未找到预览内容，请重新运行蒸馏。");

      const soulPath = resolveSoulPath(api);
      const { success, backedUp, backupPath } = backupAndWrite(api, soulPath, cachedContent);
      previewCache.delete(cacheKey);

      if (success) {
        const backupMsg = backedUp ? `\n旧版本已备份为：${backupPath}` : "";
        return textResult(`你的写作风格已经跟${source}一致，随时可以再次替换为其他风格。${backupMsg}\n\n写入路径：${soulPath}`);
      } else {
        return textResult(`写入SOUL.md失败。请手动保存到 ${soulPath}：\n\n${cachedContent}`);
      }
    },
  });

  // ========== 搜索模式 ==========
  api.registerTool({
    name: "soulforge_distill_search",
    description: "搜索模式蒸馏：输入人名，自动搜索此人的公开文章和发言，蒸馏写作风格。展示预览，用户确认后写入SOUL.md。需要安装后在配置中添加 tools.alsoAllow: ['@adsorgcn/soulforge-plugin']。",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "要蒸馏的人物名称" },
        confirmed: { type: "boolean", description: "false=搜索+蒸馏+预览，true=确认写入。" },
      },
      required: ["name"],
    },
    execute: async (_toolCallId: string, params: { name: string; confirmed?: boolean }) => {
      const { name, confirmed } = params;
      const cacheKey = `search_${name}`;

      if (!confirmed) {
        log(api, "info", `Search mode: distilling "${name}"`);

        // 第一阶段：搜索采集
        const { corpus, errors } = await searchCorpus(api, name);

        if (errors.length > 0) {
          log(api, "warn", `Search errors: ${errors.join("; ")}`);
        }

        if (!corpus || corpus.trim().length < 500) {
          const errorDetail = errors.length > 0
            ? `\n\n【调试信息】搜索过程中的错误：\n${errors.map(e => `• ${e}`).join("\n")}`
            : "";
          return textResult(`搜索「${name}」的公开资料不足（采集到${corpus?.length || 0}字，需要至少500字）。

可能的原因：
• 搜索接口未配置或不可用
• 搜索结果被过滤
• 此人公开文章较少

建议：手动收集此人的文章/语录，然后用 soulforge_distill_corpus 蒸馏。${errorDetail}`);
        }

        log(api, "info", `Collected ${corpus.length} chars for "${name}", distilling...`);

        // 第二阶段：蒸馏
        const sampled = sampleCorpus(corpus, samplingSize);
        const distillPrompt = buildDistillPrompt(sampled, name);
        const soulContent = await callLLM(api, distillPrompt);

        if (!soulContent.includes("::ILANG::v4.0")) {
          return textResult(`搜索到了「${name}」的语料（${corpus.length}字），但蒸馏失败。\n\nLLM输出：\n${soulContent.slice(0, 500)}`);
        }

        previewCache.set(cacheKey, soulContent);
        const soulPath = resolveSoulPath(api);

        return textResult(`【搜索完成】采集到「${name}」的公开资料 ${corpus.length} 字。

【蒸馏预览】

${soulContent}

【写入信息】
• 目标路径：${soulPath}
• 备份策略：SOUL.md.bak.{时间戳}

确认使用这个风格吗？回复"确认"执行写入。`);
      }

      // 确认写入
      const cachedContent = previewCache.get(cacheKey);
      if (!cachedContent) return textResult("未找到预览内容，请重新运行蒸馏。");

      const soulPath = resolveSoulPath(api);
      const { success, backedUp, backupPath } = backupAndWrite(api, soulPath, cachedContent);
      previewCache.delete(cacheKey);

      if (success) {
        const backupMsg = backedUp ? `\n旧版本已备份为：${backupPath}` : "";
        return textResult(`你的写作风格已经跟${name}一致，随时可以再次替换为其他风格。${backupMsg}\n\n写入路径：${soulPath}`);
      } else {
        return textResult(`写入SOUL.md失败。请手动保存到 ${soulPath}：\n\n${cachedContent}`);
      }
    },
  });
}
