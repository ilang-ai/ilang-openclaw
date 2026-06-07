/**
 * SoulForge — 灵魂打印机
 *
 * 两个按钮：
 *   distill_search  — 输入人名 → 搜索采集 → 蒸馏 → 写soul.md
 *   distill_corpus  — 读Drive文件或粘贴文本 → 蒸馏 → 写soul.md
 *
 * 蒸馏7个维度：开头习惯、用词指纹、段落节奏、反问频率、
 *              结尾套路、视角立场、读者画像
 *
 * 输出：I-Lang GENE格式的soul.md，自动写入 ~/.openclaw/soul.md
 *
 * © 2026 iLang Inc., Canada. MIT License.
 */

import { homedir } from "os";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const SOUL_PATH = join(homedir(), ".openclaw", "soul.md");
const SAMPLING_LIMIT = 50000;

/**
 * 采样策略：前中后各取一段，总量控制在上限内
 */
function sampleCorpus(text: string, limit: number = SAMPLING_LIMIT): string {
  if (text.length <= limit) return text;

  const third = Math.floor(limit / 3);
  const front = text.slice(0, third);
  const midStart = Math.floor(text.length / 2 - third / 2);
  const middle = text.slice(midStart, midStart + third);
  const back = text.slice(-third);

  return `${front}\n\n[...采样中段...]\n\n${middle}\n\n[...采样后段...]\n\n${back}`;
}

/**
 * 构建蒸馏prompt，让LLM从语料中提取7个维度
 */
function buildDistillPrompt(corpus: string, source: string): string {
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
[DATE:${new Date().toISOString().split("T")[0]}]

::GENE{opening|style:____}
  分析此人的开头习惯：先上数字？先讲故事？先抛问题？先亮观点？
  用1-2个关键词概括，写在style值里。
  T:用具体描述补充，如"前3句必有数字"或"以个人经历切入"

::GENE{vocabulary|fingerprint:____,____,____|never:____,____}
  fingerprint：此人最高频的10个特征词/口头禅（不含常见虚词）
  never：此人从不使用的表达（如从不用"值得注意的是"）

::GENE{rhythm|avg_para_lines:____|pattern:____}
  avg_para_lines：平均每段多少行（数字）
  pattern：长短段交替模式，如"短-短-长-短"或"均匀短段"

::GENE{question|freq:____|style:____}
  freq：每千字大约多少个反问句（数字）
  style：反问风格，如"犀利质问"或"引导思考"或"修辞加强"

::GENE{ending|style:____}
  此人的结尾套路：回扣标题？开放式？金句收？反问收？直接停？

::GENE{tone|style:____}
  整体视角立场：犀利/温和/调侃/理性/务实/煽动/冷静 等

::GENE{audience|profile:____}
  从称呼、假设、用语推断的目标读者画像，如"技术开发者"或"新手小白"或"创业者"

只输出上面的I-Lang GENE格式内容。不要解释，不要加前言后语。`;
}

/**
 * 写入soul.md
 */
function writeSoulFile(content: string): boolean {
  try {
    const dir = join(homedir(), ".openclaw");
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(SOUL_PATH, content, "utf-8");
    return true;
  } catch {
    return false;
  }
}

export default function register(api: any) {
  // Tool: 语料模式蒸馏
  api.registerTool("distill_corpus", {
    description: "语料模式：从Drive读文件或用户粘贴文本，蒸馏写作风格，自动写入soul.md",
    parameters: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "用户粘贴的文本内容。如果用户提到Drive文件，先用Drive工具读取内容再传入此参数。",
        },
        source: {
          type: "string",
          description: "语料来源描述（文件名或人名）",
        },
      },
      required: ["text", "source"],
    },
    execute: async (params: { text: string; source: string }) => {
      const { text, source } = params;

      if (!text || text.trim().length < 500) {
        return "语料太短（不足500字），无法蒸馏出可靠的写作风格。请提供更多内容。";
      }

      // 采样
      const sampled = sampleCorpus(text);

      // 构建蒸馏prompt
      const prompt = buildDistillPrompt(sampled, source);

      // 调用LLM蒸馏
      try {
        const result = await api.llm.complete({
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        });

        const soulContent = result?.content || result?.text || "";

        if (!soulContent.includes("::ILANG::v4.0")) {
          return "蒸馏失败：输出格式不符合预期。请重试。";
        }

        // 写入soul.md
        const success = writeSoulFile(soulContent);

        if (success) {
          return `你的写作风格已经跟${source}一致，随时可以再次替换为其他风格。`;
        } else {
          return `蒸馏完成，但写入soul.md失败。以下是你的IP人设卡，请手动保存：\n\n${soulContent}`;
        }
      } catch (err) {
        return `蒸馏过程出错：${err}。请重试。`;
      }
    },
  });

  // Tool: 搜索模式蒸馏
  api.registerTool("distill_search", {
    description: "搜索模式：输入人名，用已安装的搜索skill采集资料后蒸馏写作风格，自动写入soul.md",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "要蒸馏的人物名称",
        },
      },
      required: ["name"],
    },
    execute: async (params: { name: string }) => {
      const { name } = params;

      return `准备蒸馏「${name}」的写作风格。

请先用搜索工具采集以下内容：
1. 此人的公开文章、博客、长文（至少10篇）
2. 此人的社交媒体发言（微博/X/即刻等）
3. 此人的演讲或访谈文字稿（如有）

采集完成后，把所有文本内容汇总，然后调用 distill_corpus 工具进行蒸馏。

提示：
- 如果你安装了 web-article-reader、agent-reach 等搜索类skill，可以直接使用
- 如果没有搜索类skill，请先安装一个（推荐 agent-reach）
- 采集的内容越多越好，至少需要5000字以上才能蒸馏出可靠的风格`;
    },
  });
}
